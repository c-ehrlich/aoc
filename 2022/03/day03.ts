import fs from "fs";

export function arrayOfLinesToSplitRucksacks(file: string) {
  var splitRucksacks = fs
    .readFileSync(file)
    .toString()
    .split("\n")
    .map((rucksack) => {
      const mid = rucksack.length / 2;
      return [rucksack.slice(0, mid), rucksack.slice(mid)];
    });
  return splitRucksacks;
}

const input = arrayOfLinesToSplitRucksacks("03/input.txt");

export function solve03a(rucksacks: string[][]) {
  const duplicates = new Map<string, boolean>();
  rucksacks.forEach((rucksack) => {
    const items = new Map<string, boolean>();
    rucksack[0].split("").forEach((char) => items.set(char, true));
    rucksack[1].split("").forEach((char) => {
      if (items.get(char)) {
        duplicates.set(char, true);
      }
    });
  });
  let sum = 0;
  console.log(Array.from(duplicates.keys()));
  Array.from(duplicates.keys()).forEach((char) => {
    let charCode = char.charCodeAt(0);
    // lowercase is charcode 97-122, value 1-26
    // uppercase is charcode 65-90, value 27-52
    sum += charCode <= 90 ? charCode - 64 + 26 : charCode - 96;
  });
  return sum;
}

console.log(solve03a(input));
