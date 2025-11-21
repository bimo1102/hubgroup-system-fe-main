import { Mixin } from "../../../ChronoGraph/class/BetterMixin.js";
import { CorePartOfProjectStoreMixin } from "./mixin/CorePartOfProjectStoreMixin.js";
import { CoreResourceMixin } from "../model/scheduler_core/CoreResourceMixin.js";
import { AbstractResourceStoreMixin } from "./AbstractResourceStoreMixin.js";
export class CoreResourceStoreMixin extends Mixin([AbstractResourceStoreMixin, CorePartOfProjectStoreMixin], (base) => {
    const superProto = base.prototype;
    class CoreResourceStoreMixin extends base {
        static get defaultConfig() {
            return {
                modelClass: CoreResourceMixin
            };
        }
        joinProject() {
            var _a;
            (_a = this.assignmentStore) === null || _a === void 0 ? void 0 : _a.linkAssignments(this, 'resource');
        }
        afterLoadData() {
            var _a;
            (_a = this.assignmentStore) === null || _a === void 0 ? void 0 : _a.linkAssignments(this, 'resource');
        }
        clear(removing) {
            var _a;
            superProto.clear.call(this, removing);
            (_a = this.assignmentStore) === null || _a === void 0 ? void 0 : _a.unlinkAssignments('resource');
        }
    }
    return CoreResourceStoreMixin;
}) {
}
