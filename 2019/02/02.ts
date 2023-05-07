import fs from "fs";

function parseIntCodeFromFile(file: string): number[] {
  return fs
    .readFileSync(file, "utf8")
    .split(",")
    .map((n) => parseInt(n));
}

function processIntCode(mem: number[]) {
  let idx = 0;
  while (idx < mem.length) {
    const opcode = mem[idx];
    switch (opcode) {
      case 99:
        // end of program
        return mem;
      case 1:
        // add
        const add_num1idx = mem[idx + 1];
        const add_num2idx = mem[idx + 2];
        const add_sumIdx = mem[idx + 3];
        mem[add_sumIdx] = mem[add_num1idx] + mem[add_num2idx];
        idx += 4;
        break;
      case 2:
        // multiply
        const mult_num1idx = mem[idx + 1];
        const mult_num2idx = mem[idx + 2];
        const mult_sumIdx = mem[idx + 3];
        mem[mult_sumIdx] = mem[mult_num1idx] * mem[mult_num2idx];
        idx += 4;
        break;
      default:
        // invalid opcode
        throw new Error(`Invalid opcode ${opcode} at index ${idx}`);
    }
  }
  return mem;
}

function do1202alarm(code: number[]) {
  code[1] = 12;
  code[2] = 2;
  return processIntCode(code);
}

function findResult(result: number) {
  const code = parseIntCodeFromFile("./input.txt");
  for (let noun = 0; noun <= 99; noun++) {
    for (let verb = 0; verb <= 99; verb++) {
      code[1] = noun;
      code[2] = verb;
      const processed = processIntCode([...code]);
      if (processed[0] === result) {
        return 100 * noun + verb;
      }
    }
  }
  return -1;
}

console.log(do1202alarm(parseIntCodeFromFile("./input.txt")));
console.log(findResult(19690720));
