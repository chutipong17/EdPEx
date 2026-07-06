import { FrequencyService } from "./frequency.service";
import { Context } from "hono";
import { customLog } from "@/app/server/util/custom-log";

export class FrequencyController {
  constructor(
    private readonly frequencyService = new FrequencyService()
  ) {}

  getFrequency = async (c: Context) => {
    try {
      const frequency = await this.frequencyService.getFrequency();

      return c.json({
        success: true,
        data: frequency,
      });
    } catch (error) {
      customLog.error("Error getting frequency", { error });
      return c.json(
        {
          success: false,
          error: { message: error instanceof Error ? error.message : "frequency failed" },
        },
        400,
      );
    }
  };
}