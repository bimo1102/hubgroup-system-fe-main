import { AnyConstructor, Mixin } from "../../../ChronoGraph/class/BetterMixin.js"
import { CorePartOfProjectStoreMixin } from "./mixin/CorePartOfProjectStoreMixin.js"
import { SchedulerCoreProjectMixin } from "../model/scheduler_core/SchedulerCoreProjectMixin.js"
import { CoreEventMixin } from "../model/scheduler_core/CoreEventMixin.js"
import { CoreDependencyMixin } from "../model/scheduler_core/CoreDependencyMixin.js"
import { AbstractDependencyStoreMixin } from "./AbstractDependencyStoreMixin.js"

const emptySet = new Set<CoreDependencyMixin>()


/**
 * A store mixin class, that represent collection of all dependencies in the [[SchedulerCoreProjectMixin|project]].
 */
export class CoreDependencyStoreMixin extends Mixin(
    [ AbstractDependencyStoreMixin, CorePartOfProjectStoreMixin ],
    (base : AnyConstructor<AbstractDependencyStoreMixin & CorePartOfProjectStoreMixin, typeof AbstractDependencyStoreMixin & typeof CorePartOfProjectStoreMixin>) => {

    const superProto : InstanceType<typeof base> = base.prototype


    class CoreDependencyStoreMixin extends base {

        project                     : SchedulerCoreProjectMixin

        modelClass                  : this[ 'project' ][ 'dependencyModelClass' ]

        dependenciesForRemoval       : Set<InstanceType<this[ 'project' ][ 'dependencyModelClass' ]>>    = new Set()

        allDependenciesForRemoval    : boolean   = false


        static get defaultConfig () : object {
            return {
                modelClass  : CoreDependencyMixin,

                storage : {
                    extraKeys : [
                        { property : 'fromEvent', unique : false },
                        { property : 'toEvent', unique : false }
                    ]
                }
            }
        }


        getIncomingDepsForEvent (event : CoreEventMixin) : Set<CoreDependencyMixin> {
            return this.storage.findItem('toEvent', event) as Set<CoreDependencyMixin> || emptySet
        }


        getOutgoingDepsForEvent (event : CoreEventMixin) : Set<CoreDependencyMixin> {
            return this.storage.findItem('fromEvent', event) as Set<CoreDependencyMixin> || emptySet
        }


        set data (value) {
            this.allDependenciesForRemoval   = true

            super.data = value

            this.allDependenciesForRemoval   = false
        }


        updateIndices () {
            this.storage.rebuildIndices()
        }


        invalidateIndices () {
            this.storage.invalidateIndices()
        }


        onCommitAsync () {
            this.updateIndices()
        }
    }

    return CoreDependencyStoreMixin

}){}
