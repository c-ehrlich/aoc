import fs from "fs";

/**
 * This is made way longer than it should be by a bunch of 5 line log statements
 * But I like having them :^)
 */

type Packet = Array<PacketUnit>;
type PacketUnit = Packet | number;

const DIVIDER_PACKETS = [[[2]], [[6]]];

export function parseDistressSignal(file: string) {
  const data = fs
    .readFileSync(file, "utf-8")
    .split("\n")
    .filter((item) => item !== "")
    .map((packet) => JSON.parse(packet) as Packet)
    .concat(DIVIDER_PACKETS as Packet[]);
  return data;
}

export function parseDistressSignalToGroups(file: string) {
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
  } else if (Array.isArray(left) && Array.isArray(right)) {
    // if both are arrays, compare them recursively
    let result = 0;
    while (left.length || right.length) {
      if (!right.length) {
        console.log(
          `${"  ".repeat(
            depth + 1
          )}- Right side ran out of items, so inputs _are not_ in the right order`
        );
        result = -1;
      } else if (!left.length) {
        console.log(
          `${"  ".repeat(
            depth + 1
          )}- Left side ran out of items, so inputs _are_ in the right order`
        );
        result = 1;
      } else {
        const leftItem = left.shift();
        const rightItem = right.shift();
        if ((leftItem || leftItem === 0) && (rightItem || rightItem === 0)) {
          result = compareInputs({
            left: leftItem,
            right: rightItem,
            depth: depth + 1,
          });
        }
      }
      if (result !== 0) {
        return result;
      }
    }
    return result;
  }

  // if one is an array and the other is an int, compare them as arrays
  else if (Array.isArray(left) && typeof right === "number") {
    console.log(
      `${"  ".repeat(
        depth
      )}- Mixed types; convert right to [${right}] and retry comparison`
    );
    return compareInputs({ left, right: [right], depth: depth + 1 });
  } else if (typeof left === "number" && Array.isArray(right)) {
    console.log(
      `${"  ".repeat(
        depth
      )}- Mixed types; convert left to [${left}] and retry comparison`
    );
    return compareInputs({ left: [left], right, depth: depth + 1 });
  }

  throw new Error("Invalid input");
}

function sort(input: Packet[]) {
  return input.sort((a, b) =>
    compareInputs({
      right: JSON.parse(JSON.stringify(a)),
      left: JSON.parse(JSON.stringify(b)),
    })
  );
}

function findDividerPackets(input: Packet[], dividers: Packet[]) {
  const dividerPackets = dividers.map((d) => JSON.stringify(d));
  return input.reduce((acc, cur, idx) => {
    const curString = JSON.stringify(cur);
    return dividerPackets.includes(curString) ? acc * (idx + 1) : acc;
  }, 1);
}

export function solve13a(file: string) {
  const signal = parseDistressSignalToGroups(file);
  const results = [] as number[];
  signal.forEach((item, idx) => {
    console.log(`\n== Pair ${idx + 1} ==`);
    if (enterCompareInput({ left: item.left, right: item.right })) {
      results.push(idx + 1);
    }
  });
  return results.reduce((acc, item) => acc + item, 0);
}

export function solve13b(file: string) {
  const signal = parseDistressSignal(file);
  const sorted = sort(signal);
  return findDividerPackets(sorted, DIVIDER_PACKETS);
}

const a = solve13a("13/input.txt");
const b = solve13b("13/input.txt");
console.log(a, b);
