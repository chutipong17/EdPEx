import { z } from "zod";

export const DashboardDto = z.object({
  year: z.number().int().nullish().transform((value) => value ?? undefined),
  kpiCategoryId: z.number().int().nullish().transform((value) => value ?? undefined),
  departmentId: z.number().int().nullish().transform((value) => value ?? undefined)
});

export type DashboardDto = z.infer<typeof DashboardDto>;
