import { z, ZodType } from "zod";

export class KanbanValidation {

    static readonly CREATE: ZodType = z.object({
        js_code: z.string().min(1).max(100),
        lead_time: z.number().min(1).positive(),
        quantity: z.number().min(1).positive(),
        spare_part_id: z.number().min(1).positive(),
        supplier_id: z.number().min(1).positive(),
        maker_id: z.number().min(1).positive(),
        rack_id: z.number().min(1).positive(),

    });

    static readonly UPDATE: ZodType = z.object({
        js_code: z.string().min(1).max(100),
        lead_time: z.number().min(1).positive(),
        quantity: z.number().min(1).positive(),
        spare_part_id: z.number().min(1).positive(),
        supplier_id: z.number().min(1).positive(),
        maker_id: z.number().min(1).positive(),
        rack_id: z.number().min(1).positive(),
    });


    static readonly SEARCH: ZodType = z.object({
        keyword: z.string().optional(),
        page: z.number().min(1).positive().optional(),
        limit: z.number().min(1).max(100).positive().optional(),
        paginate: z.boolean().optional()
    })
}
