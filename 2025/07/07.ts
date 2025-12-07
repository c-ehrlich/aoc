import example from "./example.txt";
import input from "./input.txt";

type Board = ("S" | "." | "^" | "|")[][];

function parseInput(input: string) {
  return input.split("\n").map(r => r.split("")) as Board;
}

function solveA(board: Board) {
  let splits = 0;
  for (let row = 1; row < board.length; row++) {
    for (let col = 0; col < board[row]!.length; col++) {
      if (board[row - 1]![col] === "S") {
        board[row]![col] = "|";
      }
      if (board[row - 1]![col] === "|") {
        if (board[row]![col] === ".") {
          board[row]![col] = "|";
        } else if (board[row]![col] === "^") {
          ++splits;
          board[row]![col - 1] = "|";
          board[row]![col + 1] = "|";
        }
      }
    }
  }
  return splits;
}

function solveB(board: Board) {
  const possibilities = new Array(board.length).fill(
    new Array(board[0]!.length).fill(null)
  );
  possibilities[possibilities.length - 1] = new Array(board[0]!.length).fill(1);

  for (let row = board.length - 2; row >= 0; row--) {
    for (let col = 0; col < board[0]!.length; col++) {
      const curr = board[row]![col];
      if (curr === ".") {
        possibilities[row][col] = possibilities[row + 1][col];
      } else if (curr === "^") {
        const l = possibilities[row + 1][col - 1];
        const r = possibilities[row + 1][col + 1];
        possibilities[row][col] = l + r;
      } else if (curr === "S") {
        return possibilities[row + 1][col];
      }
    }
  }
}

console.time("A");
console.log(solveA(parseInput(input)));
console.timeEnd("A"); // 0.6ms
console.time("B");
console.log(solveB(parseInput(input)));
console.timeEnd("B"); // 0.6ms
