import Objects from './Objects.js';
import StringHelper from '../StringHelper.js';

/**
 * @module Core/helper/util/DomClassList
 */

const
    // Presence of '[' is likely an "[object Object]" or other bogus stringification
    invalidClsRe  = /\[|undefined|null/,
    valueSymbol   = Symbol('value'),
    lengthSymbol  = Symbol('length');

/**
 * This class encapsulates a list of CSS classes which can be set as the `className`
 * on an `HTMLElement`.
 *
 * Properties names set on this class equate to *adding* a class if the property's value
 * is _truthy_, or removing a class if the value is _falsy_.
 *
 * ```javascript
 * const myClassList = new DomClassList('b-test-button');
 *
 * myClassList.add('test-class');
 * myClassList.important = 1;
 *
 * myHtmlElement.className = myClassList; // Sets it to "b-test-button test-class important"
 * ```
 */
export default class DomClassList {
    static change(cls, add, remove, as = 'string') {
        remove = DomClassList.normalize(remove, 'object');

        const after = DomClassList.normalize(cls, 'array').filter(c => !remove[c]);

        if (add) {
            add = DomClassList.normalize(add, 'array');

            for (let i = 0; i < add.length; ++i) {
                if (!after.includes(add[i])) {
                    after.push(add[i]);
                }
            }
        }

        return DomClassList.normalize(after, as);
    }

    static from(classes, returnEmpty) {
        if (classes) {
            if (!classes.isDomClassList) {
                classes = new DomClassList(classes);
            }

            if (!classes.value && !returnEmpty) {
                classes = null;
            }
        }

        return classes || (returnEmpty ? new DomClassList() : null);
    }

    /**
     * Converts a class name of any understood type to a desired form.
     * @param {String|String[]|Object|Set|Map|HTMLElement} cls
     * @param {String} as Pass `'object'` to return an object with the class names as its keys (all keys will have a
     * value of `true`), or pass `'array'` to return an array of class names, or pass `'string'` (the default) to
     * return a space-separated string of class names.
     * @returns {String|String[]|Object}
     * @internal
     */
    static normalize(cls, as = 'string') {
        cls = cls || '';  // promote null to '' to avoid typeof snag

        const
            type = typeof cls,
            asArray = as === 'array',
            asObject = as === 'object',
            asString = !asArray && !asObject;

        let isString = type === 'string',
            c, i, ret;

        if (type === 'object') {
            if (cls.nodeType === Element.ELEMENT_NODE && typeof cls.getAttribute === 'function') {
                cls = cls.getAttribute('class') || '';  // cannot use className for SVG el's
                isString = true;
            }
            else if (cls?.isDomClassList) {
                cls = cls.values;
            }
            else if (cls instanceof DOMTokenList) {
                cls = Array.from(cls);
            }
            else if (cls instanceof Map) {
                cls = Array.from(cls.keys()).filter(k => cls.get(k));
            }
            else if (cls instanceof Set) {
                cls = Array.from(cls.values());
            }
            else if (!Array.isArray(cls)) {
                cls = Objects.getTruthyKeys(cls);
            }
        }

        if (isString) {
            // Pass through Set to ensure only unique class names
            cls = [...new Set(StringHelper.split(cls))];
        }

        // cls is now an array
        for (i = cls.length; i-- > 0; /* empty */) {
            c = cls[i];

            //<debug>
            if (invalidClsRe.test(c)) {
                throw new Error(`Invalid CSS class name "${c}"`);
            }
            //</debug>

            if (!c.length) {
                cls.splice(i, 1);
            }
            else if (c.includes(' ')) {
                cls.splice(i, 1, ...StringHelper.split(c));
            }
        }

        if (asArray) {
            ret = cls;
        }
        else if (asString) {
            ret = cls.join(' ');
        }
        else {
            ret = Object.create(null);

            for (i = 0; i < cls.length; ++i) {
                ret[cls[i]] = true;
            }
        }

        return  ret;
    }

    /**
     * Initializes a new DomClassList.
     * @param {...String|Object} classes The CSS classes as strings or objects.
     * @function constructor
     */
    constructor(...classes) {
        this.process(1, classes);
    }

    // To gain some speed in DomHelper.sync(), faster than instanceof etc
    get isDomClassList() {
        return true;
    }

    /**
     * Returns a clone of this DomClassList with all the same keys set.
     * @returns {Core.helper.util.DomClassList} A clone of this DomClassList.
     */
    clone() {
        return new DomClassList(this);
    }

    /**
     * Returns a Boolean value, indicating whether this ClassList has the specified CSS class name.
     * @param {String} className CSS class name to check
     * @return {Boolean} true if this ClassList contains the passed CSS class name, false otherwise
     */
    contains(className) {
        if (typeof className === 'string' && className) {
            return Boolean(this[className]);
        }
        return false;
    }

    // An instance of this class may be assigned directly to an element's className
    // it will be coerced to a string value using this method.
    toString() {
        // Adding space at the end if there is content to make concatenation code simpler in renderers.
        return this.length ? `${this.value} ` : '';
    }

    toJSON() {
        return this.toString();
    }

    /**
     * Analogous to string.trim, returns the string value of this `DomClassList` with no trailing space.
     * @returns {String} A concatenated string value of all the class names in this `DomClassList`
     * separated by spaces.
     */
    trim() {
        return this.value;
    }

    /**
     * Compares this DomClassList to another DomClassList (or class name string of space separated classes).
     * If the same class names (regardless of order) are present, the two are considered equal.
     *
     * So `new DomClassList('foo bar bletch').isEqual('bletch bar foo')` would return `true`
     * @param {Core.helper.util.DomClassList|String} other The `DomClassList` or string of classes to compare to.
     * @returns {Boolean} `true` if the two contain the same class names.
     */
    isEqual(other) {
        const
            otherClasses = DomClassList.normalize(other, 'array'),
            len = otherClasses.length;

        if (this.length === len) {
            for (let i = 0; i < len; i++) {
                if (!this[otherClasses[i]]) {
                    return false;
                }
            }

            return true;
        }

        return false;
    }

    /**
     * Get/set string value.
     * Class names separated with space.
     * @property {String}
     */
    get value() {
        let value = this[valueSymbol],
            keys;

        if (value == null) {
            keys = Objects.getTruthyKeys(this);

            this[lengthSymbol] = keys.length;
            this[valueSymbol] = value = keys.join(' ');
        }

        return value;
    }

    set value(value) {
        const
            me = this,
            keys = Object.keys(me),
            len = keys.length;

        for (let i = 0; i < len; i++) {
            delete me[keys[i]];
        }

        if (value) {
            me.process(1, [value]);
        }
        else {
            // String value needs recalculating
            me[valueSymbol] = null;
        }
    }

    /**
     * Returns string values as an array.
     * @readonly
     * @property {String[]}
     */
    get values() {
        return Objects.getTruthyKeys(this);
    }

    get length() {
        // Maintainer: We MUST access the value getter to force
        // the value to be calculated if it's currently dirty.
        return this.value ? this[lengthSymbol] : 0;
    }

    process(value, classes) {
        for (let cls, k, i = 0; i < classes.length; i++) {
            if (classes[i]) {
                cls = DomClassList.normalize(classes[i], 'array');

                for (k = 0; k < cls.length; ++k) {
                    this[cls[k]] = value;
                }
            }
        }

        // String value needs recalculating
        this[valueSymbol] = null;

        return this;
    }

    /**
     * Adds/removes class names according to the passed object's properties.
     *
     * Properties with truthy values are added.
     * Properties with false values are removed.
     * @param {Object} classList Object containing properties to set/clear
     */
    assign(classList) {
        for (const cls in classList) {
            if (!this[cls] !== !classList[cls]) {
                this[cls] = classList[cls];

                // String value needs recalculating
                this[valueSymbol] = null;
            }
        }

        return this;
    }

    /**
     * Add CSS class(es)
     * ```
     * myClassList.add('bold', 'small');
     * ```
     * @param {String} classes CSS classes to add
     */
    add(...classes) {
        return this.process(1, classes);
    }

    /**
     * Remove CSS class(es)
     * ```
     * myClassList.remove('bold', 'small');
     * ```
     * @param {String} classes CSS classes to remove
     */
    remove(...classes) {
        return this.process(0, classes);
    }

    /**
     * Analogous to the `String#split` method, but with no delimiter
     * parameter. This method returns an array containing the individual
     * CSS class names set.
     * @returns {String[]} The individual class names in this `DomClassList`
     */
    split() {
        return Objects.getTruthyKeys(this);
    }

    forEach(fn) {
        return Objects.getTruthyKeys(this).forEach(fn);
    }
};
