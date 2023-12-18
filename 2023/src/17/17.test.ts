import { describe, expect, it } from "bun:test";
import { parse, partOne, partTwo, walkPart1 } from "./17";

const { default: example } = await import("./example.txt");

describe("Day 17", () => {
  describe("walk", () => {
    it("easy path", () => {
      expect(
        walkPart1({
          board: [
            [1, 1, 1],
            [2, 2, 1],
            [2, 2, 1]
          ],
          options: new Set([
            JSON.stringify({ x: 1, y: 0, dir: "E", cost: 0, repeat: 1 }),
            JSON.stringify({ x: 0, y: 1, dir: "S", cost: 0, repeat: 1 })
          ]),
          seen: new Map()
        })
      ).toBe(4);
    });

    it("another path", () => {
      expect(
        walkPart1({
          board: [
            [1, 1, 1, 1, 9, 9, 1, 1, 1, 1],
            [9, 9, 9, 1, 9, 9, 1, 9, 9, 1],
            [9, 9, 9, 1, 1, 1, 1, 9, 9, 1]
          ],
          options: new Set([
            JSON.stringify({ x: 0, y: 1, dir: "S", cost: 0, repeat: 1 }),
            JSON.stringify({ x: 1, y: 0, dir: "E", cost: 0, repeat: 1 })
          ]),
          seen: new Map()
        })
      ).toBe(15);
    });

    it("small corners", () => {
      expect(
        walkPart1({
          board: [
            [9, 1, 9, 9, 9, 1, 1, 1, 9, 9],
            [9, 1, 1, 9, 1, 1, 9, 1, 1, 9],
            [9, 9, 1, 1, 1, 9, 9, 9, 1, 1]
          ],
          options: new Set([
            JSON.stringify({ x: 0, y: 1, dir: "S", cost: 0, repeat: 1 }),
            JSON.stringify({ x: 1, y: 0, dir: "E", cost: 0, repeat: 1 })
          ]),
          seen: new Map()
        })
      ).toBe(15);
    });

    it("cant walk 4", () => {
      expect(
        walkPart1({
          board: [
            [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
            [1, 1, 1, 1, 1, 9, 1, 1, 1, 1],
            [9, 9, 9, 2, 1, 1, 1, 9, 9, 1]
          ],
          options: new Set([
            JSON.stringify({ x: 0, y: 1, dir: "S", cost: 0, repeat: 1 }),
            JSON.stringify({ x: 1, y: 0, dir: "E", cost: 0, repeat: 1 })
          ]),
          seen: new Map()
        })
      ).toBe(14);

      it("finds the cheaper path", () => {
        expect(
          walkPart1({
            board: [
              [9, 1, 1, 1, 9, 9, 9, 9, 9, 9],
              [2, 2, 9, 1, 1, 1, 9, 1, 1, 1],
              [9, 9, 9, 9, 9, 1, 1, 1, 9, 1]
            ],
            options: new Set([
              JSON.stringify({ x: 0, y: 1, dir: "S", cost: 0, repeat: 1 }),
              JSON.stringify({ x: 1, y: 0, dir: "E", cost: 0, repeat: 1 })
            ]),
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
    expect(partTwo(parse(example))).toBe(94);
  });
});
