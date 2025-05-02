import { Kanban, SparePart, Supplier, Maker, Rack } from "@prisma/client";




export type KanbanResponse = {
    id: number;
    js_code: string;
    quantity: number;
    lead_time: number;
    spare_part: SparePart | null;
    supplier: Supplier | null;
    maker: Maker | null;
    rack: Rack | null;
}

export type CreateKanbanRequest = {
    js_code: string;
    quantity: number;
    lead_time: number;
    spare_part_id: number;
    supplier_id: number;
    maker_id: number;
    rack_id: number;
}

export type UpdateKanbanRequest = {
    js_code: string;
    quantity: number;
    lead_time: number;
    spare_part_id: number;
    supplier_id: number;
    maker_id: number;
    rack_id: number;
}

export type SearchKanbanRequest = {
    keyword?: string;
    page: number;
    limit: number;
}

export function toKanbanResponse(Kanban: any): KanbanResponse {
    return {
        id: Kanban.id,
        js_code: Kanban.js_code,
        quantity: Kanban.quantity,
        lead_time: Kanban.lead_time,
        spare_part: Kanban.spare_part ?? null,
        supplier: Kanban.supplier ?? null,
        maker: Kanban.maker ?? null,
        rack: Kanban.rack ?? null
    }
}
