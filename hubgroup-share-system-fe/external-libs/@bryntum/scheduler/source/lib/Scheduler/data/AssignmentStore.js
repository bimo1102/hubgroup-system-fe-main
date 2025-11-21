import AjaxStore from '../../Core/data/AjaxStore.js';
import AssignmentModel from '../model/AssignmentModel.js';
import PartOfProject from './mixin/PartOfProject.js';
import PartOfBaseProject from './mixin/PartOfBaseProject.js';
import AssignmentStoreMixin from './mixin/AssignmentStoreMixin.js';

import { CoreAssignmentStoreMixin } from '../../Engine/quark/store/CoreAssignmentStoreMixin.js';

const EngineMixin = PartOfProject(CoreAssignmentStoreMixin.derive(AjaxStore));

/**
 * @module Scheduler/data/AssignmentStore
 */

/**
 * A store representing a collection of assignments between events in the {@link Scheduler.data.EventStore} and resources
 * in the {@link Scheduler.data.ResourceStore}.
 *
 * This store only accepts a model class inheriting from {@link Scheduler.model.AssignmentModel}.
 *
 * An AssignmentStore is usually connected to a project, which binds it to other related stores (EventStore,
 * ResourceStore and DependencyStore). The project also handles references (event, resource) to related records for the
 * records in the store.
 *
 * Resolving the references happens async, records are not guaranteed to have up to date references until calculations
 * are finished. To be certain that references are resolved, call `await project.commitAsync()` after store actions. Or
 * use one of the `xxAsync` functions, such as `loadDataAsync()`.
 *
 * Using `commitAsync()`:
 *
 * ```javascript
 * assignmentStore.data = [{ eventId, resourceId }, ...];
 *
 * // references (event, resource) not resolved yet
 *
 * await assignmentStore.project.commitAsync();
 *
 * // now they are
 * ```
 *
 * Using `loadDataAsync()`:
 *
 * ```javascript
 * await assignmentStore.loadDataAsync([{ eventId, resourceId }, ...]);
 *
 * // references (event, resource) are resolved
 * ```
 *
 * @mixes Scheduler/data/mixin/AssignmentStoreMixin
 * @mixes Scheduler/data/mixin/PartOfProject
 * @extends Core/data/AjaxStore
 */
export default class AssignmentStore extends AssignmentStoreMixin(EngineMixin) {

    static get defaultConfig() {
        return {
            modelClass : AssignmentModel
        };
    }

}
