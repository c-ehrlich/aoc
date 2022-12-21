import { assert, describe, it } from "vitest";
import { solve21a, solve21b } from "./day21";

describe("day21", () => {
  it("solve21a", () => {
    const sampleData = [0];
    assert.equal(solve21a("21/sample.txt"), 152);
  });
  it("solve21b", () => {
    const sampleData = [0];
    assert.equal(solve21b("21/sample.txt"), 301);
  });
});
