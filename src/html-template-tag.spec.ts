import { expect } from "chai";
import * as fc from "fast-check";
import { escapeHtml } from "./escape-html";
import { HtmlInterpolation } from "./html-interpolation";
import { html } from "./html-template-tag";
import { ToHtml, toHtml } from "./to-html";

function arbHtmlInterpolation() {
  return fc.anything() as fc.Arbitrary<HtmlInterpolation>;
}

describe("html", () => {
  [null, undefined].map((x) => {
    it(`renders ${x} as empty string`, () => {
      expect(html`${x}`.toString()).to.equal("");
    });
  });

  it(`renders boolean true as string "true"`, () => {
    expect(html`${true}`.toString()).to.equal("true");
  });

  it(`renders boolean false as string "false"`, () => {
    expect(html`${false}`.toString()).to.equal("false");
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
});
