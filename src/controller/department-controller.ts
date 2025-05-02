import { Request, Response, NextFunction } from "express";
import { CreateDepartmentRequest, UpdateDepartmentRequest, SearchDepartmentRequest } from "../model/department-model";
import { DepartmentService } from "../service/department-service";
import { sendSuccess } from "../helper/response-helper";


export class DepartmentController {

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateDepartmentRequest = req.body as CreateDepartmentRequest;
            const response = await DepartmentService.create(request);

            sendSuccess(res, 200, "Create Department success", response);

        } catch (e) {
            next(e);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            const request: UpdateDepartmentRequest = req.body as UpdateDepartmentRequest;
            const response = await DepartmentService.update(id, request);

            sendSuccess(res, 200, "Update Department success", response);
        } catch (e) {
            next(e);
        }
    }

    static async get(req: Request, res: Response, next: NextFunction) {
        try {

            const request: SearchDepartmentRequest = {
                keyword: req.query.keyword as string,
                page: isNaN(Number(req.query.page)) ? 1 : Number(req.query.page),
                limit: isNaN(Number(req.query.limit)) ? 10 : Number(req.query.limit),
                paginate: req.query.paginate === "true"
            };


            const response = await DepartmentService.get(request);

            sendSuccess(res, 200, "Get Department success", response.data, response.pagination);
        } catch (e) {
            next(e);
        }
    }

    static async show(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            const response = await DepartmentService.show(id);
            sendSuccess(res, 200, "Get Department success", response);
        } catch (e) {
            next(e);
        }
    }

    static async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            await DepartmentService.remove(id);

            sendSuccess(res, 200, "Remove Department success");
        } catch (e) {
            next(e);
        }
    }
}