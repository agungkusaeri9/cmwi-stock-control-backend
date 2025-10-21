import { z } from "zod";

export class KanbanStaggingValidation {
  static readonly SEARCH = z.object({
    keyword: z.string().optional(),
    page: z.number().optional(),
    limit: z.number().optional(),
    paginate: z.boolean().optional(),
    start_date: z.date().optional(),
    end_date: z.date().optional(),
  });

  static readonly ASSIGN_TO_PARENT = z.object({
    kanban_stagging_id: z.number(),
    parent_kanban_code: z.string().min(1),
  });

  static readonly FORWARD_TO_MASTER = z.object({
    kanban_stagging_id: z.number(),
    code: z.string().min(1),
    description: z.string().min(1),
    specification: z.string().nullish(),
    min_quantity: z.number(),
    max_quantity: z.number().nullish(),
    balance: z.number().nullish(),
    uom: z.string().nullish(),
    lead_time: z.number().nullish(),
    rack_id: z.number().min(0),
    machine_id: z.number().min(0).optional().nullable(),
    machine_area_id: z.number().min(0).optional().nullable(),
    supplier_id: z.number().min(0).optional().nullable(),
    maker_id: z.number().min(0),
    rank: z.string().nullish(),
    order_point: z.number().nullish(),
    currency: z.string().nullish(),
    price: z.number().nullish(),
    safety_stock: z.number().nullish(),
  });
}
