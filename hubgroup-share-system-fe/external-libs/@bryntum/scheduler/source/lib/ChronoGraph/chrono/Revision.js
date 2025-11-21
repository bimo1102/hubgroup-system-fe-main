import { Base } from "../class/Base.js";
import { TombStone } from "./Quark.js";
let CLOCK = 0;
export class Revision extends Base {
    constructor() {
        super(...arguments);
        this.createdAt = CLOCK++;
        this.name = 'revision-' + this.createdAt;
        this.previous = undefined;
        this.scope = new Map();
        this.reachableCount = 0;
        this.referenceCount = 0;
        this.selfDependent = new Set();
    }
    getLatestEntryFor(identifier) {
        let revision = this;
        while (revision) {
            const entry = revision.scope.get(identifier);
            if (entry)
                return entry;
            revision = revision.previous;
        }
        return null;
    }
    hasIdentifier(identifier) {
        const latestEntry = this.getLatestEntryFor(identifier);
        return Boolean(latestEntry && latestEntry.getValue() !== TombStone);
    }
    *previousAxis() {
        let revision = this;
        while (revision) {
            yield revision;
            revision = revision.previous;
        }
    }
}
