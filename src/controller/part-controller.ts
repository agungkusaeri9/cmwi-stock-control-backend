import { Request, Response, NextFunction } from "express";
import { CreatePartRequest, UpdatePartRequest, SearchPartRequest } from "../model/part-model";
import { PartService } from "../service/part-service";
import { sendSuccess } from "../helper/response-helper";


export class PartController {

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreatePartRequest = req.body as CreatePartRequest;
            const response = await PartService.create(request);

            sendSuccess(res, 200, "Create Spare Part success", response);

        } catch (e) {
            next(e);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            const request: UpdatePartRequest = req.body as UpdatePartRequest;
            const response = await PartService.update(id, request);

            sendSuccess(res, 200, "Update Spare Part success", response);
        } catch (e) {
            next(e);
        }
    }

    static async get(req: Request, res: Response, next: NextFunction) {
        try {

            const request: SearchPartRequest = {
                keyword: req.query.keyword as string,
                page: isNaN(Number(req.query.page)) ? 1 : Number(req.query.page),
                limit: isNaN(Number(req.query.limit)) ? 10 : Number(req.query.limit),
                paginate: req.query.paginate === "true",
            };


            const response = await PartService.get(request);

            sendSuccess(res, 200, "Get Spare Part success", response.data, response.pagination);
        } catch (e) {
            next(e);
        }
    }

    static async show(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            const response = await PartService.show(id);
            sendSuccess(res, 200, "Get Spare Part success", response);
        } catch (e) {
            next(e);
        }
    }

    static async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            await PartService.remove(id);

            sendSuccess(res, 200, "Remove Spare Part success");
        } catch (e) {
            next(e);
        }
    }
}