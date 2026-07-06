import { customLog } from "@/app/server/util/custom-log";
import { TargetCondition } from "@prisma/client";
import { TargetConditionRepository } from "./target-condition.repository";

export class TargetConditionService {
  constructor(private readonly targetConditionRepository = new TargetConditionRepository()) {}

  async getTargetCondition(): Promise<TargetCondition[]> {
    try {
      customLog.info("Getting target condition service");
      return this.targetConditionRepository.getTargetCondition();
    } catch (error) {
      customLog.error("Error getting target condition", { error });
      throw new Error("target condition failed");
    }
  }
}