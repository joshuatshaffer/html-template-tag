import { expect } from "chai";
import * as fc from "fast-check";
import { inspect } from "node:util";
import {
  escapeHtml,
  html,
  HtmlFragment,
  HtmlInterpolation,
  htmlTag,
  implementsToHtml,
  ToHtml,
  toHtml,
} from "./simple-html-template-tag";

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

describe("htmlTag", () => {
  it("tag with content", () => {
    expect(htmlTag("p", {}, "test").toString()).to.equal("<p>test</p>");
  });

  it("tag with attribute and content", () => {
    expect(
      htmlTag(
        "a",
        { href: "https://example.com/?foo&bar=0" },
        "test"
      ).toString()
    ).to.equal('<a href="https://example.com/?foo&amp;bar=0">test</a>');
  });

  it("self closing tag", () => {
    expect(htmlTag("br").toString()).to.equal("<br />");
  });

  it("self closing tag with attributes", () => {
    expect(
      htmlTag("meta", {
        name: "description",
        content: "This is a webpage.",
      }).toString()
    ).to.equal('<meta name="description" content="This is a webpage." />');
  });
});

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
