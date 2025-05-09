import { Part } from "@prisma/client";
export type PartResponse = {
    id: number;
    code: string;
    description: string | null;
    specification: string | null;
    min_quantity: number;
    max_quantity: number;
    balance: number;
};

export type PartResponseSimple = {
    id: number;
    name: string;

}



export type CreatePartRequest = {
    name: string;
    code: string;
    description: string;
    specification: string;
    min_quantity: number;
    max_quantity: number;
    balance: number;
}

export type UpdatePartRequest = {
    name: string;
    code: string;
    description: string;
    specification: string;
    min_quantity: number;
    max_quantity: number;
    balance: number;
}

export type SearchPartRequest = {
    keyword?: string;
    page: number;
    limit: number;
    paginate?: boolean;

}

export function toPartResponse(Part: Part): PartResponse {
    return {
        id: Part.id,
        code: Part.code,
        description: Part.description,
        specification: Part.specification,
        min_quantity: Part.min_quantity,
        max_quantity: Part.max_quantity,
        balance: Part.balance
    };
}



