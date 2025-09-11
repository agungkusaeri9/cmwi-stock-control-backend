import { z, ZodType } from "zod";

export class GroupValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1).max(100),
    description: z.string().min(1).max(100).nullable(),
  });

  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(1).max(100),
    description: z.string().min(1).max(100).nullable(),
  });

  static readonly SEARCH: ZodType = z.object({
    keyword: z.string().optional(),
    page: z.number().min(1).positive().optional(),
    limit: z.number().min(1).positive().optional(),
    paginate: z.boolean().optional(),
  });
}
