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

  public getMapSize() {
    return [this.map.length, this.map[0].length];
  }

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

  public walk({ start, goals }: { start: Coordinate; goals: Coordinate[] }) {
    // queue of [coord, turn]
    let turnGlobal = 0;
    let pos = start;
    while (goals.length) {
      const currentGoal = goals.shift() as Coordinate;
      let queue: [Coordinate, number][] = [[pos, turnGlobal]]; // TODO: how to get turn for goals 2, 3, etc?
      const haveBeenTo: Array<Set<string>> = [new Set()]; // index is turn

      console.log("turn", turnGlobal, "goal", currentGoal);

      while (queue.length > 0) {
        const [coord, turn] = queue.shift()!;
        if (!haveBeenTo[turn]) {
          haveBeenTo[turn] = new Set();
        }
        if (haveBeenTo[turn].has(coord.toString())) {
          continue;
        }
        haveBeenTo[turn].add(coord.toString());
        // is oob, shouldn't be able to get here except walking up from start or down from end but lets be safe
        if (
          coord[0] < 0 ||
          coord[0] >= this.map.length ||
          coord[1] < 0 ||
          coord[1] >= this.map[0].length
        ) {
          // console.log(`oob at ${coord} on turn ${turn}`);
          continue;
        }
        // don't linger around at the star
        // is wall
        if (this.map[coord[0]][coord[1]] === "#") {
          // console.log(`wall at ${coord} on turn ${turn}`);
          continue;
        }
        // is goal
        if (currentGoal[0] === coord[0] && currentGoal[1] === coord[1]) {
          queue = [];
          turnGlobal = turn;
          pos = coord;
          continue;
        }
        // is blizzard
        if (this.isBlizzardOnTurn({ coord, turn })) {
          continue;
        }
        // check other directions
        queue.push([[coord[0] + 1, coord[1]], turn + 1]);
        queue.push([[coord[0] - 1, coord[1]], turn + 1]);
        queue.push([[coord[0], coord[1] + 1], turn + 1]);
        queue.push([[coord[0], coord[1] - 1], turn + 1]);
        queue.push([[coord[0], coord[1]], turn + 1]); // wait
      }
    }
    return turnGlobal;
  }
}

export function solve24a(file: string) {
  const blizz = new BlizzardRunner(file);
  const mapSize = blizz.getMapSize();
  return blizz.walk({
    start: [0, 1],
    goals: [[mapSize[0] - 1, mapSize[1] - 2]],
  });
}

export function solve24b(file: string) {
  const blizz = new BlizzardRunner(file);
  const mapSize = blizz.getMapSize();
  return blizz.walk({
    start: [0, 1],
    goals: [
      [mapSize[0] - 1, mapSize[1] - 2],
      [0, 1],
      [mapSize[0] - 1, mapSize[1] - 2],
    ],
  });
}

console.time("solve24a");
console.log(solve24a("24/input.txt"));
console.timeEnd("solve24a"); // 420ms
console.time("solve24b");
console.log(solve24b("24/input.txt"));
console.timeEnd("solve24b"); // 1.3s
