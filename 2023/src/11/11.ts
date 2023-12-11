const { default: input } = await import("./input.txt");

export function parse(input: string) {
  return input.split("\n").map(row => row.split(""));
}

type Galaxy = { x: number; y: number };

export function partOne(input: ReturnType<typeof parse>) {
  // expand
  for (let y = input.length - 1; y >= 0; y--) {
    if (input[y]!.every(char => char === ".")) {
      input = [...input.slice(0, y), input[y]!, ...input.slice(y)];
    }
  }

  for (let x = input[0]!.length - 1; x >= 0; x--) {
    let columnIsEmpty = true;
    for (let y = 0; y < input.length; y++) {
      if (input[y]![x]! !== ".") {
        columnIsEmpty = false;
        break;
      }
    }
    if (columnIsEmpty) {
      input = input.map(row => [...row.slice(0, x), ".", ...row.slice(x)]);
    }
  }

  // identify x/y of all galaxies
  const galaxies: Galaxy[] = [];
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0]!.length; x++) {
      if (input[y]![x]! !== ".") galaxies.push({ x, y });
    }
  }

  // calculate gaps (its just abs(diff(x))+abs(diff(y)))
  let shortestPathsSum = 0;

  for (let i = 0; i < galaxies.length - 1; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      const path =
        Math.abs(galaxies[i]!.x - galaxies[j]!.x) +
        Math.abs(galaxies[i]!.y - galaxies[j]!.y);

      shortestPathsSum += path;
    }
  }

  return shortestPathsSum;
}

export function partTwo(input: ReturnType<typeof parse>) {
  // identify x/y of all galaxies
  const galaxies: Galaxy[] = [];
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0]!.length; x++) {
      if (input[y]![x]! !== ".") galaxies.push({ x, y });
    }
  }

  // find empty rows and cols
  const emptyRows: number[] = [];
  const emptyCols: number[] = [];

  for (let y = input.length - 1; y >= 0; y--) {
    if (input[y]!.every(char => char === ".")) {
      emptyRows.push(y);
    }
  }

  for (let x = input[0]!.length - 1; x >= 0; x--) {
    let columnIsEmpty = true;
    for (let y = 0; y < input.length; y++) {
      if (input[y]![x]! !== ".") {
        columnIsEmpty = false;
        break;
      }
    }
    if (columnIsEmpty) emptyCols.push(x);
  }

  // calculate gaps (its just abs(diff(x))+abs(diff(y)))
  let shortestPathsSum = 0;

  for (let i = 0; i < galaxies.length - 1; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      const basePath =
        Math.abs(galaxies[i]!.x - galaxies[j]!.x) +
        Math.abs(galaxies[i]!.y - galaxies[j]!.y);

      const smallerX = Math.min(galaxies[i]!.x, galaxies[j]!.x);
      const biggerX = Math.max(galaxies[i]!.x, galaxies[j]!.x);
      const smallerY = Math.min(galaxies[i]!.y, galaxies[j]!.y);
      const biggerY = Math.max(galaxies[i]!.y, galaxies[j]!.y);

      const emptyRowsCrossed = emptyRows.filter(
        r => r > smallerY && r < biggerY
      ).length;
      const emptyColsCrossed = emptyCols.filter(
        c => c > smallerX && c < biggerX
      ).length;

      shortestPathsSum +=
        basePath + 999_999 * (emptyRowsCrossed + emptyColsCrossed);
    }
  }

  return shortestPathsSum;
}

console.time("1");
console.log(partOne(parse(input)));
console.timeEnd("1");
console.time("2");
console.log(partTwo(parse(input)));
console.timeEnd("2");
