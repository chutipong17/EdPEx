import { PrismaClient, Prisma } from "@prisma/client";
import healthcheck from "./data/health-check.json";
import MonthOfDelivery from "./data/month_of_delivery.json";
import permission from "./data/permission.json";
import role from "./data/role.json";
import targetCondition from "./data/target_condition.json";
import frequency from "./data/frequency.json";
import kpiSubmissionStatus from "./data/kpi_submission_status.json";
import approveStatus from "./data/approve_status.json";

const prisma = new PrismaClient();

const healthCheckData: Prisma.HealthCheckCreateManyInput[] = healthcheck;
const monthOfDeliveryData: Prisma.MonthOfDeliveryCreateManyInput[] = MonthOfDelivery;
const permissionData: Prisma.PermissionCreateManyInput[] = permission;
const roleData: Prisma.RoleCreateManyInput[] = role;
const targetConditionData: Prisma.TargetConditionCreateManyInput[] = targetCondition;
const frequencyData: Prisma.FrequencyCreateManyInput[] = frequency;
const kpiSubmissionStatusData: Prisma.KpiSubmissionStatusCreateManyInput[] = kpiSubmissionStatus;
const approveStatusData: Prisma.ApprovalStatusCreateManyInput[] = approveStatus;

interface Upsertable<T> {
  upsert(args: {
    where: Record<string, unknown>;
    update: T;
    create: Partial<T>;
  }): Promise<unknown>;
}

async function upsertMany<T extends Record<string, unknown>>(
  model: Upsertable<T>,
  data: T[],
  uniqueFields: (keyof T)[]
): Promise<void> {
  for (const item of data) {
    const where = Object.fromEntries(
      uniqueFields.map((field) => [field, item[field]])
    );

    await model.upsert({
      where,
      update: item,
      create: item,
    });
  }
}

async function main() {
  await upsertMany(prisma.healthCheck, healthCheckData, ["id"]);
  await upsertMany(prisma.monthOfDelivery, monthOfDeliveryData, ["id"]);
  await upsertMany(prisma.permission, permissionData, ["id"]);
  await upsertMany(prisma.role, roleData, ["id"]);
  await upsertMany(prisma.targetCondition, targetConditionData, ["id"]);
  await upsertMany(prisma.frequency, frequencyData, ["id"]);
  await upsertMany(prisma.kpiSubmissionStatus, kpiSubmissionStatusData, ["id"]);
  await upsertMany(prisma.approvalStatus, approveStatusData, ["id"]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });