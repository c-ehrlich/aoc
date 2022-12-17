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
  wind: Wind[];
  mod: number;
  chamber: Chamber;
  PIECES_TO_DROP: number;

  constructor({ file, pieces }: { file: string; pieces: number }) {
    this.PIECES_TO_DROP = pieces;
    this.wind = fs.readFileSync(file, "utf8").split("") as Wind[];
    this.mod = this.wind.length;
    this.chamber = [
      ["#", "#", "#", "#", "#", "#", "#"],
      ...new Array(110)
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
    let amountShifted = 0;
    for (let i = 0; i < this.PIECES_TO_DROP; i++) {
      const piece = pieceRotation[i % 5];
      let pieceMoves = 0;
      let bottomLine = this.findHighestRowWithPiece();
      if (bottomLine >= 100) {
        this.chamber = [
          ...this.chamber.slice(50),
          ...new Array(50)
            .fill(0)
            .map(() => [".", ".", ".", ".", ".", ".", "."] as ChamberRow),
        ];
        bottomLine -= 50;
        amountShifted += 50;
      }
      const offset: Offset = [bottomLine + 4, 2];
      let pieceIsLocked = false;

      while (!pieceIsLocked) {
        const windDir = this.wind[move % this.mod];
        if (move % this.mod === 0 && move < 1000000) {
          console.log(
            "piece",
            i,
            "height",
            this.findHighestRowWithPiece() + amountShifted,
            "windDir",
            windDir,
            "pieceMoves",
            pieceMoves,
            "piece",
            piece
          );
        }
        move++;
        pieceMoves++;

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
    return this.findHighestRowWithPiece() + amountShifted;
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
  const rf = new RocksFalling({ file, pieces: 2022 });
  return rf.dropPieces();
}

export function solve17b(file: string) {
  const rf = new RocksFalling({ file, pieces: 2500 });
  return rf.dropPieces();
}

console.log(solve17a("17/input.txt"));
console.log(solve17b("17/input.txt"));

/**
 * there is a cycle!
 *
 * piece 1727 height 2690 windDir > pieceMoves 0 piece [ [ '#', '#', '#' ], [ '.', '.', '#' ], [ '.', '.', '#' ] ]
 * piece 3422 height 5324 windDir > pieceMoves 0 piece [ [ '#', '#', '#' ], [ '.', '.', '#' ], [ '.', '.', '#' ] ]
 * piece 5117 height 7958 windDir > pieceMoves 0 piece [ [ '#', '#', '#' ], [ '.', '.', '#' ], [ '.', '.', '#' ] ]
 * piece 6812 height 10592 windDir > pieceMoves 0 piece [ [ '#', '#', '#' ], [ '.', '.', '#' ], [ '.', '.', '#' ] ]
 * piece 8507 height 13226 windDir > pieceMoves 0 piece [ [ '#', '#', '#' ], [ '.', '.', '#' ], [ '.', '.', '#' ] ]
 * piece 10202 height 15860 windDir > pieceMoves 0 piece [ [ '#', '#', '#' ], [ '.', '.', '#' ], [ '.', '.', '#' ] ]
 *
 * starting with piece 1727, there is a cycle every 1695 pieces
 * each cycle adds 2634 to the height
 *
 * so the answer is the sum of:
 * - height after 1727 pieces
 * - height of all the cycles added up
 *   - Floor((1_000_000_000_000 - 1727) / 1695) * 2634 = 1_553_982_297_000
 *   => piece 2545
 *   => 3956
 * - height after adding the remaining rocks at the end of the cycles
 *   - 773 rocks
 *
 * 1717+773 = 2500
 * => height: 3884
 *
 * 1_553_982_297_000 + 3884 = 1553982300884
 */
