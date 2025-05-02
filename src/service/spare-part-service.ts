import { SparePartResponse, CreateSparePartRequest, UpdateSparePartRequest, toSparePartResponse, SearchSparePartRequest } from "../model/spare-part-model";
import { Validation } from "../validation/validation";
import { SparePartValidation } from "../validation/spare-part-validation";
import { SparePart } from "@prisma/client";
import { prismaClient } from "../application/database";
import { logger } from "../application/logging";
import { ResponseError } from "../error/response-error";
import { Pageable } from "../model/page";


export class SparePartService {
    static async create(request: CreateSparePartRequest): Promise<SparePartResponse> {
        const createRequest = Validation.validate(SparePartValidation.CREATE, request);

        const isCodeExist = await prismaClient.sparePart.findFirst({
            where: { part_number: createRequest.part_number },
        });

        if (isCodeExist) {
            throw new ResponseError(400, "Code already exists");
        }


        const isNameExist = await prismaClient.sparePart.findFirst({
            where: { name: createRequest.name },
        });

        if (isNameExist) {
            throw new ResponseError(400, "Name already exists");
        }


        // Validasi foreign key: department_id
        const isDepartmentExist = await prismaClient.department.findUnique({
            where: { id: createRequest.department_id }
        });
        if (!isDepartmentExist) {
            throw new ResponseError(404, "Department not found");
        }

        // Validasi foreign key: machine_area_id
        const isMachineAreaExist = await prismaClient.machineArea.findUnique({
            where: { id: createRequest.machine_area_id }
        });
        if (!isMachineAreaExist) {
            throw new ResponseError(404, "Machine area not found");
        }

        // Validasi foreign key: rack_id
        const isRackExist = await prismaClient.rack.findUnique({
            where: { id: createRequest.rack_id }
        });
        if (!isRackExist) {
            throw new ResponseError(404, "Rack not found");
        }


        const sparePart = await prismaClient.sparePart.create({
            data: createRequest,
            include: {
                Department: true,
                MachineArea: true,
                Rack: true,
            },
        });

        return toSparePartResponse(sparePart);
    }

    static async update(id: number, request: UpdateSparePartRequest): Promise<SparePartResponse> {

        if (isNaN(id)) {
            throw new ResponseError(400, "Invalid id");
        }

        const idISValid = await prismaClient.sparePart.findUnique({
            where: {
                id: id
            }
        });

        if (!idISValid) {
            throw new ResponseError(404, "Spare part not found");
        }

        const updateRequest = Validation.validate(SparePartValidation.UPDATE, request);

        const isCodeExist = await prismaClient.sparePart.findFirst({
            where: {
                part_number: updateRequest.part_number,
                NOT: { id },
            },
        });

        if (isCodeExist) {
            throw new ResponseError(400, "Code already exists");
        }


        const isNameExist = await prismaClient.sparePart.findFirst({
            where: {
                name: updateRequest.name,
                NOT: { id },
            },
        });

        if (isNameExist) {
            throw new ResponseError(400, "Name already exists");
        }


        // Validasi foreign key: department_id
        const isDepartmentExist = await prismaClient.department.findUnique({
            where: { id: updateRequest.department_id }
        });
        if (!isDepartmentExist) {
            throw new ResponseError(404, "Department not found");
        }

        // Validasi foreign key: machine_area_id
        const isMachineAreaExist = await prismaClient.machineArea.findUnique({
            where: { id: updateRequest.machine_area_id }
        });
        if (!isMachineAreaExist) {
            throw new ResponseError(404, "Machine area not found");
        }

        // Validasi foreign key: rack_id
        const isRackExist = await prismaClient.rack.findUnique({
            where: { id: updateRequest.rack_id }
        });
        if (!isRackExist) {
            throw new ResponseError(404, "Rack not found");
        }

        const sparePart = await prismaClient.sparePart.update({
            where: { id },
            data: updateRequest,
            include: {
                Department: true,
                MachineArea: true,
                Rack: true,
            },
        });

        return toSparePartResponse(sparePart);
    }

    static async get(request: SearchSparePartRequest): Promise<Pageable<SparePartResponse>> {
        const searchRequest = Validation.validate(SparePartValidation.SEARCH, request);
        const skip = (searchRequest.page - 1) * searchRequest.limit;

        const filters: any[] = [];

        if (searchRequest.keyword) {
            filters.push({
                OR: [
                    {
                        part_number: {
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

        const [spareParts, total] = await Promise.all([
            prismaClient.sparePart.findMany({
                where: whereClause,
                take: searchRequest.limit,
                skip: skip,
                include: {
                    Department: true,
                    MachineArea: true,
                    Rack: true,
                },
            }),
            prismaClient.sparePart.count({
                where: whereClause,
            }),
        ]);

        return {
            data: spareParts.map(toSparePartResponse),
            pagination: {
                curr_page: searchRequest.page,
                total_page: Math.ceil(total / searchRequest.limit),
                limit: searchRequest.limit,
                total: total,
            },
        };
    }

    static async show(id: number): Promise<SparePartResponse> {
        if (isNaN(id)) {
            throw new ResponseError(400, "Invalid id");
        }

        const sparePart = await prismaClient.sparePart.findUnique({
            where: { id },
            include: {
                Department: true,
                MachineArea: true,
                Rack: true,
            },
        });

        if (!sparePart) {
            throw new ResponseError(404, "Spare Part not found");
        }

        return toSparePartResponse(sparePart);
    }

    static async remove(id: number): Promise<void> {
        if (isNaN(id)) {
            throw new ResponseError(400, "Invalid id");
        }


        const idISValid = await prismaClient.sparePart.findUnique({
            where: {
                id: id
            }
        });

        if (!idISValid) {
            throw new ResponseError(404, "Spare part not found");
        }

        await prismaClient.sparePart.delete({
            where: { id },
        });
    }
}
