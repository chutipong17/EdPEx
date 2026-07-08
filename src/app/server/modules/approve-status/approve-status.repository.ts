import prismaInstance from "@/app/server/config/prismaClientInstance";
import { HTTPException } from "hono/http-exception";
import { customLog } from "@/app/server/util/custom-log";
import { ApprovalStatus } from "@prisma/client";

export class ApproveStatusRepository {
  private readonly prisma = prismaInstance;

  async getApproveStatus(): Promise<ApprovalStatus[]> {
    try {
      return await this.prisma.approvalStatus.findMany();
    } catch (error) {
      customLog.error("Error fetching approve status", { error });
      throw new HTTPException(400, { message: "Failed to fetch approve status" });
    }
  }
}