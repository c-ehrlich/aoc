import example from "./example.txt";
import input from "./input.txt";

type Range = {
  start: number;
  end: number;
};

function parseInput(input: string): Range[] {
  const rawRanges = input.split(",");
  const ranges = rawRanges.map(r => {
    const [start, end] = r.split("-").map(Number);
    return { start, end };
  });
  return ranges as Range[];
}

function solveA(ranges: Range[]) {
  let sum = 0;
  for (const range of ranges) {
    for (let halfLen = 1; halfLen <= 8; halfLen++) {
      const multiplier = 10 ** halfLen + 1;
      const minHalf = Math.max(
        10 ** (halfLen - 1),
        Math.ceil(range.start / multiplier)
      );
      const maxHalf = Math.min(
        10 ** halfLen - 1,
        Math.floor(range.end / multiplier)
      );
      if (minHalf <= maxHalf) {
        sum +=
          (((maxHalf - minHalf + 1) * (minHalf + maxHalf)) / 2) * multiplier;
      }
    }
  }
  return sum;
}

function solveB(ranges: Range[]) {
  let sum = 0;
  for (const range of ranges) {
    const maxLen = range.end.toString().length;
    for (let patLen = 1; patLen <= maxLen / 2; patLen++) {
      const patStart = patLen === 1 ? 1 : 10 ** (patLen - 1);
      const patEnd = 10 ** patLen - 1;
      for (let pat = patStart; pat <= patEnd; pat++) {
        let num = pat;
        while (true) {
          num = num * 10 ** patLen + pat;
          if (num > range.end) break;
          if (num >= range.start) {
            sum += num;
          }
        }
      }
    }
  }
  return sum;
}

console.time("A");
console.log(solveA(parseInput(input)));
console.timeEnd("A");
// 0.37ms
console.time("B");
console.log(solveB(parseInput(input)));
console.timeEnd("B");
// 4.87ms
