import run from "../deps.ts";

type Rucksack = [string, string];

const parseInput = (rawInput: string) => {
  return rawInput.split("\n").map(line => {
    const l = line.length;
    return [line.slice(0, l/2), line.slice(l/2)] as Rucksack;
  });
};

const letterPriority = (letter: string) => {
  if (typeof letter != "string") return 0;

  const a = "a".charCodeAt(0);
  const z = "z".charCodeAt(0);
  const A = "A".charCodeAt(0);
  const Z = "Z".charCodeAt(0);
  const char = letter.charCodeAt(0);
  if (char >= a && char <= z) return char - a + 1;
  if (char >= A && char <= Z) return char - A + 1 + 26;
  return 0;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let priority = 0;

  for (const rucksack of input) {
    // TODO: Improve this
    const sharedLetter = rucksack[0].split("").find(letter => rucksack[1].includes(letter))!;
    priority += letterPriority(sharedLetter);
  }
  
  return priority;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const rucksacks = input.reduce<string[][]>((groups, rucksack) => {
    const groupIndex = (groups?.length ?? 0) - 1;
    if (groupIndex < 0 || groups[groupIndex].length == 3) {
      groups.push([rucksack.join("")]);
    } else {
      groups[groupIndex].push(rucksack.join(""))
    }
    return groups;
  }, []);

  let priority = 0;

  for (const elfGroup of rucksacks) {
    // TODO: Improve this
    let badge: string;

    for (const char of elfGroup[0]) {
      if (elfGroup[1].includes(char) && elfGroup[2].includes(char)) {
        badge = char;
        break;
      }
    }

    priority += letterPriority(badge!);
  }
  
  return priority;
};

const testInput = `
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`.trim();

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 157,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 70,
      },
    ],
    solution: part2,
  },
  onlyTests: false,
});