import { Mixin, AnyConstructor } from "../../../../ChronoGraph/class/BetterMixin.js"
import { SchedulerCoreEvent } from "./SchedulerCoreEvent.js"
import Store from "../../../../Core/data/Store.js"
import Model from "../../../../Core/data/Model.js"
import Events, { EventsMixin } from "../../../../Core/mixin/Events.js"
import Delayable, { DelayableMixin } from "../../../../Core/mixin/Delayable.js"
import { CoreEventStoreMixin } from "../../store/CoreEventStoreMixin.js"
import { CorePartOfProjectModelMixin } from "../mixin/CorePartOfProjectModelMixin.js"
import { CoreAssignmentMixin } from "./CoreAssignmentMixin.js"
import { CoreAssignmentStoreMixin } from "../../store/CoreAssignmentStoreMixin.js"
import { CoreResourceMixin } from "./CoreResourceMixin.js"
import { CoreResourceStoreMixin } from "../../store/CoreResourceStoreMixin.js"
import { CorePartOfProjectGenericMixin } from "../../CorePartOfProjectGenericMixin.js"
import { CoreDependencyStoreMixin } from "../../store/CoreDependencyStoreMixin.js"
import { CoreDependencyMixin } from "./CoreDependencyMixin.js"
import { CorePartOfProjectStoreMixin } from "../../store/mixin/CorePartOfProjectStoreMixin.js"
import { CoreCalendarMixin } from './CoreCalendarMixin.js'
import { CoreCalendarManagerStoreMixin } from '../../store/CoreCalendarManagerStoreMixin.js'
import { delay } from "../../../util/Functions.js"
import StateTrackingManager from "../../../../Core/data/stm/StateTrackingManager.js"
import { AbstractProjectMixin } from "../AbstractProjectMixin.js"
import ObjectHelper from "../../../../Core/helper/ObjectHelper.js";


export class EventsWrapper extends Mixin(
    [],
    Events as ((base : AnyConstructor) => AnyConstructor<EventsMixin>)
){}


export class DelayableWrapper extends Mixin(
    [],
    Delayable as ((base : AnyConstructor) => AnyConstructor<DelayableMixin>)
){}


/**
 * The data package format describing project data
 */
export type ProjectDataPackage = {
    eventsData?             : any[]
    tasksData?              : any[]
    dependenciesData?       : any[]
    resourcesData?          : any[]
    assignmentsData?        : any[]
    calendarsData?          : any[]
}

/**
 * This is a project, implementing _basic scheduling_ as [[SchedulerBasicProjectMixin]] does.
 * Yet this class does not use _chronograph_ based engine.
 */
export class SchedulerCoreProjectMixin extends Mixin(
    [
        AbstractProjectMixin,
        CorePartOfProjectGenericMixin,
        EventsWrapper,
        DelayableWrapper,
        Model
    ],
    (base : AnyConstructor<
        AbstractProjectMixin &
        CorePartOfProjectGenericMixin &
        EventsWrapper &
        DelayableWrapper &
        Model
        ,
        typeof AbstractProjectMixin &
        typeof CorePartOfProjectGenericMixin &
        typeof EventsWrapper &
        typeof DelayableWrapper &
        typeof Model
    >) => {
    const superProto : InstanceType<typeof base> = base.prototype

    class SchedulerCoreProjectMixin extends base {


        //region Config


        static applyConfigs = true

        static get defaultConfig () {
            return {
                stm                       : {},

                eventStore                : {},
                assignmentStore           : {},
                resourceStore             : {},
                dependencyStore           : {},
                calendarManagerStore      : {},

                eventModelClass           : SchedulerCoreEvent,
                assignmentModelClass      : CoreAssignmentMixin,
                resourceModelClass        : CoreResourceMixin,
                dependencyModelClass      : CoreDependencyMixin,
                calendarModelClass        : CoreCalendarMixin,

                eventStoreClass           : CoreEventStoreMixin,
                assignmentStoreClass      : CoreAssignmentStoreMixin,
                resourceStoreClass        : CoreResourceStoreMixin,
                dependencyStoreClass      : CoreDependencyStoreMixin,
                calendarManagerStoreClass : CoreCalendarManagerStoreMixin,

                assignmentsData           : null,
                calendarsData             : null,
                dependenciesData          : null,
                eventsData                : null,
                resourcesData             : null
            }
        }

        /**
         * The constructor for the "Event" entity of the project.
         */
        eventModelClass           : typeof SchedulerCoreEvent

        assignmentModelClass      : typeof CoreAssignmentMixin

        resourceModelClass        : typeof CoreResourceMixin

        dependencyModelClass      : typeof CoreDependencyMixin

        calendarModelClass        : typeof CoreCalendarMixin

        /**
         * The constructor for the "Events" collection of the project
         */
        eventStoreClass           : typeof CoreEventStoreMixin

        assignmentStoreClass      : typeof CoreAssignmentStoreMixin

        resourceStoreClass        : typeof CoreResourceStoreMixin

        dependencyStoreClass      : typeof CoreDependencyStoreMixin

        calendarManagerStoreClass : typeof CoreCalendarManagerStoreMixin


        $eventStore               : CoreEventStoreMixin

        $dependencyStore          : CoreDependencyStoreMixin

        $resourceStore            : CoreResourceStoreMixin

        $assignmentStore          : CoreAssignmentStoreMixin

        $calendarManagerStore     : CoreCalendarManagerStoreMixin

        $invalidated              : Set<CorePartOfProjectModelMixin>

        /**
         * The events data - can be provided during project instantiation and will be loaded with [[loadInlineData]].
         *
         * ```ts
         * const project    = new SchedulerBasicProjectMixin({
         *     eventsData   : [ { name : 'Task 1' } ]
         * })
         * ```
         */
        eventsData                  : any[]

        /**
         * The dependencies data - can be provided during project instantiation and will be loaded with [[loadInlineData]].
         */
        dependenciesData            : any[]

        /**
         * The resources data - can be provided during project instantiation and will be loaded with [[loadInlineData]].
         */
        resourcesData               : any[]

        /**
         * The assignments data - can be provided during project instantiation and will be loaded with [[loadInlineData]].
         */
        assignmentsData             : any[]

        /**
         * The calendars data - can be provided during project instantiation and will be loaded with [[loadInlineData]].
         */
        calendarsData               : any[]

        defaultCalendar             : CoreCalendarMixin

        // Did not feel worth a mixin, so little code and core only allows it on project
        $calendar                   : CoreCalendarMixin

        /**
         * This property is used when instantiating the default calendar of the project. This calendar will have no availability intervals,
         * so this setting will either turn the whole timespan into working time or non-working.
         *
         * Default value is `true`
         */
        // TODO: Add actual field
        unspecifiedTimeIsWorking    : boolean

        $stm                        : StateTrackingManager

        isPerformingCommit          : boolean

        silenceInitialCommit        : boolean

        ongoing                     : Promise<any>


        //endregion


        //region Init


        construct (config : Partial<this> = {}) {
            // Cannot be created with declaration, because of how TS is compiled to JS. Ends up after `construct()`
            this.$invalidated = new Set<CorePartOfProjectModelMixin>()

            // Define default values for these flags here
            // if defined where declared then TS compiles them this way:
            // constructor() {
            //     super(...arguments)
            //     this.isPerformingCommit   = false
            //     this.silenceInitialCommit = true
            //     this.ongoing              = Promise.resolve()
            // }
            // which messes the flags values for inline data loading (since it's async)
            this.isPerformingCommit   = false
            this.silenceInitialCommit = true
            this.ongoing              = Promise.resolve()

            superProto.construct.call(this, config)

            // not part of the CalendarManagerStore intentionally, not persisted
            this.defaultCalendar = new this.calendarManagerStore.modelClass({
                unspecifiedTimeIsWorking: this.unspecifiedTimeIsWorking
            })

            this.defaultCalendar.project = this

            const { calendarsData, eventsData, dependenciesData, resourcesData, assignmentsData } = this

            const hasInlineData = Boolean(calendarsData || eventsData  || dependenciesData || resourcesData || assignmentsData)

            if (hasInlineData) {
                this.loadInlineData({
                    calendarsData,
                    eventsData,
                    dependenciesData,
                    resourcesData,
                    assignmentsData
                })

                delete this.calendarsData
                delete this.eventsData
                delete this.dependenciesData
                delete this.resourcesData
                delete this.assignmentsData
            }
            else {
                // Trigger initial commit
                this.bufferedCommitAsync()
            }
        }

        doDestroy () {
            const me = this

            me.eventStore?.destroy()
            me.dependencyStore?.destroy()
            me.assignmentStore?.destroy()
            me.resourceStore?.destroy()
            me.calendarManagerStore?.destroy()
            me.defaultCalendar.destroy()

            me.stm?.destroy()

            superProto.doDestroy.call(this)
        }

        /**
         * This method loads the "raw" data into the project. The loading is basically happening by
         * assigning the individual data entries to the `data` property of the corresponding store.
         *
         * @param data
         */
        async loadInlineData (data : ProjectDataPackage) : Promise<any> {
            this.isLoadingInlineData = true

            if (data.calendarsData) {
                this.calendarManagerStore.data = data.calendarsData
            }
            if (data.resourcesData) {
                this.resourceStore.data        = data.resourcesData
            }
            if (data.assignmentsData) {
                this.assignmentStore.data      = data.assignmentsData
            }
            if (data.eventsData) {
                this.eventStore.data           = data.eventsData
            }
            if (data.tasksData) {
                this.eventStore.data           = data.tasksData
            }
            if (data.dependenciesData) {
                this.dependencyStore.data      = data.dependenciesData
            }

            await this.commitLoad()

            this.isLoadingInlineData = false

            return
        }


        //endregion


        //region Join


        async commitLoad () {
            await this.commitAsync()

            // Might have been destroyed during the async operation above
            if (!this.isDestroyed) this.trigger('load')
        }


        joinStoreRecords (store : CorePartOfProjectStoreMixin) {
            const fn = (record : CorePartOfProjectModelMixin) => {
                record.setProject(this)
                record.joinProject()
            }

            if (store.rootNode) {
                store.rootNode.traverse(fn)
            } else {
                store.forEach(fn)
            }
        }


        unJoinStoreRecords (store : CorePartOfProjectStoreMixin) {
            const fn = (record : CorePartOfProjectModelMixin) => {
                record.leaveProject()
                record.setProject(this)
            }

            if (store.rootNode) {
                (store.rootNode as CorePartOfProjectModelMixin).traverse(node => {
                    // do not unjoin/leave project for the root node, which is the project itself
                    if (node !== store.rootNode) fn(node)
                })
            } else {
                store.forEach(fn)
            }
        }


        //endregion


        //region EventStore


        resolveStoreAndModelClass (name : string, config : any) {
            // storeClass from supplied config or our properties
            const storeClass = config?.storeClass || this[`${name}StoreClass`]

            // modelClass from supplied config
            let modelClass = config?.modelClass

            if (!modelClass) {
                // or from storeClass.modelClass if customized
                // @ts-ignore
                if (this.getDefaultConfiguration()[`${name}ModelClass`] !== storeClass.getDefaultConfiguration().modelClass) {
                    modelClass = storeClass.getDefaultConfiguration().modelClass
                }
                // and if none of the above, use from our properties
                else {
                    modelClass = this[`${name}ModelClass`]
                }
            }

            return { storeClass, modelClass }
        }


        get eventStore () : CoreEventStoreMixin {
            return this.$eventStore
        }


        setEventStore (eventStore : CoreEventStoreMixin) {
            this.eventStore = eventStore
        }


        set eventStore (eventStore : CoreEventStoreMixin) {
            const me       = this
            const { stm }  = me
            const oldStore = me.$eventStore

            if (!(eventStore instanceof Store)) {
                const { storeClass, modelClass } = me.resolveStoreAndModelClass('event', eventStore)

                eventStore = new storeClass(ObjectHelper.assign({
                    modelClass,
                    project    : me,
                    stm
                }, eventStore))
            }
            else {
                eventStore.project = me
                stm.addStore(eventStore)
                me.joinStoreRecords(eventStore)
            }

            if (oldStore && stm.hasStore(oldStore)) {
                stm.removeStore(oldStore)
                me.unJoinStoreRecords(oldStore)

                const { assignmentsForRemoval } = oldStore

                // remap the assignment
                assignmentsForRemoval.forEach(assignment => {
                    const oldEvent      = assignment.event as SchedulerCoreEvent

                    if (oldEvent) {
                        const newEvent  = eventStore.getById(oldEvent.id)

                        if (newEvent) {
                            assignment.event    = newEvent
                            // keep the assignment
                            assignmentsForRemoval.delete(assignment)
                        }
                    }
                })

                oldStore.afterEventRemoval()
            }

            eventStore.setProject(me)

            me.$eventStore = eventStore

            me.trigger('eventStoreChange', { store : eventStore })
        }


        //endregion


        //region AssignmentStore


        get assignmentStore () : CoreAssignmentStoreMixin {
            return this.$assignmentStore
        }

        setAssignmentStore (assignmentStore : CoreAssignmentStoreMixin) {
            this.assignmentStore = assignmentStore
        }

        set assignmentStore (assignmentStore : CoreAssignmentStoreMixin) {
            const me       = this
            const { stm }  = me
            const oldStore = me.$assignmentStore

            if (oldStore && stm.hasStore(oldStore)) {
                stm.removeStore(oldStore)
                me.unJoinStoreRecords(oldStore)
            }

            if (!(assignmentStore instanceof Store)) {
                const { storeClass, modelClass } = me.resolveStoreAndModelClass('assignment', assignmentStore)

                assignmentStore = new storeClass(ObjectHelper.assign({
                    modelClass,
                    project    : me,
                    stm
                }, assignmentStore))
            }
            else {
                assignmentStore.project = me
                stm.addStore(assignmentStore)
                me.joinStoreRecords(assignmentStore)
            }

            assignmentStore.setProject(me)

            me.$assignmentStore = assignmentStore

            me.trigger('assignmentStoreChange', { store : assignmentStore })
        }


        //endregion


        //region ResourceStore


        get resourceStore () : CoreResourceStoreMixin {
            return this.$resourceStore
        }


        setResourceStore (resourceStore : CoreResourceStoreMixin) {
            this.resourceStore = resourceStore
        }


        set resourceStore (resourceStore : CoreResourceStoreMixin) {
            const me       = this
            const { stm }  = me
            const oldStore = me.$resourceStore

            if (!(resourceStore instanceof Store)) {
                const { storeClass, modelClass } = me.resolveStoreAndModelClass('resource', resourceStore)

                resourceStore = new storeClass(ObjectHelper.assign({
                    modelClass,
                    project    : me,
                    stm
                }, resourceStore))
            }
            else {
                resourceStore.project = me
                stm.addStore(resourceStore)
                me.joinStoreRecords(resourceStore)
            }

            if (oldStore && stm.hasStore(oldStore)) {
                stm.removeStore(oldStore)
                me.unJoinStoreRecords(oldStore)

                const { assignmentsForRemoval } = oldStore

                // remap the assignment
                assignmentsForRemoval.forEach(assignment => {
                    const oldResource      = assignment.resource as CoreResourceMixin

                    if (oldResource) {
                        const newResource  = resourceStore.getById(oldResource.id)

                        if (newResource) {
                            assignment.resource    = newResource
                            // keep the assignment
                            assignmentsForRemoval.delete(assignment)
                        }
                    }
                })

                oldStore.afterResourceRemoval()
            }

            resourceStore.setProject(me)

            me.$resourceStore = resourceStore

            me.trigger('resourceStoreChange', { store : resourceStore })
        }


        //endregion


        //region DependencyStore


        get dependencyStore () : CoreDependencyStoreMixin {
            return this.$dependencyStore
        }


        setDependencyStore (dependencyStore : CoreDependencyStoreMixin) {
            this.dependencyStore = dependencyStore
        }


        set dependencyStore (dependencyStore : CoreDependencyStoreMixin) {
            const me                = this

            if (!(dependencyStore instanceof Store)) {
                const { storeClass, modelClass } = me.resolveStoreAndModelClass('dependency', dependencyStore)

                dependencyStore     = new storeClass(ObjectHelper.assign({
                    modelClass,
                    project    : me,
                    stm        : me.stm
                }, dependencyStore))
            }
            else {
                dependencyStore.project = me
                me.stm.addStore(dependencyStore)
                me.joinStoreRecords(dependencyStore)
            }

            me.$dependencyStore     = dependencyStore

            me.trigger('dependencyStoreChange', { store : dependencyStore })
        }


        //endregion


        //region CalendarManagerStore


        get calendarManagerStore () : CoreCalendarManagerStoreMixin {
            return this.$calendarManagerStore
        }


        setCalendarManagerStore (calendarManagerStore : CoreCalendarManagerStoreMixin) {
            this.calendarManagerStore = calendarManagerStore
        }


        set calendarManagerStore (calendarManagerStore : CoreCalendarManagerStoreMixin) {
            const me                      = this

            if (!(calendarManagerStore instanceof Store)) {
                // @ts-ignore
                const storeClass = calendarManagerStore?.storeClass || me.calendarManagerStoreClass
                // @ts-ignore
                const modelClass = calendarManagerStore?.modelClass || storeClass.getDefaultConfiguration().modelClass || me.calendarModelClass

                calendarManagerStore      = new storeClass(ObjectHelper.assign({
                    modelClass,
                    project    : me,
                    stm        : me.stm
                }, calendarManagerStore))
            }
            else {
                me.stm.addStore(calendarManagerStore)
            }

            calendarManagerStore.setProject(me)

            me.$calendarManagerStore = calendarManagerStore

            me.trigger('calendarManagerStoreChange', { store : calendarManagerStore })
        }


        //endregion


        //region Calendar


        get calendar () : CoreCalendarMixin {
            return this.$calendar || this.defaultCalendar
        }


        set calendar (calendar) {
            this.$calendar = calendar
        }


        get effectiveCalendar () : CoreCalendarMixin {
            return this.calendar
        }


        //endregion


        //region Add records


        async addEvent (event : InstanceType<this[ 'eventModelClass' ]>) : Promise<any> {
            this.eventStore.add(event)

            return this.commitAsync()
        }


        async addAssignment (assignment : InstanceType<this[ 'assignmentModelClass' ]>) : Promise<any> {
            this.assignmentStore.add(assignment)

            return this.commitAsync()
        }


        async addResource (resource : InstanceType<this[ 'resourceModelClass' ]>) : Promise<any> {
            this.resourceStore.add(resource)

            return this.commitAsync()
        }


        async addDependency (dependency : InstanceType<this[ 'dependencyModelClass' ]>) : Promise<any> {
            this.dependencyStore.add(dependency)

            return this.commitAsync()
        }


        //endregion


        //region Auto commit


        // Buffer commitAsync using setTimeout. Not using `buffer` on purpose, for performance reasons and to better
        // mimic how graph does it
        bufferedCommitAsync () {
            if (!this.hasPendingAutoCommit) {
                this.setTimeout({
                    fn    : 'commitAsync',
                    delay : 10
                })
            }
        }


        get hasPendingAutoCommit () : boolean {
            return this.hasTimeout('commitAsync')
        }


        unScheduleAutoCommit () {
            this.clearTimeout('commitAsync')
        }


        //endregion


        //region Commit

        async commitAsync () : Promise<any> {
            if (this.isPerformingCommit) return this.ongoing

            return this.ongoing = this.doCommitAsync()
        }


        async doCommitAsync () : Promise<any> {
            const me              = this

            me.isPerformingCommit = true

            // Cancel any outstanding commit
            me.unScheduleAutoCommit()

            await delay(0)

            if (!me.isDestroyed) {
                // Calculate all invalidated records, updates their data silently
                for (const record of me.$invalidated) {
                    record.calculateInvalidated()
                }

                const { isInitialCommit, silenceInitialCommit } = me

                // apply changes silently if this is initial commit and "silenceInitialCommit" option is enabled
                const silenceCommit                             = isInitialCommit && silenceInitialCommit

                // Notify stores that care about commit (internal)
                me.assignmentStore.onCommitAsync()
                me.dependencyStore.onCommitAsync()

                me.isInitialCommitPerformed = true
                me.hasLoadedDataToCommit    = false
                me.isPerformingCommit       = false

                const stores = [me.assignmentStore, me.dependencyStore, me.eventStore, me.resourceStore, me.calendarManagerStore]

                stores.forEach(store => store.suspendAutoCommit?.())

                me.isWritingData = true

                // "Real" project triggers refresh before data is written back to records
                me.trigger('refresh', { isInitialCommit })

                // If we are not announcing changes, take a cheaper path
                if (silenceCommit) {
                    for (const record of me.$invalidated) {
                        record.finalizeInvalidated(true)
                    }
                }
                else {
                    // Two loops looks a bit weird, but needed since editing assignment might affect event etc.
                    // And we do only want a single update in the end

                    // 1. Start batches and perform all calculations
                    for (const record of me.$invalidated) {
                        record.beginBatch(true)
                        record.finalizeInvalidated()
                    }

                    // 2. End batches, announcing changes (unless initial commit)
                    for (const record of me.$invalidated) {
                        record.endBatch(false, true)
                    }
                }

                me.isWritingData = false

                me.$invalidated.clear()

                // Mimic real projects events
                me.trigger('dataReady')

                stores.forEach(store => store.resumeAutoCommit?.())

                return true
            }
        }


        async propagateAsync () : Promise<any> {
            return this.commitAsync()
        }


        // Called when a record invalidates itself, queues it for calculation
        invalidate (record : CorePartOfProjectModelMixin) : void {
            this.$invalidated.add(record)
            this.bufferedCommitAsync()
        }


        // this does not account for possible scheduling conflicts
        async isValidDependency (...args) : Promise<boolean> {
            return true
        }


        //endregion


        //region STM


        getStm () : StateTrackingManager {
            return this.stm
        }


        /**
         * State tracking manager instance the project relies on
         */
        set stm (stm) {
            stm = this.$stm = new StateTrackingManager(ObjectHelper.assign({
                disabled : true
            }, stm))

            stm.on({
                // Propagate on undo/redo
                restoringStop: async () => {
                    // Disable STM meanwhile to not pick it up as a new STM transaction
                    stm.disable()
                    await this.commitAsync()
                    if (!this.isDestroyed) {
                        stm.enable()
                        this.trigger('stateRestoringDone')
                    }
                }
            })
        }


        get stm () {
            return this.$stm
        }


        //endregion

        isEngineReady () : boolean {
            return !this.hasPendingAutoCommit && !this.isPerformingCommit && this.isInitialCommitPerformed
        }
    }

    return SchedulerCoreProjectMixin
}){}
