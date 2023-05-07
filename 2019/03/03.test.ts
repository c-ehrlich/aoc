import { describe, expect, it } from "vitest";
import { solve03a } from "./03";
describe("03", () => {
  it("03a", () => {
    expect(solve03a("03/sample.txt")).toBe(135);
  });
});
