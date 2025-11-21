import { Mixin } from "../../../ChronoGraph/class/Mixin.js";
import { AbstractPartOfProjectModelMixin } from './mixin/AbstractPartOfProjectModelMixin.js';
export class AbstractHasAssignmentsMixin extends Mixin([AbstractPartOfProjectModelMixin], (base) => {
    const superProto = base.prototype;
    class HasAssignmentsMixin extends base {
        getAssignmentFor(resource) {
            for (const assignment of this.assigned) {
                if (assignment.resource === resource)
                    return assignment;
            }
            return null;
        }
        isAssignedTo(resource) {
            return Boolean(this.getAssignmentFor(resource));
        }
        async assign(resource) {
            if (this.getAssignmentFor(resource))
                throw new Error('Resource can\'t be assigned twice to the same task');
            const assignmentCls = this.project.assignmentStore.modelClass;
            this.addAssignment(new assignmentCls({
                event: this,
                resource: resource
            }));
            return this.commitAsync();
        }
        async unassign(resource) {
            const assignment = this.getAssignmentFor(resource);
            if (!assignment)
                throw new Error(`Can't unassign resource \`${resource}\` from task \`${this}\` - resource is not assigned to the task!`);
            this.removeAssignment(assignment);
            return this.commitAsync();
        }
        leaveProject() {
            if (this.assigned) {
                const eventStore = this.getEventStore();
                this.assigned.forEach(assignment => eventStore.assignmentsForRemoval.add(assignment));
            }
            superProto.leaveProject.call(this, ...arguments);
        }
        remove() {
            if (this.parent) {
                const eventStore = this.getEventStore();
                superProto.remove.call(this);
                eventStore && eventStore.afterEventRemoval();
            }
            else {
                return superProto.remove.call(this);
            }
        }
        addAssignment(assignment) {
            this.getProject().assignmentStore.add(assignment);
            return assignment;
        }
        removeAssignment(assignment) {
            this.getProject().assignmentStore.remove(assignment);
            return assignment;
        }
    }
    return HasAssignmentsMixin;
}) {
}
