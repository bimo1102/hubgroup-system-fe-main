import { Base } from '../../ChronoGraph/class/BetterMixin.js'
import { MAX_DATE, MIN_DATE } from '../util/Constants.js'
import { EdgeInclusion } from "../util/Types.js"

/**
 * General purpose date interval. Contains just 2 properties - [[startDate]] and [[endDate]].
 */
export class DateInterval extends Base {

    /**
     * The start date of the interval. If start date is omitted it is set to [[MIN_DATE]].
     */
    startDate       : Date

    /**
     * The start date of the interval. If end date is omitted it is set to [[MAX_DATE]].
     */
    endDate         : Date


    initialize (...args) {
        super.initialize(...args)

        if (!this.startDate) this.startDate = MIN_DATE
        if (!this.endDate) this.endDate = MAX_DATE
    }


    equalTo (another : DateInterval) : boolean {
        return this.startDate.getTime() === another.startDate.getTime() && this.endDate.getTime() === another.endDate.getTime()
    }


    startDateIsFinite () : boolean {
        return !this.isIntervalEmpty() && this.startDate.getTime() !== MIN_DATE.getTime()
    }


    endDateIsFinite () : boolean {
        return !this.isIntervalEmpty() && this.endDate.getTime() !== MAX_DATE.getTime()
    }

    /**
     * Test whether the given time point is within this interval. By default interval is considered to be
     * inclusive on the left side and opened on the right (controlled with `edgeInclusion`).
     *
     * @param date
     * @param edgeInclusion
     */
    containsDate (date : Date, edgeInclusion : EdgeInclusion = EdgeInclusion.Left) : boolean {
        return (
            (
                edgeInclusion === EdgeInclusion.Left && (date >= this.startDate && date < this.endDate)
            )
            ||
            (
                edgeInclusion === EdgeInclusion.Right && (date > this.startDate && date <= this.endDate)
            )
        )
    }


    isIntervalEmpty () : boolean {
        return this.startDate > this.endDate
    }


    /**
     * Intersect this interval with another in the immutable way - returns a new interval.
     * @param another
     */
    intersect (another : DateInterval) : DateInterval {
        const anotherStart      = another.startDate
        const anotherEnd        = another.endDate
        const start             = this.startDate
        const end               = this.endDate

        // No intersection found
        if ((end < anotherStart) || (start > anotherEnd)) {
            // return an empty interval
            return EMPTY_INTERVAL
        }

        const newStart = new Date(Math.max(start.getTime(), anotherStart.getTime()))
        const newEnd   = new Date(Math.min(end.getTime(), anotherEnd.getTime()))

        return (this.constructor as typeof DateInterval).new({ startDate : newStart, endDate : newEnd })
    }


    /**
     * Intersect this interval with another in the mutable way - updates current interval.
     * @param another
     */
    intersectMut (another : DateInterval) : DateInterval {
        const anotherStart      = another.startDate
        const anotherEnd        = another.endDate
        const start             = this.startDate
        const end               = this.endDate

        // No intersection found
        if ((end < anotherStart) || (start > anotherEnd)) {
            // return an empty interval
            this.startDate          = MAX_DATE
            this.endDate            = MIN_DATE

            return this
        }

        this.startDate          = new Date(Math.max(start.getTime(), anotherStart.getTime()))
        this.endDate            = new Date(Math.min(end.getTime(), anotherEnd.getTime()))

        return this
    }
}

export const EMPTY_INTERVAL  = DateInterval.new({ startDate : MAX_DATE, endDate : MIN_DATE })

/**
 * Intersects the array of intervals. Returns a new interval with result.
 *
 * @param dateIntervals
 */
export const intersectIntervals = (dateIntervals : DateInterval[]) : DateInterval => {
    return dateIntervals.reduce((acc, currentInterval) => acc.intersectMut(currentInterval), DateInterval.new())
}
