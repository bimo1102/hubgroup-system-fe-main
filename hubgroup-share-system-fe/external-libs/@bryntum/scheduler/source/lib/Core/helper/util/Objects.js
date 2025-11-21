// IMPORTANT - adding imports here can create problems for Base class
//  That is why this file was split from ObjectHelper

import StringHelper from '../StringHelper.js';

const
    { toString } = Object.prototype,
    { isFrozen } = Object,
    afterRe      = /\s*<\s*/,
    beforeRe     = /\s*>\s*/,
    blendOptions = {},
    typeNameRe   = /\[object ([^\]]+)]/,
    typeCache    = {},
    emptyObject  = Object.freeze({});

/**
 * @module Core/helper/util/Objects
 */

// Static methods are not displayed in derived class documentation. Therefore, since this is an internal class, the
// work around is to copy method documentation to ObjectHelper (the public interface). Also tried making ObjectHelper
// a singleton.

/**
 * Helper for low-level Object manipulation.
 *
 * While documented on {@link Core.helper.ObjectHelper}, the following static methods are implemented by this class:
 *
 * - `{@link Core.helper.ObjectHelper#function-assign-static}`
 * - `{@link Core.helper.ObjectHelper#function-assignIf-static}`
 * - `{@link Core.helper.ObjectHelper#function-clone-static}`
 * - `{@link Core.helper.ObjectHelper#function-createTruthyKeys-static}`
 * - `{@link Core.helper.ObjectHelper#function-getPath-static}`
 * - `{@link Core.helper.ObjectHelper#function-getTruthyKeys-static}`
 * - `{@link Core.helper.ObjectHelper#function-getTruthyValues-static}`
 * - `{@link Core.helper.ObjectHelper#function-isEmpty-static}`
 * - `{@link Core.helper.ObjectHelper#function-isObject-static}`
 * - `{@link Core.helper.ObjectHelper#function-merge-static}`
 * - `{@link Core.helper.ObjectHelper#function-setPath-static}`
 * - `{@link Core.helper.ObjectHelper#function-typeOf-static}`
 * @internal
 */
export default class Objects {
    static assign(dest, ...sources) {
        for (let source, key, i = 0; i < sources.length; i++) {
            source = sources[i];

            if (source) {
                for (key in source) {
                    dest[key] = source[key];
                }
            }
        }

        return dest;
    }

    static assignIf(dest, ...sources) {
        for (let source, key, i = 0; i < sources.length; i++) {
            source = sources[i];

            if (source) {
                for (key in source) {
                    if (!(key in dest) || dest[key] === undefined) {
                        dest[key] = source[key];
                    }
                }
            }
        }

        return dest;
    }

    static blend(dest, source, options) {
        options = options || blendOptions;
        dest = dest || {};

        const { clone = Objects.clone, merge = Objects.blend } = options;

        if (Array.isArray(source)) {
            if (source.length > 1) {
                source.forEach(s => {
                    dest = Objects.blend(dest, s, options);
                });

                return dest;
            }

            source = source[0];
        }

        if (source) {
            let destValue, key, value;

            for (key in source) {
                value = source[key];

                if (value && O.isObject(value)) {
                    destValue = dest[key];
                    options.key = key;

                    if (destValue && O.isObject(destValue)) {
                        if (isFrozen(destValue)) {
                            dest[key] = destValue = clone(destValue, options);
                        }

                        value = merge(destValue, value, options);
                    }
                    else {
                        // We don't need to clone frozen objects, but we do clone mutable objects as they get
                        // applied to the dest.
                        value = isFrozen(value) ? value : clone(value, options);
                    }
                }

                dest[key] = value;
            }
        }

        return dest;
    }

    static clone(value, handler) {
        let cloned = value,
            key;

        if (value && typeof value === 'object') {
            const options = handler && typeof handler === 'object' && handler;

            if (options) {
                // When using blend(), the 2nd argument is the options object, so ignore that case
                handler = null;
            }

            if (O.isObject(value)) {
                cloned = {};

                for (key in value) {
                    cloned[key] = O.clone(value[key]);
                }
            }
            else if (Array.isArray(value)) {
                cloned = [];

                // Loop backwards to:
                //  1. read source.length once
                //  2. get result array sized on first pass (avoid growing)
                for (key = value.length; key-- > 0; /* empty */) {
                    cloned[key] = O.clone(value[key]);
                }
            }
            else if (O.isDate(value)) {
                cloned = new Date(value.getTime());
            }
            else if (handler) {
                // Allow other types to be handled (e.g., DOM nodes).
                cloned = handler(value);
            }
        }

        return cloned;
    }

    static createTruthyKeys(source) {
        const
            keys = StringHelper.split(source),
            result = keys && {};

        if (keys) {
            for (const key of keys) {
                // StringHelper.split won't return empty keys if passed a string, but we
                // could have been passed a String[]
                if (key) {
                    result[key] = true;
                }
            }
        }

        return result;
    }

    /**
     * Returns value for a given path in the object
     * @param {Object} object Object to check path on
     * @param {String} path Dot-separated path, e.g. 'object.childObject.someKey'
     * @returns {*} Value associated with passed key
     */
    static getPath(object, path) {
        return path.split('.').reduce((result, key) => {
            return (result || emptyObject)[key];
        }, object);
    }

    /**
     * Returns value for a given path in the object, placing a passed default value in at the
     * leaf property and filling in undefined properties all the way down.
     * @param {Object} object Object to get path value for.
     * @param {String|Number|String[]|Number[]} path Dot-separated path, e.g. 'firstChild.childObject.someKey',
     * or the key path as an array, e.g. ['firstChild', 'childObject', 'someKey'].
     * @param {*} [defaultValue] Optionally the value to put in as the `someKey` property.
     * @returns {*} Value at the leaf position of the path.
     */
    static getPathDefault(object, path, defaultValue) {
        const
            keys   = Array.isArray(path) ? path : typeof path === 'string' ? path.split('.') : [path],
            length = keys.length - 1;

        return keys.reduce((result, key, index) => {
            if (defaultValue && !(key in result)) {
                // Can't use emptyObject here, we are creating a node in the object tree
                result[key] = index === length ? defaultValue : {};
            }

            return (result || emptyObject)[key];
        }, object);
    }

    /**
     * Determines if the specified path exists
     * @param {Object} object Object to check path on
     * @param {String} path Dot-separated path, e.g. 'object.childObject.someKey'
     * @returns {Boolean}
     */
    static hasPath(object, path) {
        return path.split('.').every(key => {
            if (key in object) {
                object = object[key];
                return true;
            }
            return false;
        });
    }

    static getTruthyKeys(source) {
        const keys = [];

        for (const key in source) {
            if (source[key]) {
                keys.push(key);
            }
        }

        return keys;
    }

    static getTruthyValues(source) {
        const values = [];

        for (const key in source) {
            if (source[key]) {
                values.push(source[key]);
            }
        }

        return values;
    }

    static isClass(object) {
        if (typeof object === 'function' && object.prototype?.constructor === object) {
            // TODO find a way to differentiate function(){} from class{}
            return true;
        }

        return false;
    }

    static isDate(object) {
        // A couple quick rejections but only sure way is typeOf:
        return Boolean(object && object.getUTCDate) && O.typeOf(object) === 'date';
    }

    /**
     * Check if passed object is a Promise or contains `then` method.
     * Used to fix problems with detecting promises in code with `instance of Promise` when
     * Promise class is replaced with any other implementation like `ZoneAwarePromise` in Angular.
     * Related to these issues:
     * https://github.com/bryntum/support/issues/791
     * https://github.com/bryntum/support/issues/2990
     *
     * @param {Object} object object to check
     * @returns {Boolean} truthy value if object is a Promise
     * @internal
     */
    static isPromise(object) {
        if (Promise && Promise.resolve) {
            return Promise.resolve(object) === object || typeof object?.then === 'function';
        }
        throw new Error('Promise not supported in your environment');
    }

    static isEmpty(object) {
        if (object && typeof object === 'object') {
            // eslint-disable-next-line no-unreachable-loop
            for (const p in object) { // eslint-disable-line no-unused-vars
                return false;
            }
        }

        return true;
    }

    static isObject(value) {
        const C = value?.constructor;

        return Boolean(C
            // Most things have a .constructor property
            ? (
                // An in-frame instance of Object
                C === Object ||
                // Detect cross-frame objects, but exclude instance of custom classes named Object. typeOf(value) is
                // "object" even for instances of a class and typeOf(C) is "function" for all constructors. We'll have
                // to settle for relying on the fact that getPrototypeOf(Object.prototype) === null.
                // NOTE: this issue does come up in Scheduler unit tests at least.
                // NOTE: IE11 does not have C.name === 'Object' for cross-frame objects! So instead of that check we
                //  do a presence check for a method unlikely to be found elsewhere.
                (C.getPrototypeOf && C.prototype && !Object.getPrototypeOf(C.prototype))
            )
            // Since all classes have a constructor property, an object w/o one is likely from Object.create(null). Of
            // course, primitive types do not have ".constructor"
            : (value && typeof value === 'object')
        );
    }

    static isInstantiated(object) {
        return object ? typeof object === 'object' && !Objects.isObject(object) : false;
    }

    static merge(dest, ...sources) {
        return Objects.blend(dest, sources);
    }

    /**
     * Merges two "items" objects. An items object is a simple object whose keys act as identifiers and whose values
     * are "item" objects. An item can be any object type. This method is used to merge such objects while maintaining
     * their property order. Special key syntax is used to allow a source object to insert a key before or after a key
     * in the `dest` object.
     *
     * For example:
     * ```javascript
     *  let dest = {
     *      foo : {},
     *      bar : {},
     *      fiz : {}
     *  }
     *
     *  console.log(Object.keys(dest));
     *  > ["foo", "bar", "fiz"]
     *
     *  dest = mergeItems(dest, {
     *      'zip > bar' : {}    // insert "zip" before "bar"
     *      'bar < zap' : {}    // insert "zap" after "bar"
     *  });
     *
     *  console.log(Object.keys(dest));
     *  > ["foo", "zip", "bar", "zap", "fiz"]
     * ```
     *
     * @param {Object} dest The destination object.
     * @param {Object|Object[]} src The source object or array of source objects to merge into `dest`.
     * @param {Object} [options] The function to use to merge items.
     * @param {Function} [options.merge] The function to use to merge items.
     * @returns {Object} The merged object. On ES6 standard browsers, this will be the `dest` object. On IE11 it will
     * be a new object.
     * @internal
     */
    static mergeItems(dest, src, options) {
        options = options || blendOptions;

        let anchor, delta, index, indexMap, key, shuffle, srcVal;

        const { merge = Objects.blend, rebuild = !Objects.ES6_OBJECT_ORDER } = options;
        dest = dest || {};

        if (Array.isArray(src)) {
            src.forEach(s => {
                dest = Objects.mergeItems(dest, s, options);
            });
        }
        else if (src) {
            // https://2ality.com/2015/10/property-traversal-order-es6.html
            // Bottom line: Object keys are iterated in declared/insertion order... unless the key is an integer or
            // Symbol, but we don't care about those generally.
            for (key in src) {
                srcVal = src[key];
                anchor = null;

                // Allow a key to be added before or after another:
                //
                //  {
                //      'foo > bar' : {
                //          ...
                //      },
                //      'bar < derp' : {
                //          ...
                //      }
                //  }
                //
                // The goal above is to add a 'foo' key before the existing 'bar' key while adding a 'derp' key after
                // 'bar'.

                if (key.includes('>')) {
                    [key, anchor] = key.split(beforeRe);
                    delta = 0;
                }
                else if (key.includes('<')) {
                    [anchor, key] = key.split(afterRe);
                    delta = 1;
                }

                if (key in dest) {
                    // Changing the value of a key does not change its iteration order. Since "key in dest" we can do
                    // what we need directly.
                    if (srcVal && dest[key] && merge) {
                        options.key = key;
                        srcVal = merge(dest[key], srcVal, options);
                    }

                    dest[key] = srcVal;
                }
                else if (!anchor) {
                    dest[key] = srcVal;
                    indexMap?.set(key, indexMap.size);
                }
                else {
                    // Lazily sprout the item index map. When we first merge an item into an items object, we create this
                    // Map to control the ordering. This is because any keys we add would necessarily be iterated after
                    // the original properties.
                    if (!indexMap) {
                        indexMap = new Map();
                        index = 0;

                        for (const k in dest) {
                            indexMap.set(k, index++);
                        }
                    }

                    index = indexMap.get(anchor);
                    dest[key] = srcVal;

                    if (index == null && delta) {
                        index = indexMap.size;
                    }
                    else {
                        shuffle = !rebuild && (shuffle || []);
                        index = (index || 0) + delta;

                        // Adjust all key indices >= index up by 1 to maintain integer indices (required by the above
                        // use case).
                        for (const item of indexMap) {
                            const [k, v] = item;

                            if (index <= v) {
                                /*
                                Consider object w/the following order:
                                    {
                                        foo : {}',
                                        bar : {},
                                        baz : {},
                                        zip : {},
                                        goo : {},
                                        fiz : {}
                                    }

                                The indexMap is:

                                    foo : 0
                                    bar : 1
                                    baz : 2
                                    zip : 3
                                    goo : 4
                                    fiz : 5

                                To insert before goo, we populate shuffle thusly (to set up for popping):

                                    +-----+-----+
                                    | fiz | goo |
                                    +-----+-----+
                                      0        1
                                      =6-5-1   =6-4-1
                                */
                                shuffle && (shuffle[indexMap.size - v - 1] = k);

                                indexMap.set(k, v + 1);
                            }
                        }

                        // Delete and re-add the keys that should follow the new key to establish the iteration order
                        // we need:
                        if (shuffle) {
                            while (shuffle.length) {
                                const
                                    k = shuffle.pop(),
                                    v = dest[k];

                                delete dest[k];
                                dest[k] = v;
                            }
                        }
                    }

                    indexMap.set(key, index);
                }
            }

            // IE11 does not fully support the ES6 object order standard. Fortunately, it does support the most
            // basic form of building an object from key/values in the desired order. The behavior observed for IE11
            // is that when a key is deleted and put back, it retains its original position instead of becoming the
            // last key.
            if (rebuild && indexMap) {
                const
                    entries = Array.from(indexMap.entries()).sort((a, b) => a[1] - b[1]),
                    old = dest;

                dest = {};

                for (let k, i = 0; i < entries.length; ++i) {
                    k = entries[i][0];
                    dest[k] = old[k];
                }
            }
        }

        return dest;
    }

    /**
     * Sets value for a given path in the object
     * @param {Object} object Target object
     * @param {String} path Dot-separated path, e.g. 'object.childObject.someKey'
     * @param {*} value Value for a given path
     * @returns {Object} Returns passed object
     */
    static setPath(object, path, value) {
        path.split('.').reduce((result, key, index, array) => {
            const isLast = index === array.length - 1;

            if (isLast) {
                return result[key] = value;
            }
            else if (!(result[key] instanceof Object)) {
                result[key] = {};
            }

            return result[key];
        }, object);

        return object;
    }

    static typeOf(value) {
        let type = typeof value,
            match, trueType;

        // If not atomic type, we handle date or null
        if (type === 'object') {
            if (value === null) {
                type = 'null';
            }
            else {
                trueType = toString.call(value);

                if (!(type = typeCache[trueType])) {
                    match = typeNameRe.exec(trueType);
                    typeCache[trueType] = type = match ? match[1].toLowerCase() : trueType;
                }
            }
        }
        // NaN is the only value that is !== to itself
        else if (value !== value) { // eslint-disable-line no-self-compare
            type = 'nan';
        }

        return type;
    }
}

const O = Objects;

O.ES6_OBJECT_ORDER = (() => {
    const o = { a : 1, b : 2 };

    o.c = 3;

    // silly IE! keys should go to the end even if previously present...
    delete o.b;
    o.b = 20;

    const keys = Object.keys(o);

    return keys[1] === 'c';
})();
