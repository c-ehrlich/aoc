import fs from "fs";

type WireInstructions = { dir: "U" | "D" | "L" | "R"; len: number };

// key is `{number},{number}`
type WirePoints = Map<string, number>;

function parseWires(file: string) {
  const wires = fs
    .readFileSync(file, "utf-8")
    .split("\n")
    .map((line) =>
      line.split(",").map(
        (instruction) =>
          ({
            dir: instruction.slice(0, 1),
            len: parseInt(instruction.slice(1)),
          } as WireInstructions)
      )
    );
  return [wires[0], wires[1]];
}

function travelWires(wires: WireInstructions[][]) {
  return wires.map((wire) => {
    const s: WirePoints = new Map();
    let distance = 0;
    let x = 0;
    let y = 0;
    wire.forEach((instruction) => {
      for (let i = 0; i < instruction.len; i++) {
        ++distance;
        switch (instruction.dir) {
          case "U":
            ++y;
            break;
          case "D":
            --y;
            break;
          case "L":
            --x;
            break;
          case "R":
            ++x;
            break;
        }
        if (!s.get(`${x},${y}`)) {
          s.set(`${x},${y}`, distance);
        }
      }
    });
    return s;
  });
}

function findIntersects<T>(wire1: WirePoints, wire2: WirePoints) {
  const overlap: WirePoints = new Map();
  wire1.forEach((val, key) => {
    const point2val = wire2.get(key);
    if (point2val) {
      overlap.set(key, val + point2val);
    }
  });
  return overlap;
}

function findManhattanDistance(point: string) {
  const [x, y] = point.split(",").map((x) => parseInt(x)) as [number, number];
  return Math.abs(x) + Math.abs(y);
}

function findLowestManhattanDistance(points: WirePoints) {
  return Array.from(points)
    .map((p) => findManhattanDistance(p[0]))
    .reduce((acc, cur) => (cur < acc ? cur : acc));
}

function findLowestSignalDelay(points: WirePoints) {
  return Array.from(points).sort((p1, p2) => (p1[1] > p2[1] ? 1 : -1))[0][1];
}

export function solve03a(filename: string) {
  const wires = parseWires(filename);
  const points = travelWires(wires);
  const intersects = findIntersects(points[0], points[1]);
  const res = findLowestManhattanDistance(intersects);
  return res;
}

export function solve03b(filename: string) {
  const wires = parseWires(filename);
  const points = travelWires(wires);
  const intersects = findIntersects(points[0], points[1]);
  const res = findLowestSignalDelay(intersects);
  return res;
}

// console.log(solve03a("03/input.txt"));
// console.log(solve03b("03/input.txt"));
