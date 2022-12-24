import fs from "fs";

type MapSquare = "#" | "." | "<" | ">" | "^" | "v";
type WindMap = MapSquare[][];
type Coordinate = [number, number]; // [y, x]

export class BlizzardRunner {
  private map: WindMap;
  constructor(file: string) {
    this.map = fs
      .readFileSync(file, "utf8")
      .split("\n")
      .map((line) => line.split("")) as WindMap;
  }

  protected isStart(coord: Coordinate) {
    return coord[0] === 0 && coord[1] === 1;
  }
  protected isEnd(coord: Coordinate) {
    console.log(this.map.length, this.map[0].length);
    return (
      coord[0] === this.map.length - 1 && coord[1] === this.map[0].length - 2
    );
  }
  /**
   * We start on turn 1!
   */
  protected isBlizzardOnTurn({
    coord,
    turn,
  }: {
    coord: Coordinate;
    turn: number;
  }) {
    const lengthX = this.map[0].length - 2;
    const cycleX = turn % lengthX; // 0 and l-1 are walls
    const lengthY = this.map.length - 2;
    const cycleY = turn % lengthY; // 0 and l-1 are walls
    // ^
    if (this.map[((coord[0] + cycleY - 1) % lengthY) + 1][coord[1]] === "^") {
      return true;
    }
    // <
    if (this.map[coord[0]][((coord[1] + cycleX - 1) % lengthX) + 1] === "<") {
      return true;
    }
    // v
    if (
      this.map[((coord[0] - cycleY + lengthY - 1) % lengthY) + 1][coord[1]] ===
      "v"
    ) {
      return true;
    }
    // >
    if (
      this.map[coord[0]][((coord[1] - cycleX + lengthX - 1) % lengthX) + 1] ===
      ">"
    ) {
      return true;
    }
    return false;
  }

  public walk() {
    // queue of [coord, turn]
    const queue: [Coordinate, number, string][] = [[[0, 1], 0, ""]];
    const haveBeenTo: Array<Set<string>> = [new Set()]; // index is turn
    while (queue.length > 0) {
      console.log(queue.length);
      const [coord, turn, log] = queue.shift()!;
      if (!haveBeenTo[turn]) {
        haveBeenTo[turn] = new Set();
      }
      if (haveBeenTo[turn].has(coord.toString())) {
        continue;
      }
      haveBeenTo[turn].add(coord.toString());
      // is oob, shouldn't be able to get here except walking up from start but lets be safe
      if (
        coord[0] < 0 ||
        coord[0] >= this.map.length ||
        coord[1] < 0 ||
        coord[1] >= this.map[0].length
      ) {
        console.log(`oob at ${coord} on turn ${turn}`);
        continue;
      }
      // don't linger around at the star
      // is wall
      if (this.map[coord[0]][coord[1]] === "#") {
        console.log(`wall at ${coord} on turn ${turn}`);
        continue;
      }
      // is goal
      if (this.isEnd(coord)) {
        return turn;
      }
      // is blizzard
      if (this.isBlizzardOnTurn({ coord, turn })) {
        console.log(`blizzard on turn ${turn} at ${coord}`);
        continue;
      }
      // check other directions
      queue.push([
        [coord[0] + 1, coord[1]],
        turn + 1,
        log + `${turn}: ${coord} -> ${[coord[0] + 1, coord[1]]}\n`,
      ]);
      queue.push([
        [coord[0] - 1, coord[1]],
        turn + 1,
        log + `${turn}: ${coord} -> ${[coord[0] - 1, coord[1]]}\n`,
      ]);
      queue.push([
        [coord[0], coord[1] + 1],
        turn + 1,
        log + `${turn}: ${coord} -> ${[coord[0], coord[1] + 1]}\n`,
      ]);
      queue.push([
        [coord[0], coord[1] - 1],
        turn + 1,
        log + `${turn}: ${coord} -> ${[coord[0], coord[1] - 1]}\n`,
      ]);
      queue.push([
        [coord[0], coord[1]],
        turn + 1,
        log + `${turn}: wait at ${coord}\n`,
      ]); // wait
    }
  }
}

export function solve24a(file: string) {
  const blizz = new BlizzardRunner(file);
  return blizz.walk();
}

export function solve24b(file: string) {
  return 0;
}

console.log(solve24a("24/input.txt"));
// console.log(solve24b("24/sample.txt"));
