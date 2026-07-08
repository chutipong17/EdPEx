import { customLog } from "@/app/server/util/custom-log";
import { MonthOfDelivery } from "@prisma/client";
import { MonthOfDeliveryRepository } from "./month-of-delivery.repository";

export class MonthOfDeliveryService {
  constructor(private readonly monthOfDeliveryRepository = new MonthOfDeliveryRepository()) {}

  async getMonthOfDelivery(): Promise<MonthOfDelivery[]> {
    try {
      customLog.info("Getting month of delivery service");
      return this.monthOfDeliveryRepository.getMonthOfDelivery();
    } catch (error) {
      customLog.error("Error getting month of delivery", { error });
      throw new Error("month of delivery failed");
    }
  }
}