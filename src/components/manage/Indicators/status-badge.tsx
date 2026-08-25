import {
  CheckCircle2,
  Grid2x2X,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { IndicatorStatus,IndicatorStatusKpiSubmission  } from "@/types/indicator-Edpx";
type StatusType = IndicatorStatusKpiSubmission|IndicatorStatus;

const config: Record<
  StatusType,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    className: string;
  }
> = {
  success: {
    label: "ส่งข้อมูลสำเร็จ",
    icon: CheckCircle2,
    className: "bg-success/10 text-success ring-1 ring-success/20",
  },

  warning: {
    label: "รอดำเนินการ",
    icon: Grid2x2X,
    className: "bg-warning/10 text-warning ring-1 ring-warning/20",
  },

  danger: {
    label: "ไม่บรรลุเป้าหมาย",
    icon: XCircle,
    className: "bg-danger/10 text-danger ring-1 ring-danger/20",
  },

  Pending: {
    label: "รอดำเนินการ",
    icon: Grid2x2X,
    className:
      "bg-warning/10 text-warning ring-1 ring-warning/20",
  },

  Submitted: {
    label: "ส่งข้อมูลแล้ว",
    icon: CheckCircle2,
    className:
      "bg-success/10 text-success ring-1 ring-success/20",
  },
};

export function StatusBadge({
  status,
}: {
  status?: StatusType | string | null;
}) {
  let validStatus: IndicatorStatus = "warning";

  switch (status) {
    case "success":
      validStatus = "success";
      break;

    case "danger":
      validStatus = "danger";
      break;

    case "warning":
      validStatus = "warning";
      break;

    // KPI Submission
    case "Submitted":
      validStatus = "success";
      break;

    case "Pending":
      validStatus = "warning";
      break;

    default:
      validStatus = "warning";
      break;
  }

  const {
    label,
    icon: Icon,
    className,
  } = config[validStatus];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        className,
      )}
    >
      <Icon className="size-3.5" />
      {label}
    </span>
  );
}

// const config: Record<
//   IndicatorStatus,
//   {
//     label: string;
//     icon: React.ComponentType<{ className?: string }>;
//     className: string;
//   }
// > = {
//   success: {
//     label: "บรรลุเป้าหมาย",
//     icon: CheckCircle2,
//     className:
//       "bg-success/10 text-success ring-1 ring-success/20",
//   },

//   warning: {
//     label: "รอดำเนินการ",
//     icon: Grid2x2X,
//     className:
//       "bg-warning/10 text-warning ring-1 ring-warning/20",
//   },

//   danger: {
//     label: "ไม่บรรลุเป้าหมาย",
//     icon: XCircle,
//     className:
//       "bg-danger/10 text-danger ring-1 ring-danger/20",
//   },
// };

// export function StatusBadge({
//   status,
// }: {
//   status?: IndicatorStatus | string | null;
// }) {
//   // ป้องกัน status ที่ไม่มีอยู่ใน config
//   const validStatus: IndicatorStatus =
//     status === "success" ||
//     status === "warning" ||
//     status === "danger"
//       ? status
//       : "warning";

//   const {
//     label,
//     icon: Icon,
//     className,
//   } = config[validStatus];

//   return (
//     <span
//       className={cn(
//         "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
//         className
//       )}
//     >
//       <Icon className="size-3.5" />
//       {label}
//     </span>
//   );
// }