import AjaxStore from '../../Core/data/AjaxStore.js';
import DependencyModel from '../model/DependencyModel.js';
import PartOfProject from './mixin/PartOfProject.js';
import DependencyStoreMixin from './mixin/DependencyStoreMixin.js';

import { CoreDependencyStoreMixin } from '../../Engine/quark/store/CoreDependencyStoreMixin.js';
import PartOfBaseProject from './mixin/PartOfBaseProject.js';

const EngineMixin = PartOfProject(CoreDependencyStoreMixin.derive(AjaxStore));

/**
 * @module Scheduler/data/DependencyStore
 */

/**
 * A store representing a collection of dependencies between events in the {@link Scheduler.data.EventStore}.
 *
 * This store only accepts a model class inheriting from {@link Scheduler.model.DependencyModel}.
 *
 * A DependencyStore is usually connected to a project, which binds it to other related stores (EventStore,
 * AssignmentStore and ResourceStore). The project also handles references (fromEvent, toEvent) to related records
 * for the records in the store.
 *
 * Resolving the references happens async, records are not guaranteed to have up to date references until calculations
 * are finished. To be certain that references are resolved, call `await project.commitAsync()` after store actions. Or
 * use one of the `xxAsync` functions, such as `loadDataAsync()`.
 *
 * Using `commitAsync()`:
 *
 * ```javascript
 * dependencyStore.data = [{ from, to }, ...];
 *
 * // references (fromEvent, toEvent) not resolved yet
 *
 * await dependencyStore.project.commitAsync();
 *
 * // now they are
 * ```
 *
 * Using `loadDataAsync()`:
 *
 * ```javascript
 * await dependencyStore.loadDataAsync([{ from, to }, ...]);
 *
 * // references (fromEvent, toEvent) are resolved
 * ```
 *
 * @mixes Scheduler/data/mixin/PartOfProject
 * @mixes Scheduler/data/mixin/DependencyStoreMixin
 * @extends Core/data/AjaxStore
 */
export default class DependencyStore extends DependencyStoreMixin(EngineMixin.derive(AjaxStore)) {

    static get defaultConfig() {
        return {
            modelClass : DependencyModel
        };
    }

}
