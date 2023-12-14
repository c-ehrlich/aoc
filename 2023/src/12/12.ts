const { default: input } = await import("./input.txt");

export function parse(input: string) {
  return input.split("\n").map(row => {
    const [rawSprings, rawGroups] = row.split(" ");
    const springs = rawSprings!;
    const groups = rawGroups!.split(",").map(Number);
    return { springs, groups };
  });
}

export function isLegalPosition(
  springs: string,
  groups: number[],
  positions: number[]
) {
  for (let i = 0; i < positions.length; i++) {
    // it should not cover any '.'
    if (springs.slice(positions[i], positions[i]! + groups[i]!).includes("."))
      return false;
  }

  // every '#' should be covered by a pipe
  const springsIdx: number[] = [];
  for (let i = 0; i < springs.length; i++) {
    if (springs[i] === "#") {
      springsIdx.push(i);
    }
  }

  for (let i = 0; i < springsIdx.length; i++) {
    const idx = springsIdx[i]!;
    let found = false;
    for (let i = 0; i < positions.length; i++) {
      if (idx >= positions[i]! && idx <= positions[i]! + groups[i]! - 1) {
        found = true;
      }
    }
    if (!found) return false;
  }

  return true;
}

type Path = number[]; // start position

export function findOrderedPlacements(
  springs: string,
  groups: number[]
  // boardLength: number
): number {
  const springsLength = springs.length;
  let result = 0;

  function backtrack(start: number, itemIdx: number, path: Path) {
    // If all items have been placed, add the path to the results
    if (itemIdx >= groups.length) {
      // path
      if (isLegalPosition(springs, groups, path)) {
        ++result;
      }
      return;
    }

    for (let position = start; position < springsLength; position++) {
      let itemLength = groups[itemIdx]!;
      if (position + itemLength <= springsLength) {
        // Place the item and make a recursive call for the next item
        path.push(position);
        backtrack(position + itemLength + 1, itemIdx + 1, path);
        // Backtrack: Remove the last item placed
        path.pop();
      }
    }
  }

  backtrack(0, 0, []);
  return result;
}

export function partOne(input: ReturnType<typeof parse>) {
  let result = 0;

  for (const row of input) {
    const possiblePlacements = countWays(row.springs, row.groups);
    result += possiblePlacements;
  }

  return result;
}

export function isValidPlacement(
  start: number,
  itemLength: number,
  board: string
): boolean {
  if (start + itemLength > board.length) return false;
  if (board[start - 1] === "#") return false;
  if (board[start + itemLength] === "#") return false;
  for (let i = start; i < start + itemLength; i++) {
    if (board[i] === ".") return false;
  }
  return true;
}

export function countWays(board: string, items: number[]): number {
  const n = board.length;
  const cache: Map<string, number> = new Map();

  function dp(pos: number, itemIndex: number): number {
    if (itemIndex === items.length) return 1;
    if (pos >= n) return 0;

    const key = `${pos}-${itemIndex}`;
    // if (cache.has(key)) return cache.get(key)!;

    let ways = 0;
    const length = items[itemIndex]!;

    for (let i = pos; i < n; i++) {
      if (isValidPlacement(i, length, board)) {
        // Skip an extra space after placing the item
        ways += dp(i + length + 1, itemIndex + 1);
      }
    }

    console.log(key, ways);
    cache.set(key, ways);
    return ways;
  }

  return dp(0, 0);
}

// Example usage
// const board = ".??..??...?##.";
// const items = [1, 1, 3];
// console.log(countWays(board, items)); // Output: 4

export function partTwo(input: ReturnType<typeof parse>) {
  const newInput = input.map(i => ({
    springs: new Array(5).fill(i.springs).join("?"),
    groups: [...i.groups, ...i.groups, ...i.groups, ...i.groups, ...i.groups]
  }));

  return partOne(newInput);
}

// console.log(partOne(parse(input)));
// console.log(partTwo(parse(input)));
