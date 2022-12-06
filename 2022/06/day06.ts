import fs from "fs";

export function fileToCharArray(file: string) {
  return fs.readFileSync(file, "utf8").split("");
}

const inputAB = fileToCharArray("06/input.txt");

function firstSetOfXUniqueCharacters(input: string[], uniqueCharCount: number) {
  for (let i = uniqueCharCount; i <= input.length; i++) {
    const lastN = new Set(input.slice(i - uniqueCharCount, i));
    if (lastN.size === uniqueCharCount) {
      return i;
    }
  }
  return -1;
}

export function solve06a(input: string[]) {
  return firstSetOfXUniqueCharacters(input, 4);
}

export function solve06b(input: string[]) {
  return firstSetOfXUniqueCharacters(input, 14);
}

console.log(solve06a(inputAB));
console.log(solve06b(inputAB));
