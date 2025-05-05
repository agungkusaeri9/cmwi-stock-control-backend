import chokidar from "chokidar";
import path from "path";
import { logger } from "./logging";
import { PurchaseRequestService } from "../service/purchase-request-service";

const folderPath = path.join(__dirname, "../../", "watched-folder");
logger.info("Folder yang diwatch:" + folderPath);

const startWatcher = () => {
    const watcher = chokidar.watch(folderPath, {
        persistent: true,
        ignoreInitial: true,
        ignored: /(^|[\/\\])~\$/,
        awaitWriteFinish: {
            stabilityThreshold: 2000,
            pollInterval: 100,
        },
        ignorePermissionErrors: true,
    });

    // Perhatikan perubahan pada tipe parameter error
    (watcher as any)
        .on("add", (filePath: string) => {
            logger.info(`🟢 File ditambahkan: ${filePath}`);
            const ext = path.extname(filePath).toLowerCase();
            const allowedExts = [".xlsx", ".xls", ".xlsb", ".xlsm", ".csv", ".ods"];

            if (!allowedExts.includes(ext)) {
                return;
            }


            const request = PurchaseRequestService.create(filePath);



        })
        .on("change", (filePath: string) => {
            logger.info(`🟡 File diubah: ${filePath}`);
        })
        .on("unlink", (filePath: string) => {
            logger.info(`🔴 File dihapus: ${filePath}`);
        })
        .on("error", (error: Error) => {
            logger.error(`❌ Error: ${error}`);
        });
};

export default startWatcher;
