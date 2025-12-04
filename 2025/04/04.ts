import example from "./example.txt";
import input from "./input.txt";

type Field = "." | "@";

const parseInput = (input: string) => {
  return input.split("\n").map(row => row.split("")) as Field[][];
};

const positions = [-1, 0, 1];

function solveA(input: Field[][]) {
  let sum = 0;
  for (let i = 0; i < input.length; ++i) {
    for (let j = 0; j < input[i]!.length; ++j) {
      if (input[i]![j] == "@") {
        let count = 0;
        for (const posX of positions) {
          for (const posY of positions) {
            if (posX === 0 && posY === 0) continue;

            const val = input[i + posX]?.[j + posY];
            if (val === "@") {
              ++count;
            }
          }
        }
        if (count < 4) {
          sum += 1;
        }
      }
    }
  }

  return sum;
}

function solveB(input: Field[][]) {
  const rows = input.length;
  const cols = input[0]!.length;

  const queue: [number, number][] = [];
  // should probably be maps
  const inQueue: boolean[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(false)
  );
  const neighborCounts: number[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(0)
  );

  for (let i = 0; i < rows; ++i) {
    for (let j = 0; j < cols; ++j) {
      if (input[i]![j] === "@") {
        let count = 0;
        for (const posX of positions) {
          for (const posY of positions) {
            if (posX === 0 && posY === 0) continue;
            if (input[i + posX]?.[j + posY] === "@") ++count;
          }
        }
        neighborCounts[i]![j] = count;
        if (count < 4) {
          queue.push([i, j]);
          inQueue[i]![j] = true;
        }
      }
    }
  }

  let sum = 0;
  while (queue.length > 0) {
    const [i, j] = queue.shift()!;
    inQueue[i]![j] = false;

    if (input[i]![j] !== "@") continue;
    if (neighborCounts[i]![j]! >= 4) continue;

    input[i]![j] = ".";
    sum += 1;

    for (const posX of positions) {
      for (const posY of positions) {
        if (posX === 0 && posY === 0) continue;
        const ni = i + posX;
        const nj = j + posY;
        if (ni < 0 || ni >= rows || nj < 0 || nj >= cols) continue;
        if (input[ni]![nj] !== "@") continue;

        neighborCounts[ni]![nj]!--;
        if (neighborCounts[ni]![nj]! < 4 && !inQueue[ni]![nj]) {
          queue.push([ni, nj]);
          inQueue[ni]![nj] = true;
        }
      }
    }
  }

  return sum;
}

console.time("A");
console.log(solveA(parseInput(input)));
console.timeEnd("A"); // 4ms
console.time("B");
console.log(solveB(parseInput(input)));
console.timeEnd("B"); // 8ms
