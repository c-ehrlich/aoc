import { assert, describe, it } from "vitest";
import { inputFileToTreeGrid, solve08a, solve08b } from "./day08";

describe("day08", () => {
  it("input", () => {
    const sampleForest = inputFileToTreeGrid("08/sample.txt");
    assert.deepEqual(sampleForest[0], [3, 0, 3, 7, 3]);
  });
  it("solve08a", () => {
    const sampleForest = inputFileToTreeGrid("08/sample.txt");
    assert.equal(solve08a(sampleForest), 21);
  });
  it("solve08b", () => {
    const sampleForest = inputFileToTreeGrid("08/sample.txt");
    assert.equal(solve08b(sampleForest), 8);
  });
});
