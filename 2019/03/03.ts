import fs from "fs";

type WireInstructions = { dir: "U" | "D" | "L" | "R"; len: number };

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
    const s = new Set<string>();
    let x = 0;
    let y = 0;
    wire.forEach((instruction) => {
      for (let i = 0; i < instruction.len; i++) {
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
        s.add(`${x},${y}`);
      }
    });
    return s;
  });
}

function findIntersects<T>(set1: Set<T>, set2: Set<T>) {
  return new Set([...set1].filter((i) => set2.has(i)));
}

function findManhattanDistance(point: string) {
  const [x, y] = point.split(",").map((x) => parseInt(x)) as [number, number];
  return Math.abs(x) + Math.abs(y);
}

function findLowestManhattanDistance(points: Set<string>) {
  return [...points]
    .map((p) => findManhattanDistance(p))
    .reduce((acc, cur) => (cur < acc ? cur : acc));
}

export function solve03a(filename: string) {
  const wires = parseWires(filename);
  const points = travelWires(wires);
  const intersects = findIntersects(points[0], points[1]);
  const res = findLowestManhattanDistance(intersects);
  return res;
}
