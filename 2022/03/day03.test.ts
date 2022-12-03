import { assert, describe, it } from "vitest";
import {
  arrayOfLinesToRucksacks,
  arrayOfLinesToSplitRucksacks,
  solve03a,
  solve03b,
} from "./day03";

describe("day03", () => {
  it("arrayOfLinesToSplitRucksacks", () => {
    const sampleData = arrayOfLinesToSplitRucksacks("03/sample.txt");
    assert.deepEqual(sampleData, [
      ["vJrwpWtwJgWr", "hcsFMMfFFhFp"],
      ["jqHRNqRjqzjGDLGL", "rsFMfFZSrLrFZsSL"],
      ["PmmdzqPrV", "vPwwTWBwg"],
      ["wMqvLMZHhHMvwLH", "jbvcjnnSBnvTQFn"],
      ["ttgJtRGJ", "QctTZtZT"],
      ["CrZsJsPPZsGz", "wwsLwLmpwMDw"],
    ]);
  });
  it("arrayOfLinesToRucksacks", () => {
    const sampleData = arrayOfLinesToRucksacks("03/sample.txt");
    assert.deepEqual(sampleData, [
      "vJrwpWtwJgWrhcsFMMfFFhFp",
      "jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL",
      "PmmdzqPrVvPwwTWBwg",
      "wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn",
      "ttgJtRGJQctTZtZT",
      "CrZsJsPPZsGzwwsLwLmpwMDw",
    ]);
  });
  it("solve03a", () => {
    const sampleData = arrayOfLinesToSplitRucksacks("03/sample.txt");
    assert.equal(solve03a(sampleData), 157);
  });
  it("solve03b", () => {
    const sampleData = arrayOfLinesToRucksacks("03/sample.txt");
    assert.equal(solve03b(sampleData), 70);
  });
});
