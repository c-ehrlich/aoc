import { assert, describe, it } from "vitest";
import { arrayOfLinesDoubleSplit } from "../util/files";
import { solve01a, solve01b } from "./day01";

// The two tests marked with concurrent will be run in parallel
describe("suite", () => {
  it("day01a", async () => {
    const sampleData = arrayOfLinesDoubleSplit("01/sample.txt");
    console.log("sampleData:", sampleData[0][0]);
    assert.equal(solve01a(sampleData), 24000);
  });
  it("day01b", async () => {
    const sampleData = arrayOfLinesDoubleSplit("01/sample.txt");
    assert.equal(solve01b(sampleData), 45000);
  });
});
