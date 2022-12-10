import run from "https://deno.land/x/aoc@0.0.1-alpha.13/mod.ts";

const parseInput = (rawInput: string) => {
  return rawInput.trim();
};

const checkStartMarker = (number: number) => (rawInput: string) => {
  const input = parseInput(rawInput);
  
  for (let i = number - 1; i < input.length; i++) {
    const substring = input.slice(i - (number - 1), i + 1).split("");
    const different = new Set(substring).size == substring.length;
    if (different) return i + 1;
  }
};

run({
  part1: {
    tests: [
      {
        input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
        expected: 7,
      },
      {
        input: `bvwbjplbgvbhsrlpgdmjqwftvncz`,
        expected: 5,
      },
      {
        input: `nppdvjthqldpwncqszvftbrmjlhg`,
        expected: 6,
      },
      {
        input: `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`,
        expected: 10,
      },
      {
        input: `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`,
        expected: 11,
      },
    ],
    solution: checkStartMarker(4),
  },
  part2: {
    tests: [
      {
        input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
        expected: 19,
      },
    ],
    solution: checkStartMarker(14),
  },
  onlyTests: false,
});