import chokidar from "chokidar";
import path from "path";
import { logger } from "./logging";
import { PurchaseRequestService } from "../service/purchase-request-service";
import { PurchaseOrderService } from "../service/purchase-order-service";
import { ReceivingReportService } from "../service/receiving-report-service";
import { ProcessedFileService } from "../service/processed-file-service";
import { KanbanService } from "../service/kanban-service";
import { JsService } from "../service/js-service";
import { SHARED_FOLDER_PATH } from "./config";
import { prismaClient } from "./database";
import fileQueue from "./file-queue";
import { PurchaseRequestOtherDepartmentService } from "../service/purchase-request-other-department-service";
import { sendNotification } from "../application/websocket";

const purchaseRequestFolderPath = path.join(
  SHARED_FOLDER_PATH,
  "purchase-request",
);
const purchaseRequestOtherDepartmentFolderPath = path.join(
  SHARED_FOLDER_PATH,
  "purchase-request-other-department",
);
const purchaseOrderFolderPath = path.join(SHARED_FOLDER_PATH, "purchase-order");
const receivingReportFolderPath = path.join(
  SHARED_FOLDER_PATH,
  "receiving-report",
);
const jsFolderPath = path.join(SHARED_FOLDER_PATH, "js-ending-quantity");
const kanbanMasterFolderPath = path.join(SHARED_FOLDER_PATH, "kanban-master");

const startWatcher = () => {
  logger.info("🟢 Starting watcher..." + SHARED_FOLDER_PATH);
  const watcher = chokidar.watch(
    [
      purchaseRequestFolderPath,
      purchaseOrderFolderPath,
      receivingReportFolderPath,
      jsFolderPath,
      kanbanMasterFolderPath,
      purchaseRequestOtherDepartmentFolderPath,
    ],
    {
      persistent: true,
      ignoreInitial: true,
      usePolling: true,
      ignored: /(^|[\/\\])~\$/,
      awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100,
      },
      ignorePermissionErrors: true,
    },
  );

  (watcher as any)
    .on("add", (filePath: string) => {
      fileQueue.add(async () => {
        const normalizedPath = path.normalize(filePath);
        const ext = path.extname(normalizedPath).toLowerCase();

        const allowedExts = [".xlsx", ".xls", ".xlsb", ".xlsm", ".csv", ".ods"];
        if (!allowedExts.includes(ext)) return;

        const fileName = path.basename(normalizedPath, ext);
        logger.info(`🟢 File added: ${normalizedPath}`);

        const fileTypes = [
          {
            type: "PO",
            folderPath: purchaseOrderFolderPath,
            regex: /^PO_\d{2}\d{2}\d{4}_(?:[1-9]|[1-9]\d{1,2}|1000)$/,
            service: PurchaseOrderService,
          },
          {
            type: "PR",
            folderPath: purchaseRequestFolderPath,
            regex: /^PR_\d{2}\d{2}\d{4}_(?:[1-9]|[1-9]\d{1,2}|1000)$/,
            service: PurchaseRequestService,
          },
          {
            type: "PR_OD",
            folderPath: purchaseRequestOtherDepartmentFolderPath,
            regex: /^PR_OD_\d{2}\d{2}\d{4}_(?:[1-9]|[1-9]\d{1,2}|1000)$/,
            service: PurchaseRequestOtherDepartmentService,
          },
          {
            type: "RR",
            folderPath: receivingReportFolderPath,
            regex: /^RR_\d{2}\d{2}\d{4}_(?:[1-9]|[1-9]\d{1,2}|1000)$/,
            service: ReceivingReportService,
          },
          {
            type: "JS",
            folderPath: jsFolderPath,
            regex: /^JS_\d{2}\d{2}\d{4}_(?:[1-9]|[1-9]\d{1,2}|1000)$/,
            service: JsService,
          },
          {
            type: "KM",
            folderPath: kanbanMasterFolderPath,
            regex: /^KM_\d{2}\d{2}\d{4}_(?:[1-9]|[1-9]\d{1,2}|1000)$/,
            service: KanbanService,
          },
        ];

        const matched = fileTypes.find(({ folderPath }) => {
          const dirPath = path.dirname(normalizedPath);
          return dirPath === folderPath;
        });

        if (!matched) {
          logger.warn(`⚠️ File ${fileName} not in PO/PR/PR_OD/RR/JS/KM folder`);
          sendNotification(
            `⚠️ File ${fileName} not in PO/PR/PR_OD/RR/JS/KM folder`,
          );
          return;
        }

        const { type, regex, service } = matched;
        if (!regex.test(fileName)) {
          logger.warn(`⚠️ File name ${type} does not match: ${fileName}`);
          sendNotification(`⚠️ File name ${type} does not match: ${fileName}`);
          return;
        }

        try {
          const alreadyExist = await ProcessedFileService.isAlreadyExist(
            fileName,
            type,
          );
          if (alreadyExist) {
            logger.warn(
              `⚠️ File ${fileName} with type ${type} already processed`,
            );
            sendNotification(
              `⚠️ File ${fileName} with type ${type} already processed`,
            );
            return;
          }

          await prismaClient.$transaction(
            async (tx) => {
              await service.create(normalizedPath);
              await tx.processedFile.create({
                data: { file_name: fileName, type: type },
              });
            },
            { timeout: 60000 },
          );

          logger.info(`✅ File ${type} successfully processed: ${fileName}`);
          sendNotification(
            `✅ File ${type} successfully processed: ${fileName}`,
          );
        } catch (error: any) {
          logger.error(
            `❌ Failed to process file ${normalizedPath}: ${error.message}`,
          );
          sendNotification(
            `❌ Failed to process file ${normalizedPath}: ${error.message}`,
          );
        }
      });
    })

    .on("change", async (filePath: string) => {
      logger.info(`🟡 File changed: ${filePath}`);
    })
    .on("unlink", async (filePath: string) => {
      logger.info(`🔴 File deleted: ${filePath}`);
    })
    .on("error", async (error: Error) => {
      logger.error(`❌ Error: ${error}`);
      sendNotification(`❌ Error: ${error}`);
    });
};

export default startWatcher;
