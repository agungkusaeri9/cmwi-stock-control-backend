import { Department, MachineArea, Rack, SparePart } from "@prisma/client";

export type SparePartResponse = {
    id: number;
    name: string;
    part_number: string;
    minimum_quantity: number;
    balance: number;
    department: Department | null;
    machine_area: MachineArea | null;
    rack: Rack | null;
};

export type SparePartResponseSimple = {
    id: number;
    name: string;
    part_number: string;
}



export type CreateSparePartRequest = {
    name: string;
    part_number: string;
    minimum_quantity: number;
    balance: number;
    department_id: number;
    machine_area_id: number;
    rack_id: number;
}

export type UpdateSparePartRequest = {
    name: string;
    part_number: string;
    minimum_quantity: number;
    department_id: number;
    machine_area_id: number;
    rack_id: number;
}

export type SearchSparePartRequest = {
    keyword?: string;
    page: number;
    limit: number;
}

export function toSparePartResponse(sparePart: any): SparePartResponse {
    return {
        id: sparePart.id,
        name: sparePart.name,
        part_number: sparePart.part_number,
        minimum_quantity: sparePart.minimum_quantity,
        balance: sparePart.balance,
        department: sparePart.Department ?? null,
        machine_area: sparePart.MachineArea ?? null,
        rack: sparePart.Rack ?? null,
    };
}



