import { escapeHtml } from "./escape-html";
import { implementsToHtml, toHtml, ToHtml } from "./to-html";

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
