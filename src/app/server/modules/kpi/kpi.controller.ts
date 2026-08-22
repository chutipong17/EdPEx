import { customLog } from "@/app/server/util/custom-log";
import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { KpiSubmissionDto } from "../../dto/kpi-submission.dto";
import { KpiDto } from "../../dto/kpi.dto";
import { KpiService } from "./kpi.service";

export class KpiController {
  constructor(
    private readonly kpiService = new KpiService()
  ) {}

  getKpi = async (c: Context) => {
    try {
      const kpi = await this.kpiService.getKpi();

      return c.json({
        success: true,
        data: kpi,
      });
    } catch (error) {
      customLog.error("Error getting KPI", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof Error ? error.message : "Getting KPI failed";
      return c.json(
        {
          success: false,
          error: { message: errorMessage },
        },
        status,
      );
    }
  };

  getKpiByDepartment = async (c: Context) => {
    try {
      const departmentId = Number(c.req.param("departmentId"));
      const kpi = await this.kpiService.getKpiByDepartment(departmentId);

      return c.json({
        success: true,
        data: kpi,
      });
    } catch (error) {
      customLog.error("Error getting KPI by department", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof Error ? error.message : "Getting KPI by department failed";
      return c.json(
        {
          success: false,
          error: { message: errorMessage },
        },
        status,
      );
    }
  };

  getKpiById = async (c: Context) => {
    try {
      const id = Number(c.req.param("id"));
      const kpi = await this.kpiService.getKpiById(id);

      return c.json({
        success: true,
        data: kpi,
      });
    } catch (error) {
      customLog.error("Error getting KPI by ID", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof Error ? error.message : "Getting KPI by ID failed";
      return c.json(
        {
          success: false,
          error: { message: errorMessage },
        },
        status,
      );
    }
  };

  createKpi = async (c: Context, body: KpiDto) => {
    try {
      const fullName = c.get("fullName");
      const kpi = await this.kpiService.createKpiTransaction(body, fullName);

      customLog.info("KPI transaction created :", { kpi });

      return c.json({
        success: true,
        message: "KPI created successfully",
      }, 201);
    } catch (error) {
      customLog.error("Error creating KPI", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof Error ? error.message : "Creating KPI failed";
      return c.json(
        {
          success: false,
          error: { message: errorMessage },
        },
        status,
      );
    }
  };

  updateKpi = async (c: Context, body: KpiDto) => {
    try {
      const id = Number(c.req.param("id"));
      const fullName = c.get("fullName");
      const kpi = await this.kpiService.updateKpi(id, body, fullName);

      customLog.info("KPI updated :", { kpi });

      return c.json({
        success: true,
        data: kpi,
      }, 200);
    } catch (error) {
      customLog.error("Error updating KPI", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof Error ? error.message : "Updating KPI failed";
      return c.json(
        {
          success: false,
          error: { message: errorMessage },
        },
        status,
      );
    }
  };

  deleteKpi = async (c: Context) => {
    try {
      const id = Number(c.req.param("id"));
      const fullName = c.get("fullName");
      const kpi = await this.kpiService.deleteKpi(id, fullName);

      customLog.info("KPI deleted :", { kpi });

      return c.json({
        success: true,
        message: "KPI deleted successfully",
      }, 200);
    } catch (error) {
      customLog.error("Error deleting KPI", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof Error ? error.message : "Deleting KPI failed";
      return c.json(
        {
          success: false,
          error: { message: errorMessage },
        },
        status,
      );
    }
  };

  updateKpiSubmission = async (c: Context) => {
    try {
      const id = Number(c.req.param("id"));
      const fullName = c.get("fullName");
      const body = await c.req.json();
      const parsed = KpiSubmissionDto.safeParse(body);
      if (!parsed.success) {
        throw new HTTPException(400, { message: "Invalid request data" });
      }
      const kpiSubmissionDto = parsed.data;
      const kpiSubmission = await this.kpiService.updateKpiSubmission(id, kpiSubmissionDto, fullName);

      customLog.info("KPI submission updated :", { kpiSubmission });

      return c.json({
        success: true,
        data: kpiSubmission,
      }, 200);
    } catch (error) {
      customLog.error("Error updating KPI submission", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof Error ? error.message : "Updating KPI submission failed";
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