import { StockOutResponse, CreateStockOutRequest, toStockOutResponse, SearchStockOutRequest } from "../model/stock-out-model";
import { Validation } from "../validation/validation";
import { StockOutValidation } from "../validation/stock-out-validation";
import { StockOut } from "@prisma/client";
import { prismaClient } from "../application/database";
import { logger } from "../application/logging";
import { ResponseError } from "../error/response-error";
import { Pageable } from "../model/page";


export class StockOutService {

    static async create(request: CreateStockOutRequest): Promise<StockOutResponse> {
        const createRequest = Validation.validate(StockOutValidation.CREATE, request);

        const stockIn = await prismaClient.stockIn.create({
            data: createRequest
        });

        return toStockOutResponse(stockIn);
    }


    static async get(request: SearchStockOutRequest): Promise<Pageable<StockOutResponse>> {


        const searchRequest = Validation.validate(StockOutValidation.SEARCH, request);

        const filters: any[] = [];

        if (searchRequest.keyword) {
            filters.push({
                OR: [
                    {
                        code: {
                            contains: searchRequest.keyword

                        }
                    },
                ]
            });
        }

        const whereClause = filters.length > 0 ? { AND: filters } : {};

        // Default pagination values if not provided
        const page = searchRequest.page || 1;
        const limit = searchRequest.limit || 10;

        const skip = (page - 1) * limit;

        const [stockIns, total] = await Promise.all([
            prismaClient.stockIn.findMany({
                where: whereClause,
                ...(searchRequest.paginate ? { take: limit, skip } : {}),
            }),
            prismaClient.stockIn.count({
                where: whereClause,
            })
        ]);



        const pagination = searchRequest.paginate
            ? {
                curr_page: page,
                total_page: Math.ceil(total / limit),
                limit: limit,
                total: total
            }
            : undefined;


        return {
            data: stockIns.map(toStockOutResponse),
            ...(pagination ? { pagination } : {})

        };
    }

    static async show(id: number): Promise<StockOutResponse> {

        if (isNaN(id)) {
            throw new ResponseError(400, "Invalid id");
        }

        const stockIn = await prismaClient.stockIn.findUnique({
            where: {
                id: id
            }
        });

        if (!stockIn) {
            throw new ResponseError(404, "StockOut not found");
        }

        return toStockOutResponse(stockIn);
    }


}


