import run from "../deps.ts";

type Bounds = [number, number];
type Assignment = [Bounds, Bounds];

const parseInput = (rawInput: string) => {
  return rawInput.trim().split("\n").map(line => {
    return line.split(",").map(assmt => {
      return assmt.split("-").map(a => parseInt(a)) as Bounds;
    }) as Assignment;
  });
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let overlapping = 0;
  
  for (const assmt of input) {
    const [elf1, elf2] = assmt;
    if (elf1[0] <= elf2[0] && elf1[1] >= elf2[1] || elf2[0] <= elf1[0] && elf2[1] >= elf1[1])
      overlapping++;
  }
  
  return overlapping;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let overlapping = 0;
  
  for (const assmt of input) {
    const [elf1, elf2] = assmt;
    const areOverlapping =
      elf1[0] <= elf2[0] && elf1[1] >= elf2[0] ||
      elf1[1] >= elf2[1] && elf1[0] <= elf2[1] ||
      elf2[0] <= elf1[0] && elf2[1] >= elf1[0] ||
      elf2[1] >= elf1[1] && elf2[0] <= elf1[1];
    if (areOverlapping)
      overlapping++;
  }
  
  return overlapping;
};

const testInput = `
2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`.trim();

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 4,
      },
    ],
    solution: part2,
  },
  onlyTests: false,
});