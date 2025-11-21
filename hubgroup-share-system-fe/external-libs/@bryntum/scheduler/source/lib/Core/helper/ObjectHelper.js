import Objects from './util/Objects.js';
import VersionHelper from './VersionHelper.js';

// NOTE: This import prevents this module from being imported by Base (or anything Base imports):
import DateHelper from './DateHelper.js';

const { hasOwnProperty } = Object.prototype;

/**
 * @module Core/helper/ObjectHelper
 */

const
    typeOf = value => {
        const baseType = typeof value;

        // If not atomic type, we handle date or null
        if (baseType === 'object') {
            if (value === null) {
                return 'null';
            }
            if (Array.isArray(value)) {
                return 'array';
            }
            if (Object.prototype.toString.call(value) === '[object Date]') {
                return 'date';
            }
            if (value.isBase) {
                return 'instance';
            }
        }

        if (baseType === 'function') {
            if (value.isBase) {
                return 'class';
            }
        }

        return baseType;
    };

export { typeOf };

// Detect if browser has bad implementation of toFixed()
const toFixedFix = (1.005).toFixed(2) === '1.01' ? null : function(number, fractionDigits) {
    const split = number.toString().split('.'),
        newNumber = +(!split[1] ? split[0] : split.join('.') + '1');

    return number.toFixed.call(newNumber, fractionDigits);
};

/**
 * Helper for Object manipulation.
 */
export default class ObjectHelper extends Objects {
    // These methods are inherited from Objects (an internal class) but need to be documented here for public use.
    // This is primarily because static methods, while inherited by JavaScript classes, are not displayed in derived
    // classes in the docs.

    /**
     * Copies all enumerable properties from the supplied source objects to `dest`. Unlike `Object.assign`, this copy
     * also includes inherited properties.
     * @param {Object} dest The destination object.
     * @param {...Object} sources The source objects.
     * @returns {Object} The `dest` object.
     * @method assign
     * @static
     */

    /**
     * Copies all enumerable properties from the supplied source objects to `dest`, only including properties that does
     * not already exist on `dest`. Unlike `Object.assign`, this copy also includes inherited properties.
     * @param {Object} dest The destination object.
     * @param {...Object} sources The source objects.
     * @returns {Object} The `dest` object.
     * @method assignIf
     * @static
     */

    /**
     * Creates a deep copy of the `value`. Simple objects ({@link #function-isObject-static}, arrays and `Date` objects
     * are cloned. The enumerable properties of simple objects and the elements of arrays are cloned recursively.
     * @param {*} value The value to clone.
     * @param {Function} [handler] An optional function to call for values of types other than simple object, array or
     * `Date`. This function should return the clone of the `value` passed to it. It is only called for truthy values
     * whose `typeof` equals `'object'`.
     * @param {*} handler.value The value to clone.
     * @returns {*} The cloned value.
     * @method clone
     * @static
     */

    /**
     * Converts a list of names (either a space separated string or an array), into an object with those properties
     * assigned truthy values. The converse of {@link #function-getTruthyKeys-static}.
     * @param {String|String[]} source The list of names to convert to object form.
     * @method createTruthyKeys
     * @static
     */

    /**
     * Gathers the names of properties which have truthy values into an array.
     *
     * This is useful when gathering CSS class names for complex element production.
     * Instead of appending to an array or string which may already contain the
     * name, and instead of contending with space separation and concatenation
     * and conditional execution, just set the properties of an object:
     *
     *     cls = {
     *         [this.selectedCls] : this.isSelected(thing),
     *         [this.dirtyCls] : this.isDirty(thing)
     *     };
     *
     * @param {Object} source Source of keys to gather into an array.
     * @returns {String[]} The keys which had a truthy value.
     * @method getTruthyKeys
     * @static
     */

    /**
     * Gathers the values of properties which are truthy into an array.
     * @param {Object} source Source of values to gather into an array.
     * @returns {String[]} The truthy values from the passed object.
     * @method getTruthyValues
     * @static
     */

    /**
     * Tests whether a passed object has any enumerable properties.
     * @param {Object} object
     * @returns {Boolean} `true` if the passed object has no enumerable properties.
     * @method isEmpty
     * @static
     */

    /**
     * Returns `true` if the `value` is a simple `Object`.
     * @param {Object} value
     * @returns {Boolean} `true` if the `value` is a simple `Object`.
     * @method isObject
     * @static
     */

    /**
     * Copies all enumerable properties from the supplied source objects to `dest`, recursing when the properties of
     * both the source and `dest` are objects.
     * ```
     *  const o = {
     *      a : 1,
     *      b : {
     *          c : 2
     *      }
     *  };
     *  const o2 = {
     *      b : {
     *          d : 3
     *      }
     *  }
     *
     *  console.log(merge(o, o2));
     *
     *  > { a : 1, b : { c : 2, d : 3 } }
     * ```
     * @param {Object} dest The destination object.
     * @param {...Object} sources The source objects.
     * @returns {Object} The `dest` object.
     * @method merge
     * @static
     */

    /**
     * Returns the specific type of the given `value`. Unlike the `typeof` operator, this function returns the text
     * from the `Object.prototype.toString` result allowing `Date`, `Array`, `RegExp`, and others to be differentiated.
     * ```
     *  console.log(typeOf(null));
     *  > null
     *
     *  console.log(typeOf({}));
     *  > object
     *
     *  console.log(typeOf([]));
     *  > array
     *
     *  console.log(typeOf(new Date()));
     *  > date
     *
     *  console.log(typeOf(NaN));
     *  > nan
     *
     *  console.log(typeOf(/a/));
     *  > regexp
     * ```
     * @param {*} value
     * @returns {String}
     * @method typeOf
     * @static
     */

    /**
     * Returns value for a given path in the object
     * @param {Object} object Object to check path on
     * @param {String} path Dot-separated path, e.g. 'object.childObject.someKey'
     * @returns {*} Value associated with passed key
     * @method getPath
     * @static
     */

    /**
     * Sets value for a given path in the object
     * @param {Object} object Target object
     * @param {String} path Dot-separated path, e.g. 'object.childObject.someKey'
     * @param {*} value Value for a given path
     * @returns {Object} Returns passed object
     * @method setPath
     * @static
     */

    /**
     * Creates a new object where key is a property in array item (`ref` by default) or index in the array and value is array item.
     *
     * From:
     * ```
     * [
     *     {
     *          text : 'foo',
     *          ref : 'fooItem'
     *     },
     *     {
     *          text : 'bar'
     *     }
     * ]
     * ```
     *
     * To:
     * ```
     * {
     *     fooItem : {
     *         text : 'foo',
     *         ref  : 'fooItem'
     *     },
     *     1 : {
     *         text : 'bar'
     *     }
     * }
     * ```
     *
     * @param {Object[]} arrayOfItems Array to transform.
     * @param {String} [prop] Property to read the key from. `ref` by default.
     * @returns {Object} namedItems
     */
    static transformArrayToNamedObject(arrayOfItems, prop = 'ref') {
        const namedItems = {};

        arrayOfItems.forEach((item, index) => {
            const
                // 0 is valid value, but empty string in not valid
                key = (item[prop] != null && item[prop].toString().length) ? item[prop] : index;

            namedItems[key] = item;
        });

        return namedItems;
    }

    /**
     * Creates a new array from object values and saves key in a property (`ref` by default) of each item.
     *
     * From:
     * ```
     * {
     *     fooItem : {
     *         text : 'foo'
     *     },
     *     1 : {
     *         text : 'bar'
     *     },
     *     barItem : false // will be ignored
     * }
     * ```
     *
     * To:
     * ```
     * [
     *     {
     *          text : 'foo',
     *          ref : 'fooItem'
     *     },
     *     {
     *          text : 'bar',
     *          ref : 1
     *     }
     * ]
     * ```
     *
     * @param {Object} namedItems Object to transform.
     * @param {String} [prop] Property to save the key to. `ref` by default.
     * @returns {Object[]} arrayOfItems
     */
    static transformNamedObjectToArray(namedItems, prop = 'ref') {
        return Object.keys(namedItems).filter(key => namedItems[key]).map(key => {
            const item = namedItems[key];

            item[prop] = key;

            return item;
        });
    }

    /**
     * Checks if two values are equal. Basically === but special handling of dates.
     * @param {*} a First value
     * @param {*} b Second value
     * @returns {*} true if values are equal, otherwise false
     */
    static isEqual(a, b, useIsDeeply = false) {
        // Eliminate null vs undefined mismatch
        if (
            (a === null && b !== null) ||
            (a === undefined && b !== undefined) ||
            (b === null && a !== null) ||
            (b === undefined && a !== undefined)
        ) {
            return false;
        }

        // Covers undefined === undefined and null === null, since mismatches are eliminated above
        if (a == null && b == null) {
            return true;
        }

        // The same instance should equal itself.
        if (a === b) {
            return true;
        }

        const
            typeA = typeof a,
            typeB = typeof b;

        if (typeA === typeB) {
            switch (typeA) {
                case 'number':
                case 'string':
                case 'boolean':
                    return a === b;
            }

            switch (true) {
                case a instanceof Date && b instanceof Date:
                    // faster than calling DateHelper.isEqual
                    // https://jsbench.me/3jk2bom2r3/1
                    return a.getTime() === b.getTime();

                case Array.isArray(a) && Array.isArray(b):
                    return a.length === b.length ? a.every((v, idx) => OH.isEqual(v, b[idx], useIsDeeply)) : false;

                case typeA === 'object' && a.constructor.prototype === b.constructor.prototype:
                    return useIsDeeply ? OH.isDeeplyEqual(a, b, useIsDeeply) : JSON.stringify(a) === JSON.stringify(b);
            }
        }

        return String(a) === String(b);
    }

    /**
     * Checks if two objects are deeply equal
     * @param {Object} a
     * @param {Object} b
     * @param {Object} [options] Additional comparison options
     * @param {Object} [options.ignore] Map of property names to ignore when comparing
     * @param {Function} [options.shouldEvaluate] Function used to evaluate if a property should be compared or not.
     * Return false to prevent comparison
     * @param {Function} [options.evaluate] Function used to evaluate equality. Return `true`/`false` as evaluation
     * result or anything else to let `isEqual` handle the comparison
     * @returns {Boolean}
     */
    static isDeeplyEqual(a, b, options = {}) {
        // Same object, equal :)
        if (a === b) {
            return true;
        }

        // Nothing to compare, not equal
        if (!a || !b) {
            return false;
        }

        // Property names excluding ignored
        const
            aKeys = OH.keys(a, options.ignore),
            bKeys = OH.keys(b, options.ignore);

        // Property count differs, not equal
        if (aKeys.length !== bKeys.length) {
            return false;
        }

        for (let i = 0; i < aKeys.length; i++) {
            const
                aKey = aKeys[i],
                bKey = bKeys[i];

            // Property name differs, not equal
            if (aKey !== bKey) {
                return false;
            }

            const
                aVal = a[aKey],
                bVal = b[bKey];

            // Allow caller to determine if property values should be evaluated or not
            // TODO: Not currently used
            if (options.shouldEvaluate) {
                if (options.shouldEvaluate(
                    aKey,
                    {
                        value  : aVal,
                        object : a
                    }, {
                        value  : bVal,
                        object : b
                    }
                ) === false) {
                    continue;
                }
            }

            // Allow caller to determine equality of properties
            if (options.evaluate) {
                const result = options.evaluate(aKey, {
                    value  : aVal,
                    object : a
                }, {
                    value  : bVal,
                    object : b
                });

                // Not equal
                if (result === false) {
                    return false;
                }

                // Equal, skip isEqual call below
                if (result === true) {
                    continue;
                }
            }

            // Values differ, not equal (also digs deeper)
            if (!OH.isEqual(aVal, bVal, options)) {
                return false;
            }
        }

        // Found to be equal
        return true;
    }

    /**
     * Checks if value B is partially equal to value A.
     * @param {*} a First value
     * @param {*} b Second value
     * @returns {Boolean} true if values are partially equal, false otherwise
     */
    static isPartial(a, b) {
        a = String(a).toLowerCase();
        b = String(b).toLowerCase();

        return a.indexOf(b) !== -1;
    }

    /**
     * Checks if value a is smaller than value b.
     * @param {*} a First value
     * @param {*} b Second value
     * @returns {Boolean} true if a < b
     */
    static isLessThan(a, b) {
        if (a instanceof Date && b instanceof Date) {
            return DateHelper.isBefore(a, b);
        }
        return a < b;
    }

    /**
     * Checks if value a is bigger than value b.
     * @param {*} a First value
     * @param {*} b Second value
     * @returns {Boolean} true if a > b
     */
    static isMoreThan(a, b) {
        if (a instanceof Date && b instanceof Date) {
            return DateHelper.isAfter(a, b);
        }
        return a > b;
    }

    /**
     * Used by the Base class to make deep copies of defaultConfig blocks
     * @private
     */
    static fork(obj) {
        let ret, key, value;

        if (obj && obj.constructor === Object) {
            ret = Object.setPrototypeOf({}, obj);

            for (key in obj) {
                value = obj[key];

                if (value) {
                    if (value.constructor === Object) {
                        ret[key] = OH.fork(value);
                    }
                    else if (value instanceof Array) {
                        ret[key] = value.slice();
                    }
                }
            }
        }
        else {
            ret = obj;
        }

        return ret;
    }

    /**
     * Copies the named properties from the `source` parameter into the `dest` parameter.
     * @param {Object} dest The destination into which properties are copied.
     * @param {Object} source The source from which properties are copied.
     * @param {String[]} props The list of property names.
     * @returns The `dest` object.
     */
    static copyProperties(dest, source, props) {
        let prop, i;
        for (i = 0; i < props.length; i++) {
            prop = props[i];
            if (prop in source) {
                dest[prop] = source[prop];
            }
        }
        return dest;
    }

    /**
     * Copies the named properties from the `source` parameter into the `dest` parameter
     * unless the property already exists in the `dest`.
     * @param {Object} dest The destination into which properties are copied.
     * @param {Object} source The source from which properties are copied.
     * @param {String[]} props The list of property names.
     * @returns The `dest` object.
     */
    static copyPropertiesIf(dest, source, props) {
        if (source) {
            for (const prop of props) {
                if (!(prop in dest)) {
                    dest[prop] = source[prop];
                }
            }
        }
        return dest;
    }

    /**
     * Returns an array containing the keys and values of all enumerable properties from every prototype level for the
     * object. If `object` is `null`, this method returns an empty array.
     * @param {Object} object Object from which to retrieve entries.
     * @param {Object|Function} [ignore] Optional object of names to ignore or a function accepting the name and value
     * which returns `true` to ignore the item.
     * @returns {Array}
     * @internal
     */
    static entries(object, ignore) {
        const
            result = [],
            call = typeof ignore === 'function';

        if (object) {
            for (const p in object) {
                if (call ? !ignore(p, object[p]) : !ignore?.[p]) {
                    result.push([p, object[p]]);
                }
            }
        }

        return result;
    }

    /**
     * Populates an `object` with the provided `entries`.
     * @param {Array} entries The key/value pairs (2-element arrays).
     * @param {Object} [object={}] The object onto which to add `entries`.
     * @returns {Object} The passed `object` (by default, a newly created object).
     * @internal
     */
    static fromEntries(entries, object) {
        object = object || {};

        if (entries) {
            for (let i = 0; i < entries.length; ++i) {
                object[entries[i][0]] = entries[i][1];
            }
        }

        return object;
    }

    /**
     * Returns an array containing all enumerable property names from every prototype level for the object. If `object`
     * is `null`, this method returns an empty array.
     * @param {Object} object Object from which to retrieve property names.
     * @param {Object|Function} [ignore] Optional object of names to ignore or a function accepting the name and value
     * which returns `true` to ignore the item.
     * @returns {String[]}
     */
    static keys(object, ignore) {
        const
            result = [],
            call = typeof ignore === 'function';

        if (object) {
            for (const p in object) {
                if (call ? !ignore(p, object[p]) : !ignore?.[p]) {
                    result.push(p);
                }
            }
        }

        return result;
    }

    /**
     * Returns an array containing the values of all enumerable properties from every prototype level for the object.
     * If `object` is `null`, this method returns an empty array.
     * @param {Object} object Object from which to retrieve values.
     * @param {Object|Function} [ignore] Optional object of names to ignore or a function accepting the name and value
     * which returns `true` to ignore the item.
     * @returns {Array}
     * @internal
     */
    static values(object, ignore) {
        const
            result = [],
            call = typeof ignore === 'function';

        if (object) {
            for (const p in object) {
                if (call ? !ignore(p, object[p]) : !ignore?.[p]) {
                    result.push(object[p]);
                }
            }
        }

        return result;
    }

    /**
     * Returns an array of a given object's properties names including properties in
     * all superclasses, in the same order as we get with a normal loop.
     * @param {Object} object An object which may have properties in a prototype
     * chain, such as a configuration (These are chained because of inheritance).
     * @returns {String[]} The property names.
     * @deprecated 4.1.0 Use {@link #function-keys-static} instead.
     */
    static allKeys(object) {
        VersionHelper.deprecate('Core', '5.0.0', 'Deprecated in favor of `keys()`; will be removed in 5.0');

        return ObjectHelper.keys(object);
    }

    //region Path

    /**
     * Checks if a given path exists in an object
     * @param {Object} object Object to check path on
     * @param {String} path Dot-separated path, e.g. 'object.childObject.someKey'
     * @returns {Boolean} Returns `true` if path exists or `false` if it does not
     */
    static pathExists(object, path) {
        const properties = path.split('.');

        return properties.every(property => {
            if (!(property in object)) {
                return false;
            }
            object = object[property];
            return true;
        });
    }

    /**
     * Creates a simple single level key-value object from complex deep object.
     * @param {Object} object Object to extract path and values from
     * @returns {Object} Key-value object where key is a path to the corresponding value
     * @internal
     *
     * ```javascript
     * // converts deep object
     * {
     *     foo : {
     *         bar : {
     *             test : 1
     *         }
     *     }
     * }
     * // into a single level object
     * {
     *     'foo.bar.test' : 1
     * }
     * ```
     */
    static pathifyKeys(object) {
        const result = {};

        for (const key in object) {
            if (Object.hasOwnProperty.call(object, key)) {
                if (object[key] instanceof Object) {
                    const paths = this.pathifyKeys(object[key]);

                    for (const path in paths) {
                        result[`${key}.${path}`] = paths[path];
                    }
                }
                else {
                    result[key] = object[key];
                }
            }
        }

        return result;
    }

    /**
     * Removes value for a given path in the object. Doesn't cleanup empty objects.
     * @param {Object} object
     * @param {String} path Dot-separated path, e.g. `obj.child.someKey`
     * @internal
     */
    static deletePath(object, path) {
        path.split('.').reduce((result, key, index, array) => {
            if (result == null) {
                return null;
            }
            else if (Object.hasOwnProperty.call(result, key)) {
                if (index === array.length - 1) {
                    delete result[key];
                }
                else {
                    return result[key];
                }
            }
        }, object);
    }

    //endregion

    static coerce(from, to) {
        const fromType = typeOf(from),
            toType = typeOf(to),
            isString = typeof from === 'string';

        if (fromType !== toType) {
            switch (toType) {
                case 'string':
                    return String(from);
                case 'number':
                    return Number(from);
                case 'boolean':
                    // See http://ecma262-5.com/ELS5_HTML.htm#Section_11.9.3 as to why '0'.
                    // TL;DR => ('0' == 0), so if given string '0', we must return boolean false.
                    return isString && (!from || from === 'false' || from === '0') ? false : Boolean(from);
                case 'null':
                    return isString && (!from || from === 'null') ? null : false;
                case 'undefined':
                    return isString && (!from || from === 'undefined') ? undefined : false;
                case 'date':
                    return isString && isNaN(from) ? DateHelper.parse(from) : Date(Number(from));
            }
        }
        return from;
    }

    static wrapProperty(object, propertyName, newGetter, newSetter, deep = true) {
        const newProperty = {};

        let proto = Object.getPrototypeOf(object),
            existingProperty = Object.getOwnPropertyDescriptor(proto, propertyName);

        while (!existingProperty && proto && deep) {
            proto = Object.getPrototypeOf(proto);
            if (proto) {
                existingProperty = Object.getOwnPropertyDescriptor(proto, propertyName);
            }
        }

        if (existingProperty) {
            if (existingProperty.set) {
                newProperty.set = v => {
                    existingProperty.set.call(object, v);

                    // Must invoke the getter in case "v" has been transformed.
                    newSetter && newSetter.call(object, existingProperty.get.call(object));
                };
            }
            else {
                newProperty.set = newSetter;
            }
            if (existingProperty.get) {
                newProperty.get = () => {
                    let result = existingProperty.get.call(object);
                    if (newGetter) {
                        result = newGetter.call(object, result);
                    }
                    return result;
                };
            }
            else {
                newProperty.get = newGetter;
            }
        }
        else {
            newProperty.set = v => {
                object[`_${propertyName}`] = v;
                newSetter && newSetter.call(object, v);
            };
            newProperty.get = () => {
                let result = object[`_${propertyName}`];
                if (newGetter) {
                    result = newGetter.call(object, result);
                }
                return result;
            };
        }
        Object.defineProperty(object, propertyName, newProperty);
    }

    /**
     * Finds a property descriptor for the passed object from all inheritance levels.
     * @param {Object} object The Object whose property to find.
     * @param {String} propertyName The name of the property to find.
     * @returns {Object} An ECMA property descriptor is the property was found, otherwise `null`
     */
    static getPropertyDescriptor(object, propertyName) {
        let result = null;

        for (let o = object; o && !result && !hasOwnProperty.call(o, 'isBase'); o = Object.getPrototypeOf(o)) {
            result = Object.getOwnPropertyDescriptor(o, propertyName);
        }

        return result;
    }

    /**
     * Changes the passed object and removes all null and undefined properties from it
     * @param {Object} object Target object
     * @param {Boolean} [keepNull] Pass true to only remove undefined properties
     * @returns {Object} Passed object
     */
    static cleanupProperties(object, keepNull = false) {
        Object.entries(object).forEach(([key, value]) => {
            if (keepNull) {
                value === undefined && delete object[key];
            }
            else {
                value == null && delete object[key];
            }
        });
        return object;
    }

    /**
     * Changes the passed object and removes all properties from it.
     * Used while mutating when need to keep reference to the object but replace its properties.
     * @param {Object} object Target object
     * @returns {Object} Passed object
     */
    static removeAllProperties(obj) {
        Object.keys(obj).forEach(key => delete obj[key]);
        return obj;
    }

    //region Assert type

    /**
     * Checks that the supplied value is of the specified type.Throws if it is not
     * @param {Object} value Value to check type of
     * @param {String} type Expected type
     * @param {String} name Name of the value, used in error message
     * @param {Boolean} [allowNull] Accept `null` without throwing
     */
    static assertType(value, type, name) {
        const valueType = typeOf(value);
        if (value != null && valueType !== type) {
            throw new Error(`Incorrect type "${valueType}" for ${name}, expected "${type}"`);
        }
    }

    /**
     * Checks that the supplied value is a plain object. Throws if it is not
     * @param {Object} value Value to check type of
     * @param {String} name Name of the value, used in error message
     */
    static assertObject(value, name) {
        OH.assertType(value, 'object', name);
    }

    /**
     * Checks that the supplied value is an instance of a Bryntum class. Throws if it is not
     * @param {Object} value Value to check type of
     * @param {String} name Name of the value, used in error message
     */
    static assertInstance(value, name) {
        OH.assertType(value, 'instance', name);
    }

    /**
     * Checks that the supplied value is a Bryntum class. Throws if it is not
     * @param {Object} value Value to check type of
     * @param {String} name Name of the value, used in error message
     */
    static assertClass(value, name) {
        OH.assertType(value, 'class', name);
    }

    /**
     * Checks that the supplied value is a function. Throws if it is not
     * @param {Object} value Value to check type of
     * @param {String} name Name of the value, used in error message
     */
    static assertFunction(value, name) {
        if (typeof value !== 'function' || value.isBase || value.$$name) {
            throw new Error(`Incorrect type for ${name}, got "${value}" (expected a function)`);
        }
    }

    /**
     * Checks that the supplied value is a number. Throws if it is not
     * @param {Object} value Value to check type of
     * @param {String} name Name of the value, used in error message
     */
    static assertNumber(value, name) {
        const asNumber = Number(value);

        if (typeof value !== 'number' || isNaN(asNumber)) {
            throw new Error(`Incorrect type for ${name}, got "${value}" (expected a Number)`);
        }
    }

    /**
     * Checks that the supplied value is a boolean. Throws if it is not
     * @param {Object} value Value to check type of
     * @param {String} name Name of the value, used in error message
     */
    static assertBoolean(value, name) {
        OH.assertType(value, 'boolean', name);
    }

    /**
     * Checks that the supplied value is a string. Throws if it is not
     * @param {Object} value Value to check type of
     * @param {String} name Name of the value, used in error message
     */
    static assertString(value, name) {
        OH.assertType(value, 'string', name);
    }

    /**
     * Checks that the supplied value is an array. Throws if it is not
     * @param {Object} value Value to check type of
     * @param {String} name Name of the value, used in error message
     */
    static assertArray(value, name) {
        OH.assertType(value, 'array', name);
    }

    //endregion

    /**
     * Number.toFixed(), with polyfill for browsers that needs it
     * @param {Number} number
     * @param {Number} digits
     * @returns {String} A fixed point string representation of the passed number.
     */
    static toFixed(number, digits) {
        if (toFixedFix) {
            return toFixedFix(number, digits);
        }

        return number.toFixed(digits);
    }

    /**
     * Round the passed number to closest passed step value.
     * @param {Number} number The number to round.
     * @param {Number} [step] The step value to round to.
     * @returns {Number} The number rounded to the closest step.
     */
    static roundTo(number, step = 1) {
        return Math.round(number / step) * step;
    }

    /**
     * Round the passed number to the passed number of decimals.
     * @param {Number} number The number to round.
     * @param {Number} digits The number of decimal places to round to.
     * @returns {Number} The number rounded to the passed number of decimal places.
     */
    static round(number, digits) {
        // Undefined or null means do not round. NOT round to no decimals.
        if (digits == null) {
            return number;
        }

        const factor = 10 ** digits;

        return Math.round(number * factor) / factor;
    }

    /**
     * Returns a non-null entry from a Map for a given key path. This enables a specified defaultValue to be added "just
     * in time" which is returned if the key is not already present.
     * @param {Map} map The Map to find the key in (and potentially add to).
     * @param {String|Number|String[]|Number[]} path Dot-separated path, e.g. 'firstChild.childObject.someKey',
     * or the key path as an array, e.g. ['firstChild', 'childObject', 'someKey'].
     * @param {Object} [defaultValue] Optionally the value to insert if the key is not found.
     */
    static getMapPath(map, path, defaultValue) {
        const
            keyPath   = Array.isArray(path) ? path : typeof path === 'string' ? path.split('.') : [path],
            simpleKey = keyPath.length === 1,
            topKey    = keyPath[0],
            topValue  = map.has(topKey) ? map.get(topKey) : map.set(topKey, simpleKey ? defaultValue : {}).get(topKey);

        // If it was a simple key, we are done.
        if (simpleKey) {
            return topValue;
        }

        // Go down the property path on the top Object, filling entries in until the leaf.
        return OH.getPathDefault(topValue, keyPath.slice(1), defaultValue);
    }
}

const OH = ObjectHelper;
