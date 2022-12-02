import fs from "fs";

enum RPSMove {
  Rock = 0,
  Paper = 1,
  Scissors = 2,
}
export type RpsFormattedInput = [RPSMove, RPSMove][];

export function arrayOfLinesToRpsInput(file: string) {
  var array = fs
    .readFileSync(file)
    .toString()
    .split("\n")
    .map((item) => item.split(" "))
    .map((item) => [item[0].charCodeAt(0) - 65, item[1].charCodeAt(0) - 88]);
  return array;
}

const input = arrayOfLinesToRpsInput("02/input.txt") as RpsFormattedInput;

const moveScores = [1, 2, 3];
const gameScores = [
  // R, P, S (player)
  [3, 6, 0], // opponent rock
  [0, 3, 6], // opponent paper
  [6, 0, 3], // opponent scissors
];

export function solve02a(input: RpsFormattedInput) {
  const totalScore = input
    .map((game) => {
      const [opponent, player] = game;
      return gameScores[opponent][player] + moveScores[player];
    })
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);
  return totalScore;
}

const moveScoresB = [
  // L, D, W (player)
  [3, 1, 2], // opponent rock
  [1, 2, 3], // opponent paper
  [2, 3, 1], // opponent scissors
];
const gameScoresB = [0, 3, 6];

export function solve02b(input: RpsFormattedInput) {
  const totalScore = input
    .map((game) => {
      const [opponent, result] = game;
      return gameScoresB[result] + moveScoresB[opponent][result];
    })
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);
  return totalScore;
}

console.log(solve02a(input));
console.log(solve02b(input));
