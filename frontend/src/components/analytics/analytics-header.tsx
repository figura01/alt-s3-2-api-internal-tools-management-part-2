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
};

export function AnalyticsHeader({
  range,
  onRangeChange,
  department,
  onDepartmentChange,
  departments,
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
            <SelectItem value="30d">Last 30 days</SelectItem>

            <SelectItem value="90d">Last 90 days</SelectItem>

            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>

        <Select value={department} onValueChange={onDepartmentChange}>
          <SelectTrigger className="w-52">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All departments</SelectItem>

            {departments.map((department) => (
              <SelectItem
                key={department.id}
                value={department.name.toLowerCase()}
              >
                {department.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </section>
  );
}
