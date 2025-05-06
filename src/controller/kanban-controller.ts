import { Request, Response, NextFunction } from "express";
import { CreateKanbanRequest, UpdateKanbanRequest, SearchKanbanRequest } from "../model/kanban-model";
import { KanbanService } from "../service/kanban-service";
import { sendSuccess } from "../helper/response-helper";


export class KanbanController {

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateKanbanRequest = req.body as CreateKanbanRequest;
            const response = await KanbanService.create(request);

            sendSuccess(res, 200, "Create Kanban success", response);

        } catch (e) {
            next(e);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            const request: UpdateKanbanRequest = req.body as UpdateKanbanRequest;
            const response = await KanbanService.update(id, request);

            sendSuccess(res, 200, "Update Kanban success", response);
        } catch (e) {
            next(e);
        }
    }

    static async get(req: Request, res: Response, next: NextFunction) {
        try {

            const request: SearchKanbanRequest = {
                keyword: req.query.keyword as string,
                page: isNaN(Number(req.query.page)) ? 1 : Number(req.query.page),
                limit: isNaN(Number(req.query.limit)) ? 10 : Number(req.query.limit),
                paginate: req.query.paginate === "true",
                spare_part_id: isNaN(Number(req.query.spare_part_id)) ? undefined : Number(req.query.spare_part_id),
                supplier_id: isNaN(Number(req.query.supplier_id)) ? undefined : Number(req.query.supplier_id),
                maker_id: isNaN(Number(req.query.maker_id)) ? undefined : Number(req.query.maker_id),
                rack_id: isNaN(Number(req.query.rack_id)) ? undefined : Number(req.query.rack_id)

            };


            const response = await KanbanService.get(request);

            sendSuccess(res, 200, "Get Kanban success", response.data, response.pagination);
        } catch (e) {
            next(e);
        }
    }

    static async show(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            const response = await KanbanService.show(id);
            sendSuccess(res, 200, "Get Kanban success", response);
        } catch (e) {
            next(e);
        }
    }

    static async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            await KanbanService.remove(id);

            sendSuccess(res, 200, "Remove Kanban success");
        } catch (e) {
            next(e);
        }
    }
}