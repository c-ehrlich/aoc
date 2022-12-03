import { assert, describe, it } from "vitest";
import { arrayOfLinesToSplitRucksacks, solve03a } from "./day03";

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
  it("solve03a", () => {
    const sampleData = arrayOfLinesToSplitRucksacks("03/sample.txt");
    assert.equal(solve03a(sampleData), 157);
  });
});
