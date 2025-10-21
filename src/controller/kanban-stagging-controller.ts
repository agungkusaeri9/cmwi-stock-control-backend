import { Request, Response } from "express";
import { sendSuccess } from "../helper/response-helper";
import { KanbanStaggingService } from "../service/kanban-stagging-service";
import {
  AssignToParentRequest,
  ForwardToMasterRequest,
} from "../model/kanban-stagging-model";

export class KanbanStaggingController {
  static async get(req: Request, res: Response) {
    const { keyword, page, limit, paginate, start_date, end_date } = req.query;
    const response = await KanbanStaggingService.get({
      keyword: keyword as string | undefined,
      page: isNaN(Number(page)) ? 1 : Number(page),
      limit: isNaN(Number(limit)) ? 10 : Number(limit),
      paginate: paginate ? paginate === "true" : undefined,
      start_date: start_date ? new Date(String(start_date)) : undefined,
      end_date: end_date ? new Date(String(end_date)) : undefined,
    });
    sendSuccess(
      res,
      200,
      "Get Kanban success",
      response.data,
      response.pagination
    );
  }

  static async assignToParent(req: Request, res: Response) {
    const { kanban_stagging_id, parent_kanban_code } =
      req.body as AssignToParentRequest;
    const result = await KanbanStaggingService.assignToParent({
      kanban_stagging_id,
      parent_kanban_code,
    });
    sendSuccess(res, 200, "Successfully assign to parent", result);
  }

  static async forwardToMaster(req: Request, res: Response) {
    const result = await KanbanStaggingService.forwardToMaster(
      req.body as ForwardToMasterRequest
    );
    sendSuccess(res, 200, "Successfully forward to master", result);
  }
}
