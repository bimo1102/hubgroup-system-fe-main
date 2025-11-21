var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Mixin } from "../../ChronoGraph/class/BetterMixin.js";
import { calculate, field } from "../../ChronoGraph/replica/Entity.js";
import { ChronoModelMixin } from "../chrono/ChronoModelMixin.js";
import { model_field } from "../chrono/ModelFieldAtom.js";
export class DurationConverterMixin extends Mixin([ChronoModelMixin], (base) => {
    const superProto = base.prototype;
    class DurationConverterMixin extends base {
        *calculateUnitsInMs() {
            const hoursPerDay = yield this.$.hoursPerDay;
            const daysPerWeek = yield this.$.daysPerWeek;
            const daysPerMonth = yield this.$.daysPerMonth;
            return {
                millisecond: 1,
                second: 1000,
                minute: 60 * 1000,
                hour: 60 * 60 * 1000,
                day: hoursPerDay * 60 * 60 * 1000,
                week: daysPerWeek * hoursPerDay * 60 * 60 * 1000,
                month: daysPerMonth * hoursPerDay * 60 * 60 * 1000,
                quarter: 3 * daysPerMonth * hoursPerDay * 60 * 60 * 1000,
                year: 4 * 3 * daysPerMonth * hoursPerDay * 60 * 60 * 1000
            };
        }
        convertDuration(duration, fromUnit, toUnit) {
            let result = duration;
            if (fromUnit !== toUnit) {
                result = duration * this.unitsInMs[fromUnit] / this.unitsInMs[toUnit];
            }
            return result;
        }
        *$convertDuration(duration, fromUnit, toUnit) {
            if (!fromUnit || !toUnit)
                throw new Error("Conversion unit not provided");
            const unitsInMs = yield this.$.unitsInMs;
            let result = duration;
            if (fromUnit !== toUnit) {
                result = duration * unitsInMs[fromUnit] / unitsInMs[toUnit];
            }
            return result;
        }
    }
    __decorate([
        field()
    ], DurationConverterMixin.prototype, "unitsInMs", void 0);
    __decorate([
        model_field({ type: 'number', defaultValue: 24 })
    ], DurationConverterMixin.prototype, "hoursPerDay", void 0);
    __decorate([
        model_field({ type: 'number', defaultValue: 7 })
    ], DurationConverterMixin.prototype, "daysPerWeek", void 0);
    __decorate([
        model_field({ type: 'number', defaultValue: 30 })
    ], DurationConverterMixin.prototype, "daysPerMonth", void 0);
    __decorate([
        calculate('unitsInMs')
    ], DurationConverterMixin.prototype, "calculateUnitsInMs", null);
    return DurationConverterMixin;
}) {
}
