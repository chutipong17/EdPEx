// import { PrismaClient, Prisma } from "@prisma/client";
// import { PrismaClient, Prisma } from "./generated/prisma/client";
import { PrismaClient, Prisma } from "@prisma/client";
import healthcheck from "./data/health-check.json";

const prisma = new PrismaClient();

const healthCheckData: Prisma.HealthCheckCreateManyInput[] = healthcheck;

interface Upsertable<T> {
  upsert(args: {
    where: Record<string, unknown>;
    update: T;
    create: T;
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });