const { default: input } = await import("./input.txt");

export function parse(input: string) {
  return input.split("\n").map(line => {
    const [dir, dist, colorRaw] = line.split(" ");
    return { dir: dir as "U" | "D" | "L" | "R", dist: parseInt(dist!) };
  });
}

type VerticalPipe = "|" | "L" | "7" | "F" | "J";

export function partOne(input: ReturnType<typeof parse>) {
  const positions = new Map<number, Set<number>>();

  let x = 0;
  let y = 0;
  for (const instruction of input) {
    switch (instruction.dir) {
      case "U": {
        for (let i = 0; i < instruction.dist; i++) {
          y++;
          if (!positions.has(y)) positions.set(y, new Set());
          positions.get(y)!.add(x);
        }
        break;
      }

      case "D": {
        for (let i = 0; i < instruction.dist; i++) {
          y--;
          if (!positions.has(y)) positions.set(y, new Set());
          positions.get(y)!.add(x);
        }
        break;
      }

      case "L": {
        const rowL = positions.get(y) ?? new Set<number>();
        for (let i = 0; i < instruction.dist; i++) {
          x--;
          rowL.add(x);
        }
        positions.set(y, rowL);
        break;
      }

      case "R": {
        const rowR = positions.get(y) ?? new Set<number>();
        for (let i = 0; i < instruction.dist; i++) {
          x++;
          rowR.add(x);
        }
        positions.set(y, rowR);
        break;
      }
    }
  }

  let total = 0;
  for (const [y, row] of positions) {
    const verticalPipes = findVerticalPipes(y, row, positions);
    total += calculateRowScore(verticalPipes);
  }
  return total;
}

export type VerticalPipeInfo = { pos: number; pipe: VerticalPipe };
function findVerticalPipes(
  y: number,
  row: Set<number>,
  positions: Map<number, Set<number>>
): VerticalPipeInfo[] {
  let verticalPipes: VerticalPipeInfo[] = [];
  for (const x of [...row].sort()) {
    // L case
    if (row.has(x + 1) && positions.get(y + 1)?.has(x)) {
      verticalPipes.push({ pipe: "L", pos: x });
    }
    // J case
    if (row.has(x - 1) && positions.get(y + 1)?.has(x)) {
      verticalPipes.push({ pipe: "J", pos: x });
    }
    // | case
    if (positions.get(y + 1)?.has(x) && positions.get(y - 1)?.has(x)) {
      verticalPipes.push({ pipe: "|", pos: x });
    }
    // 7 case
    if (row.has(x - 1) && positions.get(y - 1)?.has(x)) {
      verticalPipes.push({ pipe: "7", pos: x });
    }
    // F case
    if (row.has(x + 1) && positions.get(y - 1)?.has(x)) {
      verticalPipes.push({ pipe: "F", pos: x });
    }
  }
  return verticalPipes;
}

export function calculateRowScore(verticalPipes: VerticalPipeInfo[]): number {
  let acc = 0;
  let start = -Infinity;
  let on = false;
  let lastStart: VerticalPipe | "" = "";
  let lastWasZigZag = false;
  let startZigZagWhileOn = false;

  verticalPipes.sort((a, b) => a.pos - b.pos);

  for (let i = 0; i < verticalPipes.length; i++) {
    const p = verticalPipes[i]!;
    // console.log(
    //   "acc",
    //   verticalPipes[i - 1]?.pipe ?? "start",
    //   acc,
    //   on,
    //   startZigZagWhileOn
    // );
    if (on === false) {
      if (p.pipe === "|" || p.pipe === "L" || p.pipe === "F") {
        on = true;
        start = p.pos;
        lastStart = p.pipe;
        continue;
      }
      if (p.pipe === "7" || p.pipe === "J") {
        continue;
      }
    }
    if (on === true) {
      if (p.pipe === "|") {
        acc += 1 + p.pos - start;
        start - Infinity;
        lastStart = "";
        lastWasZigZag = false;
        on = false;
        continue;
      }
      if (p.pipe === "L" || p.pipe === "F") {
        startZigZagWhileOn = true;
        continue;
      }
      /**
       * cases
       * - L--7...L--7 => all of it
       * - L--J...L--J => only between each set
       * - L--7...L--J...L--7 => all of it!!!
       */
      if (p.pipe === "7" || p.pipe === "J") {
        if (startZigZagWhileOn) {
          if (
            (verticalPipes[i - 1]!.pipe === "L" && p.pipe === "J") ||
            (verticalPipes[i - 1]!.pipe === "F" && p.pipe === "7")
          ) {
            // console.log("turning off startZigZagWhileON");
            startZigZagWhileOn = false;
            lastWasZigZag = false;
            continue;
          }
        }
        if (
          lastStart === "|" ||
          (lastStart === "L" && p.pipe === "J") ||
          (lastStart === "F" && p.pipe === "7")
        ) {
          acc += 1 + p.pos - start;
          start = -Infinity;
          on = false;
          lastStart = "";
          startZigZagWhileOn = false;
          continue;
        }
        // the nightmare cases
        if (
          (lastStart === "L" && p.pipe === "7") ||
          (lastStart === "F" && p.pipe === "J")
        ) {
          if (!lastWasZigZag) {
            lastWasZigZag = true;
            continue;
          }
          acc += 1 + p.pos - start;
          start = -Infinity;
          on = false;
          lastStart = "";
          lastWasZigZag = false;
          continue;
        }
      }
    }
  }
  if (verticalPipes.some(p => p.pipe !== "|")) {
    // console.log("end: acc", acc, on);
    // console.log(JSON.stringify(verticalPipes));
    // console.log("acc", acc);
  }
  return acc;
}

export function parseTwo(input: string) {
  return input.split("\n").map(line => {
    const [_, __, color] = line.split(" ");
    const dist = parseInt(color!.slice(2, -2), 16);
    const dirNum = parseInt(color!.slice(-2, -1));
    const dir =
      dirNum === 0 ? "R" : dirNum === 1 ? "D" : dirNum === 2 ? "L" : "U";

    return { dist, dir: dir as "U" | "D" | "L" | "R" };
  });
}

export function partTwo(input: ReturnType<typeof parse>) {}

console.log(partOne(parse(input)));
console.log(partOne(parseTwo(input)));
