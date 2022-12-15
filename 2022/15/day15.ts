import fs from "fs";

type Coord = { x: number; y: number };
type SensorBeacon = { sensor: Coord; beacon: Coord };
type RangeInclusive = [number, number];

/**
 * There is absolutely no reason for this to be a class
 *
 * But I made the abstraction before I understood the problem, which
 * as I understand is the most popular way of writing classes
 */

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
    /**
     * 0 <= x <= 4_000_000
     * 0 <= y <= 4_000_000
     * find the only possible beacon in this space
     * tuning frequency = x*4_000_000 + y
     *
     * we need much better performance than before!!
     */

    for (let y = 0; y <= 4_000_000; y++) {
      // create a set of ranges that are safe
      const ranges: RangeInclusive[] = [];

      this.sensorsBeacons.forEach(({ sensor, beacon }) => {
        // the safe area of each sensor/beacon pair
        const distance =
          Math.abs(beacon.y - sensor.y) + Math.abs(beacon.x - sensor.x);
        const yDistance = Math.abs(y - sensor.y);
        if (Math.abs(y - sensor.y) < distance) {
          ranges.push([
            sensor.x - (distance - yDistance),
            sensor.x + (distance - yDistance),
          ]);
        }

        // the sensor and beacon itself
        if (sensor.y === y) {
          ranges.push([sensor.x, sensor.x]);
        }
        if (beacon.y === y) {
          ranges.push([beacon.x, beacon.x]);
        }
      });

      /**
       * check if anything is missing from those ranges
       * if so, the first missing spot is the beacon
       *
       * sort all the ranges by their starting point
       * x = 0;
       * shift a range off the front of the array
       * if range[0] > x, then return [x, y] (and do the multiplication whatever)
       * if range[1] > x, then set x = range[1] + 1
       * continue until all ranges are exhausted
       * x should now be over 4 million
       * if not, we messed up
       */
      const sortedRanges = ranges.sort((a, b) => a[0] - b[0]);

      let x = 0;

      while (sortedRanges.length > 0) {
        const range = sortedRanges.shift()!;
        if (range[0] > x) {
          console.log("found it!", x, y);
          return x * 4_000_000 + y;
        }
        if (range[1] >= x) {
          x = range[1] + 1;
        }
      }
    }
  }
}

export function solve15a(file: string, row: number) {
  const beacons = new Beacons(file);
  const safeSpots = beacons.safeSpotsInRow(row);
  return safeSpots;
}

export function solve15b(file: string) {
  const beacons = new Beacons(file);
  const beacon = beacons.findDistressBeacon();
  return beacon;
}

console.time();
console.log(solve15a("15/input.txt", 2_000_000));
console.timeEnd();
// part 1: 1.02s (would be orders of magnitude less if i ported back the algo from part 2)
console.time();
console.log(solve15b("15/input.txt"));
console.timeEnd();
// part 2: 1.38s
