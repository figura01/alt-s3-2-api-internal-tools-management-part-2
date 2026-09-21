export function formatPercentage(
  value: number,
  locale: string,
  showSign = false,
): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    signDisplay: showSign ? "exceptZero" : "auto",
  }).format(value / 100);
}

export function formatCurrency(
  value: number,
  locale: string,
  currency: string,
  showSign = false,
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: showSign ? "exceptZero" : "auto",
  }).format(value);
}
