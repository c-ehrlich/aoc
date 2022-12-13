import { assert, describe, it } from "vitest";
import { parseDistressSignal, solve13a, solve13b } from "./day13";

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

describe("day13", () => {
  it("input", () => {
    const sampleData = parseDistressSignal("13/sample.txt");
    assert.deepEqual(sampleData, packetFixture);
  });
  it("solve13a", () => {
    assert.equal(solve13a("13/sample.txt"), 13);
  });
  it("solve13b", () => {
    assert.equal(solve13b("13/sample.txt"), -99);
  });
});
