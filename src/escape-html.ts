/** Replace potentially troublesome characters with their HTML character entities. */
export function escapeHtml(unescaped: string): string {
  return unescaped.replace(
    /[&<>"'`]/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "`": "&#x60;",
      }[c]!)
  );
}
