import example from "./example.txt";
import input from "./input.txt";

type Turn = {
  direction: "L" | "R";
  steps: number;
};

function parseInput(input: string): Turn[] {
  const lines = input.split("\n");
  const turns = lines.map(l => {
    let direction = l[0] as "L" | "R";
    let steps = parseInt(l.slice(1));
    return { direction, steps };
  });
  return turns;
}

function solveA(turns: Turn[]) {
  let pos = 50;
  let count = 0;
  for (const turn of turns) {
    if (turn.direction === "L") {
      pos -= turn.steps % 100;
      if (pos < 0) {
        pos += 100;
      }
    } else {
      pos += turn.steps % 100;
      if (pos > 99) {
        pos -= 100;
      }
    }
    if (pos === 0) count++;
  }
  return count;
}

function solveB(turns: Turn[]) {
  let pos = 50;
  let count = 0;
  for (const turn of turns) {
    if (turn.direction === "L") {
      new Array(turn.steps).fill(0).forEach(() => {
        pos--;
        if (pos < 0) {
          pos += 100;
        }
        if (pos === 0) {
          count++;
        }
      });
    } else {
      new Array(turn.steps).fill(0).forEach(() => {
        pos++;
        if (pos > 99) {
          pos -= 100;
        }
        if (pos === 0) {
          count++;
        }
      });
    }
  }
  return count;
}

const parsedExample = parseInput(example);
const solvedExampleA = solveA(parsedExample);
console.log(solvedExampleA);
const solvedExampleB = solveB(parsedExample);
console.log(solvedExampleB);

const parsedInput = parseInput(input);
const solvedInputA = solveA(parsedInput);
console.log(solvedInputA);
const solvedInputB = solveB(parsedInput);
console.log(solvedInputB);

// 6885 too high
