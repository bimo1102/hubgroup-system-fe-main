import { SchedulerCoreProjectMixin } from './SchedulerCoreProjectMixin'
import { CorePartOfProjectModelMixin } from '../mixin/CorePartOfProjectModelMixin.js'
import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/BetterMixin.js"
import { AbstractCalendarMixin } from "../AbstractCalendarMixin.js"


/**
 * The calendar for project scheduling, it is used to mark certain time intervals as "non-working" and ignore them during scheduling.
 *
 * The calendar consists from several [[CalendarIntervalMixin|intervals]]. The intervals can be either static or recurrent.
 */
export class CoreCalendarMixin extends Mixin(
    [ AbstractCalendarMixin, CorePartOfProjectModelMixin ],
    (base : AnyConstructor<AbstractCalendarMixin & CorePartOfProjectModelMixin, typeof AbstractCalendarMixin & typeof CorePartOfProjectModelMixin>) => {

    const superProto : InstanceType<typeof base> = base.prototype


        class CoreCalendarMixin extends base {

            project                  : SchedulerCoreProjectMixin

        }

        return CoreCalendarMixin
    }){}
