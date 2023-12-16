import { describe, expect, it } from "bun:test";
import { getNextMovements, nextTile, parse, partOne, partTwo } from "./16";

const { default: example } = await import("./example.txt");

describe("Day 16", () => {
  describe("nextTile", () => {
    it("cases", () => {
      expect(nextTile({ y: 1, x: 1, direction: "up" })).toEqual({
        y: 0,
        x: 1,
        direction: "up"
      });
      expect(nextTile({ y: 1, x: 1, direction: "down" })).toEqual({
        y: 2,
        x: 1,
        direction: "down"
      });
      expect(nextTile({ y: 1, x: 1, direction: "left" })).toEqual({
        y: 1,
        x: 0,
        direction: "left"
      });
      expect(nextTile({ y: 1, x: 1, direction: "right" })).toEqual({
        y: 1,
        x: 2,
        direction: "right"
      });
    });
  });

  describe("getNextMovements", () => {
    describe(".", () => {
      it("up", () => {
        expect(getNextMovements({ y: 1, x: 1, direction: "up" }, ".")).toEqual([
          { y: 0, x: 1, direction: "up" }
        ]);
      });

      it("down", () => {
        expect(
          getNextMovements({ y: 1, x: 1, direction: "down" }, ".")
        ).toEqual([{ y: 2, x: 1, direction: "down" }]);
      });

      it("left", () => {
        expect(
          getNextMovements({ y: 1, x: 1, direction: "left" }, ".")
        ).toEqual([{ y: 1, x: 0, direction: "left" }]);
      });

      it("right", () => {
        expect(
          getNextMovements({ y: 1, x: 1, direction: "right" }, ".")
        ).toEqual([{ y: 1, x: 2, direction: "right" }]);
      });
    });

    describe("/", () => {});

    describe("\\", () => {});

    describe("-", () => {});

    describe("|", () => {});
  });

  it("Part One", () => {
    expect(partOne(parse(example))).toBe(46);
  });

  it("Part Two", () => {
    expect(partTwo(parse(example))).toBe(51);
  });
});
