import express from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { UserController } from "../controller/user-controller";
import { OperatorController } from "../controller/operator-controller";
import { DepartmentController } from "../controller/department-controller";
import { MachineAreaController } from "../controller/machine-area-controller";
import { RackController } from "../controller/rack-controller";
import { KanbanController } from "../controller/kanban-controller";
import { SupplierController } from "../controller/supplier-controller";
import { MakerController } from "../controller/Maker-controller";
import { PurchaseRequestController } from "../controller/purchase-request-controller";
import { PurchaseOrderController } from "../controller/purchase-order-controller";
import { MachineController } from "../controller/machine-controller";
import { PartController } from "../controller/part-controller";


export const apiRouter = express.Router();
apiRouter.use(authMiddleware);

// User APi
apiRouter.get("/api/users/current", UserController.get);
// apiRouter.patch("/api/users/current", UserController.update);

// Operator APi
apiRouter.post("/api/operators", OperatorController.create);
apiRouter.get("/api/operators", OperatorController.get);
apiRouter.get("/api/operators/:id", OperatorController.show);
apiRouter.put("/api/operators/:id", OperatorController.update);
apiRouter.delete("/api/operators/:id", OperatorController.remove);


// Departement APi
apiRouter.post("/api/departments", DepartmentController.create);
apiRouter.get("/api/departments", DepartmentController.get);
apiRouter.get("/api/departments/:id", DepartmentController.show);
apiRouter.put("/api/departments/:id", DepartmentController.update);
apiRouter.delete("/api/departments/:id", DepartmentController.remove);


// Machine Area
apiRouter.post("/api/machine-areas", MachineAreaController.create);
apiRouter.get("/api/machine-areas", MachineAreaController.get);
apiRouter.get("/api/machine-areas/:id", MachineAreaController.show);
apiRouter.put("/api/machine-areas/:id", MachineAreaController.update);
apiRouter.delete("/api/machine-areas/:id", MachineAreaController.remove);


// Rack
apiRouter.post("/api/racks", RackController.create);
apiRouter.get("/api/racks", RackController.get);
apiRouter.get("/api/racks/:id", RackController.show);
apiRouter.put("/api/racks/:id", RackController.update);
apiRouter.delete("/api/racks/:id", RackController.remove);




// Kanban
apiRouter.post("/api/kanbans", KanbanController.create);
apiRouter.get("/api/kanbans", KanbanController.get);
apiRouter.get("/api/kanbans/:id", KanbanController.show);
apiRouter.put("/api/kanbans/:id", KanbanController.update);
apiRouter.delete("/api/kanbans/:id", KanbanController.remove);


// Supplier
apiRouter.post("/api/suppliers", SupplierController.create);
apiRouter.get("/api/suppliers", SupplierController.get);
apiRouter.get("/api/suppliers/:id", SupplierController.show);
apiRouter.put("/api/suppliers/:id", SupplierController.update);
apiRouter.delete("/api/suppliers/:id", SupplierController.remove);


// Maker
apiRouter.post("/api/makers", MakerController.create);
apiRouter.get("/api/makers", MakerController.get);
apiRouter.get("/api/makers/:id", MakerController.show);
apiRouter.put("/api/makers/:id", MakerController.update);
apiRouter.delete("/api/makers/:id", MakerController.remove);


// Purchase Request
apiRouter.get("/api/purchase-requests", PurchaseRequestController.get);
apiRouter.get("/api/purchase-requests/:id", PurchaseRequestController.show);


// Purchase Order
apiRouter.get("/api/purchase-orders", PurchaseOrderController.get);
apiRouter.get("/api/purchase-orders/:id", PurchaseOrderController.show);

// Machine
apiRouter.post("/api/machines", MachineController.create);
apiRouter.get("/api/machines", MachineController.get);
apiRouter.get("/api/machines/:id", MachineController.show);
apiRouter.put("/api/machines/:id", MachineController.update);
apiRouter.delete("/api/machines/:id", MachineController.remove);

// Part
apiRouter.post("/api/parts", PartController.create);
apiRouter.get("/api/parts", PartController.get);
apiRouter.get("/api/parts/:id", PartController.show);
apiRouter.put("/api/parts/:id", PartController.update);
apiRouter.delete("/api/parts/:id", PartController.remove);


