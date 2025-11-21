/**
 * @module Scheduler/model/mixin/AssignmentModelMixin
 */

/**
 * Mixin that holds configuration shared between assignments in Scheduler and Scheduler Pro.
 * @mixin
 */
export default Target => class AssignmentModelMixin extends Target {
    static get $name() {
        return 'AssignmentModelMixin';
    }

    /**
     * Set value for the specified field(s), triggering engine calculations immediately. See
     * {@link Core.data.Model#function-set Model#set()} for arguments.
     *
     * ```javascript
     * assignment.set('resourceId', 2);
     * // assignment.resource is not yet resolved
     *
     * await assignment.setAsync('resourceId', 2);
     * // assignment.resource is resolved
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
             * Id for the resource to assign to
             * @field {String|Number} resourceId
             * @category Common
             */
            'resourceId',

            /**
             * Id for the event to assign
             * @field {String|Number} eventId
             * @category Common
             */
            'eventId',

            /**
             * Specify `false` to opt out of drawing dependencies from/to this assignment
             * @field {Boolean} drawDependencies
             * @category Common
             */
            { name : 'drawDependencies', type : 'boolean' },

            /**
             * Id for event to assign. Can be used as an alternative to `eventId`, but please note that after
             * load it will be populated with the actual event and not its id. This field is not persistable.
             * @field {String|Number} event
             * @category Common
             */
            'event',

            /**
             * Id for resource to assign to. Can be used as an alternative to `resourceId`, but please note that after
             * load it will be populated with the actual resource and not its id. This field is not persistable.
             * @field {String|Number} resource
             * @category Common
             */
            'resource'
        ];
    }

    //endregion

    construct(data, ...args) {
        data = data || {};

        // Engine expects event and resource, not eventId and resourceId. We need to support both
        if (data.eventId != null) {
            data.event = data.eventId;
        }

        if (data.resourceId != null) {
            data.resource = data.resourceId;
        }

        super.construct(data, ...args);
    }

    //region Event & resource

    /**
     * A key made up from the event id and the id of the resource assigned to.
     * @property eventResourceKey
     * @readonly
     * @internal
     */
    get eventResourceKey() {
        const me = this;

        let eventKey, resourceKey;

        if (me.event) {
            eventKey = me.event.isModel ? me.event.id : me.event;
        }
        else {
            eventKey = me.internalId;
        }

        if (me.resource) {
            resourceKey = me.resource.isModel ? me.resource.id : me.resource;
        }
        else {
            resourceKey = me.internalId;
        }

        return `${eventKey}-${resourceKey}`;
    }

    set(field, value, ...args) {
        const toSet = this.fieldToKeys(field, value);

        // Resource was set, store its id as resourceId and announce it
        if ('resource' in toSet) {
            toSet.resourceId = toSet.resource?.id;
        }

        // Same for event
        if ('event' in toSet) {
            toSet.eventId = toSet.event?.id;
        }

        super.set(toSet, null, ...args);
    }

    // Settings resourceId relays to `resource`. Underlying data will be updated in `afterChange()` above
    set resourceId(value) {
        const { resource } = this;

        // When assigning a new id to a resource, it will update the resourceId of the assignment. But the assignments
        // resource is still the same so we need to announce here
        if (resource?.isModel && resource.id === value) {
            this.set('resourceId', value);
        }
        else {
            this.resource = value;
        }
    }

    get resourceId() {
        // If assigned using `resource` and not `resourceId` there will be no resourceId
        return this.get('resourceId') || this.resource?.id;
    }

    // Same for event as for resourceId
    set eventId(value) {
        const { event } = this;

        // When assigning a new id to an event, it will update the eventId of the assignment. But the assignments
        // event is still the same so we need to announce here
        if (event?.isModel && event.id === value) {
            this.set('eventId', value);
        }
        else {
            this.event = value;
        }
    }

    get eventId() {
        // If assigned using `event` and not `eventId` there will be no eventId
        return this.get('eventId') || this.event?.id;
    }

    /**
     * Convenience property to get the name of the associated event.
     * @property {String}
     * @readonly
     */
    get eventName() {
        return this.event?.name;
    }

    /**
     * Convenience property to get the name of the associated resource.
     * @property {String}
     * @readonly
     */
    get resourceName() {
        return this.resource?.name;
    }

    // TODO : Deprecate in favor of `get resource`
    /**
     * Returns the resource associated with this assignment.
     *
     * @return {Scheduler.model.ResourceModel} Instance of resource
     */
    getResource() {
        return this.resource;
    }

    //endregion

    // Convenience getter to not have to check `instanceof AssignmentModel`
    get isAssignment() {
        return true;
    }

    /**
     * Returns true if the Assignment can be persisted (e.g. task and resource are not 'phantoms')
     *
     * @property {Boolean}
     */
    get isPersistable() {
        const
            {
                event,
                resource,
                unjoinedStores,
                assignmentStore
            }           = this,
            crudManager = assignmentStore?.crudManager;

        let result;

        if (assignmentStore) {
            // If the owning event is not persistable, this assignment is also not persistable.
            // if crud manager is used it can deal with phantom event/resource since it persists all records in one batch
            // if no crud manager used we have to wait till event/resource are persisted
            result = this.isValid && event.isPersistable && (crudManager || !event.hasGeneratedId && !resource.hasGeneratedId);
        }
        // if we remove the record
        else {
            result = !this.isPhantom && Boolean(unjoinedStores[0]);
        }

        return result && super.isPersistable;
    }

    get isValid() {
        return this.resource != null && this.event != null;
    }

    /**
     * Returns a textual representation of this assignment (e.g. Mike 50%).
     * @return {String}
     */
    toString() {
        if (this.resourceName) {
            return `${this.resourceName} ${this.units}%`;
        }

        return '';
    }
};
