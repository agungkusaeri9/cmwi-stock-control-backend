import { PartResponse, CreatePartRequest, UpdatePartRequest, toPartResponse, SearchPartRequest } from "../model/part-model";
import { Validation } from "../validation/validation";
import { PartValidation } from "../validation/part-validation";
import { Part } from "@prisma/client";
import { prismaClient } from "../application/database";
import { logger } from "../application/logging";
import { ResponseError } from "../error/response-error";
import { Pageable } from "../model/page";


export class PartService {
    static async create(request: CreatePartRequest): Promise<PartResponse> {
        const createRequest = Validation.validate(PartValidation.CREATE, request);

        const isCodeExist = await prismaClient.part.findFirst({
            where: { code: createRequest.code },
        });

        if (isCodeExist) {
            throw new ResponseError(400, "Code already exists");
        }

        const part = await prismaClient.part.create({
            data: createRequest,
        });

        return toPartResponse(part);
    }

    static async update(id: number, request: UpdatePartRequest): Promise<PartResponse> {

        if (isNaN(id)) {
            throw new ResponseError(400, "Invalid id");
        }

        const idISValid = await prismaClient.part.findUnique({
            where: {
                id: id
            }
        });

        if (!idISValid) {
            throw new ResponseError(404, "Spare part not found");
        }

        const updateRequest = Validation.validate(PartValidation.UPDATE, request);

        const isCodeExist = await prismaClient.part.findFirst({
            where: {
                code: updateRequest.code,
                NOT: { id },
            },
        });

        if (isCodeExist) {
            throw new ResponseError(400, "Code already exists");
        }

        const part = await prismaClient.part.update({
            where: { id },
            data: updateRequest,
        });

        return toPartResponse(part);
    }

    static async get(request: SearchPartRequest): Promise<Pageable<PartResponse>> {
        const searchRequest = Validation.validate(PartValidation.SEARCH, request);


        const filters: any[] = [];

        if (searchRequest.keyword) {
            filters.push({
                OR: [
                    {
                        code: {
                            contains: searchRequest.keyword,

                        },
                    },
                    {
                        name: {
                            contains: searchRequest.keyword,

                        },
                    },
                ],
            });
        }




        const whereClause = filters.length > 0 ? { AND: filters } : {};

        // Default pagination values if not provided
        const page = searchRequest.page || 1;
        const limit = searchRequest.limit || 10;

        const skip = (page - 1) * limit;

        const [parts, total] = await Promise.all([
            prismaClient.part.findMany({
                where: whereClause,
                ...(searchRequest.paginate ? { take: limit, skip } : {}),

            }),
            prismaClient.part.count({
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
            data: parts.map(toPartResponse),
            ...(pagination ? { pagination } : {})

        };
    }

    static async show(id: number): Promise<PartResponse> {
        if (isNaN(id)) {
            throw new ResponseError(400, "Invalid id");
        }

        const part = await prismaClient.part.findUnique({
            where: { id },

        });

        if (!part) {
            throw new ResponseError(404, "Spare Part not found");
        }

        return toPartResponse(part);
    }

    static async remove(id: number): Promise<void> {
        if (isNaN(id)) {
            throw new ResponseError(400, "Invalid id");
        }


        const idISValid = await prismaClient.part.findUnique({
            where: {
                id: id
            }
        });

        if (!idISValid) {
            throw new ResponseError(404, "Spare part not found");
        }

        await prismaClient.part.delete({
            where: { id },
        });
    }
}
