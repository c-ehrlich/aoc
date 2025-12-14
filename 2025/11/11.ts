import example from "./example.txt";
import exampleB from "./exampleB.txt";
import input from "./input.txt";

type K = string;
type V = Array<string>;
type Graph = Map<K, V>;

export function parseInput(input: string) {
  const lines = input.split("\n");
  const g: Graph = new Map();
  for (const line of lines) {
    const [l, r] = line.split(": ");
    const rr = r!.split(" ");
    g.set(l!, rr);
  }
  return g;
}

export function solveA(input: ReturnType<typeof parseInput>) {
  const g = input;
  const start = g.get("you")!;
  let count = 0;

  function traverse(g: Graph, node: V) {
    for (const path of node) {
      if (path === "out") {
        ++count;
        continue;
      }
      const newNode = g.get(path)!;
      traverse(g, newNode);
    }
  }

  traverse(g, start);

  return count;
}

type PathInfo = {
  //
  fft_dac_out: number;
  fft_out: number;
  dac_out: number;
  out: number;
};
type PathInfoMap = Map<K, PathInfo>;

export function solveB(input: ReturnType<typeof parseInput>) {
  const START_NODE = "svr";
  const DAC_NODE = "dac";
  const FFT_NODE = "fft";
  const OUT_NODE = "out";

  const pathInfos: PathInfoMap = new Map();
  pathInfos.set(OUT_NODE, { fft_dac_out: 0, fft_out: 0, dac_out: 0, out: 1 });

  function addPaths(node: string, infos: PathInfo[]): PathInfo {
    return infos.reduce(
      (acc, curr) => {
        switch (node) {
          case FFT_NODE: {
            acc.fft_dac_out += curr.fft_dac_out;
            acc.fft_dac_out += curr.dac_out;
            acc.fft_out += curr.fft_out;
            acc.fft_out += curr.out;
          }
          case DAC_NODE: {
            acc.fft_dac_out += curr.fft_dac_out;
            acc.fft_dac_out += curr.fft_out;
            acc.dac_out += curr.dac_out;
            acc.dac_out += curr.out;
          }
          default: {
            acc.fft_dac_out += curr.fft_dac_out;
            acc.fft_out += curr.fft_out;
            acc.dac_out += curr.dac_out;
            acc.out += curr.out;
          }
        }
        return acc;
      },
      { fft_dac_out: 0, fft_out: 0, dac_out: 0, out: 0 }
    );
  }

  function traverse(node: string): PathInfo {
    const i = pathInfos.get(node);
    if (i) return i;

    const infos = input.get(node)!.map(traverse);

    const info = addPaths(node, infos);
    pathInfos.set(node, info);

    return info;
  }

  return traverse(START_NODE).fft_dac_out;
}

console.time("A");
console.log(solveA(parseInput(input)));
console.timeEnd("A"); // 0.8ms

console.time("B");
console.log(solveB(parseInput(input)));
console.timeEnd("B"); // 1.1ms
