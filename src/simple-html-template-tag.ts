/** Template literal tag for building HTML documents. */
export function html(
  strings: TemplateStringsArray,
  ...values: HtmlInterpolation[]
) {
  let output = strings[0];
  for (let i = 1; i < strings.length; ++i) {
    output += handleHtmlInterpolation(values[i - 1]);
    output += strings[i];
  }

  return new HtmlFragment(output);
}

/** Like {@link Array.join}, but with {@link HtmlFragment}s instead of strings. */
export function joinHtml(
  array: readonly HtmlInterpolation[],
  separator: HtmlInterpolation = ""
) {
  return new HtmlFragment(
    array.map(handleHtmlInterpolation).join(handleHtmlInterpolation(separator))
  );
}

/** Convert a string to an {@link HtmlFragment} without escaping. */
export function rawHtml(content: string) {
  return new HtmlFragment(content);
}

/**
 * Convert an object to HTML attributes.
 */
export function htmlAttrs(attributes: Record<string, HtmlInterpolation>) {
  // TODO: Guard against invalid attribute names.
  return joinHtml(
    Object.entries(attributes).map(([name, value]) => html`${name}="${value}"`),
    " "
  );
}

/**
 * If content is `null` or `undefined`, render a self closing tag. To render
 * an empty element, pass empty string to content.
 */
export function htmlTag(
  name: string,
  attributes?: Record<string, HtmlInterpolation>,
  content?: HtmlInterpolation
) {
  // TODO: Guard against invalid tag names.
  return html`<${name}${
    attributes && Object.keys(attributes).length > 0
      ? html` ${htmlAttrs(attributes)}`
      : null
  }${content != null ? html`>${content}</${name}>` : html` />`}`;
}

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

/**
 * Symbol for implementing the {@link ToHtml} interface.
 */
export const toHtml = Symbol("toHtml");

/**
 * Defines custom HTML rendering.
 *
 * @example
 * ```ts
 * class Book implements ToHtml {
 *   constructor (public title: string) {}
 *
 *   [toHtml]() {
 *     return html`<i>${this.title}</i>`
 *   }
 * }
 *
 * html`<p>Have you read ${new Book("Alice in Wonderland")}?</p>`;
 * ```
 *
 * Result:
 * ```html
 * <p>Have you read <i>Alice in Wonderland</i>?</p>
 * ```
 */
export interface ToHtml {
  readonly [toHtml]: () => string | HtmlFragment;
}

/**
 * Returns `true` if `value` defines its own HTML rendering.
 */
export function implementsToHtml(value: unknown): value is ToHtml {
  return typeof (value as any)?.[toHtml] === "function";
}

/**
 * Part of an HTML document.
 */
export class HtmlFragment implements ToHtml {
  constructor(private readonly content: string) {}

  toString() {
    return this.content;
  }

  [toHtml]() {
    return this;
  }
}

export type HtmlInterpolation =
  | null
  | undefined
  | ToHtml
  | readonly HtmlInterpolation[]
  | { readonly toString: () => string };

export function handleHtmlInterpolation(value: HtmlInterpolation): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (implementsToHtml(value)) {
    return value[toHtml]().toString();
  }

  if (Array.isArray(value)) {
    return value.map(handleHtmlInterpolation).join("");
  }

  return escapeHtml(value.toString());
}
