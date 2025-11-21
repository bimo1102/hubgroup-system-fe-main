import { Mixin } from "../../../ChronoGraph/class/BetterMixin.js";
import { CalendarIntervalStore } from "../../calendar/CalendarIntervalStore.js";
import { CalendarIteratorResult } from "../../calendar/CalendarCache.js";
import { TimeUnit } from "../../scheduling/Types.js";
import { CalendarCacheSingle } from "../../calendar/CalendarCacheSingle.js";
import { UnspecifiedTimeIntervalModel } from "../../calendar/UnspecifiedTimeIntervalModel.js";
import DateHelper from "../../../Core/helper/DateHelper.js";
import { AbstractPartOfProjectModelMixin } from "./mixin/AbstractPartOfProjectModelMixin.js";
export class AbstractCalendarMixin extends Mixin([AbstractPartOfProjectModelMixin], (base) => {
    const superProto = base.prototype;
    class CalendarMixin extends base {
        constructor() {
            super(...arguments);
            this.version = 1;
        }
        static get fields() {
            return [
                { name: 'version', type: 'number' },
                'name',
                { name: 'unspecifiedTimeIsWorking', type: 'boolean', defaultValue: true },
                'intervals'
            ];
        }
        get intervalStoreClass() {
            return CalendarIntervalStore;
        }
        afterConstruct() {
            superProto.afterConstruct.call(this);
            const modelClass = this.getDefaultConfiguration().calendarIntervalModelClass || this.intervalStoreClass.defaultConfig.modelClass;
            this.intervalStore = new this.intervalStoreClass({
                calendar: this,
                modelClass
            });
            if (this.intervals && this.intervals.length) {
                this.addIntervals(this.intervals);
            }
        }
        isDefault() {
            const project = this.getProject();
            if (project) {
                return this === project.defaultCalendar;
            }
            return false;
        }
        getDepth() {
            return this.childLevel + 1;
        }
        forEachAvailabilityInterval(options, func, scope) {
            return this.calendarCache.forEachAvailabilityInterval(options, func, scope);
        }
        accumulateWorkingTime(date, durationMs, isForward) {
            if (durationMs === 0)
                return { finalDate: new Date(date), remainingDurationInMs: 0 };
            if (isNaN(durationMs))
                throw new Error("Invalid duration");
            let finalDate = date;
            this.forEachAvailabilityInterval(isForward ? { startDate: date, isForward: true } : { endDate: date, isForward: false }, (intervalStartDate, intervalEndDate, calendarCacheInterval) => {
                let result = true;
                if (calendarCacheInterval.getIsWorking()) {
                    const dstDiff = intervalStartDate.getTimezoneOffset() - intervalEndDate.getTimezoneOffset();
                    const diff = intervalEndDate.getTime() - intervalStartDate.getTime() + dstDiff * 60 * 1000;
                    if (durationMs <= diff) {
                        finalDate = isForward
                            ?
                                new Date(intervalStartDate.getTime() + durationMs)
                            :
                                new Date(intervalEndDate.getTime() - durationMs);
                        durationMs = 0;
                        result = false;
                    }
                    else {
                        finalDate = isForward ? intervalEndDate : intervalStartDate;
                        durationMs -= diff;
                    }
                }
                return result;
            });
            return { finalDate: new Date(finalDate), remainingDurationInMs: durationMs };
        }
        calculateDurationMs(startDate, endDate) {
            let duration = 0;
            this.forEachAvailabilityInterval({ startDate: startDate, endDate: endDate }, (intervalStartDate, intervalEndDate, calendarCacheInterval) => {
                if (calendarCacheInterval.getIsWorking()) {
                    const dstDiff = intervalStartDate.getTimezoneOffset() - intervalEndDate.getTimezoneOffset();
                    duration += intervalEndDate.getTime() - intervalStartDate.getTime() + dstDiff * 60 * 1000;
                }
            });
            return duration;
        }
        calculateEndDate(startDate, durationMs) {
            const isForward = durationMs >= 0;
            const res = this.accumulateWorkingTime(startDate, Math.abs(durationMs), isForward);
            return res.remainingDurationInMs === 0 ? res.finalDate : null;
        }
        calculateStartDate(endDate, durationMs) {
            const isForward = durationMs <= 0;
            const res = this.accumulateWorkingTime(endDate, Math.abs(durationMs), isForward);
            return res.remainingDurationInMs === 0 ? res.finalDate : null;
        }
        skipNonWorkingTime(date, isForward = true) {
            let workingDate;
            const res = this.forEachAvailabilityInterval(isForward ? { startDate: date, isForward: true } : { endDate: date, isForward: false }, (intervalStartDate, intervalEndDate, calendarCacheInterval) => {
                if (calendarCacheInterval.getIsWorking()) {
                    workingDate = isForward ? intervalStartDate : intervalEndDate;
                    return false;
                }
            });
            if (res === CalendarIteratorResult.MaxRangeReached || res === CalendarIteratorResult.FullRangeIterated)
                return 'empty_calendar';
            return workingDate ? new Date(workingDate) : new Date(date);
        }
        addInterval(interval) {
            return this.addIntervals([interval]);
        }
        addIntervals(intervals) {
            this.bumpVersion();
            return this.intervalStore.add(intervals);
        }
        clearIntervals(silent) {
            if (!silent) {
                this.bumpVersion();
            }
            return this.intervalStore.removeAll(silent);
        }
        bumpVersion() {
            this.clearCache();
            this.version++;
        }
        get calendarCache() {
            if (this.$calendarCache !== undefined)
                return this.$calendarCache;
            const unspecifiedTimeInterval = new UnspecifiedTimeIntervalModel({
                isWorking: this.unspecifiedTimeIsWorking
            });
            unspecifiedTimeInterval.calendar = this;
            return this.$calendarCache = new CalendarCacheSingle({
                calendar: this,
                unspecifiedTimeInterval: unspecifiedTimeInterval,
                intervalStore: this.intervalStore,
                parentCache: this.parent && !this.parent.isRoot ? this.parent.calendarCache : null
            });
        }
        clearCache() {
            this.$calendarCache && this.$calendarCache.clear();
            this.$calendarCache = undefined;
        }
        resetPriorityOfAllIntervals() {
            this.traverse((calendar) => {
                calendar.intervalStore.forEach((interval) => interval.resetPriority());
            });
        }
        insertChild(child, before, silent) {
            let res = superProto.insertChild.call(this, ...arguments);
            if (!Array.isArray(res)) {
                res = [res];
            }
            res.forEach((r) => {
                r.bumpVersion();
                r.resetPriorityOfAllIntervals();
            });
            return res;
        }
        joinProject() {
            superProto.joinProject.call(this);
            this.intervalStore.setProject(this.getProject());
        }
        leaveProject() {
            superProto.leaveProject.call(this);
            this.intervalStore.setProject(null);
            this.intervalStore.destroy();
            this.clearCache();
        }
        doDestroy() {
            this.leaveProject();
            super.doDestroy();
        }
        isDayHoliday(day) {
            const startDate = DateHelper.clearTime(day), endDate = DateHelper.getNext(day, TimeUnit.Day);
            let hasWorkingTime = false;
            this.forEachAvailabilityInterval({ startDate, endDate, isForward: true }, (_intervalStartDate, _intervalEndDate, calendarCacheInterval) => {
                hasWorkingTime = calendarCacheInterval.getIsWorking();
                return !hasWorkingTime;
            });
            return !hasWorkingTime;
        }
        getDailyHolidaysRanges(startDate, endDate) {
            const result = [];
            startDate = DateHelper.clearTime(startDate);
            while (startDate < endDate) {
                if (this.isDayHoliday(startDate)) {
                    result.push({
                        startDate,
                        endDate: DateHelper.getStartOfNextDay(startDate, true, true)
                    });
                }
                startDate = DateHelper.getNext(startDate, TimeUnit.Day);
            }
            return result;
        }
        getNonWorkingTimeRanges(startDate, endDate) {
            const result = [];
            this.forEachAvailabilityInterval({ startDate, endDate, isForward: true }, (intervalStartDate, intervalEndDate, calendarCacheInterval) => {
                if (!calendarCacheInterval.getIsWorking()) {
                    const entry = calendarCacheInterval.intervals[0];
                    result.push({
                        name: entry.name,
                        startDate: intervalStartDate,
                        endDate: intervalEndDate
                    });
                }
            });
            return result;
        }
        isWorkingTime(startDate, endDate) {
            const workingTimeStart = this.skipNonWorkingTime(startDate);
            return workingTimeStart && workingTimeStart !== 'empty_calendar' ? workingTimeStart < endDate : false;
        }
    }
    return CalendarMixin;
}) {
}
