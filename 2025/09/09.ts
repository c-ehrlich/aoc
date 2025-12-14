import example from "./example.txt";
import input from "./input.txt";

type Point = { x: number; y: number };
type Row = number;
type Column = number;

export function parseInput(input: string): Point[] {
  return input.split("\n").map(line => {
    const s = line.split(",");
    return { x: Number(s[0]), y: Number(s[1]) };
  });
}

export function solveA(input: ReturnType<typeof parseInput>) {
  // filter to only points that are top-most or bottom-most for their column, or left-most or right-most for their row
  const leftMost = new Map<Row, Point>();
  const rightMost = new Map<Row, Point>();
  const topMost = new Map<Column, Point>();
  const bottomMost = new Map<Column, Point>();

  for (const point of input) {
    const leftMostForRow = leftMost.get(point.y);
    if (!leftMostForRow || leftMostForRow.x > point.x) {
      leftMost.set(point.y, point);
    }

    const rightMostForRow = rightMost.get(point.y);
    if (!rightMostForRow || rightMostForRow.x < point.x) {
      rightMost.set(point.y, point);
    }

    const topMostForRow = topMost.get(point.x);
    if (!topMostForRow || topMostForRow.y > point.y) {
      topMost.set(point.x, point);
    }

    const bottomMostForRow = bottomMost.get(point.x);
    if (!bottomMostForRow || bottomMostForRow.y < point.y) {
      bottomMost.set(point.x, point);
    }
  }

  const possibleStarts = [
    ...new Set([...topMost.values(), ...leftMost.values()])
  ];
  const possibleEnds = [
    ...new Set([...rightMost.values(), ...bottomMost.values()])
  ];
  // console.log("tktk", { topMost, bottomMost, leftMost, rightMost });
  // console.log({ possibleStarts, possibleEnds });

  let biggest = 0;

  for (const start of possibleStarts) {
    for (const end of possibleEnds) {
      const area =
        Math.abs(end.y - start.y + 1) * Math.abs(end.x - start.x + 1);
      biggest = Math.max(area, biggest);
    }
  }

  return biggest;
}

interface Coordinate {
  x: number;
  y: number;
}

interface Interval {
  x1: number;
  x2: number;
}

type ScanlineIntervals = Map<number, Interval[]>;

function mergeIntervals(intervals: Interval[]): Interval[] {
  if (intervals.length === 0) {
    return [];
  }

  const sorted = [...intervals].sort((a, b) => a.x1 - b.x1);
  const merged: Interval[] = [{ ...sorted[0] }];

  for (let i = 1; i < sorted.length; i++) {
    const interval = sorted[i];
    const last = merged[merged.length - 1];

    if (interval.x1 <= last.x2) {
      last.x2 = Math.max(last.x2, interval.x2);
    } else {
      merged.push({ ...interval });
    }
  }

  return merged;
}

function buildScanlineIntervals(coordinates: Coordinate[]): ScanlineIntervals {
  const allY = [...new Set(coordinates.map(c => c.y))].sort((a, b) => a - b);
  const scanlineIntervals: ScanlineIntervals = new Map();

  // First pass: handle horizontal edges at each y-level
  for (let i = 0; i < coordinates.length; i++) {
    const current = coordinates[i];
    const next = coordinates[(i + 1) % coordinates.length];

    if (current.y === next.y) {
      // Horizontal edge - this is part of the boundary, so we need to check if it's inside
      const y = current.y;
      const x1 = Math.min(current.x, next.x);
      const x2 = Math.max(current.x, next.x);

      // Determine if this edge is on the interior (check perpendicular direction)
      const prev =
        coordinates[(i - 1 + coordinates.length) % coordinates.length];
      const nextNext = coordinates[(i + 2) % coordinates.length];

      // If previous point is below this edge, the interior is below
      // If next-next point is below this edge, the interior is below
      const interiorBelow = prev.y < y || nextNext.y < y;

      if (interiorBelow) {
        // Interior is below this edge, so this y-level might have interior
        if (!scanlineIntervals.has(y)) {
          scanlineIntervals.set(y, []);
        }
      }
    }
  }

  // Second pass: for each y between consecutive polygon y-coordinates
  for (let yIdx = 0; yIdx < allY.length - 1; yIdx++) {
    const y = allY[yIdx];
    const nextY = allY[yIdx + 1];

    // Find crossings at y + 0.5 (midpoint between y and nextY)
    const testY = y + 0.5;
    const crossings: number[] = [];

    for (let i = 0; i < coordinates.length; i++) {
      const current = coordinates[i];
      const next = coordinates[(i + 1) % coordinates.length];

      if (current.y === next.y) continue;

      const minY = Math.min(current.y, next.y);
      const maxY = Math.max(current.y, next.y);

      // Check if vertical edge crosses our test line
      if (minY < testY && testY < maxY) {
        crossings.push(current.x);
      }
    }

    crossings.sort((a, b) => a - b);

    console.log(
      `Between y=${y} and y=${nextY} (testing at ${testY}): crossings =`,
      crossings
    );

    // Pair up crossings
    const intervals: Interval[] = [];
    for (let i = 0; i < crossings.length; i += 2) {
      if (i + 1 < crossings.length) {
        intervals.push({ x1: crossings[i], x2: crossings[i + 1] });
      }
    }

    console.log(`  -> intervals:`, intervals);

    // Store for all integer y-values in this range (inclusive of boundaries)
    for (let yVal = y; yVal <= nextY; yVal++) {
      // Merge with existing intervals at this y-level if any
      if (scanlineIntervals.has(yVal)) {
        const existing = scanlineIntervals.get(yVal)!;
        const combined = [...existing, ...intervals];
        scanlineIntervals.set(yVal, mergeIntervals(combined));
      } else {
        scanlineIntervals.set(
          yVal,
          intervals.map(iv => ({ ...iv }))
        );
      }
    }
  }

  return scanlineIntervals;
}

function rectangleFitsInside(
  scanlineIntervals: ScanlineIntervals,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): boolean {
  if (x1 > x2) [x1, x2] = [x2, x1];
  if (y1 > y2) [y1, y2] = [y2, y1];

  for (let y = y1; y <= y2; y++) {
    if (!scanlineIntervals.has(y)) {
      return false;
    }

    const intervals = scanlineIntervals.get(y)!;

    let contained = false;
    for (const interval of intervals) {
      if (interval.x1 <= x1 && x2 <= interval.x2) {
        contained = true;
        break;
      }
    }

    if (!contained) {
      return false;
    }
  }

  return true;
}

export function solveB(input: ReturnType<typeof parseInput>) {
  console.log(input);
  const scanlineIntervals = buildScanlineIntervals(input);
  console.log(scanlineIntervals);

  let biggest = 0;

  for (const start of input) {
    for (const end of input) {
      const size =
        (Math.abs(end.y - start.y) + 1) * (Math.abs(end.x - start.x) + 1);
      if (size > biggest) {
        if (
          rectangleFitsInside(scanlineIntervals, start.x, start.y, end.x, end.y)
        ) {
          biggest = size;
        }
      }
    }
  }

  return biggest;
}

console.log(solveB(parseInput(input)));
