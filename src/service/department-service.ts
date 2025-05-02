import { DepartmentResponse, CreateDepartmentRequest, UpdateDepartmentRequest, toDepartmentResponse, SearchDepartmentRequest } from "../model/department-model";
import { Validation } from "../validation/validation";
import { DepartmentValidation } from "../validation/department-validation";
import { Department } from "@prisma/client";
import { prismaClient } from "../application/database";
import { logger } from "../application/logging";
import { ResponseError } from "../error/response-error";
import { Pageable } from "../model/page";


export class DepartmentService {

    static async create(request: CreateDepartmentRequest): Promise<DepartmentResponse> {
        const createRequest = Validation.validate(DepartmentValidation.CREATE, request);


        const isCodeExist = await prismaClient.department.findFirst({
            where: {
                code: createRequest.code
            }
        });

        if (isCodeExist) {
            throw new ResponseError(400, "Code already exists");
        }

        const isNumberExist = await prismaClient.department.findFirst({
            where: {
                number: createRequest.number
            }
        })

        if (isNumberExist) {
            throw new ResponseError(400, "Number already exists");
        }

        const Department = await prismaClient.department.create({
            data: createRequest
        });

        return toDepartmentResponse(Department);
    }


    static async update(id: number, request: UpdateDepartmentRequest): Promise<DepartmentResponse> {

        if (isNaN(id)) {
            throw new ResponseError(400, "Invalid id");
        }

        const idISValid = await prismaClient.department.findUnique({
            where: {
                id: id
            }
        });

        if (!idISValid) {
            throw new ResponseError(404, "Department not found");
        }

        const updateRequest = Validation.validate(DepartmentValidation.UPDATE, request);

        const isCodeExist = await prismaClient.department.findFirst({
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


        const isNumberExist = await prismaClient.department.findFirst({
            where: {
                number: updateRequest.number
            }
        })

        if (isNumberExist) {
            throw new ResponseError(400, "Number already exists");
        }

        const Department = await prismaClient.department.update({
            where: {
                id: id
            },
            data: updateRequest
        });

        return toDepartmentResponse(Department);
    }


    static async get(request: SearchDepartmentRequest): Promise<Pageable<DepartmentResponse>> {


        const searchRequest = Validation.validate(DepartmentValidation.SEARCH, request);

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
            prismaClient.department.findMany({
                where: whereClause,
                take: searchRequest.limit,
                skip: skip,
            }),
            prismaClient.department.count({
                where: whereClause,
            })
        ]);



        return {
            data: departmens.map(toDepartmentResponse),
            pagination: {
                curr_page: searchRequest.page,
                total_page: Math.ceil(total / searchRequest.limit),
                limit: searchRequest.limit,
                total: total
            }
        };
    }

    static async show(id: number): Promise<DepartmentResponse> {

        if (isNaN(id)) {
            throw new ResponseError(400, "Invalid id");
        }

        const Department = await prismaClient.department.findUnique({
            where: {
                id: id
            }
        });

        if (!Department) {
            throw new ResponseError(404, "Department not found");
        }

        return toDepartmentResponse(Department);
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
            throw new ResponseError(404, "Department not found");
        }

        await prismaClient.department.delete({
            where: {
                id: id
            }
        });
    }


}


