import { Mixin } from "../../ChronoGraph/class/BetterMixin.js";
import { AbstractPartOfProjectGenericMixin } from "./AbstractPartOfProjectGenericMixin.js";
export class CorePartOfProjectGenericMixin extends Mixin([AbstractPartOfProjectGenericMixin], (base) => {
    const superProto = base.prototype;
    class CorePartOfProjectGenericMixin extends base {
        get eventStore() {
            var _a;
            return (_a = this.project) === null || _a === void 0 ? void 0 : _a.eventStore;
        }
        get resourceStore() {
            var _a;
            return (_a = this.project) === null || _a === void 0 ? void 0 : _a.resourceStore;
        }
        get assignmentStore() {
            var _a;
            return (_a = this.project) === null || _a === void 0 ? void 0 : _a.assignmentStore;
        }
        get dependencyStore() {
            var _a;
            return (_a = this.project) === null || _a === void 0 ? void 0 : _a.dependencyStore;
        }
        get calendarManagerStore() {
            var _a;
            return (_a = this.project) === null || _a === void 0 ? void 0 : _a.calendarManagerStore;
        }
        getEventById(id) {
            var _a;
            return (_a = this.eventStore) === null || _a === void 0 ? void 0 : _a.getById(id);
        }
        getDependencyById(id) {
            var _a;
            return (_a = this.dependencyStore) === null || _a === void 0 ? void 0 : _a.getById(id);
        }
        getResourceById(id) {
            var _a;
            return (_a = this.resourceStore) === null || _a === void 0 ? void 0 : _a.getById(id);
        }
        getAssignmentById(id) {
            var _a;
            return (_a = this.assignmentStore) === null || _a === void 0 ? void 0 : _a.getById(id);
        }
        getCalendarById(id) {
            var _a;
            return (_a = this.calendarManagerStore) === null || _a === void 0 ? void 0 : _a.getById(id);
        }
    }
    return CorePartOfProjectGenericMixin;
}) {
}
