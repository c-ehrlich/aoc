import { assert, describe, it } from "vitest";
import { HeadTail, solve09a, solve09b } from "./day09";

describe("day09", () => {
  it("input", () => {
    const headTail = new HeadTail({ file: "09/sample.txt", ropeLength: 2 });
    assert.deepEqual(headTail.moves[headTail.moves.length - 1], ["R", 2]);
  });
  it("solve09a", () => {
    const headTail = new HeadTail({ file: "09/sample.txt", ropeLength: 2 });
    headTail.makeMoves();
    assert.equal(headTail.getNumberOfVisitedCoordinates(), 13);
  });
  it("solve09b", () => {
    const headTail = new HeadTail({ file: "09/sample2.txt", ropeLength: 10 });
    headTail.makeMoves();
    assert.equal(headTail.getNumberOfVisitedCoordinates(), 36);
  });
});
