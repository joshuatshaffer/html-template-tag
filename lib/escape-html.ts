const map = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;",
} as const;

export function escapeHtml(unescaped: string): string {
  return unescaped.replace(/[&<>"'`]/g, (c) => map[c as keyof typeof map]);
}
