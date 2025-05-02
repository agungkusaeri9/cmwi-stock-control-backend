import { Department } from "@prisma/client";

export type DepartmentResponse = {
    id: number;
    code: string;
    name: string;
    number: string;
}

export type CreateDepartmentRequest = {
    code: string;
    name: string;
    number: string;
}

export type UpdateDepartmentRequest = {
    name?: string;
    code?: string;
    number?: string;
}

export type SearchDepartmentRequest = {
    keyword?: string;
    page: number;
    limit: number;
    paginate?: boolean;
}

export function toDepartmentResponse(Department: Department): DepartmentResponse {
    return {
        id: Department.id,
        name: Department.name,
        code: Department.code,
        number: Department.number
    }
}
