import { MAX_SMI } from "./Helpers.js";
export class LeveledQueue {
    constructor() {
        this.length = 0;
        this.levels = [];
        this.lowestLevel = MAX_SMI;
    }
    getLowestLevel() {
        for (let i = this.lowestLevel !== MAX_SMI ? this.lowestLevel : 0; i < this.levels.length; i++) {
            if (this.levels[i])
                return this.lowestLevel = i;
        }
        return this.lowestLevel = MAX_SMI;
    }
    takeLowestLevel() {
        for (let i = this.lowestLevel !== MAX_SMI ? this.lowestLevel : 0; i < this.levels.length; i++) {
            const level = this.levels[i];
            if (level) {
                this.length -= level.length;
                this.levels[i] = null;
                this.lowestLevel = i + 1;
                return level;
            }
        }
    }
    pop() {
        for (let i = this.lowestLevel !== MAX_SMI ? this.lowestLevel : 0; i < this.levels.length; i++) {
            const level = this.levels[i];
            this.lowestLevel = i;
            if (level && level.length > 0) {
                this.length--;
                return level.pop();
            }
        }
        this.lowestLevel = MAX_SMI;
    }
    push(el) {
        const elLevel = el.level;
        let level = this.levels[elLevel];
        if (!level) {
            for (let i = this.levels.length; i < elLevel; i++)
                this.levels[i] = null;
            level = this.levels[elLevel] = [];
        }
        level.push(el);
        this.length++;
        if (elLevel < this.lowestLevel)
            this.lowestLevel = elLevel;
    }
    *[Symbol.iterator]() {
        for (let i = 0; i < this.levels.length; i++) {
            const level = this.levels[i];
            if (level)
                yield* level;
        }
    }
}
