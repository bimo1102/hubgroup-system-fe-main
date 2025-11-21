import { AnyConstructor, Mixin } from "../../ChronoGraph/class/BetterMixin.js"
import { SchedulerCoreProjectMixin } from "./model/scheduler_core/SchedulerCoreProjectMixin.js"
import { ModelId } from "./Types.js"
import { CoreResourceStoreMixin } from "./store/CoreResourceStoreMixin.js"
import { CoreAssignmentStoreMixin } from "./store/CoreAssignmentStoreMixin.js"
import { CoreEventStoreMixin } from "./store/CoreEventStoreMixin.js"
import { CoreEventMixin } from "./model/scheduler_core/CoreEventMixin.js"
import { CoreResourceMixin } from "./model/scheduler_core/CoreResourceMixin.js"
import { CoreAssignmentMixin } from "./model/scheduler_core/CoreAssignmentMixin.js"
import { CoreDependencyStoreMixin } from "./store/CoreDependencyStoreMixin.js"
import { CoreDependencyMixin } from "./model/scheduler_core/CoreDependencyMixin.js"
import { CoreCalendarManagerStoreMixin } from './store/CoreCalendarManagerStoreMixin.js'
import { CoreCalendarMixin } from './model/scheduler_core/CoreCalendarMixin.js'
import { AbstractPartOfProjectGenericMixin } from "./AbstractPartOfProjectGenericMixin.js"


/**
 * This a base generic mixin for every class, that belongs to a scheduler_core project.
 *
 * It just provides getter/setter for the `project` property, along with some convenience methods
 * to access the project's stores.
 */
export class CorePartOfProjectGenericMixin extends Mixin(
    [ AbstractPartOfProjectGenericMixin ],
    (base : AnyConstructor<AbstractPartOfProjectGenericMixin, typeof AbstractPartOfProjectGenericMixin>) => {

    const superProto : InstanceType<typeof base> = base.prototype


    class CorePartOfProjectGenericMixin extends base {

        /**
         * The [[SchedulerCoreProjectMixin|project]] instance, this entity belongs to.
         */
        project                   : SchedulerCoreProjectMixin


        //region Store getters


        get eventStore () : CoreEventStoreMixin {
            return this.project?.eventStore
        }


        get resourceStore () : CoreResourceStoreMixin {
            return this.project?.resourceStore
        }


        get assignmentStore () : CoreAssignmentStoreMixin {
            return this.project?.assignmentStore
        }


        get dependencyStore () : CoreDependencyStoreMixin {
            return this.project?.dependencyStore
        }


        get calendarManagerStore () : CoreCalendarManagerStoreMixin {
            return this.project?.calendarManagerStore
        }


        //endregion


        //region Entity getters


        /**
         * Convenience method to get the instance of event by its id.
         */
        getEventById (id : ModelId) : CoreEventMixin {
            return this.eventStore?.getById(id)
        }


        /**
         * Convenience method to get the instance of dependency by its id.
         */
        getDependencyById (id : ModelId) : CoreDependencyMixin {
            return this.dependencyStore?.getById(id)
        }


        /**
         * Convenience method to get the instance of resource by its id.
         */
        getResourceById (id : ModelId) : CoreResourceMixin {
            return this.resourceStore?.getById(id)
        }


        /**
         * Convenience method to get the instance of assignment by its id.
         */
        getAssignmentById (id : ModelId) : CoreAssignmentMixin {
            return this.assignmentStore?.getById(id)
        }


        /**
         * Convenience method to get the instance of calendar by its id.
         */
        getCalendarById (id : ModelId) : CoreCalendarMixin {
            return this.calendarManagerStore?.getById(id)
        }


        //endregion
    }

    return CorePartOfProjectGenericMixin
}){}

