import DataField from './DataField.js';

/**
 * @module Core/data/field/ArrayDataField
 */

/**
 * This field class handles fields that hold an array. For the field to count as modified, the whole array has to be
 * replaced:
 *
 * ```javascript
 * class Task extends Model {
 *     static get fields() {
 *         return [
 *             'name',
 *             { name : 'todo', type : 'array' }
 *         ];
 *     }
 * }
 *
 * const task = new Task({
 *     name : 'Task 1',
 *     todo : [
 *         { text : 'Something', done : false },
 *         { text : 'Some other thing', done : true }
 *     ]
 * };
 *
 * // This wont be detected as a modification
 * task.todo[0].done = true;
 * // task.isModified === false
 *
 * // But this will
 * const todo = task.todo.slice(); // Create a new array with same contents
 * todo[0].done = true;
 * task.todo = todo;
 * // task.isModified === true
 * ```
 *
 * @extends Core/data/field/DataField
 * @classtype array
 */
export default class ArrayDataField extends DataField {
    static get $name() {
        return 'ArrayDataField';
    }

    static get type() {
        return 'array';
    }

    isEqual(a, b) {
        return a === b;
    }
}

ArrayDataField.initClass();
