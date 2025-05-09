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
        console.log(createRequest);
        return await prismaClient.$transaction(async (prisma) => {

            const kanbanRows = await prisma.$queryRaw<
                Array<{ id: string, balance: number }>
            >`SELECT id, balance FROM kanbans WHERE code = ${createRequest.kanban_code} FOR UPDATE`;

            if (kanbanRows.length === 0) {
                throw new ResponseError(404, "Kanban Code not found");
            }

            const kanban = kanbanRows[0];

            if (kanban.balance < createRequest.quantity) {
                throw new ResponseError(400, "Kanban stock is not enough");
            }

            // Update kanban balance
            await prisma.kanban.update({
                where: { id: Number(kanban.id) },
                data: {
                    balance: { decrement: createRequest.quantity }
                }
            });

            // Create stock out record
            const stockOut = await prisma.stockOut.create({
                data: createRequest
            });

            return toStockOutResponse(stockOut);
        });
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

        const [stockOuts, total] = await Promise.all([
            prismaClient.stockOut.findMany({
                where: whereClause,
                ...(searchRequest.paginate ? { take: limit, skip } : {}),
            }),
            prismaClient.stockOut.count({
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
            data: stockOuts.map(toStockOutResponse),
            ...(pagination ? { pagination } : {})

        };
    }

    static async show(id: number): Promise<StockOutResponse> {

        if (isNaN(id)) {
            throw new ResponseError(400, "Invalid id");
        }

        const stockOut = await prismaClient.stockOut.findUnique({
            where: {
                id: id
            }
        });

        if (!stockOut) {
            throw new ResponseError(404, "StockOut not found");
        }

        return toStockOutResponse(stockOut);
    }


}


