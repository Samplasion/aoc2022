// TODO: Clean up

import run from "https://deno.land/x/aoc@0.0.1-alpha.12/mod.ts";
import * as utils from "../utils.ts";

type FilesystemEntry = File | Directory;
type File = {
  size: number,
  name: string,
};
type Directory = {
  path: string,
  content: Map<string, File | Directory>
};

const parseInput = (rawInput: string) => {
  const result: Directory = {
    path: "/",
    content: new Map(),
  };

  const ensurePath = (segments: string[]) => {
    let current = result;
    for (const segment of segments) {
      if (!current.content.has(segment)) {
        current.content.set(segment, {
          path: current.path + "/" + segment,
          content: new Map(),
        });
      }
      if ("name" in (current.content.get(segment)! as FilesystemEntry)) break;
      current = current.content.get(segment) as Directory;
    }
  }

  const getPath = (segments: string[]) => {
    let current = result;
    for (const segment of segments) {
      if (!current.content.has(segment)) {
        return undefined;
      }
      if ("name" in (current.content.get(segment)! as FilesystemEntry)) break;
      current = current.content.get(segment) as Directory;
    }
    return current;
  }

  let path = [] as string[];
  for (const line of rawInput.trim().split("\n")) {
    if (line.startsWith("$ cd ")) {
      const dir = line.substring(5);
      switch (dir) {
        case "/": path = []; break;
        case "..": path.pop(); break;
        default: path.push(dir);
      }
      ensurePath(path);
    } else if (!line.startsWith("$")) {
      const [size, name] = line.split(" ");
      // console.log([size, name], path);
      if (size == "dir") {
        getPath(path)?.content.set(name, {
          path: `/${path.join("/")}/${name}`.replaceAll("//", "/"),
          content: new Map(),
        });
      } else {
        getPath(path)?.content.set(name, {
          name: name,
          size: parseInt(size),
        });
      }
    }
  }
  return result;
};

const getSizes = (dir: Directory) => {
  const sizes = new Map<string, number>();

  const dirSize = (directory: Directory): number => {
    let size = 0;
    directory.content.forEach((fsEntry) => {
      if ("name" in fsEntry) {
        size += fsEntry.size;
      } else {
        const dsize = dirSize(fsEntry);
        sizes.set(fsEntry.path, dsize);
        size += dsize;
      }
    });
    return size;
  }

  sizes.set("/", dirSize(dir));

  return sizes;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const sizes = getSizes(input);

  const max = 1e5;

  return [...sizes.values()].filter(v => v < max).reduce(utils.sum);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const sizes = getSizes(input);

  const totalSpace = 7e7;
  const minimumFree = 3e7;
  const currentFree = totalSpace - sizes.get("/")!;
  // currentFree < minimumFree

  return [...sizes.values()].sort(utils.increasing).find(el => el + currentFree > minimumFree);
};

const testInput = new TextDecoder("utf-8").decode(Deno.readFileSync("./test.txt"));
run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 95437,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 24933642,
      },
    ],
    solution: part2,
  },
  onlyTests: false,
});