import run from "../deps.ts";
import * as usefulTags from "https://deno.land/x/usefultags@1.2.0/usefulTags.mjs";
import * as utils from "../utils.ts";

const parseInput = (rawInput: string) => {
  const res: utils.Vector[] = [];
  rawInput.trim().split("\n").forEach(line => {
    const [dir, num] = line.split(" ");
    new utils.Range(parseInt(num)).forEach(() => {
      res.push(utils.Vector.from(dir)!);
    });
  });
  return res;
};

const simulateRope = (size: number, directions: utils.Vector[]) => {
  const rope = Array.from({ length: size }).map(() => new utils.Vector(0, 0));
  const positions = new Set<string>();
  const tail = size - 1;
  const range = new utils.Range(1, size);

  for (const dir of directions) {
    rope[0] = rope[0].add(dir);
    range.forEach(i => {
      if (rope[i - 1].eq(rope[i])) return;
      if (!rope[i].isAdjacentTo(rope[i - 1])) {
        const [x, y] = rope[i - 1].tuple;
        if (rope[i].x != x) {
          if (x > rope[i].x)
            rope[i] = rope[i].add(new utils.Vector(1, 0))
          else
            rope[i] = rope[i].add(new utils.Vector(-1, 0))
        }
        if (rope[i].y != y) {
          if (y > rope[i].y)
            rope[i] = rope[i].add(new utils.Vector(0, 1))
          else
            rope[i] = rope[i].add(new utils.Vector(0, -1))
        }
      }
    });
    
    positions.add(`${rope[tail].x},${rope[tail].y}`);
  }
  
  return positions.size;
}

const simulation = (parts: number) => (rawInput: string) => {
  const directions = parseInput(rawInput);
  return simulateRope(parts, directions);
};

const testInput = new TextDecoder("utf-8").decode(Deno.readFileSync("./test.txt"));
run({
  part1: {
    tests: [
      {
        input: usefulTags.stripAllIndents`
          R 4
          U 4
          L 3
          D 1
          R 4
          D 1
          L 5
          R 2`,
        expected: 13,
      },
    ],
    solution: simulation(2),
  },
  part2: {
    tests: [
      {
        input: usefulTags.stripAllIndents`
          R 4
          U 4
          L 3
          D 1
          R 4
          D 1
          L 5
          R 2`,
        expected: 1,
      },
      {
        input: testInput,
        expected: 36,
      },
    ],
    solution: simulation(10),
  },
  onlyTests: false,
});