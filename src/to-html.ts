import type { HtmlFragment } from "./html-fragment";

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
