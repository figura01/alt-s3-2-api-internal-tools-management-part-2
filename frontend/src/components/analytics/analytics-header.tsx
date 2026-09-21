"use client";

import { Download } from "lucide-react";

import type { Department } from "@/types/department";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  range: string;

  onRangeChange: (value: string) => void;

  department: string;

  onDepartmentChange: (value: string) => void;

  departments: Department[];
  onExport: () => void;
};

export function AnalyticsHeader({
  range,
  onRangeChange,
  department,
  onDepartmentChange,
  departments,
  onExport,
}: Props) {
  return (
    <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Analytics Overview
        </h1>

        <p className="text-muted-foreground">
          Track software spending, usage trends and optimization opportunities.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={range} onValueChange={onRangeChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="1m">Current month</SelectItem>

            <SelectItem value="3m">Last 3 months</SelectItem>

            <SelectItem value="1y">Last 12 months</SelectItem>
          </SelectContent>
        </Select>

        <Select value={department} onValueChange={onDepartmentChange}>
          <SelectTrigger className="w-52">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All departments</SelectItem>

            {departments.map((department) => (
              <SelectItem key={department.id} value={department.name}>
                {department.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={onExport}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
    </section>
  );
}
