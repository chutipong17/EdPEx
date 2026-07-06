import { ApproveStatusService } from "./approve-status.service";
import { Context } from "hono";
import { customLog } from "@/app/server/util/custom-log";

export class ApproveStatusController {
  constructor(
    private readonly approveStatusService = new ApproveStatusService()
  ) {}

  getApproveStatus = async (c: Context) => {
    try {
      const approveStatus = await this.approveStatusService.getApproveStatus();

      return c.json({
        success: true,
        data: approveStatus,
      });
    } catch (error) {
      customLog.error("Error getting approval status", { error });
      return c.json(
        {
          success: false,
          error: { message: error instanceof Error ? error.message : "approval status failed" },
        },
        400,
      );
    }
  };
}