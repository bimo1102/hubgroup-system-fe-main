import { Mixin } from "../../../ChronoGraph/class/Mixin.js";
import { AbstractPartOfProjectStoreMixin } from "./mixin/AbstractPartOfProjectStoreMixin.js";
export class AbstractEventStoreMixin extends Mixin([AbstractPartOfProjectStoreMixin], (base) => {
    const superProto = base.prototype;
    class AbstractEventStoreMixin extends base {
        constructor() {
            super(...arguments);
            this.assignmentsForRemoval = new Set();
            this.dependenciesForRemoval = new Set();
        }
        onDataChange(event) {
            var _a;
            super.onDataChange(event);
            if ((_a = event.removed) === null || _a === void 0 ? void 0 : _a.length)
                this.afterEventRemoval();
        }
        remove(records, silent) {
            const res = superProto.remove.call(this, records);
            this.afterEventRemoval();
            return res;
        }
        removeAll(silent) {
            const res = superProto.removeAll.call(this, silent);
            this.afterEventRemoval();
            return res;
        }
        afterEventRemoval() {
            const { assignmentsForRemoval, dependenciesForRemoval } = this;
            if (!assignmentsForRemoval)
                return;
            const assignmentStore = this.getAssignmentStore();
            if (assignmentStore && !assignmentStore.allAssignmentsForRemoval && assignmentsForRemoval.size) {
                const toRemove = [...assignmentsForRemoval].filter(assignment => !assignmentStore.assignmentsForRemoval.has(assignment));
                toRemove.length > 0 && assignmentStore.remove(toRemove);
            }
            assignmentsForRemoval.clear();
            const dependencyStore = this.getDependencyStore();
            if (dependencyStore && !dependencyStore.allDependenciesForRemoval && dependenciesForRemoval.size) {
                const toRemove = [...dependenciesForRemoval].filter(dependency => !dependencyStore.dependenciesForRemoval.has(dependency));
                toRemove.length > 0 && dependencyStore.remove(toRemove);
            }
            dependenciesForRemoval.clear();
        }
        processRecord(eventRecord, isDataset = false) {
            var _a;
            if (!((_a = this.project) === null || _a === void 0 ? void 0 : _a.isRepopulatingStores)) {
                const existingRecord = this.getById(eventRecord.id);
                const isReplacing = existingRecord && existingRecord !== eventRecord;
                if (isReplacing) {
                    for (const assignment of existingRecord.assigned) {
                        assignment.event = eventRecord;
                    }
                }
            }
            return eventRecord;
        }
    }
    return AbstractEventStoreMixin;
}) {
}
