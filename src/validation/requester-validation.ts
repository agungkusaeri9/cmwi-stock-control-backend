import { z, ZodType } from "zod";

export class RequesterValidation {
  static readonly CREATE: ZodType = z.object({
    nik: z.string().min(1).max(100),
    name: z.string().min(1).max(100),
    group_id: z.number().min(1).positive().nullable(),
  });

  static readonly UPDATE: ZodType = z.object({
    nik: z.string().min(1).max(100),
    name: z.string().min(1).max(100),
    group_id: z.number().min(1).positive().nullable(),
  });

  static readonly SEARCH: ZodType = z.object({
    keyword: z.string().optional(),
    page: z.number().min(1).positive().optional(),
    limit: z.number().min(1).positive().optional(),
    paginate: z.boolean().optional(),
  });
}
