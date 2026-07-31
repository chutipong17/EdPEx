import { customLog } from "@/app/server/util/custom-log";
import { Frequency } from "@prisma/client";
import { FrequencyRepository } from "./frequency.repository";
import { HTTPException } from "hono/http-exception";

export class FrequencyService {
  constructor(private readonly frequencyRepository = new FrequencyRepository()) {}

  async getFrequency(): Promise<Frequency[]> {
    try {
      customLog.info("Getting frequency service");
      return this.frequencyRepository.getFrequency();
    } catch (error) {
      customLog.error("Error getting frequency", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      throw new HTTPException(status, { message: `${error}` || "Getting frequency failed" });
    }
  }
}