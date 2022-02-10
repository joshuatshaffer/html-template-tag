import { expect } from "chai";
import * as fc from "fast-check";
import { css, CssInterpolation } from "./css-template-tag";

function arbCssInterpolation() {
  return fc.anything() as fc.Arbitrary<CssInterpolation>;
}

describe("css", () => {
  [null, undefined, false, true].map((x) => {
    it(`renders ${x} as empty string`, () => {
      expect(
        // prettier-ignore
        css`${x}`.toString()
      ).to.equal("");
    });
  });

  it("does NOT escape strings", () => {
    fc.assert(
      fc.property(fc.string(), (string) => {
        expect(
          // prettier-ignore
          css`${string}`.toString()
        ).to.equal(string);
      })
    );
  });

  it("renders arrays", () => {
    fc.assert(
      fc.property(fc.array(arbCssInterpolation()), (array) => {
        expect(
          // prettier-ignore
          css`${array}`.toString()
        ).to.equal(
          array
            .map((x) =>
              // prettier-ignore
              css`${x}`.toString()
            )
            .join("")
        );
      })
    );
  });

  it("renders nested CSS", () => {
    fc.assert(
      fc.property(arbCssInterpolation(), arbCssInterpolation(), (a, b) => {
        // prettier-ignore
        const withNesting = css`${css`color: ${a};`} background: ${b};`.toString();
        // prettier-ignore
        const flat = css`color: ${a}; background: ${b};`.toString();

        expect(withNesting).to.equal(flat);
      })
    );
  });

  it("renders numbers", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(fc.double({ next: true }), fc.bigInt()),
        (x) => {
          expect(
            // prettier-ignore
            css`${x}`.toString()
          ).to.equal(x.toString());
        }
      )
    );
  });
});
