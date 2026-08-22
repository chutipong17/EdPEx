import { MonthOfDeliveryService } from "./month-of-delivery.service";
import { Context } from "hono";
import { customLog } from "@/app/server/util/custom-log";
import { HTTPException } from "hono/http-exception";

export class MonthOfDeliveryController {
  constructor(
    private readonly monthOfDeliveryService = new MonthOfDeliveryService()
  ) {}

  getMonthOfDelivery = async (c: Context) => {
    try {
      const monthOfDelivery = await this.monthOfDeliveryService.getMonthOfDelivery();

      return c.json({
        success: true,
        data: monthOfDelivery,
      });
    } catch (error) {
      customLog.error("Error getting month of delivery", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof HTTPException ? error.message : "Getting month of delivery failed";
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