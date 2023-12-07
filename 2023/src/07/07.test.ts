import { describe, expect, it } from "bun:test";
import { parse, partOne, partTwo } from "./07";

const { default: example } = await import("./example.txt");

describe("Day 7", () => {
  it("Part One", () => {
    expect(partOne(parse(example))).toBe(6440);
  });

  it("Part Two", () => {
    expect(partTwo(parse(example))).toBe(5905);
  });
});
