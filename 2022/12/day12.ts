import fs from "fs";

// i wrote this in an airport so sorry for all the crimes in here
// but it works i guess
// might clean this up later, might not
// whatever, see u for day 13

type Point = [y: number, x: number];
type Queue = Array<{
  point: Point;
  distance: number;
  traveled: Point[];
}>;

export class MountainTraveler {
  private map: string[][];
  private visited: boolean[][];
  private start: Point;
  private end: Point;
  private dir: Point[] = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  constructor({ file }: { file: string }) {
    this.map = fs
      .readFileSync(file, "utf-8")
      .split("\n")
      .map((item) => item.split(""));
    this.start = this.findStart();
    this.end = this.findEnd();
    this.visited = this.map.map((line) => line.map(() => false));
  }

  private findStart(): [y: number, x: number] {
    const startLine = this.map.find((line) => line.includes("S"));
    if (!startLine) {
      throw new Error("No start found");
    }
    return [this.map.indexOf(startLine), startLine.indexOf("S")];
  }

  private findEnd(): [y: number, x: number] {
    const endLine = this.map.find((line) => line.includes("E"));
    if (!endLine) {
      throw new Error("No end found");
    }
    return [this.map.indexOf(endLine), endLine.indexOf("E")];
  }

  public isEnd(y: number, x: number): boolean {
    return y === this.end[0] && x === this.end[1];
  }

  public isStart(y: number, x: number): boolean {
    return y === this.start[0] && x === this.start[1];
  }

  public ascendAndReturnShortestDistance() {
    const result = this.ascend();
    return result ? result.distance : -1;
  }

  private ascend() {
    const queue = [{ point: this.start, distance: 0, traveled: [] }] as Queue;
    while (queue.length > 0) {
      const coord = queue.shift()!;

      // base case 2: already visited
      if (this.visited[coord.point[0]][coord.point[1]]) {
        continue;
      }
      // base case 3: reached the end
      if (this.isEnd(coord.point[0], coord.point[1])) {
        return coord;
      }

      // mark point as visited
      this.visited[coord.point[0]][coord.point[1]] = true;

      // for each direction, see if we can move there in terms of the map
      // if so, add it to the queue
      for (const direction of this.dir) {
        const nextPoint = [
          coord.point[0] + direction[0],
          coord.point[1] + direction[1],
        ];
        if (this.canAscendTo({ from: coord.point, to: nextPoint as Point })) {
          queue.push({
            point: nextPoint as Point,
            distance: coord.distance + 1,
            traveled: [...coord.traveled, coord.point],
          });
        }
      }
    }
  }

  private isOnMap({ y, x }: { y: number; x: number }) {
    return y >= 0 && y < this.map.length && x >= 0 && x < this.map[0].length;
  }

  private canAscendTo({ from, to }: { from: Point; to: Point }) {
    // if to is off the map, no
    if (
      !this.isOnMap({ y: to[0], x: to[1] }) ||
      !this.isOnMap({ y: from[0], x: from[1] })
    ) {
      return false;
    }

    const fromIsLowercase = this.map[from[0]][from[1]].charCodeAt(0) >= 97;
    const toIsLowercase = this.map[to[0]][to[1]].charCodeAt(0) >= 97;
    const fromIsZ = this.map[from[0]][from[1]] === "z";
    const fromIsS = this.map[from[0]][from[1]] === "S";
    const toIsE = this.map[to[0]][to[1]] === "E";
    const toIsA = this.map[to[0]][to[1]] === "a";

    // if from is z and to is E, ok
    if (fromIsZ && toIsE) {
      return true;
    }

    // if from is S and to a, ok
    if (fromIsS && toIsA) {
      return true;
    }

    // if both from and to are lowercase letter and to is at most 1 letter higher in the alphabet, ok
    if (fromIsLowercase && toIsLowercase) {
      return (
        this.map[to[0]][to[1]].charCodeAt(0) <=
        this.map[from[0]][from[1]].charCodeAt(0) + 1
      );
    }

    // no true case
    return false;
  }

  public findShortestScenicRoute() {
    const result = this.descend();
    return result ? result.distance : -1;
  }

  private descend() {
    const queue = [{ point: this.end, distance: 0, traveled: [] }] as Queue;
    while (queue.length > 0) {
      const coord = queue.shift()!;

      // base case 2: already visited
      if (this.visited[coord.point[0]][coord.point[1]]) {
        continue;
      }
      this.visited[coord.point[0]][coord.point[1]] = true;

      // base case 3: reached the end
      if (
        this.isStart(coord.point[0], coord.point[1]) ||
        this.map[coord.point[0]][coord.point[1]] === "a"
      ) {
        return coord;
      }

      // for each direction, see if we can move there in terms of the map
      // if so, add it to the queue
      for (const direction of this.dir) {
        const nextPoint = [
          coord.point[0] + direction[0],
          coord.point[1] + direction[1],
        ];
        if (this.canAscendTo({ from: nextPoint as Point, to: coord.point })) {
          queue.push({
            point: nextPoint as Point,
            distance: coord.distance + 1,
            traveled: [...coord.traveled, coord.point],
          });
        }
      }
    }
  }
}

export function solve12a(file: string) {
  const traveler = new MountainTraveler({ file });
  return traveler.ascendAndReturnShortestDistance();
}

export function solve12b(file: string) {
  const traveler = new MountainTraveler({ file });
  return traveler.findShortestScenicRoute();
}

console.log(solve12a("12/input.txt"));
console.log(solve12b("12/input.txt"));
