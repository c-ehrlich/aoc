import { assert, describe, it } from "vitest";
import { Chamber, Piece, RocksFalling, solve17a, solve17b } from "./day17";

describe("day17", () => {
  it("canGoThere", () => {
    const chamber = new RocksFalling({ file: "17/sample.txt", pieces: 0 });
    // start
    assert.equal(
      chamber.canGoThere({
        chamber: canGoThereChamberFixture,
        piece: canGoTherePieceFixture,
        offset: [2, 4],
      }),
      true
    );
    // up
    assert.equal(
      chamber.canGoThere({
        chamber: canGoThereChamberFixture,
        piece: canGoTherePieceFixture,
        offset: [3, 4],
      }),
      true
    );
    // right
    assert.equal(
      chamber.canGoThere({
        chamber: canGoThereChamberFixture,
        piece: canGoTherePieceFixture,
        offset: [2, 5],
      }),
      false
    );
    // down
    assert.equal(
      chamber.canGoThere({
        chamber: canGoThereChamberFixture,
        piece: canGoTherePieceFixture,
        offset: [1, 4],
      }),
      false
    );
    // left
    assert.equal(
      chamber.canGoThere({
        chamber: canGoThereChamberFixture,
        piece: canGoTherePieceFixture,
        offset: [2, 4],
      }),
      true
    );
  });
  it("solve17a", () => {
    assert.equal(solve17a("17/sample.txt"), 3068);
  });
  // it("solve17b", () => {
  //   const sampleData = [0];
  //   assert.equal(solve17b(sampleData), 0);
  // });
  // did part 2 mostly by hand so no test here
});

const canGoThereChamberFixture: Chamber = [
  ["#", "#", "#", "#", "#", "#", "#"],
  ["#", "#", "#", "#", "#", ".", "#"],
  ["#", "#", "#", "#", "#", ".", "."],
  ["#", "#", "#", ".", ".", ".", "."],
  ["#", "#", "#", "#", ".", ".", "."],
  ["#", "#", "#", "#", "#", ".", "#"],
  ["#", "#", "#", "#", "#", "#", "#"],
];
const canGoTherePieceFixture: Piece = [
  [".", "#", "."],
  ["#", "#", "#"],
  [".", "#", "."],
];
