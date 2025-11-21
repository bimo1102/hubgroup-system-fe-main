import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/BetterMixin.js"
import { SchedulerCoreProjectMixin } from "./SchedulerCoreProjectMixin.js"
import { CoreEventMixin } from "./CoreEventMixin.js"
import { CoreDependencyMixin } from "./CoreDependencyMixin.js"


/**
 * This is a mixin, which can be applied to the [[CoreEventMixin]]. It provides the collection of all dependencies,
 * which reference this event.
 *
 * Doesn't affect scheduling.
 */
export class CoreHasDependenciesMixin extends Mixin(
    [ CoreEventMixin ],
    (base : AnyConstructor<CoreEventMixin, typeof CoreEventMixin>) => {

    const superProto : InstanceType<typeof base> = base.prototype


        class CoreHasDependenciesMixin extends base {
            project     : SchedulerCoreProjectMixin


            get outgoingDeps () : Set<CoreDependencyMixin> {
                return this.project.dependencyStore.getOutgoingDepsForEvent(this)
            }

            get incomingDeps () : Set<CoreDependencyMixin> {
                return this.project.dependencyStore.getIncomingDepsForEvent(this)
            }

            leaveProject () {
                const eventStore    = this.eventStore

                // the buckets may be empty if a model is removed from the project immediately after adding
                // (without propagation)
                if (this.outgoingDeps) {
                    this.outgoingDeps.forEach(dependency => eventStore.dependenciesForRemoval.add(dependency))
                }

                if (this.incomingDeps) {
                    this.incomingDeps.forEach(dependency => eventStore.dependenciesForRemoval.add(dependency))
                }

                superProto.leaveProject.call(this)
            }
        }

        return CoreHasDependenciesMixin
    }){}

