import { Mixin } from '../../../../ChronoGraph/class/BetterMixin.js';
import { CoreEventMixin } from './CoreEventMixin.js';
import { CoreHasAssignmentsMixin } from "./CoreHasAssignmentsMixin.js";
import { CoreHasDependenciesMixin } from './CoreHasDependenciesMixin.js';
export class SchedulerCoreEvent extends Mixin([
    CoreEventMixin,
    CoreHasAssignmentsMixin,
    CoreHasDependenciesMixin
], (base) => {
    const superProto = base.prototype;
    class SchedulerCoreEvent extends base {
    }
    return SchedulerCoreEvent;
}) {
}
