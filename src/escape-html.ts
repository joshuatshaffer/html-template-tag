/**
 * Replace potentially troublesome characters (`&`, `<`, `>`, `'`, `"`, and `` `
 * ``) with their HTML character entities.
 *
 * Note: Always quote attribute values. Escaping works fine in attribute values,
 * but it will not stop attribute injection if the attribute is unquoted. For
 * example, ``html`<div foo=${'bar style=color:red}>test</div>`` produces `<div
 * foo=bar style=color:red>test</div>`. Quoting prevents this; ``html`<div
 * foo="${'bar" style="color:red}">test</div>`` produces `<div foo="bar&quot;
 * style=&quot;color:red">test</div>`.
 *
 * Note: Escaping does not work for the content of `<script>` and `<style>`
 * tags. The content of these tags does not use HTML character references.
 */
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
