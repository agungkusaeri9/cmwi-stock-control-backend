import { Request, Response, NextFunction } from "express";
import {
  CreateRequesterRequest,
  UpdateRequesterRequest,
  SearchRequesterRequest,
} from "../model/requester-model";
import { RequesterService } from "../service/requester-service";
import { sendSuccess } from "../helper/response-helper";

export class RequesterController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateRequesterRequest =
        req.body as CreateRequesterRequest;
      const response = await RequesterService.create(request);

      sendSuccess(res, 200, "Create requester success", response);
    } catch (e) {
      next(e);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = Number(req.params.id);
      const request: UpdateRequesterRequest =
        req.body as UpdateRequesterRequest;
      const response = await RequesterService.update(id, request);

      sendSuccess(res, 200, "Update requester success", response);
    } catch (e) {
      next(e);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const request: SearchRequesterRequest = {
        keyword: req.query.keyword as string,
        page: isNaN(Number(req.query.page)) ? 1 : Number(req.query.page),
        limit: isNaN(Number(req.query.limit)) ? 10 : Number(req.query.limit),
        paginate: req.query.paginate === "true",
        group_id: req.query.group_id ? Number(req.query.group_id) : undefined,
      };

      const response = await RequesterService.get(request);

      sendSuccess(
        res,
        200,
        "Get requester success",
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
      const response = await RequesterService.show(id);
      sendSuccess(res, 200, "Get requester success", response);
    } catch (e) {
      next(e);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = Number(req.params.id);
      await RequesterService.remove(id);

      sendSuccess(res, 200, "Remove requester success");
    } catch (e) {
      next(e);
    }
  }

  static async getByGroupId(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId: number = Number(req.params.groupId);
      const response = await RequesterService.getByGroupId(groupId);
      sendSuccess(res, 200, "Get requester by group id success", response);
    } catch (e) {
      next(e);
    }
  }
}
