import { describe, expect, it } from "bun:test";
import { parse, partOne, partTwo, walk } from "./17";

const { default: example } = await import("./example.txt");

describe("Day 17", () => {
  describe("walk", () => {
    it("easy path", () => {
      expect(
        walk({
          board: [
            [1, 1, 1],
            [2, 2, 1],
            [2, 2, 1]
          ],
          options: [
            { x: 1, y: 0, dir: "E", cost: 0, prev: [] },
            { x: 0, y: 1, dir: "S", cost: 0, prev: [] }
          ],
          seen: new Map()
        })
      ).toBe(4);
    });

    it("another path", () => {
      expect(
        walk({
          board: [
            [1, 1, 1, 1, 9, 9, 1, 1, 1, 1],
            [9, 9, 9, 1, 9, 9, 1, 9, 9, 1],
            [9, 9, 9, 1, 1, 1, 1, 9, 9, 1]
          ],
          options: [
            { x: 0, y: 1, dir: "S", cost: 0, prev: [] },
            { x: 1, y: 0, dir: "E", cost: 0, prev: [] }
          ],
          seen: new Map()
        })
      ).toBe(15);
    });

    it("small corners", () => {
      expect(
        walk({
          board: [
            [9, 1, 9, 9, 9, 1, 1, 1, 9, 9],
            [9, 1, 1, 9, 1, 1, 9, 1, 1, 9],
            [9, 9, 1, 1, 1, 9, 9, 9, 1, 1]
          ],
          options: [
            { x: 0, y: 1, dir: "S", cost: 0, prev: [] },
            { x: 1, y: 0, dir: "E", cost: 0, prev: [] }
          ],
          seen: new Map()
        })
      ).toBe(15);
    });

    it("cant walk 4", () => {
      expect(
        walk({
          board: [
            [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
            [1, 1, 1, 1, 1, 9, 1, 1, 1, 1],
            [9, 9, 9, 2, 1, 1, 1, 9, 9, 1]
          ],
          options: [
            { x: 0, y: 1, dir: "S", cost: 0, prev: [] },
            { x: 1, y: 0, dir: "E", cost: 0, prev: [] }
          ],
          seen: new Map()
        })
      ).toBe(14);

      it("finds the cheaper path", () => {
        expect(
          walk({
            board: [
              [9, 1, 1, 1, 9, 9, 9, 9, 9, 9],
              [2, 2, 9, 1, 1, 1, 9, 1, 1, 1],
              [9, 9, 9, 9, 9, 1, 1, 1, 9, 1]
            ],
            options: [
              { x: 0, y: 1, dir: "S", cost: 0, prev: [] },
              { x: 1, y: 0, dir: "E", cost: 0, prev: [] }
            ],
            seen: new Map()
          })
        ).toBe(13);
      });
    });
  });
  it("Part One", () => {
    expect(partOne(parse(example))).toBe(102);
  });

  it("Part Two", () => {
    expect(true).toBe(true);
  });
});
