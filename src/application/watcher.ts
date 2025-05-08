import chokidar from "chokidar";
import path from "path";
import { logger } from "./logging";
import { PurchaseRequestService } from "../service/purchase-request-service";
import { PurchaseOrderService } from "../service/purchase-order-service";
import { SHARED_FOLDER_PATH } from "./config";

const purchaseRequestFolderPath = path.join(SHARED_FOLDER_PATH, "purchase-request");
const purchaseOrderFolderPath = path.join(SHARED_FOLDER_PATH, "purchase-order");



const startWatcher = () => {
    const watcher = chokidar.watch([purchaseRequestFolderPath, purchaseOrderFolderPath], {
        persistent: true,
        ignoreInitial: true,
        ignored: /(^|[\/\\])~\$/,
        awaitWriteFinish: {
            stabilityThreshold: 2000,
            pollInterval: 100,
        },
        ignorePermissionErrors: true,
    });


    (watcher as any)
        .on("add", async (filePath: string) => {
            const normalizedPath = path.normalize(filePath);
            logger.info(`🟢 File added: ${normalizedPath}`);

            const ext = path.extname(normalizedPath).toLowerCase();
            const allowedExts = [".xlsx", ".xls", ".xlsb", ".xlsm", ".csv", ".ods"];

            if (!allowedExts.includes(ext)) return;

            try {
                if (normalizedPath.includes(purchaseOrderFolderPath)) {
                    await PurchaseOrderService.create(normalizedPath);
                } else if (normalizedPath.includes(purchaseRequestFolderPath)) {
                    await PurchaseRequestService.create(normalizedPath);
                }
            } catch (error: any) {
                logger.error(`❌ Error processing file ${normalizedPath}: ${error.message}`);
            }
        })
        .on("change", async (filePath: string) => {
            logger.info(`🟡 File changed: ${filePath}`);
        })
        .on("unlink", async (filePath: string) => {
            logger.info(`🔴 File deleted: ${filePath}`);
        })
        .on("error", async (error: Error) => {
            logger.error(`❌ Error: ${error}`);
        });
};

export default startWatcher;
