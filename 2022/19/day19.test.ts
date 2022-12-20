import { assert, describe, it } from "vitest";
import { parseBlueprints, solve19a } from "./day19";

describe("day19", () => {
  it("input", () => {
    const factories = parseBlueprints("19/sample.txt");
    assert.deepEqual(factories, blueprintFixture);
  });
  it("solve19a", () => {
    assert.equal(solve19a("19/sample.txt"), 33);
  });
});

const blueprintFixture = [
  {
    blueprint: 1,
    costs: {
      oreRobot: { ore: 4 },
      clayRobot: { ore: 2 },
      obsidianRobot: { ore: 3, clay: 14 },
      geodeRobot: { ore: 2, obsidian: 7 },
    },
  },
  {
    blueprint: 2,
    costs: {
      oreRobot: { ore: 2 },
      clayRobot: { ore: 3 },
      obsidianRobot: { ore: 3, clay: 8 },
      geodeRobot: { ore: 3, obsidian: 12 },
    },
  },
];

const combinationsFixture = [
  { oreRobot: 0, clayRobot: 0, obsidianRobot: 0, geodeRobot: 0 },
  { oreRobot: 1, clayRobot: 0, obsidianRobot: 0, geodeRobot: 0 },
  { oreRobot: 2, clayRobot: 0, obsidianRobot: 0, geodeRobot: 0 },
  { oreRobot: 2, clayRobot: 1, obsidianRobot: 0, geodeRobot: 0 },
  { oreRobot: 2, clayRobot: 0, obsidianRobot: 0, geodeRobot: 1 },
  { oreRobot: 1, clayRobot: 1, obsidianRobot: 0, geodeRobot: 0 },
  { oreRobot: 1, clayRobot: 2, obsidianRobot: 0, geodeRobot: 0 },
  { oreRobot: 1, clayRobot: 3, obsidianRobot: 0, geodeRobot: 0 },
  { oreRobot: 1, clayRobot: 2, obsidianRobot: 0, geodeRobot: 1 },
  { oreRobot: 1, clayRobot: 1, obsidianRobot: 1, geodeRobot: 0 },
  { oreRobot: 1, clayRobot: 1, obsidianRobot: 0, geodeRobot: 1 },
  { oreRobot: 1, clayRobot: 1, obsidianRobot: 0, geodeRobot: 2 },
  { oreRobot: 1, clayRobot: 0, obsidianRobot: 1, geodeRobot: 0 },
  { oreRobot: 1, clayRobot: 0, obsidianRobot: 2, geodeRobot: 0 },
  { oreRobot: 1, clayRobot: 0, obsidianRobot: 1, geodeRobot: 1 },
  { oreRobot: 1, clayRobot: 0, obsidianRobot: 0, geodeRobot: 1 },
  { oreRobot: 1, clayRobot: 0, obsidianRobot: 0, geodeRobot: 2 },
  { oreRobot: 1, clayRobot: 0, obsidianRobot: 0, geodeRobot: 3 },
  { oreRobot: 0, clayRobot: 1, obsidianRobot: 0, geodeRobot: 0 },
  { oreRobot: 0, clayRobot: 2, obsidianRobot: 0, geodeRobot: 0 },
  { oreRobot: 0, clayRobot: 3, obsidianRobot: 0, geodeRobot: 0 },
  { oreRobot: 0, clayRobot: 4, obsidianRobot: 0, geodeRobot: 0 },
  { oreRobot: 0, clayRobot: 5, obsidianRobot: 0, geodeRobot: 0 },
  { oreRobot: 0, clayRobot: 4, obsidianRobot: 0, geodeRobot: 1 },
  { oreRobot: 0, clayRobot: 3, obsidianRobot: 1, geodeRobot: 0 },
  { oreRobot: 0, clayRobot: 3, obsidianRobot: 0, geodeRobot: 1 },
  { oreRobot: 0, clayRobot: 3, obsidianRobot: 0, geodeRobot: 2 },
  { oreRobot: 0, clayRobot: 2, obsidianRobot: 1, geodeRobot: 0 },
  { oreRobot: 0, clayRobot: 2, obsidianRobot: 2, geodeRobot: 0 },
  { oreRobot: 0, clayRobot: 2, obsidianRobot: 1, geodeRobot: 1 },
  { oreRobot: 0, clayRobot: 2, obsidianRobot: 0, geodeRobot: 1 },
  { oreRobot: 0, clayRobot: 2, obsidianRobot: 0, geodeRobot: 2 },
  { oreRobot: 0, clayRobot: 2, obsidianRobot: 0, geodeRobot: 3 },
  { oreRobot: 0, clayRobot: 1, obsidianRobot: 1, geodeRobot: 0 },
  { oreRobot: 0, clayRobot: 1, obsidianRobot: 2, geodeRobot: 0 },
  { oreRobot: 0, clayRobot: 1, obsidianRobot: 2, geodeRobot: 1 },
  { oreRobot: 0, clayRobot: 1, obsidianRobot: 1, geodeRobot: 1 },
  { oreRobot: 0, clayRobot: 1, obsidianRobot: 1, geodeRobot: 2 },
  { oreRobot: 0, clayRobot: 1, obsidianRobot: 0, geodeRobot: 1 },
  { oreRobot: 0, clayRobot: 1, obsidianRobot: 0, geodeRobot: 2 },
  { oreRobot: 0, clayRobot: 1, obsidianRobot: 0, geodeRobot: 3 },
  { oreRobot: 0, clayRobot: 0, obsidianRobot: 1, geodeRobot: 0 },
  { oreRobot: 0, clayRobot: 0, obsidianRobot: 2, geodeRobot: 0 },
  { oreRobot: 0, clayRobot: 0, obsidianRobot: 2, geodeRobot: 1 },
  { oreRobot: 0, clayRobot: 0, obsidianRobot: 2, geodeRobot: 2 },
  { oreRobot: 0, clayRobot: 0, obsidianRobot: 1, geodeRobot: 1 },
  { oreRobot: 0, clayRobot: 0, obsidianRobot: 1, geodeRobot: 2 },
  { oreRobot: 0, clayRobot: 0, obsidianRobot: 1, geodeRobot: 3 },
  { oreRobot: 0, clayRobot: 0, obsidianRobot: 0, geodeRobot: 1 },
  { oreRobot: 0, clayRobot: 0, obsidianRobot: 0, geodeRobot: 2 },
  { oreRobot: 0, clayRobot: 0, obsidianRobot: 0, geodeRobot: 3 },
];
