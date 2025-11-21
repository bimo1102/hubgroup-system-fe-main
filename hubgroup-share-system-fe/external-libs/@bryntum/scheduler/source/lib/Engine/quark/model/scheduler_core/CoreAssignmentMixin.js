import { Mixin, isInstanceOf } from "../../../../ChronoGraph/class/BetterMixin.js";
import { CorePartOfProjectModelMixin } from "../mixin/CorePartOfProjectModelMixin.js";
import { CoreEventMixin } from "./CoreEventMixin.js";
import { CoreResourceMixin } from "./CoreResourceMixin.js";
export class CoreAssignmentMixin extends Mixin([CorePartOfProjectModelMixin], (base) => {
    const superProto = base.prototype;
    class CoreAssignmentMixin extends base {
        static get fields() {
            return [
                { name: 'resource', isEqual: (a, b) => a === b, persist: false },
                { name: 'event', isEqual: (a, b) => a === b, persist: false }
            ];
        }
        setChanged(field, value, invalidate) {
            const { assignmentStore, eventStore, resourceStore, project } = this;
            let update = false;
            if (field === 'event') {
                const event = isInstanceOf(value, CoreEventMixin) ? value : eventStore === null || eventStore === void 0 ? void 0 : eventStore.getById(value);
                if (event)
                    update = true;
                value = event || value;
            }
            if (field === 'resource') {
                const resource = isInstanceOf(value, CoreResourceMixin) ? value : resourceStore === null || resourceStore === void 0 ? void 0 : resourceStore.getById(value);
                if (resource)
                    update = true;
                value = resource || value;
            }
            superProto.setChanged.call(this, field, value, invalidate, true);
            if (assignmentStore && update && !project.isPerformingCommit && !assignmentStore.isLoadingData && !resourceStore.isLoadingData && !assignmentStore.skipInvalidateIndices) {
                assignmentStore.invalidateIndices();
            }
        }
        joinProject() {
            superProto.joinProject.call(this);
            this.setChanged('event', this.get('event'));
            this.setChanged('resource', this.get('resource'));
        }
        calculateInvalidated() {
            var _a, _b;
            let { event = this.event, resource = this.resource } = this.$changed;
            if (event !== null && !(isInstanceOf(event, CoreEventMixin))) {
                const resolved = (_a = this.eventStore) === null || _a === void 0 ? void 0 : _a.getById(event);
                if (resolved)
                    this.setChanged('event', resolved, false);
            }
            if (resource !== null && !(isInstanceOf(resource, CoreResourceMixin))) {
                const resolved = (_b = this.resourceStore) === null || _b === void 0 ? void 0 : _b.getById(resource);
                if (resolved)
                    this.setChanged('resource', resolved, false);
            }
        }
        finalizeInvalidated(silent) {
            var _a, _b;
            if ((_a = this.$changed.resource) === null || _a === void 0 ? void 0 : _a.isModel)
                this.$changed.resourceId = this.$changed.resource.id;
            if ((_b = this.$changed.event) === null || _b === void 0 ? void 0 : _b.isModel)
                this.$changed.eventId = this.$changed.event.id;
            superProto.finalizeInvalidated.call(this, silent);
        }
        set event(event) {
            this.setChanged('event', event);
        }
        get event() {
            const event = this.get('event');
            return isInstanceOf(event, CoreEventMixin) ? event : null;
        }
        set resource(resource) {
            this.setChanged('resource', resource);
        }
        get resource() {
            const resource = this.get('resource');
            return isInstanceOf(resource, CoreResourceMixin) ? resource : null;
        }
    }
    return CoreAssignmentMixin;
}) {
}
