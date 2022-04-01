import { expect } from "chai";
import * as fc from "fast-check";
import { implementsToHtml } from "./to-html";

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
