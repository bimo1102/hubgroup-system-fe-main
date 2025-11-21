import { SchedulerCoreProjectMixin } from "../model/scheduler_core/SchedulerCoreProjectMixin.js"
import { Mixin, AnyConstructor } from "../../../ChronoGraph/class/BetterMixin.js"
import { CorePartOfProjectStoreMixin } from "./mixin/CorePartOfProjectStoreMixin.js"
import { CoreResourceMixin } from "../model/scheduler_core/CoreResourceMixin.js"
import { AbstractResourceStoreMixin } from "./AbstractResourceStoreMixin.js"


/**
 * A store mixin class, that represent collection of all resources in the [[SchedulerCoreProjectMixin|project]].
 */
export class CoreResourceStoreMixin extends Mixin(
    [ AbstractResourceStoreMixin, CorePartOfProjectStoreMixin ],
    (base : AnyConstructor<AbstractResourceStoreMixin & CorePartOfProjectStoreMixin, typeof AbstractResourceStoreMixin & typeof CorePartOfProjectStoreMixin>) => {

    const superProto : InstanceType<typeof base> = base.prototype


    class CoreResourceStoreMixin extends base {

        project             : SchedulerCoreProjectMixin

        modelClass          : this[ 'project' ][ 'resourceModelClass' ]


        static get defaultConfig () : object {
            return {
                modelClass  : CoreResourceMixin
            }
        }


        joinProject () {
            this.assignmentStore?.linkAssignments(this, 'resource')
        }


        afterLoadData () {
            this.assignmentStore?.linkAssignments(this, 'resource')
        }


        clear (removing) {
            superProto.clear.call(this, removing)

            this.assignmentStore?.unlinkAssignments('resource')
        }
    }

    return CoreResourceStoreMixin
}){}

