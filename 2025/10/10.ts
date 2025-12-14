import example from "./example.txt";
import input from "./input.txt";

type SeenLights = Set<string>;
const serializeLights = (lights: boolean[]) =>
  lights.map(light => (light ? "#" : ".")).join("");

export function parseInput(input: string) {
  const lines = input.split("\n");
  return lines.map(line => {
    const parts = line.split(" ");
    const frontRaw = parts.shift();
    const targetLights = frontRaw!
      .slice(1, -1)
      .split("")
      .map(char => (char === "#" ? true : false));
    const targetJoltages = parts.pop()!.slice(1, -1).split(",").map(Number); // TODO: use for part 2 i guess
    const buttons = parts.map(p => {
      const withoutParens = p.slice(1, -1);
      const nums = withoutParens.split(",").map(Number);
      return nums;
    });
    return { targetLights, buttons, targetJoltages };
  });
}

function pushButton(lights: boolean[], button: number[]) {
  const newLights = [...lights];
  for (const i of button) {
    newLights[i] = !newLights[i];
  }

  return newLights;
}

export function solveA(input: ReturnType<typeof parseInput>) {
  let sum = 0;

  for (const machine of input) {
    const initialLights = new Array(machine.targetLights.length).fill(false);

    const seen: SeenLights = new Set();
    seen.add(serializeLights(initialLights));

    const targetLightsSerialized = serializeLights(machine.targetLights);

    const q = [] as { lights: boolean[]; depth: number }[];

    for (const button of machine.buttons) {
      const newState = pushButton(initialLights, button);

      q.push({ lights: newState, depth: 1 });
    }

    while (q.length) {
      const item = q.shift()!;
      const lightsParsed = serializeLights(item.lights);

      if (seen.has(lightsParsed)) continue;

      if (targetLightsSerialized === lightsParsed) {
        sum += item.depth;
        break;
      }

      seen.add(lightsParsed);

      for (const button of machine.buttons) {
        const newState = pushButton(item.lights, button);
        q.push({ lights: newState, depth: item.depth + 1 });
      }
    }
  }

  return sum;
}

export function pushButtonB({
  joltages,
  button
}: {
  joltages: number[];
  button: number[];
}) {
  const res = [...joltages];
  for (const idx of button) {
    --res[idx]!;
  }
  return res;
}

function serializeNumberArray(arr: number[]) {
  return arr.join(",");
}

export function solveB(input: ReturnType<typeof parseInput>) {
  let sum = 0;
  for (const machine of input) {
    const seenJoltages: Set<string> = new Set();

    const { buttons, targetJoltages } = machine;

    const STARTING_JOLTAGES = targetJoltages; // feels easier to go to 0;

    const q = [] as { joltages: number[]; depth: number }[];

    for (const button of buttons) {
      const joltages = pushButtonB({ joltages: STARTING_JOLTAGES, button });
      q.push({ joltages, depth: 1 });
    }

    while (q.length) {
      const i = q.shift()!;

      const serialized = serializeNumberArray(i.joltages);
      if (seenJoltages.has(serialized)) {
        continue;
      }

      if (i.joltages.some(j => j < 0)) {
        continue;
      }

      if (i.joltages.every(j => j === 0)) {
        sum += i.depth;
        break;
      }

      for (const button of buttons) {
        const joltages = pushButtonB({ joltages: i.joltages, button });
        q.push({ joltages, depth: i.depth + 1 });
      }
    }
  }
  return sum;
}

// console.time("A");
// console.log(solveA(parseInput(input)));
// console.timeEnd("A"); // 32ms
console.time("B");
console.log(solveB(parseInput(input)));
console.timeEnd("B");
