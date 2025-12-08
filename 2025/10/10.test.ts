import { describe, expect, it } from "bun:test";
import { parseInput, solveB } from "./10";
import example from "./example.txt";

describe("tests", () => {
  describe("solveA", () => {
    it("test", () => {
      expect(solveB(parseInput(example))).not.toBe(null);
    });
  });

  describe("solveB", () => {
    it("test", () => {
      expect(solveB(parseInput(example))).not.toBe(null);
    });
  });
});
