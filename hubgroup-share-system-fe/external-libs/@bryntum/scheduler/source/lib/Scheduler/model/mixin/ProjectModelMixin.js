import Model from '../../../Core/data/Model.js';
import EventModel from '../EventModel.js';
import DependencyModel from '../DependencyModel.js';
import ResourceModel from '../ResourceModel.js';
import AssignmentModel from '../AssignmentModel.js';
import ResourceTimeRangeModel from '../ResourceTimeRangeModel.js';
import TimeSpan from '../TimeSpan.js';
import Store from '../../../Core/data/Store.js';
import StringHelper from '../../../Core/helper/StringHelper.js';
import EventStore from '../../data/EventStore.js';
import DependencyStore from '../../data/DependencyStore.js';
import ResourceStore from '../../data/ResourceStore.js';
import AssignmentStore from '../../data/AssignmentStore.js';
import ResourceTimeRangeStore from '../../data/ResourceTimeRangeStore.js';

/**
 * @module Scheduler/model/mixin/ProjectModelMixin
 */

/**
 * Mixin that holds configuration shared between projects in Scheduler and Scheduler Pro.
 * @mixin
 */
export default Target => class ProjectModelMixin extends (Target || Model) {
    static get $name() {
        return 'ProjectModelMixin';
    }

    //region Config

    static get defaultConfig() {
        return {
            /**
             * Configuration options to provide to the STM manager
             *
             * @config {Object|Core.data.stm.StateTrackingManager}
             * @category Advanced
             */
            stm : {},

            /**
             * The constructor of the event model class, to be used in the project. Will be set as the
             * {@link Core.data.Store#config-modelClass modelClass} property of the {@link #property-eventStore}
             *
             * @config {Scheduler.model.EventModel}
             * @category Models & Stores
             */
            eventModelClass : EventModel,

            /**
             * The constructor of the dependency model class, to be used in the project. Will be set as the
             * {@link Core.data.Store#config-modelClass modelClass} property of the {@link #property-dependencyStore}
             *
             * @config {Scheduler.model.DependencyModel}
             * @category Models & Stores
             */
            dependencyModelClass : DependencyModel,

            timeRangeModelClass         : TimeSpan,
            resourceTimeRangeModelClass : ResourceTimeRangeModel,

            /**
             * The constructor of the resource model class, to be used in the project. Will be set as the
             * {@link Core.data.Store#config-modelClass modelClass} property of the {@link #property-resourceStore}
             *
             * @config {Scheduler.model.ResourceModel}
             * @category Models & Stores
             */
            resourceModelClass : ResourceModel,

            /**
             * The constructor of the assignment model class, to be used in the project. Will be set as the
             * {@link Core.data.Store#config-modelClass modelClass} property of the {@link #property-assignmentStore}
             *
             * @config {Scheduler.model.AssignmentModel}
             * @category Models & Stores
             */
            assignmentModelClass : AssignmentModel,

            /**
             * The constructor to create an event store instance with. Should be a class, subclassing the
             * {@link Scheduler.data.EventStore}
             * @config {Scheduler.data.EventStore|Object}
             * @category Models & Stores
             */
            eventStoreClass : EventStore,

            /**
             * The constructor to create a dependency store instance with. Should be a class, subclassing the
             * {@link Scheduler.data.DependencyStore}
             * @config {Scheduler.data.DependencyStore|Object}
             * @category Models & Stores
             */
            dependencyStoreClass : DependencyStore,

            /**
             * The constructor to create a resource store instance with. Should be a class, subclassing the
             * {@link Scheduler.data.ResourceStore}
             * @config {Scheduler.data.ResourceStore|Object}
             * @category Models & Stores
             */
            resourceStoreClass : ResourceStore,

            /**
             * The constructor to create an assignment store instance with. Should be a class, subclassing the
             * {@link Scheduler.data.AssignmentStore}
             * @config {Scheduler.data.AssignmentStore|Object}
             * @category Models & Stores
             */
            assignmentStoreClass : AssignmentStore,

            /**
             * The constructor to create a time range store instance with. Should be a class subclassing the {@link Core.data.Store}
             * @config {Core.data.Store|Object}
             * @category Models & Stores
             */
            timeRangeStoreClass : Store,

            /**
             * The constructor to create a resource time range store instance with. Should be a class subclassing the {@link Scheduler.data.ResourceTimeRangeStore}
             * @config {Scheduler.data.ResourceTimeRangeStore|Object}
             * @category Models & Stores
             */
            resourceTimeRangeStoreClass : ResourceTimeRangeStore,

            /**
             * The initial data, to fill the {@link #property-eventStore eventStore} with.
             * Should be an array of {@link Scheduler.model.EventModel EventModels} or it's configuration objects.
             *
             * @config {Scheduler.model.EventModel[]} eventsData
             * @category Inline data
             */

            /**
             * The initial data, to fill the {@link #property-dependencyStore dependencyStore} with.
             * Should be an array of {@link Scheduler.model.DependencyModel DependencyModels} or it's configuration
             * objects.
             *
             * @config {Scheduler.model.DependencyModel[]} [dependenciesData]
             * @category Inline data
             */

            /**
             * The initial data, to fill the {@link #property-resourceStore resourceStore} with.
             * Should be an array of {@link Scheduler.model.ResourceModel ResourceModels} or it's configuration objects.
             *
             * @config {Scheduler.model.ResourceModel[]} [resourcesData]
             * @category Inline data
             */

            /**
             * The initial data, to fill the {@link #property-assignmentStore assignmentStore} with.
             * Should be an array of {@link Scheduler.model.AssignmentModel AssignmentModels} or it's configuration objects.
             *
             * @config {Scheduler.model.AssignmentModel[]} [assignmentsData]
             * @category Inline data
             */

            /**
             * The initial data, to fill the {@link #property-timeRangeStore timeRangeStore} with.
             * Should be an array of {@link Scheduler.model.TimeSpan TimeSpan} or it's configuration objects.
             *
             * @config {Scheduler.model.TimeSpan[]} [timeRangesData]
             * @category Inline data
             */

            /**
             * The initial data, to fill the {@link #property-resourceTimeRangeStore resourceTimeRangeStore} with.
             * Should be an array of {@link Scheduler.model.ResourceTimeRangeModel ResourceTimeRangeModel} or it's configuration objects.
             *
             * @config {Scheduler.model.ResourceTimeRangeModel[]} [resourceTimeRangesData]
             * @category Inline data
             */

            eventStore             : {},
            assignmentStore        : {},
            dependencyStore        : {},
            resourceStore          : {},
            timeRangeStore         : null,
            timeRangesData         : null,
            resourceTimeRangeStore : null
        };
    }

    static get configurable() {
        return {
            /**
             * Project data as a JSON string, used to populate its stores.
             *
             * ```javascript
             * const project = new ProjectModel({
             *     json : '{"eventsData":[...],"resourcesData":[...],...}'
             * }
             * ```
             *
             * @config {String}
             */
            json : null
        };
    }

    //endregion

    //region Properties

    /**
     * State tracking manager instance the project relies on
     * @member {Core.data.stm.StateTrackingManager} stm
     */

    /**
     * The {@link Scheduler.data.EventStore store} holding the events information.
     *
     * See also {@link Scheduler.model.EventModel}
     *
     * @member {Scheduler.data.EventStore} eventStore
     * @category Models & Stores
     */
    /**
     * An {@link Scheduler.data.EventStore} instance or a config object.
     * @config {Scheduler.data.EventStore|Object} eventStore
     * @category Models & Stores
     */

    /**
     * The {@link Scheduler.data.DependencyStore store} holding the dependencies information.
     *
     * See also {@link Scheduler.model.DependencyModel}
     *
     * @member {Scheduler.data.DependencyStore} dependencyStore
     * @category Models & Stores
     */
    /**
     * A {@link Scheduler.data.DependencyStore} instance or a config object.
     * @config {Scheduler.data.DependencyStore|Object} dependencyStore
     * @category Models & Stores
     */

    /**
     * The {@link Scheduler.data.ResourceStore store} holding the resources that can be assigned to the events in the event store.
     *
     * See also {@link Scheduler.model.ResourceModel}
     *
     * @member {Scheduler.data.ResourceStore} resourceStore
     * @category Models & Stores
     */
    /**
     * A {@link Scheduler.data.ResourceStore} instance or a config object.
     * @config {Scheduler.data.ResourceStore|Object} resourceStore
     * @category Models & Stores
     */

    /**
     * The {@link Scheduler.data.AssignmentStore store} holding the assignments information.
     *
     * See also {@link Scheduler.model.AssignmentModel}
     *
     * @member {Scheduler.data.AssignmentStore} assignmentStore
     * @category Models & Stores
     */
    /**
     * A {@link Scheduler.data.AssignmentStore} instance or a config object.
     * @config {Scheduler.data.AssignmentStore|Object} assignmentStore
     * @category Models & Stores
     */

    /**
     * Returns current Project changes as an object consisting of added/modified/removed arrays of records for every
     * managed store. Returns `null` if no changes exist. Format:
     *
     * ```javascript
     * {
     *     resources : {
     *         added    : [{ name : 'New guy' }],
     *         modified : [{ id : 2, name : 'Mike' }],
     *         removed  : [{ id : 3 }]
     *     },
     *     events : {
     *         modified : [{  id : 12, name : 'Cool task' }]
     *     },
     *     ...
     * }
     * ```
     *
     * @member {Object} changes
     * @readonly
     * @category Models & Stores
     */

    /**
     * The {@link Core.data.Store store} holding the time ranges information.
     *
     * See also {@link Scheduler.model.TimeSpan}
     *
     * @member {Core.data.Store} timeRangeStore
     * @category Models & Stores
     */
    /**
     * A {@link Core.data.Store} instance or a config object.
     * @config {Core.data.Store|Object} timeRangeStore
     * @category Models & Stores
     */

    /**
     * The {@link Scheduler.data.ResourceTimeRangeStore store} holding the resource time ranges information.
     *
     * See also {@link Scheduler.model.ResourceTimeRangeModel}
     *
     * @member {Scheduler.data.ResourceTimeRangeStore} resourceTimeRangeStore
     * @category Models & Stores
     */
    /**
     * A {@link Scheduler.data.ResourceTimeRangeStore} instance or a config object.
     * @config {Scheduler.data.ResourceTimeRangeStore|Object} resourceTimeRangeStore
     * @category Models & Stores
     */

    /**
     * Get or set data of project stores. The returned data is identical to what
     * {@link #function-toJSON} returns:
     *
     * ```javascript
     *
     * const data = scheduler.project.inlineData;
     *
     * // data:
     * {
     *     eventsData : [...],
     *     resourcesData : [...],
     *     dependenciesData : [...],
     *     assignmentsData : [...]
     * }
     *
     *
     * // Plug it back in later
     * scheduler.project.inlineData = data;
     * ```
     *
     * @property {Object}
     * @name inlineData
     */
    get inlineData() {
        return StringHelper.safeJsonParse(super.json);
    }

    set inlineData(inlineData) {
        this.json = inlineData;
    }

    //endregion

    //region Functions

    /**
     * Accepts a "data package" consisting of data for the projects stores, which is then loaded into the stores.
     *
     * The package can hold data for EventStore, AssignmentStore, ResourceStore and DependencyStore. It uses the same
     * format as when creating a project with inline data:
     *
     * ```javascript
     * await project.loadInlineData({
     *     eventsData       : [...],
     *     resourcesData    : [...],
     *     assignmentsData  : [...],
     *     dependenciesData : [...]
     * });
     * ```
     *
     * After populating the stores it commits the project, starting its calculations. By awaiting `loadInlineData()` you
     * can be sure that project calculations are finished.
     *
     * @function loadInlineData
     * @param {Object} dataPackage A data package as described above
     * @fires load
     * @async
     */

    /**
     * Project changes (CRUD operations to records in its stores) are automatically committed on a buffer to the
     * underlying graph based calculation engine. The engine performs it calculations async.
     *
     * By calling this function, the commit happens right away. And by awaiting it you are sure that project
     * calculations are finished and that references between records are up to date.
     *
     * The returned promise is resolved with an object. If that object has `rejectedWith` set, there has been a conflict and the calculation failed.
     *
     * ```javascript
     * // Move an event in time
     * eventStore.first.shift(1);
     *
     * // Trigger calculations directly and wait for them to finish
     * const result = await project.commitAsync();
     *
     * if (result.rejectedWith) {
     *     // there was a conflict during the scheduling
     * }
     * ```
     *
     * @async
     * @returns {Promise}
     * @function commitAsync
     */

    //endregion

    //region Init

    construct(config = {}) {
        super.construct(...arguments);

        // These stores are not handled by engine, but still held on project

        const me = this;

        if (!me.timeRangeStore) {
            me.timeRangeStore = new me.timeRangeStoreClass({
                modelClass : me.timeRangeModelClass,
                storeId    : 'timeRanges',
                data       : me.timeRangesData || []
            });
        }

        if (!me.resourceTimeRangeStore) {
            me.resourceTimeRangeStore = new me.resourceTimeRangeStoreClass({
                modelClass : me.resourceTimeRangeModelClass
            });
        }

        if (me.resourceTimeRangesData) {
            me.resourceTimeRangeStore.data = me.resourceTimeRangesData;
        }
    }

    //endregion

    //region JSON

    /**
     * Returns the data from the records of the projects stores, in a format that can be consumed by `loadInlineData()`.
     *
     * Used by JSON.stringify to correctly convert this record to json.
     *
     *
     * ```javascript
     * const project = new ProjectModel({
     *     eventsData       : [...],
     *     resourcesData    : [...],
     *     assignmentsData  : [...],
     *     dependenciesData : [...]
     * });
     *
     * const json = project.toJSON();
     *
     * // json:
     * {
     *     eventsData : [...],
     *     resourcesData : [...],
     *     dependenciesData : [...],
     *     assignmentsData : [...]
     * }
     * ```
     *
     * Output can be consumed by `loadInlineData()`:
     *
     * ```javascript
     * const json = project.toJSON();
     *
     * // Plug it back in later
     * project.loadInlineData(json);
     * ```
     *
     * @returns {Object}
     * @category JSON
     */
    toJSON() {
        const
            me = this,
            result = {
                eventsData       : me.eventStore.toJSON(),
                resourcesData    : me.resourceStore.toJSON(),
                dependenciesData : me.dependencyStore.toJSON()
            };

        if (!me.eventStore.usesSingleAssignment) {
            result.assignmentsData = me.assignmentStore.toJSON();
        }

        return result;
    }

    /**
     * Get or set project data (records from its stores) as a JSON string.
     *
     * Get a JSON string:
     *
     * ```javascript
     * const project = new ProjectModel({
     *     eventsData       : [...],
     *     resourcesData    : [...],
     *     assignmentsData  : [...],
     *     dependenciesData : [...]
     * });
     *
     * const jsonString = project.json;
     *
     * // jsonString:
     * '{"eventsData":[...],"resourcesData":[...],...}'
     * ```
     *
     * Set a JSON string (to populate the project stores):
     *
     * ```javascript
     * project.json = '{"eventsData":[...],"resourcesData":[...],...}'
     * ```
     *
     * @property {String}
     */
    get json() {
        return super.json;
    }

    changeJson(json) {
        if (typeof json === 'string') {
            json = StringHelper.safeJsonParse(json);
        }

        return json;
    }

    updateJson(json) {
        json && this.loadInlineData(json);
    }

    //endregion

    afterChange(toSet, wasSet) {
        super.afterChange(...arguments);

        if (wasSet.calendar) {
            this.trigger('calendarChange');
        }
    }

    doDestroy() {
        this.timeRangeStore.destroy();
        this.resourceTimeRangeStore.destroy();

        super.doDestroy();
    }
};
