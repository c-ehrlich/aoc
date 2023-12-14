import { describe, expect, it } from "bun:test";
import { parse, partOne, partTwo } from "./14";

const { default: example } = await import("./example.txt");

describe("Day 14", () => {
  it("Part One", () => {
    expect(partOne(parse(example))).toBe(136);
  });

  it("Part Two", () => {
    expect(partTwo(parse(example))).toBe(64);
  });
});
