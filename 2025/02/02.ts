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
    for (let num = range.start; num <= range.end; num++) {
      const numStr = num.toString();
      const l = numStr.length;
      const halfL = l / 2;
      if (Number.isInteger(halfL)) {
        const firstHalf = numStr.slice(0, halfL);
        const secondHalf = numStr.slice(halfL);
        if (firstHalf === secondHalf) {
          sum += num;
        }
      }
    }
  }
  return sum;
}

function solveB(ranges: Range[]) {
  let sum = 0;
  for (const range of ranges) {
    for (let num = range.start; num <= range.end; num++) {
      if (numberIsRepeatedDigits(num)) {
        sum += num;
      }
    }
  }
  return sum;
}

function numberIsRepeatedDigits(num: number) {
  const numStr = num.toString();
  const l = numStr.length;
  const halfL = l / 2;
  for (let i = 1; i <= halfL; i++) {
    const segment = numStr.slice(0, i);
    if (numStr.split(segment).every(i => i === "")) {
      return true;
    }
  }
  return false;
}

console.log(solveA(parseInput(input)));
console.log(solveB(parseInput(input)));
