import { customLog } from "@/app/server/util/custom-log";
import { Frequency } from "@prisma/client";
import { FrequencyRepository } from "./frequency.repository";

export class FrequencyService {
  constructor(private readonly frequencyRepository = new FrequencyRepository()) {}

  async getFrequency(): Promise<Frequency[]> {
    try {
      customLog.info("Getting frequency service");
      return this.frequencyRepository.getFrequency();
    } catch (error) {
      customLog.error("Error getting frequency", { error });
      throw new Error("frequency failed");
    }
  }
}