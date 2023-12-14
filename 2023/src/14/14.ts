const { default: input } = await import("./input.txt");

export function parse(input: string) {
  return input.split("\n").map(r => r.split(""));
}

// mutating in place because it's cheaper, sorry
function moveAllTheWayNorth(input: ReturnType<typeof parse>) {
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y]!.length; x++) {
      if (input[y]![x] !== "O") continue;
      let mv = y;
      while (true) {
        mv -= 1;
        if (mv < 0 || input[mv]![x] !== ".") break;
      }
      if (y !== mv + 1) {
        input[mv + 1]![x] = "O";
        input[y]![x] = ".";
      }
    }
  }
}

function moveAllTheWayEast(input: ReturnType<typeof parse>) {
  for (let x = input[0]!.length - 1; x >= 0; x--) {
    for (let y = 0; y < input.length; y++) {
      if (input[y]![x] !== "O") continue;
      let mv = x;
      while (true) {
        mv += 1;
        if (mv >= input[0]!.length || input[y]![mv] !== ".") break;
      }
      if (x !== mv - 1) {
        input[y]![mv - 1] = "O";
        input[y]![x] = ".";
      }
    }
  }
}

function moveAllTheWaySouth(input: ReturnType<typeof parse>) {
  for (let y = input.length - 1; y >= 0; y--) {
    for (let x = 0; x < input[y]!.length; x++) {
      if (input[y]![x] !== "O") continue;
      let mv = y;
      while (true) {
        mv += 1;
        if (mv >= input.length || input[mv]![x] !== ".") break;
      }
      if (y !== mv - 1) {
        input[mv - 1]![x] = "O";
        input[y]![x] = ".";
      }
    }
  }
}

function moveAllTheWayWest(input: ReturnType<typeof parse>) {
  for (let x = 0; x < input[0]!.length; x++) {
    for (let y = 0; y < input.length; y++) {
      if (input[y]![x] !== "O") continue;
      let mv = x;
      while (true) {
        mv -= 1;
        if (mv < 0 || input[y]![mv] !== ".") break;
      }
      if (x !== mv + 1) {
        input[y]![mv + 1] = "O";
        input[y]![x] = ".";
      }
    }
  }
}

function spinCycle(input: ReturnType<typeof parse>) {
  moveAllTheWayNorth(input);
  moveAllTheWayWest(input);
  moveAllTheWaySouth(input);
  moveAllTheWayEast(input);
}

function calculateTotalLoad(input: ReturnType<typeof parse>) {
  let total = 0;
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y]!.length; x++) {
      if (input[y]![x] === "O") total += input.length - y;
    }
  }
  return total;
}

export function partOne(input: ReturnType<typeof parse>) {
  moveAllTheWayNorth(input);
  return calculateTotalLoad(input);
}

function encode(input: ReturnType<typeof parse>) {
  return input.map(r => r.join("")).join("");
}

export function partTwo(input: ReturnType<typeof parse>) {
  const SPIN_CYCLES = 1000000000;
  const spinCycleMap = new Map<string, number>();
  for (let i = 0; i < SPIN_CYCLES; i++) {
    spinCycle(input);
    const maybeLoopStart = spinCycleMap.get(encode(input));
    if (maybeLoopStart) {
      const loopStart = maybeLoopStart;
      const loopEnd = i;
      const loopLength = loopEnd - loopStart;

      const cyclesToSkip =
        Math.floor((SPIN_CYCLES - loopEnd) / loopLength) * loopLength;

      i += cyclesToSkip;
    } else {
      spinCycleMap.set(encode(input), i);
    }
  }
  return calculateTotalLoad(input);
}

console.time("partOne");
console.log(partOne(parse(input)));
console.timeEnd("partOne");

console.time("partTwo");
console.log(partTwo(parse(input)));
console.timeEnd("partTwo");
