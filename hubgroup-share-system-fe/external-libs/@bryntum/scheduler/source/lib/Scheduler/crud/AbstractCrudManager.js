import Base from '../../Core/Base.js';
import AbstractCrudManagerMixin from './AbstractCrudManagerMixin.js';
import VersionHelper from '../../Core/helper/VersionHelper.js';
import StringHelper from '../../Core/helper/StringHelper.js';

/**
 * @module Scheduler/crud/AbstractCrudManager
 */

/**
 * This is an abstract class serving as the base for the {@link Scheduler.data.CrudManager} class.
 * It implements basic mechanisms to organize batch communication with a server.
 * Yet it does not contain methods related to _data transfer_ nor _encoding_.
 * These methods are to be provided in sub-classes by consuming the appropriate mixins.
 *
 * For example, this is how the class can be used to implement an JSON encoding system:
 *
 * ```javascript
 * // let's make new CrudManager using AJAX as a transport system and JSON for encoding
 * class MyCrudManager extends JsonEncode(AjaxTransport(AbstractCrudManager)) {
 *
 * }
 * ```
 *
 * ## Data transfer and encoding methods
 *
 * These are methods that must be provided by subclasses of this class:
 *
 * - [#sendRequest](#Scheduler/crud/AbstractCrudManagerMixin#function-sendRequest)
 * - [#cancelRequest](#Scheduler/crud/AbstractCrudManagerMixin#function-cancelRequest)
 * - [#encode](#Scheduler/crud/AbstractCrudManagerMixin#function-encode)
 * - [#decode](#Scheduler/crud/AbstractCrudManagerMixin#function-decode)
 *
 * @extends Core/Base
 * @mixes Scheduler/crud/AbstractCrudManagerMixin
 * @abstract
 */
export default class AbstractCrudManager extends Base.mixin(AbstractCrudManagerMixin) {
    //region Default config

    /**
     * The server revision stamp.
     * The _revision stamp_ is a number which should be incremented after each server-side change.
     * This property reflects the current version of the data retrieved from the server and gets updated after each {@link Scheduler/crud/AbstractCrudManagerMixin#function-load} and {@link Scheduler/crud/AbstractCrudManagerMixin#function-sync} call.
     * @property {Number}
     * @readonly
     */
    get revision() {
        return this.crudRevision;
    }

    set revision(value) {
        this.crudRevision = value;
    }

    /**
     * Get or set data of {@link #property-crudStores} as a JSON string.
     *
     * Get a JSON string:
     * ```javascript
     *
     * const jsonString = scheduler.crudManager.json;
     *
     * // returned jsonString:
     * '{"eventsData":[...],"resourcesData":[...],...}'
     *
     * // object representation of the returned jsonString:
     * {
     *     resourcesData    : [...],
     *     eventsData       : [...],
     *     assignmentsData  : [...],
     *     dependenciesData : [...],
     *     timeRangesData   : [...],
     *     // data from other stores
     * }
     * ```
     *
     * Set a JSON string (to populate the CrudManager stores):
     *
     * ```javascript
     * scheduler.crudManager.json = '{"eventsData":[...],"resourcesData":[...],...}'
     * ```
     *
     * @property {String}
     */
    get json() {
        return StringHelper.safeJsonStringify(this);
    }

    set json(json) {
        if (typeof json === 'string') {
            json = StringHelper.safeJsonParse(json);
        }

        this.forEachCrudStore(store => {
            const dataName = `${store.storeId}Data`;
            if (json[dataName]) {
                store.data = json[dataName];
            }
        });
    }

    static get defaultConfig() {
        return {
            /**
             * Sets the list of stores controlled by the CRUD manager.
             *
             * When adding a store to the CrudManager, make sure the server response format is correct for `load` and `sync` requests.
             * Learn more in the [Working with data](#Scheduler/guides/data/crud_manager.md#loading-data) guide.
             *
             * Store can be provided by itself, its storeId or an object having the following structure:
             * @property {String} stores.storeId Unique store identifier. Under this name the store related requests/responses will be sent.
             * @property {Core.data.Store} stores.store The store itself.
             * @property {String} [stores.phantomIdField] Set this if the store model has a predefined field to keep phantom record identifier.
             * @property {String} [stores.idField] id field name, if it's not specified then class will try to get it from a store model.
             * @config {Core.data.Store[]|String[]|Object[]}
             */
            stores : null

            /**
             * Encodes request to the server.
             * @function encode
             * @param {Object} request The request to encode.
             * @returns {String} The encoded request.
             * @abstract
             */

            /**
             * Decodes response from the server.
             * @function decode
             * @param {String} response The response to decode.
             * @returns {Object} The decoded response.
             * @abstract
             */
        };
    }

    //endregion

    //region Init

    construct(config = {}) {
        if (config.stores) {
            config.crudStores = config.stores;
            delete config.stores;
        }

        super.construct(config);
    }

    //endregion

    //region inline data

    /**
     * Returns the data from all CrudManager `crudStores` in a format that can be consumed by `inlineData`.
     *
     * Used by JSON.stringify to correctly convert this CrudManager to json.
     *
     * The returned data is identical to what {@link Scheduler/crud/AbstractCrudManager#property-inlineData} contains.
     *
     * ```javascript
     *
     * const json = scheduler.crudManager.toJSON();
     *
     * // json:
     * {
     *     eventsData : [...],
     *     resourcesData : [...],
     *     dependenciesData : [...],
     *     assignmentsData : [...],
     *     timeRangesData : [...],
     *     resourceTimeRangesData : [...],
     *     // ... other stores data
     * }
     * ```
     *
     * Output can be consumed by `inlineData`.
     *
     * ```javascript
     * const json = scheduler.crudManager.toJSON();
     *
     * // Plug it back in later
     * scheduler.crudManager.inlineData = json;
     * ```
     *
     * @function toJSON
     * @returns {Object}
     * @category JSON
     */
    toJSON() {
        // Collect data from crudStores
        const result = {};
        this.forEachCrudStore((store, storeId) => result[`${storeId}Data`] = store.toJSON());
        return result;
    }

    /**
     * Get or set data of CrudManager stores. The returned data is identical to what
     * {@link Scheduler/crud/AbstractCrudManager#function-toJSON} returns:
     *
     * ```javascript
     *
     * const data = scheduler.crudManager.inlineData;
     *
     * // data:
     * {
     *     eventsData : [...],
     *     resourcesData : [...],
     *     dependenciesData : [...],
     *     assignmentsData : [...],
     *     timeRangesData : [...],
     *     resourceTimeRangesData : [...],
     *     ... other stores data
     * }
     *
     *
     * // Plug it back in later
     * scheduler.crudManager.inlineData = data;
     * ```
     *
     * @property {Object}
     * @name inlineData
     */
    get inlineData() {
        return this.toJSON();
    }

    set inlineData(data) {
        this.json = data;
    }

    //endregion

    //region Store collection (add, remove, get & iterate)

    set stores(stores) {
        if (stores !== this.crudStores) {
            this.crudStores = stores;
        }
    }

    /**
     * A list of registered stores whose server communication will be collected into a single batch.
     * Each store is represented by a _store descriptor_, an object having following structure:
     * @member {Object[]} stores
     * @property {String} stores.storeId Unique store identifier.
     * @property {Core.data.Store} stores.store Store itself.
     * @property {String} [stores.phantomIdField] Set this if store model has a predefined field to keep phantom record identifier.
     * @property {String} [stores.idField] id field name, if it's not specified then class will try to get it from a store model.
     */
    get stores() {
        return this.crudStores;
    }

    //endregion

    /**
     * Returns true if the crud manager is currently loading data
     * @property {Boolean}
     * @readonly
     * @category CRUD
     */
    get isLoading() {
        return this.isCrudManagerLoading;
    }

    /**
     * DEPRECATED in favor of {@link #function-acceptChanges}
     */
    commit() {
        VersionHelper.deprecate('Scheduler', '5.0.0', 'commit is deprecated, in favor of acceptChanges');
        this.commitCrudStores();
    }

    /**
     * DEPRECATED in favor of {@link #function-revertChanges}
     */
    reject() {
        VersionHelper.deprecate('Scheduler', '5.0.0', 'reject is deprecated, in favor of revertChanges');
        this.revertChanges();
    }

    /**
     * Adds a store to the collection.
     *
     *```javascript
     * // append stores to the end of collection
     * crudManager.addStore([
     *     store1,
     *     // storeId
     *     'bar',
     *     // store descriptor
     *     {
     *         storeId : 'foo',
     *         store   : store3
     *     },
     *     {
     *         storeId         : 'bar',
     *         store           : store4,
     *         // to write all fields of modified records
     *         writeAllFields  : true
     *     }
     * ]);
     *```
     *
     * **Note:** Order in which stores are kept in the collection is very essential sometimes.
     * Exactly in this order the loaded data will be put into each store.
     *
     * When adding a store to the CrudManager, make sure the server response format is correct for `load` and `sync` requests.
     * Learn more in the [Working with data](#Scheduler/guides/data/crud_manager.md#loading-data) guide.
     *
     * @param {Core.data.Store|String|Object|Core.data.Store[]|String[]|Object[]} store
     * A store or list of stores. Each store might be specified by its instance, `storeId` or _descriptor_.
     * The _store descriptor_ is an object having following properties:
     * @param {String} store.storeId The store identifier that will be used as a key in requests.
     * @param {Core.data.Store} store.store The store itself.
     * @param {String} [store.idField] The idField of the store. If not specified will be taken from the store model.
     * @param {String} [store.phantomIdField] The field holding unique Ids of phantom records (if store has such model).
     * @param {Boolean} [store.writeAllFields] Set to true to write all fields from modified records
     * @param {Number} [position] The relative position of the store. If `fromStore` is specified the this position will be taken relative to it.
     * If not specified then store(s) will be appended to the end of collection.
     * Otherwise it will be just a position in stores collection.
     *
     * ```javascript
     * // insert stores store4, store5 to the start of collection
     * crudManager.addStore([ store4, store5 ], 0);
     * ```
     *
     * @param {String|Core.data.Store|Object} [fromStore] The store relative to which position should be calculated. Can be defined as a store identifier, instance or descriptor (the result of {@link Scheduler/crud/AbstractCrudManagerMixin#function-getStoreDescriptor} call).
     *
     * ```javascript
     * // insert store6 just before a store having storeId equal to 'foo'
     * crudManager.addStore(store6, 0, 'foo');
     *
     * // insert store7 just after store3 store
     * crudManager.addStore(store7, 1, store3);
     * ```
     */
    addStore(...args) {
        return this.addCrudStore(...args);
    }

    removeStore(...args) {
        return this.removeCrudStore(...args);
    }

    getStore(...args) {
        return this.getCrudStore(...args);
    }

    hasChanges(...args) {
        return this.crudStoreHasChanges(...args);
    }

    loadData(...args) {
        return this.loadCrudManagerData(...args);
    }
}
