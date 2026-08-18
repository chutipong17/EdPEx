import prismaInstance from "@/app/server/config/prismaClientInstance";
import { customLog } from "@/app/server/util/custom-log";
import { Kpi, KpiSubmission, Prisma } from "@prisma/client";
import { HTTPException } from "hono/http-exception";

export class KpiRepository {
  private readonly prisma = prismaInstance;

  async getKpi() {
    try {
      const kpi = await this.prisma.kpi.findMany({
        where: { isDeleted: false },
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

      const data = kpi.map((kpiItem) => {
        const target = kpiItem.kpiTarget[0];

        return {
          ...kpiItem,
          userId: target?.user?.id ?? null,
          firstName: target?.user?.firstName ?? null,
          lastName: target?.user?.lastName ?? null,
          departmentId: target?.department?.id ?? null,
          departmentName: target?.department?.departmentName ?? null,
        };
      });

      return data;
    } catch (error) {
      customLog.error("Error fetching kpi", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      throw new HTTPException(status, { message: "Failed to fetch kpi" });
    }
  }

  async getKpiByDepartment(departmentId: number) {
    try {
      const kpiTargets = await this.prisma.kpiTarget.findMany({
        where: {
          isDeleted: false,
          departmentId,
          // userId,
        },
        include: {
          kpi: {
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
            },
          },
          department: true,
          user: true
        },
        orderBy: {
          kpi: {
            year: "desc",
          },
        },
      });

      const data = kpiTargets.map(({ user, department, ...kpiItem }) => ({
        ...kpiItem,
        userId: user?.id ?? null,
        firstName: user?.firstName ?? null,
        lastName: user?.lastName ?? null,
        departmentId: department?.id ?? null,
        departmentName: department?.departmentName ?? null,
      }));

      return data;
      // return kpiTargets.map((target) => target.kpi);
    } catch (error) {
      customLog.error("Error fetching kpi by department", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      throw new HTTPException(status, { message: "Failed to fetch kpi by department" });
    }
  }

  async getKpiById(id: number) {
    try {
      const kpiTargets = await this.prisma.kpiTarget.findUnique({
        where: {
          isDeleted: false,
          id,
        },
        include: {
          kpi: {
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
            },
          },
          department: true,
          user: true
        },
      });

      if (!kpiTargets) {
        return null;
      }

      const { user, department, ...rest } = kpiTargets;

      return {
        ...rest,
        userId: user?.id ?? null,
        firstName: user?.firstName ?? null,
        lastName: user?.lastName ?? null,
        departmentId: department?.id ?? null,
        departmentName: department?.departmentName ?? null,
      };
      
      // return kpiTargets!.kpi;
    } catch (error) {
      customLog.error("Error fetching kpi by ID", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      throw new HTTPException(status, { message: "Failed to fetch kpi by ID" });
    }
  }

  async createKpi(
    kpiData: Prisma.KpiCreateInput
  ): Promise<Kpi> {
    try {
      return await this.prisma.kpi.create({
        data: kpiData,
      });
    } catch (error) {
      customLog.error("Error creating kpi", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      throw new HTTPException(status, { message: "Failed to create kpi" });
    }
  }

  async updateKpiTransaction(
    tx: Prisma.TransactionClient, 
    kpiData: Prisma.KpiUpdateInput,
    id: number
  ): Promise<Kpi> {
    try {
      return await tx.kpi.update({
        where: { id, isDeleted: false },
        data: kpiData,
      });
    } catch (error) {
      customLog.error("Error updating kpi", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      throw new HTTPException(status, { message: "Failed to update kpi" });
    }
  }

  async replaceKpiComparisons(
    tx: Prisma.TransactionClient,
    kpiId: number,
    comparisons: Prisma.KpiComparisonCreateManyInput[],
  ): Promise<void> {
    await tx.kpiComparison.deleteMany({
      where: {
        kpiId,
      },
    });

    if (comparisons.length === 0) {
      return;
    }

    await tx.kpiComparison.createMany({
      data: comparisons,
    });
  }

  async createKpiTransaction(
    kpiData: Prisma.KpiCreateInput,
    userId: number,
    departmentId: number,
  ): Promise<Kpi> {
    try {
      const kpi = await this.prisma.$transaction(async (tx) => {
        const createdKpi = await tx.kpi.create({
          data: kpiData,
        });

        await tx.kpiTarget.create({
          data: {
            userId,
            departmentId,
            kpiId: createdKpi.id,
            isDeleted: false,
            createdBy: kpiData.createdBy || "system",
            updatedBy: kpiData.updatedBy || "system",
            craetedAt: new Date(),
            updatedAt: new Date(),
          },
        });

        return createdKpi;
      },
      {
        timeout: 10000, // Set a timeout of 10 seconds for the transaction
        maxWait: 2000, // Set a maximum wait time of 2 seconds for acquiring a connection
      });

      return kpi;
    } catch (error) {
      customLog.error("Error creating kpi", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      throw new HTTPException(status, { message: "Failed to create kpi" });
    }
  }

  async deleteKpi(
    id: number,
    updatedBy: string
  ): Promise<Kpi> {
    try {
      const updatedAt = new Date();
      return await this.prisma.kpi.update({
        where: {
          id,
        },
        data: {
          isDeleted: true,
          updatedBy,
          updatedAt,
          kpiComparison: {
            updateMany: {
              where: {
                kpiId: id,
              },
              data: {
                isDeleted: true,
                updatedBy,
                updatedAt,
              },
            },
          },
          kpiTarget: {
            updateMany: {
              where: {
                kpiId: id,
              },
              data: {
                isDeleted: true,
                updatedBy,
                updatedAt,
              },
            },
          },
          kpiAssignment: {
            updateMany: {
              where: {
                kpiId: id,
              },
              data: {
                isDeleted: true,
                updatedBy,
                updatedAt,
              },
            },
          },
        },
      });
    } catch (error) {
      customLog.error("Error deleting kpi", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      throw new HTTPException(status, { message: "Failed to delete kpi" });
    }
  }

  async updateKpiSubmission( 
    kpiData: Prisma.KpiSubmissionUpdateInput,
    id: number
  ): Promise<KpiSubmission> {
    try {
      return await this.prisma.kpiSubmission.update({
        where: { id, isDeleted: false },
        data: kpiData,
      });
    } catch (error) {
      customLog.error("Error updating kpi submission", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      throw new HTTPException(status, { message: "Failed to update kpi submission" });
    }
  }
}