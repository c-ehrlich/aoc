import { describe, expect, it } from "bun:test";
import { partTwo, partOne, parseB, parseA } from "./06";

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
});
