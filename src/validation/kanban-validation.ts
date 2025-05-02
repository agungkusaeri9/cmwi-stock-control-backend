import { z, ZodType } from "zod";

export class KanbanValidation {

    static readonly CREATE: ZodType = z.object({
        code: z.string().min(1).max(100),
        name: z.string().min(1).max(100),
        quantity: z.number().min(1).positive(),
        spare_part_id: z.number().min(1).positive()
    });

    static readonly UPDATE: ZodType = z.object({
        code: z.string().min(1).max(100),
        name: z.string().min(1).max(100),
        quantity: z.number().min(1).positive(),
        spare_part_id: z.number().min(1).positive()
    });


    static readonly SEARCH: ZodType = z.object({
        keyword: z.string().optional(),
        page: z.number().min(1).positive().optional(),
        limit: z.number().min(1).max(100).positive().optional(),
    })
}
