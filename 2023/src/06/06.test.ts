import { describe, expect, it } from "bun:test";
import {
  partTwo,
  partOne,
  parseB,
  parseA,
  fastPartTwo,
  veryFastPartTwo,
  constantTimePartTwo
} from "./06";

const { default: example } = await import(`./example.txt`);

describe("Day 6", () => {
  it("Part One", () => {
    const res = partOne(parseA(example));
    expect(res).toEqual(288);
  });

  it("Part Two", () => {
    const res = partTwo(parseB(example));
    expect(res).toEqual(71503);
  });
  it("Part Two Fast", () => {
    const res = fastPartTwo(parseB(example));
    expect(res).toEqual(71503);
  });
  it("Part Two Very Fast", () => {
    const res = veryFastPartTwo(parseB(example));
    expect(res).toEqual(71503);
  });
  it("Part Two Constant Time", () => {
    const res = constantTimePartTwo(parseB(example));
    expect(res).toEqual(71503);
  });
});
