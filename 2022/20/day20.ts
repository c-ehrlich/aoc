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

    const cycles =
      num > 0
        ? Math.floor((num + idx) / arr.length)
        : num < 0
        ? Math.ceil((num - idx) / arr.length)
        : 0;

    // console.log("---", number.idx, "---");
    // console.log(idx, arr[idx].num, cycles);
    let newIdx =
      (idx + arr[idx].num + cycles + Math.abs(cycles) * arr.length) %
      arr.length;
    if (newIdx === 0 && num < 0) newIdx = arr.length - 1;

    // shift the items
    // console.log("moving ", arr[idx].num, "from", idx, "to", newIdx);
    const shifted = arr.splice(idx, 1);
    arr.splice(newIdx, 0, shifted[0]);
    // console.log(arr.map((arr) => arr.num));
  });
}

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

// console.log(solve20a("20/input.txt"));
console.log(solve20b("20/sample.txt"));
