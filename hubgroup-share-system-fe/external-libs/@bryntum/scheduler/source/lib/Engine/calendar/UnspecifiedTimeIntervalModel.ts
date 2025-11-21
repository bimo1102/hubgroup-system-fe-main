import { AnyConstructor, Mixin } from "../../ChronoGraph/class/BetterMixin.js"
import { CalendarIntervalMixin } from "./CalendarIntervalMixin.js"
import { AbstractCalendarMixin } from "../quark/model/AbstractCalendarMixin.js"

// TODO if we would be doing just:
//      export class UnspecifiedTimeIntervalModel extends CalendarIntervalMixin ...
// then an instance of the `CalendarIntervalMixin` `c` would : `c instanceof UnspecifiedTimeIntervalModel`,
// because it inherit the `hasInstance` symbol
// need to figure out how it can be handled


// Calendar interval model denoting unspecified interval
export class UnspecifiedTimeIntervalModel extends Mixin(
    [ CalendarIntervalMixin ],
    (base : AnyConstructor<CalendarIntervalMixin, typeof CalendarIntervalMixin>) => {

    const superProto : InstanceType<typeof base> = base.prototype


    class UnspecifiedTimeIntervalModel extends base {
        calendar        : AbstractCalendarMixin

        // TODO: Field
        // @model_field({ type : 'number', defaultValue : 10 })
        priority        : number

        // TODO: why it overrides the method, is it configured with calendar instance directly?
        getCalendar () : AbstractCalendarMixin {
            return this.calendar
        }

        // NOTE: See parent class implementation for further comments
        getPriorityField () {
            if (this.priorityField != null) return this.priorityField

            return this.priorityField = this.getCalendar().getDepth()
        }
    }

    return UnspecifiedTimeIntervalModel
}) {}
