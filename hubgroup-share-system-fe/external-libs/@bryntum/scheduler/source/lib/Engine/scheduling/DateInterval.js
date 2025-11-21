import { Base } from '../../ChronoGraph/class/BetterMixin.js';
import { MAX_DATE, MIN_DATE } from '../util/Constants.js';
import { EdgeInclusion } from "../util/Types.js";
export class DateInterval extends Base {
    initialize(...args) {
        super.initialize(...args);
        if (!this.startDate)
            this.startDate = MIN_DATE;
        if (!this.endDate)
            this.endDate = MAX_DATE;
    }
    equalTo(another) {
        return this.startDate.getTime() === another.startDate.getTime() && this.endDate.getTime() === another.endDate.getTime();
    }
    startDateIsFinite() {
        return !this.isIntervalEmpty() && this.startDate.getTime() !== MIN_DATE.getTime();
    }
    endDateIsFinite() {
        return !this.isIntervalEmpty() && this.endDate.getTime() !== MAX_DATE.getTime();
    }
    containsDate(date, edgeInclusion = EdgeInclusion.Left) {
        return ((edgeInclusion === EdgeInclusion.Left && (date >= this.startDate && date < this.endDate))
            ||
                (edgeInclusion === EdgeInclusion.Right && (date > this.startDate && date <= this.endDate)));
    }
    isIntervalEmpty() {
        return this.startDate > this.endDate;
    }
    intersect(another) {
        const anotherStart = another.startDate;
        const anotherEnd = another.endDate;
        const start = this.startDate;
        const end = this.endDate;
        if ((end < anotherStart) || (start > anotherEnd)) {
            return EMPTY_INTERVAL;
        }
        const newStart = new Date(Math.max(start.getTime(), anotherStart.getTime()));
        const newEnd = new Date(Math.min(end.getTime(), anotherEnd.getTime()));
        return this.constructor.new({ startDate: newStart, endDate: newEnd });
    }
    intersectMut(another) {
        const anotherStart = another.startDate;
        const anotherEnd = another.endDate;
        const start = this.startDate;
        const end = this.endDate;
        if ((end < anotherStart) || (start > anotherEnd)) {
            this.startDate = MAX_DATE;
            this.endDate = MIN_DATE;
            return this;
        }
        this.startDate = new Date(Math.max(start.getTime(), anotherStart.getTime()));
        this.endDate = new Date(Math.min(end.getTime(), anotherEnd.getTime()));
        return this;
    }
}
export const EMPTY_INTERVAL = DateInterval.new({ startDate: MAX_DATE, endDate: MIN_DATE });
export const intersectIntervals = (dateIntervals) => {
    return dateIntervals.reduce((acc, currentInterval) => acc.intersectMut(currentInterval), DateInterval.new());
};
