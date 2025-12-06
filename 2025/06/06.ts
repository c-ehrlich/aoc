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
  const lines = input.split("\n");
  const height = lines.length;
  const width = lines[0]!.length;

  let parsedInput: ParsedInput = [];
  let isStart = true;

  for (let col = 0; col < width; col++) {
    let isEmpty = true;
    for (let row = 0; row < height - 1; row++) {
      if (lines[row]![col] !== " ") {
        isEmpty = false;
        break;
      }
    }

    if (isEmpty) {
      isStart = true;
      continue;
    }

    if (isStart) {
      parsedInput.push({ nums: [], op: lines[height - 1]![col] as "+" | "*" });
      isStart = false;
    }

    let num = 0;
    for (let row = 0; row < height - 1; row++) {
      const c = lines[row]![col]!;
      if (c !== " ") num = num * 10 + c.charCodeAt(0) - 48; // faster than casting
    }
    parsedInput[parsedInput.length - 1]!.nums.push(num);
  }

  return parsedInput;
}

function solve(input: ParsedInput) {
  let sum = 0;
  for (const row of input) {
    const res =
      row.op === "+"
        ? row.nums.reduce((a, b) => a + b, 0)
        : row.nums.reduce((a, b) => a * b, 1);
    sum += res;
  }
  return sum;
}

console.time("A");
console.log(solve(parseInputA(input)));
console.timeEnd("A"); // 2ms
console.time("B");
console.log(solve(parseInputB(input)));
console.timeEnd("B"); // 0.5ms
