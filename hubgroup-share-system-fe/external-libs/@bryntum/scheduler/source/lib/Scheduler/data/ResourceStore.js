import ResourceStoreMixin from './mixin/ResourceStoreMixin.js';
import ResourceModel from '../model/ResourceModel.js';
import AjaxStore from '../../Core/data/AjaxStore.js';
import PartOfProject from '../data/mixin/PartOfProject.js';

import { CoreResourceStoreMixin } from '../../Engine/quark/store/CoreResourceStoreMixin.js';
import PartOfBaseProject from './mixin/PartOfBaseProject.js';

const EngineMixin = PartOfProject(CoreResourceStoreMixin.derive(AjaxStore));

/**
 * @module Scheduler/data/ResourceStore
 */

/**
 * A store holding all the {@link Scheduler.model.ResourceModel resources} to be rendered into a
 * {@link Scheduler.view.Scheduler Scheduler}.
 *
 * This store only accepts a model class inheriting from {@link Scheduler.model.ResourceModel}.
 *
 * A ResourceStore is usually connected to a project, which binds it to other related stores (EventStore,
 * AssignmentStore and DependencyStore). The project also handles references (assignments, events) to related records
 * for the records in the store.
 *
 * Resolving the references happens async, records are not guaranteed to have up to date references until calculations
 * are finished. To be certain that references are resolved, call `await project.commitAsync()` after store actions. Or
 * use one of the `xxAsync` functions, such as `loadDataAsync()`.
 *
 * Using `commitAsync()`:
 *
 * ```javascript
 * resourceStore.data = [{ id }, ...];
 *
 * // references (assignments, events) not resolved yet
 *
 * await resourceStore.project.commitAsync();
 *
 * // now they are
 * ```
 *
 * Using `loadDataAsync()`:
 *
 * ```javascript
 * await resourceStore.loadDataAsync([{ id }, ...]);
 *
 * // references (assignments, events) are resolved
 * ```
 *
 * @mixes Scheduler/data/mixin/PartOfProject
 * @mixes Scheduler/data/mixin/ResourceStoreMixin
 * @extends Core/data/AjaxStore
 */
export default class ResourceStore extends ResourceStoreMixin(EngineMixin) {

    static get defaultConfig() {
        return {
            modelClass : ResourceModel
        };
    }

}
