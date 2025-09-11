import { Request, Response, NextFunction } from "express";
import {
  CreateSubMachineRequest,
  UpdateSubMachineRequest,
  SearchSubMachineRequest,
} from "../model/submachine-model";
import { SubMachineService } from "../service/submachine-service";
import { sendSuccess } from "../helper/response-helper";

export class SubMachineController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateSubMachineRequest =
        req.body as CreateSubMachineRequest;
      const response = await SubMachineService.create(request);

      sendSuccess(res, 200, "Create subMachine success", response);
    } catch (e) {
      next(e);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = Number(req.params.id);
      const request: UpdateSubMachineRequest =
        req.body as UpdateSubMachineRequest;
      const response = await SubMachineService.update(id, request);

      sendSuccess(res, 200, "Update subMachine success", response);
    } catch (e) {
      next(e);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const request: SearchSubMachineRequest = {
        keyword: req.query.keyword as string,
        page: isNaN(Number(req.query.page)) ? 1 : Number(req.query.page),
        limit: isNaN(Number(req.query.limit)) ? 10 : Number(req.query.limit),
        paginate: req.query.paginate === "true",
        machine_id: req.query.machine_id
          ? Number(req.query.machine_id)
          : undefined,
      };

      const response = await SubMachineService.get(request);

      sendSuccess(
        res,
        200,
        "Get subMachine success",
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
      const response = await SubMachineService.show(id);
      sendSuccess(res, 200, "Get subMachine success", response);
    } catch (e) {
      next(e);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = Number(req.params.id);
      await SubMachineService.remove(id);

      sendSuccess(res, 200, "Remove subMachine success");
    } catch (e) {
      next(e);
    }
  }

  static async getByMachineId(req: Request, res: Response, next: NextFunction) {
    try {
      const machine_id: number = Number(req.params.machine_id);
      const response = await SubMachineService.getByMachineId(machine_id);
      sendSuccess(res, 200, "Get subMachines by machine ID success", response);
    } catch (e) {
      next(e);
    }
  }
}
