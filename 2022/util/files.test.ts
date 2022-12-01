import { assert, describe, it } from "vitest";
import { arrayOfLinesDoubleSplit } from "./files";

// The two tests marked with concurrent will be run in parallel
describe("files", () => {
  it("arrayOfLinesDoubleSplit", async () => {
    const sampleData = arrayOfLinesDoubleSplit("util/fixtures/double.txt");
    assert.deepEqual(sampleData, [[1], [1, 2], [1, 2, 3]]);
  });
});
