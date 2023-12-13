const { default: input } = await import("./input.txt");

export function parse(input: string) {
  return input.split("\n\n").map(pattern => pattern.split("\n"));
}

export function findVerticalMirroring(pattern: string[]) {
  const offset = 1;

  for (let i = 0; i < pattern.length - offset; i++) {
    let success = false;
    for (let j = 0; j < pattern.length; j++) {
      if (i - j < 0 || i + j + offset >= pattern.length) {
        success = true;
        break;
      }
      if (pattern[i - j] !== pattern[i + j + offset]) {
        break;
      }
    }
    if (success === true) {
      return i + 1;
    }
  }

  return -1;
}

export function findHorizontalMirroring(pattern: string[]) {
  const rotated = rotateClockwise(pattern);
  return findVerticalMirroring(rotated);
}

// makes the "left" point "up"
export function rotateClockwise(matrix: string[]) {
  const split = matrix.map(line => line.split(""));
  return split[0]!
    .map((_col, i) => matrix.map(row => row[i]))
    .map(row => row.join(""));
}

export function partOne(input: ReturnType<typeof parse>) {
  let sum = 0;

  for (let i = 0; i < input.length; i++) {
    const vertical = findVerticalMirroring(input[i]!);
    if (vertical !== -1) {
      sum += 100 * vertical;
      continue;
    }

    const horizontal = findHorizontalMirroring(input[i]!);
    if (horizontal !== -1) {
      sum += horizontal;
      continue;
    }
  }

  return sum;
}

export function findVerticalMirroringWithBug(pattern: string[]) {
  const offsets = [
    1, // even (mirror between rows)
    2 // odd (middor on row)
  ];

  for (const offset of offsets) {
    for (let i = 0; i < pattern.length - offset; i++) {
      let differences = 0;
      for (let j = 0; j < pattern.length; j++) {
        if (i - j < 0 || i + j + offset >= pattern.length) break;
        differences += findDifferences(
          pattern[i - j]!,
          pattern[i + j + offset]!
        );
        if (differences > 1) break;
      }
      if (differences === 1) {
        return i + 1;
      }
    }
  }

  return -1;
}

export function findHorizontalMirroringWithBug(pattern: string[]) {
  const rotated = rotateClockwise(pattern);
  return findVerticalMirroringWithBug(rotated);
}

export function findDifferences(string1: string, string2: string) {
  if (string1.length !== string2.length) {
    return -1;
  }

  let diffs = 0;

  for (let i = 0; i < string1.length; i++) {
    if (string1[i] !== string2[i]) {
      diffs++;
    }
  }

  return diffs;
}

export function partTwo(input: ReturnType<typeof parse>) {
  let sum = 0;

  for (let i = 0; i < input.length; i++) {
    const horizontal = findHorizontalMirroringWithBug(input[i]!);
    if (horizontal !== -1) {
      sum += horizontal;
      continue;
    }

    const vertical = findVerticalMirroringWithBug(input[i]!);
    if (vertical !== -1) {
      sum += 100 * vertical;
      continue;
    }
  }

  return sum;
}

console.time("partOne");
console.log(partOne(parse(input)));
console.timeEnd("partOne");
console.time("partTwo");
console.log(partTwo(parse(input)));
console.timeEnd("partTwo");
