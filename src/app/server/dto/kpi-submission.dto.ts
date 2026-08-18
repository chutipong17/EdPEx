import { z } from "zod";

// const decimal5_2 = z.coerce
//   .number()
//   .min(0.00)
//   .max(100.00)
//   .transform((val) => Math.round(val * 100) / 100);

const decimal5_2 = z.coerce
  .number()
  .transform((val) => Math.round(val * 100) / 100)
  .pipe(z.number().min(0).max(100)); // เช็ค range หลัง transform แล้ว

export const KpiSubmissionDto = z.object({
  description: z.string().nullable().optional(),
  actualValue: decimal5_2.nullable().optional(),
  calculatedScore: decimal5_2.nullable().optional(),
  achievementPercent: decimal5_2.nullable().optional(),
});

export type KpiSubmissionDto = z.infer<typeof KpiSubmissionDto>;
