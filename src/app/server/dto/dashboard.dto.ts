import { z } from "zod";

export const DashboardDto = z.object({
  year: z.number().int().nullish().transform((value) => value ?? new Date().getFullYear()),
  kpiCategoryId: z.number().int().nullish().transform((value) => value ?? null),
  departmentId: z.number().int().nullish().transform((value) => value ?? null)
});

export const KpiComparisonDashboardDto = z.object({
  year: z.number().int().nullish().transform((value) => value ?? new Date().getFullYear()),
  kpiCategoryId: z.number().int().nullish().transform((value) => value ?? null),
  kpiCode: z.string().nullable().optional().transform((v) => v ?? null),
});

export type DashboardDto = z.infer<typeof DashboardDto>;
export type KpiComparisonDashboardDto = z.infer<typeof KpiComparisonDashboardDto>;
