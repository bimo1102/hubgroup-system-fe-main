import { stripDuplicates } from "../util/StripDuplicates.js"
import { CalendarCacheInterval } from "./CalendarCacheInterval.js"
import { CalendarIntervalMixin } from "./CalendarIntervalMixin.js"
import { AbstractCalendarMixin } from "../quark/model/AbstractCalendarMixin.js"


export class CalendarCacheIntervalMultiple {
    intervalGroups                  : Array<[ AbstractCalendarMixin, CalendarCacheInterval ]> = []

    intervalsByCalendar             : Map<AbstractCalendarMixin, CalendarIntervalMixin[]>

    private calendarsWorkStatus     : Map<AbstractCalendarMixin, boolean>
    private calendars               : AbstractCalendarMixin[]
    private calendarsWorking        : AbstractCalendarMixin[]
    private calendarsNonWorking     : AbstractCalendarMixin[]

    private isWorkingForSome        : boolean
    private isWorkingForEvery       : boolean


    constructor (config? : Partial<CalendarCacheIntervalMultiple>) {
        config && Object.assign(this, config)
    }


    combineWith (interval : CalendarCacheInterval) : CalendarCacheIntervalMultiple {
        const copy      = this.intervalGroups.slice()

        copy.push([ interval.calendar, interval ])

        return new CalendarCacheIntervalMultiple({ intervalGroups : copy })
    }


    getIsWorkingForEvery () {
        if (this.isWorkingForEvery != null) return this.isWorkingForEvery

        for (let [ _calendar, intervals ] of this.getGroups()) {
            if (!intervals[ 0 ].isWorking) return this.isWorkingForEvery = false
        }

        return this.isWorkingForEvery = true
    }


    getIsWorkingForSome () {
        if (this.isWorkingForSome != null) return this.isWorkingForSome

        for (let [ _calendar, intervals ] of this.getGroups()) {
            if (intervals[ 0 ].isWorking) return this.isWorkingForSome = true
        }

        return this.isWorkingForSome = false
    }


    getCalendars () : AbstractCalendarMixin[] {
        this.getGroups()

        return this.calendars
    }


    isCalendarWorking (calendar : AbstractCalendarMixin) : boolean {
        return this.getCalendarsWorkStatus().get(calendar)
    }


    getCalendarsWorkStatus () : Map<AbstractCalendarMixin, boolean> {
        if (this.calendarsWorkStatus) return this.calendarsWorkStatus

        const res   = new Map()

        for (let [ calendar, intervals ] of this.getGroups()) {
            // TODO: fix types
            res.set(calendar, intervals[ 0 ].isWorking)
        }

        return this.calendarsWorkStatus = res
    }


    getCalendarsWorking () : AbstractCalendarMixin[] {
        if (this.calendarsWorking) return this.calendarsWorking

        const calendars     = []

        for (let [ calendar, intervals ] of this.getGroups()) {
            // TODO: fix types
            if (intervals[ 0 ].isWorking) calendars.push(calendar)
        }

        return this.calendarsWorking = calendars
    }


    getCalendarsNonWorking () : AbstractCalendarMixin[] {
        if (this.calendarsNonWorking) return this.calendarsNonWorking

        const calendars     = []

        for (let [ calendar, intervals ] of this.getGroups()) {
            // TODO: fix types
            if (!intervals[ 0 ].isWorking) calendars.push(calendar)
        }

        return this.calendarsNonWorking = calendars
    }


    getGroups () : Map<AbstractCalendarMixin, CalendarIntervalMixin[]> {
        if (this.intervalsByCalendar) return this.intervalsByCalendar

        const calendars = this.calendars = []

        const intervalsByCalendar = new Map<AbstractCalendarMixin, CalendarIntervalMixin[]>()

        this.intervalGroups.forEach(([ calendar, interval ]) => {

            let data            = intervalsByCalendar.get(calendar)

            if (!data) {
                calendars.push(calendar)

                data            = []

                intervalsByCalendar.set(calendar, data)
            }

            data.push.apply(data, interval.intervals)
        })

        intervalsByCalendar.forEach((intervals, calendar) => {
            const unique    = stripDuplicates(intervals)

            unique.sort(
                // sort in decreasing order
                (interval1, interval2) => interval2.getPriorityField() - interval1.getPriorityField()
            )

            intervalsByCalendar.set(calendar, unique)
        })

        return this.intervalsByCalendar = intervalsByCalendar
    }
}
