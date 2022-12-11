import { assert, describe, it } from "vitest";
import { Monkeys } from "./day11";

describe("day11", () => {
  it("input", () => {
    const expected = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3
`;
    const monkeys = new Monkeys({ file: "11/sample.txt", relax: true });
    const monkey0 = monkeys.printMonkey(0);
    assert.equal(monkey0, expected);
  });
  it("solve11a", () => {
    const monkeys = new Monkeys({ file: "11/sample.txt", relax: true });
    monkeys.doRounds(20);
    const monkeyBusiness = monkeys.getMonkeyBusiness();
    assert.equal(monkeyBusiness, 10605);
  });
  it("solve11b", () => {
    const monkeys = new Monkeys({ file: "11/sample.txt", relax: false });
    monkeys.doRounds(20);
    const monkeyBusiness = monkeys.getMonkeyBusiness();
    assert.equal(monkeyBusiness, 10197);
  });
});
