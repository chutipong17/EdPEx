import { customLog } from "@/app/server/util/custom-log";
import { MasterDataRepository } from "./master-data.repository";
import { HTTPException } from "hono/http-exception";

export interface KpiFilterResponse {
  year: string[];
  kpiCode: string[];
}

export class MasterDataService {
  constructor(private readonly masterDataRepository = new MasterDataRepository()) {}

  async getKpiFilter(): Promise<KpiFilterResponse> {
    try {
      customLog.info("Getting master data service kpi filter");
      return await this.masterDataRepository.getKpiFilter();
    } catch (error) {
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof Error ? error.message : "Getting kpi filter failed";
      customLog.error("Error getting kpi year: ", { message: errorMessage });
      throw new HTTPException(status, { message: errorMessage });
    }
  }
}