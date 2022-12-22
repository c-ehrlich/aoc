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
    // console.log(`after ${i + 1} cycles: ${arr.map((arr) => arr.num)}`);
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

function shiftCalc(num: number, idx: number, arrLength: number) {
  const arrMinus1 = arrLength - 1;
  const smallerNum = num % arrMinus1;
  const numPlusIdx = smallerNum + idx;
  if (numPlusIdx >= arrMinus1) {
    return numPlusIdx % arrMinus1;
  }
  if (numPlusIdx < 0) {
    return arrLength + numPlusIdx - 1;
  }

  return numPlusIdx;
}

export function findGroveCoordinates(input: number[]) {
  const zeroIndex = input.indexOf(0);
  const number1 = input[(1000 + zeroIndex) % input.length];
  const number2 = input[(2000 + zeroIndex) % input.length];
  const number3 = input[(3000 + zeroIndex) % input.length];
  // console.log(number1, number2, number3);
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

console.time("solve20a");
console.log(solve20a("20/input.txt"));
console.timeEnd("solve20a"); // 28ms
console.time("solve20b");
console.log(solve20b("20/input.txt"));
console.timeEnd("solve20b"); // 220ms
