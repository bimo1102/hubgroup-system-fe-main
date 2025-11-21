import VersionHelper from '../../Core/helper/VersionHelper.js';
import BrowserHelper from '../../Core/helper/BrowserHelper.js';
import ProjectModelMixin from './mixin/ProjectModelMixin.js';
import ModelPersistencyManager from '../data/util/ModelPersistencyManager.js';

import { SchedulerCoreProjectMixin } from '../../Engine/quark/model/scheduler_core/SchedulerCoreProjectMixin.js';

const EngineMixin = SchedulerCoreProjectMixin;

/**
 * @module Scheduler/model/ProjectModel
 */

/**
 * This class represents a global project of your Scheduler - a central place for all data.
 *
 * It holds and links the stores usually used by Scheduler:
 *
 * - {@link Scheduler.data.EventStore}
 * - {@link Scheduler.data.ResourceStore}
 * - {@link Scheduler.data.AssignmentStore}
 * - {@link Scheduler.data.DependencyStore}
 * - {@link #config-timeRangeStore TimeRangeStore}
 * - {@link Scheduler.data.ResourceTimeRangeStore}
 *
 * The project uses a calculation engine to normalize dates and durations. It is also responsible for
 * handling references between models, for example to link an event via an assignment to a resource. These operations
 * are asynchronous, a fact that is hidden when working in the Scheduler UI but which you must know about when performing
 * more advanced operations on the data level.
 *
 * When there is a change to data that requires something else to be recalculated, the project schedules a calculation (a
 * commit) which happens moments later. It is also possible to trigger these calculations directly. This snippet illustrate
 * the process:
 *
 1. Something changes which requires the project to recalculate, for example adding a new task:
 *
 * ```javascript
 * const [event] = project.eventStore.add({ startDate, endDate });
 * ```
 *
 * 2. A recalculation is scheduled, thus:
 *
 * ```javascript
 * event.duration; // <- Not yet calculated
 * ```
 *
 * 3. Calculate now instead of waiting for the scheduled calculation
 *
 * ```javascript
 * await project.commitAsync();
 *
 * event.duration; // <- Now available
 * ```
 *
 * ## Using inline data
 *
 * The project provides settable property {@link Scheduler.crud.AbstractCrudManager#property-inlineData} that can
 * be used to get data from all its stores at once and to set this data as well. Populating the stores this way can
 * be useful if you cannot or you do not want to use CrudManager for server requests but you pull the data by other
 * means and have it ready outside of ProjectModel. Also, the data from all stores is available in a single
 * assignment statement.
 *
 * ### Getting data
 * ```javascript
 * const data = scheduler.project.inlineData;
 *
 * // use the data in your application
 * ```
 *
 * ### Setting data
 * ```javascript
 * const data = // your function to pull server data
 *
 * scheduler.project = data;
 * ```
 *
 * ## Built in StateTrackingManager
 *
 * The project also has a built in {@link Core.data.stm.StateTrackingManager StateTrackingManager} (STM for short), that
 * handles undo/redo for the project stores (additional stores can also be added). You can enable it to track all
 * project store changes:
 *
 * ```javascript
 * // Turn on auto recording when you create your Scheduler:
 * const scheduler = new Scheduler({
 *    project : {
 *        stm : {
 *            autoRecord : true
 *        }
 *    }
 * });
 *
 * // Undo a transaction
 * project.stm.undo();
 *
 * // Redo
 * project.stm.redo();
 * ```
 *
 * Check out the `undoredo` demo to see it in action.
 *
 * @extends Core/data/Model
 * @mixes Scheduler/model/mixin/ProjectModelMixin
 * @uninherit Core/data/mixin/TreeNode
 */
export default class ProjectModel extends ProjectModelMixin(EngineMixin) {
    static get $name() {
        return 'ProjectModel';
    }

    /**
     * Silences propagations caused by the project loading.
     *
     * Applying the loaded data to the project occurs in two basic stages:
     *
     * 1. Data gets into the engine graph which triggers changes propagation
     * 2. The changes caused by the propagation get written to related stores
     *
     * Setting this flag to `true` makes the component perform step 2 silently without triggering events causing reactions on those changes
     * (like sending changes back to the server if `autoSync` is enabled) and keeping stores in unmodified state.
     *
     * This is safe if the loaded data is consistent so propagation doesn't really do any adjustments.
     * By default the system treats the data as consistent so this option is `true`.
     *
     * ```js
     * new Scheduler({
     *     project : {
     *         // We want scheduling engine to recalculate the data properly
     *         // so then we could save it back to the server
     *         silenceInitialCommit : false
     *     }
     *     ...
     * })
     * ```
     *
     * @config {Boolean} silenceInitialCommit
     * @default true
     */

    construct(...args) {
        super.construct(...args);

        if (VersionHelper.isTestEnv) {
            BrowserHelper.global.bryntum.testProject = this;
        }

        // Moved here from EventStore, since project is now the container instead of it
        this.modelPersistencyManager = this.createModelPersistencyManager();
    }

    /**
     * Creates and returns model persistency manager
     *
     * @return {Scheduler.data.util.ModelPersistencyManager}
     * @internal
     */
    createModelPersistencyManager() {
        return new ModelPersistencyManager({
            eventStore      : this,
            resourceStore   : this.resourceStore,
            assignmentStore : this.assignmentStore,
            dependencyStore : this.dependencyStore
        });
    }

    doDestroy() {
        this.modelPersistencyManager.destroy();
        super.doDestroy();
    }

    // To comply with TaskBoards expectations
    get taskStore() {
        return this.eventStore;
    }
}

ProjectModel.applyConfigs = true;
