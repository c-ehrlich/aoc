type Race = {
  time: number;
  distance: number;
};

const { default: input } = await import(`./input.txt`);

export function parseA(input: string) {
  const rows = input
    .split("\n")
    .map(row => row.split(/\s+/))
    .map(row => row.slice(1));

  let races: { time: number; distance: number }[] = [];
  for (let i = 0; i < rows[0]!.length; i++) {
    races[i] = { time: Number(rows[0]![i]), distance: Number(rows[1]![i]) };
  }

  return races;
}

export function partOne(input: ReturnType<typeof parseA>) {
  const waysToBeat = input.map(race => {
    let ways = 0;
    for (let i = 0; i < race.time; i++) {
      if (i * (race.time - i) > race.distance) ways++;
    }
    return ways;
  });

  const res = waysToBeat.reduce((acc, cur) => acc * cur, 1);

  return res;
}

export function parseB(input: string) {
  const rows = input
    .split("\n")
    .map(row => row.replace(/\w+:/, ""))
    .map(row => row.replace(/\s+/g, ""))
    .map(Number);

  console.log(rows);

  return {
    time: rows[0],
    distance: rows[1]
  } as Race;
}

// 54ms
export function partTwo(input: ReturnType<typeof parseB>) {
  let waysToBeat = 0;
  for (let i = 0; i < input.time; i++) {
    if (i * (input.time - i) > input.distance) waysToBeat++;
  }
  return waysToBeat;
}

// 12ms
// could improve by doing two crystal balls to find first and last win
export function fastPartTwo(input: ReturnType<typeof parseB>) {
  let firstWin = -1;
  let lastWin = -1;
  for (let i = 0; i < input.time; i++) {
    if (i * (input.time - i) > input.distance) {
      firstWin = i;
      break;
    }
  }
  for (let i = input.time; i > 0; i--) {
    if (i * (input.time - i) > input.distance) {
      lastWin = i;
      break;
    }
  }
  return lastWin - firstWin + 1;
}

// 0.5ms
export function veryFastPartTwo(input: ReturnType<typeof parseB>) {
  let firstWin = -1;
  let lastWin = -1;

  const increment = Math.floor(Math.sqrt(input.time));

  let start = -1;
  for (let i = 0; i < input.time; i += increment) {
    if (i * (input.time - i) > input.distance) {
      start = i - increment;
      break;
    }
  }
  for (let i = start; i < input.time; i++) {
    if (i * (input.time - i) > input.distance) {
      firstWin = i;
      break;
    }
  }

  let startBack = -1;
  for (let i = input.time; i > 0; i -= increment) {
    if (i * (input.time - i) > input.distance) {
      startBack = i + increment;
      break;
    }
  }
  for (let i = startBack; i > 0; i--) {
    if (i * (input.time - i) > input.distance) {
      lastWin = i;
      break;
    }
  }
  return lastWin - firstWin + 1;
}

console.time("a");
console.log(partOne(parseA(input)));
console.timeEnd("a");

console.time("b");
console.log(partTwo(parseB(input)));
console.timeEnd("b");

console.time("fastB");
console.log(fastPartTwo(parseB(input)));
console.timeEnd("fastB");

console.time("veryFastB");
console.log(veryFastPartTwo(parseB(input)));
console.timeEnd("veryFastB");
