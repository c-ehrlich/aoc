import { describe, expect, it } from "bun:test";
import { parse, partOne, partTwo } from "./09";

const { default: example } = await import("./example.txt");

describe("Day 9", () => {
  it("Part One", () => {
    expect(partOne(parse(example))).toBe(114);
  });

  it("Part Two", () => {
    expect(partTwo(parse(example))).toBe(2);
  });
});
