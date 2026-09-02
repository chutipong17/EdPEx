import prismaInstance from "@/app/server/config/prismaClientInstance";
import { HTTPException } from "hono/http-exception";
import { customLog } from "@/app/server/util/custom-log";
import { KpiFilterResponse } from "./master-data.service";

export class MasterDataRepository {
  private readonly prisma = prismaInstance;

  async getKpiFilter(): Promise<KpiFilterResponse> {
    try {
      const kpi = await this.prisma.kpi.findMany({
        where: {
          isDeleted: false,
        },
        select: {
          year: true,
          kpiCode: true,
        },
        distinct: ["year", "kpiCode"],
      });

      const result = {
        year: [...new Set(kpi.map((item) => item.year))]
          .sort((a, b) => a - b)
          .map(String),

        kpiCode: [...new Set(kpi.map((item) => item.kpiCode))]
          .sort((a, b) => a.localeCompare(b)),
      };
      return result;
    } catch (error) {
      customLog.error("Error fetching kpi filter", { error });
      const status = error instanceof HTTPException ? error.status : 500;
      throw new HTTPException(status, { message: "Failed to fetch kpi filter" });
    }
  }
}