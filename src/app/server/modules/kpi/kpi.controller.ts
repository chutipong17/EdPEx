import { KpiService } from "./kpi.service";
import { Context } from "hono";
import { customLog } from "@/app/server/util/custom-log";
import { HTTPException } from "hono/http-exception";
import { convertErrorMessage } from "../../util/common";
import { KpiDto } from "../../dto/kpi.dto";
import { KpiSubmissionDto } from "../../dto/kpi-submission.dto";

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
      customLog.error("Error getting kpi", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      return c.json(
        {
          success: false,
          error: { message: error instanceof Error ? convertErrorMessage(error.message) : "kpi failed" },
        },
        status,
      );
    }
  };

  getKpiByDepartment = async (c: Context) => {
    try {
      // const userId = Number(c.req.param("userId"));
      const departmentId = Number(c.req.param("departmentId"));
      const kpi = await this.kpiService.getKpiByDepartment(departmentId);

      return c.json({
        success: true,
        data: kpi,
      });
    } catch (error) {
      customLog.error("Error getting kpi by department", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      return c.json(
        {
          success: false,
          error: { message: error instanceof Error ? convertErrorMessage(error.message) : "kpi by department failed" },
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
      customLog.error("Error getting kpi by ID", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      return c.json(
        {
          success: false,
          error: { message: error instanceof Error ? convertErrorMessage(error.message) : "kpi by ID failed" },
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
      customLog.error("Error creating KPI transaction", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      return c.json(
        {
          success: false,
          error: { message: error instanceof Error ? convertErrorMessage(error.message) : "creating KPI transaction failed" },
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
      return c.json(
        {
          success: false,
          error: { message: error instanceof Error ? convertErrorMessage(error.message) : "updating KPI failed" },
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
      return c.json(
        {
          success: false,
          error: { message: error instanceof Error ? convertErrorMessage(error.message) : "deleting KPI failed" },
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
      return c.json(
        {
          success: false,
          error: { message: error instanceof Error ? convertErrorMessage(error.message) : "updating KPI submission failed" },
        },
        status,
      );
    }
  };
}