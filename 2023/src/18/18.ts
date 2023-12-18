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
    total += calculateRowScore(y, row, positions);
  }
  return total;
}

function calculateRowScore(
  y: number,
  row: Set<number>,
  positions: Map<number, Set<number>>
): number {
  // console.log("row", y);
  let verticalPipes: { pos: number; pipe: VerticalPipe }[] = [];
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
  console.log(JSON.stringify(verticalPipes));

  let acc = 0;
  let start = -Infinity;
  let on = false;
  let lastStart: VerticalPipe | "" = "";
  let lastWasZigZag = false;

  for (let i = 0; i < verticalPipes.length; i++) {
    const p = verticalPipes[i]!;
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
        console.log("end", p.pos, "start", start);
        acc += 1 + p.pos - start;
        start - Infinity;
        lastStart = "";
        lastWasZigZag = false;
        on = false;
        continue;
      }
      if (p.pipe === "L" || p.pipe === "F") {
        continue;
      }
      /**
       * cases
       * - L--7...L--7 => all of it
       * - L--J...L--J => only between each set
       * - L--7...L--J...L--7 => all of it!!!
       */
      if (p.pipe === "7" || p.pipe === "J") {
        if (
          lastStart === "|" ||
          (lastStart === "L" && p.pipe === "J") ||
          (lastStart === "F" && p.pipe === "7")
        ) {
          acc += 1 + p.pos - start;
          start = -Infinity;
          on = false;
          lastStart = "";
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
  console.log("row", [...row], acc);
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

// console.log(partOne(parse(input)));
// console.log(partTwo(parseTwo(input)));
