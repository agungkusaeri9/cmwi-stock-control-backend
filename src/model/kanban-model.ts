
export type KanbanResponse = {
    id: number;
    uom: string;
    lead_time: number;
    part_code: string;
    rack: string | null;
    machine_area: string | null;
    machine: string | null;
}

export type CreateKanbanRequest = {
    uom: string;
    lead_time: number;
    part_code: string;
    rack_id?: number;
    machine_area_id?: number;
    machine_id?: number;
}

export type UpdateKanbanRequest = {
    uom: string;
    lead_time: number;
    part_code: string;
    rack_id: number;
    machine_area_id: number;
    machine_id: number;
}

export type SearchKanbanRequest = {
    keyword?: string;
    page: number;
    limit: number;
    paginate?: boolean;
    part_code?: string;
    rack_id?: number;
    machine_area_id?: number;
    machine_id?: number;
}

export function toKanbanResponse(Kanban: any): KanbanResponse {
    return {
        id: Kanban.id,
        uom: Kanban.uom,
        lead_time: Kanban.lead_time,
        part_code: Kanban.Part?.code || null,
        rack: Kanban.Rack?.code || null,
        machine_area: Kanban.MachineArea?.name || null,
        machine: Kanban.Machine?.code || null
    }
}