import { FrequencyService } from "./frequency.service";
import { Context } from "hono";
import { customLog } from "@/app/server/util/custom-log";
import { HTTPException } from "hono/http-exception";

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
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof HTTPException ? error.message : "Getting frequency failed";
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