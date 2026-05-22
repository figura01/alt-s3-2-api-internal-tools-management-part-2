export type KpiVariant = "green" | "blue" | "orange" | "pink";

export type Kpi = {
  title: string;
  value: number;
  suffix?: string;
  trend: string;
  progress?: number;
  variant: KpiVariant;
  format: "currency" | "number";
};
