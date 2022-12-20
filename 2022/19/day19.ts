import fs from "fs";

/**
 * This one should have maybe been a class
 */

const MAX_MINUTES = 24;

type Blueprint = {
  blueprint: number;
  costs: {
    oreRobot: {
      ore: number;
    };
    clayRobot: {
      ore: number;
    };
    obsidianRobot: {
      ore: number;
      clay: number;
    };
    geodeRobot: {
      ore: number;
      obsidian: number;
    };
  };
};

type Resources = {
  ore: number;
  clay: number;
  obsidian: number;
  geode: number;
};

type Robots = {
  oreRobot: number;
  clayRobot: number;
  obsidianRobot: number;
  geodeRobot: number;
};

type Outcome = {
  robots: Robots;
  resources: Resources;
  log: string;
};

export function parseBlueprints(file: string) {
  return fs
    .readFileSync(file, "utf8")
    .split("\n")
    .map((line) => {
      const [
        _,
        blueprint,
        oreRobotOre,
        clayRobotOre,
        obsidianRobotOre,
        obsidianRobotClay,
        geodeRobotOre,
        geodeRobotObsidian,
      ] = line.match(
        /Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./
      ) as string[];
      return {
        blueprint: parseInt(blueprint),
        costs: {
          oreRobot: {
            ore: parseInt(oreRobotOre),
          },
          clayRobot: {
            ore: parseInt(clayRobotOre),
          },
          obsidianRobot: {
            ore: parseInt(obsidianRobotOre),
            clay: parseInt(obsidianRobotClay),
          },
          geodeRobot: {
            ore: parseInt(geodeRobotOre),
            obsidian: parseInt(geodeRobotObsidian),
          },
        },
      };
    });
}

function getQualityLevels({
  blueprints,
  minutes,
}: {
  blueprints: Blueprint[];
  minutes: number;
}) {
  return blueprints.reduce(
    (acc, cur) =>
      acc +
      cur.blueprint *
        solveBestRobotStratWithQueue({ blueprint: cur, minutes }).resources
          .geode,
    0
  );
}

function firstThreeMultiplied({
  blueprints,
  minutes,
}: {
  blueprints: Blueprint[];
  minutes: number;
}) {
  const firstThree = blueprints.slice(0, 3);
  return firstThree.reduce(
    (acc, cur) =>
      acc *
      solveBestRobotStratWithQueue({ blueprint: cur, minutes }).resources.geode,
    1
  );
}

function solveBestRobotStratWithQueue({
  blueprint,
  minutes,
}: {
  blueprint: Blueprint;
  minutes: number;
}) {
  let queue: Outcome[] = [
    {
      resources: { ore: 0, clay: 0, obsidian: 0, geode: 0 },
      robots: { oreRobot: 1, clayRobot: 0, obsidianRobot: 0, geodeRobot: 0 },
      log: "",
    },
  ];

  for (let minute = 1; minute <= minutes; minute++) {
    const turnOutcomes: Outcome[] = [];
    for (const turn of queue) {
      turnOutcomes.push(
        ...takeTurn({
          resources: turn.resources,
          costs: blueprint.costs,
          robots: turn.robots,
          log: turn.log,
          minute,
        })
      );
    }
    queue = [...turnOutcomes]
      .sort((a, b) => {
        if (b.resources.geode > a.resources.geode) return 1;
        if (b.resources.geode < a.resources.geode) return -1;
        if (b.robots.geodeRobot > a.robots.geodeRobot) return 1;
        if (b.robots.geodeRobot < a.robots.geodeRobot) return -1;

        if (b.robots.obsidianRobot > a.robots.obsidianRobot) return 1;
        if (b.robots.obsidianRobot < a.robots.obsidianRobot) return -1;
        if (b.resources.obsidian > a.resources.obsidian) return 1;
        if (b.resources.obsidian < a.resources.obsidian) return -1;

        if (b.robots.clayRobot > a.robots.clayRobot) return 1;
        if (b.robots.clayRobot < a.robots.clayRobot) return -1;
        if (b.resources.clay > a.resources.clay) return 1;
        if (b.resources.clay < a.resources.clay) return -1;

        if (b.robots.oreRobot > a.robots.oreRobot) return 1;
        if (b.robots.oreRobot < a.robots.oreRobot) return -1;
        if (b.resources.ore > a.resources.ore) return 1;
        if (b.resources.ore < a.resources.ore) return -1;

        return 0;
      })
      // might have to increase this number a bit depending on the input
      // or figure out a better optimized sorting logic
      .slice(0, 300);
  }

  return queue.sort((a, b) => b.resources.geode - a.resources.geode)[0];
}

function takeTurn({
  resources,
  costs,
  robots,
  log,
  minute,
}: {
  resources: Resources;
  costs: Blueprint["costs"];
  robots: Robots;
  log: string;
  minute: number;
}): Outcome[] {
  const minuteLog = `== Minute ${minute} ==\n`;

  // 1. gather resources
  const newResources = {
    ore: resources.ore + robots.oreRobot,
    clay: resources.clay + robots.clayRobot,
    obsidian: resources.obsidian + robots.obsidianRobot,
    geode: resources.geode + robots.geodeRobot,
  };
  let resourceLog = "";
  resourceLog += `${robots.oreRobot} ore-collecting robots collect ${robots.oreRobot} ore; you now have ${newResources.ore} ore.\n`;
  if (robots.clayRobot) {
    resourceLog += `${robots.clayRobot} clay-collecting robots collect ${robots.clayRobot} clay; you now have ${newResources.clay} clay.\n`;
  }
  if (robots.obsidianRobot) {
    resourceLog += `${robots.obsidianRobot} obsidian-collecting robots collect ${robots.obsidianRobot} obsidian; you now have ${newResources.obsidian} obsidian.\n`;
  }
  if (robots.geodeRobot) {
    resourceLog += `${robots.geodeRobot} geode-cracking robots crack ${robots.geodeRobot} geode; you now have ${newResources.geode} open geodes.\n`;
  }

  // generate possible outcomes
  const outcomes = [];
  if (shouldMaybeBuyNothing({ costs, robots })) {
    outcomes.push({
      resources: newResources,
      robots,
      log: log + minuteLog + resourceLog,
    });
  }
  if (shouldMaybeBuyOreRobot({ costs, robots, resources })) {
    const buyLog = `You spend ${costs.oreRobot.ore} ore to start building an ore-collecting robot.\n`;
    outcomes.push({
      resources: {
        ...newResources,
        ore: newResources.ore - costs.oreRobot.ore,
      },
      robots: {
        ...robots,
        oreRobot: robots.oreRobot + 1,
      },
      log: log + minuteLog + buyLog + resourceLog,
    });
  }
  if (shouldMaybeBuyClayRobot({ costs, robots, resources })) {
    const buyLog = `You spend ${costs.clayRobot.ore} ore to start building a clay-collecting robot.\n`;
    outcomes.push({
      resources: {
        ...newResources,
        ore: newResources.ore - costs.clayRobot.ore,
      },
      robots: {
        ...robots,
        clayRobot: robots.clayRobot + 1,
      },
      log: log + minuteLog + buyLog + resourceLog,
    });
  }
  if (shouldMaybeBuyObsidianRobot({ costs, robots, resources })) {
    const buyLog = `You spend ${costs.obsidianRobot.ore} ore and ${costs.obsidianRobot.clay} clay ore to start building an obsidian-collecting robot.\n`;
    outcomes.push({
      resources: {
        ...newResources,
        ore: newResources.ore - costs.obsidianRobot.ore,
        clay: newResources.clay - costs.obsidianRobot.clay,
      },
      robots: {
        ...robots,
        obsidianRobot: robots.obsidianRobot + 1,
      },
      log: log + minuteLog + buyLog + resourceLog,
    });
  }
  if (shouldMaybeBuyGeodeRobot({ costs, resources })) {
    const buyLog =
      `You spend ${costs.geodeRobot.ore} ore and ${costs.geodeRobot.obsidian} obsidian to start building a geode-cracking robot.\n` +
      `~~~ ore start: ${resources.ore}, ore end: ${
        newResources.ore - costs.geodeRobot.ore
      } ~~~\n`;
    outcomes.push({
      resources: {
        ...newResources,
        ore: newResources.ore - costs.geodeRobot.ore,
        obsidian: newResources.obsidian - costs.geodeRobot.obsidian,
      },
      robots: {
        ...robots,
        geodeRobot: robots.geodeRobot + 1,
      },
      log: log + minuteLog + buyLog + resourceLog,
    });
  }

  return outcomes;
}

function shouldMaybeBuyNothing({
  costs,
  robots,
}: {
  costs: Blueprint["costs"];
  robots: Robots;
}) {
  const maxOreCost = Math.max(
    costs.oreRobot.ore,
    costs.clayRobot.ore,
    costs.obsidianRobot.ore,
    costs.geodeRobot.ore
  );
  if (
    robots.obsidianRobot >= costs.geodeRobot.obsidian &&
    robots.clayRobot >= costs.obsidianRobot.clay &&
    robots.oreRobot >= maxOreCost
  ) {
    return false;
  }
  return true;
}

function shouldMaybeBuyOreRobot({
  costs,
  resources,
  robots,
}: {
  costs: Blueprint["costs"];
  resources: Resources;
  robots: Robots;
}) {
  if (costs.oreRobot.ore > resources.ore) {
    return false;
  }
  const maxOreCost = Math.max(
    costs.oreRobot.ore,
    costs.clayRobot.ore,
    costs.obsidianRobot.ore,
    costs.geodeRobot.ore
  );
  if (robots.oreRobot >= maxOreCost) {
    return false;
  }
  return true;
}

function shouldMaybeBuyClayRobot({
  costs,
  resources,
  robots,
}: {
  costs: Blueprint["costs"];
  resources: Resources;
  robots: Robots;
}) {
  if (costs.clayRobot.ore > resources.ore) {
    return false;
  }
  if (robots.clayRobot > costs.obsidianRobot.clay) {
    return false;
  }
  return true;
}

function shouldMaybeBuyObsidianRobot({
  costs,
  resources,
  robots,
}: {
  costs: Blueprint["costs"];
  resources: Resources;
  robots: Robots;
}) {
  if (
    costs.obsidianRobot.ore > resources.ore ||
    costs.obsidianRobot.clay > resources.clay
  ) {
    return false;
  }
  if (robots.obsidianRobot > costs.geodeRobot.obsidian) {
    return false;
  }
  return true;
}

function shouldMaybeBuyGeodeRobot({
  costs,
  resources,
}: {
  costs: Blueprint["costs"];
  resources: Resources;
}) {
  if (
    costs.geodeRobot.ore > resources.ore ||
    costs.geodeRobot.obsidian > resources.obsidian
  ) {
    return false;
  }
  return true;
}

export function solve19a(file: string) {
  const blueprints = parseBlueprints(file);
  const qualityLevel = getQualityLevels({ blueprints, minutes: 24 });
  return qualityLevel;
}

export function solve19b(file: string) {
  const blueprints = parseBlueprints(file);
  const thing = firstThreeMultiplied({ blueprints, minutes: 32 });
  return thing;
}

console.time("solve19a");
console.log(solve19a("19/input.txt"));
console.timeEnd("solve19a"); // 320ms
console.time("solve19b");
console.log(solve19b("19/input.txt"));
console.timeEnd("solve19b"); // 43ms
