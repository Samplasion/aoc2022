import run, { getTests } from "../deps.ts";
import * as utils from "../utils.ts";

const parseInput = (rawInput: string) => {
  return rawInput.trim().split("\n\n").map(raw => {
    const lines = raw.split("\n");
    const startingItems = lines[1].replace("  Starting items: ", "").split(", ").map(e => parseInt(e));
    const operation = new Function("old", lines[2].replace("  Operation: new =", "return")) as (old: number) => number;
    const divisibilityTest = parseInt(lines[3].replace("  Test: divisible by ", ""));
    const ifTrue = parseInt(lines[4].replace("    If true: throw to monkey ", ""));
    const ifFalse = parseInt(lines[5].replace("    If false: throw to monkey ", ""));

    return {
      startingItems,
      operation,
      _operation_: lines[2].replace("  Operation: new =", "return"),
      divisibilityTest,
      ifTrue,
      ifFalse,
      inspections: 0,
    }
  });
};

const solution = (part1: boolean) => (rawInput: string) => {
  const input = parseInput(rawInput);
  
  const M = input.map(monkey => monkey.divisibilityTest).reduce(utils.multiply);
  new utils.Range(part1 ? 20 : 1e4).forEach(_round => {
    for (const monkey of input) {
      new utils.Range(monkey.startingItems.length).forEach(() => {
        monkey.inspections++;
        let item = monkey.startingItems.shift()!;
        item = monkey.operation(item);
        if (part1) item /= 3;
        if (!part1) item %= M;
        if (item % monkey.divisibilityTest == 0) {
          input[monkey.ifTrue].startingItems.push(item);
        } else {
          input[monkey.ifFalse].startingItems.push(item);
        }
      });
    }
  });

  return input.map(m => m.inspections).sort(utils.decreasing).slice(0, 2).reduce(utils.multiply);
};

const testInput = await getTests()
run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 10605,
      },
    ],
    solution: solution(true),
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 2713310158,
      },
    ],
    solution: solution(false),
  },
  onlyTests: false,
});