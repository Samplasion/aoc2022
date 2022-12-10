import run from "https://deno.land/x/aoc@0.0.1-alpha.13/mod.ts";
import { sum } from "../utils.ts";

const YOUR_ROCK = "A",
  YOUR_PAPER = "B",
  YOUR_SCISSORS = "C",
  MY_ROCK = "X",
  MY_PAPER = "Y",
  MY_SCISSORS = "Z";
const difference = "X".charCodeAt(0) - "A".charCodeAt(0);

type Round = [string, string];

const parseInput = (rawInput: string) => {
  return rawInput.trim().split("\n").map(round => {
    return round.split(" ") as Round;
  });
};

const getMoveScore = (move: string) => {
  switch (move) {
    case MY_ROCK: return 1;
    case MY_PAPER: return 2;
    case MY_SCISSORS: return 3;
    default: return 0;
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const calculateScore = (round: Round) => {
    let total = getMoveScore(round[1]);

    const yourMove = round[0];
    const myMove = round[1];
    const winCondition = 
      yourMove == YOUR_PAPER && myMove == MY_SCISSORS ||
      yourMove == YOUR_ROCK && myMove == MY_PAPER ||
      yourMove == YOUR_SCISSORS && myMove == MY_ROCK;
    const drawCondition = (yourMove.charCodeAt(0) + difference) == myMove.charCodeAt(0);

    if (winCondition)
      total += 6;
    else if (drawCondition)
      total += 3;

    return total;
  }
  
  return sum(input.map(calculateScore));
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let score = 0;

  for (const round of input) {
    switch (round[1]) {
      case "X": // LOSE
        switch (round[0]) {
          case YOUR_ROCK: score += getMoveScore(MY_SCISSORS); break;
          case YOUR_PAPER: score += getMoveScore(MY_ROCK); break;
          case YOUR_SCISSORS: score += getMoveScore(MY_PAPER); break;
        }
        break;
      case "Y": // DRAW
        score += 3;
        switch (round[0]) {
          case YOUR_ROCK: score += getMoveScore(MY_ROCK); break;
          case YOUR_PAPER: score += getMoveScore(MY_PAPER); break;
          case YOUR_SCISSORS: score += getMoveScore(MY_SCISSORS); break;
        }
        break
      case "Z": // WIN
        score += 6;
        switch (round[0]) {
          case YOUR_ROCK: score += getMoveScore(MY_PAPER); break;
          case YOUR_PAPER: score += getMoveScore(MY_SCISSORS); break;
          case YOUR_SCISSORS: score += getMoveScore(MY_ROCK); break;
        }
        break
    }
  }
  
  return score;
};

const testInput = `
A Y
B X
C Z`.trim();

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 15,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 12,
      },
    ],
    solution: part2,
  },
  onlyTests: false,
});