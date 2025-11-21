import { CommitZero } from "../chrono/Graph.js";
import { Identifier } from "../chrono/Identifier.js";
import { Mixin } from "../class/Mixin.js";
import { DEBUG, debug, SourceLinePoint } from "../environment/Debug.js";
import { runGeneratorSyncWithEffect } from "../primitives/Calculation.js";
import { EntityMeta } from "../schema/EntityMeta.js";
import { Field } from "../schema/Field.js";
import { defineProperty, uppercaseFirst } from "../util/Helpers.js";
import { MinimalEntityIdentifier } from "./Identifier.js";
const isEntityMarker = Symbol('isEntity');
export class Entity extends Mixin([], (base) => {
    class Entity extends base {
        [isEntityMarker]() { }
        get $entity() {
            return createEntityOnPrototype(this.constructor.prototype);
        }
        get $() {
            const $ = {};
            this.$entity.forEachField((field, name) => {
                $[name] = this.createFieldIdentifier(field);
            });
            if (DEBUG) {
                const proxy = new Proxy($, {
                    get(entity, property, receiver) {
                        if (!entity[property])
                            debug(new Error(`Attempt to read a missing field ${String(property)} on ${entity}`));
                        entity[property].SOURCE_POINT = SourceLinePoint.fromThisCall();
                        return entity[property];
                    }
                });
                return defineProperty(this, '$', proxy);
            }
            else {
                return defineProperty(this, '$', $);
            }
        }
        get $$() {
            return defineProperty(this, '$$', MinimalEntityIdentifier.new({
                name: this.$entityName,
                entity: this.$entity,
                calculation: this.calculateSelf,
                context: this,
                self: this,
            }));
        }
        get $entityName() {
            return this.constructor.name || this.$entity.name;
        }
        *calculateSelf() {
            return this;
        }
        createFieldIdentifier(field) {
            const name = field.name;
            const entity = this.$entity;
            const constructor = this.constructor;
            const skeleton = entity.$skeleton;
            if (!skeleton[name])
                skeleton[name] = constructor.getIdentifierTemplateClass(this, field);
            const identifier = new skeleton[name]();
            identifier.context = this;
            identifier.self = this;
            identifier.name = `${this.$$.name}.$.${field.name}`;
            return identifier;
        }
        forEachFieldIdentifier(func) {
            this.$entity.forEachField((field, name) => func(this.$[name], name));
        }
        enterGraph(replica) {
            if (this.graph)
                throw new Error('Already entered replica');
            this.graph = replica;
            replica.addIdentifier(this.$$);
            this.$entity.forEachField((field, name) => {
                const identifier = this.$[name];
                replica.addIdentifier(identifier, identifier.DATA);
                identifier.DATA = undefined;
            });
        }
        leaveGraph(graph) {
            const ownGraph = this.graph;
            const removeFrom = graph || ownGraph;
            if (!removeFrom)
                return;
            this.$entity.forEachField((field, name) => removeFrom.removeIdentifier(this.$[name]));
            removeFrom.removeIdentifier(this.$$);
            if (removeFrom === ownGraph)
                this.graph = undefined;
        }
        propagate(arg) {
            return this.commit(arg);
        }
        commit(arg) {
            const graph = this.graph;
            if (!graph)
                return CommitZero;
            return graph.commit(arg);
        }
        async propagateAsync() {
            return this.commitAsync();
        }
        async commitAsync(arg) {
            const graph = this.graph;
            if (!graph)
                return Promise.resolve(CommitZero);
            return graph.commitAsync(arg);
        }
        static get $entity() {
            return ensureEntityOnPrototype(this.prototype);
        }
        static getIdentifierTemplateClass(me, field) {
            const name = field.name;
            const config = {
                name: `${me.$$.name}.$.${name}`,
                field: field
            };
            if (field.hasOwnProperty('sync'))
                config.sync = field.sync;
            if (field.hasOwnProperty('lazy'))
                config.lazy = field.lazy;
            if (field.hasOwnProperty('equality'))
                config.equality = field.equality;
            const calculationFunction = me.$calculations && me[me.$calculations[name]];
            if (calculationFunction)
                config.calculation = calculationFunction;
            const writeFunction = me.$writes && me[me.$writes[name]];
            if (writeFunction)
                config.write = writeFunction;
            const buildProposedFunction = me.$buildProposed && me[me.$buildProposed[name]];
            if (buildProposedFunction) {
                config.buildProposedValue = buildProposedFunction;
                config.proposedValueIsBuilt = true;
            }
            const template = field.getIdentifierClass(calculationFunction).new(config);
            const TemplateClass = function () { };
            TemplateClass.prototype = template;
            return TemplateClass;
        }
        run(methodName, ...args) {
            const onEffect = (effect) => {
                if (effect instanceof Identifier)
                    return this.graph.read(effect);
                throw new Error("Helper methods can not yield effects during computation");
            };
            return runGeneratorSyncWithEffect(onEffect, this[methodName], args, this);
        }
        static createPropertyAccessorsFor(fieldName) {
            const propertyKey = fieldName;
            const target = this.prototype;
            Object.defineProperty(target, propertyKey, {
                get: function () {
                    return this.$[propertyKey].getFromGraph(this.graph);
                },
                set: function (value) {
                    this.$[propertyKey].writeToGraph(this.graph, value);
                }
            });
        }
        static createMethodAccessorsFor(fieldName) {
            const propertyKey = fieldName;
            const target = this.prototype;
            const getterFnName = `get${uppercaseFirst(propertyKey)}`;
            const setterFnName = `set${uppercaseFirst(propertyKey)}`;
            const putterFnName = `put${uppercaseFirst(propertyKey)}`;
            if (!(getterFnName in target)) {
                target[getterFnName] = function () {
                    return this.$[propertyKey].getFromGraph(this.graph);
                };
            }
            if (!(setterFnName in target)) {
                target[setterFnName] = function (value, ...args) {
                    this.$[propertyKey].writeToGraph(this.graph, value, ...args);
                    return this.graph
                        ?
                            (this.graph.autoCommitMode === 'sync' ? this.graph.commit() : this.graph.commitAsync())
                        :
                            Promise.resolve(CommitZero);
                };
            }
            if (!(putterFnName in target)) {
                target[putterFnName] = function (value, ...args) {
                    this.$[propertyKey].writeToGraph(this.graph, value, ...args);
                };
            }
        }
    }
    return Entity;
}) {
}
export const createEntityOnPrototype = (proto) => {
    let parent = Object.getPrototypeOf(proto);
    return defineProperty(proto, '$entity', EntityMeta.new({
        parentEntity: parent.hasOwnProperty(isEntityMarker) ? null : parent.$entity,
        name: proto.constructor.name
    }));
};
export const ensureEntityOnPrototype = (proto) => {
    if (!proto.hasOwnProperty('$entity'))
        createEntityOnPrototype(proto);
    return proto.$entity;
};
export const generic_field = (fieldConfig, fieldCls = Field) => {
    return function (target, fieldName) {
        const entity = ensureEntityOnPrototype(target);
        const field = entity.addField(fieldCls.new(Object.assign(fieldConfig || {}, {
            name: fieldName
        })));
        const cons = target.constructor;
        cons.createPropertyAccessorsFor(fieldName);
        cons.createMethodAccessorsFor(fieldName);
    };
};
export const field = generic_field;
export const calculate = function (fieldName) {
    return function (target, propertyKey, _descriptor) {
        ensureEntityOnPrototype(target);
        let calculations;
        if (!target.$calculations) {
            calculations = target.$calculations = {};
        }
        else {
            if (!target.hasOwnProperty('$calculations')) {
                calculations = target.$calculations = Object.create(target.$calculations);
            }
            else
                calculations = target.$calculations;
        }
        calculations[fieldName] = propertyKey;
    };
};
export const write = function (fieldName) {
    return function (target, propertyKey, _descriptor) {
        ensureEntityOnPrototype(target);
        let writes;
        if (!target.$writes) {
            writes = target.$writes = {};
        }
        else {
            if (!target.hasOwnProperty('$writes')) {
                writes = target.$writes = Object.create(target.$writes);
            }
            else
                writes = target.$writes;
        }
        writes[fieldName] = propertyKey;
    };
};
export const build_proposed = function (fieldName) {
    return function (target, propertyKey, _descriptor) {
        ensureEntityOnPrototype(target);
        let buildProposed;
        if (!target.$buildProposed) {
            buildProposed = target.$buildProposed = {};
        }
        else {
            if (!target.hasOwnProperty('$buildProposed')) {
                buildProposed = target.$buildProposed = Object.create(target.$buildProposed);
            }
            else
                buildProposed = target.$buildProposed;
        }
        buildProposed[fieldName] = propertyKey;
    };
};
