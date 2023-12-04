import { describe, expect, it } from "bun:test";
import { parse, partOne, partTwo } from "./04";

const { default: example } = await import(`./example.txt`);

describe("Day 4", () => {
  it("Part One", () => {
    const res = partOne(parse(example));
    expect(res).toEqual(13);
  });

  it("Part Two", () => {
    const res = partTwo(parse(example));
    expect(res).toEqual(30);
  });
});
