import { customLog } from "@/app/server/util/custom-log";
import { HealthCheckService } from "./health-check.service";
import { Context } from "hono";
import { HTTPException } from "hono/http-exception";

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
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof HTTPException ? error.message : "Getting health check failed";
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