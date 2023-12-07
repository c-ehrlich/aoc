const { default: input } = await import("./input.txt");

const CARD_VALUES_A = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  "9": 9,
  "8": 8,
  "7": 7,
  "6": 6,
  "5": 5,
  "4": 4,
  "3": 3,
  "2": 2
} as const;
type CARD_VALUE_A = keyof typeof CARD_VALUES_A;

export function parse(input: string) {
  return input.split("\n");
}

function getHandRankA(hand: string): number {
  const handMap = new Map<string, number>();
  for (let i = 0; i < hand.length; i++) {
    const card = hand[i]!;
    const curr = handMap.get(card);
    handMap.set(card, curr ? curr + 1 : 1);
  }
  const amounts = [...handMap.values()].sort((a, b) => b - a);
  if (amounts[0] === 5) return 7;
  if (amounts[0] === 4) return 6;
  if (amounts[0] === 3 && amounts[1] === 2) return 5;
  if (amounts[0] === 3) return 4;
  if (amounts[0] === 2 && amounts[1] === 2) return 3;
  if (amounts[0] === 2) return 2;
  return 1;
}

type HandWithRank = {
  cards: string;
  bid: number;
  rank: number;
};

function sortHandsFnA(a: HandWithRank, b: HandWithRank) {
  if (a.rank > b.rank) return 1;
  if (a.rank < b.rank) return -1;
  for (let i = 0; i < a.cards.length; i++) {
    const aCard = a.cards[i]! as CARD_VALUE_A;
    const bCard = b.cards[i]! as CARD_VALUE_A;
    if (CARD_VALUES_A[aCard]! > CARD_VALUES_A[bCard]) return 1;
    if (CARD_VALUES_A[aCard] < CARD_VALUES_A[bCard]) return -1;
  }
  return 1;
}

export function partOne(input: ReturnType<typeof parse>) {
  const hands = input.map(row => {
    const [cards, bid] = row.split(" ");
    return { cards: cards!, bid: parseInt(bid!), rank: getHandRankA(cards!) };
  });

  // weakest hand at the start
  const sortedHands = hands.sort(sortHandsFnA);

  let total = 0;
  for (let i = 0; i < sortedHands.length; i++) {
    const hand = sortedHands[i]!;
    total += hand.bid * (i + 1);
  }

  return total;
}

/**
 * Part two
 */

const CARD_VALUES_B = {
  A: 14,
  K: 13,
  Q: 12,
  T: 10,
  "9": 9,
  "8": 8,
  "7": 7,
  "6": 6,
  "5": 5,
  "4": 4,
  "3": 3,
  "2": 2,
  J: 1
} as const;
type CARD_VALUE_B = keyof typeof CARD_VALUES_B;

export function getHandRankB(hand: string): number {
  const jokers = hand.split("").filter(c => c === "J").length;
  const handWithoutJokers = hand.replace(/J/g, "");

  const handMap = new Map<string, number>();
  for (let i = 0; i < handWithoutJokers.length; i++) {
    const card = handWithoutJokers[i]!;
    const curr = handMap.get(card);
    handMap.set(card, curr ? curr + 1 : 1);
  }

  const amounts = [...handMap.values()].sort((a, b) => b - a);
  if ((amounts[0] ?? 0) + jokers === 5) return 7;
  if ((amounts[0] ?? 0) + jokers === 4) return 6;
  if ((amounts[0] ?? 0) + jokers === 3 && amounts[1] === 2) return 5;
  if ((amounts[0] ?? 0) + jokers === 3) return 4;
  if (amounts[0] === 2 && amounts[1] === 2) return 3;
  if ((amounts[0] ?? 0) + jokers === 2) return 2;
  return 1;
}

function sortHandsFnB(a: HandWithRank, b: HandWithRank) {
  if (a.rank > b.rank) return 1;
  if (a.rank < b.rank) return -1;
  for (let i = 0; i < a.cards.length; i++) {
    const aCard = a.cards[i]! as CARD_VALUE_B;
    const bCard = b.cards[i]! as CARD_VALUE_B;
    if (CARD_VALUES_B[aCard]! > CARD_VALUES_B[bCard]) return 1;
    if (CARD_VALUES_B[aCard] < CARD_VALUES_B[bCard]) return -1;
  }
  return 1;
}

export function partTwo(input: ReturnType<typeof parse>) {
  const hands = input.map(row => {
    const [cards, bid] = row.split(" ");
    const rank = getHandRankB(cards!);
    return { cards: cards!, bid: parseInt(bid!), rank };
  });

  const sortedHands = hands.sort(sortHandsFnB);

  let total = 0;
  for (let i = 0; i < sortedHands.length; i++) {
    const hand = sortedHands[i]!;
    total += hand.bid * (i + 1);
  }

  return total;
}

console.time("partOne");
console.log(partOne(parse(input)));
console.timeEnd("partOne"); // 5ms

console.time("partTwo");
console.log(partTwo(parse(input)));
console.timeEnd("partTwo"); // 4ms
