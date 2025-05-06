import { z, ZodType } from "zod";

export class SparePartValidation {

    static readonly CREATE: ZodType = z.object({
        name: z.string().min(1).max(100),
        part_number: z.string().min(1).max(100),
        minimum_quantity: z.number().min(0).positive(),
        maximum_quantity: z.number().min(0).positive(),
        balance: z.number().min(0).positive(),
        specification: z.string().min(1).max(100),
        department_id: z.number().min(1).positive(),
        machine_area_id: z.number().min(1).positive(),
        rack_id: z.number().min(1).positive(),
    });

    static readonly UPDATE: ZodType = z.object({
        name: z.string().min(1).max(100),
        part_number: z.string().min(1).max(100),
        minimum_quantity: z.number().min(1).positive(),
        maximum_quantity: z.number().min(0).positive(),
        specification: z.string().min(1).max(100),
        department_id: z.number().min(1).positive(),
        machine_area_id: z.number().min(1).positive(),
        rack_id: z.number().min(1).positive(),
    });


    static readonly SEARCH: ZodType = z.object({
        keyword: z.string().optional(),
        page: z.number().min(1).positive().optional(),
        limit: z.number().min(1).max(100).positive().optional(),
        paginate: z.boolean().optional(),
        department_id: z.number().min(1).positive().optional(),
        machine_area_id: z.number().min(1).positive().optional(),
        rack_id: z.number().min(1).positive().optional(),
    })
}
