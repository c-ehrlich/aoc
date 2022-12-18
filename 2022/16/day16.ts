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

type PlayerMove = ValveName | "wait";

type PlayerState = {
  valve: ValveName;
  queue: PlayerMove[];
  path: ValveName[];
};

type PathByTurn = ValveName[];
type PartTwoOutcome = {
  playerPath: PathByTurn;
  elephantPath: PathByTurn;
  score: number;
  log: string[];
};

let highscore = 0;

function enterWalkWithElephant({ valves }: { valves: ValvesWithDistances }) {
  const outcomes: PartTwoOutcome[] = [];
  const targetValves = [...valves]
    .filter((valve) => valve[1].flowRatePerMinute > 0)
    .map((valve) => valve[0]);
  console.log("start targetValves:", targetValves);

  walkWithElephant({
    valves,
    playerState: { valve: "AA", path: [], queue: [] },
    elephantState: { valve: "AA", path: [], queue: [] },
    openValves: [],
    targetValves,
    turns: 27,
    score: 0,
    outcomes,
    log: [],
  });

  const bestPath = outcomes.sort((a, b) => b.score - a.score)[0];
  console.log("bestPath", bestPath);
  console.log(outcomes.map((outcome) => outcome.score).sort((a, b) => b - a));
  const betterPath = outcomes.filter(
    (outcome) =>
      JSON.stringify(outcome.playerPath) === `["JJ","BB","CC"]` &&
      JSON.stringify(outcome.elephantPath) === `["DD","HH","EE"]`
  );
  console.log("better path:", betterPath);
  return bestPath.score;
}

function walkWithElephant({
  valves,
  playerState,
  elephantState,
  openValves,
  targetValves,
  turns,
  score,
  outcomes,
  log,
}: {
  valves: ValvesWithDistances;
  playerState: PlayerState;
  elephantState: PlayerState;
  openValves: ValveName[];
  targetValves: ValveName[];
  turns: number;
  score: number;
  outcomes: PartTwoOutcome[];
  log: string[];
}): void {
  turns -= 1;
  const flow = openValves
    .map((valve) => (valves.get(valve) as Valve).flowRatePerMinute)
    .reduce((acc, cur) => acc + cur, 0);
  const newScore = score + flow;
  let newLog = `== turn ${26 - turns}, score ${score} => ${newScore}\n`;
  newLog += `${openValves.join(", ")} are open, releasing ${flow} pressure\n`;
  newLog += `player queue: ${playerState.queue.join(
    ", "
  )}, elephant queue: ${elephantState.queue.join(", ")}\n`;

  const playerMove = playerState.queue.shift() || "wait";
  if (playerMove !== "wait") {
    openValves.push(playerMove);
    newLog += `player opens ${playerMove}\n`;
  } else {
    newLog += `player is walking somewhere or waiting\n`;
  }

  const elephantMove = elephantState.queue.shift() || "wait";
  if (elephantMove !== "wait") {
    openValves.push(elephantMove);
    newLog += `elephant opens ${elephantMove}\n`;
  } else {
    newLog += `elephant is walking somewhere or waiting\n`;
  }

  if (turns === 0) {
    // if (newScore > 1724) {
    if (newScore > highscore) {
      highscore = newScore;
      console.log("new highscore", newScore);
      outcomes.push({
        playerPath: playerState.path,
        elephantPath: elephantState.path,
        score: newScore,
        log: [...log, newLog],
      });
    }
  } else {
    // if both have 1+ turn left, just keep going
    // if there are no more valid paths, also just keep going
    if (
      (playerState.queue.length > 0 && elephantState.queue.length > 0) ||
      targetValves.length === 0
    ) {
      newLog += `---keep walking - targetValves: ${targetValves.join(", ")}`;
      walkWithElephant({
        valves,
        playerState: JSON.parse(JSON.stringify(playerState)),
        elephantState: JSON.parse(JSON.stringify(elephantState)),
        openValves: [...openValves],
        targetValves,
        turns,
        score: newScore,
        outcomes,
        log: [...log, newLog],
      });
    }

    // if both have 0 turns left, try to give both a new path
    else if (
      playerState.queue.length === 0 &&
      elephantState.queue.length === 0
    ) {
      newLog += `player queue: ${playerState.queue.join(
        ", "
      )}, elephant queue: ${elephantState.queue.join(", ")}`;
      newLog += `-- both are getting new paths - targetValves: ${targetValves.join(
        ", "
      )}`;
      // if only one valve left, recurse twice - once for each player to open it
      if (targetValves.length === 1) {
        // player gets it
        walkWithElephant({
          valves,
          playerState: JSON.parse(
            JSON.stringify({
              valve: targetValves[0],
              path: [...playerState.path, targetValves[0]],
              queue: [
                ...new Array(
                  valves
                    .get(playerState.valve)
                    ?.distances.get(targetValves[0])! - 1
                ).fill("wait"),
                targetValves[0],
              ],
            })
          ),
          elephantState: JSON.parse(
            JSON.stringify({
              ...elephantState,
              queue: ["wait"],
            })
          ),
          openValves: [...openValves],
          targetValves: [],
          turns,
          score: newScore,
          outcomes,
          log: [...log, newLog],
        });
        // elephant gets it
        walkWithElephant({
          valves,
          playerState: JSON.parse(
            JSON.stringify({
              ...playerState,
              queue: ["wait"],
            })
          ),
          elephantState: JSON.parse(
            JSON.stringify({
              valve: targetValves[0],
              path: [...elephantState.path, targetValves[0]],
              queue: [
                ...new Array(
                  valves
                    .get(elephantState.valve)
                    ?.distances.get(targetValves[0])! - 1
                ).fill("wait"),
                targetValves[0],
              ],
            })
          ),
          openValves: [...openValves],
          targetValves: [],
          turns,
          score: newScore,
          outcomes,
          log: [...log, newLog],
        });
      }
      if (targetValves.length > 1) {
        // iterate over all possible combinations of remaining valves
        // recurse all of them except sending both players to the same valve
        for (let i = 0; i < targetValves.length; i++) {
          for (let j = 0; j < targetValves.length; j++) {
            if (i === j) continue;
            // send player to i, elephant to j
            walkWithElephant({
              valves,
              playerState: JSON.parse(
                JSON.stringify({
                  valve: targetValves[i],
                  path: [...playerState.path, targetValves[i]],
                  queue: [
                    ...new Array(
                      valves
                        .get(playerState.valve)
                        ?.distances.get(targetValves[i])! - 1
                    ).fill("wait"),
                    targetValves[i],
                  ],
                })
              ),
              elephantState: JSON.parse(
                JSON.stringify({
                  valve: targetValves[j],
                  path: [...elephantState.path, targetValves[j]],
                  queue: [
                    ...new Array(
                      valves
                        .get(elephantState.valve)
                        ?.distances.get(targetValves[j])! - 1
                    ).fill("wait"),
                    targetValves[j],
                  ],
                })
              ),
              openValves: [...openValves],
              targetValves: targetValves.filter(
                (valve) =>
                  valve !== targetValves[i] && valve !== targetValves[j]
              ),
              turns,
              score: newScore,
              outcomes,
              log: [...log, newLog],
            });
          }
        }
      }
    }

    // if player has 0 turns left and elephant has 1+ turn left, give player a new path
    else if (playerState.queue.length === 0 && elephantState.queue.length > 0) {
      for (let i = 0; i < targetValves.length; i++) {
        walkWithElephant({
          valves,
          playerState: JSON.parse(
            JSON.stringify({
              valve: targetValves[i],
              path: [...playerState.path, targetValves[i]],
              queue: [
                ...new Array(
                  valves
                    .get(playerState.valve)
                    ?.distances.get(targetValves[i])! - 1
                ).fill("wait"),
                targetValves[i],
              ],
            })
          ),
          elephantState: JSON.parse(JSON.stringify(elephantState)),
          openValves: [...openValves],
          targetValves: targetValves.filter(
            (valve) => valve !== targetValves[i]
          ),
          turns,
          score: newScore,
          outcomes,
          log: [...log, newLog],
        });
      }
    }

    // if elephant has 0 turns left and player has 1+ turn left, give elephant a new path
    else if (elephantState.queue.length === 0 && playerState.queue.length > 0) {
      newLog += `++++++ IS THIS WHERE WE FUCK UP??? +++++++`;
      newLog += `${JSON.stringify(playerState)}`;
      for (let i = 0; i < targetValves.length; i++) {
        walkWithElephant({
          valves,
          playerState: JSON.parse(JSON.stringify(playerState)),
          elephantState: JSON.parse(
            JSON.stringify({
              valve: targetValves[i],
              path: [...elephantState.path, targetValves[i]],
              queue: [
                ...new Array(
                  valves
                    .get(elephantState.valve)
                    ?.distances.get(targetValves[i])! - 1
                ).fill("wait"),
                targetValves[i],
              ],
            })
          ),
          openValves: [...openValves],
          targetValves: targetValves.filter(
            (valve) => valve !== targetValves[i]
          ),
          turns,
          score: newScore,
          outcomes,
          log: [...log, newLog],
        });
      }
    }
  }
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

console.time();
console.log(solve16a("16/input.txt"));
console.timeEnd(); // 380ms

console.log(solve16b("16/input.txt"));
// didnt benchmark part 2, but it took about 90 minutes to run lol
