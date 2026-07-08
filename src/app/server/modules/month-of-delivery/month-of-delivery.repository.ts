import prismaInstance from "@/app/server/config/prismaClientInstance";
import { HTTPException } from "hono/http-exception";
import { customLog } from "@/app/server/util/custom-log";
import { MonthOfDelivery } from "@prisma/client";

export class MonthOfDeliveryRepository {
  private readonly prisma = prismaInstance;

  async getMonthOfDelivery(): Promise<MonthOfDelivery[]> {
    try {
      return await this.prisma.monthOfDelivery.findMany();
    } catch (error) {
      customLog.error("Error fetching month of delivery", { error });
      throw new HTTPException(400, { message: "Failed to fetch month of delivery" });
    }
  }
}