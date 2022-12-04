import fs from "fs";

export function fileLinesToCleaningSections(file: string) {
  const cleaningSections = fs
    .readFileSync(file)
    .toString()
    .split("\n")
    .map((cleaningSection) =>
      cleaningSection.split(",").map((cleaningAssignment) => {
        const [start, end] = cleaningAssignment.split("-");
        return { start: parseInt(start), end: parseInt(end) };
      })
    );
  return cleaningSections;
}

const inputAB = fileLinesToCleaningSections("04/input.txt");

export function solve04a(input: typeof inputAB) {
  return input.reduce(
    (acc, groups) =>
      (groups[0].start >= groups[1].start && groups[0].end <= groups[1].end) ||
      (groups[0].start <= groups[1].start && groups[0].end >= groups[1].end)
        ? acc + 1
        : acc,
    0
  );
}

export function solve04b(input: typeof inputAB) {
  return input.reduce(
    (acc, groups) =>
      groups[0].start > groups[1].end || groups[1].start > groups[0].end
        ? acc
        : acc + 1,
    0
  );
}

console.log(solve04a(inputAB));
console.log(solve04b(inputAB));
