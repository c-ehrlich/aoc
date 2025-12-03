import { describe, expect, it } from "bun:test";
import { findBiggestNumber } from "./03";

describe("findBiggestNumber", () => {
  it("123", () => {
    const nums = "12345".split("").map(Number);
    expect(findBiggestNumber(nums, 0, 3)).toEqual({ pos: 2, val: 3 });
  });

  it("121314151617", () => {
    const nums = "121314151617".split("").map(Number);
    expect(findBiggestNumber(nums, 0, 1)).toEqual({ pos: 11, val: 7 });
  });
});
