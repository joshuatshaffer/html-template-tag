import { toHtml, ToHtml } from "./to-html";

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

  toHtmlDoc() {
    return "<!DOCTYPE html>\n" + this.content;
  }
}
