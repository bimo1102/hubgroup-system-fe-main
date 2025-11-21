import { Mixin } from "../../../ChronoGraph/class/Mixin.js";
import { AbstractPartOfProjectStoreMixin } from "./mixin/AbstractPartOfProjectStoreMixin.js";
export class AbstractResourceStoreMixin extends Mixin([AbstractPartOfProjectStoreMixin], (base) => {
    const superProto = base.prototype;
    class AbstractResourceStoreMixin extends base {
        constructor() {
            super(...arguments);
            this.assignmentsForRemoval = new Set();
        }
        onDataChange(event) {
            var _a;
            super.onDataChange(event);
            if ((_a = event.removed) === null || _a === void 0 ? void 0 : _a.length)
                this.afterResourceRemoval();
        }
        remove(records, silent) {
            const res = superProto.remove.call(this, records);
            this.afterResourceRemoval();
            return res;
        }
        removeAll(silent) {
            const res = superProto.removeAll.call(this, silent);
            this.afterResourceRemoval();
            return res;
        }
        afterResourceRemoval() {
            const assignmentStore = this.getAssignmentStore();
            if (assignmentStore && !assignmentStore.allAssignmentsForRemoval) {
                const assignmentsForRemoval = [...this.assignmentsForRemoval].filter(assignment => !assignmentStore.assignmentsForRemoval.has(assignment));
                assignmentsForRemoval.length > 0 && assignmentStore.remove(assignmentsForRemoval);
            }
            this.assignmentsForRemoval.clear();
        }
        processRecord(resourceRecord, isDataset = false) {
            const existingRecord = this.getById(resourceRecord.id);
            const isReplacing = existingRecord && existingRecord !== resourceRecord;
            if (isReplacing) {
                for (const assignment of existingRecord.assigned) {
                    assignment.resource = resourceRecord;
                }
            }
            return resourceRecord;
        }
    }
    return AbstractResourceStoreMixin;
}) {
}
