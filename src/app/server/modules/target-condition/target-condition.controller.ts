import { TargetConditionService } from "./target-condition.service";
import { Context } from "hono";
import { customLog } from "@/app/server/util/custom-log";
import { HTTPException } from "hono/http-exception";

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
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof HTTPException ? error.message : "Getting target condition failed";
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