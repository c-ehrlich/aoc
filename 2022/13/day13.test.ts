import { assert, describe, it } from "vitest";
import {
  parseDistressSignal,
  parseDistressSignalToGroups,
  solve13a,
  solve13b,
} from "./day13";

const packetFixture = [
  { left: [1, 1, 3, 1, 1], right: [1, 1, 5, 1, 1] },
  { left: [[1], [2, 3, 4]], right: [[1], 4] },
  { left: [9], right: [[8, 7, 6]] },
  { left: [[4, 4], 4, 4], right: [[4, 4], 4, 4, 4] },
  { left: [7, 7, 7, 7], right: [7, 7, 7] },
  { left: [], right: [3] },
  { left: [[[]]], right: [[]] },
  {
    left: [1, [2, [3, [4, [5, 6, 7]]]], 8, 9],
    right: [1, [2, [3, [4, [5, 6, 0]]]], 8, 9],
  },
];

const packetFixture2 = [
  [1, 1, 3, 1, 1],
  [1, 1, 5, 1, 1],
  [[1], [2, 3, 4]],
  [[1], 4],
  [9],
  [[8, 7, 6]],
  [[4, 4], 4, 4],
  [[4, 4], 4, 4, 4],
  [7, 7, 7, 7],
  [7, 7, 7],
  [],
  [3],
  [[[]]],
  [[]],
  [1, [2, [3, [4, [5, 6, 7]]]], 8, 9],
  [1, [2, [3, [4, [5, 6, 0]]]], 8, 9],
  [[2]],
  [[6]],
];

describe("day13", () => {
  it("input1", () => {
    const sampleData = parseDistressSignalToGroups("13/sample.txt");
    assert.deepEqual(sampleData, packetFixture);
  });
  it("input2", () => {
    const sampleData = parseDistressSignal("13/sample.txt");
    assert.deepEqual(sampleData, packetFixture2);
  });
  it("solve13a", () => {
    assert.equal(solve13a("13/sample.txt"), 13);
  });
  it("solve13b", () => {
    assert.equal(solve13b("13/sample.txt"), 140);
  });
});
