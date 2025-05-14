import { Request, Response, NextFunction } from "express";
import { CreateStockOutRequest, SearchStockOutRequest } from "../model/stock-out-model";
import { StockOutService } from "../service/stock-out-service";
import { sendSuccess } from "../helper/response-helper";


export class StockOutController {

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateStockOutRequest = req.body as CreateStockOutRequest;
            const response = await StockOutService.create(request);

            sendSuccess(res, 200, "Create stockOut success", response);

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
                start_date: typeof req.query.start_date === 'string' ? new Date(req.query.start_date) : undefined,
                end_date: typeof req.query.end_date === 'string' ? new Date(req.query.end_date) : undefined,
            };


            console.log(request.start_date)


            const response = await StockOutService.get(request);

            sendSuccess(res, 200, "Get stockOut success", response.data, response.pagination);
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


}