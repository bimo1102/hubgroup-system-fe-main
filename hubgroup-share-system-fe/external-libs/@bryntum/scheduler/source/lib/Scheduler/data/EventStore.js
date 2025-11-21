import AjaxStore from '../../Core/data/AjaxStore.js';
import EventStoreMixin from './mixin/EventStoreMixin.js';
import SharedEventStoreMixin from './mixin/SharedEventStoreMixin.js';
import RecurringEventsMixin from './mixin/RecurringEventsMixin.js';
import EventModel from '../model/EventModel.js';
import PartOfProject from './mixin/PartOfProject.js';

import { CoreEventStoreMixin } from '../../Engine/quark/store/CoreEventStoreMixin.js';
import PartOfBaseProject from './mixin/PartOfBaseProject.js';

const EngineMixin = PartOfProject(CoreEventStoreMixin.derive(AjaxStore));

/**
 * @module Scheduler/data/EventStore
 */

/**
 * A store holding all the {@link Scheduler.model.EventModel events} to be rendered into a {@link Scheduler.view.Scheduler Scheduler}.
 *
 * This store only accepts a model class inheriting from {@link Scheduler.model.EventModel}.
 *
 * An EventStore is usually connected to a project, which binds it to other related stores (AssignmentStore,
 * ResourceStore and DependencyStore). The project also handles normalization/calculation of the data on the records in
 * the store. For example if a record is added with a `startDate` and an `endDate`, it will calculate the `duration`.
 *
 * The calculations happens async, records are not guaranteed to have up to date data until they are finished. To be
 * certain that calculations have finished, call `await project.commitAsync()` after store actions. Or use one of the
 * `xxAsync` functions, such as `loadDataAsync()`.
 *
 * Using `commitAsync()`:
 *
 * ```javascript
 * eventStore.data = [{ startDate, endDate }, ...];
 *
 * // duration of the record is not yet calculated
 *
 * await eventStore.project.commitAsync();
 *
 * // now it is
 * ```
 *
 * Using `loadDataAsync()`:
 *
 * ```javascript
 * await eventStore.loadDataAsync([{ startDate, endDate }, ...]);
 *
 * // duration is calculated
 * ```
 *
 * @mixes Scheduler/data/mixin/PartOfProject
 * @mixes Scheduler/data/mixin/SharedEventStoreMixin
 * @mixes Scheduler/data/mixin/EventStoreMixin
 * @mixes Scheduler/data/mixin/RecurringEventsMixin
 * @extends Core/data/AjaxStore
 */
export default class EventStore extends EngineMixin.mixin(SharedEventStoreMixin, RecurringEventsMixin, EventStoreMixin) {

    static get defaultConfig() {
        return {
            /**
             * Class used to represent records
             * @config {Scheduler.model.EventModel}
             * @default
             * @category Common
             */
            modelClass : EventModel
        };
    }
}
