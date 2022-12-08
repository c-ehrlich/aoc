import fs from "fs";

type Forest = number[][];
type ForestSearchArgs = {
  forest: Forest;
  x: number;
  y: number;
};

export function inputFileToTreeGrid(file: string): Forest {
  const trees = fs
    .readFileSync(file, "utf8")
    .split("\n")
    .map((row) => row.split("").map((char) => parseInt(char)));
  return trees;
}

const forest = inputFileToTreeGrid("08/input.txt");

export function solve08a(input: Forest) {
  let visibleCount = 0;
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (isTreeVisible({ forest: input, y, x })) {
        visibleCount++;
      }
    }
  }
  return visibleCount;
}

function isTreeVisible({ forest, x, y }: ForestSearchArgs) {
  const treeHeight = forest[y][x];
  let isVisUp = true;
  for (let i = 0; i < y; i++) {
    if (forest[i][x] >= treeHeight) {
      isVisUp = false;
    }
  }
  let isVisDown = true;
  for (let i = y + 1; i < forest.length; i++) {
    if (forest[i][x] >= treeHeight) {
      isVisDown = false;
    }
  }
  let isVisLeft = true;
  for (let i = 0; i < x; i++) {
    if (forest[y][i] >= treeHeight) {
      isVisLeft = false;
    }
  }
  let isVisRight = true;
  for (let i = x + 1; i < forest[0].length; i++) {
    if (forest[y][i] >= treeHeight) {
      isVisRight = false;
    }
  }
  return isVisUp || isVisDown || isVisLeft || isVisRight;
}

export function solve08b(input: Forest) {
  let highestCount = 0;
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      const visibleCount = visibleTreeCount({ forest: input, y, x });
      if (visibleCount > highestCount) {
        highestCount = visibleCount;
      }
    }
  }
  return highestCount;
}

function visibleTreeCount({ forest, x, y }: ForestSearchArgs) {
  let visUp = 0;
  for (let i = y - 1; i >= 0; i--) {
    visUp++;
    if (forest[i][x] >= forest[y][x]) {
      break;
    }
  }
  let visDown = 0;
  for (let i = y + 1; i < forest.length; i++) {
    visDown++;
    if (forest[i][x] >= forest[y][x]) {
      break;
    }
  }
  let visLeft = 0;
  for (let i = x - 1; i >= 0; i--) {
    visLeft++;
    if (forest[y][i] >= forest[y][x]) {
      break;
    }
  }
  let visRight = 0;
  for (let i = x + 1; i < forest[y].length; i++) {
    visRight++;
    if (forest[y][i] >= forest[y][x]) {
      break;
    }
  }
  return visUp * visDown * visLeft * visRight;
}

console.log(solve08a(forest));
console.log(solve08b(forest));
