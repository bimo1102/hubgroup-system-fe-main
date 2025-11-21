import { AnyConstructor, Mixin } from "../../ChronoGraph/class/BetterMixin.js"
import { CalendarIntervalMixin } from "./CalendarIntervalMixin.js"
import { AbstractPartOfProjectStoreMixin } from "../quark/store/mixin/AbstractPartOfProjectStoreMixin.js"
import { AbstractCalendarMixin } from "../quark/model/AbstractCalendarMixin.js"

/*
 * This a collection of {@link #CalendarIntervalMixin} items. Its a dumb collection though, the "real" calendar
 * is a [[AbstractCalendarMixin]] model, which is part of the [[AbstractCalendarManagerStoreMixin]].
 *
 */
export class CalendarIntervalStore extends Mixin(
    [ AbstractPartOfProjectStoreMixin ],
    (base : AnyConstructor<AbstractPartOfProjectStoreMixin, typeof AbstractPartOfProjectStoreMixin>) => {

    const superProto : InstanceType<typeof base> = base.prototype


    class CalendarIntervalStore extends base {
        modelClass      : typeof CalendarIntervalMixin

        calendar        : AbstractCalendarMixin


        static get defaultConfig () {
            return {
                modelClass : CalendarIntervalMixin
            }
        }
    }

    return CalendarIntervalStore

}){}
