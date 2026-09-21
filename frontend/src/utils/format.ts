export function formatPercentage(
  value: number | null,
  locale: string,
  showSign = false,
): string {
  if (value === null) return "—";
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    signDisplay: showSign ? "exceptZero" : "auto",
  }).format(value / 100);
}

export function formatCurrency(
  value: number | null,
  locale: string,
  currency: string,
  showSign = false,
): string {
  if (value === null) return "—";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: showSign ? "exceptZero" : "auto",
  }).format(value);
}
