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
                data: {
                    ...createRequest,
                    operator_id: createRequest.operator_id,
                    balance_before: kanban.balance,
                    balance_after: kanban.balance - createRequest.quantity
                },
                include: {
                    machine_area: true,
                    machine: true,
                    operator: true

                }

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
                        kanban_code: {
                            contains: searchRequest.keyword

                        }
                    },
                ]
            });
        }

        if (searchRequest.machine_area_id) {
            filters.push({
                machine_area_id: searchRequest.machine_area_id,
            });
        }

        if (searchRequest.machine_id) {
            filters.push({
                machine_id: searchRequest.machine_id,
            });
        }

        if (searchRequest.start_date) {
            filters.push({
                created_at: {
                    gte: searchRequest.start_date
                }
            })
        }


        if (searchRequest.end_date) {
            filters.push({
                created_at: {
                    lte: searchRequest.end_date
                }
            })
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
                include: {
                    machine_area: true,
                    machine: true,
                    operator: true

                }
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
            },
            include: {
                machine_area: true,
                machine: true,
                operator: true

            }
        });

        if (!stockOut) {
            throw new ResponseError(404, "StockOut not found");
        }

        return toStockOutResponse(stockOut);
    }


}


