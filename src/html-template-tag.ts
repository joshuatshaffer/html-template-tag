import { escapeHtml } from "./escape-html";

export const toHtml = Symbol("toHtml");

export interface ToHtml {
  [toHtml]: () => string;
}

export function implementsToHtml<T>(value: T): value is T & ToHtml {
  return (
    (typeof value === "object" || typeof value === "function") &&
    toHtml in value
  );
}

class HtmlThing implements ToHtml {
  constructor(private readonly content: string) {}

  toString() {
    return this.content;
  }

  [toHtml]() {
    return this.content;
  }

  toHtmlDoc() {
    return "<!DOCTYPE html>\n" + this.content;
  }
}

export type HtmlInterpolation =
  | boolean
  | null
  | undefined
  | ToHtml
  | { toString(): string }
  | readonly HtmlInterpolation[]
  | (() => HtmlInterpolation);

function handleInterpolation(value: HtmlInterpolation): string {
  if (value === null || value === undefined || typeof value === "boolean") {
    return "";
  }

  if (implementsToHtml(value)) {
    return value[toHtml]();
  }

  if (typeof value === "function") {
    return handleInterpolation(value());
  }

  if (value instanceof Array) {
    return value.map(handleInterpolation).join("");
  }

  return escapeHtml("" + value);
}

export function html(
  strings: TemplateStringsArray,
  ...values: HtmlInterpolation[]
) {
  let output = strings[0];

  for (let i = 1; i < strings.length; ++i) {
    const value = values[i - 1];

    output += handleInterpolation(value) + strings[i];
  }

  return new HtmlThing(output);
}

html.join = function htmlJoin(
  array: HtmlInterpolation[],
  separator: HtmlInterpolation = ""
) {
  return new HtmlThing(
    array.map(handleInterpolation).join(handleInterpolation(separator))
  );
};

html.raw = function htmlRaw(content: string | { toString(): string }) {
  return new HtmlThing("" + content);
};
