"use client";

import { useMemo, useState } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { KpiApi } from "@/types/kpi-kpi";

import { mapKpisToComparisonGraph } from "@/lib/kpi-comparison";
import { useGetKpi } from "@/service/kpi/kpi";

export default function ComparisonDashboard() {
  const { data: kpiResponse, isLoading } = useGetKpi();

  const [selectedKpi, setSelectedKpi] = useState<string>("");
  const [searchKpi, setSearchKpi] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  /* =========================================
     KPI DATA
  ========================================= */
  const kpis: KpiApi[] = useMemo(() => {
    if (Array.isArray(kpiResponse)) {
      return kpiResponse;
    }

    return kpiResponse?.data ?? [];
  }, [kpiResponse]);

  /* =========================================
     CONVERT KPI DATA
  ========================================= */
  const comparisonData = useMemo(() => {
    return mapKpisToComparisonGraph(kpis);
  }, [kpis]);

  /* =========================================
     SEARCH KPI
     ค้นหาจากรหัส + ชื่อ KPI
  ========================================= */
  const filteredKpis = useMemo(() => {
    const keyword = searchKpi.trim().toLowerCase();

    if (!keyword) {
      return comparisonData;
    }

    return comparisonData.filter((item) => {
      const kpiCode = String(item.kpiCode).toLowerCase();
      const kpiName = String(item.kpiName).toLowerCase();

      return kpiCode.includes(keyword) || kpiName.includes(keyword);
    });
  }, [comparisonData, searchKpi]);

  /* =========================================
     DISPLAY KPI LIST
  ========================================= */
  const displayKpis = useMemo(() => {
    if (searchKpi.trim()) {
      return filteredKpis;
    }

    return comparisonData;
  }, [searchKpi, filteredKpis, comparisonData]);

  /* =========================================
     SELECTED KPI
  ========================================= */
  const selectedGraph = useMemo(() => {
    if (!selectedKpi) {
      return comparisonData[0] ?? null;
    }

    return (
      comparisonData.find((item) => String(item.kpiCode) === selectedKpi) ??
      null
    );
  }, [comparisonData, selectedKpi]);

  /* =========================================
     LOADING
  ========================================= */
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-muted-foreground">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* =========================================
          HEADER
      ========================================= */}
     

      {/* =========================================
          FILTER
      ========================================= */}
      <div className="rounded-xl border bg-card p-5">
          <h1 className="text-3xl font-semibold">เปรียบเทียบผลลัพธ์ KPI รายปี</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          เปรียบเทียบค่าเป้าหมายและผลประเมินของ KPI ในแต่ละปี
        </p>
        <br className="my-5 border-t border-border" />
        <div className="flex flex-col gap-2">
          <label htmlFor="kpi" className="text-sm font-medium">
            ตัวชี้วัด
          </label>

          <div className="relative z-50">
            {/* =====================================
                INPUT SEARCH / SELECT
            ===================================== */}
            <div className="relative">
              <input
                id="kpi"
                type="text"
                value={
                  isOpen
                    ? searchKpi
                    : selectedGraph
                      ? `${selectedGraph.kpiCode} - ${selectedGraph.kpiName}`
                      : searchKpi
                }
                onFocus={() => {
                  setIsOpen(true);

                  /*
                   * ถ้ามี KPI ที่เลือกอยู่
                   * เมื่อกด Input ให้กลับมาค้นหาได้
                   */
                  if (selectedKpi) {
                    setSearchKpi("");
                  }
                }}
                onChange={(event) => {
                  const value = event.target.value;

                  setSearchKpi(value);
                  setSelectedKpi("");
                  setIsOpen(true);
                }}
                placeholder="ค้นหา หรือ เลือกตัวชี้วัด..."
                className="h-11 w-full rounded-lg border bg-background px-3 pr-10 text-sm outline-none transition focus:ring-2 focus:ring-ring"
              />

              {/* =====================================
                  CLEAR BUTTON
              ===================================== */}
              {(searchKpi || selectedKpi) && (
                <button
                  type="button"
                  aria-label="ล้างตัวชี้วัด"
                  onClick={() => {
                    setSearchKpi("");
                    setSelectedKpi("");
                    setIsOpen(true);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>

            {/* =====================================
                DROPDOWN
            ===================================== */}
            {isOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 max-h-80 overflow-y-auto rounded-lg border bg-background shadow-xl">
                {displayKpis.length > 0 ? (
                  displayKpis.map((item) => {
                    const itemCode = String(item.kpiCode);

                    const isSelected = itemCode === selectedKpi;

                    return (
                      <button
                        key={itemCode}
                        type="button"
                        onClick={() => {
                          setSelectedKpi(itemCode);
                          setSearchKpi("");
                          setIsOpen(false);
                        }}
                        className={`flex w-full flex-col gap-1 border-b px-4 py-3 text-left transition last:border-b-0 hover:bg-muted ${
                          isSelected ? "bg-muted" : "bg-background"
                        }`}
                      >
                        <span className="text-sm font-medium">
                          {item.kpiCode}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          {item.kpiName}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="px-4 py-4">
                    <p className="text-sm text-muted-foreground">
                      ไม่พบตัวชี้วัด
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================
          CLICK OUTSIDE
      ========================================= */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* =========================================
          CHART
      ========================================= */}
      {selectedGraph ? (
        <div className="rounded-xl border bg-card p-6">
          {/* =====================================
              CHART HEADER
          ===================================== */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold">{selectedGraph.kpiCode}</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {selectedGraph.kpiName}
            </p>
          </div>

          {/* =====================================
              BAR CHART
          ===================================== */}
          <div className="h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={selectedGraph.data}
                margin={{
                  top: 20,
                  right: 20,
                  left: 0,
                  bottom: 10,
                }}
                barCategoryGap="0%"
                barGap={0}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 13 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={50}
                />

                <Tooltip
                  cursor={{ opacity: 0.08 }}
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                  }}
                />

                <Legend verticalAlign="top" align="right" height={40} />

                <Bar
                  dataKey="target"
                  name="เป้าหมาย"
                  fill="var(--chart-1)"
                  radius={[3, 3, 0, 0]}
                  barSize={35}
                />

                <Bar
                  dataKey="actualValue"
                  name="ผลประเมิน"
                  fill="var(--chart-2)"
                  radius={[3, 3, 0, 0]}
                  barSize={35}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* =========================================
              TABLE
          ========================================= */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left">ปี</th>

                  <th className="px-4 py-3 text-right">เป้าหมาย</th>

                  <th className="px-4 py-3 text-right">ผลประเมิน</th>

                  <th className="px-4 py-3 text-right">หน่วย</th>
                </tr>
              </thead>

              <tbody>
                {selectedGraph.data.map((item) => (
                  <tr key={item.year} className="border-b last:border-0">
                    <td className="px-4 py-3">{item.year}</td>

                    <td className="px-4 py-3 text-right">
                      {item.target ?? "-"}
                    </td>

                    <td className="px-4 py-3 text-right font-medium">
                      {item.actualValue ?? "-"}
                    </td>

                    <td className="px-4 py-3 text-right">
                      {selectedGraph.unit ?? "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed">
          <p className="text-sm text-muted-foreground">
            ไม่พบข้อมูล KPI สำหรับเปรียบเทียบ
          </p>
        </div>
      )}
    </div>
  );
}
