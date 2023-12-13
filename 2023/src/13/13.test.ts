import { describe, expect, it } from "bun:test";
import {
  findHorizontalMirroring,
  findHorizontalMirroringWithBug,
  findVerticalMirroring,
  findVerticalMirroringWithBug,
  parse,
  partOne,
  partTwo,
  rotateClockwise
} from "./13";

const { default: example } = await import("./example.txt");
const { default: example2 } = await import("./example2.txt");

describe("Day 13", () => {
  describe("findVerticalMirroring", () => {
    it("Even 1", () => {
      const pattern = `#..#..##.
      #..#..##.
      .####.#.#
      ..#..#...
      #.###.#..
      #.###.##.
      ..#..#...`
        .split("\n")
        .map(line => line.trim());
      expect(findVerticalMirroring(pattern)).toBe(1);
    });

    it("Even 2", () => {
      const pattern = `....#..
      ###.##.
      ...#.##
      ..###.#
      .####.#
      .####.#
      ..###.#`
        .split("\n")
        .map(line => line.trim());
      expect(findVerticalMirroring(pattern)).toBe(5);
    });

    it("No vertical mirroring", () => {
      const pattern = `..##.#..#.#
      ...#.#..#.#
      ##.###..###
      ..####..###
      .#.#.#..#.#
      #....#..#..`
        .split("\n")
        .map(line => line.trim());
      expect(findVerticalMirroring(pattern)).toBe(-1);
    });
  });

  describe("findHorizontalMirroring", () => {
    it("even 1", () => {
      const pattern = `#.##..##.
    ..#.##.#.
    ##......#
    ##......#
    ..#.##.#.
    ..##..##.
    #.#.##.#.`
        .split("\n")
        .map(line => line.trim());

      expect(findHorizontalMirroring(pattern)).toBe(5);
    });
  });

  it("rotateClockwise", () => {
    const pattern = `..####.##....
    ....#.##.###.
    #####.##.#..#
    .#....#...#.#
    #.#.##.###..#
    #.#.##.###..#
    .#..#.#...#.#
    #####.##.#..#
    ....#.##.###.
    ..####.##....
    ..####.##....`
      .split("\n")
      .map(line => line.trim());

    expect(rotateClockwise(pattern)).toEqual([
      "..#.##.#...",
      "..##..##...",
      "#.#.##.#.##",
      "#.#....#.##",
      "###.#######",
      "#...##...##",
      ".###..###..",
      "###.##.####",
      "#...##...##",
      ".##.##.##..",
      ".#.#..#.#..",
      ".#......#..",
      "..######..."
    ]);
  });

  describe("findVerticalMirroringWithBug", () => {
    it("has a solution", () => {
      const pattern = `#.##..##.
      ..#.##.#.
      ##......#
      ##......#
      ..#.##.#.
      ..##..##.
      #.#.##.#.`
        .split("\n")
        .map(line => line.trim());
      expect(findVerticalMirroringWithBug(pattern)).toBe(3);
    });

    it("does not have a solution", () => {
      const pattern = `####..##.
      ..#.##.#.
      ##......#
      ##......#
      ..#.##.#.
      ..##..##.
      ###.##.#.`
        .split("\n")
        .map(line => line.trim());
      expect(findVerticalMirroringWithBug(pattern)).toBe(-1);
    });

    it("another no solution", () => {
      const pattern = `..#.#..#.#
      ..#.#..#.#
      ..#..##..#
      ..#......#
      ..#......#
      ..#.#..#..`
        .split("\n")
        .map(line => line.trim());
      expect(findVerticalMirroringWithBug(pattern)).toBe(-1);
    });

    it("the weird one", () => {
      const pattern = `.....########..
      ####...####...#
      ####...####...#
      .#...########..
      #.##..##..##..#
      ##.....####....
      ...###..##..###`
        .split("\n")
        .map(line => line.trim());
      expect(findVerticalMirroringWithBug(pattern)).toBe(2);
    });
  });

  describe("findHorizontalMirroringWithBug", () => {
    it("has a solution", () => {
      const pattern = `..#.#..#.#
      ..#.#..#.#
      ..#..##..#
      ..#......#
      ..#......#
      ..#.#..#..`
        .split("\n")
        .map(line => line.trim());
      expect(findHorizontalMirroringWithBug(pattern)).toBe(6);
    });

    it("the weird one", () => {
      const pattern = `.....########..
      ####...####...#
      ####...####...#
      .#...########..
      #.##..##..##..#
      ##.....####....
      ...###..##..###`
        .split("\n")
        .map(line => line.trim());
      expect(findHorizontalMirroringWithBug(pattern)).toBe(-1);
    });
  });

  it("Part One", () => {
    expect(partOne(parse(example))).toBe(405);
  });

  it("Part Two", () => {
    expect(partTwo(parse(example))).toBe(400);
  });

  it("Part Two example two", () => {
    expect(partTwo(parse(example2))).toBe(406);
  });
});
