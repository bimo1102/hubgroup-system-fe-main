import Base from '../Base.js';
import DateHelper from '../helper/DateHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import FunctionHelper from '../helper/FunctionHelper.js';
import Identifiable from '../mixin/Identifiable.js';
import Duration from '../data/Duration.js';

/**
 * @module Core/util/CollectionFilter
 */

const nestedValueReducer = (object, path) => object?.[path];

/**
 * A class which encapsulates a single filter operation which may be applied to any object to decide whether to
 * include or exclude it from a set.
 *
 * A CollectionFilter generally has at least three main properties:
 *
 * * `property` - The name of a property in candidate objects from which to extract the value to test
 * * `value` - The value which  this filter uses to test against.
 * * `operator` - The comparison operator, eg: `'='` or `'>'` etc.
 *
 * Given these three essential values, further configurations may affect how the filter is applied:
 *
 * * `caseSensitive` - If configured as `false`, string comparisons are case insensitive.
 * * `convert` - A function which, when passed the extracted value from the candidate object, returns the value to test.
 *
 * A filter may also be configured with a single `filterBy` property. This function is just passed the raw
 * candidate object and must return `true` or `false`.
 *
 * A CollectionFilter may be configured to encapsulate a single filtering function by passing that function as the sole
 * parameter to the constructor:
 *
 *     new CollectionFilter(candidate => candidate.title.contains('search string'));
 *
 */
export default class CollectionFilter extends Base.mixin(Identifiable) {
    static get defaultConfig() {
        return {
            /**
             * The value against which to compare the {@link #config-property} of candidate objects.
             * @config {*}
             */
            value : null,

            /**
             * The operator to use when comparing a candidate object's {@link #config-property} with this CollectionFilter's {@link #config-value}.
             * May be: `'='`, `'!='`, `'>'`, `'>='`, `'<'`, `'<='`, `'*'`, `'startsWith'`, `'endsWith'`
             * @config {String}
             */
            operator : null,

            /**
             * May be used in place of the {@link #config-property}, {@link #config-value} and {@link #config-property} configs. A function which
             * accepts a candidate object and returns `true` or `false`
             * @config {Function}
             */
            filterBy : null,

            /**
             * A function which accepts a value extracted from a candidate object using the {@link #config-property} name, and
             * returns the value which the filter should use to compare against its {@link #config-value}.
             * @config {Function}
             */
            convert : null,

            /**
             * Configure as `false` to have string comparisons case insensitive.
             * @config {Boolean}
             */
            caseSensitive : true,

            /**
             * The `id` of this Filter for when used by a {@link Core.util.Collection} Collection.
             * By default the `id` is the {@link #config-property} value.
             * @config {String}
             */
            id : null,

            // Type is required to process the Date value in State API. Store doesn't always know about field type to
            // process filter value, when it applies it from the state, e.g. when you don't declare model field as `date`
            // type but provide a Date instance there. When DateColumn is used to shows this field, it could add date
            // filters to the store. When store is applying state it cannot just infer type, because model doesn't
            // declare it. Only column knows. So to properly process the Date instance for the filter State API would
            // have to process the field additionally, checking model field type and column type. So it is simpler to
            // make Filter to put this information. That way when filter is instantiated by the store, it can gracefully
            // handle value processing, converting date string to the Date instance.
            // Date is the only known value type so far which requires this processing.
            type : null
        };
    }

    static get configurable() {
        return {
            /**
             * The name of a property of candidate objects which yields the value to compare against this CollectionFilter's {@link #config-value}.
             * @member {String} property
             */
            /**
             * The name of a property of candidate objects which yields the value to compare against this CollectionFilter's {@link #config-value}.
             * @config {String}
             */
            property : null
        };
    }

    construct(config) {
        if (typeof config === 'function') {
            config = {
                filterBy : config
            };
        }

        // If Filter is created without a type (yet everything except applying state) create one
        if (!config.type) {
            if (DateHelper.isDate(config.value)) {
                config.type = 'date';
            }
            else if (config.value instanceof Duration) {
                config.type = 'duration';
            }
        }
        // If type already exist, it means we are applying state and should process value
        else {
            if (config.type === 'date') {
                config.value = new Date(config.value);
            }
            else if (config.type === 'duration') {
                config.value = new Duration(config.value);
            }
        }

        super.construct(config);

        //<debug>
        if (!this._filterBy) {
            if (!this.property) {
                throw new Error('CollectionFilter must be configured with the name of a property to test in candidate items');
            }
        }
        //</debug>
    }

    /**
     * When in a Collection (A Collection holds its Filters in a Collection), we need an id.
     * @property {String}
     * @private
     */
    get id() {
        return this._id || (this._id = this.property || CollectionFilter.generateId('b-filter'));
    }

    set id(id) {
        this._id = id;
    }

    onChange(propertyChanged) {
        const me = this;

        // Inform any owner (eg a Store), that it has to reassess its CollectionFilters
        if (!me.isConfiguring && me.owner && !me.owner.isConfiguring && me.owner.onFilterChanged) {
            me.owner.onFilterChanged(me, propertyChanged);
        }
    }

    get filterBy() {
        return this._filterBy || this.defaultFilterBy;
    }

    /**
     * May be used in place of the {@link #config-property}, {@link #config-value} and {@link #config-property} configs. A function which
     * accepts a candidate object and returns `true` or `false`
     * @type {Function}
     */
    set filterBy(filterBy) {
        this._filterBy = filterBy;
    }

    defaultFilterBy(candidate) {
        const me = this;
        let candidateValue;

        // check if is nested property
        if (me._propertyItems.length > 1) {
            // support nested props (https://github.com/bryntum/support/issues/1861)
            candidateValue = me._propertyItems.reduce(nestedValueReducer, candidate);
        }
        else {
            candidateValue = candidate[me.property];
        }

        return me[me.operator](me.convert(candidateValue));
    }

    updateProperty(property) {
        this._propertyItems = property.split('.');

        // Signal to owner about filter change
        this.onChange('property');
    }

    /**
     * The value against which to compare the {@link #config-property} of candidate objects.
     * @type {*}
     */
    set value(value) {
        this._value = value;

        value = value?.valueOf() ?? value;

        // Filter value is a processed value to be used by the comparators. Useful when value is object, like Duration field
        this._filterValue = !this.caseSensitive && (typeof value === 'string') ? value.toLowerCase() : value;

        // Signal to owner about filter change
        this.onChange('value');
    }

    get value() {
        return this._value;
    }

    get filterValue() {
        return this._filterValue;
    }

    /**
     * The operator to use when comparing a candidate object's {@link #config-property} with this CollectionFilter's {@link #config-value}.
     * May be: `'='`, `'!='`, `'>'`, `'>='`, `'<'`, `'<='`, `'*'`, `'startsWith'`, `'endsWith'`
     * @type {String}
     */
    set operator(operator) {
        this._operator = operator;

        // Signal to owner about filter change
        this.onChange('operator');
    }

    get operator() {
        return this._operator || ((typeof this.filterValue === 'string') ? '*' : '=');
    }

    convert(value) {
        // This is a workaround for filterbar feature: it always converts input value to string. When date is typed,
        // it is converted into string, and Date.valueOf() would return number. So if we are matching date against string
        // type, we should not convert it.
        if (!(typeof this.filterValue === 'string' && value instanceof Date)) {
            // if value is a complex type, try to access `value` property to get primitive value
            value = value?.valueOf() ?? value;
        }

        value = !this.caseSensitive && (typeof value === 'string') ? value.toLowerCase() : value;

        return value;
    }

    filter(candidate) {
        return this.filterBy(candidate);
    }

    startsWith(v) {
        return String(v).startsWith(this.filterValue);
    }

    endsWith(v) {
        return String(v).endsWith(this.filterValue);
    }

    '='(v) {
        return ObjectHelper.isEqual(v, this.filterValue);
    }

    '!='(v) {
        return !ObjectHelper.isEqual(v, this.filterValue);
    }

    '>'(v) {
        return ObjectHelper.isMoreThan(v, this.filterValue);
    }

    '>='(v) {
        return ObjectHelper.isMoreThan(v, this.filterValue) || ObjectHelper.isEqual(v, this.filterValue);
    }

    '<'(v) {
        return ObjectHelper.isLessThan(v, this.filterValue);
    }

    '<='(v) {
        return ObjectHelper.isLessThan(v, this.filterValue) || ObjectHelper.isEqual(v, this.filterValue);
    }

    '*'(v) {
        return ObjectHelper.isPartial(v, this.filterValue);
    }

    // Accepts an array or a Collection
    static generateFiltersFunction(filters) {
        if (!filters || (!filters.length && !filters.count)) {
            return FunctionHelper.returnTrue;
        }

        return function(candidate) {
            let match = true;

            for (const filter of filters) {
                // Skip disabled filters
                if (!filter.disabled) {
                    match = filter.filter(candidate);
                }
                if (!match) {
                    break;
                }
            }

            return match;
        };
    }
}
