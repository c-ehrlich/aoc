const { default: input } = await import("./input.txt");

type NodeMap = Map<string, { L: string; R: string }>;

export function parse(input: string) {
  const split = input.split("\n");
  const instructions = split[0]!.split("") as Array<"L" | "R">;
  const nodesRaw = split.slice(2);
  const nodes: NodeMap = new Map();
  for (const node of nodesRaw) {
    const [_, n, L, R] = node.match(/(\w+) = \((\w+), (\w+)\)/)!;
    // @ts-expect-error
    nodes.set(n, { L, R });
  }
  return { instructions, nodes };
}

export function partOne(input: ReturnType<typeof parse>) {
  const { instructions, nodes } = input;
  let pos = "AAA";
  let steps = 0;
  while (true) {
    for (const instruction of instructions) {
      ++steps;
      pos = nodes.get(pos)![instruction];
      if (pos === "ZZZ") return steps;
    }
  }
}

function hasFoundEnd(nodes: string[]) {
  return nodes.every(n => n[2] === "Z");
}

function lowestCommonMultiple(nums: number[]) {
  for (let multiple = 1; ; ++multiple) {
    const toTest = nums[0]! * multiple;
    console.log(toTest);
    if (nums.every(n => toTest % n === 0)) return toTest;
  }
}

export function partTwo(input: ReturnType<typeof parse>) {
  const { instructions, nodes } = input;
  let positions = Array.from(nodes.keys()).filter(n => n[2] == "A");
  let steps = 0;

  const cycles = positions.map(p => {
    let loops = 0;
    while (true) {
      ++loops;
      for (const instruction of instructions) {
        p = nodes.get(p)![instruction];
      }
      if (p[2] === "Z") {
        return loops;
      }
    }
  });

  const hcm = cycles.reduce((a, b) => a * b, 1);
  const totalSteps = hcm * instructions.length;
  return totalSteps;
}

console.time("partOne");
console.log(partOne(parse(input)));
console.timeEnd("partOne");

console.time("partTwo");
console.log(partTwo(parse(input)));
console.timeEnd("partTwo");
