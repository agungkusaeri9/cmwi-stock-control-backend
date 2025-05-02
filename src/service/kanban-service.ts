import { KanbanResponse, CreateKanbanRequest, UpdateKanbanRequest, toKanbanResponse, SearchKanbanRequest } from "../model/kanban-model";
import { Validation } from "../validation/validation";
import { KanbanValidation } from "../validation/kanban-validation";
import { Kanban } from "@prisma/client";
import { prismaClient } from "../application/database";
import { logger } from "../application/logging";
import { ResponseError } from "../error/response-error";
import { Pageable } from "../model/page";


export class KanbanService {

    static async create(request: CreateKanbanRequest): Promise<KanbanResponse> {
        const createRequest = Validation.validate(KanbanValidation.CREATE, request);


        const isCodeExist = await prismaClient.kanban.findFirst({
            where: {
                code: createRequest.code
            }
        });

        if (isCodeExist) {
            throw new ResponseError(400, "Code already exists");
        }


        // Validasi foreign key: spare_part_id
        const isSparePartExist = await prismaClient.sparePart.findUnique({
            where: { id: createRequest.spare_part_id }
        });
        if (!isSparePartExist) {
            throw new ResponseError(404, "Spare Part not found");
        }

        const Kanban = await prismaClient.kanban.create({
            data: createRequest,
            include: {
                spare_part: true
            }
        });

        return toKanbanResponse(Kanban);
    }


    static async update(id: number, request: UpdateKanbanRequest): Promise<KanbanResponse> {

        if (isNaN(id)) {
            throw new ResponseError(400, "Invalid id");
        }


        const idISValid = await prismaClient.kanban.findUnique({
            where: {
                id: id
            }
        });

        if (!idISValid) {
            throw new ResponseError(404, "Kanban not found");
        }

        const updateRequest = Validation.validate(KanbanValidation.UPDATE, request);

        const isCodeExist = await prismaClient.kanban.findFirst({
            where: {
                code: updateRequest.code,
                NOT: {
                    id: id
                }
            }
        });

        if (isCodeExist) {
            throw new ResponseError(400, "Code already exists");
        }

        // Validasi foreign key: spare_part_id
        const isSparePartExist = await prismaClient.sparePart.findUnique({
            where: { id: updateRequest.spare_part_id }
        });
        if (!isSparePartExist) {
            throw new ResponseError(404, "Spare Part not found");
        }

        const Kanban = await prismaClient.kanban.update({
            where: {
                id: id
            },
            data: updateRequest,
            include: {
                spare_part: true
            }
        });

        return toKanbanResponse(Kanban);
    }


    static async get(request: SearchKanbanRequest): Promise<Pageable<KanbanResponse>> {


        const searchRequest = Validation.validate(KanbanValidation.SEARCH, request);

        const skip = (searchRequest.page - 1) * searchRequest.limit;

        const filters: any[] = [];

        if (searchRequest.keyword) {
            filters.push({
                OR: [
                    {
                        code: {
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

        const [departmens, total] = await Promise.all([
            prismaClient.kanban.findMany({
                where: whereClause,
                take: searchRequest.limit,
                skip: skip,
                include: {
                    spare_part: true
                }
            }),
            prismaClient.kanban.count({
                where: whereClause,
            })
        ]);



        return {
            data: departmens.map(toKanbanResponse),
            pagination: {
                curr_page: searchRequest.page,
                total_page: Math.ceil(total / searchRequest.limit),
                limit: searchRequest.limit,
                total: total
            }
        };
    }

    static async show(id: number): Promise<KanbanResponse> {

        if (isNaN(id)) {
            throw new ResponseError(400, "Invalid id");
        }

        const Kanban = await prismaClient.kanban.findUnique({
            where: {
                id: id
            },
            include: {
                spare_part: true
            }
        });

        if (!Kanban) {
            throw new ResponseError(404, "Kanban not found");
        }

        return toKanbanResponse(Kanban);
    }


    static async remove(id: number) {


        if (isNaN(id)) {
            throw new ResponseError(400, "Invalid id");
        }

        const idISValid = await prismaClient.department.findUnique({
            where: {
                id: id
            }
        });

        if (!idISValid) {
            throw new ResponseError(404, "Kanban not found");
        }

        await prismaClient.kanban.delete({
            where: {
                id: id
            }
        });

    }


}


