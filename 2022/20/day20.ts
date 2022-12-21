import fs from "fs";

type IndexedArr = {
  num: number;
  idx: number;
}[];

export function parseInput20(file: string) {
  return fs
    .readFileSync(file, "utf8")
    .split("\n")
    .map((num, idx) => ({
      num: parseInt(num),
      idx,
    }));
}

export function shift(input: IndexedArr, times = 1) {
  const arr = [...input];

  for (let i = 0; i < times; i++) {
    mixOnce(input, arr);
    console.log(`after ${i + 1} cycles: ${arr.map((arr) => arr.num)}`);
  }

  return arr;
}

export function mixOnce(input: IndexedArr, arr: IndexedArr) {
  input.forEach((number) => {
    const idx = arr.findIndex((n) => n.idx === number.idx);
    const num = number.num;
    // console.log("---", number.idx, "---");
    let newIdx = shiftCalc(num, idx, arr.length);
    // shift the items
    // console.log("moving ", arr[idx].num, "from", idx, "to", newIdx);
    const shifted = arr.splice(idx, 1);
    arr.splice(newIdx, 0, shifted[0]);
    // console.log(arr.map((arr) => arr.num));
  });
}

// TODO: rebuild this function
function shiftCalc2(num: number, idx: number, arrLength: number) {
  let cyclesPre = num + idx;
  const cycles = Math.floor(cyclesPre / (arrLength - 1));
  let newIdx =
    (idx + num + cycles + 1_000_000_000_000_000 * arrLength) % arrLength;
  // if (newIdx < 0) newIdx = newIdx * -1;
  if (newIdx === 0 && num < 0) {
    newIdx = arrLength - 1;
  } else if (newIdx === arrLength - 1 && num > 0) {
    newIdx = 0;
  }
  // console.log(`num: ${num}, idx: ${idx}, cycles: ${cycles}, newIdx ${newIdx}`);
  return newIdx;
}

export function shiftCalc(num: number, idx: number, arrLength: number) {
  const smallerNum = num % (arrLength - 1);
  let cycle = 0;
  if (smallerNum + idx >= arrLength - 1) {
    cycle = 1;
  }
  if (smallerNum + idx < 0) {
    cycle = -1;
  }
  let newIdx =
    (idx + smallerNum + cycle + 1_000_000_000_000_000 * arrLength) % arrLength;

  return newIdx;
}

// TODO: try this solution https://github.com/jonathanpaulson/AdventOfCode/blob/master/2022/20.py
// just get smallerNum, and pop/push

export function findGroveCoordinates(input: number[]) {
  const zeroIndex = input.indexOf(0);
  const number1 = input[(1000 + zeroIndex) % input.length];
  const number2 = input[(2000 + zeroIndex) % input.length];
  const number3 = input[(3000 + zeroIndex) % input.length];
  console.log(number1, number2, number3);
  return number1 + number2 + number3;
}

export function applyDecryptionKey(input: IndexedArr) {
  return input.map((number) => ({
    ...number,
    num: number.num * 811589153,
  }));
}

export function solve20a(file: string) {
  const arr = parseInput20(file);
  const shifted = shift(arr);
  const groveCoords = findGroveCoordinates(shifted.map((n) => n.num));
  return groveCoords;
}

export function solve20b(file: string) {
  const arr = parseInput20(file);
  const decrypted = applyDecryptionKey(arr);
  const shifted = shift(decrypted, 10);
  const groveCoords = findGroveCoordinates(shifted.map((n) => n.num));
  return groveCoords;
}

console.log(solve20a("20/sample.txt"));
console.log(solve20b("20/input.txt"));
