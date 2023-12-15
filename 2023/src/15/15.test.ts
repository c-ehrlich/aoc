import { describe, expect, it } from "bun:test";
import { hash, parse, partOne, partTwo } from "./15";

const { default: example } = await import("./example.txt");

describe("Day 15", () => {
  it("hash", () => {
    expect(hash("HASH")).toBe(52);
    expect(hash("rn=1")).toBe(30);
    expect(hash("cm-")).toBe(253);
  });
  it("Part One", () => {
    expect(partOne(parse(example))).toBe(1320);
  });

  it("Part Two", () => {
    expect(partTwo(parse(example))).toBe(145);
  });
});
