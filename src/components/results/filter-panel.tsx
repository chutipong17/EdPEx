"use client";

import { Search, RotateCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CATEGORIES, YEAR_OPTIONS, CHART_TYPE_OPTIONS } from "@/lib/mock-data";
import type { FilterState } from "@/types/indicator-graph";

interface FilterPanelProps {
  filters: FilterState;
  onChange: (next: Partial<FilterState>) => void;
  onSearch: () => void;
  onReset: () => void;
}

const ALL = "all";

export function FilterPanel({
  filters,
  onChange,
  onSearch,
  onReset,
}: FilterPanelProps) {
  return (
    <section
      className="rounded-3xl bg-card p-6 shadow-sm"
      aria-label="ตัวกรองข้อมูล"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* ปี */}
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="filter-year"
            className="text-sm text-muted-foreground"
          >
            ปี
          </Label>
          <Select
            value={filters.year}
            onValueChange={(v) => onChange({ year: v })}
          >
            <SelectTrigger id="filter-year" className="h-10 w-full">
              <SelectValue placeholder="เลือกปี" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>ทุกปี</SelectItem>
              {YEAR_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ประเภทตัวชี้วัด */}
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="filter-category"
            className="text-sm text-muted-foreground"
          >
            ประเภทตัวชี้วัด
          </Label>
          <Select
            value={filters.category}
            onValueChange={(v) => onChange({ category: v })}
          >
            <SelectTrigger id="filter-category" className="h-10 w-full">
              <SelectValue placeholder="เลือกประเภท" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>ทุกประเภท</SelectItem>
              {CATEGORIES.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* รายการกราฟตัวชี้วัด */}
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="filter-chart"
            className="text-sm text-muted-foreground"
          >
            รายการกราฟตัวชี้วัด
          </Label>
          <Select
            value={filters.chartType}
            onValueChange={(v) => onChange({ chartType: v })}
          >
            <SelectTrigger id="filter-chart" className="h-10 w-full">
              <SelectValue placeholder="เลือกรูปแบบ" />
            </SelectTrigger>
            <SelectContent>
              {CHART_TYPE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ค้นหาตัวชี้วัด */}
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="filter-search"
            className="text-sm text-muted-foreground"
          >
            ค้นหาตัวชี้วัด
          </Label>
          <Input
            id="filter-search"
            value={filters.search ?? ""}
            onChange={(e) => onChange({ search: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearch();
            }}
            placeholder="พิมพ์รหัสหรือชื่อตัวชี้วัด"
            className="h-10"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          onClick={onSearch}
          className="h-10 gap-2 border-info text-info hover:bg-info/10 hover:text-info"
        >
          <Search className="size-4" aria-hidden="true" />
          ค้นหาข้อมูล
        </Button>
        <Button
          variant="outline"
          onClick={onReset}
          className="h-10 gap-2 border-warning text-warning hover:bg-warning/10 hover:text-warning"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          รีเซ็ต
        </Button>
      </div>
    </section>
  );
}
