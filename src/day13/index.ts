// deno-lint-ignore-file no-explicit-any
import run, { getTests } from "../deps.ts";
import * as utils from "../utils.ts";

type Packet = any[];
type PacketPair = [Packet, Packet];

const parseInput = (rawInput: string) => {
  return rawInput.trim().split("\n\n").map(lines => {
    const [first, second] = lines.split("\n").map(el => JSON.parse(el));
    return [first, second] as PacketPair;
  });
};

const isOrdered = ([first, second]: PacketPair): number => {
  const arr = <T>(thing: T | T[]): T[] => Array.isArray(thing) ? thing : [thing];
  
  if (!Array.isArray(first) && !Array.isArray(second))
    return first - second;
  else {
    const [left, right] = [arr(first), arr(second)];
    for (let i = 0; i < Math.min(left.length, right.length); i++) {
      const result = isOrdered([left[i], right[i]]);
      if (result) return result;
    }
    return left.length - right.length;
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let sum = 0;

  for (let i = 0; i < input.length; i++) {
    const pair = input[i];
    const ordered = isOrdered(pair);
    if (ordered <= 0) sum += (i + 1);
  }
  
  return sum;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  input.push([[[2]], [[6]]]);
  const sorted = input.flat().sort((a, b) => isOrdered([a, b]));

  let score = 1;
  for (let i = 0; i < sorted.length; i++) {
    const packet = sorted[i];
    if (utils.deepEqual(packet, [[2]]) || utils.deepEqual(packet, [[6]]))
      score *= (i + 1);
  }
  
  return score;
};

const testInput = await getTests();
run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 140,
      },
    ],
    solution: part2,
  },
  onlyTests: false,
});