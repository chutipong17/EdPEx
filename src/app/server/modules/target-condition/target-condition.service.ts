import { customLog } from "@/app/server/util/custom-log";
import { TargetCondition } from "@prisma/client";
import { TargetConditionRepository } from "./target-condition.repository";
import { HTTPException } from "hono/http-exception";

export class TargetConditionService {
  constructor(private readonly targetConditionRepository = new TargetConditionRepository()) {}

  async getTargetCondition(): Promise<TargetCondition[]> {
    try {
      customLog.info("Getting target condition service");
      return this.targetConditionRepository.getTargetCondition();
    } catch (error) {
      customLog.error("Error getting target condition", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      throw new HTTPException(status, { message: `${error}` || "Getting target condition failed" });
    }
  }
}