import { OperatorResponse, CreateOperatorRequest, UpdateOperatorRequest, toOperatorResponse, SearchOperatorRequest } from "../model/operator-model";
import { Validation } from "../validation/validation";
import { OperatorValidation } from "../validation/operator-validation";
import { Operator } from "@prisma/client";
import { prismaClient } from "../application/database";
import { logger } from "../application/logging";
import { ResponseError } from "../error/response-error";
import { Pageable } from "../model/page";


export class OperatorService {

    static async create(request: CreateOperatorRequest): Promise<OperatorResponse> {
        const createRequest = Validation.validate(OperatorValidation.CREATE, request);


        const isNikExist = await prismaClient.operator.findFirst({
            where: {
                nik: createRequest.nik
            }
        });

        if (isNikExist) {
            throw new ResponseError(400, "Nik already exists");
        }

        const operator = await prismaClient.operator.create({
            data: createRequest
        });

        return toOperatorResponse(operator);
    }


    static async update(id: number, request: UpdateOperatorRequest): Promise<OperatorResponse> {

        if (isNaN(id)) {
            throw new ResponseError(400, "Invalid id");
        }

        const idISValid = await prismaClient.operator.findUnique({
            where: {
                id: id
            }
        });

        if (!idISValid) {
            throw new ResponseError(404, "Operator not found");
        }

        const updateRequest = Validation.validate(OperatorValidation.UPDATE, request);

        const isNikExist = await prismaClient.operator.findFirst({
            where: {
                nik: updateRequest.nik,
                NOT: {
                    id: id
                }
            }
        });

        if (isNikExist) {
            throw new ResponseError(400, "Nik already exists");
        }

        const operator = await prismaClient.operator.update({
            where: {
                id: id
            },
            data: updateRequest
        });

        return toOperatorResponse(operator);
    }


    static async get(request: SearchOperatorRequest): Promise<Pageable<OperatorResponse>> {
        const searchRequest = Validation.validate(OperatorValidation.SEARCH, request);

        const skip = (searchRequest.page - 1) * searchRequest.limit;

        const filters: any[] = [];

        if (searchRequest.keyword) {
            filters.push({
                OR: [
                    {
                        nik: {
                            contains: searchRequest.keyword

                        }
                    },
                    {
                        name: {
                            contains: searchRequest.keyword

                        }
                    }
                ]
            });
        }

        const whereClause = filters.length > 0 ? { AND: filters } : {};

        const [operators, total] = await Promise.all([
            prismaClient.operator.findMany({
                where: whereClause,
                take: searchRequest.limit,
                skip: skip,
            }),
            prismaClient.operator.count({
                where: whereClause,
            })
        ]);



        return {
            data: operators.map(toOperatorResponse),
            pagination: {
                curr_page: searchRequest.page,
                total_page: Math.ceil(total / searchRequest.limit),
                limit: searchRequest.limit,
                total: total
            }
        };
    }


    static async show(id: number) {

        if (isNaN(id)) {
            throw new ResponseError(400, "Invalid id");
        }

        const operator = await prismaClient.operator.findUnique({
            where: {
                id: id
            }
        });

        if (!operator) {
            throw new ResponseError(404, "Operator not found");
        }

        return toOperatorResponse(operator);
    }



    static async remove(id: number) {

        if (isNaN(id)) {
            throw new ResponseError(400, "Invalid id");
        }

        const idISValid = await prismaClient.operator.findUnique({
            where: {
                id: id
            }
        });

        if (!idISValid) {
            throw new ResponseError(404, "Operator not found");
        }

        await prismaClient.operator.delete({
            where: {
                id: id
            }
        });
    }


}


