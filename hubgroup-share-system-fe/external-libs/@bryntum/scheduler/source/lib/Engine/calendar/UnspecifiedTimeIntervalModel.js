import { Mixin } from "../../ChronoGraph/class/BetterMixin.js";
import { CalendarIntervalMixin } from "./CalendarIntervalMixin.js";
export class UnspecifiedTimeIntervalModel extends Mixin([CalendarIntervalMixin], (base) => {
    const superProto = base.prototype;
    class UnspecifiedTimeIntervalModel extends base {
        getCalendar() {
            return this.calendar;
        }
        getPriorityField() {
            if (this.priorityField != null)
                return this.priorityField;
            return this.priorityField = this.getCalendar().getDepth();
        }
    }
    return UnspecifiedTimeIntervalModel;
}) {
}
