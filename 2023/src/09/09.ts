const { default: input } = await import("./input.txt");

export function parse(input: string) {
  return input.split("\n").map(row => row.split(" ").map(val => Number(val)));
}

function rowIsDone(row: number[]) {
  return row.every(val => val === 0);
}

export function partOne(input: ReturnType<typeof parse>) {
  let result = 0;

  for (let row of input) {
    const diffs = [row];

    while (!rowIsDone(diffs[diffs.length - 1]!)) {
      const r = diffs[diffs.length - 1]!;
      diffs.push([]);
      const next = diffs[diffs.length - 1]!;

      for (let i = 0; i < r!.length - 1; i++) {
        next.push(r[i + 1]! - r[i]!);
      }
    }

    for (let i = diffs.length - 2; i >= 0; i--) {
      diffs[i]!.push(
        diffs[i]![diffs[i]!.length - 1]! +
          diffs[i + 1]![diffs[i + 1]!.length - 1]!
      );
    }

    result += diffs[0]![diffs[0]!.length - 1]!;
  }

  return result;
}

export function partTwo(input: ReturnType<typeof parse>) {
  const reversedInput = input.map(row => row.reverse());

  let result = 0;

  for (let row of reversedInput) {
    const diffs = [row];

    while (!rowIsDone(diffs[diffs.length - 1]!)) {
      const r = diffs[diffs.length - 1]!;
      diffs.push([]);
      const next = diffs[diffs.length - 1]!;

      for (let i = 0; i < r!.length - 1; i++) {
        next.push(r[i]! - r[i + 1]!);
      }
    }

    for (let i = diffs.length - 2; i >= 0; i--) {
      diffs[i]!.push(
        diffs[i]![diffs[i]!.length - 1]! -
          diffs[i + 1]![diffs[i + 1]!.length - 1]!
      );
    }

    result += diffs[0]![diffs[0]!.length - 1]!;
  }

  return result;
}

console.time("Part One");
console.log(partOne(parse(input)));
console.timeEnd("Part One");

console.time("Part Two");
console.log(partTwo(parse(input)));
console.timeEnd("Part Two");
