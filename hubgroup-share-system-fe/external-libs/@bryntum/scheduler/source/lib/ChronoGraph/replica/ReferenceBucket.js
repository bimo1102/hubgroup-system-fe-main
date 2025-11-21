var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CalculatedValueSync, Levels, QuarkSync } from "../chrono/Identifier.js";
import { Quark, TombStone } from "../chrono/Quark.js";
import { Mixin } from "../class/Mixin.js";
import { Field } from "../schema/Field.js";
import { prototypeValue } from "../util/Helpers.js";
import { generic_field } from "./Entity.js";
import { FieldIdentifier } from "./Identifier.js";
export class ReferenceBucketField extends Mixin([Field], (base) => class ReferenceBucketField extends base {
    constructor() {
        super(...arguments);
        this.persistent = false;
        this.identifierCls = MinimalReferenceBucketIdentifier;
    }
}) {
}
export const bucket = (fieldConfig, fieldCls = ReferenceBucketField) => generic_field(fieldConfig, fieldCls);
var BucketMutationType;
(function (BucketMutationType) {
    BucketMutationType["Add"] = "Add";
    BucketMutationType["Remove"] = "Remove";
})(BucketMutationType || (BucketMutationType = {}));
export class ReferenceBucketQuark extends Mixin([Quark], (base) => class ReferenceBucketQuark extends base {
    constructor() {
        super(...arguments);
        this.mutations = [];
        this.previousValue = undefined;
    }
    hasProposedValueInner() {
        return this.mutations.length > 0;
    }
}) {
}
export const MinimalReferenceBucketQuark = ReferenceBucketQuark.mix(QuarkSync);
export class ReferenceBucketIdentifier extends Mixin([FieldIdentifier], (base) => {
    class ReferenceBucketIdentifier extends base {
        constructor() {
            super(...arguments);
            this.proposedValueIsBuilt = true;
        }
        addToBucket(transaction, entity) {
            const quark = transaction.getWriteTarget(this);
            quark.mutations.push({ type: BucketMutationType.Add, entity });
            const baseRevision = transaction.baseRevision;
            if (!quark.previousValue && baseRevision.hasIdentifier(this))
                quark.previousValue = transaction.readPrevious(this);
        }
        removeFromBucket(transaction, entity) {
            const preQuark = transaction.entries.get(this);
            if (preQuark && preQuark.getValue() === TombStone)
                return;
            const quark = transaction.getWriteTarget(this);
            quark.mutations.push({ type: BucketMutationType.Remove, entity });
            const baseRevision = transaction.baseRevision;
            if (!quark.previousValue && baseRevision.hasIdentifier(this))
                quark.previousValue = transaction.readPrevious(this);
        }
        buildProposedValue(me, quarkArg, transaction) {
            const quark = quarkArg;
            const newValue = new Set(quark.previousValue);
            for (let i = 0; i < quark.mutations.length; i++) {
                const { type, entity } = quark.mutations[i];
                if (type === BucketMutationType.Remove) {
                    newValue.delete(entity);
                }
                else if (type === BucketMutationType.Add) {
                    newValue.add(entity);
                }
            }
            return newValue;
        }
        leaveGraph(graph) {
            super.leaveGraph(graph);
            this.DATA = undefined;
        }
    }
    __decorate([
        prototypeValue(Levels.DependsOnlyOnDependsOnlyOnUserInput)
    ], ReferenceBucketIdentifier.prototype, "level", void 0);
    __decorate([
        prototypeValue(MinimalReferenceBucketQuark)
    ], ReferenceBucketIdentifier.prototype, "quarkClass", void 0);
    return ReferenceBucketIdentifier;
}) {
}
export class MinimalReferenceBucketIdentifier extends ReferenceBucketIdentifier.mix(FieldIdentifier.mix(CalculatedValueSync)) {
}
