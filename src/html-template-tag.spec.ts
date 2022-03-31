import { expect } from "chai";
import * as fc from "fast-check";
import { escapeHtml } from "./escape-html";
import { html, HtmlInterpolation } from "./html-template-tag";

function arbHtmlInterpolation() {
  return fc.anything() as fc.Arbitrary<HtmlInterpolation>;
}

describe("html", () => {
  [null, undefined, false, true].map((x) => {
    it(`renders ${x} as empty string`, () => {
      expect(html`${x}`.toHtml()).to.equal("");
    });
  });

  it("escapes strings", () => {
    fc.assert(
      fc.property(fc.string(), (string) => {
        expect(html`${string}`.toHtml()).to.equal(escapeHtml(string));
      })
    );
  });

  it("renders arrays", () => {
    fc.assert(
      fc.property(fc.array(arbHtmlInterpolation()), (array) => {
        expect(html`${array}`.toHtml()).to.equal(
          array.map((x) => html`${x}`.toHtml()).join("")
        );
      })
    );
  });

  it("renders nested HTML", () => {
    fc.assert(
      fc.property(arbHtmlInterpolation(), arbHtmlInterpolation(), (a, b) => {
        const withNesting = html`<p>${html`<em>${a}</em>`}${b}</p>`.toHtml();
        const flat = html`<p><em>${a}</em>${b}</p>`.toHtml();

        expect(withNesting).to.equal(flat);
      })
    );
  });

  it("renders numbers", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(fc.double({ next: true }), fc.bigInt()),
        (x) => {
          expect(html`${x}`.toHtml()).to.equal(x.toString());
        }
      )
    );
  });

  it("uses values' custom toHtml methods and does not escape the result", () => {
    fc.assert(
      fc.property(fc.string(), (string) => {
        const value = { toHtml: () => string };

        expect(html`${value}`.toHtml()).to.equal(string);
      })
    );
  });

  it("if a value is both a function and has an toHtml prop, the toHtml prop is used", () => {
    const foo = () => "function result";

    foo.toHtml = () => "to html result";

    expect(html`${foo}`.toHtml()).to.equal("to html result");
  });
});
