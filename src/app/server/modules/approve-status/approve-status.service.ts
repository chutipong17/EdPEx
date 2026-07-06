import { customLog } from "@/app/server/util/custom-log";
import { ApprovalStatus } from "@prisma/client";
import { ApproveStatusRepository } from "./approve-status.repository";

export class ApproveStatusService {
  constructor(private readonly approveStatusRepository = new ApproveStatusRepository()) {}

  async getApproveStatus(): Promise<ApprovalStatus[]> {
    try {
      customLog.info("Getting approval status service");
      return this.approveStatusRepository.getApproveStatus();
    } catch (error) {
      customLog.error("Error getting approval status", { error });
      throw new Error("approval status failed");
    }
  }
}