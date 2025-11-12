import { Request, Response, NextFunction } from "express";
import {
  CreateManualPurchaseOrderRequest,
  SearchManualPurchaseOrderRequest,
} from "../model/manual-purchase-order-model";
import { ManualPurchaseOrderService } from "../service/manual-purchase-order-service";
import { sendSuccess } from "../helper/response-helper";

export class ManualPurchaseOrderController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateManualPurchaseOrderRequest =
        req.body as CreateManualPurchaseOrderRequest;
      const response = await ManualPurchaseOrderService.create(request);
      sendSuccess(res, 200, "Create ManualPurchaseOrder success", response);
    } catch (e) {
      next(e);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const request: SearchManualPurchaseOrderRequest = {
        keyword: req.query.keyword as string,
        po_number: req.query.po_number as string,
        pr_number: req.query.pr_number as string,
        kanban: req.query.kanban as string,
        page: isNaN(Number(req.query.page)) ? 1 : Number(req.query.page),
        limit: isNaN(Number(req.query.limit)) ? 10 : Number(req.query.limit),
        paginate: req.query.paginate === "true",
        start_date:
          typeof req.query.start_date === "string"
            ? new Date(req.query.start_date)
            : undefined,
        end_date:
          typeof req.query.end_date === "string"
            ? new Date(req.query.end_date)
            : undefined,
      };

      const response = await ManualPurchaseOrderService.get(request);
      sendSuccess(
        res,
        200,
        "Get ManualPurchaseOrder success",
        response.data,
        response.pagination
      );
    } catch (e) {
      next(e);
    }
  }

  static async show(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = Number(req.params.id);
      const response = await ManualPurchaseOrderService.show(id);
      sendSuccess(res, 200, "Get ManualPurchaseOrder success", response);
    } catch (e) {
      next(e);
    }
  }
}
