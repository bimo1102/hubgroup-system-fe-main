import Model from '../../Core/data/Model.js';
import PartOfProject from '../data/mixin/PartOfProject.js';
import AssignmentModelMixin from './mixin/AssignmentModelMixin.js';

import { CoreAssignmentMixin } from '../../Engine/quark/model/scheduler_core/CoreAssignmentMixin.js';

const EngineMixin = CoreAssignmentMixin;

/**
 * @module Scheduler/model/AssignmentModel
 */

/**
 * This model represent a single assignment of a resource to an event in scheduler, usually added to a
 * {@link Scheduler.data.AssignmentStore}.
 *
 * It is a subclass of {@link Core.data.Model} class. Please refer to the documentation for that class to become
 * familiar with the base interface of this class.
 *
 * ## Fields and references
 *
 * An Assignment has the following fields:
 * - `id` - The id of the assignment
 * - `resourceId` - The id of the resource assigned (optionally replaced with `resource` for load)
 * - `eventId` - The id of the event to which the resource is assigned (optionally replaced with `event` for load)
 *
 * The data source for these fields can be customized by subclassing this class:
 *
 * ```javascript
 * class MyAssignment extends AssignmentModel {
 *   static get fields() {
 *       return [
 *          { name : 'resourceId', dataSource : 'linkedResource' }
 *       ];
 *   }
 * }
 * ```
 *
 * After load and project normalization, these references are accessible (assuming their respective stores are loaded):
 * - `event` - The linked event record
 * - `resource` - The linked resource record
 *
 * ## Async resolving of references
 *
 * As described above, an assignment links an event to a resource. It holds references to an event record and a resource
 * record. These references are populated async, using the calculation engine of the project that the assignment via
 * its store is a part of. Because of this asyncness, references cannot be used immediately after modifications:
 *
 * ```javascript
 * assignment.resourceId = 2;
 * // assignment.resource is not yet available
 * ```
 *
 * To make sure references are updated, wait for calculations to finish:
 *
 * ```javascript
 * assignment.resourceId = 2;
 * await assignment.project.commitAsync();
 * // assignment.resource is available
 * ```
 *
 * As an alternative, you can also use `setAsync()` to trigger calculations directly after the change:
 *
 * ```javascript
 * await assignment.setAsync({ resourceId : 2});
 * // assignment.resource is available
 * ```
 *
 * @extends Core/data/Model
 * @mixes Scheduler/model/mixin/AssignmentModelMixin
 * @uninherit Core/data/mixin/TreeNode
 */
export default class AssignmentModel extends AssignmentModelMixin(PartOfProject(EngineMixin.derive(Model))) {
    static get $name() {
        return 'AssignmentModel';
    }
}

AssignmentModel.exposeProperties();
