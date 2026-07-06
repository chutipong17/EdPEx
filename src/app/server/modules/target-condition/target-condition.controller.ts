import { TargetConditionService } from "./target-condition.service";
import { Context } from "hono";
import { customLog } from "@/app/server/util/custom-log";

export class TargetConditionController {
  constructor(
    private readonly targetConditionService = new TargetConditionService()
  ) {}

  getTargetCondition = async (c: Context) => {
    try {
      const targetCondition = await this.targetConditionService.getTargetCondition();

      return c.json({
        success: true,
        data: targetCondition,
      });
    } catch (error) {
      customLog.error("Error getting target condition", { error });
      return c.json(
        {
          success: false,
          error: { message: error instanceof Error ? error.message : "target condition failed" },
        },
        400,
      );
    }
  };
}