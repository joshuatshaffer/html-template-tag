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

/** Template literal tag for building HTML documents. */
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

// Using a namespace instead of assigning properties to the html
// function so that doc comments are preserved in the .d.ts output.
export namespace html {
  /** Like {@link Array.join}, but with {@link HtmlFragment}s instead of strings. */
  export function join(
    array: readonly HtmlInterpolation[],
    separator: HtmlInterpolation = ""
  ) {
    return new HtmlFragment(
      array.map(handleInterpolation).join(handleInterpolation(separator))
    );
  }

  /** Convert a string to an {@link HtmlFragment} without escaping. */
  export function raw(content: string) {
    return new HtmlFragment(content);
  }
}
