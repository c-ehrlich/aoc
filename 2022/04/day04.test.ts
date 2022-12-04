import { assert, describe, it } from "vitest";
import { fileLinesToCleaningSections, solve04a, solve04b } from "./day04";

describe("day04", () => {
  it("input", () => {
    const sampleData = fileLinesToCleaningSections("04/sample.txt");
    assert.deepEqual(sampleData[0][0], { start: 2, end: 4 });
  });
  it("solve04a", () => {
    const sampleData = fileLinesToCleaningSections("04/sample.txt");
    assert.equal(solve04a(sampleData), 2);
  });
  it("solve04b", () => {
    const sampleData = fileLinesToCleaningSections("04/sample.txt");
    assert.equal(solve04b(sampleData), 4);
  });
});
