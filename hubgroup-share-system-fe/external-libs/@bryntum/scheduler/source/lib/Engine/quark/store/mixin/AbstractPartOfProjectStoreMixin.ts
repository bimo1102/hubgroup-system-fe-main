import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/BetterMixin.js"
import { AbstractPartOfProjectGenericMixin } from "../../AbstractPartOfProjectGenericMixin.js"
import { AbstractProjectMixin } from "../../model/AbstractProjectMixin.js"
import Store from "../../../../Core/data/Store.js"


/**
 * This an abstract mixin for every Store, that belongs to a project.
 *
 * The store with this mixin, supposes, that it will be "joining" the project, a reference to which is saved
 * and made available for all models.
 */
export class AbstractPartOfProjectStoreMixin extends Mixin(
    [
        AbstractPartOfProjectGenericMixin,
        Store
    ],
    (base : AnyConstructor<
        AbstractPartOfProjectGenericMixin &
        Store
        ,
        typeof AbstractPartOfProjectGenericMixin
        & typeof Store
>) => {

    const superProto : InstanceType<typeof base> = base.prototype


    class AbstractPartOfProjectStoreMixin extends base {


        isLoadingData   : boolean = false
        eventsSuspended : any
        asyncEvents     : any


        //region Async event triggering


        // NOTE: Tested in Scheduler (EventStore.t.js)


        construct (config : any = {}) {
            config.asyncEvents = {
                add       : true,
                remove    : true,
                removeAll : true,
                change    : true,
                refresh   : true,
                replace   : true,
                move      : true,
                update    : true
            }

            return superProto.construct.call(this, config)
        }


        // Override for event triggering, to allow triggering events before and after some async operation.
        // The "before" events are prefix, the "after" are not.
        trigger (eventName, param) {
            const
                me                       = this,
                { asyncEvents, project } = me,
                asyncEvent               = asyncEvents?.[eventName],
                asyncAction              = asyncEvent && (asyncEvent === true || asyncEvent[param.action])

            if (!asyncAction) {
                // Trigger as usual
                return superProto.trigger.call(me, eventName, param)
            }

            // Trigger prefixed before event
            superProto.trigger.call(me, `${eventName}PreCommit`, {...param})

            // Event that did not invalidate engine, for example "update"
            if (!project || project.isEngineReady() && !project.isWritingData) {
                // Trigger "original" event
                superProto.trigger.call(me, eventName, param)
            }
            else if (!me.eventsSuspended && project) {
                // Instead of making n auto-destroying listeners (which takes enormous amount of time), we make a single
                // one and queue all the events. When dataReady event is triggered we trigger those events
                // https://github.com/bryntum/support/issues/3154
                if (!project.dataReadyDetacher) {
                    project.queuedDataReadyEvents = [];

                    // Wait for commit without triggering one, otherwise we would affect commit scheduling
                    project.dataReadyDetacher = project.on({
                        dataReady() {
                            // Trigger "original" event
                            this.queuedDataReadyEvents.forEach(([superProto, scope, eventName, param]) => {
                                superProto.trigger.call(scope, eventName, param);
                            })

                            project.queuedDataReadyEvents = null
                            project.dataReadyDetacher()
                            project.dataReadyDetacher = null
                        },
                        once : true
                    })
                }

                project.queuedDataReadyEvents.push([superProto, me, eventName, param])
            }

            // No way of handling other return values in this scenario, wont work for preventable events
            return true
        }


        //endregion


        calculateProject () : AbstractProjectMixin {
            // project is supposed to be provided for stores from outside
            return this.project
        }


        setStoreData (data : any) {
            // Loading data sets hasLoadedDataToCommit flag.
            // So we treat the 1st commit after data loading as the initial one
            if (this.project) {
                this.project.hasLoadedDataToCommit = true
            }

            this.isLoadingData = true

            superProto.setStoreData.call(this, data)

            this.isLoadingData = false

            this.project?.trigger('storeRefresh', { store : this })
        }


        // Override to postpone auto commits to after project commit, makes sure records are unmodified after commit
        async doAutoCommit () {
            if (this.suspendCount <= 0 && this.project && !this.project.isEngineReady()) {
                // TODO: Ask nick about this, I could not get mixin order correct for this to work
                // @ts-ignore
                await this.project.commitAsync()
            }

            superProto.doAutoCommit.call(this)
        }

        async addAsync (records : Partial<InstanceType<this[ 'modelClass' ]>> | Partial<InstanceType<this[ 'modelClass' ]>>[], silent? : boolean)
            : Promise<any[]>
        {
            const result = this.add(records, silent)

            await this.project.commitAsync()

            return result
        }


        async insertAsync (index : number, records : Partial<InstanceType<this[ 'modelClass' ]>> | Partial<InstanceType<this[ 'modelClass' ]>>[], silent? : boolean)
            :  Promise<any[]>
        {
            const result = this.insert(index, records, silent)

            await this.project.commitAsync()

            return result
        }


        async loadDataAsync (data : object[]) {
            this.data = data

            await this.project.commitAsync()
        }
    }

    return AbstractPartOfProjectStoreMixin

}){}

