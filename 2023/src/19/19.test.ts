import { describe, expect, it } from "bun:test";
import { parse, partOne, partTwo } from "./19";

const { default: example } = await import("./example.txt");

describe("Day 19", () => {
  it("Part One", () => {
    expect(partOne(parse(example))).toBe(19114);
  });

  it("Part Two", () => {
    expect(partTwo(parse(example))).toBe(167409079868000);
  });
});
