import { Mixin } from "../../../ChronoGraph/class/BetterMixin.js";
import { SchedulerCoreEvent } from "../model/scheduler_core/SchedulerCoreEvent.js";
import { CorePartOfProjectStoreMixin } from "./mixin/CorePartOfProjectStoreMixin.js";
import { AbstractEventStoreMixin } from "./AbstractEventStoreMixin.js";
export class CoreEventStoreMixin extends Mixin([AbstractEventStoreMixin, CorePartOfProjectStoreMixin], (base) => {
    const superProto = base.prototype;
    class CoreEventStoreMixin extends base {
        static get defaultConfig() {
            return {
                modelClass: SchedulerCoreEvent
            };
        }
        joinProject() {
            var _a;
            (_a = this.assignmentStore) === null || _a === void 0 ? void 0 : _a.linkAssignments(this, 'event');
        }
        afterLoadData() {
            var _a;
            this.afterEventRemoval();
            (_a = this.assignmentStore) === null || _a === void 0 ? void 0 : _a.linkAssignments(this, 'event');
        }
    }
    return CoreEventStoreMixin;
}) {
}
