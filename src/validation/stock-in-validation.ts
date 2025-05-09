import { z, ZodType } from "zod";

export class StockInValidation {

    static readonly CREATE: ZodType = z.object({
        code: z.string().min(1).max(100),
        quantity: z.number().min(0).positive(),
    });

    static readonly SEARCH: ZodType = z.object({
        keyword: z.string().optional(),
        page: z.number().min(1).positive().optional(),
        limit: z.number().min(1).max(100).positive().optional(),
        paginate: z.boolean().optional()
    })
}
