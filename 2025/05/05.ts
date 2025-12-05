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
  const sorted = ranges.toSorted((a, b) => a.start - b.start);

  const mergedRanges: Range[] = [];

  for (const r of sorted) {
    if (mergedRanges.length === 0) {
      mergedRanges.push(r);
      continue;
    }

    const last = mergedRanges[mergedRanges.length - 1]!;
    if (overlaps(r.start, last.start, last.end)) {
      // merge (we know that the last range is the one with the highest end value)
      last.end = Math.max(last.end, r.end);
    } else {
      // push
      mergedRanges.push(r);
    }
  }

  return mergedRanges.reduce((acc, r) => acc + (r.end - r.start + 1), 0);
}

console.time("solveA");
console.log(solveA(parseInput(input)));
console.timeEnd("solveA"); // 2ms
console.time("solveB");
console.log(solveB(parseInput(input)));
console.timeEnd("solveB"); // 0.5ms
