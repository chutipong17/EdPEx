export interface DashboardPieData {
  name: string;
  value: number;
  color: string;
}

export function mapDashboardToPieData(
  dashboardResponse: any,
): DashboardPieData[] {
  if (!dashboardResponse) {
    return [];
  }

  const data =
    dashboardResponse?.data ??
    dashboardResponse;

  return [
    {
      name: "ไม่มีข้อมูล",
      value: Number(data?.noData ?? 0),
      color: "var(--danger)",
    },
    {
      name: "บรรลุเป้าหมาย",
      value: Number(data?.achieved ?? 0),
      color: "var(--success)",
    },
    {
      name: "ไม่บรรลุเป้าหมาย",
      value: Number(data?.notAchieved ?? 0),
      color: "var(--warning)",
    },
  ];
}
// export function mapDashboardToPieData(
//   dashboardResponse: any,
// ): DashboardPieData[] {
//   if (!dashboardResponse) {
//     return [];
//   }

//   const data =
//     dashboardResponse?.data ??
//     dashboardResponse;

//   return [
//     {
//       name: "ไม่มีข้อมูล",
//       value: Number(data?.noData ?? 0),
//       color: "var(--danger)",
//     },
//     {
//       name: "บรรลุเป้าหมาย",
//       value: Number(data?.achieved ?? 0),
//       color: "var(--success)",
//     },
//     {
//       name: "ไม่บรรลุเป้าหมาย",
//       value: Number(data?.notAchieved ?? 0),
//       color: "var(--warning)",
//     },
//   ];
// }