const { default: input } = await import("./input.txt");

type Direction = "N" | "E" | "S" | "W";
type Option = {
  x: number;
  y: number;
  dir: Direction;
  prev: Direction[];
  cost: number;
};

// 1 1 1
// 2 2 1
// 2 2 1

// 0,1,E 1 walk(0,1,E,cost:0,dirs:[])
// 0,2,E 2 walk(0,2,E,cost:1,dirs:[E]
// 1,2,S 3 walk(1,2,S,cost:2,dirs:[E,E])
// 2,2,S 4 walk(2,2,S,cost:3,dirs:[E,E,S])

export function parse(input: string) {
  return input.split("\n").map(line => line.split("").map(Number));
}

export function partOne(input: ReturnType<typeof parse>) {
  const board = input;
  const seen = new Map<string, number>();

  const options: Option[] = [
    { x: 0, y: 1, dir: "S", cost: 0, prev: ["S"] },
    { x: 1, y: 0, dir: "E", cost: 0, prev: ["E"] }
  ];

  const res = walk({ board, options, seen });

  return res;
}

function nextOptions(option: Option): Array<Option> {
  const { x, y, dir, prev, cost } = option;
  const last3 = prev.slice(-3);

  let options: Option[] = [];
  if (dir === "N") {
    if (last3.length < 3 || last3.some(d => d !== "N"))
      options.push({
        x,
        y: y - 1,
        dir: "N",
        prev: [...prev, "N"],
        cost
      });
    options.push(
      { x: x + 1, y: y, dir: "E", prev: [...prev, "E"], cost },
      { x: x - 1, y: y, dir: "W", prev: [...prev, "W"], cost }
    );
  }
  if (dir === "E") {
    if (last3.length < 3 || last3.some(d => d !== "E"))
      options.push({
        x: x + 1,
        y: y,
        dir: "E",
        prev: [...prev, "E"],
        cost
      });
    options.push(
      { x: x, y: y - 1, dir: "N", prev: [...prev, "N"], cost },
      { x: x, y: y + 1, dir: "S", prev: [...prev, "S"], cost }
    );
  }
  if (dir === "S") {
    if (last3.length < 3 || last3.some(d => d !== "S"))
      options.push({
        x: x,
        y: y + 1,
        dir: "S",
        prev: [...prev, "S"],
        cost
      });
    options.push(
      { x: x - 1, y: y, dir: "W", prev: [...prev, "W"], cost },
      { x: x + 1, y: y, dir: "E", prev: [...prev, "E"], cost }
    );
  }
  if (dir === "W") {
    if (last3.length < 3 || last3.some(d => d !== "W"))
      options.push({
        x: x - 1,
        y: y,
        dir: "W",
        prev: [...prev, "W"],
        cost
      });
    options.push(
      { x: x, y: y - 1, dir: "N", prev: [...prev, "N"], cost },
      { x: x, y: y + 1, dir: "S", prev: [...prev, "S"], cost }
    );
  }

  return options;
}

export function walk({
  board,
  options,
  seen
}: {
  board: number[][];
  options: Option[];
  seen: Map<string, number>;
}) {
  let bestEnding = Infinity;

  let loops = 0;

  do {
    ++loops;
    if (loops % 1000 === 0)
      console.log("loops", loops, "options", options.length);
    const option = options.shift()!;
    const { x, y, dir, prev, cost } = option;
    if (x < 0 || y < 0 || y >= board.length || x >= board[0]!.length) continue;

    const key = `${y},${x},${dir},${JSON.stringify(option.prev.slice(-3))}`;
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

    const newOptions = nextOptions({ x, y, dir, prev, cost: newCost });
    options.push(...newOptions);
  } while (options.length > 0);

  console.log("best", bestEnding);
  return bestEnding;
}

export function partTwo(input: ReturnType<typeof parse>) {
  // const seen = new Map<string, number>();
}

console.log(partOne(parse(input)));
// console.log(partTwo(parse(input)));
