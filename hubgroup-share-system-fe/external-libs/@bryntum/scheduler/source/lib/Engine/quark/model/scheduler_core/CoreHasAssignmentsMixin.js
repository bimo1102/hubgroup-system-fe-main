import { Mixin } from "../../../../ChronoGraph/class/BetterMixin.js";
import { CoreEventMixin } from "./CoreEventMixin.js";
import ObjectHelper from "../../../../Core/helper/ObjectHelper.js";
import { AbstractHasAssignmentsMixin } from '../AbstractHasAssignmentsMixin.js';
export class CoreHasAssignmentsMixin extends Mixin([CoreEventMixin, AbstractHasAssignmentsMixin], (base) => {
    const superProto = base.prototype;
    class CoreHasAssignmentsMixin extends base {
        get assigned() {
            var _a;
            const assignments = (_a = this.project) === null || _a === void 0 ? void 0 : _a.assignmentStore.getEventsAssignments(this);
            if (!assignments) {
                return this.$cachedAssignments;
            }
            return this.$cachedAssignments = assignments;
        }
        applyValue(useProp, key, value, skipAccessor, field) {
            var _a;
            if (key === 'id') {
                (_a = this.assigned) === null || _a === void 0 ? void 0 : _a.forEach(assignment => assignment.set('eventId', value));
            }
            superProto.applyValue.call(this, useProp, key, value, skipAccessor, field);
        }
        copy(newId = null, deep = null) {
            const copy = superProto.copy.call(this, newId, deep);
            if ((ObjectHelper.isObject(deep) && !deep.skipFieldIdentifiers) || !ObjectHelper.isObject(deep)) {
                copy.$cachedAssignments = this.assigned;
            }
            return copy;
        }
    }
    return CoreHasAssignmentsMixin;
}) {
}
