import example from "./example.txt";
import input from "./input.txt";

function mergeOverlappingSets<T>(listOfSets: Set<T>[]): Set<T>[] {
  // Step 1: union-find setup
  const parent = new Map();

  const find = (x: T) => {
    if (parent.get(x) !== x) parent.set(x, find(parent.get(x)));
    return parent.get(x);
  };

  const union = (a: T, b: T) => {
    a = find(a);
    b = find(b);
    if (a !== b) parent.set(b, a);
  };

  for (const s of listOfSets) {
    for (const v of s) {
      if (!parent.has(v)) parent.set(v, v);
    }
  }

  for (const s of listOfSets) {
    const [first, ...rest] = [...s];
    for (const v of rest) union(first!, v);
  }

  const groups = new Map();
  for (const v of parent.keys()) {
    const root = find(v);
    if (!groups.has(root)) groups.set(root, new Set());
    groups.get(root).add(v);
  }

  return [...groups.values()];
}

type Point = {
  pos: { x: number; y: number; z: number };
  connectedTo: Set<number>;
};

export function parseInput(input: string): Point[] {
  return input.split("\n").map(line => {
    const split = line.split(",");
    return {
      pos: {
        x: parseInt(split[0]!),
        y: parseInt(split[1]!),
        z: parseInt(split[2]!)
      },
      connectedTo: new Set()
    };
  });
}

type Conn = {
  start: number; // idx
  end: number; // idx
  distance: number;
  connected: boolean;
};
[];

export function solveA(
  input: ReturnType<typeof parseInput>,
  variant: "example" | "input"
) {
  const runs = variant === "example" ? 10 : 1000;

  let conns: Conn[] = [];

  for (let i = 0; i < input.length; i++) {
    for (let j = i + 1; j < input.length; j++) {
      const x = Math.abs(input[i]!.pos.x - input[j]!.pos.x);
      const y = Math.abs(input[i]!.pos.y - input[j]!.pos.y);
      const z = Math.abs(input[i]!.pos.z - input[j]!.pos.z);

      const dist = Math.sqrt(x ** 2 + y ** 2 + z ** 2);

      conns.push({ start: i, end: j, connected: false, distance: dist });
    }
  }

  let sortedConns = conns.sort((a, b) => a.distance - b.distance);

  for (let i = 0; i < runs; i++) {
    sortedConns[i]!.connected = true;
  }

  sortedConns = sortedConns.slice(0, runs); // TODO: dont need `connected` anymore

  const circuits: Set<number>[] = [];

  for (let i = 0; i < sortedConns.length; i++) {
    const conn = sortedConns[i]!;
    let isJoining = false;
    circuits.forEach((cc, idx) => {
      if (cc.has(conn.start)) {
        isJoining = true;
        circuits[idx]!.add(conn.end);
      }
      if (cc.has(conn.end)) {
        isJoining = true;
        circuits[idx]!.add(conn.start);
      }
    });

    if (!isJoining) {
      circuits.push(new Set([conn.start, conn.end]));
    }
  }

  const merged = mergeOverlappingSets(circuits).sort((a, b) => b.size - a.size);

  return merged[0]!.size * merged[1]!.size * merged[2]!.size;
}

export function solveB(input: ReturnType<typeof parseInput>) {
  let conns: Conn[] = [];

  for (let i = 0; i < input.length; i++) {
    for (let j = i + 1; j < input.length; j++) {
      const x = Math.abs(input[i]!.pos.x - input[j]!.pos.x);
      const y = Math.abs(input[i]!.pos.y - input[j]!.pos.y);
      const z = Math.abs(input[i]!.pos.z - input[j]!.pos.z);

      const dist = Math.sqrt(x ** 2 + y ** 2 + z ** 2);

      conns.push({ start: i, end: j, connected: false, distance: dist });
    }
  }

  let sortedConns = conns.sort((a, b) => a.distance - b.distance);

  const circuits: Set<number>[] = [];

  for (let i = 0; i < sortedConns.length; i++) {
    const conn = sortedConns[i]!;
    let isJoining = false;
    circuits.forEach((cc, idx) => {
      if (cc.has(conn.start)) {
        isJoining = true;
        circuits[idx]!.add(conn.end);
      }
      if (cc.has(conn.end)) {
        isJoining = true;
        circuits[idx]!.add(conn.start);
      }
    });

    if (!isJoining) {
      circuits.push(new Set([conn.start, conn.end]));
    }

    const merged = mergeOverlappingSets(circuits);
    const setOfAll = merged.findIndex(s => s.size === input.length);
    if (setOfAll !== -1) {
      return input[conn.start]!.pos.x * input[conn.end]!.pos.x;
    }
  }

  return 68;
}

console.time("a");
console.log(solveA(parseInput(input), "input"));
console.timeEnd("a"); // 100ms
console.time("b");
console.log(solveB(parseInput(input)));
console.timeEnd("b"); // 20s, TODO: remember how DSU works
