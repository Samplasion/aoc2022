import run from "https://deno.land/x/aoc@0.0.1-alpha.12/mod.ts";
import * as utils from "../utils.ts";

const parseInput = (rawInput: string) => {
  return rawInput.trim().split("\n").map(line => {
    return line.split("").map(el => parseInt(el));
  });
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let visible = utils.perimeter(input);

  const isVisible = (x: number, y: number) => {
    return utils.Vector.DIRECTIONS.some(dir => {
      let pos = new utils.Vector(x, y);
      do {
        pos = pos.add(dir);
        if (pos.eq(new utils.Vector(x, y))) continue;
        if (input[pos.y][pos.x] >= input[y][x]) return false;
      } while (
        pos.x.betweenEx(1, input.length - 1) &&
        pos.y.betweenEx(1, input[0].length - 1)
      );
      return true;
    });
  }

  for (let j = 1; j < input.length - 1; j++) {
    for (let i = 1; i < input[j].length - 1; i++) {
      if (isVisible(i, j)) {
        visible++;
      }
    }
  }
  
  return visible;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const visibleTrees = (x: number, y: number): number => {
    const scores = utils.Vector.DIRECTIONS.map(dir => {
      let pos = new utils.Vector(x, y);
      let trees = 0;
      while (
        pos.x.betweenEx(1, input.length - 1) &&
        pos.y.betweenEx(1, input[0].length - 1)
      ) {
        pos = pos.add(dir);
        if (pos.eq(new utils.Vector(x, y))) continue;
        trees++
        if (input[pos.y][pos.x] >= input[y][x]) break;
      }
      return trees;
    });
    return scores.reduce(utils.multiply);
  }

  let previousScore = -Infinity;
  new utils.Range(0, input.length).forEach(y => {
    new utils.Range(0, input[y].length).forEach(x => {
      const trees = visibleTrees(x, y);
      if (trees > previousScore)
        previousScore = trees;
    });
  });
  
  return previousScore;
};

const testInput = `30373
25512
65332
33549
35390`;
run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 8,
      },
    ],
    solution: part2,
  },
  onlyTests: false,
});