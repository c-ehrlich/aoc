const { default: input } = await import("./input.txt");

type Direction = "N" | "E" | "S" | "W";
type Option = {
  x: number;
  y: number;
  dir: Direction;
  repeat: number;
  cost: number;
};

function popFromSet<T extends unknown>(set: Set<T>): T {
  const iterator = set.values();
  const first = iterator.next().value;
  if (first !== undefined) {
    set.delete(first);
  }
  return first; // Return the removed value
}

// 1 1 1
// 2 2 1
// 2 2 1

// 0,1,E 1 walk(0,1,E,cost:0,repeat:1)
// 0,2,E 2 walk(0,2,E,cost:1,repeat:2)
// 1,2,S 3 walk(1,2,S,cost:2,repeat:1)
// 2,2,S 4 walk(2,2,S,cost:3,repeat:2)

export function parse(input: string) {
  return input.split("\n").map(line => line.split("").map(Number));
}

export function partOne(input: ReturnType<typeof parse>) {
  const board = input;
  const seen = new Map<string, number>();

  const options = new Set<string>([
    JSON.stringify({ x: 0, y: 1, dir: "S", cost: 0, repeat: 1 }),
    JSON.stringify({ x: 1, y: 0, dir: "E", cost: 0, repeat: 1 })
  ]);

  const res = walkPart1({ board, options, seen });

  return res;
}

function nextOptionsPart1(option: Option): Array<Option> {
  const { x, y, dir, repeat, cost } = option;

  let options: Option[] = [];
  if (dir === "N") {
    if (repeat < 3)
      options.push({
        x,
        y: y - 1,
        dir: "N",
        repeat: repeat + 1,
        cost
      });
    options.push(
      { x: x + 1, y: y, dir: "E", repeat: 1, cost },
      { x: x - 1, y: y, dir: "W", repeat: 1, cost }
    );
  }
  if (dir === "E") {
    if (repeat < 3)
      options.push({
        x: x + 1,
        y: y,
        dir: "E",
        repeat: repeat + 1,
        cost
      });
    options.push(
      { x: x, y: y - 1, dir: "N", repeat: 1, cost },
      { x: x, y: y + 1, dir: "S", repeat: 1, cost }
    );
  }
  if (dir === "S") {
    if (repeat < 3)
      options.push({
        x: x,
        y: y + 1,
        dir: "S",
        repeat: repeat + 1,
        cost
      });
    options.push(
      { x: x - 1, y: y, dir: "W", repeat: 1, cost },
      { x: x + 1, y: y, dir: "E", repeat: 1, cost }
    );
  }
  if (dir === "W") {
    if (repeat < 3)
      options.push({
        x: x - 1,
        y: y,
        dir: "W",
        repeat: repeat + 1,
        cost
      });
    options.push(
      { x: x, y: y - 1, dir: "N", repeat: 1, cost },
      { x: x, y: y + 1, dir: "S", repeat: 1, cost }
    );
  }

  return options;
}

export function walkPart1({
  board,
  options,
  seen
}: {
  board: number[][];
  options: Set<string>;
  seen: Map<string, number>;
}) {
  let bestEnding = Infinity;

  let loops = 0;

  do {
    ++loops;
    if (loops % 1000 === 0)
      console.log("loops", loops, "options", options.size);
    const option = JSON.parse(popFromSet(options)) as Option;
    const { x, y, dir, repeat, cost } = option;
    if (x < 0 || y < 0 || y >= board.length || x >= board[0]!.length) continue;

    const key = `${y},${x},${dir},${repeat}`;
    const bestCost = seen.get(key);
    const newCost = cost + board[y]![x]!;
    if (y === board.length - 1 && x === board[0]!.length - 1) {
      if (newCost < bestEnding) {
        bestEnding = newCost;
      }
      continue;
    }
    if (bestCost !== undefined && bestCost <= newCost) {
      continue;
    }
    seen.set(key, newCost);

    const newOptions = nextOptionsPart1({ x, y, dir, repeat, cost: newCost });
    newOptions.forEach(o => options.add(JSON.stringify(o)));
  } while (options.size > 0);

  console.log("best", bestEnding);
  return bestEnding;
}

export function partTwo(input: ReturnType<typeof parse>) {
  const board = input;
  const seen = new Map<string, number>();

  const options = new Set<string>([
    JSON.stringify({ x: 0, y: 1, dir: "S", cost: 0, repeat: 1 }),
    JSON.stringify({ x: 1, y: 0, dir: "E", cost: 0, repeat: 1 })
  ]);

  const res = walkPart2({ board, options, seen });

  return res;
}

function nextOptionsPart2(option: Option): Array<Option> {
  const { x, y, dir, repeat, cost } = option;

  let options: Option[] = [];
  if (dir === "N") {
    if (repeat < 10)
      options.push({
        x,
        y: y - 1,
        dir: "N",
        repeat: repeat + 1,
        cost
      });
    if (repeat >= 4)
      options.push(
        { x: x + 1, y: y, dir: "E", repeat: 1, cost },
        { x: x - 1, y: y, dir: "W", repeat: 1, cost }
      );
  }
  if (dir === "E") {
    if (repeat < 10)
      options.push({
        x: x + 1,
        y: y,
        dir: "E",
        repeat: repeat + 1,
        cost
      });
    if (repeat >= 4)
      options.push(
        { x: x, y: y - 1, dir: "N", repeat: 1, cost },
        { x: x, y: y + 1, dir: "S", repeat: 1, cost }
      );
  }
  if (dir === "S") {
    if (repeat < 10)
      options.push({
        x: x,
        y: y + 1,
        dir: "S",
        repeat: repeat + 1,
        cost
      });
    if (repeat >= 4)
      options.push(
        { x: x - 1, y: y, dir: "W", repeat: 1, cost },
        { x: x + 1, y: y, dir: "E", repeat: 1, cost }
      );
  }
  if (dir === "W") {
    if (repeat < 10)
      options.push({
        x: x - 1,
        y: y,
        dir: "W",
        repeat: repeat + 1,
        cost
      });
    if (repeat >= 4)
      options.push(
        { x: x, y: y - 1, dir: "N", repeat: 1, cost },
        { x: x, y: y + 1, dir: "S", repeat: 1, cost }
      );
  }

  return options;
}

export function walkPart2({
  board,
  options,
  seen
}: {
  board: number[][];
  options: Set<string>;
  seen: Map<string, number>;
}) {
  let bestEnding = Infinity;

  let loops = 0;

  do {
    ++loops;
    if (loops % 1000 === 0)
      console.log("loops", loops, "options", options.size);
    const option = JSON.parse(popFromSet(options)) as Option;
    const { x, y, dir, repeat, cost } = option;
    if (x < 0 || y < 0 || y >= board.length || x >= board[0]!.length) continue;

    const key = `${y},${x},${dir},${repeat}`;
    const bestCost = seen.get(key);
    const newCost = cost + board[y]![x]!;
    if (y === board.length - 1 && x === board[0]!.length - 1) {
      if (newCost < bestEnding && repeat >= 4) {
        bestEnding = newCost;
      }
      continue;
    }
    if (bestCost !== undefined && bestCost <= newCost) {
      continue;
    }
    seen.set(key, newCost);

    const newOptions = nextOptionsPart2({ x, y, dir, repeat, cost: newCost });
    newOptions.forEach(o => options.add(JSON.stringify(o)));
  } while (options.size > 0);

  console.log("best", bestEnding);
  return bestEnding;
}

// console.log(partOne(parse(input)));
console.log(partTwo(parse(input)));
