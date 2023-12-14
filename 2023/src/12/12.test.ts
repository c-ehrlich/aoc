import { describe, expect, it } from "bun:test";
import {
  countWays,
  findOrderedPlacements,
  isLegalPosition,
  isValidPlacement,
  parse,
  partOne,
  partTwo
} from "./12";

const { default: example } = await import("./example.txt");

describe("Day 12", () => {
  describe("isLegalPosition", () => {
    it("Valid", () => {
      expect(isLegalPosition("???.###", [1, 1, 3], [0, 2, 4])).toBe(true);
    });

    it("On a .", () => {
      expect(isLegalPosition("???.###", [3], [3])).toBe(false);
    });

    it("Missing a #", () => {
      expect(isLegalPosition("???.###", [1, 1, 1, 1], [0, 2, 4, 6])).toBe(
        false
      );
    });
  });

  describe("isValidPlacement", () => {
    //   it("1", () => {
    //     expect(isValidPlacement(0, 1, "???.###")).toBe(true);
    //     expect(isValidPlacement(6, 1, "???.###")).toBe(false);
    //     expect(isValidPlacement(3, 1, "???.###")).toBe(false);
    //     expect(isValidPlacement(7, 1, "???.###")).toBe(false);
    //   });

    //   it("3", () => {
    //     expect(isValidPlacement(0, 3, "???.###")).toBe(true);
    //     expect(isValidPlacement(4, 3, "???.###")).toBe(true);
    //     expect(isValidPlacement(2, 3, "???.###")).toBe(false);
    //     expect(isValidPlacement(5, 3, "???.###")).toBe(false);
    //   });
    // });

    // describe("countWays", () => {
    //   it("example row1", () => {
    //     expect(countWays("???.###", [1, 1, 3])).toBe(1);
    //   });

    //   it("example row1 5x", () => {
    //     expect(
    //       countWays(
    //         "???.###????.###????.###????.###????.###",
    //         [1, 1, 3, 1, 1, 3, 1, 1, 3, 1, 1, 3, 1, 1, 3]
    //       )
    //     ).toBe(1);
    //   });

    //   it("example row2", () => {
    //     expect(countWays(".??..??...?##.", [1, 1, 3])).toBe(4);
    //   });

    //   it("example row2 5x", () => {
    //     expect(
    //       countWays(
    //         ".??..??...?##.?.??..??...?##.?.??..??...?##.?.??..??...?##.?.??..??...?##.",
    //         [1, 1, 3, 1, 1, 3, 1, 1, 3, 1, 1, 3, 1, 1, 3]
    //       )
    //     ).toBe(16384);
    //   });

    //   it("example row3", () => {
    //     expect(countWays("?#?#?#?#?#?#?#?", [1, 3, 1, 6])).toBe(1);
    //   });

    //   it("example row3 5x", () => {
    //     expect(
    //       countWays(
    //         "?#?#?#?#?#?#?#???#?#?#?#?#?#?#???#?#?#?#?#?#?#???#?#?#?#?#?#?#???#?#?#?#?#?#?#?",
    //         [1, 3, 1, 6, 1, 3, 1, 6, 1, 3, 1, 6, 1, 3, 1, 6, 1, 3, 1, 6]
    //       )
    //     ).toBe(1);
    //   });

    //   it("example row4", () => {
    //     expect(countWays("????.#...#...", [4, 1, 1])).toBe(1);
    //   });

    //   it("example row4 5x", () => {
    //     expect(
    //       countWays(
    //         "????.#...#...?????.#...#...?????.#...#...?????.#...#...?????.#...#...",
    //         [4, 1, 1, 4, 1, 1, 4, 1, 1, 4, 1, 1, 4, 1, 1]
    //       )
    //     ).toBe(16);
    //   });

    //   it("example row5", () => {
    //     expect(countWays("????.######..#####.", [1, 6, 5])).toBe(4);
    //   });

    //   it("example row5 5x", () => {
    //     expect(
    //       countWays(
    //         "????.######..#####.?????.######..#####.?????.######..#####.?????.######..#####.?????.######..#####.",
    //         [1, 6, 5, 1, 6, 5, 1, 6, 5, 1, 6, 5, 1, 6, 5]
    //       )
    //     ).toBe(2500);
    //   });

    //   it("example row6", () => {
    //     expect(countWays("?###????????", [3, 2, 1])).toBe(10);
    //   });

    it("example row6 + ?", () => {
      expect(countWays("?###?????????", [3, 2, 1])).toBe(15);
    });

    // it("example row6 5x", () => {
    //   expect(
    //     countWays(
    //       "?###??????????###??????????###??????????###??????????###????????",
    //       [3, 2, 1, 3, 2, 1, 3, 2, 1, 3, 2, 1, 3, 2, 1]
    //     )
    //   ).toBe(506250);
    // });
  });

  // it("Part One", () => {
  //   expect(partOne(parse(example))).toBe(21);
  // });

  // it("Part Two", () => {
  //   expect(partTwo(parse(example))).toBe(525152);
  // });
});
