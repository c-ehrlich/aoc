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

export function partTwo(input: ReturnType<typeof parseB>) {
  let waysToBeat = 0;
  for (let i = 0; i < input.time; i++) {
    if (i * (input.time - i) > input.distance) waysToBeat++;
  }
  return waysToBeat;
}

console.log(partOne(parseA(input)));
console.log(partTwo(parseB(input)));
