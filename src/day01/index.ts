import run from "https://deno.land/x/aoc@0.0.1-alpha.13/mod.ts";
import { sum } from "../utils.ts";

const parseInput = (rawInput: string) => {
  return rawInput.split("\n\n").map(elf => {
    return elf.split("\n").map(item => parseInt(item));
  });
};

const part1 = (rawInput: string) => {
  const elves = parseInput(rawInput);
  let mostCalories = 0;

  for (const elf of elves) {
    const calories = sum(elf);
    if (mostCalories <= calories)
      mostCalories = calories;
  }
  
  return mostCalories;
};

const part2 = (rawInput: string) => {
  const elves = parseInput(rawInput);
  
  return sum(elves.map(elf => sum(elf)).sort((a, b) => b - a).slice(0, 3));
};

const testInput = `
1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`.trim();

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 24000,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 45000,
      },
    ],
    solution: part2,
  },
  onlyTests: false,
});