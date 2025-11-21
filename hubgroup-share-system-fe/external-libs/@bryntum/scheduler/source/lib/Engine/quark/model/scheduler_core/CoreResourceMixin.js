import { Mixin } from "../../../../ChronoGraph/class/BetterMixin.js";
import { CorePartOfProjectModelMixin } from "../mixin/CorePartOfProjectModelMixin.js";
export class CoreResourceMixin extends Mixin([CorePartOfProjectModelMixin], (base) => {
    const superProto = base.prototype;
    class CoreResourceMixin extends base {
        get assigned() {
            var _a;
            return (_a = this.project) === null || _a === void 0 ? void 0 : _a.assignmentStore.getResourcesAssignments(this);
        }
        joinProject() {
            var _a;
            if (this.resourceStore && !this.resourceStore.isLoadingData) {
                (_a = this.assignmentStore) === null || _a === void 0 ? void 0 : _a.query(a => a.get('resource') === this.id).forEach(unresolved => unresolved.setChanged('resource', this));
            }
            superProto.joinProject.call(this);
        }
        leaveProject(isReplacing = false) {
            if (this.assigned && !isReplacing) {
                const resourceStore = this.resourceStore;
                this.assigned.forEach(assignment => resourceStore.assignmentsForRemoval.add(assignment));
            }
            superProto.leaveProject.call(this);
        }
        applyValue(useProp, key, value, skipAccessor, field) {
            if (field.name === 'id') {
                this.assigned.forEach(assignment => {
                    assignment.set('resourceId', value);
                });
            }
            superProto.applyValue.call(this, useProp, key, value, skipAccessor, field);
        }
    }
    return CoreResourceMixin;
}) {
}
