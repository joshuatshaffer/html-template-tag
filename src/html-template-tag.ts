import { HtmlFragment } from "./html-fragment";
import {
  handleHtmlInterpolation,
  HtmlInterpolation,
} from "./html-interpolation";

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

export namespace html {
  /** Like {@link Array.join}, but with {@link HtmlFragment}s instead of strings. */
  export function join(
    array: readonly HtmlInterpolation[],
    separator: HtmlInterpolation = ""
  ) {
    return new HtmlFragment(
      array
        .map(handleHtmlInterpolation)
        .join(handleHtmlInterpolation(separator))
    );
  }

  /** Convert a string to an {@link HtmlFragment} without escaping. */
  export function raw(content: string) {
    return new HtmlFragment(content);
  }

  /**
   * Convert an object to HTML attributes.
   */
  export function attrs(attributes: Record<string, HtmlInterpolation>) {
    // TODO: Guard against invalid attribute names.
    return html.join(
      Object.entries(attributes).map(
        ([name, value]) => html`${name}="${value}"`
      ),
      " "
    );
  }

  /**
   * If content is `null` or `undefined`, render a self closing tag. To render
   * an empty element, pass empty string to content.
   */
  export function tag(
    name: string,
    attributes?: Record<string, HtmlInterpolation>,
    content?: HtmlInterpolation
  ) {
    // TODO: Guard against invalid tag names.
    return html`<${name}${
      attributes && Object.keys(attributes).length > 0
        ? html` ${html.attrs(attributes)}`
        : null
    }${content != null ? html`>${content}</${name}>` : html` />`}`;
  }
}
