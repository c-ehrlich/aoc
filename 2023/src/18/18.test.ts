import { describe, expect, it } from "bun:test";
import { parse, parseTwo, partOne } from "./18";

const { default: example } = await import("./example.txt");

describe("Day 18", () => {
  describe("Part One", () => {
    it("example input", () => {
      // expect(partOne(parse(example))).toBe(62);
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
      expect(partOne(parse(input))).toBe(39);
    });
  });

  it("Part Two", () => {
    // expect(partOne(parseTwo(example))).toBe(952408144115);
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
