import Base from '../../../Core/Base.js';

/**
 * @module Scheduler/data/mixin/ResourceStoreMixin
 */

/**
 * This is a mixin for the ResourceStore functionality. It is consumed by the {@link Scheduler.data.ResourceStore}.
 *
 * @mixin
 */
export default Target => class ResourceStoreMixin extends (Target || Base) {
    static get $name() {
        return 'ResourceStoreMixin';
    }

    get isResourceStore() {
        return true;
    }

    /**
     * Add resources to the store.
     *
     * NOTE: References (events, assignments) on the resources are determined async by a calculation engine. Thus they
     * cannot be directly accessed after using this function.
     *
     * For example:
     *
     * ```javascript
     * const [resource] = resourceStore.add({ id });
     * // resource.events is not yet available
     * ```
     *
     * To guarantee references are set up, wait for calculations for finish:
     *
     * ```javascript
     * const [resource] = resourceStore.add({ id });
     * await resourceStore.project.commitAsync();
     * // resource.events is available (assuming EventStore is loaded and so on)
     * ```
     *
     * Alternatively use `addAsync()` instead:
     *
     * ```javascript
     * const [resource] = await resourceStore.addAsync({ id });
     * // resource.events is available (assuming EventStore is loaded and so on)
     * ```
     *
     * @param {Scheduler.model.ResourceModel|Scheduler.model.ResourceModel[]|Object|Object[]} records
     * Array of records/data or a single record/data to add to store
     * @param {Boolean} [silent] Specify `true` to suppress events
     * @returns {Scheduler.model.ResourceModel[]} Added records
     * @function add
     * @category CRUD
     */

    /**
     * Add resources to the store and triggers calculations directly after. Await this function to have up to date
     * references on the added resources.
     *
     * ```javascript
     * const [resource] = await resourceStore.addAsync({ id });
     * // resource.events is available (assuming EventStore is loaded and so on)
     * ```
     *
     * @param {Scheduler.model.ResourceModel|Scheduler.model.ResourceModel[]|Object|Object[]} records
     * Array of records/data or a single record/data to add to store
     * @param {Boolean} [silent] Specify `true` to suppress events
     * @returns {Scheduler.model.ResourceModel[]} Added records
     * @function addAsync
     * @category CRUD
     * @async
     */

    /**
     * Applies a new dataset to the ResourceStore. Use it to plug externally fetched data into the store.
     *
     * NOTE: References (events, assignments) on the resources are determined async by a calculation engine. Thus
     * they cannot be directly accessed after assigning the new dataset.
     *
     * For example:
     *
     * ```javascript
     * resourceStore.data = [{ id }];
     * // resourceStore.first.events is not yet available
     * ```
     *
     * To guarantee references are available, wait for calculations for finish:
     *
     * ```javascript
     * resourceStore.data = [{ id }];
     * await resourceStore.project.commitAsync();
     * // resourceStore.first.events is available
     * ```
     *
     * Alternatively use `loadDataAsync()` instead:
     *
     * ```javascript
     * await resourceStore.loadDataAsync([{ id }]);
     * // resourceStore.first.events is available
     * ```
     *
     * @member {Object[]} data
     * @category Records
     */

    /**
     * Applies a new dataset to the ResourceStore and triggers calculations directly after. Use it to plug externally
     * fetched data into the store.
     *
     * ```javascript
     * await resourceStore.loadDataAsync([{ id }]);
     * // resourceStore.first.events is available
     * ```
     *
     * @param {Object[]} data Array of ResourceModel data objects
     * @function loadDataAsync
     * @category CRUD
     * @async
     */

    static get defaultConfig() {
        return {
            /**
             * CrudManager must load stores in the correct order. Lowest first.
             * @private
             */
            loadPriority : 200,
            /**
             * CrudManager must sync stores in the correct order. Lowest first.
             * @private
             */
            syncPriority : 100,
            storeId      : 'resources',
            autoTree     : true
        };
    }

    construct(config) {
        super.construct(config);

        if (!this.modelClass.isResourceModel) {
            throw new Error('Model for ResourceStore must subclass ResourceModel');
        }
    }

    removeAll() {
        const result = super.removeAll(...arguments);

        // Removing all resources removes all assignments
        result && this.assignmentStore.removeAll();

        return result;
    }

    // Apply id changes also to assignments (used to be handled automatically by relations earlier, but engine does not
    // care about ids so needed now)
    // problems:
    // 1. orientation/HorizontalRendering listens to assignment store changes and is trying to refresh view
    // When we update resource id on assignment, listener will be invoked and view will try to refresh. And it will
    // fail, because row is not updated yet. Flag is raised on resource store to make HorizontalRendering to skip
    // refreshing view in this particular case of resource id changing
    onRecordIdChange({ record, oldValue, value }) {
        super.onRecordIdChange({ record, oldValue, value });

        if (record.isFieldModified('id')) {
            this.isChangingId = true;

            record.updateAssignmentResourceIds();

            this.isChangingId = false;
        }
    }
};
