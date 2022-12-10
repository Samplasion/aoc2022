import BaseInstruction from "./base.ts";
import AddxInstruction from "./addx.ts";
import NoopInstruction from "./noop.ts";

interface BaseInstructionConstructor {
  new (raw: string): BaseInstruction;
  match(raw: string): boolean;
}

const classes: BaseInstructionConstructor[] = [
  NoopInstruction,
  AddxInstruction,
]

export function matchInstruction(raw: string) {
  for (const klass of classes)
    if (klass.match(raw))
      return new klass(raw);
  throw new Error(`Unidentified instruction: ${raw}`);
}

export default BaseInstruction;