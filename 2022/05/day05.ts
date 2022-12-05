import fs from "fs";

export function parseCrateFile(file: string) {
  const [rawCrates, rawOrders] = fs
    .readFileSync(file, "utf8")
    .split("\n\n")
    .map((section) => section.split("\n"));

  const countRow = rawCrates[rawCrates.length - 1];
  const cratePileCount = parseInt(countRow.split("")[countRow.length - 2]);
  // TODO: there has to be a better way to initialize the arrays
  let crates = [...Array(cratePileCount)].map((_) => Array(0)) as String[][];
  for (let i = 0; i < cratePileCount; i++) {
    for (let j = rawCrates.length - 2; j >= 0; j--) {
      const crateContents = rawCrates[j][4 * i + 1];
      if (crateContents !== " ") {
        crates[i].push(crateContents);
      }
    }
  }

  const orders = rawOrders.map((order) => {
    const [_, move, from, to] = order.match(
      /move (\d+) from (\d+) to (\d+)/
    ) as string[];
    return { move: parseInt(move), from: parseInt(from), to: parseInt(to) };
  });
  return { crates, orders };
}

const inputA = parseCrateFile("05/input.txt");
const inputB = parseCrateFile("05/input.txt");

export function solve05a(input: typeof inputA) {
  const crates = input.crates;
  input.orders.forEach((order) => {
    const [from, to] = [order.from - 1, order.to - 1];
    for (let i = 0; i < order.move; i++) {
      const crate = crates[from].pop();
      if (crate) {
        crates[to].push(crate);
      }
    }
  });
  return crates.map((crate) => crate.pop()).join("");
}

export function solve05b(input: typeof inputA) {
  const crates = [...input.crates];
  console.log(crates);
  input.orders.forEach((order) => {
    const [from, to] = [order.from - 1, order.to - 1];
    crates[to] = [...crates[to], ...crates[from].slice(-order.move)];
    crates[from] = [...crates[from].slice(0, -order.move)];
  });
  return crates.map((crate) => crate.pop() || "_").join("");
}

console.log(solve05a(inputA));
console.log(solve05b(inputB));
