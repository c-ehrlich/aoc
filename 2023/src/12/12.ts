const { default: input } = await import("./input.txt");

export function parse(input: string) {
  return input.split("\n").map(row => {
    const [rawSprings, rawGroups] = row.split(" ");
    const springs = rawSprings!;
    const groups = rawGroups!.split(",").map(Number);
    return { springs, groups };
  });
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
  board: string,
  isLast?: boolean
): boolean {
  if (start + itemLength > board.length) return false;
  if (start < 0) return false;
  if (board[start - 1] === "#") return false;
  if (board[start + itemLength] === "#") return false;
  for (let i = start; i < start + itemLength; i++) {
    if (board[i] === ".") return false;
  }
  if (isLast) {
    for (let i = start + itemLength + 1; i < board.length; i++) {
      if (board[i] === "#") return false;
    }
  }
  return true;
}

export function countWays(board: string, items: number[]): number {
  const n = board.length;
  const cache: Map<string, number> = new Map();

  function placeItemsFrom(pos: number, itemIndex: number): number {
    if (itemIndex === items.length) {
      return 1;
    }
    if (pos >= n) return 0;

    const key = `${pos}-${itemIndex}`;
    if (cache.has(key)) return cache.get(key)!;

    let possibilities = 0;
    const length = items[itemIndex]!;

    for (let i = pos; i < n; i++) {
      // 🚨 we have to fill all the ###
      if (board[i - 1] === "#") break;

      // 🚨 if it's the last item, we need to make sure there aren't any other # further down
      const isLast = itemIndex + 1 === items.length;
      if (isValidPlacement(i, length, board, isLast)) {
        // Skip an extra space after placing the item
        possibilities += placeItemsFrom(i + length + 1, itemIndex + 1);
      }
    }

    cache.set(key, possibilities);
    return possibilities;
  }

  return placeItemsFrom(0, 0);
}

export function partTwo(input: ReturnType<typeof parse>) {
  const newInput = input.map(i => ({
    springs: new Array(5).fill(i.springs).join("?"),
    groups: [...i.groups, ...i.groups, ...i.groups, ...i.groups, ...i.groups]
  }));

  return partOne(newInput);
}

console.time("partOne");
console.log(partOne(parse(input)));
console.timeEnd("partOne");
console.time("partTwo");
console.log(partTwo(parse(input)));
console.timeEnd("partTwo");
