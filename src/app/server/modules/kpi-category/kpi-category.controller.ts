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
      customLog.error("Error getting KPI category", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof HTTPException ? convertErrorMessage(error.message) : "Getting KPI category failed";
      return c.json(
        {
          success: false,
          error: { message: errorMessage },
        },
        status,
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
      customLog.error("Error getting KPI category by ID", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof HTTPException ? convertErrorMessage(error.message) : "Getting KPI category by ID failed";
      return c.json(
        {
          success: false,
          error: { message: errorMessage },
        },
        status,
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
      const errorMessage = error instanceof HTTPException ? convertErrorMessage(error.message) : "Creating KPI category failed";
      return c.json(
        {
          success: false,
          error: { message: errorMessage },
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
      const errorMessage = error instanceof HTTPException ? convertErrorMessage(error.message) : "Updating KPI category failed";
      return c.json(
        {
          success: false,
          error: { message: errorMessage },
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
      const errorMessage = error instanceof HTTPException ? convertErrorMessage(error.message) : "Deleting KPI category failed";
      return c.json(
        {
          success: false,
          error: { message: errorMessage },
        },
        status,
      );
    }
  };
}