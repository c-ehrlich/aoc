import fs from "fs";

type Wind = "<" | ">";
type ChamberRow = ("." | "#")[];
export type Chamber = ChamberRow[];
const pieceWide = [["#", "#", "#", "#"]] as const;
type PieceWide = typeof pieceWide;
const pieceTall = [["#"], ["#"], ["#"], ["#"]] as const;
type PieceTall = typeof pieceTall;
const pieceCross = [
  [".", "#", "."],
  ["#", "#", "#"],
  [".", "#", "."],
] as const;
type PieceCross = typeof pieceCross;
const pieceSquare = [
  ["#", "#"],
  ["#", "#"],
] as const;
type PieceSquare = typeof pieceSquare;
const pieceL = [
  ["#", "#", "#"],
  [".", ".", "#"],
  [".", ".", "#"],
] as const; // bottom is index 0
type PieceL = typeof pieceL;
const pieceRotation = [
  pieceWide,
  pieceCross,
  pieceL,
  pieceTall,
  pieceSquare,
] as const;
export type Piece = typeof pieceRotation[number];
export type Offset = [number, number];

export class RocksFalling {
  PIECES_TO_DROP = 2022;
  wind: Wind[];
  mod: number;
  chamber: Chamber;

  constructor(file: string) {
    this.wind = fs.readFileSync(file, "utf8").split("") as Wind[];
    this.mod = this.wind.length;
    this.chamber = [
      ["#", "#", "#", "#", "#", "#", "#"],
      ...new Array(4 * this.PIECES_TO_DROP)
        .fill(0)
        .map(() => [".", ".", ".", ".", ".", ".", "."] as ChamberRow),
    ];
  }

  private findHighestRowWithPiece(): number {
    for (let i = this.chamber.length - 1; i >= 0; i--) {
      if (this.chamber[i].includes("#")) {
        return i;
      }
    }
    return -1; // will never reach because the bottom is
  }

  public dropPieces() {
    let move = 0;
    for (let i = 0; i < this.PIECES_TO_DROP; i++) {
      if (i < 10) {
        console.log(
          this.chamber
            .slice(0, 20)
            .reverse()
            .map((row) => row.join(""))
        );
      }
      const piece = pieceRotation[i % 5];
      const bottomLine = this.findHighestRowWithPiece();
      const offset: Offset = [bottomLine + 4, 2];
      let pieceIsLocked = false;

      while (!pieceIsLocked) {
        const windDir = this.wind[move % this.mod];
        move++;

        // try to move the piece sideways
        if (
          windDir === "<" &&
          this.canGoThere({
            chamber: this.chamber,
            piece,
            offset: [offset[0], offset[1] - 1],
          })
        ) {
          offset[1]--;
        } else if (
          windDir === ">" &&
          this.canGoThere({
            chamber: this.chamber,
            piece,
            offset: [offset[0], offset[1] + 1],
          })
        ) {
          offset[1]++;
        }

        // try to move the piece down
        if (
          this.canGoThere({
            chamber: this.chamber,
            piece,
            offset: [offset[0] - 1, offset[1]],
          })
        ) {
          offset[0]--;
        } else {
          pieceIsLocked = true;
          // write the piece to the chamber
          for (let y = 0; y < piece.length; y++) {
            for (let x = 0; x < piece[y].length; x++) {
              if (piece[y][x] === "#") {
                this.chamber[offset[0] + y][offset[1] + x] = "#";
              }
            }
          }
        }
      }
    }
    return this.findHighestRowWithPiece();
  }

  public canGoThere({
    chamber,
    piece,
    offset,
  }: {
    chamber: Chamber;
    piece: Piece;
    offset: Offset;
  }) {
    for (let y = 0; y < piece.length; y++) {
      for (let x = 0; x < piece[y].length; x++) {
        if (
          (piece[y][x] === "#" &&
            chamber[offset[0] + y][offset[1] + x] === "#") ||
          piece[0].length + offset[1] > chamber[0].length ||
          offset[1] < 0 ||
          offset[0] < 0
        ) {
          return false;
        }
      }
    }
    return true;
  }
}

export function solve17a(file: string) {
  const rf = new RocksFalling(file);
  return rf.dropPieces();
}

export function solve17b(file: string) {
  return 0;
}

console.log(solve17a("17/input.txt"));
// console.log(solve17b(inputB));
