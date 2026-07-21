import { customLog } from "@/app/server/util/custom-log";
import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { convertErrorMessage } from "../../util/common";
import { KpiCategoryService } from "./kpi-category.service";

export class KpiCategoryController {
  constructor(
    private readonly kpiCategoryService = new KpiCategoryService()
  ) {}

  getKpiCategory = async (c: Context) => {
    try {
      const kpiCategory = await this.kpiCategoryService.getKpiCategory();

      return c.json({
        success: true,
        data: kpiCategory,
      });
    } catch (error) {
      customLog.error("Error getting kpi category", { error });
      return c.json(
        {
          success: false,
          error: { message: error instanceof Error ? convertErrorMessage(error.message) : "kpi category failed" },
        },
        400,
      );
    }
  };

  getKpiCategoryById = async (c: Context) => {
    try {
      const id = Number(c.req.param("id"));
      const kpiCategory = await this.kpiCategoryService.getKpiCategoryById(id);

      return c.json({
        success: true,
        data: kpiCategory,
      });
    } catch (error) {
      customLog.error("Error getting kpi category by ID", { error });
      return c.json(
        {
          success: false,
          error: { message: error instanceof Error ? convertErrorMessage(error.message) : "kpi category by ID failed" },
        },
        400,
      );
    }
  };

  createKpiCategory = async (c: Context) => {
    try {
      const fullName = c.get("fullName");
      const { categoryName } = await c.req.json();
      const kpiCategory = await this.kpiCategoryService.createKpiCategory(categoryName, fullName);

      customLog.info("KPI category created :", { kpiCategory });

      return c.json({
        success: true,
        message: "KPI category created successfully",
      }, 201);
    } catch (error) {
      customLog.error("Error creating KPI category", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      return c.json(
        {
          success: false,
          error: { message: error instanceof Error ? convertErrorMessage(error.message) : "creating KPI category failed" },
        },
        status,
      );
    }
  };

  updateKpiCategory = async (c: Context) => {
    try {
      const fullName = c.get("fullName");
      const id = Number(c.req.param("id"));
      const { categoryName } = await c.req.json();
      const kpiCategory = await this.kpiCategoryService.updateKpiCategory(id, categoryName, fullName);

      customLog.info("KPI category updated :", { kpiCategory });

      return c.json({
        success: true,
        data: kpiCategory,
      }, 200);
    } catch (error) {
      customLog.error("Error updating KPI category", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      return c.json(
        {
          success: false,
          error: { message: error instanceof Error ? convertErrorMessage(error.message) : "updating KPI category failed" },
        },
        status,
      );
    }
  };

  deleteKpiCategory = async (c: Context) => {
    try {
      const fullName = c.get("fullName");
      const id = Number(c.req.param("id"));
      const kpiCategory = await this.kpiCategoryService.deleteKpiCategory(id, fullName);

      customLog.info("KPI category deleted :", { kpiCategory });

      return c.json({
        success: true,
        message: "KPI category deleted successfully",
      }, 200);
    } catch (error) {
      customLog.error("Error deleting KPI category", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      return c.json(
        {
          success: false,
          error: { message: error instanceof Error ? convertErrorMessage(error.message) : "deleting KPI category failed" },
        },
        status,
      );
    }
  };
}