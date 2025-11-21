import DateHelper from '../../Core/helper/DateHelper.js';
import VersionHelper from '../../Core/helper/VersionHelper.js';
import Model from '../../Core/data/Model.js';
import Duration from '../../Core/data/Duration.js';

/**
 * @module Scheduler/model/DependencyBaseModel
 */

const canonicalDependencyTypes = [
    'SS',
    'SF',
    'FS',
    'FF'
];

/**
 * Base class used for both Scheduler and Gantt. Not intended to be used directly
 *
 * @extends Core/data/Model
 */
export default class DependencyBaseModel extends Model {
    static get $name() {
        return 'DependencyBaseModel';
    }

    /**
     * Set value for the specified field(s), triggering engine calculations immediately. See
     * {@link Core.data.Model#function-set Model#set()} for arguments.
     **
     * ```javascript
     * dependency.set('from', 2);
     * // dependency.fromEvent is not yet up to date
     *
     * await dependency.setAsync('from', 2);
     * // dependency.fromEvent is up to date
     * ```
     *
     * @param {String|Object} field The field to set value for, or an object with multiple values to set in one call
     * @param {*} value Value to set
     * @param {Boolean} [silent=false] Set to true to not trigger events
     * automatically.
     * @function setAsync
     * @category Editing
     * @async
     */

    //region Fields

    /**
     * An enumerable object, containing names for the dependency types integer constants.
     * - 0 StartToStart
     * - 1 StartToEnd
     * - 2 EndToStart
     * - 3 EndToEnd
     * @property {Object}
     * @readonly
     * @category Dependency
     */
    static get Type() {
        return {
            StartToStart : 0,
            StartToEnd   : 1,
            EndToStart   : 2,
            EndToEnd     : 3
        };
    }

    static get fields() {
        return [
            // 3 mandatory fields

            /**
             * From event, id of source event
             * @field {String|Number} from
             * @category Dependency
             */
            { name : 'from' },

            /**
             * To event, id of target event
             * @field {String|Number} to
             * @category Dependency
             */
            { name : 'to' },

            /**
             * Dependency type, see static property {@link #property-Type-static}
             * @field {Number} type
             * @default 2
             * @category Dependency
             */
            { name : 'type', type : 'int', defaultValue : 2 },

            /**
             * CSS class to apply to lines drawn for the dependency
             * @field {String} cls
             * @category Styling
             */
            { name : 'cls', defaultValue : '' },

            /**
             * Bidirectional, drawn with arrows in both directions
             * @field {Boolean} bidirectional
             * @category Dependency
             */
            { name : 'bidirectional', type : 'boolean' },

            /**
             * Start side on source (top, left, bottom, right)
             * @field {String} fromSide
             * @category Dependency
             */
            { name : 'fromSide', type : 'string' },

            /**
             * End side on target (top, left, bottom, right)
             * @field {String} toSide
             * @category Dependency
             */
            { name : 'toSide', type : 'string' },

            /**
             * The magnitude of this dependency's lag (the number of units).
             * @field {Number} lag
             * @category Dependency
             */
            { name : 'lag', type : 'number', allowNull : true, defaultValue : 0 },

            /**
             * The units of this dependency's lag, defaults to "d" (days). Valid values are:
             *
             * - "ms" (milliseconds)
             * - "s" (seconds)
             * - "m" (minutes)
             * - "h" (hours)
             * - "d" (days)
             * - "w" (weeks)
             * - "M" (months)
             * - "y" (years)
             *
             * This field is readonly after creation, to change `lagUnit` use {@link #function-setLag setLag()}.
             * @field {String} lagUnit
             * @category Dependency
             * @readonly
             */
            {
                name         : 'lagUnit',
                type         : 'string',
                defaultValue : 'd'
            }
        ];
    }

    // fromEvent/toEvent defined in CoreDependencyMixin in engine

    /**
     * Gets/sets the source event of the dependency
     *
     * **NOTE** This is not a proper field but rather an alias, it will be serialized but cannot be remapped. If you
     * need to remap, consider using {@link #field-from} instead.
     *
     * @field {String|Number|Scheduler.model.EventModel} fromEvent
     * @category Dependency
     */

    /**
     * Gets/sets the target event of the dependency
     *
     * **NOTE** This is not a proper field but rather an alias, it will be serialized but cannot be remapped. If you
     * need to remap, consider using {@link #field-to} instead.
     *
     * @field {String|Number|Scheduler.model.EventModel} toEvent
     * @category Dependency
     */

    /**
     * Gets/sets the source event of the dependency
     *
     * @property {Scheduler.model.EventModel}
     * @deprecated 4.0.0 Deprecated in favor of fromEvent
     * @category Dependency
     */
    get sourceEvent() {
        VersionHelper.deprecate('scheduler', '5.0.0', 'Deprecated in favor of fromEvent');
        return this.fromEvent;
    }

    set sourceEvent(event) {
        this.fromEvent = event;
    }

    /**
     * Gets/sets the target event of the dependency
     *
     * @property {Scheduler.model.EventModel}
     * @deprecated 4.0.0 Deprecated in favor of toEvent
     * @category Dependency
     */
    get targetEvent() {
        VersionHelper.deprecate('scheduler', '5.0.0', 'Deprecated in favor of toEvent');
        return this.toEvent;
    }

    set targetEvent(event) {
        this.targetEvent = event;
    }

    //endregion

    //region Init

    construct(data) {
        // Engine expects fromEvent and toEvent, not from and to. We need to support both
        if (data.from != null) {
            data.fromEvent = data.from;
        }

        if (data.to != null) {
            data.toEvent = data.to;
        }

        super.construct(...arguments);
    }

    //endregion

    get eventStore() {
        return this.eventStore || this.unjoinedStores[0]?.eventStore;
    }

    set from(value) {
        const { fromEvent } = this;

        // When assigning a new id to an event, it will update the eventId of the assignment. But the assignments
        // event is still the same so we need to announce here
        if (fromEvent?.isModel && fromEvent.id === value) {
            this.set('from', value);
        }
        else {
            this.fromEvent = value;
        }
    }

    get from() {
        return this.get('from');
    }

    set to(value) {
        const { toEvent } = this;

        // When assigning a new id to an event, it will update the eventId of the assignment. But the assignments
        // event is still the same so we need to announce here
        if (toEvent?.isModel && toEvent.id === value) {
            this.set('to', value);
        }
        else {
            this.toEvent = value;
        }
    }

    get to() {
        return this.get('to');
    }

    /**
     * Alias to dependency type, but when set resets {@link #field-fromSide} & {@link #field-toSide} to null as well.
     *
     * @property {Number}
     * @category Dependency
     */
    get hardType() {
        return this.getHardType();
    }

    set hardType(type) {
        this.setHardType(type);
    }

    /**
     * Returns dependency hard type, see {@link #property-hardType}.
     *
     * @return {Number}
     * @category Dependency
     */
    getHardType() {
        return this.get('type');
    }

    /**
     * Sets dependency {@link #field-type} and resets {@link #field-fromSide} and {@link #field-toSide} to null.
     *
     * @param {Number} type
     * @category Dependency
     */
    setHardType(type) {
        let result;

        if (type !== this.hardType) {
            result = this.set({
                type,
                fromSide : null,
                toSide   : null
            });
        }

        return result;
    }

    get lag() {
        return this.get('lag');
    }

    set lag(lag) {
        if (typeof lag === 'number') {
            this.set({
                lag
            });
        }
        else {
            this.setLag(lag);
        }
    }

    /**
     * Sets lag and lagUnit in one go. Only allowed way to change lagUnit, the lagUnit field is readonly after creation
     * @param {Number|String|Object} lag The lag value. May be just a numeric magnitude, or a full string descriptor eg '1d'
     * @param {String} [lagUnit] Unit for numeric lag value, see {@link #field-lagUnit} for valid values
     * @category Dependency
     */
    setLag(lag, lagUnit) {
        // Either they're only setting the magnitude
        // or, if it's a string, parse the full duration.
        if (arguments.length === 1) {
            if (typeof lag === 'number') {
                this.lag = lag;
            }
            else {
                //<debug>
                if (typeof lag !== 'string') {
                    throw new Error('Depenedency#setLag accepts either numeric magnitude, or a duration string');
                }
                //</debug>
                lag = DateHelper.parseDuration(lag);
                this.set({
                    lag     : lag.magnitude,
                    lagUnit : lag.unit
                });
            }
            return;
        }

        // Must be a number
        lag = parseFloat(lag);

        this.set({
            lag,
            lagUnit
        });
    }

    getLag() {
        if (this.lag) {
            return `${this.lag < 0 ? '-' : '+'}${Math.abs(this.lag)}${DateHelper.getShortNameOfUnit(this.lagUnit)}`;
        }
        return '';
    }

    /**
     * Property which encapsulates the lag's magnitude and units. An object which contains two properties:
     * @property {Core.data.Duration}
     * @property {Number} fullLag.magnitude The magnitude of the duration
     * @property {String} fullLag.unit The unit in which the duration is measured, eg `'d'` for days
     * @category Dependency
     */
    get fullLag() {
        return new Duration({
            unit      : this.lagUnit,
            magnitude : this.lag
        });
    }

    set fullLag(lag) {
        if (typeof lag === 'string') {
            this.setLag(lag);
        }
        else {
            this.setLag(lag.magnitude, lag.unit);
        }
    }

    /**
     * Returns true if the linked events have been persisted (e.g. neither of them are 'phantoms')
     *
     * @property {Boolean}
     * @readonly
     * @category Editing
     */
    get isPersistable() {
        const
            me = this,
            { stores, unjoinedStores } = me,
            store = stores[0];

        let result;

        if (store) {
            const
                { fromEvent, toEvent } = me,
                crudManager            = store.crudManager;

            // if crud manager is used it can deal with phantom source/target since it persists all records in one batch
            // if no crud manager used we have to wait till source/target are persisted
            result = fromEvent && (crudManager || !fromEvent.hasGeneratedId) && toEvent && (crudManager || !toEvent.hasGeneratedId);
        }
        else {
            result = Boolean(unjoinedStores[0]);
        }

        return result && super.isPersistable;
    }

    /**
     * Returns the source event of the dependency
     *
     * @return {Scheduler.model.EventModel} The source event of this dependency
     * @category Dependency
     * @deprecated 5.0 Deprecated in favor of `toEvent`
     */
    getSourceEvent() {
        VersionHelper.deprecate('scheduler', '5.0.0', 'Deprecated in favor of fromEvent');
        return this.fromEvent;
    }

    /**
     * Gets/sets the dependency type
     *
     * @property {Number}
     */

    /**
     * Gets/sets the name of field holding the CSS class for each rendered dependency element
     *
     * @property {String} cls
     */

    /**
     * Returns the target event of the dependency
     *
     * @return {Scheduler.model.EventModel} The target event of this dependency
     * @category Dependency
     * @deprecated 5.0 Deprecated in favor of `toEvent`
     */
    getTargetEvent() {
        VersionHelper.deprecate('scheduler', '5.0.0', 'Deprecated in favor of toEvent');
        return this.toEvent;
    }

    getDateRange(doNotNormalize = false) {
        const { fromEvent, toEvent } = this;

        if (fromEvent && toEvent && fromEvent.isScheduled && toEvent.isScheduled) {
            const Type = DependencyBaseModel.Type;

            let sourceDate,
                targetDate;

            switch (this.type) {
                case Type.StartToStart:
                    sourceDate = fromEvent.startDate;
                    targetDate = toEvent.startDate;
                    break;

                case Type.StartToEnd:
                    sourceDate = fromEvent.startDate;
                    targetDate = toEvent.endDate;
                    break;

                case Type.EndToEnd:
                    sourceDate = fromEvent.endDate;
                    targetDate = toEvent.endDate;
                    break;

                case Type.EndToStart:
                    sourceDate = fromEvent.endDate;
                    targetDate = toEvent.startDate;
                    break;

                default:
                    throw new Error('Invalid dependency type: ' + this.type);
            }

            return {
                start : doNotNormalize ? sourceDate : DateHelper.min(sourceDate, targetDate),
                end   : doNotNormalize ? targetDate : DateHelper.max(sourceDate, targetDate)
            };
        }

        return null;
    }

    /**
     * Applies given CSS class to dependency, the value doesn't persist
     *
     * @param {String} cls
     * @category Dependency
     */
    highlight(cls) {
        const h = this.highlighted ? this.highlighted.split(' ') : [];

        if (!h.includes(cls)) this.highlighted = h.concat(cls).join(' ');
    }

    /**
     * Removes given CSS class from dependency if applied, the value doesn't persist
     *
     * @param {String} cls
     * @category Dependency
     */
    unhighlight(cls) {
        const { highlighted } = this;

        if (highlighted) {
            const
                h = highlighted.split(' '),
                idx = h.findIndex(i => i === cls);

            if (idx >= 0) {
                h.splice(idx, 1);
                this.highlighted = h.join(' ');
            }
        }
    }

    /**
     * Checks if the given CSS class is applied to dependency.
     *
     * @param {String} cls
     * @return {Boolean}
     * @category Dependency
     */
    isHighlightedWith(cls) {
        return this.highlighted && this.highlighted.split(' ').includes(cls);
    }

    getConnectorString(raw) {
        const rawValue = canonicalDependencyTypes[this.type];

        if (raw) {
            return rawValue;
        }

        // FS => empty string; it's the default
        if (this.type === DependencyBaseModel.Type.EndToStart) {
            return '';
        }

        return rawValue;
    }

    // getConnectorStringFromType(type, raw) {
    //     const rawValue = canonicalDependencyTypes[type];
    //
    //     if (raw) {
    //         return rawValue;
    //     }
    //
    //     // FS => empty string; it's the default
    //     if (type === DependencyBaseModel.Type.EndToStart) {
    //         return '';
    //     }
    //
    //     const locale = LocaleManager.locale;
    //
    //     // See if there is a local version of SS, SF or FF
    //     if (locale) {
    //         const localized = locale.Scheduler && locale.Scheduler[rawValue];
    //         if (localized) {
    //             return localized;
    //         }
    //     }
    //
    //     return rawValue;
    // }

    // getConnectorString(raw) {
    //     return this.getConnectorStringFromType(this.type);
    // }

    // * getConnectorStringGenerator(raw) {
    //     return this.getConnectorStringFromType(yield this.$.type);
    // }

    toString() {
        return `${this.from}${this.getConnectorString()}${this.getLag()}`;
    }

    /**
     * Returns `true` if the dependency is valid. Has valid type and both source and target ids set and not links to itself.
     *
     * @property {Boolean}
     * @typings ignore
     * @category Editing
     */
    get isValid() {
        const { from, to, type } = this;

        return typeof type === 'number' && from && from !== '' && to != null && to !== '' && from !== to;
    }

    get fromEventName() {
        return this.fromEvent?.name || '';
    }

    get toEventName() {
        return this.toEvent?.name || '';
    }
}

DependencyBaseModel.exposeProperties();
