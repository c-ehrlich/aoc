import fs from "fs";

const snafu = [
  ["=", -2],
  ["-", -1],
  ["0", 0],
  ["1", 1],
  ["2", 2],
];

function addSnafuNumbers(file: string): string {
  const digits = fs
    .readFileSync(file, "utf8")
    .split("\n")
    .map((line) => line.split("").reverse());
  const sum = [] as number[];
  for (let i = 0; i < digits.length; i++) {
    for (let j = 0; j < digits[i].length; j++) {
      const val = snafu.find((s) => s[0] === digits[i][j])![1];
      sum[j] = (sum[j] || 0) + (val as number);
    }
  }
  for (let i = 0; i < sum.length; i++) {
    while (sum[i] < -2) {
      sum[i] += 5;
      sum[i + 1] = (sum[i + 1] || 0) - 1;
    }
    while (sum[i] > 2) {
      sum[i] -= 5;
      sum[i + 1] = (sum[i + 1] || 0) + 1;
    }
  }
  return sum
    .reverse()
    .map((digit) => snafu.find((s) => s[1] === digit)![0])
    .join("");
}

export function solve25a(file: string) {
  return addSnafuNumbers(file);
}

console.time("solve25a");
console.log(solve25a("25/input.txt"));
console.timeEnd("solve25a"); // 2-3ms
