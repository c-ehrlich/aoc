import fs from "fs";

function parseCubesSingleNum(file: string) {
  return fs
    .readFileSync(file, "utf8")
    .split("\n")
    .map((line) => line.split(",").map((n) => parseInt(n)))
    .map((line) => 10000 * line[0] + 100 * line[1] + 1 * line[2]) as number[];
}

function findSurfaceArea(cubes: number[]) {
  let area = 0;
  for (let i = 0; i < cubes.length; i++) {
    const cube = cubes[i];
    let sides = 6;
    for (let j = 0; j < cubes.length; j++) {
      if (cube - 10000 === cubes[j]) sides--;
      if (cube + 10000 === cubes[j]) sides--;
      if (cube - 100 === cubes[j]) sides--;
      if (cube + 100 === cubes[j]) sides--;
      if (cube - 1 === cubes[j]) sides--;
      if (cube + 1 === cubes[j]) sides--;
    }
    area += sides;
  }
  return area;
}

/**
 * Our hack of turning each cube into a single number doesn't work for part 2
 * Still leaving the part 1 answer above because I think it's neat
 */

type CubeList = [number, number, number][];

function parseCubesArray(file: string) {
  return fs
    .readFileSync(file, "utf8")
    .split("\n")
    .map((line) => line.split(",").map((n) => parseInt(n))) as CubeList;
}

function findSurfaceAreaWithoutPockets(droplet: CubeList) {
  const MAX_X = Math.max(...droplet.map((cube) => cube[0])) + 1;
  const MAX_Y = Math.max(...droplet.map((cube) => cube[1])) + 1;
  const MAX_Z = Math.max(...droplet.map((cube) => cube[2])) + 1;
  const MIN_X = Math.min(...droplet.map((cube) => cube[0])) - 1;
  const MIN_Y = Math.min(...droplet.map((cube) => cube[1])) - 1;
  const MIN_Z = Math.min(...droplet.map((cube) => cube[2])) - 1;
  const limits = { MAX_X, MAX_Y, MAX_Z, MIN_X, MIN_Y, MIN_Z };

  // create steam and measure its total surface area
  const steam = [] as CubeList;
  generateSteam({
    point: [MIN_X, MIN_Y, MIN_Z],
    droplet,
    steam,
    limits,
  });
  const steamTotalSA = findSurfaceAreaArray(steam);

  // calculate outer surface area of steam
  const outer = [1 + MAX_X - MIN_X, 1 + MAX_Y - MIN_Y, 1 + MAX_Z - MIN_Z];
  const steamOuter =
    2 * (outer[0] * outer[1] + outer[0] * outer[2] + outer[1] * outer[2]);

  // return steam's total surface area minus outer surface area
  return steamTotalSA - steamOuter;
}

function generateSteam({
  point,
  droplet,
  steam,
  limits,
}: {
  point: CubeList[number];
  droplet: CubeList;
  steam: CubeList;
  limits: {
    MAX_X: number;
    MAX_Y: number;
    MAX_Z: number;
    MIN_X: number;
    MIN_Y: number;
    MIN_Z: number;
  };
}) {
  if (
    point[0] >= limits.MIN_X &&
    point[0] <= limits.MAX_X &&
    point[1] >= limits.MIN_Y &&
    point[1] <= limits.MAX_Y &&
    point[2] >= limits.MIN_Z &&
    point[2] <= limits.MAX_Z &&
    !includesPoint({ list: steam, point }) &&
    !includesPoint({ list: droplet, point })
  ) {
    steam.push(point);

    generateSteam({
      point: [point[0] - 1, point[1], point[2]],
      droplet: droplet,
      steam,
      limits,
    });
    generateSteam({
      point: [point[0] + 1, point[1], point[2]],
      droplet: droplet,
      steam,
      limits,
    });
    generateSteam({
      point: [point[0], point[1] - 1, point[2]],
      droplet: droplet,
      steam,
      limits,
    });
    generateSteam({
      point: [point[0], point[1] + 1, point[2]],
      droplet: droplet,
      steam,
      limits,
    });
    generateSteam({
      point: [point[0], point[1], point[2] - 1],
      droplet: droplet,
      steam,
      limits,
    });
    generateSteam({
      point: [point[0], point[1], point[2] + 1],
      droplet: droplet,
      steam,
      limits,
    });
  }
}

function findSurfaceAreaArray(cubes: CubeList) {
  let area = 0;
  for (let i = 0; i < cubes.length; i++) {
    const cube = cubes[i];
    let sides = 6;
    for (let j = 0; j < cubes.length; j++) {
      if (
        cube[0] - 1 === cubes[j][0] &&
        cube[1] === cubes[j][1] &&
        cube[2] === cubes[j][2]
      )
        sides--;
      if (
        cube[0] + 1 === cubes[j][0] &&
        cube[1] === cubes[j][1] &&
        cube[2] === cubes[j][2]
      )
        sides--;
      if (
        cube[0] === cubes[j][0] &&
        cube[1] - 1 === cubes[j][1] &&
        cube[2] === cubes[j][2]
      )
        sides--;
      if (
        cube[0] === cubes[j][0] &&
        cube[1] + 1 === cubes[j][1] &&
        cube[2] === cubes[j][2]
      )
        sides--;
      if (
        cube[0] === cubes[j][0] &&
        cube[1] === cubes[j][1] &&
        cube[2] - 1 === cubes[j][2]
      )
        sides--;
      if (
        cube[0] === cubes[j][0] &&
        cube[1] === cubes[j][1] &&
        cube[2] + 1 === cubes[j][2]
      )
        sides--;
    }
    area += sides;
  }
  return area;
}

function includesPoint({
  list,
  point,
}: {
  list: CubeList;
  point: CubeList[number];
}) {
  return list.some(
    (cube) =>
      cube[0] === point[0] && cube[1] === point[1] && cube[2] === point[2]
  );
}

export function solve18a(file: string) {
  const data = parseCubesSingleNum(file);
  const surfaceArea = findSurfaceArea(data);
  return surfaceArea;
}

export function solve18b(file: string) {
  const data = parseCubesArray(file);
  const surfaceArea = findSurfaceAreaWithoutPockets(data);
  return surfaceArea;
}

export function testCubeArea(file: string) {
  const data = parseCubesArray(file);
  const surfaceArea = findSurfaceAreaArray(data);
  return surfaceArea;
}

console.time("solve18a");
console.log(solve18a("18/input.txt"));
console.timeEnd("solve18a"); // 16ms
console.time("solve18b");
console.log(solve18b("18/input.txt"));
console.timeEnd("solve18b"); // 530ms
