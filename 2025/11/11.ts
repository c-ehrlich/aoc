import example from "./example.txt";
import input from "./input.txt";

export function parseInput(input: string) {
  return input.split("\n").map(line => line.split(""));
}

export function solveA(input: ReturnType<typeof parseInput>) {}

export function solveB(input: ReturnType<typeof parseInput>) {}
