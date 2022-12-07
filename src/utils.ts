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

export function increasing(a: number, b: number) {
    return a - b;
}
// #endregion

// #region Classes
export class Vector {
    constructor(public x: number, public y: number) {}

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

    neg() {
        return new Vector(-this.x, -this.y);
    }

    gt(other: Vector) {
        return other.mag < this.mag;
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
}
// #endregion