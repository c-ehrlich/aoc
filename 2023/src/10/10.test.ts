import { describe, expect, it } from "bun:test";
import { parse, partOne, partTwo } from "./10";

const { default: example1 } = await import("./example1.txt");
const { default: example2 } = await import("./example2.txt");
const { default: example3 } = await import("./example3.txt");
const { default: example4 } = await import("./example4.txt");
const { default: example5 } = await import("./example5.txt");

describe("Day 10", () => {
  it("Part One", () => {
    expect(partOne(parse(example2))).toBe(8);
  });

  it("Part Two", () => {
    expect(partTwo(parse(example4))).toBe(10);
    expect(partTwo(parse(example5))).toBe(8);
    expect(partTwo(parse(example3))).toBe(4);
  });
});
