import { describe, expect, it } from "bun:test";
import { parseInput, pushButtonB, solveA } from "./10";
import example from "./example.txt";

describe("tests", () => {
  describe("pushButtonB", () => {
    it("test", () => {
      expect(
        pushButtonB({ joltages: [1, 2, 3, 4, 5], button: [0, 2, 4] })
      ).toEqual([0, 2, 2, 4, 4]);
    });
  });

  // describe("solveB", () => {
  //   it("test", () => {
  //     expect(solveB(parseInput(example))).not.toBe(null);
  //   });
  // });
});
