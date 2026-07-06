import prismaInstance from "@/app/server/config/prismaClientInstance";
import { HTTPException } from "hono/http-exception";
import { customLog } from "@/app/server/util/custom-log";
import { Frequency } from "@prisma/client";

export class FrequencyRepository {
  private readonly prisma = prismaInstance;

  async getFrequency(): Promise<Frequency[]> {
    try {
      return await this.prisma.frequency.findMany();
    } catch (error) {
      customLog.error("Error fetching frequency", { error });
      throw new HTTPException(400, { message: "Failed to fetch frequency" });
    }
  }
}