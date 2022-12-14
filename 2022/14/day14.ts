import fs from "fs";

type CaveInstructions = { x: number; y: number }[][];
type Cave = ("." | "#" | "+" | "o")[][];

export class SandFalling {
  private cave: Cave;

  constructor(file: string) {
    this.cave = this.generateCave(file);
  }

  private generateCave(file: string) {
    let lowestX = Infinity;
    let highestX = 0;
    let highestY = 0;
    const instructions = fs
      .readFileSync(file, "utf-8")
      .split("\n")
      .map((line) =>
        line.split(" -> ").map((coordinates) => {
          const [x, y] = coordinates.split(",").map((coord) => parseInt(coord));
          if (x < lowestX) lowestX = x;
          if (x > highestX) highestX = x;
          if (y > highestY) highestY = y;
          return { x, y };
        })
      );
    const adjustedInstructions: CaveInstructions = instructions.map((set) =>
      set.map((item) => ({ x: item.x - lowestX, y: item.y }))
    );
    const cave = Array.from(new Array(highestY + 1)).map(() =>
      Array.from(new Array(highestX - lowestX + 1)).map(() => ".")
    ) as Cave;

    cave[0][500 - lowestX] = "+";

    adjustedInstructions.forEach((set) => {
      for (let i = 0; i < set.length - 1; i++) {
        const start = set[i];
        const end = set[i + 1];
        if (start.x === end.x) {
          const range = Array.from(
            new Array(Math.abs(start.y - end.y) + 1)
              .fill(0)
              .map((_, idx) => idx + Math.min(start.y, end.y))
          );
          for (let index of range) {
            cave[index][start.x] = "#";
          }
        }
        if (start.y === end.y) {
          const range = Array.from(
            new Array(Math.abs(start.x - end.x) + 1)
              .fill(0)
              .map((_, idx) => idx + Math.min(start.x, end.x))
          );
          for (let index of range) {
            cave[start.y][index] = "#";
          }
        }
      }
    });
    return cave;
  }

  public getSmallerCave() {
    return this.cave;
  }

  public getBiggerCave(): Cave {
    const biggerCave = this.cave.map((line) => [
      ...new Array(this.cave.length).fill("."),
      ...line,
      ...new Array(this.cave.length).fill("."),
    ]);
    return biggerCave.concat([
      new Array(biggerCave[0].length).fill("."),
      new Array(biggerCave[0].length).fill("#"),
    ]);
  }

  public dropSand({ biggerCave }: { biggerCave: boolean }) {
    let cave = biggerCave ? this.getBiggerCave() : this.getSmallerCave();
    cave = JSON.parse(JSON.stringify(cave));
    let grainsDropped = 0;
    let done = false;
    const bucketX = this.getBucketX(cave);
    while (!done) {
      const grain = { x: bucketX, y: 0 };
      let grainDone = false;
      while (!grainDone) {
        // check if the nozzle is clogged
        if (cave[grain.y][grain.x] === "o") {
          done = true;
          break;
        }
        // try to go down
        if (this.isOob({ cave, x: grain.x, y: grain.y + 1 })) {
          done = true;
          break;
        }
        if (cave[grain.y + 1][grain.x] === ".") {
          grain.y++;
          continue;
        }
        // try to go down left
        if (this.isOob({ cave, x: grain.x - 1, y: grain.y + 1 })) {
          done = true;
          break;
        }
        if (cave[grain.y + 1][grain.x - 1] === ".") {
          grain.y++;
          grain.x--;
          continue;
        }
        // try to go down right
        if (this.isOob({ cave, x: grain.x + 1, y: grain.y + 1 })) {
          done = true;
          break;
        }
        if (cave[grain.y + 1][grain.x + 1] === ".") {
          grain.y++;
          grain.x++;
          continue;
        }
        // grain has reached the end of its path
        cave[grain.y][grain.x] = "o";
        grainsDropped++;
        grainDone = true;
      }
      // this is a nice lil visualization but it makes the test suite take forever because it console logs the whole cave hundreds of times
      // console.log(cave.map((row) => row.join("")).join("\n"));
    }

    return grainsDropped;
  }

  private getBucketX(cave: Cave) {
    return cave[0].findIndex((item) => item === "+");
  }

  private isOob({ cave, x, y }: { cave: Cave; x: number; y: number }) {
    return y < 0 || y >= cave.length || x < 0 || x >= cave[y].length;
  }
}

export function solve14a(file: string) {
  const sandFalling = new SandFalling(file);
  const grainsDropped = sandFalling.dropSand({ biggerCave: false });
  return grainsDropped;
}

export function solve14b(file: string) {
  const sandFalling = new SandFalling(file);
  const grainsDropped = sandFalling.dropSand({ biggerCave: true });
  return grainsDropped;
}

// console.log(solve14a("14/input.txt"));
// console.log(solve14b("14/input.txt"));
