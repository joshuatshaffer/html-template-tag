import type { HtmlFragment } from "./html-fragment";

export const toHtml = Symbol("toHtml");

export interface ToHtml {
  [toHtml]: () => string | HtmlFragment;
}

export function implementsToHtml<T>(value: T): value is T & ToHtml {
  return typeof (value as any)?.[toHtml] === "function";
}
