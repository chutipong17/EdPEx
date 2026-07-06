import { MonthOfDeliveryService } from "./month-of-delivery.service";
import { Context } from "hono";
import { customLog } from "@/app/server/util/custom-log";

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
      return c.json(
        {
          success: false,
          error: { message: error instanceof Error ? error.message : "month of delivery failed" },
        },
        400,
      );
    }
  };
}