import { customLog } from "@/app/server/util/custom-log";
import { HTTPException } from "hono/http-exception";
import { ConditionName, KpiSubmissionStatus } from "../../enum/enum";
import { evaluateTargetCondition } from "../../util/target-condition";
import { DashboardRepository } from "./dashboard.repository";
import { DashboardDto } from "../../dto/dashboard.dto";

export interface KpiSummaryResponse {
  total: number;       // จำนวนตัวชี้วัดทั้งหมด
  achieved: number;    // บรรลุเป้าหมาย
  notAchieved: number; // ไม่บรรลุเป้าหมาย
  noData: number;      // ไม่มีข้อมูล
}

export class DashboardService {
  constructor(
    private readonly dashboardRepository = new DashboardRepository(),
  ) {}

  async getDashboard(data: DashboardDto): Promise<KpiSummaryResponse> {
    try {
      customLog.info("Getting dashboard service");
      let total = 0;
      let achieved = 0;
      let notAchieved = 0;
      let noData = 0;

      const kpi = await this.dashboardRepository.getKpiDashboard(data);

      total = kpi.length;

      for (const item of kpi) {
        const submissions = item.kpiAssignment
          .flatMap((assignment) => assignment.kpiSubmission ?? [])
          .filter((submission) => submission.status?.id !== KpiSubmissionStatus.PENDING);

        if (submissions.length === 0) {
          noData += 1;
          continue;
        }

        const latestSubmission = submissions
          .sort((a, b) => {
            const aDate = a.submittedDate ?? a.createdAt;
            const bDate = b.submittedDate ?? b.createdAt;
            return new Date(bDate).getTime() - new Date(aDate).getTime();
          })[0];

        // const achievementPercent = Number(latestSubmission?.achievementPercent ?? 0);
        const target = Number(item.targetValue ?? 0);
        const value = Number(latestSubmission?.actualValue ?? 0);
        const condition = ConditionName[item.targetCondition.conditionName as keyof typeof ConditionName]
        const achievedTarget = evaluateTargetCondition(value, condition, target);

        if (achievedTarget) {
          achieved += 1;
        } else {
          notAchieved += 1;
        }
      }

      return {
        total,
        achieved,
        notAchieved,
        noData,
      };
    } catch (error) {
      const status = error instanceof HTTPException ? error.status : 500;
      const errorMessage = error instanceof Error ? error.message : "Getting dashboard failed";
      customLog.error("Error getting dashboard: ", { message: errorMessage });
      throw new HTTPException(status, { message: errorMessage });
    }
  }
}