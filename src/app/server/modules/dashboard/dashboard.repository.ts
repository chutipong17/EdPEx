import prismaInstance from "@/app/server/config/prismaClientInstance";
import { customLog } from "@/app/server/util/custom-log";
import { HTTPException } from "hono/http-exception";
import { DashboardDto } from "../../dto/dashboard.dto";
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
}