import prismaInstance from "@/app/server/config/prismaClientInstance";
import { HTTPException } from "hono/http-exception";
import { customLog } from "@/app/server/util/custom-log";
import { HealthCheck } from "@prisma/client";

export class HealthCheckRepository {
  private readonly prisma = prismaInstance;

  async getHealthCheck(): Promise<HealthCheck> {
    try {
      return await this.prisma.healthCheck.findFirstOrThrow();
    } catch (error) {
      customLog.error("Error fetching health checks", { error });
      throw new HTTPException(400, { message: "Failed to fetch health checks" });
    }
  }
}
