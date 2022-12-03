import fs from "fs";

export function arrayOfLinesToSplitRucksacks(file: string) {
  const splitRucksacks = fs
    .readFileSync(file)
    .toString()
    .split("\n")
    .map((rucksack) => {
      const mid = rucksack.length / 2;
      return [rucksack.slice(0, mid), rucksack.slice(mid)];
    });
  return splitRucksacks;
}

export function arrayOfLinesToRucksacks(file: string) {
  const rucksacks = fs.readFileSync(file).toString().split("\n");
  return rucksacks;
}

const inputA = arrayOfLinesToSplitRucksacks("03/input.txt");
const inputB = arrayOfLinesToRucksacks("03/input.txt");

export function solve03a(rucksacks: string[][]) {
  let duplicates = [] as string[];
  rucksacks.forEach((rucksack) => {
    const items = new Map<string, boolean>();
    const rucksackDuplicates = new Map<string, boolean>();
    rucksack[0].split("").forEach((char) => items.set(char, true));
    rucksack[1].split("").forEach((char) => {
      if (items.get(char)) {
        rucksackDuplicates.set(char, true);
      }
    });
    duplicates = duplicates.concat(Array.from(rucksackDuplicates.keys()));
  });
  const sum = duplicates.reduce((acc, cur) => acc + getLetterValue(cur), 0);
  return sum;
}

export function solve03b(rucksacks: string[]) {
  let sum = 0;
  for (let i = 0; i < rucksacks.length; i += 3) {
    const group = rucksacks.slice(i, i + 3);
    const badge = group[0]
      .split("")
      .filter(
        (letter) =>
          group[1].indexOf(letter) !== -1 && group[2].indexOf(letter) !== -1
      )[0];
    sum += getLetterValue(badge);
  }
  return sum;
}

function getLetterValue(char: string) {
  let charCode = char.charCodeAt(0);
  // lowercase is charcode 97-122, value 1-26
  // uppercase is charcode 65-90, value 27-52
  if (charCode <= 90) {
    return charCode - 64 + 26;
  } else {
    return charCode - 96;
  }
}

console.log(solve03a(inputA));
console.log(solve03b(inputB));
