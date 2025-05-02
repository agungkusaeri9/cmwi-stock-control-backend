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


        const isJsCodeExist = await prismaClient.kanban.findFirst({
            where: {
                js_code: createRequest.js_code
            }
        });

        if (isJsCodeExist) {
            throw new ResponseError(400, "JsCode already exists");
        }

        // Validasi foreign key: supplier_id
        const isSupplierExist = await prismaClient.supplier.findUnique({
            where: { id: createRequest.supplier_id }
        });
        if (!isSupplierExist) {
            throw new ResponseError(404, "Supplier not found");
        }

        // Validasi foreign key: maker_id
        const isMakerExist = await prismaClient.maker.findUnique({
            where: { id: createRequest.maker_id }
        });
        if (!isMakerExist) {
            throw new ResponseError(404, "Maker not found");
        }


        // Validasi foreign key: rack_id
        const isRackExist = await prismaClient.rack.findUnique({
            where: { id: createRequest.rack_id }
        });
        if (!isRackExist) {
            throw new ResponseError(404, "Rack not found");
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
                spare_part: true,
                supplier: true,
                maker: true,
                rack: true
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

        const isJsCodeExist = await prismaClient.kanban.findFirst({
            where: {
                js_code: updateRequest.js_code,
                NOT: {
                    id: id
                }
            }
        });

        if (isJsCodeExist) {
            throw new ResponseError(400, "JsCode already exists");
        }

        // Validasi foreign key: spare_part_id
        const isSparePartExist = await prismaClient.sparePart.findUnique({
            where: { id: updateRequest.spare_part_id }
        });
        if (!isSparePartExist) {
            throw new ResponseError(404, "Spare Part not found");
        }


        // Validasi foreign key: supplier_id
        const isSupplierExist = await prismaClient.supplier.findUnique({
            where: { id: updateRequest.supplier_id }
        });
        if (!isSupplierExist) {
            throw new ResponseError(404, "Supplier not found");
        }

        // Validasi foreign key: maker_id
        const isMakerExist = await prismaClient.maker.findUnique({
            where: { id: updateRequest.maker_id }
        });
        if (!isMakerExist) {
            throw new ResponseError(404, "Maker not found");
        }


        // Validasi foreign key: rack_id
        const isRackExist = await prismaClient.rack.findUnique({
            where: { id: updateRequest.rack_id }
        });
        if (!isRackExist) {
            throw new ResponseError(404, "Rack not found");
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
                        js_code: {
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

        const [kanbans, total] = await Promise.all([
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
            data: kanbans.map(toKanbanResponse),
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

        const idISValid = await prismaClient.kanban.findUnique({
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


