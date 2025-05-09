import { z, ZodType } from "zod";

export class KanbanValidation {

    static readonly CREATE: ZodType = z.object({
        code: z.string().min(1).max(100),
        min_quantity: z.number().min(0).positive(),
        max_quantity: z.number().min(0).positive(),
        description: z.string().min(1).max(100),
        specification: z.string().min(1).max(100),
        balance: z.number().min(0).positive(),
        uom: z.string().min(1).max(100),
        lead_time: z.number().min(1).positive(),
        rack_id: z.number().min(1).positive(),
        machine_id: z.number().min(1).positive(),
        machine_area_id: z.number().min(1).positive(),
    });

    static readonly UPDATE: ZodType = z.object({
        code: z.string().min(1).max(100),
        min_quantity: z.number().min(0).positive(),
        max_quantity: z.number().min(0).positive(),
        description: z.string().min(1).max(100),
        specification: z.string().min(1).max(100),
        balance: z.number().min(0).positive(),
        uom: z.string().min(1).max(100),
        lead_time: z.number().min(1).positive(),
        rack_id: z.number().min(1).positive(),
        machine_id: z.number().min(1).positive(),
        machine_area_id: z.number().min(1).positive(),
    });


    static readonly SEARCH: ZodType = z.object({
        keyword: z.string().optional(),
        page: z.number().min(1).positive().optional(),
        limit: z.number().min(1).max(100).positive().optional(),
        paginate: z.boolean().optional(),
        rack_id: z.number().min(1).positive().optional(),
        machine_area_id: z.number().min(1).positive().optional(),
        machine_id: z.number().min(1).positive().optional(),
    })
}
