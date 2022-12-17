import { assert, describe, it } from "vitest";
import { solve16a, solve16b } from "./day16code";

describe("day16", () => {
  it("solve16a", () => {
    const flow = solve16a("16/sample.txt");
    assert.equal(flow, 1651);
  });
  it("solve16b", () => {
    const flow = solve16b("16/sample.txt");
    assert.equal(flow, 1707);
  });
});
