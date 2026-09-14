import { DashboardService } from "./dashboard.service";
import { Context } from "hono";
import { customLog } from "@/app/server/util/custom-log";
import { HTTPException } from "hono/http-exception";
import { convertErrorMessage } from "../../util/common";
import { DashboardDto, KpiComparisonDashboardDto } from "../../dto/dashboard.dto";

export class DashboardController {
  constructor(
    private readonly dashboardService = new DashboardService()
  ) {}

  getDashboard = async (c: Context) => {
    try {
      const body = await c.req.json();
      const parsed = DashboardDto.safeParse(body);
      if (!parsed.success) {
        throw new HTTPException(400, { message: "Invalid dashboard data" });
      }
      const dashboardDto = parsed.data;
      const dashboard = await this.dashboardService.getDashboard(dashboardDto);

      return c.json({
        success: true,
        data: dashboard,
      });
    } catch (error) {
      customLog.error("Error getting dashboard", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof HTTPException ? convertErrorMessage(error.message) : "Getting dashboard failed";
      return c.json(
        {
          success: false,
          error: { message: errorMessage },
        },
        status,
      );
    }
  };

  getKpiComparisonDashboard = async (c: Context) => {
    try {
      const body = await c.req.json();
      const parsed = KpiComparisonDashboardDto.safeParse(body);
      if (!parsed.success) {
        throw new HTTPException(400, { message: "Invalid KPI comparison dashboard data" });
      }
      const dashboardDto = parsed.data;
      const kpiComparisonDashboard = await this.dashboardService.getKpiComparisonDashboard(dashboardDto);

      return c.json({
        success: true,
        data: kpiComparisonDashboard,
      });
    } catch (error) {
      customLog.error("Error getting KPI comparison dashboard", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof HTTPException ? convertErrorMessage(error.message) : "Getting KPI comparison dashboard failed";
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