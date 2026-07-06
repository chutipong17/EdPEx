import { customLog } from "@/app/server/util/custom-log";
import { HealthCheckService } from "./health-check.service";
import { Context } from "hono";

export class HealthCheckController {
  constructor(private readonly healthCheckService = new HealthCheckService()) {}

  getHealthCheck = async (c: Context) => {
    try {
      const healthCheck = await this.healthCheckService.getHealthCheck();

      return c.json({
        success: true,
        data: healthCheck,
      });
    } catch (error) {
      customLog.error("Error getting health check", { error });
      return c.json(
        {
          success: false,
          error: { message: error instanceof Error ? error.message : "Health check failed" },
        },
        400,
      );
    }
  };
}