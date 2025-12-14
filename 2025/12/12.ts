import example from "./example.txt";
import input from "./input.txt";

export function parseInput(input: string) {
  const _shapes = input.split("\n\n");
  const _tasks = _shapes.pop();

  const shapes = _shapes.map(s => {
    const lines = s.split("\n");
    lines.shift();
    return lines.map(l => l.split(""));
  });

  const tasks = _tasks!.split("\n").map(t => {
    const [boardRaw, shapesRaw] = t.split(": ");
    const [x, y] = boardRaw!.split("x").map(Number)!;
    const shapes = shapesRaw!.split(" ").map(Number);
    return { size: { x, y }, shapes };
  });

  return { shapes, tasks };
}

export function solveA(input: ReturnType<typeof parseInput>) {
  // dumb solution
  let sum = 0;
  for (const task of input.tasks) {
    const space = task.size.x! * task.size.y!;
    const presents = task.shapes.reduce((acc, curr) => acc + curr, 0);
    if (presents * 9 <= space) {
      ++sum;
    }
  }
  return sum;
}

export function solveB(input: ReturnType<typeof parseInput>) {}

console.log(solveA(parseInput(input)));
