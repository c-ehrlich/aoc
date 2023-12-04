const { default: input } = await import(`./input.txt`);

export function parse(input: string) {
  return input.split("\n").map((row, idx) =>
    row
      .replace(/Card\s+\d+:\s+/, "")
      .trim()
      .split(" | ")
      .map(block =>
        block
          .trim()
          .split(/\s+/)
          .map(num => {
            return parseInt(num);
          })
      )
  );
}

export function partOne(input: ReturnType<typeof parse>) {
  return input.reduce((acc, cur) => {
    const winningNumbers = cur[1]!;
    const numbersYouHave = cur[0]!;

    const wins = numbersYouHave.filter(num => winningNumbers.includes(num));
    let hits = wins.length;

    if (!hits) return acc;

    const score = hits ? 2 ** (hits - 1) : 0;
    return acc + score;
  }, 0);
}

export function partTwo(input: ReturnType<typeof parse>) {
  const tasks = [...Array(input.length).keys()];
  let cards = 0;
  const hitsMap = new Map<number, number>();

  while (tasks.length) {
    const task = tasks.shift()!;
    cards++;

    let hits = -1;
    if (hitsMap.has(task)) {
      hits = hitsMap.get(task)!;
    } else {
      const [win, have] = input[task]!;
      hits = win!.filter(n => have!.includes(n)).length;
      hitsMap.set(task, hits);
    }

    const newTasks = [...Array(hits).keys()].map(k => k + task + 1);
    tasks.push(...newTasks);
  }

  return cards;
}

console.log(partOne(parse(input)));
console.log(partTwo(parse(input)));
