import fs from "fs";

type ElfLayout = ("#" | ".")[][];
type Elf = { pos: Coordinate; planned: Coordinate };
type Coordinate = { y: number; x: number };
const DIRECTIONS = ["N", "S", "W", "E"] as const;

/**
 * while this is reasonably readable, it's the most shameful solution i've written
 * all aoc in terms of performance. it's not even that slow, but it would be
 * trivial to make it way faster. maybe i'll go back and do that, but probably not lol
 */

function parseElfLayout(file: string) {
  const board = fs
    .readFileSync(file, "utf8")
    .split("\n")
    .map((line) => line.split("")) as ElfLayout;
  const elfs = [] as Elf[];
  board.forEach((line, y) => {
    line.forEach((char, x) => {
      if (char === "#") {
        elfs.push({ pos: { y, x }, planned: { y, x } });
      }
    });
  });
  // console.log(elfs);
  return elfs;
}

function takeTurns({ elves, moves }: { elves: Elf[]; moves: number }): Elf[] {
  for (let i = 0; i < moves; i++) {
    elves = planMoves({ elves, move: i });
    elves = makeMoves(elves);
  }
  return elves;
}

function takeTurnsCheckNoMove({ elves }: { elves: Elf[] }) {
  for (let i = 0; i < Infinity; i++) {
    console.log("turn", i + 1);
    elves = planMoves({ elves, move: i });
    if (
      !elves.find(
        (elf) => elf.pos.x !== elf.planned.x || elf.pos.y !== elf.planned.y
      )
    ) {
      console.log(JSON.stringify(elves));
      console.log("empty", findEmpty(elves));
      console.log("no move", i + 1);

      return i + 1;
    }
    elves = makeMoves(elves);
  }
  return -1;
}

function planMoves({ elves, move }: { elves: Elf[]; move: number }): Elf[] {
  return elves.map((elf, idx) => {
    // if there is another elf within x/y +/- 1, set the planned coordinate to that elf's position
    const otherElf = elves.find((elf2, idx2) => {
      return (
        idx !== idx2 &&
        Math.abs(elf.pos.y - elf2.pos.y) <= 1 &&
        Math.abs(elf.pos.x - elf2.pos.x) <= 1
      );
    });
    if (!otherElf) {
      return { ...elf, planned: elf.pos };
    }

    // otherwise, iterate over the directions offset by move, and do the first one that works
    for (let i = 0 + move; i < DIRECTIONS.length + move; i++) {
      const direction = DIRECTIONS[i % DIRECTIONS.length];

      if (direction === "N") {
        // check if there are elves in N, NE, NW
        const otherElf = elves.find((elf2, idx2) => {
          return (
            idx !== idx2 &&
            elf.pos.y - 1 === elf2.pos.y &&
            Math.abs(elf.pos.x - elf2.pos.x) <= 1
          );
        });
        // if not, plan to go there
        if (!otherElf) {
          return { ...elf, planned: { y: elf.pos.y - 1, x: elf.pos.x } };
        }
      }
      if (direction === "S") {
        // check if there are elves in S, SE, SW
        const otherElf = elves.find((elf2, idx2) => {
          return (
            idx !== idx2 &&
            elf.pos.y + 1 === elf2.pos.y &&
            Math.abs(elf.pos.x - elf2.pos.x) <= 1
          );
        });
        // if not, plan to go there
        if (!otherElf) {
          return { ...elf, planned: { y: elf.pos.y + 1, x: elf.pos.x } };
        }
      }
      if (direction === "W") {
        // check if there are elves in W, NW, SW
        const otherElf = elves.find((elf2, idx2) => {
          return (
            idx !== idx2 &&
            elf.pos.x - 1 === elf2.pos.x &&
            Math.abs(elf.pos.y - elf2.pos.y) <= 1
          );
        });
        // if not, plan to go there
        if (!otherElf) {
          return { ...elf, planned: { y: elf.pos.y, x: elf.pos.x - 1 } };
        }
      }
      if (direction === "E") {
        // check if there are elves in E, NE, SE
        const otherElf = elves.find((elf2, idx2) => {
          return (
            idx !== idx2 &&
            elf.pos.x + 1 === elf2.pos.x &&
            Math.abs(elf.pos.y - elf2.pos.y) <= 1
          );
        });
        // if not, plan to go there
        if (!otherElf) {
          return { ...elf, planned: { y: elf.pos.y, x: elf.pos.x + 1 } };
        }
      }
    }
    // all positions blocked, remain in place
    return { ...elf, planned: elf.pos };
  });
}

function makeMoves(elves: Elf[]): Elf[] {
  return elves.map((elf, idx) => {
    const otherElf = elves.find((elf2, idx2) => {
      return (
        idx !== idx2 &&
        elf.planned.y === elf2.planned.y &&
        elf.planned.x === elf2.planned.x
      );
    });
    if (!otherElf) {
      return { ...elf, pos: elf.planned };
    }
    return elf;
  });
}

function findEmpty(elves: Elf[]) {
  const xCoords = elves.map((elf) => elf.pos.x);
  const yCoords = elves.map((elf) => elf.pos.y);
  const minX = Math.min(...xCoords);
  const minY = Math.min(...yCoords);
  const maxX = Math.max(...xCoords);
  const maxY = Math.max(...yCoords);
  console.log(minX, maxX, minY, maxY);
  return (maxX - minX + 1) * (maxY - minY + 1) - elves.length;
}

export function solve23a(file: string) {
  const elves = parseElfLayout(file);
  const finalElves = takeTurns({ elves, moves: 10 });
  const empty = findEmpty(finalElves);
  return empty;
}

export function solve23b(file: string) {
  const elves = parseElfLayout(file);
  const turnNum = takeTurnsCheckNoMove({ elves });
  return turnNum;
}

console.time("23a");
console.log(solve23a("23/input.txt"));
console.timeEnd("23a"); // 2.2s
console.time("23b");
console.log(solve23b("23/input.txt"));
console.timeEnd("23b"); // // 2m30s
