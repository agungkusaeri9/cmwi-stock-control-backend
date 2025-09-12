import express from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { UserController } from "../controller/user-controller";
import { OperatorController } from "../controller/operator-controller";
import { MachineAreaController } from "../controller/machine-area-controller";
import { RackController } from "../controller/rack-controller";
import { KanbanController } from "../controller/kanban-controller";
import { SupplierController } from "../controller/supplier-controller";
import { MakerController } from "../controller/Maker-controller";
import { MachineController } from "../controller/machine-controller";
import { StockOutController } from "../controller/stock-out-controller";
import { GroupController } from "../controller/group-controller";
import { RequesterController } from "../controller/requester-controller";
import { SubMachineController } from "../controller/submachine-controller";
import { StockInController } from "../controller/stock-in-controller";

export const apiRouter = express.Router();
apiRouter.use(authMiddleware);

// User
apiRouter.get("/api/users/current", UserController.get);
// apiRouter.patch("/api/users/current", UserController.update);

// Operator
apiRouter.post("/api/operators", OperatorController.create);
apiRouter.put("/api/operators/:id", OperatorController.update);
apiRouter.delete("/api/operators/:id", OperatorController.remove);

// Requester
apiRouter.post("/api/requesters", RequesterController.create);
apiRouter.put("/api/requesters/:id", RequesterController.update);
apiRouter.delete("/api/requesters/:id", RequesterController.remove);

// Group
apiRouter.post("/api/groups", GroupController.create);
apiRouter.put("/api/groups/:id", GroupController.update);
apiRouter.delete("/api/groups/:id", GroupController.remove);

// Stock Out
apiRouter.patch("/api/stock-outs/:id", StockOutController.update);
apiRouter.post("/api/stock-outs", StockOutController.create);

// Machine Area
apiRouter.post("/api/machine-areas", MachineAreaController.create);
apiRouter.put("/api/machine-areas/:id", MachineAreaController.update);
apiRouter.delete("/api/machine-areas/:id", MachineAreaController.remove);

// Rack
apiRouter.post("/api/racks", RackController.create);
apiRouter.put("/api/racks/:id", RackController.update);
apiRouter.delete("/api/racks/:id", RackController.remove);

// Kanban
apiRouter.post("/api/kanbans", KanbanController.create);
apiRouter.put("/api/kanbans/:id", KanbanController.update);
apiRouter.delete("/api/kanbans/:id", KanbanController.remove);
apiRouter.get(
  "/api/kanbans/export/uncompleted/excel",
  KanbanController.exportUncompletedKanbanToExcel
);

// Supplier
apiRouter.post("/api/suppliers", SupplierController.create);
apiRouter.put("/api/suppliers/:id", SupplierController.update);
apiRouter.delete("/api/suppliers/:id", SupplierController.remove);

// Maker
apiRouter.post("/api/makers", MakerController.create);
apiRouter.put("/api/makers/:id", MakerController.update);
apiRouter.delete("/api/makers/:id", MakerController.remove);

// Machine
apiRouter.post("/api/machines", MachineController.create);
apiRouter.put("/api/machines/:id", MachineController.update);
apiRouter.delete("/api/machines/:id", MachineController.remove);

// Sub Machine
apiRouter.post("/api/sub-machines", SubMachineController.create);
apiRouter.put("/api/sub-machines/:id", SubMachineController.update);
apiRouter.delete("/api/sub-machines/:id", SubMachineController.remove);

// Stock In
apiRouter.post("/api/stock-ins", StockInController.create);
