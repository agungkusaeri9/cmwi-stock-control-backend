import { z, ZodType } from "zod";

export class ManualPurchaseOrderValidation {
  static readonly CREATE: ZodType = z.object({
    po_number: z.string().min(1),
    pr_number: z.string().min(1),
    kanban_code: z.string().min(1),
    date: z.coerce.date(),
    quantity: z.number().nonnegative(),
    remark: z.string().nullable().optional(),
  });

  static readonly SEARCH: ZodType = z.object({
    keyword: z.string().optional(),
    po_number: z.string().optional(),
    pr_number: z.string().optional(),
    kanban_code: z.string().optional(),
    page: z.number().min(1).positive().optional(),
    limit: z.number().min(1).positive().optional(),
    paginate: z.boolean().optional(),
    start_date: z.coerce.date().nullable().optional(),
    end_date: z.coerce.date().nullable().optional(),
  });
}
