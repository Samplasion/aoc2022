import run, { getTests } from "../deps.ts";
import * as utils from "../utils.ts";

const parseInput = (rawInput: string) => {
  return rawInput.trim().split("\n").map(line => line.split(""));
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let startPosition = new utils.Vector(0, 0);
  let endPosition = new utils.Vector(0, 0);

  for (let i = 0; i < input.length; i++)
    for (let j = 0; j < input[i].length; j++)
      if (input[i][j] === "E")
        endPosition = new utils.Vector(i, j);
      else if (input[i][j] === "S")
        startPosition = new utils.Vector(i, j);

  input[startPosition.x][startPosition.y] = "a";
  input[endPosition.x][endPosition.y] = "z";

  return utils.bfs(utils.toNodes(utils.gridMap(input, e => e.chr(0))), {
    matcher(from, to) {
      return to.value - 1 <= from.value;
    },
    startPosition,
    endPosition,
  });
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let startPosition = new utils.Vector(0, 0);

  for (let i = 0; i < input.length; i++)
    for (let j = 0; j < input[i].length; j++) {
      if (input[i][j] === "E")
        startPosition = new utils.Vector(i, j);
      else if (input[i][j] === "S")
        input[i][j] = "a";
    }

  input[startPosition.x][startPosition.y] = "z";

  return utils.bfs(utils.toNodes(utils.gridMap(input, e => e.chr(0))), {
    matcher(from, to) {
      // Inverse of the previous condition to
      // account for following the path in reverse
      return to.value + 1 >= from.value;
    },
    startPosition,
    endCondition(node) {
      return node.value == 'a'.chr(0);
    }
  });
};

const testInput = await getTests();
run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 31,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 29,
      },
    ],
    solution: part2,
  },
  onlyTests: false,
});