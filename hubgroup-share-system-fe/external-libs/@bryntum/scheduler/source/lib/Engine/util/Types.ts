export type ComparatorFn<T> = (a : T, b : T) => number

/**
 * The date intervals in the scheduling engine are always inclusive on one end and opened on another.
 * The "opened" end is not considered to be a part of the interval.
 *
 * Depending from the scheduling direction (forward/backward) this property may need to be inverted.
 *
 * This enum specifies what edge of the interval is inclusive.
 */
export enum EdgeInclusion {
    Left,
    Right
}
