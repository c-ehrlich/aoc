import fs from "fs";
var nerdamer = require("nerdamer");
require("nerdamer/Solve");

type MonkeyId = string;
type Operation = "+" | "-" | "*" | "/";
type MonkeyAction =
  | { type: "number"; num: number }
  | {
      type: "calc";
      operation: Operation;
      leftChild: MonkeyId;
      rightChild: MonkeyId;
    };
type Monkeys = Map<MonkeyId, MonkeyAction>;

export function parseCalcs(file: string) {
  const monkeys = new Map() as Monkeys;
  fs.readFileSync(file, "utf8")
    .split("\n")
    .forEach((monkey) => {
      const [name, action] = monkey.split(": ");
      const actionSplit = action.split(" ");
      if (actionSplit.length === 1) {
        const num = parseInt(action);
        monkeys.set(name, { type: "number", num });
      } else {
        const [leftChild, operation, rightChild] = actionSplit;
        monkeys.set(name, {
          type: "calc",
          operation: operation as Operation,
          leftChild,
          rightChild,
        });
      }
    });
  return monkeys;
}

function calcFromRoot(monkeys: Monkeys) {
  const root = monkeys.get("root");
  if (!root) throw new Error("no root found");
  const calculation = calc({ action: root, monkeys });
  return calculation;
}

function calc({
  action,
  monkeys,
}: {
  action: MonkeyAction;
  monkeys: Monkeys;
}): number {
  if (action.type === "number") {
    return action.num;
  }
  const leftAction = monkeys.get(action.leftChild);
  const rightAction = monkeys.get(action.rightChild);
  if (!leftAction || !rightAction) {
    throw new Error("no left or right action found");
  }
  const left = calc({
    action: monkeys.get(action.leftChild) as MonkeyAction,
    monkeys,
  });
  const right = calc({
    action: monkeys.get(action.rightChild) as MonkeyAction,
    monkeys,
  });
  switch (action.operation) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      return left / right;
  }
}

function findHumnSide(monkeys: Monkeys): "left" | "right" {
  const root = monkeys.get("root");
  if (!root || root.type !== "calc") throw new Error("no root found");
  const q = [root.rightChild] as string[];
  while (q.length) {
    const id = q.shift();
    if (!id) continue;
    if (id === "humn") return "right";
    const monkey = monkeys.get(id);
    if (monkey && monkey.type === "calc") {
      q.push(monkey.leftChild);
      q.push(monkey.rightChild);
    }
  }
  return "left";
}

function findHumnValue(monkeys: Monkeys): number {
  const humnSide = findHumnSide(monkeys);
  const root = monkeys.get("root");
  if (!root || root.type !== "calc") throw new Error("no root found");
  const humnId = humnSide === "left" ? root.leftChild : root.rightChild;
  const oppositeId = humnSide === "left" ? root.rightChild : root.leftChild;
  const oppositeAction = monkeys.get(oppositeId) as MonkeyAction;
  const oppositeSideValue = calc({ action: oppositeAction, monkeys });

  // build math string
  const mathString = `${oppositeSideValue}=${buildMathString({
    monkeys,
    root: humnId,
  })}`;
  const humnValue = nerdamer.solve(mathString, "x");
  const res = humnValue.text().match(/(\d+)/)[0];
  return Number(res);
}

function buildMathString({
  monkeys,
  root,
}: {
  monkeys: Monkeys;
  root: MonkeyId;
}): string {
  if (root === "humn") return "x";
  const rootAction = monkeys.get(root) as MonkeyAction;
  if (rootAction.type === "number") {
    return rootAction.num.toString();
  }
  const left = buildMathString({ monkeys, root: rootAction.leftChild });
  const right = buildMathString({ monkeys, root: rootAction.rightChild });
  return `(${left}${rootAction.operation}${right})`;
}

export function solve21a(file: string) {
  const monkeys = parseCalcs(file);
  return calcFromRoot(monkeys);
}

export function solve21b(file: string) {
  const monkeys = parseCalcs(file);
  const humnValue = findHumnValue(monkeys);
  return humnValue;
}

console.time("solve21a");
console.log(solve21a("21/input.txt"));
console.timeEnd("solve21a"); // 5ms
console.time("solve21b");
console.log(solve21b("21/input.txt"));
console.timeEnd("solve21b"); // 54ms
