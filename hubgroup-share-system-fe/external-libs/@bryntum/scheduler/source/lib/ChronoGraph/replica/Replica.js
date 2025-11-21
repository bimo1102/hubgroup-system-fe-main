import { ChronoGraph } from "../chrono/Graph.js";
import { Mixin } from "../class/Mixin.js";
export var ReadMode;
(function (ReadMode) {
    ReadMode[ReadMode["Current"] = 0] = "Current";
    ReadMode[ReadMode["Previous"] = 1] = "Previous";
    ReadMode[ReadMode["ProposedOrPrevious"] = 2] = "ProposedOrPrevious";
    ReadMode[ReadMode["CurrentOrProposedOrPrevious"] = 3] = "CurrentOrProposedOrPrevious";
})(ReadMode || (ReadMode = {}));
export class Replica extends Mixin([ChronoGraph], (base) => class Replica extends base {
    constructor() {
        super(...arguments);
        this.autoCommit = true;
        this.readMode = ReadMode.Current;
    }
    addEntity(entity) {
        entity.enterGraph(this);
    }
    addEntities(entities) {
        entities.forEach(entity => this.addEntity(entity));
    }
    removeEntity(entity) {
        entity.leaveGraph(this);
    }
    removeEntities(entities) {
        entities.forEach(entity => this.removeEntity(entity));
    }
}) {
}
