import { assert, describe, expect, it } from "vitest";
import {
  applyDecryptionKey,
  findGroveCoordinates,
  parseInput20,
  shift,
  solve20a,
  solve20b,
} from "./day20";

describe("day20", () => {
  it("input", () => {
    const sampleData = parseInput20("20/sample.txt");
    assert.deepEqual(sampleData, inputFixture);
  });
  it("shift", () => {
    const sampleData = parseInput20("20/sample.txt");
    const shifted = shift(sampleData);
    assert.deepEqual(
      shifted.map((num) => num.num),
      [1, 2, -3, 4, 0, 3, -2]
    );
  });
  it("findGroveCoordinates", () => {
    assert.equal(findGroveCoordinates([1, 2, -3, 4, 0, 3, -2]), 3);
  });
  it("decrypy", () => {
    const sampleData = parseInput20("20/sample.txt");
    assert.deepEqual(
      applyDecryptionKey(sampleData).map((num) => num.num),
      [
        811589153, 1623178306, -2434767459, 2434767459, -1623178306, 0,
        3246356612,
      ]
    );
  });
  it("solve20a", () => {
    const sampleData = [0];
    assert.equal(solve20a("20/sample.txt"), 3);
  });
  it("solve20b", () => {
    const sampleData = [0];
    assert.equal(solve20b("20/sample.txt"), 1623178306);
  });
});

const inputFixture = [
  { num: 1, idx: 0 },
  { num: 2, idx: 1 },
  { num: -3, idx: 2 },
  { num: 3, idx: 3 },
  { num: -2, idx: 4 },
  { num: 0, idx: 5 },
  { num: 4, idx: 6 },
];
