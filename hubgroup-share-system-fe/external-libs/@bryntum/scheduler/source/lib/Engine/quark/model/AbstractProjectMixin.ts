import { CommitResult } from "../../../ChronoGraph/chrono/Graph.js"
import { AnyConstructor, Mixin } from "../../../ChronoGraph/class/BetterMixin.js"
import Delayable, { DelayableMixin } from "../../../Core/mixin/Delayable.js"
import Events, { EventsMixin } from "../../../Core/mixin/Events.js"
import Model from "../../../Core/data/Model.js"
import Store from "../../../Core/data/Store.js"
import { AbstractCalendarMixin } from "./AbstractCalendarMixin.js"
import { AbstractPartOfProjectStoreMixin } from "../store/mixin/AbstractPartOfProjectStoreMixin.js"

export class EventsWrapper extends Mixin(
    [],
    Events as ((base : AnyConstructor) => AnyConstructor<EventsMixin>)
){}

export class DelayableWrapper extends Mixin(
    [],
    Delayable as ((base : AnyConstructor) => AnyConstructor<DelayableMixin>)
){}


/**
 * This is an abstract project, which just lists the available stores.
 *
 * The actual project classes are [[SchedulerCoreProjectMixin]], [[SchedulerBasicProjectMixin]],
 * [[SchedulerProProjectMixin]], [[GanttProjectMixin]].
 */
export class AbstractProjectMixin extends Mixin(
    [
        EventsWrapper,
        DelayableWrapper,
        Model
    ],
    (base : AnyConstructor<
        EventsWrapper &
        DelayableWrapper &
        Model
        ,
        typeof EventsWrapper &
        typeof DelayableWrapper &
        typeof Model
>) => {

    const superProto : InstanceType<typeof base> = base.prototype


    class AbstractProjectMixin extends base {

        eventModelClass           : typeof Model

        dependencyModelClass      : typeof Model

        resourceModelClass        : typeof Model

        assignmentModelClass      : typeof Model

        calendarModelClass        : typeof Model

        eventStoreClass           : typeof Store

        dependencyStoreClass      : typeof Store

        resourceStoreClass        : typeof Store

        assignmentStoreClass      : typeof Store

        calendarManagerStoreClass : typeof Store

        eventStore                : Store

        dependencyStore           : Store

        resourceStore             : Store

        assignmentStore           : Store

        calendarManagerStore      : Store

        defaultCalendar           : AbstractCalendarMixin

        isInitialCommitPerformed  : boolean

        isLoadingInlineData       : boolean

        hasLoadedDataToCommit     : boolean

        isWritingData             : boolean

        silenceInitialCommit      : boolean

        dataReadyDetacher         : Function | null

        queuedDataReadyEvents     : Array<any>

        get isRepopulatingStores () : boolean {
            return false
        }

        get isInitialCommit() : boolean {
            return !this.isInitialCommitPerformed || this.hasLoadedDataToCommit;
        }

        construct (config : Partial<this> = {}) {
            // Define default values for these flags here
            // if defined where declared then TS compiles them this way:
            // constructor() {
            //     super(...arguments)
            //     this.isInitialCommitPerformed   = false
            //     this.isLoadingInlineData        = false
            //     this.isWritingData              = false
            //
            // }
            // which messes the flags values for inline data loading (since it's async)
            this.isInitialCommitPerformed   = false
            this.isLoadingInlineData        = false
            this.isWritingData              = false
            this.hasLoadedDataToCommit      = false

            superProto.construct.call(this, config)

            this.silenceInitialCommit = ('silenceInitialCommit' in config) ? config.silenceInitialCommit : true
        }


        // Template method called when a stores dataset is replaced. Implemented in SchedulerBasicProjectMixin
        repopulateStore (store : AbstractPartOfProjectStoreMixin) {}


        // Template method called when replica should be repopulated. Implemented in SchedulerBasicProjectMixin
        repopulateReplica () {}


        async commitAsync () : Promise<CommitResult> {
            throw new Error("Abstract method called")
        }


        // Different implementations for Core and Basic engines
        isEngineReady () : boolean {
            throw new Error("Abstract method called")
        }
    }

    return AbstractProjectMixin
}){}
