import { assert, describe, it } from "vitest";
import { arrayOfLinesToNumDoubleSplit, solve01a, solve01b } from "./day01";

describe("day01", () => {
  it("arrayOfLinesDoubleSplit", async () => {
    const fixtureData = arrayOfLinesToNumDoubleSplit(
      "01/doubleSplit.fixture.txt"
    );
    assert.deepEqual(fixtureData, [[1], [1, 2], [1, 2, 3]]);
  });
  it("solve01a", async () => {
    const sampleData = arrayOfLinesToNumDoubleSplit("01/sample.txt");
    assert.equal(solve01a(sampleData), 24000);
  });
  it("solve01b", async () => {
    const sampleData = arrayOfLinesToNumDoubleSplit("01/sample.txt");
    assert.equal(solve01b(sampleData), 45000);
  });
});
