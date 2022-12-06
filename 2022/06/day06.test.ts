import { assert, describe, it } from "vitest";
import { fileToCharArray, solve06a, solve06b } from "./day06";

describe("day06", () => {
  it("fileToCharArray", () => {
    assert.deepEqual(fileToCharArray("06/sample.txt"), fileToCharArrayFixture);
  });
  it("solve06a", () => {
    const sampleData = fileToCharArray("06/sample.txt");
    assert.equal(solve06a(sampleData), 10);
  });
  it("solve06b", () => {
    const sampleData = fileToCharArray("06/sample.txt");
    assert.equal(solve06b(sampleData), 29);
  });
});

const fileToCharArrayFixture = [
  "n",
  "z",
  "n",
  "r",
  "n",
  "f",
  "r",
  "f",
  "n",
  "t",
  "j",
  "f",
  "m",
  "v",
  "f",
  "w",
  "m",
  "z",
  "d",
  "f",
  "j",
  "l",
  "v",
  "t",
  "q",
  "n",
  "b",
  "h",
  "c",
  "p",
  "r",
  "s",
  "g",
];
