export const DISPLAY_PREFERENCES_KEY = "techcorp-display-preferences";
export const LOCALES = [
  { value: "fr-FR", label: "France (1 234,56)" },
  { value: "en-GB", label: "United Kingdom (1,234.56)" },
  { value: "en-US", label: "United States (1,234.56)" },
  { value: "de-DE", label: "Germany (1.234,56)" },
] as const;
export const CURRENCIES = ["EUR", "USD", "GBP", "CHF"] as const;

export function readDisplayPreferences(): { locale: string; currency: string } | null {
  try {
    const value = JSON.parse(localStorage.getItem(DISPLAY_PREFERENCES_KEY) ?? "null");
    if (value && LOCALES.some((item) => item.value === value.locale) &&
      CURRENCIES.some((currency) => currency === value.currency)) {
      return { locale: value.locale, currency: value.currency };
    }
  } catch {
    // Invalid or unavailable storage leaves the application's defaults intact.
  }
  return null;
}
