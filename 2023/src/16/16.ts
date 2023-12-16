const { default: input } = await import("./input.txt");

type Tile = "." | "/" | "\\" | "-" | "|";
export function parse(input: string) {
  const i = input.split("\n").map(r => r.split("")) as Tile[][];
  return i;
}

type Direction = "up" | "down" | "left" | "right";
type Movement = {
  x: number;
  y: number;
  direction: Direction;
};

export function nextTile(movement: Movement): Movement {
  switch (movement.direction) {
    case "up":
      return { ...movement, y: movement.y - 1 };
    case "down":
      return { ...movement, y: movement.y + 1 };
    case "left":
      return { ...movement, x: movement.x - 1 };
    case "right":
      return { ...movement, x: movement.x + 1 };
  }
}

export function getNextMovements(movement: Movement, tile: Tile) {
  const { x, y, direction } = movement;

  switch (tile) {
    case ".": {
      const next = nextTile({ x, y, direction });
      return [next];
    }
    case "\\": {
      let nextDir: Direction;
      if (direction === "up") nextDir = "left";
      else if (direction === "down") nextDir = "right";
      else if (direction === "left") nextDir = "up";
      /* direction === 'right' */ else nextDir = "down";

      const next = nextTile({ x, y, direction: nextDir });

      return [next];
    }
    case "/": {
      let nextDir: Direction;
      if (direction === "up") nextDir = "right";
      else if (direction === "down") nextDir = "left";
      else if (direction === "left") nextDir = "down";
      /* direction === 'right' */ else nextDir = "up";

      const next = nextTile({ x, y, direction: nextDir });

      return [next];
    }
    case "|": {
      if (direction === "up" || direction === "down") {
        const next = nextTile({ x, y, direction });
        return [next];
      } else {
        const next1 = nextTile({ x, y, direction: "up" });
        const next2 = nextTile({ x, y, direction: "down" });
        return [next1, next2];
      }
    }
    case "-": {
      if (direction === "left" || direction === "right") {
        const next = nextTile({ x, y, direction });
        return [next];
      } else {
        const next1 = nextTile({ x, y, direction: "left" });
        const next2 = nextTile({ x, y, direction: "right" });
        return [next1, next2];
      }
    }
  }
}

function walk({
  x,
  y,
  direction,
  map,
  seen,
  done
}: {
  x: number;
  y: number;
  direction: Direction;
  map: ReturnType<typeof parse>;
  seen: boolean[][];
  done: Set<string>;
}) {
  if (done.has(`${x},${y},${direction}`)) return;
  done.add(`${x},${y},${direction}`);

  if (x < 0 || y < 0 || x >= map[0]!.length || y >= map.length) return;

  seen[y]![x]! = true;
  const tile = map[y]![x]!;

  const nextMovements = getNextMovements({ x, y, direction }, tile);
  for (const next of nextMovements) walk({ ...next, map, seen, done });
}

export function partOne(input: ReturnType<typeof parse>) {
  const seen = new Array(input.length)
    .fill(null)
    .map(_ => new Array(input[0]!.length).fill(false));

  walk({
    x: 0,
    y: 0,
    direction: "right",
    map: input,
    seen,
    done: new Set<string>()
  });

  return getSeenCount(seen);
}

function getSeenCount(seen: string[][]) {
  let seenCount = 0;
  for (let y = 0; y < seen.length; y++) {
    for (let x = 0; x < seen[y]!.length; x++) {
      if (seen[y]![x]!) seenCount++;
    }
  }

  return seenCount;
}

export function partTwo(input: ReturnType<typeof parse>) {
  let highestSeen = 0;
  for (let y = 0; y < input.length; y++) {
    // left edge
    const seen = new Array(input.length)
      .fill(null)
      .map(_ => new Array(input[0]!.length).fill(false));
    walk({
      x: 0,
      y: y,
      direction: "right",
      map: input,
      seen,
      done: new Set<string>()
    });
    highestSeen = Math.max(highestSeen, getSeenCount(seen));
  }

  for (let y = 0; y < input.length; y++) {
    // right edge
    const seen = new Array(input.length)
      .fill(null)
      .map(_ => new Array(input[0]!.length).fill(false));
    walk({
      x: input[0]!.length - 1,
      y: y,
      direction: "left",
      map: input,
      seen,
      done: new Set<string>()
    });
    highestSeen = Math.max(highestSeen, getSeenCount(seen));
  }

  for (let x = 0; x < input.length; x++) {
    // top edge
    const seen = new Array(input.length)
      .fill(null)
      .map(_ => new Array(input[0]!.length).fill(false));
    walk({
      x: x,
      y: 0,
      direction: "down",
      map: input,
      seen,
      done: new Set<string>()
    });
    highestSeen = Math.max(highestSeen, getSeenCount(seen));
  }

  for (let x = 0; x < input.length; x++) {
    // bottom edge
    const seen = new Array(input.length)
      .fill(null)
      .map(_ => new Array(input[0]!.length).fill(false));
    walk({
      x: x,
      y: input.length - 1,
      direction: "up",
      map: input,
      seen,
      done: new Set<string>()
    });
    highestSeen = Math.max(highestSeen, getSeenCount(seen));
  }

  return highestSeen;
}

console.log(partOne(parse(input)));
console.log(partTwo(parse(input)));
