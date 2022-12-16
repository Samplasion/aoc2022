import run, { getTests } from "../deps.ts";
import * as utils from "../utils.ts";

type Sensor = {
  position: utils.Vector,
  closestBeacon: utils.Vector,
  distance: number,
}

const parseInput = (rawInput: string) => {
  const beacons: utils.Vector[] = [];
  const sensors: Sensor[] = [];

  rawInput.trim().split("\n").forEach(line => {
    const words = `${line}.`.split(" ");
    const beacon = new utils.Vector(0, 0);
    beacon.x = utils.toInt(words[8].split("=")[1].slice(0, -1));
    beacon.y = utils.toInt(words[9].split("=")[1].slice(0, -1));
    beacons.push(beacon);
    const position = new utils.Vector(0, 0);
    position.x = utils.toInt(words[2].split("=")[1].slice(0, -1));
    position.y = utils.toInt(words[3].split("=")[1].slice(0, -1));
    const sensor: Sensor = {
      position,
      closestBeacon: beacon,
      distance: position.manhattanDistance(beacon),
    };
    sensors.push(sensor);
  });

  return [utils.unique(beacons, (a, b) => a.eq(b)), sensors] as const;
};

const part1 = (rawInput: string, isTest: boolean) => {
  const [beacons, sensors] = parseInput(rawInput);
  const target = isTest ? 10 : 2000000;

  const noBeaconTiles = new Set<number>();
  for (const sensor of sensors) {
    if (Math.abs(sensor.position.y - target) <= sensor.distance) {
      const heightDifference = Math.abs(sensor.position.y - target);
      const tilesOnY = Math.abs(2 * sensor.distance + 1 - 2 * heightDifference);
      const delta = Math.floor(tilesOnY / 2);
      for (let i = sensor.position.x - delta; i <= sensor.position.x + delta; i++) {
        if (beacons.every(b => !b.eq(new utils.Vector(i, target)))) {
          noBeaconTiles.add(i);
        }
      }
    }
  }

  return noBeaconTiles.size;
};

const part2 = (rawInput: string, test: boolean) => {
  const [_beacons, sensors] = parseInput(rawInput);
  const multiplier = 4e6;
  const max = test ? 20 : 4e6;

  let i = 0;
  for (const sensor of sensors) {
    console.debug("Moving to sensor", ++i, "of", sensors.length);
    const circle = utils.manhattanCircle(sensor.position, sensor.distance);
    console.debug(" -> Checking", circle.length, "positions");
    for (const position of circle) {
      if (!position.x.betweenInc(0, max) || !position.y.betweenInc(0, max)) continue;
      if (!sensors.some(sensor => utils.isInManhattanRadius(sensor.position, sensor.distance, position))) {
        console.log(position);
        return position.x * multiplier + position.y;
      }
    }
  }
};

const testInput = await getTests();
run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 26,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 56000011,
      },
    ],
    solution: part2,
  },
  onlyTests: false,
});