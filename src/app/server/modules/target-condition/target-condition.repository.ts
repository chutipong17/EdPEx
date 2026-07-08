import prismaInstance from "@/app/server/config/prismaClientInstance";
import { HTTPException } from "hono/http-exception";
import { customLog } from "@/app/server/util/custom-log";
import { TargetCondition } from "@prisma/client";

export class TargetConditionRepository {
  private readonly prisma = prismaInstance;

  async getTargetCondition(): Promise<TargetCondition[]> {
    try {
      return await this.prisma.targetCondition.findMany();
    } catch (error) {
      customLog.error("Error fetching target condition", { error });
      throw new HTTPException(400, { message: "Failed to fetch target condition" });
    }
  }
}