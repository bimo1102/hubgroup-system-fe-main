import { CommitResult } from "../../ChronoGraph/chrono/Graph.js"
import { AnyConstructor, Mixin } from "../../ChronoGraph/class/BetterMixin.js"
import { AbstractProjectMixin } from "./model/AbstractProjectMixin.js"

/**
 * This a base generic mixin for every class, that belongs to a project.
 *
 * It just provides getter/setter for the `project` property, along with some convenience methods
 * to access the project's stores.
 */
export class AbstractPartOfProjectGenericMixin extends Mixin(
    [],
    (base : AnyConstructor) => {

    const superProto : InstanceType<typeof base> = base.prototype


    class AbstractPartOfProjectGenericMixin extends base {

        /**
         * The [[AbstractProjectMixin|project]] instance, this entity belongs to.
         */
        $project             : AbstractProjectMixin


        async commitAsync () : Promise<CommitResult> {
            return this.project.commitAsync()
        }


        set project (project) {
            this.$project = project
        }


        get project () {
            return this.$project
        }


        calculateProject () : this[ 'project' ] {
            throw new Error("Implement me")
        }


        /**
         * The method to set the [[AbstractProjectMixin|project]] instance, this entity belongs to.
         */
        setProject (project : this[ 'project' ]) : this[ 'project' ] {
            return this.project = project
        }


        /**
         * The method to get the [[AbstractProjectMixin|project]] instance, this entity belongs to.
         */
        getProject () : this[ 'project' ] {
            if (this.project) return this.project

            return this.setProject(this.calculateProject())
        }


        /**
         * Convenience method to get the instance of the assignment store in the [[AbstractProjectMixin|project]] instance, this entity belongs to.
         */
        getAssignmentStore () : this[ 'project' ][ 'assignmentStore' ] {
            const project   = this.getProject()

            return project?.assignmentStore
        }

        /**
         * Convenience method to get the instance of the dependency store in the [[AbstractProjectMixin|project]] instance, this entity belongs to.
         */
        getDependencyStore () : this[ 'project' ][ 'dependencyStore' ] {
            const project   = this.getProject()

            return project?.dependencyStore
        }



        /**
         * Convenience method to get the instance of the event store in the [[AbstractProjectMixin|project]] instance, this entity belongs to.
         */
        getEventStore () : this[ 'project' ][ 'eventStore' ] {
            const project   = this.getProject()

            return project?.eventStore
        }


        /**
         * Convenience method to get the instance of the resource store in the [[AbstractProjectMixin|project]] instance, this entity belongs to.
         */
        getResourceStore () : this[ 'project' ][ 'resourceStore' ] {
            const project   = this.getProject()

            return project?.resourceStore
        }


        /**
         * Convenience method to get the instance of the calendar manager store in the [[AbstractProjectMixin|project]] instance, this entity belongs to.
         */
        getCalendarManagerStore () : this[ 'project' ][ 'calendarManagerStore' ] {
            const project   = this.getProject()

            return project?.calendarManagerStore
        }

    }

    return AbstractPartOfProjectGenericMixin
}){}

