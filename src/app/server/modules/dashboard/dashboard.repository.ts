import prismaInstance from "@/app/server/config/prismaClientInstance";
import { customLog } from "@/app/server/util/custom-log";
import { HTTPException } from "hono/http-exception";
import { DashboardDto, KpiComparisonDashboardDto } from "../../dto/dashboard.dto";
import { Prisma } from "@prisma/client";

export class DashboardRepository {
  private readonly prisma = prismaInstance;

  async getKpiDashboard(data: DashboardDto) {
    try {
      return await this.prisma.kpi.findMany({
        where: this.buildWhereClause(data),
        include: {
          kpiCategory: true,
          frequency: true,
          monthOfDelivery: true,
          targetCondition: true,
          kpiComparison: {
            where: {
              isDeleted: false,
            },
            orderBy: {
              seq: "asc",
            },
          },
          kpiAssignment: {
            where: {
              isDeleted: false,
            },
            include: {
              kpiSubmission: {
                where: {
                  isDeleted: false,
                },
                include: {
                  status: true,
                },
              },
            },
          },
          kpiTarget: {
            where: {
              isDeleted: false,
            },
            include: {
              department: true,
              user: true,
            },
          },
        },
      });
    } catch (error) {
      customLog.error("Error fetching dashboard", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      throw new HTTPException(status, { message: "Failed to fetch dashboard" });
    }
  }

  private buildWhereClause(data: DashboardDto): Prisma.KpiWhereInput {
    const whereClause: Prisma.KpiWhereInput = {
      isDeleted: false,
    };

    if (data?.year != null) {
      whereClause.year = data.year;
    }

    if (data?.kpiCategoryId != null) {
      whereClause.kpiCategoryId = data.kpiCategoryId;
    }

    if (data?.departmentId != null) {
      whereClause.kpiTarget = {
        some: {
          departmentId: data.departmentId,
        },
      };
    }

    return whereClause;
  }

  async getKpiComparisonDashboard(data: KpiComparisonDashboardDto) {
    try {
      return await this.prisma.kpi.findMany({
        where: this.buildWhereClauseKpiComparison(data),
        select: {
          id: true,
          kpiName: true,
          year: true,
          kpiComparison: {
            where: {
              isDeleted: false,
            },
            orderBy: {
              seq: "asc",
            },
            select: {
              id: true,
              name: true,
              seq: true,
              result: true,
            },
          },
        },
      });
    } catch (error) {
      customLog.error("Error fetching kpi comparison dashboard", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      throw new HTTPException(status, { message: "Failed to fetch kpi comparison dashboard" });
    }
  }

  private buildWhereClauseKpiComparison(data: KpiComparisonDashboardDto): Prisma.KpiWhereInput {
    const whereClause: Prisma.KpiWhereInput = {
      isDeleted: false,
    };

    if (data?.year != null) {
      whereClause.year = data.year;
    }

    if (data?.kpiCategoryId != null) {
      whereClause.kpiCategoryId = data.kpiCategoryId;
    }

    if (data?.kpiCode != null) {
      whereClause.kpiCode = data.kpiCode;
    }

    return whereClause;
  }
}