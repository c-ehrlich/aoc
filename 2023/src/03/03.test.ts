import { describe, expect, it } from "bun:test";
import { is_symbol, parse, partOne, partTwo } from "./03";

const { default: example } = await import(`./example.txt`);

describe("Day 3", () => {
  it("is_symbol", () => {
    expect(is_symbol(".")).toBe(false);
    expect(is_symbol("0")).toBe(false);
    expect(is_symbol("#")).toBe(true);
  });

  it("Part One", () => {
    const res = partOne(parse(example));
    expect(res).toEqual(4361);
  });

  it("Part Two", () => {
    const res = partTwo(parse(example));
    expect(res).toEqual(467835);
  });
});
