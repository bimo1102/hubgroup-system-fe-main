import { Mixin } from "../../../ChronoGraph/class/BetterMixin.js";
import { CorePartOfProjectStoreMixin } from "./mixin/CorePartOfProjectStoreMixin.js";
import { CoreDependencyMixin } from "../model/scheduler_core/CoreDependencyMixin.js";
import { AbstractDependencyStoreMixin } from "./AbstractDependencyStoreMixin.js";
const emptySet = new Set();
export class CoreDependencyStoreMixin extends Mixin([AbstractDependencyStoreMixin, CorePartOfProjectStoreMixin], (base) => {
    const superProto = base.prototype;
    class CoreDependencyStoreMixin extends base {
        constructor() {
            super(...arguments);
            this.dependenciesForRemoval = new Set();
            this.allDependenciesForRemoval = false;
        }
        static get defaultConfig() {
            return {
                modelClass: CoreDependencyMixin,
                storage: {
                    extraKeys: [
                        { property: 'fromEvent', unique: false },
                        { property: 'toEvent', unique: false }
                    ]
                }
            };
        }
        getIncomingDepsForEvent(event) {
            return this.storage.findItem('toEvent', event) || emptySet;
        }
        getOutgoingDepsForEvent(event) {
            return this.storage.findItem('fromEvent', event) || emptySet;
        }
        set data(value) {
            this.allDependenciesForRemoval = true;
            super.data = value;
            this.allDependenciesForRemoval = false;
        }
        updateIndices() {
            this.storage.rebuildIndices();
        }
        invalidateIndices() {
            this.storage.invalidateIndices();
        }
        onCommitAsync() {
            this.updateIndices();
        }
    }
    return CoreDependencyStoreMixin;
}) {
}
