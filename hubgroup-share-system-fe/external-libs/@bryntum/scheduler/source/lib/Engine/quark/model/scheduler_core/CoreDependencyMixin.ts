import { SchedulerCoreProjectMixin } from "./SchedulerCoreProjectMixin.js"
import { CorePartOfProjectModelMixin } from "../mixin/CorePartOfProjectModelMixin.js"
import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/BetterMixin.js"
import { CoreEventMixin } from "./CoreEventMixin.js"
import { isInstanceOf } from '../../../../ChronoGraph/class/Mixin.js'


export class CoreDependencyMixin extends Mixin(
    [ CorePartOfProjectModelMixin ],
    (base : AnyConstructor<CorePartOfProjectModelMixin, typeof CorePartOfProjectModelMixin>) => {

    const superProto : InstanceType<typeof base> = base.prototype


    class CoreDependencyMixin extends base {

        project             : SchedulerCoreProjectMixin


        static get fields () {
            return [
                { name : 'fromEvent', isEqual: (a, b) => a === b, persist: false },
                { name : 'toEvent', isEqual : (a, b) => a === b, persist : false }
            ]
        }


        // Resolve early + update indices to have buckets ready before commit
        setChanged (field : string, value : any, invalidate? : boolean) {
            let update = false

            if (field === 'fromEvent' || field === 'toEvent') {
                const event = isInstanceOf(value, CoreEventMixin) ? value : this.eventStore?.getById(value)

                if (event) update = true

                value = event || value
            }

            superProto.setChanged.call(this, field, value, invalidate, true)

            if (update && !this.project.isPerformingCommit && !this.dependencyStore?.isLoadingData) {
                // TODO: Improve Collection indexing to handle smaller updates
                this.dependencyStore?.invalidateIndices()
            }
        }


        // Resolve events when joining project
        joinProject () {
            superProto.joinProject.call(this)

            // Initial values should be considered changed, to be normalized
            // (needs to pass through setChanged for early normalization expected for buckets)
            this.setChanged('fromEvent', this.get('fromEvent'))
            this.setChanged('toEvent', this.get('toEvent'))
        }


        // Resolved events as part of commit
        // Normally done earlier in setChanged, but stores might not have been available yet at that point
        calculateInvalidated () {
            // Changed values, should be used instead of current where available
            let { fromEvent, toEvent } = this.$changed

            if (fromEvent !== null && !(isInstanceOf(fromEvent, CoreEventMixin))) {
                const resolved = this.eventStore?.getById(fromEvent)
                if (resolved) this.$changed.fromEvent = resolved
            }

            if (toEvent !== null && !(isInstanceOf(toEvent, CoreEventMixin))) {
                const resolved = this.eventStore?.getById(toEvent)
                if (resolved) this.$changed.toEvent = resolved
            }
        }


        //region Events


        // Not using "propose" mechanism from CoreEventMixin, because buckets are expected to be up to date right away

        set fromEvent (fromEvent : string | number | CoreEventMixin) {
            this.setChanged('fromEvent', fromEvent)
        }


        get fromEvent () {
            const fromEvent = this.get('fromEvent')
            // Engine returns null instead of id when unresolved
            return isInstanceOf(fromEvent, CoreEventMixin) ? fromEvent : null
        }


        set toEvent (toEvent : string | number | CoreEventMixin) {
            this.setChanged('toEvent', toEvent)
        }


        get toEvent () {
            const toEvent = this.get('toEvent')
            // Engine returns null instead of id when unresolved
            return isInstanceOf(toEvent, CoreEventMixin) ? toEvent : null
        }


        //endregion
    }

    return CoreDependencyMixin
}){}
