import { web } from "./application/web";
import { logger } from "./application/logging";
import { APP_PORT } from "./application/config";
import startWatcher from "./application/watcher";

web.listen(Number(APP_PORT) || 3210, "0.0.0.0", () => {
    logger.info(`🚀 Server running at http://0.0.0.0:${APP_PORT || 3210}`);
    startWatcher();
});

