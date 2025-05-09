import { Request, Response, NextFunction } from "express";
import { CreateStockInRequest, SearchStockInRequest } from "../model/stock-in-model";
import { StockInService } from "../service/stock-in-service";
import { sendSuccess } from "../helper/response-helper";


export class StockInController {

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateStockInRequest = req.body as CreateStockInRequest;
            const response = await StockInService.create(request);

            sendSuccess(res, 200, "Create stockIn success", response);

        } catch (e) {
            next(e);
        }
    }



    static async get(req: Request, res: Response, next: NextFunction) {
        try {

            const request: SearchStockInRequest = {
                keyword: req.query.keyword as string,
                page: isNaN(Number(req.query.page)) ? 1 : Number(req.query.page),
                limit: isNaN(Number(req.query.limit)) ? 10 : Number(req.query.limit),
                paginate: req.query.paginate === "true"
            };


            const response = await StockInService.get(request);

            sendSuccess(res, 200, "Get stockIn success", response.data, response.pagination);
        } catch (e) {
            next(e);
        }
    }

    static async show(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            const response = await StockInService.show(id);
            sendSuccess(res, 200, "Get stockIn success", response);
        } catch (e) {
            next(e);
        }
    }


}