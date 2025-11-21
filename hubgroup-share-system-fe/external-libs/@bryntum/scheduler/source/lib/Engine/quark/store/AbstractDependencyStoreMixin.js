import { Mixin } from "../../../ChronoGraph/class/Mixin.js";
import { AbstractPartOfProjectStoreMixin } from "./mixin/AbstractPartOfProjectStoreMixin.js";
import { CIFromSetOrArrayOrValue } from '../../util/Functions.js';
export class AbstractDependencyStoreMixin extends Mixin([AbstractPartOfProjectStoreMixin], (base) => {
    const superProto = base.prototype;
    class AbstractDependencyStoreMixin extends base {
        constructor() {
            super(...arguments);
            this.dependenciesForRemoval = new Set();
            this.allDependenciesForRemoval = false;
        }
        remove(records, silent) {
            this.dependenciesForRemoval = CIFromSetOrArrayOrValue(records).toSet();
            const res = superProto.remove.call(this, records);
            this.dependenciesForRemoval.clear();
            return res;
        }
        removeAll(silent) {
            this.allDependenciesForRemoval = true;
            const res = superProto.removeAll.call(this, silent);
            this.allDependenciesForRemoval = false;
            return res;
        }
    }
    return AbstractDependencyStoreMixin;
}) {
}
