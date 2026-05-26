export function formatDate(date?: string): string {
  if (!date) return "N/A";

  return new Date(date).toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  });
}
