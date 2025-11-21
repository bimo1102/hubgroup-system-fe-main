import DateHelper from "../../Core/helper/DateHelper.js"
import { Duration, TimeUnit } from "../scheduling/Types.js"
import { MAX_DATE, MIN_DATE } from "../util/Constants.js"
import { EdgeInclusion } from "../util/Types.js"
import { IntervalCache } from "./IntervalCache.js"


/**
 * The enum type for result of [[forEachAvailabilityInterval]].
 */
export enum CalendarIteratorResult {
    /**
     * Indicates the iteration has completed by iterating the whole given timespan or has reached the MAX_DATE or MIN_DATE.
     */
    FullRangeIterated,
    /**
     * Indicates the iteration has been stopped by returning `false` from the iterator.
     */
    StoppedByIterator,
    /**
     * Indicates the iteration has exceeded the `maxRange` option
     */
    MaxCacheExtendCyclesReached,
    /**
     * Indicates the iteration has exceeded the `maxRange` option
     */
    MaxRangeReached
}

/**
 * Calendar cache.
 */
export class CalendarCache<IntervalT, CombineWithIntervalT> {

    cacheFilledStartDate            : Date = MAX_DATE
    cacheFilledEndDate              : Date = MIN_DATE

    intervalCache                   : IntervalCache<IntervalT, CombineWithIntervalT>

    intervalsCachingChunkDuration   : Duration  = 30
    intervalsCachingChunkUnit       : TimeUnit  = TimeUnit.Day

    maxCacheExtendCycles            : number    = 100

    // max range for the iteration - 5 years
    maxRange                        : number    = 5 * 12 * 30 * 24 * 60 * 60 * 1000


    constructor (config? : Partial<CalendarCache<IntervalT, CombineWithIntervalT>>) {
        config && Object.assign(this, config)
    }


    includeWrappingRangeFrom (cache : CalendarCache<CombineWithIntervalT, any>, startDate : Date, endDate : Date) {
        cache.ensureCacheFilledForInterval(startDate, endDate)

        this.intervalCache.includeWrappingRange(cache.intervalCache, startDate, endDate)
    }


    // after this method, we guarantee, that for every point between `startDate` and `endDate` (_inclusive_)
    // we'll have a final representation of the cache, that is, we'll be able to get an interval to which this point belongs
    // _both_ for forward and backward directions
    ensureCacheFilledForInterval (startDate : Date, endDate : Date) {
        const cacheFilledStartDateN = this.cacheFilledStartDate.getTime()
        const cacheFilledEndDateN   = this.cacheFilledEndDate.getTime()

        if (cacheFilledStartDateN !== MAX_DATE.getTime()) {
            const startDateN        = startDate.getTime()
            const endDateN          = endDate.getTime()

            if (cacheFilledStartDateN <= startDateN && endDateN <= cacheFilledEndDateN) return

            // asked to cache an interval which is to the left from the cached area - extend to the right
            if (endDateN <= cacheFilledStartDateN) {

                endDate             = new Date(cacheFilledStartDateN - 1)

            } else if (startDateN >= cacheFilledEndDateN) {

                startDate           = new Date(cacheFilledEndDateN + 1)

            } else if (cacheFilledStartDateN <= startDateN && startDateN <= cacheFilledEndDateN) {

                startDate           = new Date(cacheFilledEndDateN + 1)

            } else if (cacheFilledStartDateN <= endDateN && endDateN <= cacheFilledEndDateN) {

                endDate             = new Date(cacheFilledStartDateN - 1)

            } else {
                this.ensureCacheFilledForInterval(startDate, new Date(cacheFilledStartDateN - 1))
                this.ensureCacheFilledForInterval(new Date(cacheFilledEndDateN + 1), endDate)

                return
            }
        }

        if (cacheFilledStartDateN === MAX_DATE.getTime() || startDate.getTime() < cacheFilledEndDateN) {
            this.cacheFilledStartDate   = startDate
        }

        if (cacheFilledEndDateN === MIN_DATE.getTime() || cacheFilledEndDateN < endDate.getTime()) {
            this.cacheFilledEndDate     = endDate
        }

        this.fillCache(startDate, endDate)
    }


    fillCache (_1/* startDate */ : Date, _2/* endDate */ : Date) {
        throw new Error("Abstract method")
    }


    clear () {
        this.cacheFilledStartDate   = MAX_DATE
        this.cacheFilledEndDate     = MIN_DATE

        this.intervalCache.clear()
    }


    /**
     * The core iterator method of the calendar cache.
     *
     * @param options The options for iterator. Should contain at least one of the `startDate`/`endDate` properties
     * which indicates what timespan to examine for availability intervals. If one of boundaries is not provided
     * iterator function should return `false` at some point, to avoid infinite loops.
     *
     * Another recognized option is `isForward`, which indicates the direction in which to iterate through the timespan.
     *
     * Another recognized option is `maxRange`, which indicates the maximum timespan for this iterator (in milliseconds). When iterator
     * exceeds this timespan, the iteration is stopped and [[CalendarIteratorResult.MaxRangeReached]] value is returned.
     * Default value is 5 years.
     *
     * @param func The iterator function to call. It will be called for every distinct set of availability intervals, found
     * in the given timespan. All the intervals, which are "active" for current interval are collected in the 3rd argument
     * for this function. If iterator returns `false` (checked with `===`) the iteration stops.
     *
     * @param scope The scope (`this` value) to execute the iterator in.
     */
    forEachAvailabilityInterval (
        options     : { startDate? : Date, endDate? : Date, isForward? : boolean, maxRange? : number },
        func        : (startDate : Date, endDate : Date, calendarCacheInterval : IntervalT) => false | void,
        scope?      : object
    ) : CalendarIteratorResult {
        scope                       = scope || this

        const startDate             = options.startDate
        const endDate               = options.endDate
        const startDateN            = startDate && startDate.getTime()
        const endDateN              = endDate && endDate.getTime()
        const maxRange              = options.maxRange ?? this.maxRange

        // `isForward = true` by default
        const isForward             = options.isForward !== false

        if (isForward ? !startDate : !endDate) {
            throw new Error("At least `startDate` or `endDate` is required, depending from the `isForward` option")
        }

        const intervalCache         = this.intervalCache

        let cacheCursorDate         = isForward ? startDate : endDate
        let cursorDate              = isForward ? startDate : endDate

        const rangeStart            = cursorDate.getTime()

        // this is generally an endless loop, but we artificially limit it to `maxCacheExtendCycles` iterations
        // to avoid freezing in unforeseen edge cases
        for (let cycle = 1; cycle < this.maxCacheExtendCycles; cycle++) {
            if (isForward) {
                this.ensureCacheFilledForInterval(
                    cacheCursorDate,
                    endDate || DateHelper.add(cacheCursorDate, this.intervalsCachingChunkDuration, this.intervalsCachingChunkUnit)
                )
            } else {
                this.ensureCacheFilledForInterval(
                    startDate || DateHelper.add(cacheCursorDate, -this.intervalsCachingChunkDuration, this.intervalsCachingChunkUnit),
                    cacheCursorDate
                )
            }

            let interval        = intervalCache.getIntervalOf(cursorDate, isForward ? EdgeInclusion.Left : EdgeInclusion.Right)

            while (interval) {
                const intervalStartDate = interval.startDate
                const intervalEndDate   = interval.endDate

                // out of requested range - all done
                if (
                    (isForward && endDateN && intervalStartDate.getTime() >= endDateN)
                    ||
                    (!isForward && startDateN && intervalEndDate.getTime() <= startDateN)
                ) {
                    return CalendarIteratorResult.FullRangeIterated
                }

                if (
                    (isForward && intervalStartDate.getTime() - rangeStart >= maxRange)
                    ||
                    (!isForward && rangeStart - intervalEndDate.getTime() >= maxRange)
                ) {
                    return CalendarIteratorResult.MaxRangeReached
                }


                // we are out of cached area, need to extend the cache
                if (
                    (isForward && intervalStartDate.getTime() > this.cacheFilledEndDate.getTime())
                    ||
                    (!isForward && intervalEndDate.getTime() < this.cacheFilledStartDate.getTime())
                ) {
                    break
                }

                // save the last processed point, from which we should start after cache will be extended
                cursorDate              = isForward ? intervalEndDate : intervalStartDate

                // adjust to start / end date limits in iterator
                const countFrom         = startDateN && intervalStartDate.getTime() < startDateN ? startDate : intervalStartDate
                const countTill         = endDateN && intervalEndDate.getTime() > endDateN ? endDate : intervalEndDate

                if (func.call(scope, countFrom, countTill, interval.cacheInterval) === false) {
                    // indicates premature exit if iterator returns `false`
                    return CalendarIteratorResult.StoppedByIterator
                }

                interval                = isForward ? intervalCache.getNextInterval(interval) : intervalCache.getPrevInterval(interval)
            }

            if (isForward && cursorDate.getTime() === MAX_DATE.getTime() || !isForward && cursorDate.getTime() === MIN_DATE.getTime()) {
                return CalendarIteratorResult.FullRangeIterated
            }

            cacheCursorDate             = isForward ? this.cacheFilledEndDate : this.cacheFilledStartDate
        }

        return CalendarIteratorResult.MaxCacheExtendCyclesReached
    }
}
