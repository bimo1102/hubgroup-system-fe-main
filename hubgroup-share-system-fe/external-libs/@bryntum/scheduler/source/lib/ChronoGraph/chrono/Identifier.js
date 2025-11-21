var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Base } from "../class/Base.js";
import { CalculationGen, CalculationSync } from "../primitives/Calculation.js";
import { prototypeValue } from "../util/Helpers.js";
import { ProposedOrPrevious } from "./Effect.js";
import { Quark } from "./Quark.js";
export var Levels;
(function (Levels) {
    Levels[Levels["UserInput"] = 0] = "UserInput";
    Levels[Levels["DependsOnlyOnUserInput"] = 1] = "DependsOnlyOnUserInput";
    Levels[Levels["DependsOnlyOnDependsOnlyOnUserInput"] = 2] = "DependsOnlyOnDependsOnlyOnUserInput";
    Levels[Levels["DependsOnSelfKind"] = 3] = "DependsOnSelfKind";
})(Levels || (Levels = {}));
export class Meta extends Base {
    constructor() {
        super(...arguments);
        this.name = undefined;
        this.lazy = false;
        this.total = true;
        this.pure = true;
        this.proposedValueIsBuilt = false;
    }
    calculation(Y) {
        throw new Error("Abstract method `calculation` called");
    }
    equality(v1, v2) {
        return v1 === v2;
    }
}
__decorate([
    prototypeValue(Levels.DependsOnSelfKind)
], Meta.prototype, "level", void 0);
__decorate([
    prototypeValue(true)
], Meta.prototype, "sync", void 0);
export class Identifier extends Meta {
    constructor() {
        super(...arguments);
        this.context = undefined;
    }
    newQuark(createdAt) {
        const newQuark = this.quarkClass.new();
        newQuark.createdAt = createdAt;
        newQuark.identifier = this;
        newQuark.needToBuildProposedValue = this.proposedValueIsBuilt;
        return newQuark;
    }
    write(me, transaction, quark, proposedValue, ...args) {
        quark = quark || transaction.getWriteTarget(me);
        quark.proposedValue = proposedValue;
        quark.proposedArguments = args.length > 0 ? args : undefined;
    }
    writeToTransaction(transaction, proposedValue, ...args) {
        transaction.write(this, proposedValue, ...args);
    }
    writeToGraph(graph, proposedValue, ...args) {
        graph.write(this, proposedValue, ...args);
    }
    readFromGraphAsync(graph) {
        return graph.readAsync(this);
    }
    readFromGraph(graph) {
        return graph.read(this);
    }
    readFromTransaction(transaction) {
        return transaction.read(this);
    }
    readFromTransactionAsync(transaction) {
        return transaction.readAsync(this);
    }
    buildProposedValue(me, quark, transaction) {
        return undefined;
    }
    enterGraph(graph) {
    }
    leaveGraph(graph) {
    }
}
export const IdentifierC = (config) => Identifier.new(config);
export const QuarkSync = Quark.mix(CalculationSync.mix(Map));
export const QuarkGen = Quark.mix(CalculationGen.mix(Map));
export class Variable extends Identifier {
    calculation(YIELD) {
        throw new Error("The 'calculation' method of the variables will never be called. Instead the value will be set directly to quark");
    }
    write(me, transaction, quark, proposedValue, ...args) {
        quark = quark || transaction.getWriteTarget(me);
        quark.value = proposedValue;
        quark.proposedArguments = args.length > 0 ? args : undefined;
    }
}
__decorate([
    prototypeValue(Levels.UserInput)
], Variable.prototype, "level", void 0);
__decorate([
    prototypeValue(QuarkSync)
], Variable.prototype, "quarkClass", void 0);
export function VariableC(...args) {
    return Variable.new(...args);
}
export class CalculatedValueSync extends Identifier {
    calculation(YIELD) {
        return YIELD(ProposedOrPrevious);
    }
}
__decorate([
    prototypeValue(QuarkSync)
], CalculatedValueSync.prototype, "quarkClass", void 0);
export function CalculatedValueSyncC(...args) {
    return CalculatedValueSync.new(...args);
}
export class CalculatedValueGen extends Identifier {
    *calculation(YIELD) {
        return yield ProposedOrPrevious;
    }
}
__decorate([
    prototypeValue(QuarkGen)
], CalculatedValueGen.prototype, "quarkClass", void 0);
export function CalculatedValueGenC(...args) {
    return CalculatedValueGen.new(...args);
}
export const throwUnknownIdentifier = (identifier) => { throw new Error(`Unknown identifier ${identifier}`); };
