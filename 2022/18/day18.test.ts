import { assert, describe, it } from "vitest";
import { solve18a, solve18b, testCubeArea } from "./day18";

describe("day18", () => {
  it("solve18a", () => {
    assert.equal(solve18a("18/sample.txt"), 64);
  });
  it("solve18b", () => {
    assert.equal(solve18b("18/sample.txt"), 58);
  });
  it("cube area", () => {
    assert.equal(testCubeArea("18/sample.txt"), 64);
  });
});
