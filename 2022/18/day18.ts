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

function findSurfaceAreaWithoutPockets(rock: number[]) {
  const MAX_X =
    2 + rock.reduce((acc, cur) => Math.max(acc, Math.floor(cur / 10000)), 0);
  const MAX_Y =
    2 +
    rock.reduce(
      (acc, cur) => Math.max(acc, Math.floor((cur % 10000) / 100)),
      0
    );
  const MAX_Z = 2 + rock.reduce((acc, cur) => Math.max(acc, cur % 100), 0);

  const steam = [] as number[];
  generateSteam({
    point: 0,
    rock,
    steam,
    MAX_X,
    MAX_Y,
    MAX_Z,
  });

  // calculate outer surface area of steam and subtract
  const steamOuter = 2 * (MAX_X * MAX_Y + MAX_X * MAX_Z + MAX_Y * MAX_Z);
  const steamTotalSA = findSurfaceArea(steam);

  return steamTotalSA - steamOuter;
}

function generateSteam({
  point,
  rock,
  steam,
  MAX_X,
  MAX_Y,
  MAX_Z,
}: {
  point: number;
  rock: number[];
  steam: number[];
  MAX_X: number;
  MAX_Y: number;
  MAX_Z: number;
}) {
  const POINT_X = Math.floor(point / 10000);
  const POINT_Y = Math.floor((point % 10000) / 100);
  const POINT_Z = point % 100;

  if (
    POINT_X >= 0 &&
    POINT_X < MAX_X &&
    POINT_Y >= 0 &&
    POINT_Y < MAX_Y &&
    POINT_Z >= 0 &&
    POINT_Z < MAX_Z &&
    !rock.includes(point) &&
    !steam.includes(point)
  ) {
    steam.push(point);

    generateSteam({ point: point - 10000, rock, steam, MAX_X, MAX_Y, MAX_Z });
    generateSteam({ point: point + 10000, rock, steam, MAX_X, MAX_Y, MAX_Z });
    generateSteam({ point: point - 100, rock, steam, MAX_X, MAX_Y, MAX_Z });
    generateSteam({ point: point + 100, rock, steam, MAX_X, MAX_Y, MAX_Z });
    generateSteam({ point: point - 1, rock, steam, MAX_X, MAX_Y, MAX_Z });
    generateSteam({ point: point + 1, rock, steam, MAX_X, MAX_Y, MAX_Z });
  }
}

export function solve18a(file: string) {
  const data = parseCubesSingleNum(file);
  const surfaceArea = findSurfaceArea(data);
  return surfaceArea;
}

export function solve18b(file: string) {
  const data = parseCubesSingleNum(file);
  const surfaceArea = findSurfaceAreaWithoutPockets(data);
  return surfaceArea;
}

console.time("solve18a");
console.log(solve18a("18/input.txt"));
console.timeEnd("solve18a"); // 16ms
console.time("solve18b");
console.log(solve18b("18/input.txt"));
console.timeEnd("solve18b"); // 180ms
