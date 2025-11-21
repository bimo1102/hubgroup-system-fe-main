import { Mixin } from "../../ChronoGraph/class/BetterMixin.js";
export class AbstractPartOfProjectGenericMixin extends Mixin([], (base) => {
    const superProto = base.prototype;
    class AbstractPartOfProjectGenericMixin extends base {
        async commitAsync() {
            return this.project.commitAsync();
        }
        set project(project) {
            this.$project = project;
        }
        get project() {
            return this.$project;
        }
        calculateProject() {
            throw new Error("Implement me");
        }
        setProject(project) {
            return this.project = project;
        }
        getProject() {
            if (this.project)
                return this.project;
            return this.setProject(this.calculateProject());
        }
        getAssignmentStore() {
            const project = this.getProject();
            return project === null || project === void 0 ? void 0 : project.assignmentStore;
        }
        getDependencyStore() {
            const project = this.getProject();
            return project === null || project === void 0 ? void 0 : project.dependencyStore;
        }
        getEventStore() {
            const project = this.getProject();
            return project === null || project === void 0 ? void 0 : project.eventStore;
        }
        getResourceStore() {
            const project = this.getProject();
            return project === null || project === void 0 ? void 0 : project.resourceStore;
        }
        getCalendarManagerStore() {
            const project = this.getProject();
            return project === null || project === void 0 ? void 0 : project.calendarManagerStore;
        }
    }
    return AbstractPartOfProjectGenericMixin;
}) {
}
