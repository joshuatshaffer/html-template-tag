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
