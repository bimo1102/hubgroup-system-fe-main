import { Mixin } from "../../ChronoGraph/class/BetterMixin.js";
import later from "../vendor/later/later.js";
import { AbstractPartOfProjectModelMixin } from "../quark/model/mixin/AbstractPartOfProjectModelMixin.js";
export class CalendarIntervalMixin extends Mixin([AbstractPartOfProjectModelMixin], (base) => {
    const superProto = base.prototype;
    class CalendarIntervalMixin extends base {
        static get fields() {
            return [
                'name',
                { name: 'startDate', type: 'date', format: 'YYYY-MM-DDTHH:mm:ssZ' },
                { name: 'endDate', type: 'date', format: 'YYYY-MM-DDTHH:mm:ssZ' },
                'recurrentStartDate',
                'recurrentEndDate',
                { name: 'isWorking', type: 'boolean', defaultValue: false },
                { name: 'priority', type: 'number' }
            ];
        }
        getCalendar() {
            return this.stores[0].calendar;
        }
        resetPriority() {
            this.priorityField = null;
            this.getCalendar().getDepth();
        }
        getPriorityField() {
            if (this.priorityField != null)
                return this.priorityField;
            let base = 10000 + this.getCalendar().getDepth() * 100;
            let priority = this.priority;
            if (priority == null) {
                priority = this.isRecurrent() ? 20 : 30;
            }
            return this.priorityField = base + priority;
        }
        isRecurrent() {
            return Boolean(this.recurrentStartDate && this.recurrentEndDate && this.getStartDateSchedule() && this.getEndDateSchedule());
        }
        isStatic() {
            return Boolean(this.startDate && this.endDate);
        }
        parseDateSchedule(schedule) {
            if (schedule && schedule !== Object(schedule)) {
                schedule = later.parse.text(schedule);
                if (schedule !== Object(schedule) || schedule.error > 0) {
                    try {
                        schedule = JSON.parse(schedule);
                    }
                    catch (e) {
                        return null;
                    }
                }
            }
            return schedule;
        }
        getStartDateSchedule() {
            if (this.startDateSchedule)
                return this.startDateSchedule;
            const schedule = this.parseDateSchedule(this.recurrentStartDate);
            return this.startDateSchedule = later.schedule(schedule);
        }
        getEndDateSchedule() {
            if (this.endDateSchedule)
                return this.endDateSchedule;
            const schedule = this.parseDateSchedule(this.recurrentEndDate);
            return this.endDateSchedule = later.schedule(schedule);
        }
    }
    return CalendarIntervalMixin;
}) {
}
