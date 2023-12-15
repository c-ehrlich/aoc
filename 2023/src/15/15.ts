const { default: input } = await import("./input.txt");

export function parse(input: string) {
  return input.split(",");
}

export function hash(input: string): number {
  let val = 0;
  for (let i = 0; i < input.length; i++) {
    val += input.charCodeAt(i);
    val *= 17;
    val %= 256;
  }
  return val;
}
export function partOne(input: ReturnType<typeof parse>) {
  let res = 0;
  for (let i = 0; i < input.length; i++) {
    res += hash(input[i]!);
  }
  return res;
}

export function partTwo(input: ReturnType<typeof parse>) {
  let map = new Map<number, Array<{ lens: number; code: string }>>();
  for (let i = 0; i < input.length; i++) {
    const [_input, str, op] = input[i]!.match(/^(\w*)(.*)$/) as [
      string,
      string,
      string
    ];
    const box = hash(str);
    let contents = map.get(box) || [];
    const idx = contents.findIndex(({ code }) => code === str);
    if (op === "-") {
      map.set(
        box,
        contents.filter((_, i) => i !== idx)
      );
    } else {
      const lens = parseInt(op.slice(1))!;
      if (idx === -1) {
        contents.push({ lens, code: str });
      } else {
        contents[idx] = { lens, code: str };
      }
      map.set(box, contents);
    }
  }

  let res = 0;

  map.forEach((items, boxMinusOne) => {
    items.forEach(({ lens, code }, slotMinusOne) => {
      res += (boxMinusOne + 1) * (slotMinusOne + 1) * lens;
    });
  });

  return res;
}

console.time("Part One");
console.log(partOne(parse(input)));
console.timeEnd("Part One");

console.time("Part Two");
console.log(partTwo(parse(input)));
console.timeEnd("Part Two");
