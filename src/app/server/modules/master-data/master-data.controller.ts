import { MasterDataService } from "./master-data.service";
import { Context } from "hono";
import { customLog } from "@/app/server/util/custom-log"; 
import { HTTPException } from "hono/http-exception";

export class MasterDataController {
  constructor(
    private readonly masterDataService = new MasterDataService()
  ) {}

  getKpiFilter = async (c: Context) => {
    try {
      const masterData = await this.masterDataService.getKpiFilter();

      return c.json({
        success: true,
        data: masterData,
      });
    } catch (error) {
      customLog.error("Error getting kpi filter", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof HTTPException ? error.message : "Getting kpi filter failed";
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