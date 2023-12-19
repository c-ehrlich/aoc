const { default: input } = await import("./input.txt");

type Part = {
  x: number;
  m: number;
  a: number;
  s: number;
};

type WorkflowStep = {
  to: string;
  condition?: {
    attribute: keyof Part;
    operation: ">" | "<";
    value: number;
  };
};
type Workflows = Map<string, WorkflowStep[]>;

export function parse(input: string): {
  parts: Array<Part>;
  workflows: Workflows;
} {
  const [workflowsRaw, partsRaw] = input.split("\n\n") as [string, string];
  const wfs: Workflows = new Map();
  workflowsRaw.split("\n").forEach(workflowRaw => {
    const [name, stepsRaw] = workflowRaw.slice(0, -1).split("{") as [
      string,
      string
    ];
    const steps = stepsRaw?.split(",");
    const smallSteps = steps!.map(step => {
      if (!step.includes(":")) {
        return { to: step };
      }
      const [logic, to] = step.split(":") as [string, string];
      const attribute = logic.slice(0, 1) as keyof Part;
      const operation = logic.slice(1, 2) as ">" | "<";
      const value = Number(logic.slice(2));
      return {
        to,
        condition: { attribute, operation, value }
      };
    });
    wfs.set(name, smallSteps);
  });
  const parts = partsRaw.split("\n").map(part => {
    const [x, m, a, s] = part
      .slice(1, -1)
      .split(",")
      .map(attr => attr.slice(2))
      .map(Number);
    return { x: x!, m: m!, a: a!, s: s! };
  });

  return { workflows: wfs, parts };
}

export function partOne(input: ReturnType<typeof parse>) {
  const accepted: Part[] = [];
  const rejected: Part[] = [];

  for (const part of input.parts) {
    let nextWorkflow = "in";
    while (true) {
      if (nextWorkflow === "A") {
        accepted.push(part);
        nextWorkflow = "";
        break;
      }

      if (nextWorkflow === "R") {
        rejected.push(part);
        nextWorkflow = "";
        break;
      }

      const workflow = input.workflows.get(nextWorkflow) as WorkflowStep[];
      for (const step of workflow) {
        if (!step.condition) {
          nextWorkflow = step.to;
          break;
        }

        const { attribute, operation, value } = step.condition;
        if (operation === ">" && part[attribute] > value) {
          nextWorkflow = step.to;
          break;
        }
        if (operation === "<" && part[attribute] < value) {
          nextWorkflow = step.to;
          break;
        }
      }
    }
  }

  const res = accepted.reduce(
    (acc, part) => acc + part.x + part.a + part.m + part.s,
    0
  );

  return res;
}

type Range = { min: number; max: number };
type ProcessRanges = {
  a: Range;
  m: Range;
  s: Range;
  x: Range;
};

function process(
  ranges: ProcessRanges,
  workflowName: string,
  workflows: Workflows,
  accepted: ProcessRanges[]
) {
  if (workflowName === "A") {
    accepted.push(ranges);
    return;
  }

  if (workflowName === "R") {
    return;
  }

  let workflow = workflows.get(workflowName) as WorkflowStep[];
  for (const step of workflow) {
    if (step.condition) {
      let newRanges: ProcessRanges | null = null;
      const { attribute, operation, value } = step.condition;
      if (operation === ">") {
        newRanges = {
          ...ranges,
          [attribute]: { min: value + 1, max: ranges[attribute].max }
        };
        ranges = {
          ...ranges,
          [attribute]: { min: ranges[attribute].min, max: value }
        };
      }
      if (operation === "<") {
        newRanges = {
          ...ranges,
          [attribute]: { min: ranges[attribute].min, max: value - 1 }
        };
        ranges = {
          ...ranges,
          [attribute]: { min: value, max: ranges[attribute].max }
        };
      }

      process(newRanges!, step.to, workflows, accepted);
    } else {
      process(ranges, step.to, workflows, accepted);
    }
  }
}

export function partTwo(input: ReturnType<typeof parse>) {
  const accepted: ProcessRanges[] = [];
  const fullRange: ProcessRanges = {
    a: { min: 1, max: 4000 },
    m: { min: 1, max: 4000 },
    s: { min: 1, max: 4000 },
    x: { min: 1, max: 4000 }
  };

  process(fullRange, "in", input.workflows, accepted);

  const res = accepted.reduce((acc, curr) => {
    const a = curr.a.max - curr.a.min + 1;
    const m = curr.m.max - curr.m.min + 1;
    const s = curr.s.max - curr.s.min + 1;
    const x = curr.x.max - curr.x.min + 1;
    return acc + a * m * s * x;
  }, 0);

  return res;
}

console.time("partOne");
console.log(partOne(parse(input)));
console.timeEnd("partOne");

console.time("partTwo");
console.log(partTwo(parse(input)));
console.timeEnd("partTwo");
