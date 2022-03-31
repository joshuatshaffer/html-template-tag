import { expect } from "chai";
import * as fc from "fast-check";
import { escapeHtml } from "./escape-html";
import {
  html,
  HtmlInterpolation,
  implementsToHtml,
  ToHtml,
  toHtml,
} from "./html-template-tag";

describe("ToHtml", () => {
  it("implementsToHtml returns true or false and does not throw", () => {
    fc.assert(
      fc.property(fc.anything(), (value) => {
        expect(implementsToHtml(value)).to.be.a("boolean");
      }),
      { examples: [[null]] }
    );
  });
});

function arbHtmlInterpolation() {
  return fc.anything() as fc.Arbitrary<HtmlInterpolation>;
}

describe("html", () => {
  [null, undefined, false, true].map((x) => {
    it(`renders ${x} as empty string`, () => {
      expect(html`${x}`.toString()).to.equal("");
    });
  });

  it("escapes strings", () => {
    fc.assert(
      fc.property(fc.string(), (string) => {
        expect(html`${string}`.toString()).to.equal(escapeHtml(string));
      })
    );
  });

  it("renders arrays", () => {
    fc.assert(
      fc.property(fc.array(arbHtmlInterpolation()), (array) => {
        expect(html`${array}`.toString()).to.equal(
          array.map((x) => html`${x}`.toString()).join("")
        );
      })
    );
  });

  it("renders nested HTML", () => {
    fc.assert(
      fc.property(arbHtmlInterpolation(), arbHtmlInterpolation(), (a, b) => {
        const withNesting = html`<p>${html`<em>${a}</em>`}${b}</p>`.toString();
        const flat = html`<p><em>${a}</em>${b}</p>`.toString();

        expect(withNesting).to.equal(flat);
      })
    );
  });

  it("renders numbers", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(fc.double({ next: true }), fc.bigInt()),
        (x) => {
          expect(html`${x}`.toString()).to.equal(x.toString());
        }
      )
    );
  });

  it("uses values' custom toHtml methods and does not escape the result", () => {
    fc.assert(
      fc.property(fc.string(), (string) => {
        const value: ToHtml = { [toHtml]: () => string };

        expect(html`${value}`.toString()).to.equal(string);
      })
    );
  });

  it("if a value is both a function and has an toHtml prop, the toHtml prop is used", () => {
    const foo = (() => "function result") as (() => string) & ToHtml;

    foo[toHtml] = () => "to html result";

    expect(html`${foo}`.toString()).to.equal("to html result");
  });
});
