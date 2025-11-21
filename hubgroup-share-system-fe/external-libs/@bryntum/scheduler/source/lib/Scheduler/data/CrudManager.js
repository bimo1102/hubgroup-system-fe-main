import ResourceStore from './ResourceStore.js';
import EventStore from './EventStore.js';
import AssignmentStore from './AssignmentStore.js';
import DependencyStore from './DependencyStore.js';
import Store from '../../Core/data/Store.js';
import ProjectCrudManager from './mixin/ProjectCrudManager.js';
import AbstractCrudManager from '../crud/AbstractCrudManager.js';
import AjaxTransport from '../crud/transport/AjaxTransport.js';
import JsonEncoder from '../crud/encoder/JsonEncoder.js';
import ProjectModel from '../model/ProjectModel.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';

/**
 * @module Scheduler/data/CrudManager
 */

/**
 * The Crud Manager (or "CM") is a class implementing centralized loading and saving of data in multiple stores.
 * Loading the stores and saving all changes is done using a single request. The stores managed by CRUD manager should
 * not be configured with their own CRUD URLs or use {@link Core/data/AjaxStore#config-autoLoad}/{@link Core/data/AjaxStore#config-autoCommit}.
 *
 * This class uses JSON as its data encoding format.
 *
 * ## Scheduler stores
 *
 * The class supports Scheduler specific stores (namely: resource, event, assignment and dependency stores).
 * For these stores, the CM has separate configs ({@link #config-resourceStore}, {@link #config-eventStore},
 * {@link #config-assignmentStore}) to register them.
 *
 * ```javascript
 * const crudManager = new CrudManager({
 *     autoLoad        : true,
 *     resourceStore   : resourceStore,
 *     eventStore      : eventStore,
 *     assignmentStore : assignmentStore,
 *     transport       : {
 *         load : {
 *             url : 'php/read.php'
 *         },
 *         sync : {
 *             url : 'php/save.php'
 *         }
 *     }
 * });
 * ```
 *
 * ## AJAX request configuration
 *
 * To configure AJAX request parameters please take a look at the
 * {@link Scheduler/crud/transport/AjaxTransport} docs.
 *
 * ```javascript
 * const crudManager = new CrudManager({
 *     autoLoad        : true,
 *     resourceStore,
 *     eventStore,
 *     assignmentStore,
 *     transport       : {
 *         load    : {
 *             url         : 'php/read.php',
 *             // use GET request
 *             method      : 'GET',
 *             // pass request JSON in "rq" parameter
 *             paramName   : 'rq',
 *             // extra HTTP request parameters
 *             params      : {
 *                 foo     : 'bar'
 *             },
 *             // pass some extra Fetch API option
 *             credentials : 'include'
 *         },
 *         sync : {
 *             url : 'php/save.php'
 *         }
 *     }
 * });
 * ```
 * ## Using inline data
 *
 * The CrudManager provides settable property {@link #property-inlineData} that can
 * be used to get data from all {@link #property-crudStores} at once and to set this
 * data as well. Populating the stores this way can be useful if you cannot or you do not want to use CrudManager for
 * server requests but you pull the data by other means and have it ready outside CrudManager. Also, the data from all
 * stores is available in a single assignment statement.
 *
 * ### Getting data
 * ```javascript
 * const data = scheduler.crudManager.inlineData;
 *
 * // use the data in your application
 * ```
 *
 * ### Setting data
 * ```javascript
 * const data = // your function to pull server data
 *
 * scheduler.crudManager.inlineData = data;
 * ```
 *
 * ## Load order
 *
 * The CM is aware of the proper load order for Scheduler specific stores so you don't need to worry about it.
 * If you provide any extra stores (using {@link #config-stores} config) they will be
 * added to the start of collection before the Scheduler specific stores.
 * If you need a different loading order, you should use {@link #function-addStore} method to
 * register your store:
 *
 * ```javascript
 * const crudManager = new CrudManager({
 *     resourceStore   : resourceStore,
 *     eventStore      : eventStore,
 *     assignmentStore : assignmentStore,
 *     // extra user defined stores will get to the start of collection
 *     // so they will be loaded first
 *     stores          : [ store1, store2 ],
 *     transport       : {
 *         load : {
 *             url : 'php/read.php'
 *         },
 *         sync : {
 *             url : 'php/save.php'
 *         }
 *     }
 * });
 *
 * // append store3 to the end so it will be loaded last
 * crudManager.addStore(store3);
 *
 * // now when we registered all the stores let's load them
 * crudManager.load();
 * ```
 *
 * ## Assignment store
 *
 * The Crud Manager is designed to use {@link Scheduler/data/AssignmentStore} for assigning events to one or multiple resources.
 * However if server provides `resourceId` for any of the `events` then the Crud Manager enables backward compatible mode when
 * an event could have a single assignment only. This also disables multiple assignments in Scheduler UI.
 * In order to use multiple assignments server backend should be able to receive/send `assignments` for `load` and `sync` requests.
 *
 * ## Project
 *
 * The Crud Manager automatically consumes stores of the provided project (namely its {@link Scheduler/model/ProjectModel#property-eventStore},
 * {@link Scheduler/model/ProjectModel#property-resourceStore}, {@link Scheduler/model/ProjectModel#property-assignmentStore},
 * {@link Scheduler/model/ProjectModel#property-dependencyStore}, {@link Scheduler/model/ProjectModel#property-timeRangeStore} and
 * {@link Scheduler/model/ProjectModel#property-resourceTimeRangeStore}):
 *
 * ```javascript
 * const crudManager = new CrudManager({
 *     // crud manager will get stores from myAppProject project
 *     project   : myAppProject,
 *     transport : {
 *         load : {
 *             url : 'php/read.php'
 *         },
 *         sync : {
 *             url : 'php/save.php'
 *         }
 *     }
 * });
 * ```
 *
 * @mixes Scheduler/data/mixin/ProjectCrudManager
 * @mixes Scheduler/crud/encoder/JsonEncoder
 * @mixes Scheduler/crud/transport/AjaxTransport
 * @extends Scheduler/crud/AbstractCrudManager
 */

export default class CrudManager extends AbstractCrudManager.mixin(ProjectCrudManager, AjaxTransport, JsonEncoder) {

    //region Config

    static get defaultConfig() {
        return {
            projectClass         : ProjectModel,
            resourceStoreClass   : ResourceStore,
            eventStoreClass      : EventStore,
            assignmentStoreClass : AssignmentStore,
            dependencyStoreClass : DependencyStore,

            /**
             * A store with resources (or its descriptor).
             * @config {Scheduler.data.ResourceStore|Object}
             */
            resourceStore : {},

            /**
             * A store with events (or its descriptor).
             *
             * ```
             * crudManager : {
             *      eventStore {
             *          storeClass : MyEventStore
             *      }
             * }
             * ```
             * @config {Scheduler.data.EventStore|Object}
             */
            eventStore : {},

            /**
             * A store with assignments (or its descriptor).
             * @config {Scheduler.data.AssignmentStore|Object}
             */
            assignmentStore : {},

            /**
             * A store with dependencies (or its descriptor).
             * @config {Scheduler.data.DependencyStore|Object}
             */
            dependencyStore : {},

            /**
             * A project that holds and links stores
             * @config {Scheduler.model.ProjectModel}
             */
            project : null
        };
    }

    //endregion

    buildProject() {
        return new this.projectClass(this.buildProjectConfig());
    }

    buildProjectConfig() {
        return ObjectHelper.cleanupProperties({
            eventStore             : this.eventStore,
            resourceStore          : this.resourceStore,
            assignmentStore        : this.assignmentStore,
            dependencyStore        : this.dependencyStore,
            resourceTimeRangeStore : this.resourceTimeRangeStore
        });
    }

    //region Stores

    set project(project) {
        const me = this;

        if (project !== me._project) {
            me.detachListeners('beforeDataReady');
            me.detachListeners('afterDataReady');

            me._project = project;

            if (project) {
                me.eventStore             = project.eventStore;
                me.resourceStore          = project.resourceStore;
                me.assignmentStore        = project.assignmentStore;
                me.dependencyStore        = project.dependencyStore;
                me.timeRangeStore         = project.timeRangeStore;
                me.resourceTimeRangeStore = project.resourceTimeRangeStore;

                // When adding multiple events to the store it will trigger multiple change events each of which will
                // call crudManager.hasChanges, which will try to actually get the changeset package. It takes some time
                // and we better skip that part for the dataready event, suspending changes tracking.
                project.on({
                    name      : 'beforeDataReady',
                    dataReady : () => me.suspendChangesTracking(),
                    prio      : 100,
                    thisObj   : me
                });

                project.on({
                    name      : 'afterDataReady',
                    dataReady : () => me.resumeChangesTracking(),
                    prio      : -100,
                    thisObj   : me
                });
            }

            if (!me.eventStore) {
                me.eventStore = {};
            }
            if (!me.resourceStore) {
                me.resourceStore = {};
            }
            if (!me.assignmentStore) {
                me.assignmentStore = {};
            }
            if (!me.dependencyStore) {
                me.dependencyStore = {};
            }
        }
    }

    get project() {
        return this._project;
    }

    /**
     * Store for {@link Scheduler/feature/TimeRanges timeRanges} feature.
     * @property {Core.data.Store}
     * @deprecated Please use {@link #property-timeRangeStore} property
     * @readonly
     */
    get timeRangesStore() {
        return this.timeRangeStore;
    }

    /**
     * Store for {@link Scheduler/feature/TimeRanges timeRanges} feature.
     * @property {Core.data.Store}
     */

    get timeRangeStore() {
        return this._timeRangeStore?.store;
    }

    set timeRangeStore(store) {
        this.setFeaturedStore('_timeRangeStore', store, this.project?.timeRangeStoreClass);
    }

    /**
     * Store for {@link Scheduler/feature/ResourceTimeRanges resourceTimeRanges} feature.
     * @property {Core.data.Store}
     */

    get resourceTimeRangeStore() {
        return this._resourceTimeRangeStore?.store;
    }

    set resourceTimeRangeStore(store) {
        this.setFeaturedStore('_resourceTimeRangeStore', store, this.project?.resourceTimeRangeStoreClass);
    }

    /**
     * Get/set the resource store bound to the CRUD manager.
     * @property {Scheduler.data.ResourceStore}
     */
    get resourceStore() {
        return this._resourceStore?.store;
    }

    set resourceStore(store) {
        const me = this;

        me.setFeaturedStore('_resourceStore', store, me.resourceStoreClass);
    }

    /**
     * Get/set the event store bound to the CRUD manager.
     * @property {Scheduler.data.EventStore}
     */
    get eventStore() {
        return this._eventStore?.store;
    }

    set eventStore(store) {
        const me = this;

        me.setFeaturedStore('_eventStore', store, me.eventStoreClass);
    }

    /**
     * Get/set the assignment store bound to the CRUD manager.
     * @property {Scheduler.data.AssignmentStore}
     */
    get assignmentStore() {
        return this._assignmentStore?.store;
    }

    set assignmentStore(store) {
        this.setFeaturedStore('_assignmentStore', store, this.assignmentStoreClass);
    }

    /**
     * Get/set the dependency store bound to the CRUD manager.
     * @property {Scheduler.data.DependencyStore}
     */
    get dependencyStore() {
        return this._dependencyStore?.store;
    }

    set dependencyStore(store) {
        this.setFeaturedStore('_dependencyStore', store, this.dependencyStoreClass);
    }

    setFeaturedStore(property, store, storeClass) {
        const
            me       = this,
            oldStore = me[property]?.store;

        // if not the same store
        if (oldStore !== store) {
            // normalize store value (turn it into a storeClass instance if needed)
            store = Store.getStore(store, store?.storeClass || storeClass);

            if (oldStore) {
                me.removeStore(oldStore);
            }

            me[property] = store && { store } || null;

            // Adds configured scheduler stores to the store collection ensuring correct order
            // unless they're already registered.
            me.addPrioritizedStore(me[property]);
        }

        return me[property];
    }

    getChangeSetPackage() {
        const pack = super.getChangeSetPackage();

        // Remove assignments from changes if using single assignment mode (resourceId)
        if (pack && this.eventStore.usesSingleAssignment) {
            delete pack[this.assignmentStore.storeId];
            // No other changes?
            if (!this.crudStores.some(storeInfo => pack[storeInfo.storeId])) {
                return null;
            }
        }

        return pack;
    }

    //endregion

    get crudLoadValidationMandatoryStores() {
        return [this._eventStore.storeId, this._resourceStore.storeId];
    }

};
