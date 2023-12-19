import { describe, expect, it } from "bun:test";
import {
  VerticalPipeInfo,
  calculateRowScore,
  parse,
  parseTwo,
  partOne
} from "./18";

const { default: example } = await import("./example.txt");

describe("Day 18", () => {
  describe("calculateRowScore", () => {
    it("|  |  |  |  |  |", () => {
      const pipes: VerticalPipeInfo[] = [
        { pipe: "|", pos: 1 },
        { pipe: "|", pos: 7 },
        { pipe: "|", pos: 9 },
        { pipe: "|", pos: 3 },
        { pipe: "|", pos: 11 },
        { pipe: "|", pos: 5 }
      ];
      expect(calculateRowScore(pipes)).toBe(9);
    });

    it("F  7", () => {
      const pipes: VerticalPipeInfo[] = [
        { pipe: "F", pos: 0 },
        { pipe: "7", pos: 461937 }
      ];
      expect(calculateRowScore(pipes)).toBe(461938);
    });

    it("|  F  7  |", () => {
      const pipes: VerticalPipeInfo[] = [
        { pipe: "|", pos: 0 },
        { pipe: "F", pos: 497056 },
        { pipe: "7", pos: 609066 },
        { pipe: "|", pos: 818608 }
      ];
      expect(calculateRowScore(pipes)).toBe(818609);
    });

    it("|  |  |  L  7", () => {
      const pipes: VerticalPipeInfo[] = [
        { pipe: "7", pos: 1186328 },
        { pipe: "|", pos: 497056 },
        { pipe: "|", pos: 5411 },
        { pipe: "|", pos: 609066 },
        { pipe: "L", pos: 818608 }
      ];
      expect(calculateRowScore(pipes)).toBe(1068909);
    });

    it("L  J  L  J", () => {
      const pipes: VerticalPipeInfo[] = [
        { pipe: "J", pos: 1186328 },
        { pipe: "J", pos: 497056 },
        { pipe: "L", pos: 5411 },
        { pipe: "L", pos: 609066 }
      ];
      expect(calculateRowScore(pipes)).toBe(1068909);
    });

    it("|  L  7  F  7  |  |", () => {
      const pipes: VerticalPipeInfo[] = [
        { pipe: "|", pos: 2845236 },
        { pipe: "L", pos: 3836449 },
        { pipe: "7", pos: 4026791 },
        { pipe: "F", pos: 4441980 },
        { pipe: "7", pos: 4679923 },
        { pipe: "|", pos: 7594565 },
        { pipe: "|", pos: 7956200 }
      ];
      expect(calculateRowScore(pipes)).toBe(1781136);
    });
  });

  describe("Part One", () => {
    it("example input", () => {
      expect(partOne(parse(example))).toBe(62);
    });

    /**
     * ####
     * ####
     * ####
     * ####
     */
    it("rectangle", () => {
      const input = "R 3\nD 3\nL 3\nU 3";
      expect(partOne(parse(input))).toBe(16);
    });

    /**
     * ###
     * ###
     * #####
     * #####
     * #####
     */
    it("rectangle with a dent", () => {
      const input = "R 2\nD 2\nR 2\nD 2\nL 4\nU 4";
      expect(partOne(parse(input))).toBe(21);
    });

    /**
     * ### ###
     * ### ###
     * #######
     * #######
     * #######
     */
    it("U shape", () => {
      const input = "R 2\nD 2\nR 2\nU 2\nR 2\nD 4\nL 6\nU 4";
      // expect(partOne(parse(input))).toBe(39);
    });

    /**
     * #####
     * #####
     * #######
     *   #####
     *   #####
     */
    it("S shape", () => {
      const input = "R 4\nD 2\nR 2\nD 2\nL 4\nU 2\nL 2\nU 2";
      expect(partOne(parse(input))).toBe(27);
    });
  });

  it("Part Two", () => {
    expect(partOne(parseTwo(example))).toBe(952408144115);
  });
});

// .###.###.
// .#.#.#.#.
// .#.S##.#.
// .#.....#.
// .#######.

/**
 * Map <y, [x]>
 * to find area: for each y,
 * - find min and max x
 * - count those
 * - for each value inbetween that's not a #:
 *   - if it has an odd number of # to the left, it's inside
 */

/**
 * Create L/J map
 * Also create 7/F map
 * create ranges of
 */
