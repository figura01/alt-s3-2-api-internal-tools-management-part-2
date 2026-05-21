import type { Analytics } from "@/types/analytic";

export async function getAnalyticsForDepartementByCost(): Promise<Analytics> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/analytics/department-costs?sort_by=total_cost&order=desc`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch analytics");
  }

  return response.json();
}

export async function getAnalyticsForExpensiveTools(): Promise<Analytics> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/analytics/expensive-tools?limit=10&min_cost=50`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch analytics");
  }

  return response.json();
}

export async function getAnalyticsForLowUsageTools(): Promise<Analytics> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/analytics/low-usage-tools?max_users=5`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch analytics");
  }

  return response.json();
}

export async function getAnalyticsForVendorSummary(): Promise<Analytics> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/analytics/vendor-summary`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch analytics");
  }

  return response.json();
}
