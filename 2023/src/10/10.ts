const { default: input } = await import("./input.txt");

type Pos = { x: number; y: number };
type MazePoint = "|" | "-" | "L" | "J" | "7" | "F" | "." | "S";
type Maze = MazePoint[][];
type Visited = number[][];

export function parse(input: string) {
  return input.split("\n").map(row => row.split("")) as Maze;
}

const CONNECTS_UP: MazePoint[] = ["|", "L", "J", "S"];
const CONNECTS_DOWN: MazePoint[] = ["|", "F", "7", "S"];
const CONNECTS_LEFT: MazePoint[] = ["-", "J", "7", "S"];
const CONNECTS_RIGHT: MazePoint[] = ["-", "F", "L", "S"];

const VERTICAL_PIPES = ["|", "J", "L"];

function canGoLeft(maze: Maze, pos: Pos, visited: Visited) {
  if (pos.x - 1 < 0) return false;
  if (!CONNECTS_LEFT.includes(maze[pos.y]![pos.x]!)) return false;
  if (!CONNECTS_RIGHT.includes(maze[pos.y]![pos.x - 1]!)) return false;
  if (visited[pos.y]![pos.x - 1]) return false;
  return true;
}
function canGoRight(maze: Maze, pos: Pos, visited: Visited) {
  if (pos.x + 1 >= maze[0]!.length) return false;
  if (!CONNECTS_RIGHT.includes(maze[pos.y]![pos.x]!)) return false;
  if (!CONNECTS_LEFT.includes(maze[pos.y]![pos.x + 1]!)) return false;
  if (visited[pos.y]![pos.x + 1]) return false;
  return true;
}
function canGoUp(maze: Maze, pos: Pos, visited: Visited) {
  if (pos.y - 1 < 0) return false;
  if (!CONNECTS_UP.includes(maze[pos.y]![pos.x]!)) return false;
  if (!CONNECTS_DOWN.includes(maze[pos.y - 1]![pos.x]!)) return false;
  if (visited[pos.y - 1]![pos.x]) return false;
  return true;
}

function canGoDown(maze: Maze, pos: Pos, visited: Visited) {
  if (pos.y + 1 >= maze.length) return false;
  if (!CONNECTS_DOWN.includes(maze[pos.y]![pos.x]!)) return false;
  if (!CONNECTS_UP.includes(maze[pos.y + 1]![pos.x]!)) return false;
  if (visited[pos.y + 1]![pos.x]) return false;
  return true;
}

type WalkQueue = { pos: Pos; distance: number }[];

export function partOne(input: ReturnType<typeof parse>) {
  const maze = input;
  const visited: Visited = new Array(maze.length)
    .fill(undefined)
    .map(_ => new Array(maze[0]!.length).fill(0));

  let start: Pos = { x: -1, y: -1 };
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[0]!.length; x++) {
      if (maze[y]![x]! === "S") start = { x, y };
    }
  }

  const walkQueue: WalkQueue = [{ pos: start, distance: 0 }];

  while (walkQueue.length) {
    const { pos, distance } = walkQueue.shift()!;
    visited[pos.y]![pos.x] = distance;
    if (canGoDown(maze, pos, visited)) {
      walkQueue.push({
        pos: { x: pos.x, y: pos.y + 1 },
        distance: distance + 1
      });
    }
    if (canGoUp(maze, pos, visited)) {
      walkQueue.push({
        pos: { x: pos.x, y: pos.y - 1 },
        distance: distance + 1
      });
    }
    if (canGoLeft(maze, pos, visited)) {
      walkQueue.push({
        pos: { x: pos.x - 1, y: pos.y },
        distance: distance + 1
      });
    }
    if (canGoRight(maze, pos, visited)) {
      walkQueue.push({
        pos: { x: pos.x + 1, y: pos.y },
        distance: distance + 1
      });
    }
  }

  let biggestDistance = -1;

  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[0]!.length; x++) {
      biggestDistance = Math.max(visited[y]![x]!, biggestDistance);
    }
  }
  return biggestDistance;
}

export function partTwo(input: ReturnType<typeof parse>) {
  // create map of what is or isn't the main loop
  const mainLoop: boolean[][] = new Array(input.length)
    .fill(undefined)
    .map(_ => new Array(input[0]!.length).fill(false));

  let mainLoopStart: Pos = { x: -1, y: -1 };
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0]!.length; x++) {
      if (input[y]![x]! === "S") {
        mainLoopStart = { x, y };

        // replace start with the type of pipe it represents
        const left = input[y]?.[x - 1] as any;
        const right = input[y]?.[x + 1] as any;
        const up = input[y - 1]?.[x] as any;
        const down = input[y + 1]?.[x] as any;

        if (CONNECTS_DOWN.includes(up) && CONNECTS_UP.includes(down)) {
          input[y]![x]! = "|";
        }
        if (CONNECTS_RIGHT.includes(left) && CONNECTS_LEFT.includes(right)) {
          input[y]![x]! = "-";
        }
        if (CONNECTS_DOWN.includes(up) && CONNECTS_LEFT.includes(right)) {
          input[y]![x]! = "L";
        }
        if (CONNECTS_UP.includes(down) && CONNECTS_LEFT.includes(right)) {
          input[y]![x]! = "F";
        }
        if (CONNECTS_UP.includes(down) && CONNECTS_RIGHT.includes(left)) {
          input[y]![x]! = "7";
        }
        if (CONNECTS_DOWN.includes(up) && CONNECTS_RIGHT.includes(left)) {
          input[y]![x]! = "J";
        }
      }
    }
  }

  const q: Pos[] = [mainLoopStart];

  while (q.length) {
    const pos = q.shift()!;
    mainLoop[pos.y]![pos.x]! = true;
    if (canGoUp(input, pos, mainLoop as any)) q.push({ ...pos, y: pos.y - 1 });
    if (canGoDown(input, pos, mainLoop as any))
      q.push({ ...pos, y: pos.y + 1 });
    if (canGoLeft(input, pos, mainLoop as any))
      q.push({ ...pos, x: pos.x - 1 });
    if (canGoRight(input, pos, mainLoop as any))
      q.push({ ...pos, x: pos.x + 1 });
  }

  console.time("inside");
  let inside = 0;
  for (let y = 0; y < input.length; y++) {
    let verticalPipesSeen = 0;
    for (let x = 0; x < input[0]!.length; x++) {
      if (!mainLoop[y]![x]!) {
        if (verticalPipesSeen % 2 === 1) {
          ++inside;
        }

        continue;
      }

      if (VERTICAL_PIPES.includes(input[y]![x]!)) verticalPipesSeen++;
    }
  }
  console.timeEnd("inside");

  return inside;
}

/**
 * finding the main loop takes about 8ms but could probably
 * be optimized a lot by just traveling along it instead of using
 * recursion
 *
 * finding the inside tiles is O(N) not including finding the main loop
 * and takes <1ms
 */

console.time("1");
console.log(partOne(parse(input)));
console.timeEnd("1");
console.time("2");
console.log(partTwo(parse(input)));
console.timeEnd("2");
