import { assert, describe, it } from "vitest";
import { BabyComputer, solve10a, solve10b } from "./day10";

describe("day10", () => {
  it("input", () => {
    const babyComputer = new BabyComputer({ file: "10/mini-sample.txt" });
    assert.deepEqual(babyComputer.getInstructions(), [
      { type: "noop" },
      { type: "addx", value: 3 },
      { type: "addx", value: -5 },
    ]);
  });
  it("solve10a", () => {
    assert.equal(solve10a("10/sample.txt"), 13140);
  });
  it("solve10b", () => {
    const expectedOutput = `
##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....`;
    assert.equal(solve10b("10/sample.txt"), expectedOutput);
  });
});
