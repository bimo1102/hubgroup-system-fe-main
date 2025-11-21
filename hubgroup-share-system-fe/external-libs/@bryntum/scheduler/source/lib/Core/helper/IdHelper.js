import ObjectHelper from './ObjectHelper.js';
import BrowserHelper from './BrowserHelper.js';

/**
 * @module Core/helper/IdHelper
 */

// Id generation should be on a per page basis, not per module
const idCounts = ObjectHelper.getPathDefault(BrowserHelper.global, 'bryntum.idCounts', Object.create(null));

/**
 * IdHelper provides unique ID generation.
 *
 * This class is not intended for application use, it is used internally by the Bryntum infrastructure.
 * @internal
 */
export default class IdHelper {
    /**
     * Generate a new id, using IdHelpers internal counter and a prefix
     * @param {String} prefix Id prefix
     * @returns {String} Generated id
     */
    static generateId(prefix = 'generatedId') {
        // This produces "b-foo-1, b-foo-2, ..." for each prefix independently of the others. In other words, it makes
        // id's more stable since the counter is on a per-class basis.
        return prefix + (idCounts[prefix] = (idCounts[prefix] || 0) + 1);
    }
}
