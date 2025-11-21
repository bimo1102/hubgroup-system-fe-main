import { CI, MI } from "../collection/Iterator.js";
const MixinInstanceOfProperty = Symbol('MixinIdentity');
const MixinStateProperty = Symbol('MixinStateProperty');
class MixinWalkDepthState {
    constructor() {
        this.baseEl = undefined;
        this.sourceEl = undefined;
        this.$elementsByTopoLevel = undefined;
        this.$topoLevels = undefined;
        this.linearizedByTopoLevelsSource = MI(this.linearizedByTopoLevels());
    }
    static new(props) {
        const me = new this();
        props && Object.assign(me, props);
        return me;
    }
    get topoLevels() {
        if (this.$topoLevels !== undefined)
            return this.$topoLevels;
        return this.$topoLevels = this.buildTopoLevels();
    }
    buildTopoLevels() {
        return Array.from(this.elementsByTopoLevel.keys()).sort((level1, level2) => level1 - level2);
    }
    get elementsByTopoLevel() {
        if (this.$elementsByTopoLevel !== undefined)
            return this.$elementsByTopoLevel;
        return this.$elementsByTopoLevel = this.buildElementsByTopoLevel();
    }
    getOrCreateLevel(map, topoLevel) {
        let elementsAtLevel = map.get(topoLevel);
        if (!elementsAtLevel) {
            elementsAtLevel = [];
            map.set(topoLevel, elementsAtLevel);
        }
        return elementsAtLevel;
    }
    buildElementsByTopoLevel() {
        let maxTopoLevel = 0;
        const baseElements = this.baseEl ? CI(this.baseEl.walkDepthState.elementsByTopoLevel.values()).concat().toSet() : new Set();
        const map = CI(this.sourceEl.requirements)
            .map(mixin => mixin.walkDepthState.elementsByTopoLevel)
            .concat()
            .reduce((elementsByTopoLevel, [topoLevel, mixins]) => {
            if (topoLevel > maxTopoLevel)
                maxTopoLevel = topoLevel;
            this.getOrCreateLevel(elementsByTopoLevel, topoLevel).push(mixins);
            return elementsByTopoLevel;
        }, new Map());
        this.getOrCreateLevel(map, maxTopoLevel + 1).push([this.sourceEl]);
        return CI(map).map(([level, elements]) => {
            return [level, CI(elements).concat().uniqueOnly().filter(mixin => !baseElements.has(mixin)).sort((mixin1, mixin2) => mixin1.id - mixin2.id)];
        }).toMap();
    }
    *linearizedByTopoLevels() {
        yield* CI(this.topoLevels).map(level => this.elementsByTopoLevel.get(level)).concat();
    }
}
let MIXIN_ID = 1;
export const identity = a => class extends a {
};
export class ZeroBaseClass {
}
class MixinState {
    constructor() {
        this.id = MIXIN_ID++;
        this.requirements = [];
        this.baseClass = ZeroBaseClass;
        this.identitySymbol = undefined;
        this.mixinLambda = identity;
        this.walkDepthState = undefined;
        this.$minimalClass = undefined;
        this.name = '';
    }
    static new(props) {
        const me = new this();
        props && Object.assign(me, props);
        me.walkDepthState = MixinWalkDepthState.new({ sourceEl: me, baseEl: getMixinState(me.baseClass) });
        const mixinLambda = me.mixinLambda;
        const symbol = me.identitySymbol = Symbol(mixinLambda.name);
        const mixinLambdaWrapper = Object.assign(function (base) {
            const extendedClass = mixinLambda(base);
            extendedClass.prototype[symbol] = true;
            return extendedClass;
        }, {
            [MixinInstanceOfProperty]: symbol,
            [MixinStateProperty]: me
        });
        Object.defineProperty(mixinLambdaWrapper, Symbol.hasInstance, { value: isInstanceOfStatic });
        me.mixinLambda = mixinLambdaWrapper;
        return me;
    }
    get minimalClass() {
        if (this.$minimalClass !== undefined)
            return this.$minimalClass;
        return this.$minimalClass = this.buildMinimalClass();
    }
    getBaseClassMixinId(baseClass) {
        const constructor = this.constructor;
        const mixinId = constructor.baseClassesIds.get(baseClass);
        if (mixinId !== undefined)
            return mixinId;
        const newId = MIXIN_ID++;
        constructor.baseClassesIds.set(baseClass, newId);
        return newId;
    }
    buildMinimalClass() {
        const self = this.constructor;
        let baseCls = this.baseClass;
        const minimalClassConstructor = this.walkDepthState.linearizedByTopoLevelsSource.reduce((acc, mixin) => {
            const { cls, hash } = acc;
            const nextHash = hash + String.fromCharCode(mixin.id);
            let wrapperCls = self.minimalClassesByLinearHash.get(nextHash);
            if (!wrapperCls) {
                wrapperCls = mixin.mixinLambda(cls);
                mixin.name = wrapperCls.name;
                self.minimalClassesByLinearHash.set(nextHash, wrapperCls);
            }
            acc.cls = wrapperCls;
            acc.hash = nextHash;
            return acc;
        }, { cls: baseCls, hash: String.fromCharCode(this.getBaseClassMixinId(baseCls)) }).cls;
        const minimalClass = Object.assign(minimalClassConstructor, {
            [MixinInstanceOfProperty]: this.identitySymbol,
            [MixinStateProperty]: this,
            mix: this.mixinLambda,
            derive: (base) => Mixin([minimalClass, base], base => class extends base {
            }),
            $: this,
            toString: this.toString.bind(this)
        });
        Object.defineProperty(minimalClass, Symbol.hasInstance, { value: isInstanceOfStatic });
        return minimalClass;
    }
    toString() {
        return this.walkDepthState.linearizedByTopoLevelsSource.reduce((acc, mixin) => `${mixin.name}(${acc})`, this.baseClass.name);
    }
}
MixinState.minimalClassesByLinearHash = new Map();
MixinState.baseClassesIds = new Map();
const isMixinClass = (func) => {
    return Object.getPrototypeOf(func.prototype).constructor.hasOwnProperty(MixinStateProperty);
};
const getMixinState = (func) => {
    return Object.getPrototypeOf(func.prototype).constructor[MixinStateProperty];
};
const mixin = (required, mixinLambda) => {
    let baseClass;
    if (required.length > 0) {
        const lastRequirement = required[required.length - 1];
        if (!isMixinClass(lastRequirement) && lastRequirement !== ZeroBaseClass)
            baseClass = lastRequirement;
    }
    const requirements = [];
    required.forEach((requirement, index) => {
        const mixinState = requirement[MixinStateProperty];
        if (mixinState !== undefined) {
            const currentBaseClass = mixinState.baseClass;
            if (currentBaseClass !== ZeroBaseClass) {
                if (baseClass) {
                    if (baseClass !== currentBaseClass) {
                        const currentIsSub = currentBaseClass.prototype.isPrototypeOf(baseClass.prototype);
                        const currentIsSuper = baseClass.prototype.isPrototypeOf(currentBaseClass.prototype);
                        if (!currentIsSub && !currentIsSuper)
                            throw new Error("Base class mismatch");
                        baseClass = currentIsSuper ? currentBaseClass : baseClass;
                    }
                }
                else
                    baseClass = currentBaseClass;
            }
            requirements.push(mixinState);
        }
        else {
            if (index !== required.length - 1)
                throw new Error("Base class should be provided as the last element of the requirements array");
        }
    });
    const mixinState = MixinState.new({
        requirements,
        mixinLambda: mixinLambda,
        baseClass: baseClass || ZeroBaseClass
    });
    return mixinState.minimalClass;
};
const isInstanceOfStatic = function (instance) {
    return Boolean(instance && instance[this[MixinInstanceOfProperty]]);
};
export const isInstanceOf = (instance, func) => {
    return Boolean(instance && instance[func[MixinInstanceOfProperty]]);
};
export const Mixin = mixin;
export const MixinAny = mixin;
