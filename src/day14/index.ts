import run, { getTests } from "../deps.ts";
import * as utils from "../utils.ts";

const source = new utils.Vector(500, 0);

const parseInput = (rawInput: string) => {
  let maximumY = -Infinity;
  const grid = utils.gridOf(1000, 1000, ".");
  rawInput.trim().split("\n").forEach(line => {
    const parts = line.split(" -> ").map(str => new utils.Vector(...str.split(",").map(utils.toInt) as [number, number]));
    for (let i = 1; i < parts.length; i++) {
      const previous = parts[i - 1];
      const current = parts[i];
      for (const vec of utils.Vector.intermediate(previous, current)) {
        grid[vec.x][vec.y] = "#";
        if (vec.y >= maximumY) maximumY = vec.y;
      }
    }
  });
  return [grid, maximumY] as const;
};

const parts = (part2: boolean) => (rawInput: string) => {
  const [grid, maximumY] = parseInput(rawInput);

  if (part2) {
    const floor = maximumY + 2;
    for (let x = 0; x < grid.length; x++) {
      grid[x][floor] = "#";
    }
  }
  
  let movingSand = false;
  let sandPosition = source.clone();
  let sands = 0;
  while (true) {
    if (!movingSand) {
      grid[sandPosition.x][sandPosition.y] = "o";
      movingSand = true;
    }

    grid[sandPosition.x][sandPosition.y] = ".";
    
    let nextPosition = sandPosition.add(new utils.Vector(0, 1));
    if (nextPosition.getIn(grid) != ".")
      nextPosition = nextPosition.add(new utils.Vector(-1, 0));
    if (nextPosition.getIn(grid) != ".")
      nextPosition = nextPosition.add(new utils.Vector(2, 0));
    if (nextPosition.getIn(grid) != ".") {
      grid[sandPosition.x][sandPosition.y] = "o";
      movingSand = false;
      sands++;
      if (sandPosition.eq(source)) break;
      sandPosition = source.clone();
    } else {
      grid[nextPosition.x][nextPosition.y] = "o";
      sandPosition = nextPosition;
    }

    if (!part2 && sandPosition.y > maximumY) {
      break;
    }
  }

  return sands;
};

const testInput = await getTests();
run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 24,
      },
    ],
    solution: parts(false),
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 93,
      },
    ],
    solution: parts(true),
  },
  onlyTests: false,
});