import { assert, describe, it } from "vitest";
import { parseCrateFile, solve05a, solve05b } from "./day05";

describe("day05", () => {
  it("input", () => {
    const sampleData = parseCrateFile("05/sample.txt");
    assert.deepEqual(sampleData.crates, [["Z", "N"], ["M", "C", "D"], ["P"]]);
    assert.deepEqual(sampleData.orders[0], { move: 1, from: 2, to: 1 });
  });
  it("solve05a", () => {
    const sampleData = parseCrateFile("05/sample.txt");
    assert.equal(solve05a(sampleData), "CMZ");
  });
  it("solve05b", () => {
    const sampleData = parseCrateFile("05/sample.txt");
    assert.equal(solve05b(sampleData), "MCD");
  });
});
