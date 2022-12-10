import EventEmitter from "events";
import { Range } from "../utils.ts";
import BaseInstruction from "./instrs/mod.ts";

export default class CRT extends EventEmitter {
  #cycles = 0;
  registers = {
    x: 1,
  }
  rows: string[] = [];

  constructor(public instructions: BaseInstruction[]) {
    super();
  }

  tick() {
    this.#cycles++;
    this.emit("cycle", this.#cycles);

    this.draw();
  }

  private draw() {
    const normalizedCycles = (this.#cycles - 1);
    let current = this.rows.length - 1;
    if (normalizedCycles % 40 == 0) {
      this.rows.push("");
      current++;
    }

    const phosphor = normalizedCycles % 40;
    if (Math.abs(phosphor - this.registers.x) <= 1)
      this.rows[current] += "#";
    else
      this.rows[current] += ".";
  }

  run() {
    for (const instruction of this.instructions) {
      new Range(instruction.cycles).forEach(() => this.tick());
      instruction.execute(this);
    }
  }
}