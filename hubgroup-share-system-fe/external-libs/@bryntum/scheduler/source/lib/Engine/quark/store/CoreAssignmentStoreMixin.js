import { CoreAssignmentMixin } from "../model/scheduler_core/CoreAssignmentMixin.js";
import { Mixin } from "../../../ChronoGraph/class/BetterMixin.js";
import { CorePartOfProjectStoreMixin } from "./mixin/CorePartOfProjectStoreMixin.js";
import { AbstractAssignmentStoreMixin } from "./AbstractAssignmentStoreMixin.js";
const emptySet = new Set();
export class CoreAssignmentStoreMixin extends Mixin([AbstractAssignmentStoreMixin, CorePartOfProjectStoreMixin], (base) => {
    const superProto = base.prototype;
    class CoreAssignmentStoreMixin extends base {
        constructor() {
            super(...arguments);
            this.skipInvalidateIndices = false;
        }
        static get defaultConfig() {
            return {
                modelClass: CoreAssignmentMixin,
                storage: {
                    extraKeys: [
                        { property: 'event', unique: false },
                        { property: 'resource', unique: false },
                        { property: 'eventId', unique: false }
                    ]
                }
            };
        }
        set data(value) {
            this.allAssignmentsForRemoval = true;
            super.data = value;
            this.allAssignmentsForRemoval = false;
        }
        getEventsAssignments(event) {
            return this.storage.findItem('event', event) || emptySet;
        }
        getResourcesAssignments(resource) {
            return this.storage.findItem('resource', resource) || emptySet;
        }
        updateIndices() {
            this.storage.rebuildIndices();
        }
        invalidateIndices() {
            this.storage.invalidateIndices();
        }
        linkAssignments(store, modelName) {
            const unresolved = this.count && this.storage.findItem(modelName, null);
            if (unresolved) {
                for (const assignment of unresolved) {
                    const record = store.getById(assignment.getCurrentOrProposed(modelName));
                    if (record)
                        assignment.setChanged(modelName, record);
                }
                this.invalidateIndices();
            }
        }
        unlinkAssignments(modelName) {
            this.forEach(assignment => { var _a, _b, _c; return assignment.setChanged(modelName, (_c = (_b = (_a = assignment[modelName]) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : assignment[modelName]) !== null && _c !== void 0 ? _c : assignment[modelName + 'Id']); });
            this.invalidateIndices();
        }
        onCommitAsync() {
            this.updateIndices();
        }
    }
    return CoreAssignmentStoreMixin;
}) {
}
