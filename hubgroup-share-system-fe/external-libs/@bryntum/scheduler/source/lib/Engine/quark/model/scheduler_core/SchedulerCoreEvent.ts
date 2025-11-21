import { AnyConstructor, Mixin } from '../../../../ChronoGraph/class/BetterMixin.js'
import { CoreEventMixin } from './CoreEventMixin.js'
import { CoreHasAssignmentsMixin } from "./CoreHasAssignmentsMixin.js"
import { CoreHasDependenciesMixin } from './CoreHasDependenciesMixin.js'


/**
 * This is an event class, [[SchedulerCoreProjectMixin]] is working with.
 * It is constructed as [[CoreEventMixin]], enhanced with [[CoreHasAssignmentsMixin]] and [[CoreHasDependenciesMixin]]
 */
export class SchedulerCoreEvent extends Mixin(
    [
        CoreEventMixin,
        CoreHasAssignmentsMixin,
        CoreHasDependenciesMixin
    ],
    (base : AnyConstructor<
        CoreEventMixin &
        CoreHasAssignmentsMixin &
        CoreHasDependenciesMixin
        ,
        typeof CoreEventMixin &
        typeof CoreHasAssignmentsMixin &
        typeof CoreHasDependenciesMixin
    >) => {

    const superProto : InstanceType<typeof base> = base.prototype


    class SchedulerCoreEvent extends base {

    }

    return SchedulerCoreEvent
}){}
