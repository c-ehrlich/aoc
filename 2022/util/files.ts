import fs from "fs";

export function arrayOfLines(file: string) {
  var array = fs
    .readFileSync("01/input.txt")
    .toString()
    .split("\n")
    .map((item) => parseInt(item));
  return array;
}

export function arrayOfLinesDoubleSplit(file: string) {
  var array = fs
    .readFileSync(file)
    .toString()
    .split("\n\n")
    .map((item) => item.split("\n").map((item) => parseInt(item)));
  return array;
}
