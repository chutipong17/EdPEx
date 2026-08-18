import { customLog } from "@/app/server/util/custom-log";
import { Kpi, KpiSubmission, Prisma } from "@prisma/client";
import { KpiRepository } from "./kpi.repository";
import { HTTPException } from "hono/http-exception";
import { KpiDto } from "../../dto/kpi.dto";
import prismaInstance from "../../config/prismaClientInstance";
import { KpiSubmissionStatus } from "../../enum/enum";
import { buildUpdateData, toDecimalUpdate } from "../../util/common";
import { KpiSubmissionDto } from "../../dto/kpi-submission.dto";

export class KpiService {
  private readonly prisma = prismaInstance;
  constructor(private readonly kpiRepository = new KpiRepository()) {}

  async getKpi(): Promise<Kpi[]> {
    try {
      customLog.info("Getting kpi service");
      return await this.kpiRepository.getKpi();
    } catch (error) {
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof Error ? error.message : "Getting kpi failed";
      customLog.error("Error getting kpi: ", { message: errorMessage });
      throw new HTTPException(status, { message: errorMessage });
    }
  }

  async getKpiByDepartment(departmentId: number) {
    try {
      return await this.kpiRepository.getKpiByDepartment(departmentId);
    } catch (error) {
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof Error ? error.message : "Getting kpi by department failed";
      customLog.error("Error getting kpi by department: ", { message: errorMessage });
      throw new HTTPException(status, { message: errorMessage });
    }
  }

  async getKpiById(id: number) {
    try {
      return await this.kpiRepository.getKpiById(id);
    } catch (error) {
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof Error ? error.message : "Getting kpi by ID failed";
      customLog.error("Error getting kpi by ID: ", { message: errorMessage });
      throw new HTTPException(status, { message: errorMessage });
    }
  }

  async createKpiTransaction(kpi: KpiDto, updateBy: string): Promise<Kpi> {
    try {
      const now = new Date();
      const kpiData: Prisma.KpiCreateInput = {
        kpiCategory: {
          connect: { id: kpi.kpiCategoryId },
        },
        monthOfDelivery: {
          connect: { id: kpi.monthOfDeliveryId },
        },
        frequency: {
          connect: { id: kpi.frequencyId },
        },
        targetCondition: {
          connect: { id: kpi.targetConditionId },
        },
        kpiCode: kpi.kpiCode,
        kpiName: kpi.kpiName,
        description: kpi.description,
        unit: kpi.unit,
        targetValue: kpi.targetValue,
        year: kpi.year,
        remark: kpi.remark,
        isDeleted: false,
        createdBy: updateBy,
        updatedBy: updateBy,
        createdAt: now,
        updatedAt: now,
        kpiComparison: {
          create: kpi.kpiComparison?.map((comparison) => ({
            seq: comparison.seq,
            name: comparison.name,
            result: comparison.result,
            createdBy: updateBy,
            updatedBy: updateBy,
            createdAt: now,
            updatedAt: now,
          })),
        },
        kpiTarget: {
          create: {
            user: {
              connect: { id: kpi.userId },
            },
            department: {
              connect: { id: kpi.departmentId },
            },
            isDeleted: false,
            createdBy: updateBy,
            updatedBy: updateBy,
            createdAt: now,
            updatedAt: now,
          },
        },
        kpiAssignment: {
          create: {
            user: {
              connect: { id: kpi.userId },
            },
            assignedDate: now,
            dueDate: null, // Set this to the appropriate value if needed
            isDeleted: false,
            createdBy: updateBy,
            updatedBy: updateBy,
            createdAt: now,
            updatedAt: now,
            kpiSubmission: {
              create: {
                statusId: KpiSubmissionStatus.PENDING,
                isDeleted: false,
                createdBy: updateBy,
                updatedBy: updateBy,
                createdAt: now,
                updatedAt: now,
              },
            },
          },
        },
      };
      return await this.kpiRepository.createKpi(kpiData);
      // return await this.kpiRepository.createKpiTransaction(kpiData, kpi.userId, kpi.departmentId);
    } catch (error) {
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof Error ? error.message : "Creating kpi failed";
      customLog.error("Error creating kpi: ", { message: errorMessage });
      throw new HTTPException(status, { message: errorMessage });
    }
  }

  async updateKpi(id: number, kpi: KpiDto, updateBy: string) {
    try {
      const now = new Date();
      const kpiData: Prisma.KpiUpdateInput = {
        kpiCategory: {
          connect: { id: kpi.kpiCategoryId },
        },
        monthOfDelivery: {
          connect: { id: kpi.monthOfDeliveryId },
        },
        frequency: {
          connect: { id: kpi.frequencyId },
        },
        targetCondition: {
          connect: { id: kpi.targetConditionId },
        },
        kpiCode: kpi.kpiCode,
        kpiName: kpi.kpiName,
        description: kpi.description,
        unit: kpi.unit,
        targetValue: kpi.targetValue,
        year: kpi.year,
        remark: kpi.remark,
        isDeleted: false,
        updatedBy: updateBy,
        updatedAt: now,
        kpiTarget: {
          updateMany: [
            {
              where: {
                kpiId: id,
                isDeleted: false,
              },
              data: {
                userId: kpi.userId,
                departmentId: kpi.departmentId,
                isDeleted: false,
                updatedBy: updateBy,
                updatedAt: now,
              },
            },
          ],
        },
        kpiAssignment: {
          updateMany: [
            {
              where: {
                kpiId: id,
                isDeleted: false,
              },
              data: {
                userId: kpi.userId,
                assignedDate: new Date(),
                dueDate: null, // Set this to the appropriate value if needed
                isDeleted: false,
                updatedBy: updateBy,
                updatedAt: now,
              },
            },
          ],
        },
      };

      const kpiComparisonData: Prisma.KpiComparisonCreateManyInput[] =
      kpi.kpiComparison?.map((comparison) => ({
        kpiId: id,
        seq: comparison.seq,
        name: comparison.name,
        result: comparison.result,
        isDeleted: false,
        createdBy: updateBy,
        updatedBy: updateBy,
        createdAt: now,
        updatedAt: now,
      })) ?? [];

      const kpiUpdated = await this.prisma.$transaction(
        async (tx) => {
          await this.kpiRepository.updateKpiTransaction(tx, kpiData, id);
          await this.kpiRepository.replaceKpiComparisons(tx, id, kpiComparisonData);
          return this.kpiRepository.getKpiById(id);
        },
        {
          timeout: 10000,
          maxWait: 2000,
        },
      );

      return kpiUpdated;
    } catch (error) {
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof Error ? error.message : "Updating kpi failed";
      customLog.error("Error updating kpi: ", { message: errorMessage });
      throw new HTTPException(status, { message: errorMessage });
    }
  }

  async deleteKpi(id: number, updatedBy: string): Promise<Kpi> {
    try {
      return await this.kpiRepository.deleteKpi(id, updatedBy);
    } catch (error) {
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof Error ? error.message : "Deleting kpi failed";
      customLog.error("Error deleting kpi: ", { message: errorMessage });
      throw new HTTPException(status, { message: errorMessage });
    }
  }

  async updateKpiSubmission(id: number, data: KpiSubmissionDto, updatedBy: string): Promise<KpiSubmission> {
    try {
      const now = new Date();
      const updatedName = updatedBy || "system";

      const kpiTerget = await this.kpiRepository.getKpiById(id);

      const kpiAssignment = kpiTerget?.kpi?.kpiAssignment?.find(
        (assignment) => assignment.kpiId === id
      );

      const kpiSubmission = kpiAssignment?.kpiSubmission;

      if (!kpiSubmission) {
        throw new HTTPException(404, { message: "KPI submission not found" });
      }

      const kpiSubmissionId = kpiSubmission[0]?.id;
      const parsed = KpiSubmissionDto.parse(data);
      const kpiSubmissionData: Prisma.KpiSubmissionUpdateInput = {
        status: {
          connect: { id: KpiSubmissionStatus.SUBMITTED },
        },
        submittedBy: buildUpdateData(updatedName),
        submittedDate: buildUpdateData(now),
        description: buildUpdateData(parsed.description),
        actualValue: toDecimalUpdate(parsed.actualValue),
        calculatedScore: toDecimalUpdate(parsed.calculatedScore),
        achievementPercent: toDecimalUpdate(parsed.achievementPercent),
        updatedBy: buildUpdateData(updatedName),
        updatedAt: now,
      };

      return await this.kpiRepository.updateKpiSubmission(kpiSubmissionData, kpiSubmissionId);
    } catch (error) {
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof Error ? error.message : "Updating kpi submission failed";
      customLog.error("Error updating kpi submission: ", { message: errorMessage });
      throw new HTTPException(status, { message: errorMessage });
    }
  }
}
