import CRT from "../CRT.ts";
import BaseInstruction from "./base.ts";

export default class AddxInstruction extends BaseInstruction {
  public cycles = 2;
  #toAdd: number;

  constructor(raw: string) {
    super(raw);
    this.#toAdd = parseInt(raw.slice(5));
  }

  static match(raw: string) {
    return raw.trim().startsWith("addx");
  }

  execute(crt: CRT): void {
    crt.registers.x += this.#toAdd;
  }
}