import { Mixin } from "../../../../ChronoGraph/class/BetterMixin.js";
import { CoreEventMixin } from "./CoreEventMixin.js";
export class CoreHasDependenciesMixin extends Mixin([CoreEventMixin], (base) => {
    const superProto = base.prototype;
    class CoreHasDependenciesMixin extends base {
        get outgoingDeps() {
            return this.project.dependencyStore.getOutgoingDepsForEvent(this);
        }
        get incomingDeps() {
            return this.project.dependencyStore.getIncomingDepsForEvent(this);
        }
        leaveProject() {
            const eventStore = this.eventStore;
            if (this.outgoingDeps) {
                this.outgoingDeps.forEach(dependency => eventStore.dependenciesForRemoval.add(dependency));
            }
            if (this.incomingDeps) {
                this.incomingDeps.forEach(dependency => eventStore.dependenciesForRemoval.add(dependency));
            }
            superProto.leaveProject.call(this);
        }
    }
    return CoreHasDependenciesMixin;
}) {
}
