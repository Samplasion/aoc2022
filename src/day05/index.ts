import run from "https://deno.land/x/aoc@0.0.1-alpha.13/mod.ts";

interface Instruction {
  howMany: number, from: number, to: number
}

const parseInput = (rawInput: string) => {
  const [rawDrawing, rawInstructions] = rawInput.split("\n\n");
  const drawing: string[][] = Array.from<string[]>({length: 10}).map(() => []);
  rawDrawing.split('\n').map(line => {
    const matches = line.match(/(\[\w\]| {3}) ?/g);
    return matches;
  }).slice(0, -1).forEach(row => {
    row?.forEach((value, index) => {
      if (value.trim() == "") return;
      drawing[index].push(value[1]);
    });
  })
  const instructions = rawInstructions.split('\n').map(line => {
    const [_, ...stuff] = line.match(/move (\d+) from (\d+) to (\d+)/)!;
    const [howMany, from, to] = stuff.map(a => parseInt(a));
    return {howMany, from: from - 1, to: to - 1} as Instruction;
  });
  return {
    drawing,
    instructions
  };
};

const parts = (part1: boolean) => (rawInput: string) => {
  const input = parseInput(rawInput);
  const crates = input.drawing;

  for (const {howMany, from, to} of input.instructions) {
    if (part1) {
      for (let i = 0; i < howMany; i++) {
        crates[to].unshift(crates[from].shift()!);
      }
    } else {
      crates[to].unshift(...crates[from].slice(0, howMany));
      crates[from] = crates[from].slice(howMany);
    }
  }
  
  return crates.map(crate => crate[0] ?? '').join("");
};

const testInput =
`
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: "CMZ",
      },
    ],
    solution: parts(true),
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: "MCD",
      },
    ],
    solution: parts(false),
  },
  onlyTests: false,
});