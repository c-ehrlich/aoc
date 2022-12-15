import fs from "fs";

const inputA = [0];
const inputB = [0];

type CaveItem = "S" | "B" | "#" | ".";

// Cave is a map of y coordinates, which are maps of x coordinates, which are the items in the cave
type Coord = { x: number; y: number };
type SensorBeacon = { sensor: Coord; beacon: Coord };

class Beacons {
  private sensorsBeacons: SensorBeacon[];

  constructor(file: string) {
    this.sensorsBeacons = [];
    fs.readFileSync(file, "utf-8")
      .split("\n")
      .map((line) => {
        const [_, sensorX, sensorY, beaconX, beaconY] = line.match(
          /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/
        ) as string[];
        this.sensorsBeacons.push({
          sensor: { x: parseInt(sensorX), y: parseInt(sensorY) },
          beacon: { x: parseInt(beaconX), y: parseInt(beaconY) },
        });
      });
  }

  public safeSpotsInRow(row: number) {
    // for each sensor, figure out if it covers that row
    // if it does, figure out which spots in the row it makes safe
    // then override any spots in that row that have either a sensor or a beacon
    // then count the number of safe spots
    const safeSpots = new Set<number>();
    this.sensorsBeacons.forEach(({ sensor, beacon }) => {
      const distance =
        Math.abs(beacon.y - sensor.y) + Math.abs(beacon.x - sensor.x);
      const yDistance = Math.abs(row - sensor.y);
      if (Math.abs(row - sensor.y) < distance) {
        for (
          let i = sensor.x - (distance - yDistance);
          i <= sensor.x + (distance - yDistance);
          i++
        ) {
          safeSpots.add(i);
        }
      }
    });
    this.sensorsBeacons.forEach(({ sensor, beacon }) => {
      if (sensor.y === row) {
        safeSpots.delete(sensor.x);
      }
      if (beacon.y === row) {
        safeSpots.delete(beacon.x);
      }
    });
    return safeSpots.size;
  }

  public findDistressBeacon() {
    // 0 <= x <= 4_000_000
    // 0 <= y <= 4_000_000
    // find the only possible beacon in this space
    // tuning frequency = x*4_000_000 + y
    // There is a better way to do this that doesn't involve rewriting half of the previous function
  }
}

export function solve15a(file: string, row: number) {
  const beacons = new Beacons(file);
  const safeSpots = beacons.safeSpotsInRow(row);
  return safeSpots;
}

export function solve15b(input: number[]) {
  return 0;
}

console.time();
console.log(solve15a("15/input.txt", 2_000_000));
// console.log(solve15b(inputB));
console.timeEnd();

// part 1: 1.02s
// part 2:
