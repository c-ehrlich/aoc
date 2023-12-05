import { describe, expect, it } from "bun:test";
import { partTwo, parsePartOne, parsePartTwo, partOne } from "./05";

const { default: example } = await import(`./example.txt`);

describe("Day 5", () => {
  it("Part One", () => {
    const res = partOne(parsePartOne(example));
    expect(res).toEqual(35);
  });

  it("Part Two", () => {
    // const res = partTwo(parsePartTwo(example));
    // expect(res).toEqual(46);
  });
});
