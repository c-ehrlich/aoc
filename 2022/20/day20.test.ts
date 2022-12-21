import { assert, describe, expect, it } from "vitest";
import {
  applyDecryptionKey,
  findGroveCoordinates,
  parseInput20,
  shift,
  shiftCalc,
  solve20a,
  solve20b,
} from "./day20";

describe("day20", () => {
  it("input", () => {
    const sampleData = parseInput20("20/sample.txt");
    assert.deepEqual(sampleData, inputFixture);
  });
  it("moves a number forward without a cycle", () => {
    assert.equal(shiftCalc(1, 0, 7), 1);
  });
  it("moves a number backward without a cycle", () => {
    assert.equal(shiftCalc(-2, 5, 7), 3);
  });
  it("moves a number forward with 1 rotation", () => {
    assert.equal(shiftCalc(5, 5, 7), 4);
  });
  it("moves a number backwards with 1 rotation", () => {
    assert.equal(shiftCalc(-3, 1, 7), 4);
  });
  it("moves a number forward with 3 rotations", () => {
    assert.equal(shiftCalc(15, 4, 7), 1);
  });
  it("moves a number backward with 3 rotations", () => {
    assert.equal(shiftCalc(-15, 1, 7), 4);
  });
  it("shifts around a number that lands at 0", () => {
    assert.equal(shiftCalc(-2, 2, 7), 6);
  });
  it("doesn't move a 0", () => {
    assert.equal(shiftCalc(0, 4, 7), 4);
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
    assert.equal(
      findGroveCoordinates([
        0, -2434767459, 1623178306, 3246356612, -1623178306, 2434767459,
        811589153,
      ]),
      1623178306
    );
  });
  it("decrypt", () => {
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
