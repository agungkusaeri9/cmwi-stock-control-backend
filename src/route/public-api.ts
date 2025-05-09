import express from "express";
import { UserController } from "../controller/user-controller";
import { StockInController } from "../controller/stock-in-controller";
import { StockOutController } from "../controller/stock-out-controller";

export const publicRouter = express.Router();
publicRouter.post("/api/auth/login", UserController.login);

// Stock In
publicRouter.post("/api/stock-ins", StockInController.create);
publicRouter.get("/api/stock-ins", StockInController.get);
publicRouter.get("/api/stock-ins/:id", StockInController.show);


// Stock Out
publicRouter.post("/api/stock-outs", StockOutController.create);
publicRouter.get("/api/stock-outs", StockOutController.get);
publicRouter.get("/api/stock-outs/:id", StockOutController.show);