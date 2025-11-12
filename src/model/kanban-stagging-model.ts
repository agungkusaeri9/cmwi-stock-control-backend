import { KanbanStagging } from "@prisma/client";

export type KanbanStaggingResponse = {
  id: number;
  kanban_code: string;
  description: string | null;
  incoming_order_stock: number;
  created_at: Date;
};

export type SearchKanbanStaggingRequest = {
  keyword?: string;
  page: number;
  limit: number;
  paginate?: boolean;
  start_date?: Date;
  end_date?: Date;
};

export type AssignToParentRequest = {
  kanban_stagging_id: number;
  parent_kanban_code: string;
};

export type ForwardToMasterRequest = {
  kanban_stagging_id: number;
  code: string;
  description: string | null;
  specification: string | null;
  min_quantity: number;
  max_quantity: number;
  balance: number;
  uom: string;
  lead_time: number;
  rack_id: number;
  machine_area_id: number | null;
  machine_id: number | null;
  supplier_id: number | null;
  maker_id: number | null;
  rank: string;
  order_point: number;
  currency: string;
  price: number;
  safety_stock: number;
};

export function toKanbanStaggingResponse(
  data: KanbanStagging
): KanbanStaggingResponse {
  return {
    id: data.id,
    kanban_code: data.kanban_code,
    description: data.description ?? null,
    incoming_order_stock: data.incoming_order_stock,
    created_at: data.created_at,
  };
}
