import { HtmlFragment } from "./html-fragment";
import {
  HtmlInterpolation,
  handleHtmlInterpolation,
} from "./html-interpolation";

/** Like {@link Array.join}, but with {@link HtmlFragment}s instead of strings. */
export function joinHtml(
  array: readonly HtmlInterpolation[],
  separator: HtmlInterpolation = ""
) {
  return new HtmlFragment(
    array.map(handleHtmlInterpolation).join(handleHtmlInterpolation(separator))
  );
}

/** Convert a string to an {@link HtmlFragment} without escaping. */
export function rawHtml(content: string) {
  return new HtmlFragment(content);
}
