// src/utils/chart-formatters.ts

import type {
  Formatter,
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

import { formatCurrency } from "@/utils/formatCurrency";

export const formatChartCurrency: Formatter<ValueType, NameType> = (value) => {
  if (typeof value === "number") {
    return formatCurrency(value);
  }

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.join(" - ");
  }

  return "N/A";
};
