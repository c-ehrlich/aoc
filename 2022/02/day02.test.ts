import { assert, describe, it } from "vitest";
import {
  arrayOfLinesToRpsInput,
  solve02a,
  solve02b,
  type RpsFormattedInput,
} from "./day02";

describe("day02", () => {
  it("arrayOfLinesToRpsInput", () => {
    const fixtureData = arrayOfLinesToRpsInput("02/sample.txt");
    assert.deepEqual(fixtureData, [
      [0, 1],
      [1, 0],
      [2, 2],
    ]);
  });
  it("day02a", () => {
    const sampleData = arrayOfLinesToRpsInput(
      "02/sample.txt"
    ) as RpsFormattedInput;
    assert.equal(solve02a(sampleData), 15);
  });
  it("day02b", () => {
    const sampleData = arrayOfLinesToRpsInput(
      "02/sample.txt"
    ) as RpsFormattedInput;
    assert.equal(solve02b(sampleData), 12);
  });
});
