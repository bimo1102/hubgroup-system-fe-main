import Base from '../../Base.js';
import BrowserHelper from '../../helper/BrowserHelper.js';
import StringHelper from '../../helper/StringHelper.js';

/**
 * @module Core/data/mixin/StoreProxy
 */

/**
 * Object-like interaction with a Store by using a Proxy. To enable, configure the store with `objectify : true`.
 *
 * ```javascript
 * const store = new Store({
 *    objectify : true,
 *    data      : [
 *        { id : 'batman', name : 'Bruce' }
 *    ]
 * });
 * ```
 *
 * Access records using their ids as Store properties:
 * ```javascript
 * console.log(store.batman.name); // logs Bruce
 * ```
 *
 * Add records by assigning properties to the Store:
 * ```javascript
 * store.superman = { name : 'Clark' }; // Id will be 'superman'
 * ```
 *
 * Remove records by removing their property:
 * ```javascript
 * delete store.batman;
 * ```
 *
 * Check if a certain id existing in the store by using `in`:
 * ```javascript
 * console.log('superman' in store): // logs true
 * ```
 *
 * Please note that this approach:
 * * Will affect performance slightly, not recommended for larger datasets.
 * * Uses native Proxy, which cannot be polyfilled. Not possible to get it working in IE11.
 * * Preserves predefined Store properties, records cannot use ids that match those.
 * * Might have other limitations preventing the use of it in some scenarios where a normal Store can be used.
 *
 * @mixin
 */
export default Target => class StoreProxy extends (Target || Base) {

    static get configurable() {
        return {
            /**
             * Allow object like interaction with the Store. For example:
             *
             * ```javascript
             * const store = new Store({
             *    objectify : true,
             *    data      : [
             *        { id : 'batman', name : 'Bruce' }
             *    ]
             * });
             *
             * // retrieve using id as property
             * const record = store.batman;
             *
             * // add as property
             * store.superman = { name : 'Clark' };
             *
             * // delete to remove
             * delete store.batman;
             * ``
             *
             * @config {Boolean}
             * @default false
             */
            objectify : null
        };
    }

    initProxy() {
        if (!BrowserHelper.global.Proxy) {
            throw new Error('Proxy not supported');
        }

        const proxy = new Proxy(this, {
            // Support getting records using `store[id/index]
            get(target, property) {
                // Stores own properties take precedence
                if (property in target) {
                    return target[property];
                }

                // To allow accessing the underlying store
                if (property === '$store') {
                    return target;
                }

                // Then ids
                let record = target.getById(property);

                // And finally index
                if (!record && !isNaN(parseInt(property))) {
                    record = target.getAt(parseInt(property));
                }

                return record;
            },

            // Support adding/replacing records using `store.id = { ...data }`
            set(target, property, value) {
                // Pass through when using names of existing properties or when destroyed/ing
                if (property in target || target.isDestroying) {
                    target[property] = value;
                }
                // Otherwise add/replace a record
                else {
                    target.add({ [target.modelClass.idField] : property, ...value });
                }

                return true;
            },

            // Support deleting records using `delete store.id`
            deleteProperty(target, property) {
                // Properties are deleted on destroy
                if (target.isDestroying) {
                    delete target[property];
                    return true;
                }

                return Boolean(target.remove(property).length);
            },

            // Support `id in store`
            has(target, property) {
                // Actual property
                if (property in target) {
                    return true;
                }

                // Threat { ... } as JSON representation of a record (likely from toString())
                if (property.startsWith('{') && property.endsWith('}')) {
                    const data = StringHelper.safeJsonParse(property);
                    property = data?.id;
                }

                return target.includes(property);
            }

        });

        return proxy;
    }

};
