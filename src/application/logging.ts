import winston from "winston";
import { NODE_ENV } from "./config";


const level = NODE_ENV === "production" ? "info" : "debug";

export const logger = winston.createLogger({
  level: level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "logger.log" }),
  ],
});

if (NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
