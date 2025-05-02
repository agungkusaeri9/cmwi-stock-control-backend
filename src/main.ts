import { web } from "./application/web";
import { logger } from "./application/logging";
import { APP_PORT } from "./application/config";

web.listen(APP_PORT, () => {
    logger.info("Listening on port " + APP_PORT);
})
