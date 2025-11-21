import { CorePartOfProjectModelMixin } from "../mixin/CorePartOfProjectModelMixin.js";
import { Mixin } from "../../../../ChronoGraph/class/BetterMixin.js";
import { CoreEventMixin } from "./CoreEventMixin.js";
import { isInstanceOf } from '../../../../ChronoGraph/class/Mixin.js';
export class CoreDependencyMixin extends Mixin([CorePartOfProjectModelMixin], (base) => {
    const superProto = base.prototype;
    class CoreDependencyMixin extends base {
        static get fields() {
            return [
                { name: 'fromEvent', isEqual: (a, b) => a === b, persist: false },
                { name: 'toEvent', isEqual: (a, b) => a === b, persist: false }
            ];
        }
        setChanged(field, value, invalidate) {
            var _a, _b, _c;
            let update = false;
            if (field === 'fromEvent' || field === 'toEvent') {
                const event = isInstanceOf(value, CoreEventMixin) ? value : (_a = this.eventStore) === null || _a === void 0 ? void 0 : _a.getById(value);
                if (event)
                    update = true;
                value = event || value;
            }
            superProto.setChanged.call(this, field, value, invalidate, true);
            if (update && !this.project.isPerformingCommit && !((_b = this.dependencyStore) === null || _b === void 0 ? void 0 : _b.isLoadingData)) {
                (_c = this.dependencyStore) === null || _c === void 0 ? void 0 : _c.invalidateIndices();
            }
        }
        joinProject() {
            superProto.joinProject.call(this);
            this.setChanged('fromEvent', this.get('fromEvent'));
            this.setChanged('toEvent', this.get('toEvent'));
        }
        calculateInvalidated() {
            var _a, _b;
            let { fromEvent, toEvent } = this.$changed;
            if (fromEvent !== null && !(isInstanceOf(fromEvent, CoreEventMixin))) {
                const resolved = (_a = this.eventStore) === null || _a === void 0 ? void 0 : _a.getById(fromEvent);
                if (resolved)
                    this.$changed.fromEvent = resolved;
            }
            if (toEvent !== null && !(isInstanceOf(toEvent, CoreEventMixin))) {
                const resolved = (_b = this.eventStore) === null || _b === void 0 ? void 0 : _b.getById(toEvent);
                if (resolved)
                    this.$changed.toEvent = resolved;
            }
        }
        set fromEvent(fromEvent) {
            this.setChanged('fromEvent', fromEvent);
        }
        get fromEvent() {
            const fromEvent = this.get('fromEvent');
            return isInstanceOf(fromEvent, CoreEventMixin) ? fromEvent : null;
        }
        set toEvent(toEvent) {
            this.setChanged('toEvent', toEvent);
        }
        get toEvent() {
            const toEvent = this.get('toEvent');
            return isInstanceOf(toEvent, CoreEventMixin) ? toEvent : null;
        }
    }
    return CoreDependencyMixin;
}) {
}
