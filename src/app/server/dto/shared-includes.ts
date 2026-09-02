import { Prisma } from "@prisma/client";

export const kpiRelationsInclude = {
  kpiCategory: true,
  frequency: true,
  monthOfDelivery: true,
  targetCondition: true,
  kpiComparison: true,
  kpiAssignment: {
    include: {
      kpiSubmission: {
        include: { status: true },
      },
    },
  },
  // kpiTarget: {
  //   include: {
  //     department: true,
  //     user: true,
  //   },
  // },
} satisfies Prisma.KpiInclude;

type KpiTargetWithRelations = Prisma.KpiTargetGetPayload<{
  include: {
    kpi: { include: typeof kpiRelationsInclude },
    department: true,
    user: true,
  },
}>;

export type KpiByDepartmentResponse = Omit<
  KpiTargetWithRelations,
  "user" | "department"
> & {
  userId: number | null;
  firstName: string | null;
  lastName: string | null;
  departmentId: number | null;
  departmentName: string | null;
};

type KpiWithRelations = Prisma.KpiGetPayload<{
  include: typeof kpiRelationsInclude & {
    kpiTarget: {
      include: { department: true; user: true };
    };
  };
}>;

export type KpiWithUserAndDept = Omit<
  KpiWithRelations,
  "departmentId"
> & {
  userId: number | null;
  firstName: string | null;
  lastName: string | null;
  departmentId: number | null;
  departmentName: string | null;
};