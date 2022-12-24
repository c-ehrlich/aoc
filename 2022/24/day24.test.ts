import { assert, describe, it } from "vitest";
import { BlizzardRunner, solve24a, solve24b } from "./day24";

class BlizzardRunnerTest extends BlizzardRunner {
  public testIsBlizzardOnTurn({
    coord,
    turn,
  }: {
    coord: [number, number];
    turn: number;
  }) {
    return this.isBlizzardOnTurn({ coord, turn });
  }
}

describe("day24", () => {
  it("isBlizzardOnTurn ^", () => {
    const blizz = new BlizzardRunnerTest("24/sample-up.txt");
    assert.equal(blizz.testIsBlizzardOnTurn({ coord: [2, 4], turn: 0 }), true);
    assert.equal(blizz.testIsBlizzardOnTurn({ coord: [1, 4], turn: 1 }), true);
    assert.equal(blizz.testIsBlizzardOnTurn({ coord: [4, 4], turn: 2 }), true);
    assert.equal(blizz.testIsBlizzardOnTurn({ coord: [3, 4], turn: 3 }), true);
    assert.equal(
      blizz.testIsBlizzardOnTurn({ coord: [2, 4], turn: 100 }),
      true
    );
    assert.equal(blizz.testIsBlizzardOnTurn({ coord: [1, 1], turn: 0 }), false);
  });
  it("isBlizzardOnTurn <", () => {
    const blizz = new BlizzardRunnerTest("24/sample-left.txt");
    assert.equal(blizz.testIsBlizzardOnTurn({ coord: [2, 4], turn: 0 }), true);
    assert.equal(blizz.testIsBlizzardOnTurn({ coord: [2, 3], turn: 1 }), true);
    assert.equal(blizz.testIsBlizzardOnTurn({ coord: [2, 2], turn: 2 }), true);
    assert.equal(blizz.testIsBlizzardOnTurn({ coord: [2, 1], turn: 3 }), true);
    assert.equal(blizz.testIsBlizzardOnTurn({ coord: [2, 6], turn: 4 }), true);
    assert.equal(blizz.testIsBlizzardOnTurn({ coord: [2, 5], turn: 5 }), true);
    assert.equal(blizz.testIsBlizzardOnTurn({ coord: [2, 4], turn: 66 }), true);
    assert.equal(blizz.testIsBlizzardOnTurn({ coord: [1, 1], turn: 0 }), false);
  });
  it("isBlizzardOnTurn >", () => {
    const blizz = new BlizzardRunnerTest("24/sample-right.txt");
    assert.equal(blizz.testIsBlizzardOnTurn({ coord: [2, 4], turn: 0 }), true);
    assert.equal(blizz.testIsBlizzardOnTurn({ coord: [2, 5], turn: 1 }), true);
    assert.equal(blizz.testIsBlizzardOnTurn({ coord: [2, 6], turn: 2 }), true);
    assert.equal(blizz.testIsBlizzardOnTurn({ coord: [2, 1], turn: 3 }), true);
    assert.equal(blizz.testIsBlizzardOnTurn({ coord: [2, 2], turn: 4 }), true);
    assert.equal(blizz.testIsBlizzardOnTurn({ coord: [2, 3], turn: 5 }), true);
    assert.equal(blizz.testIsBlizzardOnTurn({ coord: [2, 4], turn: 66 }), true);
    assert.equal(blizz.testIsBlizzardOnTurn({ coord: [1, 1], turn: 0 }), false);
  });
  it("isBlizzardOnTurn v", () => {
    const blizz = new BlizzardRunnerTest("24/sample-down.txt");
    assert.equal(blizz.testIsBlizzardOnTurn({ coord: [2, 4], turn: 0 }), true);
    assert.equal(blizz.testIsBlizzardOnTurn({ coord: [3, 4], turn: 1 }), true);
    assert.equal(blizz.testIsBlizzardOnTurn({ coord: [4, 4], turn: 2 }), true);
    assert.equal(blizz.testIsBlizzardOnTurn({ coord: [1, 4], turn: 3 }), true);
    assert.equal(
      blizz.testIsBlizzardOnTurn({ coord: [2, 4], turn: 100 }),
      true
    );
    assert.equal(blizz.testIsBlizzardOnTurn({ coord: [1, 1], turn: 0 }), false);
  });
  it("solve24a", () => {
    assert.equal(solve24a("24/sample.txt"), 18);
  });
  it("solve24b", () => {
    assert.equal(solve24b("24/sample.txt"), 54);
  });
});
