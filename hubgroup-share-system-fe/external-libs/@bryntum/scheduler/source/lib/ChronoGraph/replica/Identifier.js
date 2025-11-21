import { CalculatedValueGen, CalculatedValueSync, Identifier, Variable } from "../chrono/Identifier.js";
import { Mixin } from "../class/Mixin.js";
import { ReadMode } from "./Replica.js";
export class FieldIdentifier extends Mixin([Identifier], (base) => class FieldIdentifier extends base {
    constructor() {
        super(...arguments);
        this.field = undefined;
        this.self = undefined;
        this.DATA = undefined;
    }
    getFromGraph(graph) {
        if (graph) {
            if (graph.readMode === ReadMode.Current)
                return graph.get(this);
            if (graph.readMode === ReadMode.Previous)
                return graph.activeTransaction.readPrevious(this);
            if (graph.readMode === ReadMode.ProposedOrPrevious)
                graph.activeTransaction.readProposedOrPrevious(this);
            return graph.activeTransaction.readCurrentOrProposedOrPrevious(this);
        }
        else
            return this.DATA;
    }
    readFromGraph(graph) {
        if (graph)
            return graph.read(this);
        else
            return this.DATA;
    }
    writeToGraph(graph, proposedValue, ...args) {
        if (graph)
            graph.write(this, proposedValue, ...args);
        else
            this.DATA = proposedValue;
    }
    leaveGraph(graph) {
        const entry = graph.activeTransaction.getLatestStableEntryFor(this);
        if (entry)
            this.DATA = entry.getValue();
        super.leaveGraph(graph);
    }
    toString() {
        return this.name;
    }
}) {
}
export class MinimalFieldIdentifierSync extends FieldIdentifier.mix(CalculatedValueSync) {
}
export class MinimalFieldIdentifierGen extends FieldIdentifier.mix(CalculatedValueGen) {
}
export class MinimalFieldVariable extends FieldIdentifier.mix(Variable) {
}
export class EntityIdentifier extends Mixin([Identifier], (base) => class EntityIdentifier extends base {
    constructor() {
        super(...arguments);
        this.entity = undefined;
        this.self = undefined;
    }
    equality() {
        return false;
    }
    toString() {
        return `Entity identifier [${this.self}]`;
    }
}) {
}
export class MinimalEntityIdentifier extends EntityIdentifier.mix(CalculatedValueGen) {
}
