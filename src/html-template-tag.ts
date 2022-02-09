import { escapeHtml } from "./escape-html";

class HtmlThing {
  constructor(private readonly content: string) {}

  toString() {
    return this.content;
  }

  toHtml() {
    return this.content;
  }

  toHtmlDoc() {
    return "<!DOCTYPE html>\n" + this.content;
  }
}

type HtmlInterpolation =
  | boolean
  | null
  | undefined
  | { toHtml(): string }
  | { toString(): string }
  | readonly HtmlInterpolation[]
  | (() => HtmlInterpolation);

function toHtml(value: HtmlInterpolation): string {
  if (value === null || value === undefined || typeof value === "boolean") {
    return "";
  }

  if (typeof value === "object" && "toHtml" in value) {
    return value.toHtml();
  }

  if (typeof value === "function") {
    return toHtml(value());
  }

  if (value instanceof Array) {
    return value.map(toHtml).join("");
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

    output += toHtml(value) + strings[i];
  }

  return new HtmlThing(output);
}

html.join = function htmlJoin(
  array: HtmlInterpolation[],
  separator: HtmlInterpolation = ""
) {
  return new HtmlThing(array.map(toHtml).join(toHtml(separator)));
};

html.raw = function htmlRaw(content: string | { toString(): string }) {
  return new HtmlThing("" + content);
};
