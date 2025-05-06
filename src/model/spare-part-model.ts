import { DepartmentResponse } from "./department-model";
import { MachineAreaResponse } from "./machine-area-model";
import { RackResponse } from "./rack-model";

export type SparePartResponse = {
    id: number;
    name: string;
    part_number: string;
    minimum_quantity: number;
    maximum_quantity: number;
    balance: number;
    specification: string;
    department: DepartmentResponse | null;
    machine_area: MachineAreaResponse | null;
    rack: RackResponse | null;
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
    maximum_quantity: number;
    balance: number;
    specification: string;
    department_id: number;
    machine_area_id: number;
    rack_id: number;
}

export type UpdateSparePartRequest = {
    name: string;
    part_number: string;
    minimum_quantity: number;
    maximum_quantity: number;
    specification: string;
    department_id: number;
    machine_area_id: number;
    rack_id: number;
}

export type SearchSparePartRequest = {
    keyword?: string;
    page: number;
    limit: number;
    paginate?: boolean;
    department_id?: number;
    machine_area_id?: number;
    rack_id?: number;
}

export function toSparePartResponse(sparePart: any): SparePartResponse {
    return {
        id: sparePart.id,
        name: sparePart.name,
        part_number: sparePart.part_number,
        minimum_quantity: sparePart.minimum_quantity,
        maximum_quantity: sparePart.maximum_quantity,
        balance: sparePart.balance,
        specification: sparePart.specification,
        department: sparePart.Department ?? null,
        machine_area: sparePart.MachineArea ?? null,
        rack: sparePart.Rack ?? null,
    };
}



