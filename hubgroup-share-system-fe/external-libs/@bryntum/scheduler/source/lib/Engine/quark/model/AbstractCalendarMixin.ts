import { AnyConstructor, Mixin } from "../../../ChronoGraph/class/BetterMixin.js"
import { CalendarIntervalStore } from "../../calendar/CalendarIntervalStore.js"
import { CalendarCacheInterval } from "../../calendar/CalendarCacheInterval.js"
import { CalendarIteratorResult } from "../../calendar/CalendarCache.js"
import { Duration, TimeUnit } from "../../scheduling/Types.js"
import { CalendarIntervalMixin } from "../../calendar/CalendarIntervalMixin.js"
import { CalendarCacheSingle } from "../../calendar/CalendarCacheSingle.js"
import { UnspecifiedTimeIntervalModel } from "../../calendar/UnspecifiedTimeIntervalModel.js"
import DateHelper from "../../../Core/helper/DateHelper.js"
import { AbstractProjectMixin } from "./AbstractProjectMixin.js"
import { AbstractPartOfProjectModelMixin } from "./mixin/AbstractPartOfProjectModelMixin.js"


/**
 * Result of the [[accumulateWorkingTime]].
 */
export type AccumulateWorkingTimeResult = {
    /**
     * The date at which iterator stopped
     */
    finalDate : Date,
    /**
     * Remaining duration in milliseconds.
     */
    remainingDurationInMs : number
}


/**
 * Calendar for project scheduling, mixed by CoreCalendarMixin and BaseCalendarMixin. It is used to mark certain time
 * intervals as "non-working" and ignore them during scheduling.
 *
 * The calendar consists from several [[CalendarIntervalMixin|intervals]]. The intervals can be either static or recurrent.
 */
export class AbstractCalendarMixin extends Mixin(
    [ AbstractPartOfProjectModelMixin ],
    (base : AnyConstructor<AbstractPartOfProjectModelMixin, typeof AbstractPartOfProjectModelMixin>) => {

    const superProto : InstanceType<typeof base> = base.prototype


    class CalendarMixin extends base {

        project                  : AbstractProjectMixin

        intervalStore            : CalendarIntervalStore

        static get fields () {
            return [
                { name : 'version', type : 'number' },
                'name',
                { name : 'unspecifiedTimeIsWorking', type : 'boolean', defaultValue : true },
                'intervals'
            ]
        }

        version                  : number    = 1

        /**
         * The calendar name
         */
        name                     : string

        /**
         * The flag, indicating, whether the "unspecified" time (time that does not belong to any [[CalendarIntervalMixin|interval]])
         * is working (`true`) or not (`false`). Default value is `true`
         */
        unspecifiedTimeIsWorking : boolean

        intervals                : Partial<CalendarIntervalMixin>[]


        get intervalStoreClass () : typeof CalendarIntervalStore {
            return CalendarIntervalStore
        }


        afterConstruct () {
            superProto.afterConstruct.call(this)

            // @ts-ignore
            const modelClass = this.getDefaultConfiguration().calendarIntervalModelClass || this.intervalStoreClass.defaultConfig.modelClass

            this.intervalStore  = new this.intervalStoreClass({
                calendar : this,
                modelClass
            })

            // if intervals are provided add them to the this.intervalStore
            if (this.intervals && this.intervals.length) {
                this.addIntervals(this.intervals)
            }
        }


        isDefault () : boolean {
            const project = this.getProject()

            if (project) {
                return this === project.defaultCalendar
            }

            return false
        }


        // TODO: move to Model?
        getDepth () : number {
            return this.childLevel + 1
        }


        /**
         * The core iterator method of the calendar.
         *
         * @param options The options for iterator. Should contain at least one of the `startDate`/`endDate` properties
         * which indicates what timespan to examine for availability intervals. If one of boundaries is not provided
         * iterator function should return `false` at some point, to avoid infinite loops.
         *
         * Another recognized option is `isForward`, which indicates the direction in which to iterate through the timespan.
         *
         * @param func The iterator function to call. It will be called for every distinct set of availability intervals, found
         * in the given timespan. All the intervals, which are "active" for current interval are collected in the 3rd argument
         * for this function - [[CalendarCacheInterval|calendarCacheInterval]]. If iterator returns `false` (checked with `===`)
         * the iteration stops.
         *
         * @param scope The scope (`this` value) to execute the iterator in.
         */
        forEachAvailabilityInterval (
            options     : { startDate? : Date, endDate? : Date, isForward? : boolean },
            func        : (startDate : Date, endDate : Date, calendarCacheInterval : CalendarCacheInterval) => any,
            scope?      : object
        ) : CalendarIteratorResult {
            return this.calendarCache.forEachAvailabilityInterval(options, func, scope)
        }


        /**
         * This method starts at the given `date` and moves forward or backward in time, depending on `isForward`.
         * It stops moving as soon as it accumulates the `durationMs` milliseconds of working time and returns the date
         * at which it has stopped and remaining duration - the [[AccumulateWorkingTimeResult]] object.
         *
         * Normally, the remaining duration will be 0, indicating the full `durationMs` has been accumulated.
         * However, sometimes, calendar might not be able to accumulate enough working time due to various reasons,
         * like if it does not contain enough working time - this case will be indicated with remaining duration bigger than 0.
         *
         * @param date
         * @param durationMs
         * @param isForward
         */
        accumulateWorkingTime (date : Date, durationMs : Duration, isForward : boolean) : AccumulateWorkingTimeResult {
            // if duration is 0 - return the same date
            if (durationMs === 0) return { finalDate : new Date(date), remainingDurationInMs : 0 }

            if (isNaN(durationMs)) throw new Error("Invalid duration")

            let finalDate               = date

            this.forEachAvailabilityInterval(
                isForward ? { startDate : date, isForward : true } : { endDate : date, isForward : false },

                (intervalStartDate, intervalEndDate, calendarCacheInterval) => {
                    let result = true

                    if (calendarCacheInterval.getIsWorking()) {
                        const dstDiff               = intervalStartDate.getTimezoneOffset() - intervalEndDate.getTimezoneOffset()
                        const diff                  = intervalEndDate.getTime() - intervalStartDate.getTime() + dstDiff * 60 * 1000

                        if (durationMs <= diff) {
                            finalDate               = isForward
                                ?
                                new Date(intervalStartDate.getTime() + durationMs)
                                :
                                new Date(intervalEndDate.getTime() - durationMs)

                            durationMs   = 0

                            result = false
                        } else {
                            finalDate                = isForward ? intervalEndDate : intervalStartDate
                            durationMs   -= diff
                        }
                    }

                    return result
                }
            )

            return { finalDate : new Date(finalDate), remainingDurationInMs : durationMs }
        }


        /**
         * Calculate the working time duration between the 2 dates, in milliseconds.
         *
         * @param startDate
         * @param endDate
         */
        calculateDurationMs (startDate : Date, endDate : Date) : Duration {
            let duration        = 0

            this.forEachAvailabilityInterval(
                { startDate : startDate, endDate : endDate },

                (intervalStartDate, intervalEndDate, calendarCacheInterval) => {

                    if (calendarCacheInterval.getIsWorking()) {
                        const dstDiff   = intervalStartDate.getTimezoneOffset() - intervalEndDate.getTimezoneOffset()

                        duration        += intervalEndDate.getTime() - intervalStartDate.getTime() + dstDiff * 60 * 1000
                    }
                }
            )

            return duration
        }


        /**
         * Calculate the end date of the time interval which starts at `startDate` and has `durationMs` working time duration
         * (in milliseconds).
         *
         * @param startDate
         * @param durationMs
         */
        calculateEndDate (startDate : Date, durationMs : Duration) : Date | null {
            // the method goes forward by default ..unless a negative duration provided
            const isForward : boolean   = durationMs >= 0

            const res   = this.accumulateWorkingTime(startDate, Math.abs(durationMs), isForward)

            return res.remainingDurationInMs === 0 ? res.finalDate : null
        }


        /**
         * Calculate the start date of the time interval which ends at `endDate` and has `durationMs` working time duration
         * (in milliseconds).
         *
         * @param endDate
         * @param durationMs
         */
        calculateStartDate (endDate : Date, durationMs : Duration) : Date | null {
            // the method goes backwards by default ..unless a negative duration provided
            const isForward : boolean   = durationMs <= 0

            const res   = this.accumulateWorkingTime(endDate, Math.abs(durationMs), isForward)

            return res.remainingDurationInMs === 0 ? res.finalDate : null
        }


        /**
         * Returns the earliest point at which a working period of time starts, following the given date.
         * Can be the date itself, if it comes on the working time.
         *
         * @param date The date after which to skip the non-working time.
         * @param isForward Whether the "following" means forward in time or backward.
         */
        skipNonWorkingTime (date : Date, isForward : boolean = true) : Date | null | 'empty_calendar' {
            let workingDate : Date

            const res = this.forEachAvailabilityInterval(
                isForward ? { startDate : date, isForward : true } : { endDate : date, isForward : false },

                (intervalStartDate, intervalEndDate, calendarCacheInterval) => {
                    if (calendarCacheInterval.getIsWorking()) {
                        workingDate = isForward ? intervalStartDate : intervalEndDate

                        return false
                    }
                }
            )

            if (res === CalendarIteratorResult.MaxRangeReached || res === CalendarIteratorResult.FullRangeIterated) return 'empty_calendar'

            return workingDate ? new Date(workingDate) : new Date(date)
        }


        /**
         * This method adds a single [[CalendarIntervalMixin]] to the internal collection of the calendar
         */
        addInterval (interval : Partial<CalendarIntervalMixin>) {
            return this.addIntervals([ interval ])
        }


        /**
         * This method adds an array of [[CalendarIntervalMixin]] to the internal collection of the calendar
         */
        addIntervals (intervals : Partial<CalendarIntervalMixin>[]) {
            this.bumpVersion()

            return this.intervalStore.add(intervals)
        }


        /**
         * This method removes all intervals from the internal collection of the calendar
         */
        clearIntervals (silent? : boolean) {
            if (!silent) {
                this.bumpVersion()
            }

            return this.intervalStore.removeAll(silent)
        }


        bumpVersion () {
            this.clearCache()
            this.version++
        }


        $calendarCache           : CalendarCacheSingle

        get calendarCache () : CalendarCacheSingle {
            if (this.$calendarCache !== undefined) return this.$calendarCache

            const unspecifiedTimeInterval       = new UnspecifiedTimeIntervalModel({
                isWorking       : this.unspecifiedTimeIsWorking
            })

            unspecifiedTimeInterval.calendar    = this

            return this.$calendarCache = new CalendarCacheSingle({
                calendar                : this,
                unspecifiedTimeInterval : unspecifiedTimeInterval,
                intervalStore           : this.intervalStore,
                parentCache             : this.parent && !this.parent.isRoot ? this.parent.calendarCache : null
            })
        }


        clearCache () {
            // not strictly needed, we just help garbage collector
            this.$calendarCache && this.$calendarCache.clear()
            this.$calendarCache = undefined
        }


        resetPriorityOfAllIntervals () {
            this.traverse((calendar : CalendarMixin) => {
                calendar.intervalStore.forEach((interval : CalendarIntervalMixin) => interval.resetPriority())
            })
        }


        insertChild (child, before?, silent?) {
            let res = superProto.insertChild.call(this, ...arguments)

            if (!Array.isArray(res)) {
                res = [res]
            }

            // invalidate cache of the child record, since now it should take parent into account
            res.forEach((r : CalendarMixin) => {
                r.bumpVersion()
                r.resetPriorityOfAllIntervals()
            })

            return res
        }


        joinProject () {
            superProto.joinProject.call(this)

            this.intervalStore.setProject(this.getProject())
        }


        leaveProject () {
            superProto.leaveProject.call(this)

            this.intervalStore.setProject(null)

            this.intervalStore.destroy()
            this.clearCache()
        }

        doDestroy () {
            this.leaveProject()
            super.doDestroy()
        }

        isDayHoliday (day : Date) : boolean {
            const startDate = DateHelper.clearTime(day),
                endDate = DateHelper.getNext(day, TimeUnit.Day)

            let hasWorkingTime = false

            this.forEachAvailabilityInterval(
                { startDate, endDate, isForward : true },
                (_intervalStartDate, _intervalEndDate, calendarCacheInterval) => {
                    hasWorkingTime = calendarCacheInterval.getIsWorking()
                    return !hasWorkingTime
                }
            )

            return !hasWorkingTime
        }

        // TODO: tests
        getDailyHolidaysRanges (startDate : Date, endDate : Date) : { startDate : Date, endDate : Date }[] {
            const result = []

            startDate = DateHelper.clearTime(startDate)

            while (startDate < endDate) {
                if (this.isDayHoliday(startDate)) {
                    result.push({
                        startDate,
                        endDate : DateHelper.getStartOfNextDay(startDate, true, true)
                    })
                }
                startDate = DateHelper.getNext(startDate, TimeUnit.Day)
            }

            return result
        }

        getNonWorkingTimeRanges (startDate : Date, endDate : Date) : { startDate : Date, endDate : Date }[] {
            const result = []

            this.forEachAvailabilityInterval(
                { startDate, endDate, isForward : true },
                (intervalStartDate, intervalEndDate, calendarCacheInterval) => {
                    if (!calendarCacheInterval.getIsWorking()) {
                        const entry = calendarCacheInterval.intervals[0]
                        result.push({
                            name      : entry.name,
                            startDate : intervalStartDate,
                            endDate   : intervalEndDate
                        })
                    }
                }
            )

            return result
        }

        /**
         * Checks if there is a working time interval in the provided time range
         * @param startDate
         * @param endDate
         */
        isWorkingTime(startDate : Date, endDate : Date) : boolean {
            // Can be Date | null | 'empty_calendar'
            const workingTimeStart : any = this.skipNonWorkingTime(startDate);
            return workingTimeStart && workingTimeStart !== 'empty_calendar' ? workingTimeStart < endDate : false;
        }
    }

    return CalendarMixin
}){}
