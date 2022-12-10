import run, { getTests } from "https://deno.land/x/aoc@0.0.1-alpha.13/mod.ts";
import * as utils from "../utils.ts";
import CRT from "./CRT.ts";
import { matchInstruction } from "./instrs/mod.ts";

const parseInput = (rawInput: string) => {
  return rawInput.trim().split("\n").map(line => {
    return matchInstruction(line);
  });
};

const code = (part1: boolean) => (rawInput: string) => {
  const instructions = parseInput(rawInput);
  const crt = new CRT(instructions);
  let strengths = 0;

  crt.on("cycle", (cycle: number) => {
    if (cycle % 40 != 20) return;
    const cycleStrength = cycle * crt.registers.x;
    strengths += cycleStrength;
  });

  crt.run();
  
  if (part1)
    return strengths;
  else
    return utils.toLetters(crt.rows);
};

const testInput = await getTests();
run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 13140,
      },
    ],
    solution: code(true),
  },
  part2: {
    tests: [
      {
        input: testInput,
        // No expectation, the result isn't a string of letters
        expected: "",
      },
    ],
    solution: code(false),
  },
  onlyTests: false,
});