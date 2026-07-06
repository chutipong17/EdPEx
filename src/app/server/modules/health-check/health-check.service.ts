import { customLog } from "@/app/server/util/custom-log";
import { HealthCheck } from "@prisma/client";
import { HealthCheckRepository } from "./health-check.repository";

export class HealthCheckService {
  constructor(private readonly healthCheckRepository = new HealthCheckRepository()) {}

  async getHealthCheck(): Promise<HealthCheck> {
    try {
      customLog.info("Getting health check service");
      return this.healthCheckRepository.getHealthCheck();
    } catch (error) {
      customLog.error("Error getting health check", { error });
      throw new Error("Health check failed");
    }
  }
}