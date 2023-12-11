import { describe, expect, it } from "bun:test";
import { parse, partOne, partTwo } from "./11";

const { default: example } = await import("./example.txt");

describe("Day 11", () => {
  it("Part One", () => {
    expect(partOne(parse(example))).toBe(374);
  });

  it("Part Two", () => {
    expect(true).toBe(true);
  });
});
