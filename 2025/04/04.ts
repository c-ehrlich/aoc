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
    for (let j = 0; j < input.length; ++j) {
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
  let sum = 0;

  while (true) {
    let round = 0;

    for (let i = 0; i < input.length; ++i) {
      for (let j = 0; j < input.length; ++j) {
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
            input[i]![j] = ".";
            sum += 1;
            round += 1;
          }
        }
      }
    }

    if (round === 0) break;
  }

  return sum;
}

console.time("A");
console.log(solveA(parseInput(input)));
console.timeEnd("A"); // 4ms
console.time("B");
console.log(solveB(parseInput(input)));
console.timeEnd("B"); // 15ms
