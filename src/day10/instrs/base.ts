import CRT from "../CRT.ts";

export default abstract class BaseInstruction {
  public abstract cycles: number;

  constructor(_raw: string) {}

  static match(raw: string): boolean {return false}

  abstract execute(crt: CRT): void;
}