import { assert, describe, it } from "vitest";
import { SandFalling, solve14a, solve14b } from "./day14";

describe("day14", () => {
  it("inputA", () => {
    const sandFalling = new SandFalling("14/sample.txt");
    const cave = sandFalling
      .getSmallerCave()
      .map((row) => row.join(""))
      .join("\n");
    assert.deepEqual(cave, caveFixture);
  });
  it("inputB", () => {
    const sandFalling = new SandFalling("14/sample.txt");
    const biggerCave = sandFalling
      .getBiggerCave()
      .map((row) => row.join(""))
      .join("\n");
    assert.deepEqual(biggerCave, biggerCaveFixture);
  });
  it("solve14a", () => {
    assert.equal(solve14a("14/sample.txt"), 24);
  });
  it("solve14b", () => {
    assert.equal(solve14b("14/sample.txt"), 93);
  });
});

const caveFixture = `......+...
..........
..........
..........
....#...##
....#...#.
..###...#.
........#.
........#.
#########.`;

const biggerCaveFixture = `................+.............
..............................
..............................
..............................
..............#...##..........
..............#...#...........
............###...#...........
..................#...........
..................#...........
..........#########...........
..............................
##############################`;
