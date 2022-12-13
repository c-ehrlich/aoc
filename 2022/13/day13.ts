import fs from "fs";

const inputA = [0];
const inputB = [0];

type Packet = Array<PacketUnit>;
type PacketUnit = Packet | number;

export function parseDistressSignal(file: string) {
  const data = fs
    .readFileSync(file, "utf-8")
    .split("\n\n")
    .map((packetPair) => {
      const [left, right] = packetPair
        .split("\n")
        .map((packet) => JSON.parse(packet) as Packet);
      return { left, right };
    });
  return data;
}

function enterCompareInput({
  left,
  right,
}: {
  left: PacketUnit;
  right: PacketUnit;
}) {
  const result = compareInputs({ left, right });
  return result >= 0;
}

function compareInputs({
  left,
  right,
  depth = 0,
}: {
  left: PacketUnit;
  right: PacketUnit;
  depth?: number;
}): number {
  console.log(
    `${"  ".repeat(depth)}- Compare ${JSON.stringify(left)} vs ${JSON.stringify(
      right
    )}`
  );
  // if both are ints, left should be lower than right
  // if they're equal, continue
  if (typeof left === "number" && typeof right === "number") {
    const res = right - left;
    if (res < 0) {
      console.log(
        `${"  ".repeat(
          depth
        )}- Right side is smaller, so inputs _are not_ in the right order`
      );
    }
    if (res > 0) {
      console.log(
        `${"  ".repeat(
          depth
        )}- Left side is smaller, so inputs _are_ in the right order`
      );
    }
    return right - left;
  }

  // if both are arrays, compare them recursively
  if (Array.isArray(left) && Array.isArray(right)) {
    let result = 0;
    while (left.length || right.length) {
      const leftItem = left.shift();
      const rightItem = right.shift();
      if ((leftItem || leftItem === 0) && (rightItem || rightItem === 0)) {
        result = compareInputs({
          left: leftItem,
          right: rightItem,
          depth: depth + 1,
        });
      } else if (leftItem && !rightItem) {
        console.log(
          `${"  ".repeat(
            depth + 1
          )}- Right side ran out of items, so inputs _are not_ in the right order`
        );
        result = -1;
      } else if (!leftItem && rightItem) {
        console.log(
          `${"  ".repeat(
            depth + 1
          )}- Left side ran out of items, so inputs _are_ in the right order`
        );
        result = 1;
      }
      if (result !== 0) {
        return result;
      }
    }
    return result;
  }

  // if one is an array and the other is an int, compare them as arrays
  if (Array.isArray(left) && typeof right === "number") {
    console.log(
      `${"  ".repeat(
        depth
      )}- Mixed types; convert right to [${right}] and retry comparison`
    );
    return compareInputs({ left, right: [right], depth: depth + 1 });
  }
  if (typeof left === "number" && Array.isArray(right)) {
    console.log(
      `${"  ".repeat(
        depth
      )}- Mixed types; comvert left to [${left}] and retry comparison`
    );
    return compareInputs({ left: [left], right, depth: depth + 1 });
  }

  throw new Error("Invalid input");
}

export function solve13a(file: string) {
  const signal = parseDistressSignal(file);
  const results = [] as number[];
  signal.forEach((item, idx) => {
    if (idx < 30) {
      console.log(`\n== Pair ${idx + 1} ==`);
      if (enterCompareInput({ left: item.left, right: item.right })) {
        results.push(idx + 1);
      }
    }
  });
  console.log("result", results);
  const result = results.reduce((acc, item) => acc + item, 0);
  return result;
}

export function solve13b(file: string) {
  const signal = parseDistressSignal(file);
  return -1;
}

console.log(solve13a("13/input2.txt"));
