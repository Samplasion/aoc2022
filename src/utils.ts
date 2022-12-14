// deno-lint-ignore-file no-explicit-any
import lettersBySymbol from "./ocr.ts";

// #region Extensions
declare global {
    interface String {
        chr(index: number): number;
    }
    interface Number {
        betweenInc(lower: number, upper: number): boolean;
        betweenEx(lower: number, upper: number): boolean;
    }
}
String.prototype.chr = function(index) {
    return this.charCodeAt(index);
}
Number.prototype.betweenInc = function(lower, upper) {
    return this >= lower && this <= upper;
}
Number.prototype.betweenEx = function(lower, upper) {
    return this >= lower && this < upper;
}
// #endregion

// #region Functions
export type EqualityCheck<T> = (a: T, b: T) => boolean;
export function unique<T>(elements: T[], areEqual?: EqualityCheck<T>): T[] {
    if (areEqual) {
        const result: T[] = [];
        elements.forEach(element => {
            if (!result.some((t) => areEqual(element, t))) {
                result.push(element);
            }
        });
        return result;
    }
    return [...new Set<T>(elements)];
}

export function intersection<T>(first: T[], second: T[]): T[] {
    const helper: T[] = [];
    first.forEach(el => {
        if (second.includes(el)) helper.push(el);
    });
    return helper;
}

export function sum(arr: number[]): number;
export function sum(acc: number, el: number): number;
export function sum(arrOrAcc: number | number[], el?: number): number | ((prev: number, cur: number) => number) {
    if (typeof arrOrAcc == "number")
        return arrOrAcc + el!;
    return arrOrAcc.reduce(sum, 0);
}

export function multiply(arr: number[]): number;
export function multiply(acc: number, el: number): number;
export function multiply(arrOrAcc: number | number[], el?: number): number | ((prev: number, cur: number) => number) {
    if (typeof arrOrAcc == "number")
        return arrOrAcc * el!;
    return arrOrAcc.reduce(sum, 0);
}

export function rotate<T>(matrix: T[][]): T[][] {
    const width = matrix.length;
    const height = matrix[0].length;
    const result = Array.from({ length: height }).map(() => Array.from<T>({ length: width }));

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            result[j][i] = matrix[i][j];
        }
    }

    return result;
}

export function area<T>(matrix: T[][]) {
    return matrix.length * matrix[0].length;
}

export function perimeter<T>(matrix: T[][]) {
    // - the four corners
    return 2 * matrix.length + 2 * matrix[0].length - 4;
}

export function inner<T>(matrix: T[][]): T[][] {
    const width = matrix.length - 2;
    const height = matrix[0].length - 2;
    const result = Array.from({ length: height }).map(() => Array.from<T>({ length: width }));

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            result[i][j] = matrix[i + 1][j + 1];
        }
    }

    return result;
}

export function cartesianProduct<A, B>(a: A[], b: B[]): [A, B][] {
    const result: [A, B][] = [];

    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < b.length; j++) {
            result.push([a[i], b[j]]);
        }
    }

    return result;
}

export function increasing(a: number, b: number) {
    return a - b;
}

export function decreasing(a: number, b: number) {
    return b - a;
}

export function clone(arr: Vector[]) {
    const res = [] as Vector[];
    arr.forEach((el, i) => {
        res[i] = el.clone();
    });
    return res;
}

export function toLetters(grid: string[]): string {
    const letters: string[] = []
    for (let x = 0; x < grid[0].length; x += 5) {
        let candidates = Object.keys(lettersBySymbol) as (keyof typeof lettersBySymbol)[];
        for (let y = 0; y < grid.length; y++) {
            const str = grid[y].slice(x, x + 4);
            candidates = candidates.filter(c => lettersBySymbol[c][y] == str);
        }
        letters.push(candidates[0]);
    }
    return letters.join("");
}

export type GridInstancer<T> = T | ((pos: Vector) => T);
export function gridOf<T>(width: number, height: number, element: GridInstancer<T>): T[][] {
    const cols: T[][] = [];
    for (let i = 0; i < width; i++) {
        const rows: T[] = [];
        for (let j = 0; j < height; j++) {
            const el = element instanceof Function ? element(new Vector(i, j)) : element;
            rows.push(el);
        }
        cols.push(rows);
    }

    return cols;
}

export function gridMap<T, U>(grid: T[][], transformer: (el: T, i: number, j: number, grid: T[][]) => U): U[][] {
    return grid.map((line, i) => line.map((el, j) => transformer(el, i, j, grid)));
}

export interface Node<T> {
    position: Vector,
    value: T,
}
export type DistancedNode<T> = [node: Node<T>, distance: number];
export type BFSMatcher<T> = (a: Node<T>, b: Node<T>) => boolean;
export type BFSCallback<T> = (node: Node<T>, queue: DistancedNode<T>[]) => boolean;
export interface BFSParameters<T> {
    matcher: BFSMatcher<T>,
    startPosition: Vector,
    endPosition?: Vector,
    endCondition?: BFSCallback<T>,
}
export function toNodes<T>(grid: T[][]): Node<T>[][] {
    return gridMap(grid, (el, i, j) => ({
        position: new Vector(i, j),
        value: el,
    }));
}
export function bfs<T>(grid: Node<T>[][], { matcher, startPosition, endPosition, endCondition }: BFSParameters<T>) {
    if (endPosition == null && endCondition == null)
        throw new Error("Either endPosition or endCondition must not be null");

    // Set of positions
    const visited: Set<string> = new Set([startPosition.toString()]);
    const q: DistancedNode<T>[] = [[startPosition.getIn(grid)!, 0]];

    while (q.length != 0) {
        const el = q.shift()!;

        if ((endPosition != null && el[0].position.eq(endPosition)) || (endCondition != null && endCondition(el[0], q))) {
            return el[1];
        }

        Vector.DIRECTIONS.forEach(dir => {
            const target = el[0].position.add(dir);
            if (target.getIn(grid) != null && !visited.has(target.toString()) && matcher(el[0], target.getIn(grid)!)) {
                q.push([target.getIn(grid)!, el[1] + 1]);
                visited.add(target.toString());
            }
        });
    }

    return -1;
}

export function toInt(value: string) {
    return parseInt(value, 10);
}

export function getCellsAtDistance<T>(grid: T[][], pos: Vector, distance: number) {
    const center = new Vector(distance, distance);
    const cells: T[][] = [];

    for (let x = pos.x - distance; x <= pos.x + distance; x++) {
        const column: T[] = [];
        for (let y = pos.y - distance; y <= pos.y + distance; y++) {
            const current = new Vector(x, y);
            if (current.manhattanDistance(pos) <= distance)
                column.push(current.getIn(grid)!);
        }
        cells.push(column);
    }

    return cells;
}

export type Grid<T> = T[][];
export type WrappedGrid<T> = Grid<Cell<T>>;
export type Cell<T> = {
    position: Vector,
    value: T,
}
export function wrap<T>(grid: Grid<T>): WrappedGrid<T> {
    return gridMap(grid, (el, i, j) => ({
        position: new Vector(i, j),
        value: el,
    }));
}

export function isInManhattanRadius(center: Vector, distance: number, point: Vector) {
    return point.manhattanDistance(center) <= distance;
}

/**
 * Returns the first layer of positions just outside the
 * area accessible by [position] at Manhattan distance [disance].
 * @param position The center of the circle/diamond
 * @param distance The distance between the outer layer of the inside of the diamond and the center
 * @example
 * The area marked with `-` is the area accessible by C at distance 2.
 * This function returns the positions marked by #.
 * 
 *   012345678
 * 0 .........
 * 1 ....#....
 * 2 ...#-#...
 * 3 ..#---#..
 * 4 .#--C--#.
 * 5 ..#---#..
 * 6 ...#-#...
 * 7 ....#....
 * 8 .........
 */
export function manhattanCircle(position: Vector, distance: number): Vector[] {
    const results: Vector[] = [];
    let rendezvous = false;
    for (let dx = 0, y = position.y - distance - 1; dx >= 0; rendezvous ? dx-- : dx++, y++) {
        results.push(new Vector(position.x - dx, y));
        results.push(new Vector(position.x + dx, y));
        if (y == position.y) rendezvous = true;
    }
    // No point in checking every item for uniqueness if the results are many
    if (results.length > 1e4) return results;
    return unique(results, (a, b) => a.eq(b));
}
// #endregion

// #region Classes
export class Vector {
    constructor(public x: number, public y: number) {}

    static DIRECTIONS = "NESW".split("").map(l => this.from(l)!);
    static from(letter: string) {
        switch (letter) {
            case "N":
            case "U":
                return new Vector(0, 1);
            case "S":
            case "D":
                return new Vector(0, -1);
            case "E":
            case "R":
                return new Vector(1, 0);
            case "W":
            case "L":
                return new Vector(-1, 0);
        }
    }

    static intermediate(from: Vector, to: Vector) {
        const positions: Vector[] = [];
        const [fromX, toX] = [Math.min(from.x, to.x), Math.max(from.x, to.x)];
        const [fromY, toY] = [Math.min(from.y, to.y), Math.max(from.y, to.y)];
        for (let x = fromX; x <= toX; x++)
            for (let y = fromY; y <= toY; y++)
                positions.push(new Vector(x, y));
        return positions;
    }

    get sqmag() {
        return this.x ** 2 + this.y ** 2
    }

    get mag() {
        return Math.sqrt(this.sqmag);
    }

    get quadrant() {
        if (this.x < 0)
            return this.y < 0 ? 3 : 2;
        else
            return this.y < 0 ? 4 : 1;
    }

    get direction() {
        if (this.x != 0 && this.y != 0)
            return null;
        if (this.x == 0)
            return this.y > 0 ? "N" : "S";
        else
            return this.x > 0 ? "E" : "W";
    }

    get unit() {
        return new Vector(
            this.x / this.mag,
            this.y / this.mag,
        );
    }

    get tuple() {
        return [this.x, this.y];
    }

    add(vec: Vector): Vector {
        return new Vector(this.x + vec.x, this.y + vec.y);
    }

    subtract(vec: Vector): Vector {
        return this.add(vec.neg());
    }

    manhattanDistance(vec: Vector) {
        const deltaX = vec.x - this.x;
        const deltaY = vec.y - this.y;
        return Math.abs(deltaX) + Math.abs(deltaY);
    }

    isAdjacentTo(vec: Vector) {
        return Math.sqrt((vec.x - this.x) ** 2 + (vec.y - this.y) ** 2) < 2;
    }

    neg() {
        return new Vector(-this.x, -this.y);
    }

    gt(other: Vector) {
        return other.mag < this.mag;
    }

    eq(other: Vector) {
        return this.x === other.x && this.y === other.y;
    }

    clone() {
        return new Vector(this.x, this.y);
    }

    get [Symbol.toStringTag]() {
        return "Vector";
    }
    
    toString() {
        return `(${this.x}; ${this.y})`
    }

    getIn<T>(grid: T[][]): T | null {
        return grid[this.x]?.[this.y];
    }
}

type RangeCallback = (index: number) => void;
export class Range {
    from: number;
    to: number;
    step: number;

    constructor(from: number, to?: number, step = 1) {
        if (to == null) {
            this.from = 0;
            this.to = from;
        } else {
            this.from = from;
            this.to = to;
        }
        this.step = ~~step;
    }

    get size() {
        return Math.ceil((this.to - this.from) / this.step);
    }

    withStep(step: number) {
        return new Range(this.from, this.to, step);
    }

    toArray() {
        const result: number[] = [];
        this.forEach(result.push.bind(result));
        return result;
    }

    forEach(callback: RangeCallback) {
        if (this.step > 0)
            for (let i = this.from; i < this.to; i += this.step)
                callback(i);
        else {
            // this.step < 0
            // deno-lint-ignore for-direction
            for (let i = this.from; i > this.to; i += this.step)
                callback(i);
        }
    }

    contains(num: number) {
        return num.betweenEx(this.from, this.to);
    }
}
// #endregion

// #region Misc
export enum Tristate {
    yes = -1,
    maybe = 0,
    no = 1,
}
// deno-lint-ignore no-namespace
export namespace Tristate {
    export function fromBoolean(bool: boolean) {
        return bool ? Tristate.yes : Tristate.no;
    }
    export function toBoolean(state: Tristate) {
        switch (state) {
            case Tristate.yes: return true;
            case Tristate.no: return false;
            default: throw new TypeError("State is Tristate.maybe");
        }
    }
}
// #endregion

// #region NPM
import deepEqual from "npm:deep-equal@^2.1.0";
export { deepEqual };
// #endregion