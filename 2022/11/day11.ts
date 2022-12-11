import fs from "fs";

// 0. unshift an item
// 1. monkey inspects, change worry level based on oparator/operateOn
// 2. i'm relieved - Floor(level/3)
// 3. check condition, throw to ifTrue/ifFalse monkey, push to items

// start with monkey 0
// do all of monkey 0's items, this is a "turn"
// then do monkey 1, 2, etc, this is a "round"

// Part 1:
// go 20 rounds
// track how many items each monkey inspects
// return the sum of inspection counts of the top 2 inspectors

type Monkey = {
  items: number[];
  operator: "+" | "-" | "*" | "/";
  operateOn: number | "old";
  test: number;
  ifTrue: number;
  ifFalse: number;
  itemsInspected: number;
};

export class Monkeys {
  monkeys: Monkey[];
  relax: boolean;
  constructor({ file, relax }: { file: string; relax: boolean }) {
    this.relax = relax;
    this.monkeys = fs
      .readFileSync(file, "utf-8")
      .split("\n\n")
      .map((monkey) => {
        const [_, itemsLine, opLine, testLine, ifTrueLine, ifFalseLine] =
          monkey.split("\n");
        const items = itemsLine
          .trim()
          .split(" ")
          .filter((item) => item.match(/\d+,?/g))
          .map((item) => parseInt(item.replace(",", "")));
        const opSplit = opLine.trim().split(" ");
        const operator = opSplit[opSplit.length - 2] as "+" | "-" | "*" | "/";
        const operateOn =
          opSplit[opSplit.length - 1] === "old"
            ? "old"
            : parseInt(opSplit[opSplit.length - 1]);
        const test = parseInt(testLine.match(/\d+/g)![0]);
        const ifTrue = parseInt(ifTrueLine.match(/\d+/g)![0]);
        const ifFalse = parseInt(ifFalseLine.match(/\d+/g)![0]);
        return {
          items,
          operator,
          operateOn,
          test,
          ifTrue,
          ifFalse,
          itemsInspected: 0,
        };
      });
  }

  public printMonkey(index: number) {
    const monkey = this.monkeys[index];
    return `Monkey ${index}:
  Starting items: ${monkey.items.join(", ")}
  Operation: new = old ${monkey.operator} ${monkey.operateOn}
  Test: divisible by ${monkey.test}
    If true: throw to monkey ${monkey.ifTrue}
    If false: throw to monkey ${monkey.ifFalse}
`;
  }

  public doRounds(rounds: number) {
    for (let i = 0; i < rounds; i++) {
      this.round();
    }
  }

  private round() {
    this.monkeys.forEach((monkey) => this.turn(monkey));
  }

  private turn(monkey: Monkey) {
    while (monkey.items.length) {
      monkey.itemsInspected++;
      const item = monkey.items.shift()!; // bad typescript
      const newItem = this.inspectItem(monkey, item);
      const relieved = this.relief(newItem);
      const test = this.testItem(monkey, relieved);
      const newMonkey = test ? monkey.ifTrue : monkey.ifFalse;
      this.monkeys[newMonkey].items.push(relieved);
    }
  }

  private inspectItem(monkey: Monkey, item: number) {
    const newNumber = monkey.operateOn === "old" ? item : monkey.operateOn;
    switch (monkey.operator) {
      case "+":
        return item + newNumber;
      case "-":
        return item - newNumber;
      case "*":
        return item * newNumber;
      case "/":
        return item / newNumber;
    }
  }

  private relief(item: number) {
    if (this.relax) {
      return Math.floor(item / 3);
    } else {
      return item;
    }
  }

  private testItem(monkey: Monkey, item: number) {
    return item % monkey.test === 0;
  }

  public getMonkeyBusiness() {
    const monkeyBusiness = this.monkeys
      .sort((a, b) => b.itemsInspected - a.itemsInspected)
      .slice(0, 2)
      .reduce((acc, monkey) => acc * monkey.itemsInspected, 1);
    return monkeyBusiness;
  }
}

const monkeys = new Monkeys({ file: "11/input.txt", relax: true });
monkeys.doRounds(10000);
const monkeyBusiness = monkeys.getMonkeyBusiness();
console.log(monkeyBusiness);
