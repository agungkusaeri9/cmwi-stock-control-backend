import { MachineArea } from "@prisma/client";

export type MachineAreaResponse = {
    id: number;
    code: string;
    name: string;
}

export type CreateMachineAreaRequest = {
    code: string;
    name: string;
}

export type UpdateMachineAreaRequest = {
    name?: string;
    code?: string;
}

export type SearchMachineAreaRequest = {
    keyword?: string;
    page: number;
    limit: number;
}

export function toMachineAreaResponse(machineArea: MachineArea): MachineAreaResponse {
    return {
        id: machineArea.id,
        name: machineArea.name,
        code: machineArea.code
    }
}
