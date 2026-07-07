import { customLog } from "@/app/server/util/custom-log";
import { KpiCategory, Prisma } from "@prisma/client";
import { HTTPException } from "hono/http-exception";
import { KpiCategoryRepository } from "./kpi-category.repository";

export class KpiCategoryService {
  constructor(private readonly kpiCategoryRepository = new KpiCategoryRepository()) {}

  async getKpiCategory(): Promise<KpiCategory[]> {
    try {
      customLog.info("Getting kpi category service");
      return this.kpiCategoryRepository.getKpiCategory();
    } catch (error) {
      customLog.error("Error getting kpi category", { error });
      throw new Error("kpi category failed");
    }
  }

  async getKpiCategoryById(id: number): Promise<KpiCategory | null> {
    try {
      customLog.info("Getting kpi category by ID service");
      return this.kpiCategoryRepository.getKpiCategoryById(id);
    } catch (error) {
      customLog.error("Error getting kpi category by ID", { error });
      throw new Error("kpi category by ID failed");
    }
  }

  async createKpiCategory(categoryName: string, updatedBy: string): Promise<KpiCategory> {
    try {
      customLog.info("Creating kpi category service");
      const categoryData: Prisma.KpiCategoryCreateInput = {
        categoryName,
        isDeleted: false,
        createdBy: updatedBy ?? "system",
        updatedBy: updatedBy ?? "system",
      };
      return this.kpiCategoryRepository.createKpiCategory(categoryData);
    }  catch (error) {
      const status = error instanceof HTTPException ? error.status : 500;
      customLog.error("Error creating kpi category: ", { message: `${error}` || "Creating kpi category failed" });
      throw new HTTPException(status, { message: `${error}` || "Creating kpi category failed" });
    }
  }

  async updateKpiCategory(id: number, categoryName: string, updatedBy: string): Promise<KpiCategory> {
    try {
      customLog.info("Updating kpi category service");
      return this.kpiCategoryRepository.updateKpiCategory(id, categoryName, updatedBy ?? "system");
    }  catch (error) {
      const status = error instanceof HTTPException ? error.status : 500;
      customLog.error("Error updating kpi category: ", { message: `${error}` || "Updating kpi category failed" });
      throw new HTTPException(status, { message: `${error}` || "Updating kpi category failed" });
    }
  }

  async deleteKpiCategory(id: number, updatedBy: string): Promise<KpiCategory> {
    try {
      customLog.info("Deleting kpi category service");
      return this.kpiCategoryRepository.deleteKpiCategory(id, updatedBy ?? "system");
    }  catch (error) {
      const status = error instanceof HTTPException ? error.status : 500;
      customLog.error("Error deleting kpi category: ", { message: `${error}` || "Deleting kpi category failed" });
      throw new HTTPException(status, { message: `${error}` || "Deleting kpi category failed" });
    }
  }
}