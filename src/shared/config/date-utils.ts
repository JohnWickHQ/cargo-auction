export function formatDate(date: string | null): string {
  return date ? new Date(date).toLocaleDateString("ru-RU") : "—";
}
