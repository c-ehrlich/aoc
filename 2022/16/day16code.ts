import fs from "fs";

/**
 * Did this without doing any research
 * My part 1 solution feels decent
 * My Part 2 solution feels awful but hey it works and it's 1:30am
 */

type ValveName = `${Uppercase<string>}${Uppercase<string>}`;

type Valve = {
  flowRatePerMinute: number;
  leadsTo: ValveName[];
};
type Valves = Map<ValveName, Valve>;
type ValveWithDistances = Valve & { distances: Map<ValveName, number> };
type ValvesWithDistances = Map<ValveName, ValveWithDistances>;

function generateValves(file: string) {
  const valves: Valves = new Map<ValveName, Valve>();
  fs.readFileSync(file, "utf-8")
    .split("\n")
    .forEach((item) => {
      const [_, name, flowRate, tunnels] = item.match(
        /Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.+)/
      ) as [string, ValveName, string, string];
      const splitTunnels = tunnels.split(", ") as ValveName[];
      valves.set(name, {
        flowRatePerMinute: parseInt(flowRate),
        leadsTo: splitTunnels,
      });
    });

  // iterate over valves, and add distances to each valve
  const valvesWithDistances: ValvesWithDistances = new Map<
    ValveName,
    ValveWithDistances
  >();
  valves.forEach((valve, name) => {
    const distances = new Map<ValveName, number>();
    const queue = valve.leadsTo.map((valveName) => ({
      name: valveName,
      distance: 2, // 1 to turn on, 1 to move
    }));
    while (queue.length > 0) {
      const { name, distance } = queue.shift() as {
        name: ValveName;
        distance: number;
      };
      if (distances.has(name)) continue;
      distances.set(name, distance);
      const nextValve = valves.get(name);
      if (nextValve) {
        queue.push(
          ...nextValve.leadsTo.map((valveName) => ({
            name: valveName,
            distance: distance + 1,
          }))
        );
      }
    }
    valvesWithDistances.set(name, {
      ...valve,
      distances,
    });
  });
  console.log(valvesWithDistances);
  return valvesWithDistances;
}

function enterWalk({ valves }: { valves: ValvesWithDistances }) {
  const outcomes: { path: ValveName[]; score: number }[] = [];

  walk({
    valves,
    curr: "AA",
    path: [],
    flow: 0,
    turns: 30,
    score: 0,
    outcomes,
  });

  const bestPath = outcomes.sort((a, b) => b.score - a.score)[0];
  // console.log("bestPath", bestPath);
  return bestPath.score;
}

function walk({
  valves,
  curr,
  path,
  flow,
  turns,
  score,
  outcomes,
}: {
  valves: ValvesWithDistances;
  curr: ValveName;
  path: ValveName[];
  flow: number;
  turns: number;
  score: number;
  outcomes: { path: ValveName[]; score: number }[];
}): void {
  const newPath = [...path, curr];
  flow += valves.get(curr)?.flowRatePerMinute || 0;

  // walk possible paths
  const nextValves = valves.get(curr)?.distances || [];
  nextValves.forEach((distance, name) => {
    if (
      typeof name === "string" &&
      !newPath.includes(name) &&
      turns >= distance &&
      valves.get(name)?.flowRatePerMinute
    ) {
      walk({
        valves,
        curr: name,
        path: newPath,
        flow,
        turns: turns - distance,
        score: score + flow * distance,
        outcomes,
      });
    }
  });

  // wait until end of turns
  outcomes.push({
    path: newPath,
    score: score + flow * turns,
  });
}

/**
 * For part 1 I made the assumption that we don't need to care about the state
 * other than in turns where we have just turned on a valve. This is because
 * we can just interpolate the state for all other turns
 *
 * For part 2 this is no longer true so the solution becomes a bit more complex
 *
 * We don't actually _need_ to keep separate visited arrays for player and elephant
 * Because we don't care who has been where, just what is being turned on.
 *
 * We also need to add something to the path when one of us _decides_ to go
 * there, not on arrival, so that we don't try to turn the same valve on twice
 *
 * We still don't need to distinguish between heading to a valve and turning it on
 *
 * A cheesy solution for managing player and elephant state separately:
 * Just do it in separate iterations, and cheat with the numbering
 */

type PlayerState = {
  valve: ValveName;
  turnsLeft: number;
  path: ValveName[];
};

type PathByTurn = ValveName[];
type PartTwoOutcome = {
  playerPath: PathByTurn;
  elephantPath: PathByTurn;
  score: number;
  log: string[];
};

function enterWalkWithElephant({ valves }: { valves: ValvesWithDistances }) {
  const outcomes: PartTwoOutcome[] = [];

  walkWithElephant({
    valves,
    playerState: { valve: "AA", turnsLeft: 0, path: ["AA"] },
    elephantState: { valve: "AA", turnsLeft: 0, path: ["AA"] },
    flow: 0,
    turns: 26,
    score: 0,
    outcomes,
    log: [],
  });

  const bestPath = outcomes.sort((a, b) => b.score - a.score)[0];
  console.log("bestPath", bestPath);
  return bestPath.score;
}

function walkWithElephant({
  valves,
  playerState,
  elephantState,
  flow,
  turns,
  score,
  outcomes,
  log,
}: {
  valves: ValvesWithDistances;
  playerState: PlayerState;
  elephantState: PlayerState;
  flow: number;
  turns: number;
  score: number;
  outcomes: PartTwoOutcome[];
  log: string[];
}): void {
  const valvesToIgnore = [...playerState.path, ...elephantState.path];

  // if both are walking
  if (playerState.turnsLeft > 0 && elephantState.turnsLeft > 0) {
    const newLog = `${26 - turns} - walking, f:${flow}, s:${score} p:${
      playerState.turnsLeft
    }, e:${elephantState.turnsLeft}`;
    walkWithElephant({
      valves,
      playerState: { ...playerState, turnsLeft: playerState.turnsLeft - 1 },
      elephantState: {
        ...elephantState,
        turnsLeft: elephantState.turnsLeft - 1,
      },
      flow,
      turns: turns - 1,
      score: score + flow,
      outcomes,
      log: [...log, newLog],
    });
  }

  // player needs a new place to go
  if (playerState.turnsLeft === 0 && elephantState.turnsLeft > 0) {
    const newFlow =
      flow + (valves.get(playerState.valve)?.flowRatePerMinute || 0);

    const playerOptions = valves.get(playerState.valve)?.distances || [];
    playerOptions.forEach((distance, name) => {
      if (
        typeof name === "string" &&
        !valvesToIgnore.includes(name) &&
        turns >= distance &&
        valves.get(name)?.flowRatePerMinute
      ) {
        walkWithElephant({
          valves,
          playerState: {
            valve: name,
            turnsLeft: distance,
            path: [...playerState.path, name],
          },
          elephantState: {
            ...elephantState,
            turnsLeft: elephantState.turnsLeft - 1,
          },
          flow: newFlow,
          turns: turns - 1,
          score: score + flow,
          outcomes,
          log: [
            ...log,
            `${26 - turns} - player done opening ${
              playerState.path[playerState.path.length - 1]
            }, heading to ${name} which is ${distance} turns away`,
          ],
        });
      }
    });
    // bonus case: chill (maybe elephant will be faster) - only implement if necessary
  }

  // elephant needs a new place to go
  if (playerState.turnsLeft > 0 && elephantState.turnsLeft === 0) {
    const newFlow =
      flow + (valves.get(elephantState.valve)?.flowRatePerMinute || 0);

    const elephantOptions = valves.get(elephantState.valve)?.distances || [];
    elephantOptions.forEach((distance, name) => {
      if (
        typeof name === "string" &&
        !valvesToIgnore.includes(name) &&
        turns >= distance &&
        valves.get(name)?.flowRatePerMinute
      ) {
        walkWithElephant({
          valves,
          playerState: {
            ...playerState,
            turnsLeft: playerState.turnsLeft - 1,
          },
          elephantState: {
            valve: name,
            turnsLeft: distance,
            path: [...elephantState.path, name],
          },
          flow: newFlow,
          turns: turns - 1,
          score: score + flow,
          outcomes,
          log: [
            ...log,
            `${26 - turns} - elephant done opening ${
              elephantState.path[elephantState.path.length - 1]
            }, heading to ${name} which is ${distance} turns away`,
          ],
        });
      }
    });
    // bonus case: chill (maybe player will be faster) - only implement if necessary
  }

  // both need a new place to go
  if (playerState.turnsLeft === 0 && elephantState.turnsLeft === 0) {
    const newFlow =
      flow +
      (valves.get(playerState.valve)?.flowRatePerMinute || 0) +
      (valves.get(elephantState.valve)?.flowRatePerMinute || 0);

    const playerOptions =
      valves.get(playerState.valve)?.distances ||
      (new Map() as Map<ValveName, number>);
    const elephantOptions =
      valves.get(elephantState.valve)?.distances ||
      (new Map() as Map<ValveName, number>);

    if (playerOptions.size > 0 || elephantOptions.size > 0) {
      let foundRouteForBoth = false;
      playerOptions.forEach((distanceP, nameP) => {
        elephantOptions.forEach((distanceE, nameE) => {
          if (
            nameP !== nameE && //
            typeof nameP === "string" &&
            typeof nameE === "string" &&
            !valvesToIgnore.includes(nameP) &&
            !valvesToIgnore.includes(nameE) &&
            turns >= distanceP &&
            turns >= distanceE &&
            valves.get(nameP)?.flowRatePerMinute &&
            valves.get(nameE)?.flowRatePerMinute
          ) {
            foundRouteForBoth = true;
            walkWithElephant({
              valves,
              playerState: {
                valve: nameP,
                turnsLeft: distanceP,
                path: [...playerState.path, nameP],
              },
              elephantState: {
                valve: nameE,
                turnsLeft: distanceE,
                path: [...elephantState.path, nameE],
              },
              flow: newFlow,
              turns: turns - 1,
              score: score + flow,
              outcomes,
              log: [
                ...log,
                `${26 - turns} - both done opening ${
                  playerState.path[playerState.path.length - 1]
                } and ${
                  elephantState.path[elephantState.path.length - 1]
                }, new targets ${nameP} (${distanceP}) and ${nameE} (${distanceE})`,
              ],
            });
          }
        });
      });
    }

    // TODO: maybe need to account for a case where there is only one option left to go to?
  }

  // nobody walking, nowhere left to go
  outcomes.push({
    playerPath: [...playerState.path],
    elephantPath: [...elephantState.path],
    score: score + flow * turns,
    log: [
      ...log,
      `${26 - turns} - both done, pressure ${flow}, score ${score}, p left ${
        playerState.turnsLeft
      }, e left ${elephantState.turnsLeft}}`,
    ],
  });
}

export function solve16a(file: string) {
  const valves = generateValves(file);
  const bestPath = enterWalk({
    valves,
  });
  return bestPath;
}

export function solve16b(file: string) {
  const valves = generateValves(file);
  const bestPath = enterWalkWithElephant({
    valves,
  });
  return bestPath;
}

// console.time();
// console.log(solve16a("16/input.txt"));
// console.timeEnd(); // 380ms
console.log(solve16b("16/sample.txt"));
