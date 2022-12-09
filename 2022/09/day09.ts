import fs from "fs";

type Coordinate = [number, number];
type VisitedCoordinates = `${number},${number}`[];
type Move = ["U" | "D" | "L" | "R", number];

export class HeadTail {
  private ropeLength: number;
  private rope: Coordinate[];
  private headNew: typeof this.rope[number];
  private visited: VisitedCoordinates;
  public moves = [] as Move[];

  constructor({ file, ropeLength }: { file: string; ropeLength: number }) {
    this.rope = [];
    this.ropeLength = ropeLength;
    for (let i = 0; i <= ropeLength - 1; i++) {
      this.rope.push([0, 0]);
    }
    this.headNew = this.rope[0];
    this.visited = ["0,0"] as VisitedCoordinates;
    this.parseMoves(file);
  }

  private parseMoves(file: string) {
    const moves = fs
      .readFileSync(file, "utf8")
      .split("\n")
      .forEach((move) => {
        const splitMove = move.split(" ");
        this.moves.push([splitMove[0] as Move[0], parseInt(splitMove[1])]);
      });
  }

  public makeMoves(moves: Move[] = this.moves) {
    moves.forEach((move) => {
      for (let i = 0; i < move[1]; i++) {
        this.moveHead(move[0]);
        for (let i = 1; i < this.ropeLength; i++) {
          this.moveKnot(i);
        }
      }
    });
  }

  private moveHead(direction: Move[0]) {
    switch (direction) {
      case "U":
        this.headNew[0]++;
        break;
      case "D":
        this.headNew[0]--;
        break;
      case "L":
        this.headNew[1]--;
        break;
      case "R":
        this.headNew[1]++;
        break;
    }
  }

  private moveKnot(index: number) {
    // don't move if links are adjacent
    if (
      Math.abs(this.rope[index - 1][0] - this.rope[index][0]) <= 1 &&
      Math.abs(this.rope[index - 1][1] - this.rope[index][1]) <= 1
    ) {
      return;
    }

    // if x position isn't the same, move along x
    if (this.rope[index - 1][0] !== this.rope[index][0]) {
      if (this.rope[index - 1][0] > this.rope[index][0]) {
        this.rope[index][0]++;
      } else {
        this.rope[index][0]--;
      }
    }

    // if y position isn't the same, move along y
    if (this.rope[index - 1][1] !== this.rope[index][1]) {
      if (this.rope[index - 1][1] > this.rope[index][1]) {
        this.rope[index][1]++;
      } else {
        this.rope[index][1]--;
      }
    }

    if (index === this.ropeLength - 1) {
      this.pushToVisited(this.rope[index]);
    }
  }

  private pushToVisited(coordinate: Coordinate) {
    const coord =
      `${coordinate[0]},${coordinate[1]}` as VisitedCoordinates[number];
    if (!this.visited.includes(coord)) {
      this.visited.push(coord);
    }
  }

  public getNumberOfVisitedCoordinates() {
    return this.visited.length;
  }
}

export function solve09a(file: string) {
  const headTail = new HeadTail({ file, ropeLength: 2 });
  headTail.makeMoves();
  return headTail.getNumberOfVisitedCoordinates();
}

export function solve09b(file: string) {
  const headTail = new HeadTail({ file, ropeLength: 10 });
  headTail.makeMoves();
  return headTail.getNumberOfVisitedCoordinates();
}

console.log(solve09a("09/input.txt"));
console.log(solve09b("09/input.txt"));
