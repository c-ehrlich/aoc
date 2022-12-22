import fs from "fs";

type Map = ("." | "#" | " ")[][];
type Move = "L" | "R" | number;
type Facing = "N" | "E" | "S" | "W";
type Position = {
  x: number;
  y: number;
  facing: Facing;
};

function parseInstructions(file: string): { map: Map; moves: Move[] } {
  const [mapRaw, movesRaw] = fs.readFileSync(file, "utf8").split("\n\n");
  const mapParsed = mapRaw.split("\n").map((row) => row.split(""));
  const longestRow = mapParsed.reduce(
    (acc, row) => Math.max(acc, row.length),
    0
  );
  const map = mapParsed.map((row) =>
    row.concat(Array(longestRow - row.length).fill(" "))
  ) as Map;
  const moves = movesRaw
    .match(/\d+|\D+/g)
    ?.map((move) => (isNaN(move as any) ? move : parseInt(move))) as Move[];
  return { map, moves };
}

function walk({
  map,
  moves,
  cube,
}: {
  map: Map;
  moves: Move[];
  cube: boolean;
}) {
  const start = findStart(map);
  const end = moves.reduce(
    (acc, move) => performMove({ position: acc, map, move, cube }),
    start
  );
  return end;
}

function findStart(map: Map): Position {
  const firstValidPoint = map[0].indexOf(".");
  return {
    x: firstValidPoint,
    y: 0,
    facing: "E",
  };
}

function performMove({
  position,
  map,
  move,
  cube,
}: {
  position: Position;
  map: Map;
  move: Move;
  cube: boolean;
}): Position {
  if (move === "L" || move === "R") {
    return rotate(position, move);
  } else {
    for (let i = 0; i < move; i++) {
      let move = nextPosition({ start: position, position, map, cube });
      if (move.stuck) {
        console.log("stuck at", move.position);
        return move.position;
      }
      position = move.position;
    }
    console.log("done at", position);
    return position;
  }
}

function rotate(position: Position, direction: "L" | "R"): Position {
  const { facing } = position;
  const directions = ["N", "E", "S", "W"] as const;
  const currentIdx = directions.indexOf(facing);
  let newIdx = direction === "L" ? currentIdx - 1 : currentIdx + 1;
  if (newIdx > 3) {
    newIdx = 0;
  } else if (newIdx < 0) {
    newIdx = 3;
  }
  const newFacing = directions[newIdx];
  return { ...position, facing: newFacing };
}

function nextPosition({
  start,
  position,
  map,
  cube,
}: {
  start: Position;
  position: Position;
  map: Map;
  cube: boolean;
}): {
  position: Position;
  stuck: boolean;
} {
  let { x, y, facing } = position;
  switch (facing) {
    case "N":
      y = y - 1 < 0 ? map.length - 1 : y - 1;
      if (cube && position.y === 0 && position.x >= 50 && position.x < 100) {
        // move 1N to 6W
        x = 0;
        y = 100 + position.x;
        facing = "E";
      }
      if (cube && position.y === 0 && position.x >= 100 && position.x < 150) {
        // move 2N to 6S
        x = position.x - 100;
        y = 199;
        facing = "N";
      }
      if (cube && position.y === 100 && position.x >= 0 && position.x < 50) {
        // move 4N to 3W
        x = 50;
        y = position.x + 50;
        facing = "E";
      }
      let posN = map[y][x];
      if (posN === "#") {
        return { position: start, stuck: true };
      }
      if (posN === ".") {
        return { position: { x, y, facing }, stuck: false };
      }
      if (cube) {
        throw new Error("Failed to handle: " + JSON.stringify(position));
      }
      return nextPosition({
        start: start,
        position: { ...position, x, y },
        map,
        cube,
      });
    case "E":
      x = (x + 1) % map[y].length;
      if (cube && position.x === 149 && position.y >= 0 && position.y < 50) {
        // move 2E to 5E
        x = 99;
        y = 149 - position.y;
        facing = "W";
      }
      if (cube && position.x === 99 && position.y >= 50 && position.y < 100) {
        // move 3E to 2S
        x = position.y + 50;
        y = 49;
        facing = "N";
      }
      if (cube && position.x === 99 && position.y >= 100 && position.y < 150) {
        // move 5E to 2E
        x = 149;
        y = 149 - position.y;
        facing = "W";
      }
      if (cube && position.x === 49 && position.y >= 150 && position.y < 200) {
        // move 6E to 5S
        x = position.y - 100;
        y = 149;
        facing = "N";
      }
      let posE = map[y][x];
      if (posE === "#") {
        return { position: start, stuck: true };
      }
      if (posE === ".") {
        return { position: { x, y, facing }, stuck: false };
      }
      if (cube) {
        throw new Error("Failed to handle: " + JSON.stringify(position));
      }
      return nextPosition({
        start: start,
        position: { ...position, x, y },
        map,
        cube,
      });
    case "S":
      y = (y + 1) % map.length;
      if (cube && position.y === 49 && position.x >= 100 && position.x < 150) {
        // move 2S to 3E
        x = 99;
        y = position.x - 50;
        facing = "W";
      }
      if (cube && position.y === 149 && position.x >= 50 && position.x < 100) {
        // move 5S to 6E
        x = 49;
        y = position.x + 100;
        facing = "W";
      }
      if (cube && position.y === 199 && position.x >= 0 && position.x < 50) {
        // 6S to 2N
        x = position.x + 100;
        y = 0;
        facing = "S";
      }
      let posS = map[y][x];
      if (posS === "#") {
        return { position: start, stuck: true };
      }
      if (posS === ".") {
        return { position: { x, y, facing }, stuck: false };
      }
      if (cube) {
        throw new Error("Failed to handle: " + JSON.stringify(position));
      }
      return nextPosition({
        start: start,
        position: { ...position, y },
        map,
        cube,
      });
    case "W":
      x = x - 1 < 0 ? map[y].length - 1 : x - 1;
      if (cube && position.x === 50 && position.y >= 0 && position.y < 50) {
        // move 1W to 4W
        x = 0;
        y = 149 - position.y;
        facing = "E";
      }
      if (cube && position.x === 50 && position.y >= 50 && position.y < 100) {
        // move 3W to 4N
        x = position.y - 50;
        y = 100;
        facing = "S";
      }
      if (cube && position.x === 0 && position.y >= 100 && position.y < 150) {
        // move 4W to 1W
        x = 50;
        y = 149 - position.y;
        facing = "E";
      }
      if (cube && position.x === 0 && position.y >= 150 && position.y < 200) {
        // move 6W to 1N
        x = position.y - 100;
        y = 0;
        facing = "S";
      }
      let posW = map[y][x];
      if (posW === "#") {
        return { position: start, stuck: true };
      }
      if (posW === ".") {
        return { position: { x, y, facing }, stuck: false };
      }
      if (cube) {
        throw new Error("Failed to handle: " + JSON.stringify(position));
      }
      return nextPosition({
        start: start,
        position: { ...position, x },
        map,
        cube,
      });
    default:
      console.log(position);
      throw new Error("Invalid direction");
  }
}

function facingScore(facing: Facing) {
  if (facing === "E") return 0;
  if (facing === "S") return 1;
  if (facing === "W") return 2;
  if (facing === "N") return 3;
  return -1;
}

export function solve22a(file: string) {
  const { map, moves } = parseInstructions(file);
  const end = walk({ map, moves, cube: false });
  return 1000 * (end.y + 1) + 4 * (end.x + 1) + facingScore(end.facing);
}

export function solve22b(file: string) {
  const { map, moves } = parseInstructions(file);
  const end = walk({ map, moves, cube: true });
  return 1000 * (end.y + 1) + 4 * (end.x + 1) + facingScore(end.facing);
}

console.time("solve22a");
console.log(solve22a("22/input.txt"));
console.timeEnd("solve22a"); // 90ms
console.time("solve22b");
console.log(solve22b("22/input.txt"));
console.timeEnd("solve22b"); // 90ms
