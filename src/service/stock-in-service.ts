import { StockInResponse, CreateStockInRequest, toStockInResponse, SearchStockInRequest } from "../model/stock-in-model";
import { Validation } from "../validation/validation";
import { StockInValidation } from "../validation/stock-in-validation";
import { StockIn } from "@prisma/client";
import { prismaClient } from "../application/database";
import { logger } from "../application/logging";
import { ResponseError } from "../error/response-error";
import { Pageable } from "../model/page";


export class StockInService {

    static async create(request: CreateStockInRequest): Promise<StockInResponse> {
        const createRequest = Validation.validate(StockInValidation.CREATE, request);

        return await prismaClient.$transaction(async (prisma) => {
            // Lock baris kanban berdasarkan code
            const kanbanRows = await prisma.$queryRaw<
                Array<{ id: string, stock_in_quantity: number, balance: number }>
            >`SELECT id, stock_in_quantity, balance FROM kanbans WHERE code = ${createRequest.kanban_code} FOR UPDATE`;

            if (kanbanRows.length === 0) {
                throw new ResponseError(404, "Kanban not found");
            }

            const kanbanData = kanbanRows[0];

            if (kanbanData.stock_in_quantity <= 0) {
                throw new ResponseError(400, "Kanban stock in quantity js system is empty");
            }
            // Create stock-in
            const stockIn = await prisma.stockIn.create({
                data: {
                    ...createRequest,
                    quantity: kanbanData.stock_in_quantity,
                    operator_id: createRequest.operator_id,
                    balance_before: kanbanData.balance,
                    balance_after: kanbanData.balance + kanbanData.stock_in_quantity
                }
            });

            await prisma.kanban.update({
                where: { id: Number(kanbanData.id) },
                data: {
                    balance: { increment: kanbanData.stock_in_quantity },
                }
            });

            return toStockInResponse(stockIn);
        });
    }





    static async get(request: SearchStockInRequest): Promise<Pageable<StockInResponse>> {


        const searchRequest = Validation.validate(StockInValidation.SEARCH, request);

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

        const [stockIns, total] = await Promise.all([
            prismaClient.stockIn.findMany({
                where: whereClause,
                ...(searchRequest.paginate ? { take: limit, skip } : {}),
                include: {
                    Operator: true
                }
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
            data: stockIns.map(toStockInResponse),
            ...(pagination ? { pagination } : {})

        };
    }

    static async show(id: number): Promise<StockInResponse> {

        if (isNaN(id)) {
            throw new ResponseError(400, "Invalid id");
        }

        const stockIn = await prismaClient.stockIn.findUnique({
            where: {
                id: id
            },
            include: {
                Kanban: true,
                Operator: true
            }
        });

        if (!stockIn) {
            throw new ResponseError(404, "StockIn not found");
        }

        return toStockInResponse(stockIn);
    }


}


