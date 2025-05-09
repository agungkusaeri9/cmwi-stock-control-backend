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

        // Validasi unique: part_code
        const isPartExist = await prismaClient.kanban.findUnique({
            where: { code: createRequest.code }
        });
        if (isPartExist) {
            throw new ResponseError(404, "Code already exist");
        }

        // Validasi foreign key: rack_id
        const isRackExist = await prismaClient.rack.findUnique({
            where: { id: createRequest.rack_id }
        });
        if (!isRackExist) {
            throw new ResponseError(404, "Rack not found");
        }


        // Validasi foreign key: machine_area_id
        const isMachineAreaExist = await prismaClient.machineArea.findUnique({
            where: { id: createRequest.machine_area_id }
        });
        if (!isMachineAreaExist) {
            throw new ResponseError(404, "Machine Area not found");
        }

        // Validasi foreign key: machine_id
        const isMachineExist = await prismaClient.machine.findUnique({
            where: { id: createRequest.machine_id }
        });
        if (!isMachineExist) {
            throw new ResponseError(404, "Machine not found");
        }


        const Kanban = await prismaClient.kanban.create({
            data: createRequest,
            include: {
                Rack: true,
                MachineArea: true,
                Machine: true
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

        // Validasi unique: part_code
        const isPartExist = await prismaClient.kanban.findUnique({
            where: { code: updateRequest.code }
        });
        if (isPartExist) {
            throw new ResponseError(404, "Code already exist");
        }

        // Validasi foreign key: rack_id
        const isRackExist = await prismaClient.rack.findUnique({
            where: { id: updateRequest.rack_id }
        });
        if (!isRackExist) {
            throw new ResponseError(404, "Rack not found");
        }


        // Validasi foreign key: machine_area_id
        const isMachineAreaExist = await prismaClient.machineArea.findUnique({
            where: { id: updateRequest.machine_area_id }
        });
        if (!isMachineAreaExist) {
            throw new ResponseError(404, "Machine Area not found");
        }

        // Validasi foreign key: machine_id
        const isMachineExist = await prismaClient.machine.findUnique({
            where: { id: updateRequest.machine_id }
        });
        if (!isMachineExist) {
            throw new ResponseError(404, "Machine not found");
        }






        const Kanban = await prismaClient.kanban.update({
            where: {
                id: id
            },
            data: updateRequest,
            include: {
                Rack: true,
                MachineArea: true,
                Machine: true
            }
        });

        return toKanbanResponse(Kanban);
    }


    static async get(request: SearchKanbanRequest): Promise<Pageable<KanbanResponse>> {


        const searchRequest = Validation.validate(KanbanValidation.SEARCH, request);



        const filters: any[] = [];

        if (searchRequest.keyword) {
            filters.push({
                OR: [
                    {
                        part_code: {
                            contains: searchRequest.keyword

                        }
                    },
                ]
            });
        }


        if (searchRequest.rack_id) {
            filters.push({
                rack_id: searchRequest.rack_id,
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

        const whereClause = filters.length > 0 ? { AND: filters } : {};

        // Default pagination values if not provided
        const page = searchRequest.page || 1;
        const limit = searchRequest.limit || 10;

        const skip = (page - 1) * limit;

        const [kanbans, total] = await Promise.all([
            prismaClient.kanban.findMany({
                where: whereClause,
                ...(searchRequest.paginate ? { take: limit, skip } : {}),
                include: {
                    Rack: true,
                    MachineArea: true,
                    Machine: true
                }
            }),
            prismaClient.kanban.count({
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
            data: kanbans.map(toKanbanResponse),
            ...(pagination ? { pagination } : {})

        };
    }

    static async show(identifier: number | string): Promise<KanbanResponse> {
        let kanban;

        if (typeof identifier === "number" || (!isNaN(Number(identifier)) && Number(identifier) > 0)) {
            kanban = await prismaClient.kanban.findUnique({
                where: {
                    id: Number(identifier),
                },
                include: {
                    Rack: true,
                    MachineArea: true,
                    Machine: true,
                },
            });
        } else if (typeof identifier === "string") {
            kanban = await prismaClient.kanban.findUnique({
                where: {
                    code: identifier,
                },
                include: {
                    Rack: true,
                    MachineArea: true,
                    Machine: true,
                },
            });
        } else {
            throw new ResponseError(400, "Invalid identifier");
        }

        if (!kanban) {
            throw new ResponseError(404, "Kanban not found");
        }

        return toKanbanResponse(kanban);
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


