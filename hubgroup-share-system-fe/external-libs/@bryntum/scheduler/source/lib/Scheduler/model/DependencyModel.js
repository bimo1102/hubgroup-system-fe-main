import DependencyBaseModel from './DependencyBaseModel.js';
import PartOfProject from '../data/mixin/PartOfProject.js';

import { CoreDependencyMixin } from '../../Engine/quark/model/scheduler_core/CoreDependencyMixin.js';

const EngineMixin = CoreDependencyMixin;

/**
 * @module Scheduler/model/DependencyModel
 */

/**
 * This model represents a dependency between two events, usually added to a {@link Scheduler.data.DependencyStore}.
 *
 * It is a subclass of the {@link Scheduler.model.DependencyBaseModel} class, which in its turn subclasses
 * {@link Core.data.Model}. Please refer to documentation of those classes to become familiar with the base interface of
 * this class.
 *
 * ## Fields and references
 *
 * A Dependency has a few predefined fields, see Fields below.  The name of any fields data source can be customized in
 * the subclass, see the example below. Please also refer to {@link Core.data.Model} for details.
 *
 * ```javascript
 * class MyDependency extends DependencyModel {
 *   static get fields() {
 *     return [
 *       { name: 'to', dataSource: 'targetId' },
 *       { name: 'from', dataSource: 'sourceId' }
 *     ]);
 *   }
 * }
 * ```
 *
 * After load and project normalization, these references are accessible (assuming their respective stores are loaded):
 * - `fromEvent` - The event on the start side of the dependency
 * - `toEvent` - The event on the end side of the dependency
 *
 * ## Async resolving of references
 *
 * As described above, a dependency has links to events. These references are populated async, using the calculation
 * engine of the project that the resource via its store is a part of. Because of this asyncness, references cannot be
 * used immediately after modifications:
 *
 * ```javascript
 * dependency.from = 2;
 * // dependency.fromEvent is not yet up to date
 * ```
 *
 * To make sure references are updated, wait for calculations to finish:
 *
 * ```javascript
 * dependency.from = 2;
 * await dependency.project.commitAsync();
 * // dependency.fromEvent is up to date
 * ```
 *
 * As an alternative, you can also use `setAsync()` to trigger calculations directly after the change:
 *
 * ```javascript
 * await dependency.setAsync({ from : 2});
 * // dependency.fromEvent is up to date
 * ```
 *
 * @extends Scheduler/model/DependencyBaseModel
 * @uninherit Core/data/mixin/TreeNode
 */
export default class DependencyModel extends PartOfProject(EngineMixin.derive(DependencyBaseModel)) {
    static get $name() {
        return 'DependencyModel';
    }

    // Determines the type of dependency based on fromSide and toSide
    getTypeFromSides(fromSide, toSide, rtl) {
        const
            types     = DependencyBaseModel.Type,
            startSide = rtl ? 'right' : 'left',
            endSide   = rtl ? 'left' : 'right';

        if (fromSide === startSide) {
            return (toSide === startSide) ? types.StartToStart : types.StartToEnd;
        }

        return (toSide === endSide) ? types.EndToEnd : types.EndToStart;
    }
}

DependencyModel.exposeProperties();
