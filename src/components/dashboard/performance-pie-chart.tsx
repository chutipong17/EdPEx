"use client";

import { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { PieDatum } from "@/types/dashboard";

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-md">
      <p className="text-xs font-medium text-foreground">{item.name}</p>
      <p
        className="text-sm font-semibold"
        style={{ color: item.payload.color }}
      >
        {item.value}%
      </p>
    </div>
  );
}

function renderLegend({ payload }: any) {
  return (
    <ul className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
      {payload?.map((entry: any) => (
        <li key={entry.value} className="flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
            aria-hidden="true"
          />
          <span className="text-xs text-muted-foreground">{entry.value}</span>
        </li>
      ))}
    </ul>
  );
}

export function PerformancePieChart({ data }: { data: PieDatum[] }) {
  const [radius, setRadius] = useState(110);

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (w < 768) setRadius(70);
      else if (w < 1280) setRadius(90);
      else setRadius(110);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const hasData = data.some((item) => Number(item.value) > 0);
  return (
    <div className="flex h-[320px] flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-foreground">
        สัดส่วนผลการดำเนินงาน
      </h3>
      <div className="min-h-0 flex-1">
        <div className="relative h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              {hasData && (
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={radius}
                  innerRadius={radius * 0.55}
                  paddingAngle={0}
                  stroke="none"
                  isAnimationActive={false}
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              )}

              <Tooltip content={<ChartTooltip />} />

              {hasData && (
                <Legend content={renderLegend} verticalAlign="bottom" />
              )}
            </PieChart>
          </ResponsiveContainer>

          {!hasData && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div
                className="flex items-center justify-center rounded-full border-[28px] border-muted"
                style={{
                  width: radius * 2,
                  height: radius * 2,
                }}
              >
                <span className="text-sm text-muted-foreground">
                  ไม่มีข้อมูล
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
