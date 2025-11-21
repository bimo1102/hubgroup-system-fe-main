import { Mixin } from "../../ChronoGraph/class/BetterMixin.js";
import { CalendarIntervalMixin } from "./CalendarIntervalMixin.js";
import { AbstractPartOfProjectStoreMixin } from "../quark/store/mixin/AbstractPartOfProjectStoreMixin.js";
export class CalendarIntervalStore extends Mixin([AbstractPartOfProjectStoreMixin], (base) => {
    const superProto = base.prototype;
    class CalendarIntervalStore extends base {
        static get defaultConfig() {
            return {
                modelClass: CalendarIntervalMixin
            };
        }
    }
    return CalendarIntervalStore;
}) {
}
