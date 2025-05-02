import { Kanban } from "@prisma/client";
import { SparePartResponse } from "./spare-part-model";
import { SupplierResponse } from "./supplier-model";
import { MakerResponse } from "./maker-model";
import { RackResponse } from "./rack-model";



export type KanbanResponse = {
    id: number;
    js_code: string;
    quantity: number;
    lead_time: number;
    spare_part: SparePartResponse | null;
    supplier: SupplierResponse | null;
    maker: MakerResponse | null;
    rack: RackResponse | null;
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
    paginate?: boolean;
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
