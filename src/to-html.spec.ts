import { expect } from "chai";
import { HtmlFragment } from "./html-fragment";
import { implementsToHtml, toHtml } from "./to-html";
import { inspect } from "util";

describe("implementsToHtml", () => {
  describe("returns true for", () => {
    for (const x of [
      { [toHtml]: () => "" },
      {
        [toHtml]() {
          return "";
        },
      },
      {
        get [toHtml]() {
          return () => "";
        },
      },
      new HtmlFragment(""),
    ]) {
      it(inspect(x), () => {
        expect(implementsToHtml(x)).to.be.true;
      });
    }
  });

  describe("returns false for", () => {
    for (const x of [
      null,
      undefined,
      Infinity,
      NaN,
      0,
      1,
      -1,
      true,
      false,
      "",
      "test",
      [],
      { toHtml: () => "" },
      { [toHtml]: null },
      { [toHtml]: undefined },
    ]) {
      it(inspect(x), () => {
        expect(implementsToHtml(x)).to.be.false;
      });
    }
  });
});
