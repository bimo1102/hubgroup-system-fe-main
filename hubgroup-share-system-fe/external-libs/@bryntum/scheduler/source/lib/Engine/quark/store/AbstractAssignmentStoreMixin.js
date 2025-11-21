import { Mixin } from "../../../ChronoGraph/class/Mixin.js";
import { AbstractPartOfProjectStoreMixin } from "./mixin/AbstractPartOfProjectStoreMixin.js";
import { CIFromSetOrArrayOrValue } from "../../util/Functions.js";
export class AbstractAssignmentStoreMixin extends Mixin([AbstractPartOfProjectStoreMixin], (base) => {
    const superProto = base.prototype;
    class AbstractAssignmentStoreMixin extends base {
        constructor() {
            super(...arguments);
            this.assignmentsForRemoval = new Set();
            this.allAssignmentsForRemoval = false;
        }
        remove(records, silent) {
            this.assignmentsForRemoval = CIFromSetOrArrayOrValue(records).toSet();
            const res = superProto.remove.call(this, records);
            this.assignmentsForRemoval.clear();
            return res;
        }
        removeAll(silent) {
            this.allAssignmentsForRemoval = true;
            const res = superProto.removeAll.call(this, silent);
            this.allAssignmentsForRemoval = false;
            return res;
        }
    }
    return AbstractAssignmentStoreMixin;
}) {
}
