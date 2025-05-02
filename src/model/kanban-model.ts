import { Kanban, SparePart } from "@prisma/client";
import { SparePartResponseSimple } from "./spare-part-model";



export type KanbanResponse = {
    id: number;
    code: string;
    name: string;
    quantity: number;
    spare_part: SparePartResponseSimple;

}

export type CreateKanbanRequest = {
    code: string;
    name: string;
    quantity: number;
    spare_part_id: number;
}

export type UpdateKanbanRequest = {
    name?: string;
    code?: string;
    quantity?: number;
    spare_part_id: number;
}

export type SearchKanbanRequest = {
    keyword?: string;
    page: number;
    limit: number;
}

export function toKanbanResponse(Kanban: Kanban & { spare_part: SparePart }): KanbanResponse {
    return {
        id: Kanban.id,
        name: Kanban.name,
        code: Kanban.code,
        quantity: Kanban.quantity,
        spare_part: {
            id: Kanban.spare_part.id,
            name: Kanban.spare_part.name,
            part_number: Kanban.spare_part.part_number
        }
    }
}
