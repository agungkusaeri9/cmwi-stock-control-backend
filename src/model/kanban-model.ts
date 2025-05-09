import { Rack, MachineArea, Machine } from "@prisma/client";

export type KanbanResponse = {
    id: number;
    code: string;
    description: string | null;
    specification: string | null;
    min_quantity: number;
    max_quantity: number;
    balance: number;
    uom: string;
    lead_time: number;
    rack: Rack | null;
    machine_area: MachineArea | null;
    machine: Machine | null;
    stock_in_quantity: number | null;
}



export type CreateKanbanRequest = {

    code: string;
    description: string;
    specification: string;
    min_quantity: number;
    max_quantity: number;
    balance: number;
    uom: string;
    lead_time: number;
    rack_id?: number;
    machine_area_id?: number;
    machine_id?: number;
}

export type UpdateKanbanRequest = {
    code: string;
    description: string;
    specification: string;
    min_quantity: number;
    max_quantity: number;
    balance: number;
    uom: string;
    lead_time: number;
    rack_id: number;
    machine_area_id: number;
    machine_id: number;
}

export type SearchKanbanRequest = {
    keyword?: string;
    page: number;
    limit: number;
    paginate?: boolean;
    rack_id?: number;
    machine_area_id?: number;
    machine_id?: number;
}

export function toKanbanResponse(Kanban: any): KanbanResponse {
    return {
        id: Kanban.id,
        code: Kanban.code,
        specification: Kanban.specification,
        description: Kanban.description,
        min_quantity: Kanban.min_quantity,
        max_quantity: Kanban.max_quantity,
        balance: Kanban.balance,
        uom: Kanban.uom,
        lead_time: Kanban.lead_time,
        rack: Kanban.Rack || null,
        machine_area: Kanban.MachineArea || null,
        machine: Kanban.Machine || null,
        stock_in_quantity: Kanban.stock_in_quantity
    }
}