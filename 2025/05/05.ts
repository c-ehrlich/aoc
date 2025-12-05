import example from "./example.txt";
import input from "./input.txt";

type Range = { start: number; end: number };
type Ingredient = number;

function parseInput(input: string): {
  ranges: Range[];
  ingredients: Ingredient[];
} {
  const [_r, _i] = input.split("\n\n") as [string, string];
  const ranges = _r.split("\n").map(r => {
    const [start, end] = r.split("-").map(Number);
    return { start, end };
  }) as Range[];
  const ingredients = _i.split("\n").map(Number);
  return { ranges, ingredients };
}

function solveA(input: { ranges: Range[]; ingredients: Ingredient[] }): number {
  const { ranges, ingredients } = input;

  let count = 0;

  for (const ingredient of ingredients) {
    if (ranges.some(r => ingredient >= r.start && ingredient <= r.end)) {
      count++;
    }
  }
  return count;
}

function overlaps(val: number, start: number, end: number) {
  return val >= start && val <= end;
}

export function solveB(input: {
  ranges: Range[];
  ingredients: Ingredient[];
}): number {
  const { ranges } = input;
  const clearedRanges: Range[] = [];
  for (const range of ranges) {
    for (const clearedRange of clearedRanges) {
      if (overlaps(range.start, clearedRange.start, clearedRange.end)) {
        range.start = clearedRange.end + 1;
        if (range.start > range.end) {
          continue;
        }
      }

      if (overlaps(range.end, clearedRange.start, clearedRange.end)) {
        range.end = clearedRange.start - 1;
        if (range.start > range.end) {
          continue;
        }
      }

      if (overlaps(clearedRange.start, range.start, range.end)) {
        clearedRange.start = range.end + 1;
      }

      if (overlaps(clearedRange.end, range.start, range.end)) {
        clearedRange.end = range.start - 1;
      }
    }
    if (range.start > range.end) {
      continue;
    }
    clearedRanges.push(range);
  }

  return clearedRanges.reduce((acc, r) => {
    if (r.start > r.end) {
      return acc;
    }
    return acc + r.end - r.start + 1;
  }, 0);
}

console.time("solveA");
console.log(solveA(parseInput(input)));
console.timeEnd("solveA"); // 2ms
console.time("solveB");
console.log(solveB(parseInput(input)));
console.timeEnd("solveB"); // 1.5ms
