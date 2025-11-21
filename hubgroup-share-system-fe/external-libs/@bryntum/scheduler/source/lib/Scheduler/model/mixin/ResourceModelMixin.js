/**
 * @module Scheduler/model/mixin/ResourceModelMixin
 */

/**
 * Mixin that holds configuration shared between resources in Scheduler and Scheduler Pro.
 * @mixin
 */
export default Target => class ResourceModelMixin extends Target {
    static get $name() {
        return 'ResourceModelMixin';
    }

    // Flag checked by ResourceStore to make sure it uses a valid subclass
    static get isResourceModel() {
        return true;
    }

    /**
     * Set value for the specified field(s), triggering engine calculations immediately. See
     * {@link Core.data.Model#function-set Model#set()} for arguments.
     *
     * This does not matter much on the resource itself, but is of importance when manipulating its references:
     *
     * ```javascript
     * assignment.set('resourceId', 2);
     * // resource.assignments is not yet up to date
     *
     * await assignment.setAsync('resourceId', 2);
     * // resource.assignments is up to date
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

    static get fields() {
        return [
            /**
             * Unique identifier
             * @field {String|Number} id
             * @category Common
             */

            /**
             * Get or set resource name
             * @field {String} name
             * @category Common
             */
            { name : 'name', type : 'string', persist : true },

            /**
             * Controls the primary color used for events assigned to this resource. Can be overridden per event using
             * EventModels {@link Scheduler/model/mixin/EventModelMixin#field-eventColor eventColor config}. See Schedulers
             * {@link Scheduler.view.mixin.TimelineEventRendering#config-eventColor eventColor config} for available
             * colors.
             * @field {String} eventColor
             * @category Styling
             */
            'eventColor',

            /**
             * Controls the style used for events assigned to this resource. Can be overridden per event using
             * EventModels {@link Scheduler/model/mixin/EventModelMixin#field-eventStyle eventStyle config}. See Schedulers
             * {@link Scheduler.view.mixin.TimelineEventRendering#config-eventStyle eventStyle config} for available
             * options.
             * @field {String} eventStyle
             * @category Styling
             */
            'eventStyle',

            /**
             * Fully qualified image URL, used by `ResourceInfoColumn` and vertical modes `ResourceHeader` to display a miniature image
             * for the resource.
             * @field {String} imageUrl
             * @category Styling
             */
            'imageUrl',

            /**
             * Image name relative to {@link Scheduler/view/mixin/SchedulerEventRendering#config-resourceImagePath},
             * used by `ResourceInfoColumn` and vertical modes `ResourceHeader` to display a miniature image
             * for the resource.
             * @field {String} image
             * @category Styling
             */
            'image',

            /**
             * Margin from rows edge to topmost event bar for this resource, in px.
             * @field {Number} resourceMargin
             * @category Layout
             */
            { name : 'resourceMargin', type : 'number' },

            /**
             * Margin between stacked event bars for this resource, in px.
             * @field {Number} barMargin
             * @category Layout
             */
            { name : 'barMargin', type : 'number' },

            /**
             * Base height of this resource, in px. When unset, Schedulers configured rowHeight is used.
             *
             * This value is used in horizontal mode to determine row height. When stacking, it is used as input for
             * calculating the actual row height:
             *
             * ```javascript
             * row.height = (resource.rowHeight - resourceMargin * 2) * overlap count - barMargin * (overlap count - 1)
             * ```
             *
             * When packing or overlapping, it is used as the actual row height.
             *
             * @field {Number} rowHeight
             * @category Layout
             */

            /**
             * Specify this to use a resource specific event layout in horizontal mode, see
             * {@link Scheduler.view.mixin.SchedulerEventRendering#config-eventLayout} for options.
             *
             * When unset (the default) Schedulers setting is used.
             *
             * @field {String} eventLayout
             * @category Layout
             */
            'eventLayout'
        ];
    }

    //endregion

    //region Id change

    updateAssignmentResourceIds() {
        this.assigned.forEach(assignment => {
            assignment.resourceId = this.id;
        });
    }

    syncId(value) {
        super.syncId(value);

        this.updateAssignmentResourceIds();
    }

    //endregion

    //region Getters

    /**
     * Get associated events
     *
     * @property {Scheduler.model.EventModel[]}
     * @readonly
     */
    get events() {
        return this.assignments.reduce((events, assignment) => {
            if (assignment.event) {
                events.push(assignment.event);
            }

            return events;
        }, []);
    }

    /**
     * Returns all assignments for the resource
     *
     * @property {Scheduler.model.AssignmentModel[]}
     */
    get assignments() {
        return this.assigned ? [...this.assigned] : [];
    }

    set assignments(assignments) {
        // Engine does not allow assigning to `assigned`, handle it here
        assignments.forEach(assignment => {
            assignment.resource = this;
        });
    }

    /**
     * Returns an array of events, associated with this resource
     *
     * @return {Scheduler.model.EventModel[]}
     */
    getEvents() {
        // TODO: Deprecate in favor of .events
        return this.events;
    }

    /**
     * Returns true if the Resource can be persisted.
     * In a flat store, a resource is always considered persistable. In a tree store, a resource is considered
     * persistable if its parent node is persistable.
     *
     * @property {Boolean}
     * @readonly
     */
    get isPersistable() {
        return super.isPersistable && (!this.parent || this.parent.isPersistable);
    }

    //endregion

    /**
     * Unassigns this Resource from all its Events
     */
    unassignAll() {
        this.assignments && this.assignmentStore.remove(this.assignments);
    }

    get initials() {
        const
            { name = '' } = this;

        if (!name) {
            return '';
        }

        const names         = name.split(' '),
            firstInitial  = names[0][0],
            lastInitial   = (names.length > 1 ? names[names.length - 1][0] : '');

        return firstInitial + lastInitial;
    }
};
