import { AnyConstructor, Mixin } from "../../ChronoGraph/class/BetterMixin.js"
import { CalculationIterator } from "../../ChronoGraph/primitives/Calculation.js"
import { calculate, field } from "../../ChronoGraph/replica/Entity.js"
import { ChronoModelMixin } from "../chrono/ChronoModelMixin.js"
import { model_field } from "../chrono/ModelFieldAtom.js"
import { Duration, TimeUnit } from "./Types.js"

/**
 * This mixin provides the duration converting functionality - the [[convertDuration]] method. It requires (inherit from) [[ChronoModelMixin]].
 */
export class DurationConverterMixin extends Mixin(
    [ ChronoModelMixin ],
    (base : AnyConstructor<ChronoModelMixin, typeof ChronoModelMixin>) => {

    const superProto : InstanceType<typeof base> = base.prototype


    class DurationConverterMixin extends base {

        @field()
        unitsInMs               : { [ key : string ] : number }

        /**
         * The number of hours per day (is used when converting the duration from one unit to another).
         */
        @model_field({ type : 'number', defaultValue : 24 })
        hoursPerDay             : number

        /**
         * The number of days per week (is used when converting the duration from one unit to another).
         */
        @model_field({ type : 'number', defaultValue : 7 })
        daysPerWeek             : number

        /**
         * The number of days per month (is used when converting the duration from one unit to another).
         */
        @model_field({ type : 'number', defaultValue : 30 })
        daysPerMonth            : number


        @calculate('unitsInMs')
        * calculateUnitsInMs () {
            const hoursPerDay   = yield this.$.hoursPerDay
            const daysPerWeek   = yield this.$.daysPerWeek
            const daysPerMonth  = yield this.$.daysPerMonth

            return {
                millisecond : 1,
                second      : 1000,
                minute      : 60 * 1000,
                hour        : 60 * 60 * 1000,
                day         : hoursPerDay * 60 * 60 * 1000,
                week        : daysPerWeek * hoursPerDay * 60 * 60 * 1000,
                month       : daysPerMonth * hoursPerDay * 60 * 60 * 1000,
                quarter     : 3 * daysPerMonth * hoursPerDay * 60 * 60 * 1000,
                year        : 4 * 3 * daysPerMonth * hoursPerDay * 60 * 60 * 1000
            }
        }


        /**
         * Converts duration value from one time unit to another
         * @param duration Duration value
         * @param fromUnit Duration value time unit
         * @param toUnit   Target time unit to convert the value to
         */
        convertDuration (duration : Duration, fromUnit : TimeUnit, toUnit : TimeUnit) : Duration {
            let result  = duration

            if (fromUnit !== toUnit) {
                result  = duration * this.unitsInMs[ fromUnit ] / this.unitsInMs[ toUnit ]
            }

            return result

            // TODO should be just something like:
            // return this.run('$convertDuration', duration, fromUnit, toUnit)
        }


        * $convertDuration (duration : Duration, fromUnit : TimeUnit, toUnit : TimeUnit) : CalculationIterator<Duration> {
            if (!fromUnit || !toUnit) throw new Error("Conversion unit not provided")

            const unitsInMs : this[ 'unitsInMs' ] = yield this.$.unitsInMs

            let result  = duration

            if (fromUnit !== toUnit) {
                result  = duration * unitsInMs[ fromUnit ] / unitsInMs[ toUnit ]
            }

            return result
        }

    }

    return DurationConverterMixin
}){}
