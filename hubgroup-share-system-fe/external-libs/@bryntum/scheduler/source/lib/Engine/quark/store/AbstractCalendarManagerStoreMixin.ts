import { AnyConstructor, Mixin } from "../../../ChronoGraph/class/Mixin.js"
import { AbstractPartOfProjectStoreMixin } from "./mixin/AbstractPartOfProjectStoreMixin.js"

// Shared functionality for CoreCalendarManagerStoreMixin & ChronoCalendarManagerStoreMixin
export class AbstractCalendarManagerStoreMixin extends Mixin(
    [ AbstractPartOfProjectStoreMixin ],
    (base : AnyConstructor<AbstractPartOfProjectStoreMixin, typeof AbstractPartOfProjectStoreMixin>) => {

    const superProto : InstanceType<typeof base> = base.prototype


    class AbstractCalendarManagerStoreMixin extends base {
        // special handling to destroy calendar models as part of destroying this store
        doDestroy () {
            const records = []

            this.traverse(record => records.push(record))

            super.doDestroy()

            records.forEach(record => record.destroy())
        }
    }

    return AbstractCalendarManagerStoreMixin
}){}
