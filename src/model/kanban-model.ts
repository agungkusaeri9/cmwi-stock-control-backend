import { Rack, MachineArea, Machine, Supplier } from "@prisma/client";

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
    supplier: Supplier[] | null;
    js_ending_quantity: number | null;

}

export type KanbanRawEntry = {
    [key: string]: any;
    "CODE JS SYSTEM"?: any;
    AREA?: any;
    MESIN?: any;
    "CODE RACK"?: any;
    DESCRIPTION?: any;
    SPESIFICATION?: any;
    MAKER?: any;
    SUPPLIER?: any;
    CURRENCY?: any;
    PRICE?: any;
    "Safety Stock"?: any;
    RANK?: any;
    UoM?: any;
    "Minimal Stock"?: any;
    "Maximal Stock"?: any;
    "BEGINING BALANCE"?: any;
    "Lead Time"?: any;
    "Order Point"?: any;
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
    supplier_id?: number;
    maker_id?: number;
    rank?: string;
    order_point?: number;
    currency?: string;
    price?: number;
    safety_stock?: number;


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
        rack: Kanban.rack || null,
        machine_area: Kanban.machine_area || null,
        machine: Kanban.machine || null,
        stock_in_quantity: Kanban.stock_in_quantity,
        supplier: Kanban.supplier,
        js_ending_quantity: Kanban.js_ending_quantity
    }
}