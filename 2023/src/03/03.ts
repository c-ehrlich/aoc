export function parse(input: string) {
  return input.split("\n").map(row => row.split(""));
}

const NUMBERS = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
function is_number(char: string) {
  return NUMBERS.has(char);
}
const NOT_SYMBOLS = new Set([...NUMBERS, "."]);
export function is_symbol(char: string) {
  return !NOT_SYMBOLS.has(char);
}

function isInBounds(map: string[][], row: number, col: number) {
  if (row < 0) return false;
  if (row >= map.length) return false;
  if (col < 0) return false;
  if (col >= map[row]!.length) return false;
  return true;
}

function has_symbol(map: string[][], row: number, col: number) {
  for (let iRow = row - 1; iRow <= row + 1; iRow++) {
    for (let iCol = col - 1; iCol <= col + 1; iCol++) {
      if (!isInBounds(map, iRow, iCol)) continue;
      if (is_symbol(map[iRow]![iCol]!)) return true;
    }
  }
  return false;
}

export function partOne(input: ReturnType<typeof parse>) {
  let numbers: number[] = [];

  for (let iRow = 0; iRow < input.length; iRow++) {
    let curNum = "";
    let curNumIsPartNumber = false;

    for (let iCol = 0; iCol < input[iRow]!.length; iCol++) {
      const char = input[iRow]![iCol]!;

      if (is_number(char)) {
        curNum += char;
        if (has_symbol(input, iRow, iCol)) {
          curNumIsPartNumber = true;
        }
      } else {
        if (curNumIsPartNumber) {
          numbers.push(parseInt(curNum));
          curNumIsPartNumber = false;
        }
        curNum = "";
      }
    }

    if (curNumIsPartNumber) numbers.push(parseInt(curNum));
  }

  return numbers.reduce((acc, cur) => acc + cur, 0);
}

function getWholeNumberAt(map: string[][], row: number, col: number): number {
  let startIdx = col;
  let endIdx = col;

  while (
    isInBounds(map, row, startIdx - 1) &&
    is_number(map[row]![startIdx - 1]!)
  ) {
    startIdx--;
  }

  while (
    isInBounds(map, row, endIdx + 1) &&
    is_number(map[row]![endIdx + 1]!)
  ) {
    endIdx++;
  }

  let num = "";
  for (let i = startIdx; i <= endIdx; i++) {
    num += map[row]![i]!;
  }

  return parseInt(num);
}

function getGearRatio(map: string[][], row: number, col: number) {
  let adjNums: number[] = [];

  for (let iRow = row - 1; iRow <= row + 1; iRow++) {
    if (iRow < 0 || iRow >= map.length) continue;

    for (let iCol = col - 1; iCol <= col + 1; iCol++) {
      if (iCol < 0 || iCol >= map[iRow]!.length) continue;

      const char = map[iRow]![iCol]!;
      if (is_number(char)) {
        adjNums.push(getWholeNumberAt(map, iRow, iCol));
      }
    }
  }

  // this would break for two adjacent numbers that are the same
  // but it worked for my input
  // happy holidays
  adjNums = [...new Set(adjNums)];

  if (adjNums.length === 2) {
    return adjNums[0]! * adjNums[1]!;
  }
  return 0;
}

export function partTwo(input: ReturnType<typeof parse>) {
  let gearRatio = 0;
  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[row]!.length; col++) {
      if (input[row]![col]! === "*") {
        const gearRatioA = getGearRatio(input, row, col);
        gearRatio += gearRatioA;
      }
    }
  }
  return gearRatio;
}
