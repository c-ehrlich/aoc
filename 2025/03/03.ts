import example from "./example.txt";
import input from "./input.txt";

type Joltages = number[][];
type IndexedNum = { pos: number; val: number };

function parseInput(input: string) {
  const rows = input.split("\n");
  return rows.map(r => r.split("").map(Number));
}

function solveA(joltages: Joltages) {
  let total = 0;
  for (const row of joltages) {
    const biggestInitialNumber: IndexedNum = { pos: 0, val: row[0]! };
    for (let i = 1; i < row.length - 1; i++) {
      if (row[i]! > biggestInitialNumber.val) {
        biggestInitialNumber.val = row[i]!;
        biggestInitialNumber.pos = i;
      }
    }
    const s = biggestInitialNumber.pos;
    const biggestSecondNumber: IndexedNum = { pos: s + 1, val: row[s + 1]! };
    for (let i = s + 2; i < row.length; i++) {
      if (row[i]! > biggestSecondNumber.val) {
        biggestSecondNumber.val = row[i]!;
        biggestSecondNumber.pos = i;
      }
    }

    total += 10 * biggestInitialNumber.val + biggestSecondNumber.val;
  }
  return total;
}

export function findBiggestNumber(
  arr: number[],
  startOffset: number,
  needNumbers: number
) {
  let biggest: IndexedNum = { pos: 0, val: 0 };

  for (let i = startOffset; i <= arr.length - needNumbers; i++) {
    if (arr[i]! > biggest.val) {
      biggest.val = arr[i]!;
      biggest.pos = i;
    }
  }

  return biggest;
}

function solveB(joltages: Joltages) {
  let total = 0;

  for (const row of joltages) {
    let val = 0;

    let startFrom = 0;
    let digitsNeeded = 12;
    while (digitsNeeded > 0) {
      const biggestNumber = findBiggestNumber(row, startFrom, digitsNeeded);
      val += biggestNumber.val * 10 ** (digitsNeeded - 1);

      startFrom = biggestNumber.pos + 1;
      --digitsNeeded;
    }

    total += val;
  }
  return total;
}

console.time("solveA");
console.log(solveA(parseInput(input)));
console.timeEnd("solveA"); // 1.6ms
console.time("solveB");
console.log(solveB(parseInput(input)));
console.timeEnd("solveB"); // 1.1ms
