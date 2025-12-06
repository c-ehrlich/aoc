import example from "./example.txt";
import input from "./input.txt";

export type ParsedInput = Array<{ nums: Array<number>; op: "+" | "*" }>;
function parseInputA(input: string) {
  const lines = input.split("\n").map(l => l.trim().split(/\s+/));
  const parsed = [] as ParsedInput;
  for (let i = 0; i < lines[0]!.length; i++) {
    for (let j = 0; j < lines.length; j++) {
      if (j === 0) {
        parsed.push({ nums: [parseInt(lines[j]![i]!)], op: "+" });
      } else if (j === lines.length - 1) {
        parsed[i]!.op = lines[j]![i]! as "+" | "*";
      } else {
        parsed[i]!.nums.push(parseInt(lines[j]![i]!));
      }
    }
  }
  return parsed;
}

function parseInputB(input: string) {
  const isEmptyCol = (col: string[]) => col.every(v => v === " ");

  const arr = input.split("\n").map(r => r.split(""));
  const rotated = arr[0]!.map((_, colIdx) =>
    arr.map(row => row[colIdx])
  ) as string[][];

  let parsedInput: ParsedInput = [];
  let isStart = true;
  let symbol: "+" | "*" = "+"; // arbitrary init

  for (let i = 0; i < rotated.length; i++) {
    const col = rotated[i]!;

    if (isStart) {
      symbol = col!.pop() as any;
      parsedInput.push({ nums: [], op: symbol });
      isStart = false;
    }

    if (isEmptyCol(col)) {
      isStart = true;
      continue;
    }

    parsedInput[parsedInput.length - 1]!.nums.push(
      parseInt(col.filter(v => v !== " ").join(""))
    );
  }

  return parsedInput;
}

function solve(input: ParsedInput) {
  let sum = 0;
  for (const row of input) {
    const eq = row.nums.join(row.op);
    const res = eval(eq);
    sum += res;
  }
  return sum;
}

console.time("A");
console.log(solve(parseInputA(input)));
console.timeEnd("A"); // 3ms
console.time("B");
console.log(solve(parseInputB(input)));
console.timeEnd("B"); // 3ms
