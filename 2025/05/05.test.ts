import { describe, expect, it } from "bun:test";
import { solveB } from "./05";

describe("solveB", () => {
  it("test", () => {
    const ingredients = [] as any[];
    expect(solveB({ ingredients, ranges: [{ start: 1, end: 5 }] })).toEqual(5);
    expect(
      solveB({
        ingredients,
        ranges: [
          { start: 1, end: 5 },
          { start: 2, end: 4 }
        ]
      })
    ).toEqual(5);
    expect(
      solveB({
        ingredients,
        ranges: [
          { start: 2, end: 4 },
          { start: 1, end: 5 }
        ]
      })
    ).toEqual(5);
  });
});
