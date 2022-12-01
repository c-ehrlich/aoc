import { arrayOfLinesDoubleSplit } from "../util/files";

const input = arrayOfLinesDoubleSplit("01/input.txt");

export function solve01a(input: number[][]): number {
  const res = input.map((group) => group.reduce((acc, cur) => acc + cur, 0));
  const highest = res.sort((a, b) => a - b).pop();
  return highest || -1;
}

export function solve01b(input: number[][]): number {
  const ranking = input
    .map((group) => group.reduce((acc, cur) => acc + cur, 0))
    .sort((a, b) => b - a);
  const top3sum = ranking.slice(0, 3).reduce((acc, cur) => acc + cur, 0);
  return top3sum;
}

console.log(solve01a(input));
console.log(solve01b(input));
