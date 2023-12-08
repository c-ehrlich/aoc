import { describe, expect, it } from "bun:test";
import { parse, partOne, partTwo } from "./08";

const { default: example } = await import("./example.txt");
const { default: example2 } = await import("./example2.txt");
const { default: example3 } = await import("./example3.txt");

describe("Day 8", () => {
  it("Part One", () => {
    expect(partOne(parse(example))).toBe(2);
  });

  it("Part One second example", () => {
    expect(partOne(parse(example2))).toBe(6);
  });

  it("Part Two", () => {
    expect(partTwo(parse(example3))).toBe(6);
  });
});
