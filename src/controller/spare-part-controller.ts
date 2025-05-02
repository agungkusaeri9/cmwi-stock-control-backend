import { Request, Response, NextFunction } from "express";
import { CreateSparePartRequest, UpdateSparePartRequest, SearchSparePartRequest } from "../model/spare-part-model";
import { SparePartService } from "../service/spare-part-service";
import { sendSuccess } from "../helper/response-helper";


export class SparePartController {

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateSparePartRequest = req.body as CreateSparePartRequest;
            const response = await SparePartService.create(request);

            sendSuccess(res, 200, "Create Spare Part success", response);

        } catch (e) {
            next(e);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            const request: UpdateSparePartRequest = req.body as UpdateSparePartRequest;
            const response = await SparePartService.update(id, request);

            sendSuccess(res, 200, "Update Spare Part success", response);
        } catch (e) {
            next(e);
        }
    }

    static async get(req: Request, res: Response, next: NextFunction) {
        try {

            const request: SearchSparePartRequest = {
                keyword: req.query.keyword as string,
                page: isNaN(Number(req.query.page)) ? 1 : Number(req.query.page),
                limit: isNaN(Number(req.query.limit)) ? 10 : Number(req.query.limit),
            };


            const response = await SparePartService.get(request);

            sendSuccess(res, 200, "Get Spare Part success", response.data, response.pagination);
        } catch (e) {
            next(e);
        }
    }

    static async show(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            const response = await SparePartService.show(id);
            sendSuccess(res, 200, "Get Spare Part success", response);
        } catch (e) {
            next(e);
        }
    }

    static async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            await SparePartService.remove(id);

            sendSuccess(res, 200, "Remove Spare Part success");
        } catch (e) {
            next(e);
        }
    }
}