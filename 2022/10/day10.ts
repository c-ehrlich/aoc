import fs from "fs";

type Instruction =
  | {
      type: "noop";
    }
  | {
      type: "addx";
      value: number;
    };

const instructionCosts = {
  noop: 1,
  addx: 2,
};

type CycleLog = number[];

export class BabyComputer {
  private instructions: Instruction[];
  private cycleLog: CycleLog;
  private cyclesOnCurrentInstruction: number;
  private xRegister;
  private image: string[];

  constructor({ file }: { file: string }) {
    this.cycleLog = [];
    this.instructions = this.readInstructions(file);
    this.cyclesOnCurrentInstruction = 0;
    this.xRegister = 1;
    this.image = [];
  }

  private readInstructions(file: string) {
    return fs
      .readFileSync(file, "utf8")
      .split("\n")
      .map((line) => {
        const [type, value] = line.split(" ");
        switch (type) {
          case "noop":
            return { type: "noop" };
          case "addx":
            return { type: "addx", value: parseInt(value) };
        }
      }) as Instruction[];
  }

  public getInstructions() {
    return this.instructions;
  }

  public doInstructions() {
    this.instructions.map((instruction) => this.doInstruction(instruction));
  }

  private doInstruction(instruction: Instruction) {
    // push the instruction
    this.cyclesOnCurrentInstruction = instructionCosts[instruction.type];
    // go through cycles and log
    while (this.cyclesOnCurrentInstruction > 0) {
      this.cycleLog.push(this.xRegister);
      this.cyclesOnCurrentInstruction--;
      this.drawImagePixel();
    }
    // cycles complete, perform the instruction
    switch (instruction.type) {
      case "noop":
        break;
      case "addx":
        this.xRegister += instruction.value;
        break;
    }
  }

  private signalStrength(cycle: number) {
    return cycle * this.cycleLog[cycle - 1];
  }

  public getSumOfKeyCycleValues() {
    return [20, 60, 100, 140, 180, 220].reduce((sum, cycle) => {
      return sum + this.signalStrength(cycle);
    }, 0);
  }

  private drawImagePixel() {
    const pixel =
      Math.abs((this.xRegister % 40) - (this.image.length % 40)) <= 1
        ? "#"
        : ".";
    this.image.push(pixel);
  }

  public renderImage() {
    let output = "";
    this.image.forEach((pixel, idx) => {
      if (idx % 40 === 0) {
        output += "\n";
      }
      output += pixel;
    });
    return output;
  }
}

export function solve10a(file: string) {
  const babyComputer = new BabyComputer({ file });
  babyComputer.doInstructions();
  const sampleData = babyComputer.getSumOfKeyCycleValues();
  return sampleData;
}

export function solve10b(file: string) {
  const babyComputer = new BabyComputer({ file });
  babyComputer.doInstructions();
  const image = babyComputer.renderImage();
  return image;
}

console.log(solve10a("10/input.txt"));
console.log(solve10b("10/input.txt"));
