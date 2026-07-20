import prismaInstance from "@/app/server/config/prismaClientInstance";
import { customLog } from "@/app/server/util/custom-log";
import { KpiCategory, Prisma } from "@prisma/client";
import { HTTPException } from "hono/http-exception";

export class KpiCategoryRepository {
  private readonly prisma = prismaInstance;

  async getKpiCategory(): Promise<KpiCategory[]> {
    try {
      return await this.prisma.kpiCategory.findMany({
        where: { isDeleted: false },
      });
    } catch (error) {
      customLog.error("Error fetching kpi category", { error });
      throw new HTTPException(400, { message: "Failed to fetch kpi category" });
    }
  }

  async getKpiCategoryById(id: number): Promise<KpiCategory | null> {
    try {
      return await this.prisma.kpiCategory.findUnique({
        where: { id, isDeleted: false },
      });
    } catch (error) {
      customLog.error("Error fetching kpi category by ID", { error });
      throw new HTTPException(400, { message: "Failed to fetch kpi category by ID" });
    }
  }

  async createKpiCategory(categoryData: Prisma.KpiCategoryCreateInput): Promise<KpiCategory> {
    try {
      return await this.prisma.kpiCategory.create({
        data: categoryData,
      });
    } catch (error) {
      customLog.error("Error creating kpi category", { error });
      throw new HTTPException(400, { message: "Failed to create kpi category" });
    }
  }

  async updateKpiCategory(
    id: number, 
    categoryName: string,
    updatedBy: string
  ): Promise<KpiCategory> {
    try {
      return await this.prisma.kpiCategory.update({
        where: { id },
        data: {
          categoryName,
          updatedBy,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      customLog.error("Error updating kpi category", { error });
      throw new HTTPException(400, { message: "Failed to update kpi category" });
    }
  }

  async deleteKpiCategory(
    id: number,
    updatedBy: string
  ): Promise<KpiCategory> {
    try {
      return await this.prisma.kpiCategory.update({
        where: { id },
        data: {
          isDeleted: true,
          updatedBy,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      customLog.error("Error deleting kpi category", { error });
      throw new HTTPException(400, { message: "Failed to delete kpi category" });
    }
  }
}