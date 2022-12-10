import CRT from "../CRT.ts";
import BaseInstruction from "./base.ts";

export default class NoopInstruction extends BaseInstruction {
  public cycles = 1;
  constructor(raw: string) {
    super(raw);
  }

  static match(raw: string) {
    return raw.trim() == "noop";
  }

  execute(_crt: CRT): void {}
}