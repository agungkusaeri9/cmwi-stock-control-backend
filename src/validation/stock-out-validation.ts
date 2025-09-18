import { z, ZodType } from "zod";

export class StockOutValidation {
  static readonly CREATE: ZodType = z.object({
    kanban_code: z.string().min(1).max(100),
    quantity: z.number().min(1).positive(),
    sub_machine_id: z.number().min(1).positive(),
    machine_area_id: z.number().min(1).positive(),
    requester_id: z.number().min(1).positive(),
  });

  static readonly CREATE_MANY: ZodType = z.array(this.CREATE);

  static readonly UPDATE: ZodType = z.object({
    quantity: z.number().min(0),
  });

  static readonly SEARCH: ZodType = z.object({
    keyword: z.string().optional(),
    page: z.number().min(1).positive().optional(),
    limit: z.number().min(1).positive().optional(),
    paginate: z.boolean().optional(),
    start_date: z.coerce.date().nullable().optional(),
    end_date: z.coerce.date().nullable().optional(),
    machine_id: z.number().min(1).positive().optional(),
    sub_machine_id: z.number().min(1).positive().optional(),
    machine_area_id: z.number().min(1).positive().optional(),
    operator_id: z.number().min(1).positive().optional(),
    requester_id: z.number().min(1).positive().optional(),
  });
}
