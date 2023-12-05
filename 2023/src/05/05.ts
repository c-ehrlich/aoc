type TMap = {
  start: number; // inclusive
  end: number; // inclusive
  add: number;
};

const { default: input } = await import(`./input.txt`);

export function parsePartOne(input: string) {
  const [seedsRaw, ...mapsRaw] = input.split("\n\n");
  const seeds = seedsRaw!.replace("seeds: ", "").split(" ").map(Number);
  const maps = mapsRaw!.map(map =>
    map
      .split("\n")
      .slice(1)
      .map(line => {
        const [destStart, sourceStart, length] = line.split(" ");
        const sourceEnd = Number(sourceStart) + Number(length) - 1;
        const diff = Number(destStart) - Number(sourceStart);
        return {
          start: Number(sourceStart),
          end: sourceEnd,
          add: diff
        } as TMap;
      })
  );
  return {
    seeds,
    maps
  };
}

function getLowestLocationNumber(seeds: number[], maps: TMap[][]) {
  let lowestLocationNumber = Infinity;
  seeds.forEach(seed => {
    for (const map of maps) {
      let mapped = false;
      for (const { start, end, add } of map) {
        if (!mapped) {
          if (seed >= start && seed <= end) {
            seed += add;
            mapped = true;
          }
        }
      }
    }
    lowestLocationNumber = Math.min(lowestLocationNumber, seed);
  });
  return lowestLocationNumber;
}

export function partOne(input: ReturnType<typeof parsePartOne>) {
  const { seeds, maps } = input;
  return getLowestLocationNumber(seeds, maps);
}

type TMap2 = {
  destStart: number; // inclusive
  destEnd: number; // inclusive
  add: number;
};

export function parsePartTwo(input: string) {
  const [seedsRaw, ...mapsRaw] = input.split("\n\n");
  const seeds = seedsRaw!.replace("seeds: ", "").split(" ").map(Number);
  const maps = mapsRaw!.map(map =>
    map
      .split("\n")
      .slice(1)
      .map(line => {
        const [destStart, sourceStart, length] = line.split(" ");
        const diff = Number(destStart) - Number(sourceStart);
        return {
          destStart: Number(destStart),
          destEnd: Number(destStart) + Number(length) - 1,
          add: diff
        } as TMap2;
      })
  );
  return {
    seeds,
    maps
  };
}

function inRange(num: number, start: number, end: number) {
  return num >= start && num <= end;
}

export function partTwo(input: ReturnType<typeof parsePartTwo>): number {
  let currentlyChecking = -1;
  const mapGroups = input.maps.toReversed();
  while (true) {
    ++currentlyChecking;
    let num = currentlyChecking;
    let success = true;
    for (const mapGroup of mapGroups) {
      let mapped = false;

      for (const map of mapGroup) {
        if (!mapped) {
          if (inRange(num, map.destStart, map.destEnd)) {
            num -= map.add;
            mapped = true;
          }
        }
      }

      if (!mapped) success = false;
    }

    if (success) return currentlyChecking;
  }
}
console.log(partOne(parsePartOne(input)));
console.log(partTwo(parsePartTwo(input)));
