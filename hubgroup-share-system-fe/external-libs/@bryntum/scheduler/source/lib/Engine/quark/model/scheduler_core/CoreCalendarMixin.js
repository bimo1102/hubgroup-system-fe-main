import { CorePartOfProjectModelMixin } from '../mixin/CorePartOfProjectModelMixin.js';
import { Mixin } from "../../../../ChronoGraph/class/BetterMixin.js";
import { AbstractCalendarMixin } from "../AbstractCalendarMixin.js";
export class CoreCalendarMixin extends Mixin([AbstractCalendarMixin, CorePartOfProjectModelMixin], (base) => {
    const superProto = base.prototype;
    class CoreCalendarMixin extends base {
    }
    return CoreCalendarMixin;
}) {
}
