import { Request, Response, NextFunction } from "express";
import {
  CreateStockOutRequest,
  SearchStockOutRequest,
} from "../model/stock-out-model";
import { StockOutService } from "../service/stock-out-service";
import { sendError, sendSuccess } from "../helper/response-helper";
import { logger } from "../application/logging";
import { UserRequest } from "../type/user-request";

export class StockOutController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: CreateStockOutRequest = req.body as CreateStockOutRequest;

      const response = await StockOutService.create(request, req.operatorId);
      logger.info("Create stockOut success");
      sendSuccess(res, 200, "Create stockOut success", response);
    } catch (e) {
      next(e);
    }
  }

  static async createMany(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const requests: CreateStockOutRequest[] =
        req.body as CreateStockOutRequest[];

      const { successMessages, errorMessages } =
        await StockOutService.createMany(requests, req.operatorId);

      // case 1: semua sukses
      if (successMessages.length > 0 && errorMessages.length === 0) {
        logger.info("All stockOut created successfully");
        return sendSuccess(res, 200, "All stockOut created successfully");
      }

      // case 2: semua gagal
      if (successMessages.length === 0 && errorMessages.length > 0) {
        logger.warn("All stockOut creation failed");
        return sendSuccess(res, 400, "All stockOut creation failed", {
          errors: errorMessages,
        });
      }

      // case 3: sebagian berhasil, sebagian gagal
      if (successMessages.length > 0 && errorMessages.length > 0) {
        logger.warn("Some stockOut created, some failed");
        return sendSuccess(res, 207, "Partial success in creating stockOut", {
          success: successMessages,
          errors: errorMessages,
        });
      }

      // case fallback (misalnya tidak ada request dikirim)
      logger.warn("No stockOut request processed");
      return sendSuccess(res, 400, "No stockOut request processed", null);
    } catch (e) {
      next(e);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = Number(req.params.id);
      const request: CreateStockOutRequest = req.body as CreateStockOutRequest;
      const response = await StockOutService.update(id, request);
      logger.info("Update stockOut success");
      sendSuccess(res, 200, "Update stockOut success", response);
    } catch (e) {
      next(e);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const request: SearchStockOutRequest = {
        keyword: req.query.keyword as string,
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
        machine_id: isNaN(Number(req.query.machine_id))
          ? undefined
          : Number(req.query.machine_id),
        sub_machine_id: isNaN(Number(req.query.sub_machine_id))
          ? undefined
          : Number(req.query.sub_machine_id),
        machine_area_id: isNaN(Number(req.query.machine_area_id))
          ? undefined
          : Number(req.query.machine_area_id),
        requester_id: isNaN(Number(req.query.requester_id))
          ? undefined
          : Number(req.query.requester_id),
      };

      const response = await StockOutService.get(request);

      sendSuccess(
        res,
        200,
        "Get stockOut success",
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
      const response = await StockOutService.show(id);
      sendSuccess(res, 200, "Get stockOut success", response);
    } catch (e) {
      next(e);
    }
  }

  static async exportExcel(req: Request, res: Response, next: NextFunction) {
    try {
      const request: SearchStockOutRequest = {
        keyword: req.query.keyword as string,
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
        machine_id: isNaN(Number(req.query.machine_id))
          ? undefined
          : Number(req.query.machine_id),
        sub_machine_id: isNaN(Number(req.query.sub_machine_id))
          ? undefined
          : Number(req.query.sub_machine_id),
        machine_area_id: isNaN(Number(req.query.machine_area_id))
          ? undefined
          : Number(req.query.machine_area_id),
      };

      const response = await StockOutService.exportExcel(request);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=StockOutExport.xlsx"
      );
      res.send(response);
    } catch (e) {
      next(e);
    }
  }
}
