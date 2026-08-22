import { ApproveStatusService } from "./approve-status.service";
import { Context } from "hono";
import { customLog } from "@/app/server/util/custom-log";
import { HTTPException } from "hono/http-exception";

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
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof HTTPException ? error.message : "Getting approval status failed";
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