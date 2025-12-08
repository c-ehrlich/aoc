import { describe, expect, it } from "bun:test";
import { parseInput, solveA, solveB } from "./08";
import example from "./example.txt";

describe("tests", () => {
  describe("parseInput", () => {
    expect(parseInput(example)[0]).toEqual({
      connectedTo: new Set(),
      pos: { x: 162, y: 817, z: 812 }
    });
  });

  describe("solveA", () => {
    it("test", () => {
      expect(solveA(parseInput(example), "example")).toBe(40);
    });
  });

  describe("solveB", () => {
    it("test", () => {
      expect(solveB(parseInput(example))).toBe(25272);
    });
  });
});
