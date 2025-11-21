var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CalculatedValueSync, Levels, QuarkSync } from "../chrono/Identifier.js";
import { isInstanceOf, Mixin } from "../class/Mixin.js";
import { Field } from "../schema/Field.js";
import { prototypeValue } from "../util/Helpers.js";
import { Entity, generic_field } from "./Entity.js";
import { FieldIdentifier } from "./Identifier.js";
export class ReferenceField extends Mixin([Field], (base) => class ReferenceField extends base {
    constructor() {
        super(...arguments);
        this.identifierCls = MinimalReferenceIdentifier;
    }
}) {
}
export const reference = (fieldConfig, fieldCls = ReferenceField) => generic_field(fieldConfig, fieldCls);
export class ReferenceIdentifier extends Mixin([FieldIdentifier], (base) => {
    class ReferenceIdentifier extends base {
        constructor() {
            super(...arguments);
            this.field = undefined;
            this.proposedValueIsBuilt = true;
        }
        hasBucket() {
            return Boolean(this.field.bucket);
        }
        getBucket(entity) {
            return entity.$[this.field.bucket];
        }
        buildProposedValue(me, quark, transaction) {
            const proposedValue = quark.proposedValue;
            if (proposedValue === null)
                return null;
            const value = isInstanceOf(proposedValue, Entity) ? proposedValue : me.resolve(proposedValue);
            if (value && me.hasBucket()) {
                me.getBucket(value).addToBucket(transaction, me.self);
            }
            return value;
        }
        resolve(locator) {
            const resolver = this.field.resolver;
            return resolver ? resolver.call(this.self, locator) : null;
        }
        enterGraph(graph) {
            if (this.hasBucket()) {
                const value = graph.activeTransaction.readProposedOrPrevious(this);
                if (value instanceof Entity) {
                    this.getBucket(value).addToBucket(graph.activeTransaction, this.self);
                }
            }
            super.enterGraph(graph);
        }
        leaveGraph(graph) {
            if (this.hasBucket()) {
                const value = graph.activeTransaction.readProposedOrPrevious(this);
                if (value instanceof Entity) {
                    this.getBucket(value).removeFromBucket(graph.activeTransaction, this.self);
                }
            }
            super.leaveGraph(graph);
        }
        write(me, transaction, q, proposedValue) {
            const quark = q || transaction.acquireQuarkIfExists(me);
            if (me.hasBucket()) {
                if (quark) {
                    const prevValue = quark.getValue();
                    if (prevValue instanceof Entity) {
                        me.getBucket(prevValue).removeFromBucket(transaction, me.self);
                    }
                }
                else if (transaction.baseRevision.hasIdentifier(me)) {
                    const value = transaction.readPrevious(me);
                    if (value instanceof Entity) {
                        me.getBucket(value).removeFromBucket(transaction, me.self);
                    }
                }
            }
            super.write(me, transaction, q, proposedValue);
        }
    }
    __decorate([
        prototypeValue(Levels.DependsOnlyOnUserInput)
    ], ReferenceIdentifier.prototype, "level", void 0);
    __decorate([
        prototypeValue(QuarkSync)
    ], ReferenceIdentifier.prototype, "quarkClass", void 0);
    return ReferenceIdentifier;
}) {
}
export class MinimalReferenceIdentifier extends ReferenceIdentifier.mix(FieldIdentifier.mix(CalculatedValueSync)) {
}
