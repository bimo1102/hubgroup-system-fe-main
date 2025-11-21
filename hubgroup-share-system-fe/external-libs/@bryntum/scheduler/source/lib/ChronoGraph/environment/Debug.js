import { Base } from "../class/Base.js";
import { CI } from "../collection/Iterator.js";
import { matchAll } from "../util/Helpers.js";
export const DEBUG = false;
const emptyFn = (...args) => undefined;
export const DEBUG_ONLY = (func) => DEBUG ? func : emptyFn;
export const debug = DEBUG_ONLY((e) => {
    debugger;
});
export const warn = DEBUG_ONLY((e) => {
    if (typeof console !== 'undefined')
        console.warn(e);
});
export class StackEntry extends Base {
}
export class SourceLinePoint extends Base {
    constructor() {
        super(...arguments);
        this.stackEntries = [];
    }
    static fromError(e) {
        const res = SourceLinePoint.new({
            exception: e,
            stackEntries: parseErrorStack(e.stack)
        });
        return res;
    }
    static fromThisCall() {
        const sourceLinePoint = this.fromError(new Error());
        sourceLinePoint.stackEntries.splice(0, 2);
        return sourceLinePoint;
    }
}
const parseErrorStack = (stack) => {
    return CI(matchAll(/^   +at\s*(.*?)\s*\((https?:\/\/.*?):(\d+):(\d+)/gm, stack))
        .map(match => StackEntry.new({
        statement: match[1],
        sourceFile: match[2],
        sourceLine: Number(match[3]),
        sourceCharPos: Number(match[4])
    }))
        .toArray();
};
