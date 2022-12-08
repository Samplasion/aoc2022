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
    return this > lower && this < upper;
}
// #endregion

// #region Functions
export function unique<T>(...elements: T[]): T[] {
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
// #endregion

// #region Classes
export class Vector {
    constructor(public x: number, public y: number) {}

    static DIRECTIONS = "NESW".split("").map(l => this.from(l)!);
    static from(letter: string) {
        switch (letter) {
            case "N":
            case "U":
                return new Vector(0, -1);
            case "S":
            case "D":
                return new Vector(0, 1);
            case "E":
            case "R":
                return new Vector(1, 0);
            case "W":
            case "L":
                return new Vector(-1, 0);
        }
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

    add(vec: Vector): Vector {
        return new Vector(this.x + vec.x, this.y + vec.y);
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
        for (let i = this.from; i < this.to; i += this.step)
            callback(i);
    }

    contains(num: number) {
        return num.betweenEx(this.from, this.to);
    }
}
// #endregion