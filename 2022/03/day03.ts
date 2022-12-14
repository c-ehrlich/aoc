import fs from "fs";

// Part 1

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

const inputA = arrayOfLinesToSplitRucksacks("03/input.txt");

export function solve03a(rucksacks: string[][]) {
  let duplicates = [] as string[];
  rucksacks.forEach((rucksack) => {
    const [compartmentA, compartmentB] = rucksack;
    const currentRucksackDuplicates = new Map<string, boolean>();
    for (const char of compartmentA) {
      if (compartmentB.includes(char)) {
        currentRucksackDuplicates.set(char, true);
      }
    }
    duplicates = duplicates.concat(
      Array.from(currentRucksackDuplicates.keys())
    );
  });
  const sum = duplicates.reduce((acc, cur) => acc + getLetterValue(cur), 0);
  return sum;
}

// Part 2

export function arrayOfLinesToRucksacks(file: string) {
  const rucksacks = fs.readFileSync(file).toString().split("\n");
  return rucksacks;
}

const inputB = arrayOfLinesToRucksacks("03/input.txt");

export function solve03b(rucksacks: string[]) {
  let sum = 0;
  for (let i = 0; i < rucksacks.length; i += 3) {
    const group = rucksacks.slice(i, i + 3);
    const badge = group[0]
      .split("")
      .filter(
        (letter) => group[1].includes(letter) && group[2].includes(letter)
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
