import { escapeHtml } from "./escape-html";
import { format } from "prettier";

export interface ToHtml {
  toHtml: () => string;
}

export class HtmlThing implements ToHtml {
  constructor(private readonly content: string) {}

  toString() {
    return this.content;
  }

  toHtml() {
    return this.content;
  }

  toHtmlDoc() {
    return format("<!DOCTYPE html>\n" + this.content, { parser: "html" });
  }
}

export function hasToHtml(value: unknown): value is ToHtml {
  return typeof (value as ToHtml)?.toHtml === "function";
}

function toHtml(value: unknown): string {
  if (hasToHtml(value)) return value.toHtml();

  if (Array.isArray(value)) return value.map(toHtml).join("");

  return escapeHtml("" + value);
}

export function html(strings: TemplateStringsArray, ...values: unknown[]) {
  let output = strings[0];

  for (let i = 1; i < strings.length; ++i) {
    const value = values[i - 1];

    output += toHtml(value) + strings[i];
  }

  return new HtmlThing(output);
}

html.join = function htmlJoin(array: unknown[], separator: unknown = "") {
  return new HtmlThing(array.map(toHtml).join(toHtml(separator)));
};
