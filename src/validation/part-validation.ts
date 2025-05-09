import { z, ZodType } from "zod";

export class PartValidation {

    static readonly CREATE: ZodType = z.object({

        part_number: z.string().min(1).max(100),
        minimum_quantity: z.number().min(0).positive(),
        maximum_quantity: z.number().min(0).positive(),
        balance: z.number().min(0).positive(),
        specification: z.string().min(1).max(100),

    });

    static readonly UPDATE: ZodType = z.object({

        part_number: z.string().min(1).max(100),
        minimum_quantity: z.number().min(1).positive(),
        maximum_quantity: z.number().min(0).positive(),
        specification: z.string().min(1).max(100),

    });


    static readonly SEARCH: ZodType = z.object({
        keyword: z.string().optional(),
        page: z.number().min(1).positive().optional(),
        limit: z.number().min(1).max(100).positive().optional(),
        paginate: z.boolean().optional(),

    })
}
