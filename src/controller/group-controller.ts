import { Request, Response, NextFunction } from "express";
import {
  CreateGroupRequest,
  UpdateGroupRequest,
  SearchGroupRequest,
} from "../model/group-model";
import { GroupService } from "../service/group-service";
import { sendSuccess } from "../helper/response-helper";

export class GroupController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateGroupRequest = req.body as CreateGroupRequest;
      const response = await GroupService.create(request);

      sendSuccess(res, 200, "Create group success", response);
    } catch (e) {
      next(e);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = Number(req.params.id);
      const request: UpdateGroupRequest = req.body as UpdateGroupRequest;
      const response = await GroupService.update(id, request);

      sendSuccess(res, 200, "Update group success", response);
    } catch (e) {
      next(e);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const request: SearchGroupRequest = {
        keyword: req.query.keyword as string,
        page: isNaN(Number(req.query.page)) ? 1 : Number(req.query.page),
        limit: isNaN(Number(req.query.limit)) ? 10 : Number(req.query.limit),
        paginate: req.query.paginate === "true",
      };

      const response = await GroupService.get(request);

      sendSuccess(
        res,
        200,
        "Get group success",
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
      const response = await GroupService.show(id);
      sendSuccess(res, 200, "Get group success", response);
    } catch (e) {
      next(e);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = Number(req.params.id);
      await GroupService.remove(id);

      sendSuccess(res, 200, "Remove group success");
    } catch (e) {
      next(e);
    }
  }
}
