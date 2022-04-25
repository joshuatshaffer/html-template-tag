import { escapeHtml } from "./escape-html";
import { HtmlFragment } from "./html-fragment";
import { implementsToHtml, toHtml, ToHtml } from "./to-html";

export type HtmlInterpolation =
  | null
  | undefined
  | ToHtml
  | readonly HtmlInterpolation[]
  | { readonly toString: () => string };

function handleInterpolation(value: HtmlInterpolation): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (implementsToHtml(value)) {
    return value[toHtml]().toString();
  }

  if (value instanceof Array) {
    return value.map(handleInterpolation).join("");
  }

  return escapeHtml(value.toString());
}

export function html(
  strings: TemplateStringsArray,
  ...values: HtmlInterpolation[]
) {
  let output = strings[0];
  for (let i = 1; i < strings.length; ++i) {
    output += handleInterpolation(values[i - 1]);
    output += strings[i];
  }

  return new HtmlFragment(output);
}

html.join = function joinHtml(
  array: readonly HtmlInterpolation[],
  separator: HtmlInterpolation = ""
) {
  return new HtmlFragment(
    array.map(handleInterpolation).join(handleInterpolation(separator))
  );
};

html.raw = function rawHtml(content: string) {
  return new HtmlFragment(content);
};
