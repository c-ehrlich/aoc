import { describe, expect, it } from "bun:test";
import {
  findOrderedPlacements,
  isLegalPosition,
  parse,
  partOne,
  partTwo
} from "./12";

const { default: example } = await import("./example.txt");

describe("Day 12", () => {
  describe("isLegalPosition", () => {
    it("Valid", () => {
      expect(isLegalPosition("???.###", [1, 1, 3], [0, 2, 4])).toBe(true);
    });

    it("On a .", () => {
      expect(isLegalPosition("???.###", [3], [3])).toBe(false);
    });

    it("Missing a #", () => {
      expect(isLegalPosition("???.###", [1, 1, 1, 1], [0, 2, 4, 6])).toBe(
        false
      );
    });
  });

  it("Part One", () => {
    expect(partOne(parse(example))).toBe(21);
  });

  it("Part Two", () => {
    expect(partTwo(parse(example))).toBe(525152);
  });
});
