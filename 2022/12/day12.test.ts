import { assert, describe, it } from "vitest";
import { MountainTraveler, solve12a, solve12b } from "./day12";

describe("day12", () => {
  it("input", () => {
    const traveler = new MountainTraveler({ file: "12/sample.txt" });
    assert.equal(traveler.isStart(0, 0), true);
    assert.equal(traveler.isEnd(2, 5), true);
  });
  it("solve12a", () => {
    assert.equal(solve12a("12/sample.txt"), 31);
  });
  it("solve12b", () => {
    assert.equal(solve12b("12/sample.txt"), 29);
  });
});
