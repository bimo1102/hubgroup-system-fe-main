import Objects from './helper/util/Objects.js';

// We cannot import ObjectHelper because of the import cycle:
//  ObjectHelper -> DateHelper -> LocaleManager -> Base -> us

/**
 * @module Core/Config
 */

const
    { defineProperty, getOwnPropertyDescriptor } = Reflect,

    { hasOwnProperty, toString } = Object.prototype,
    instancePropertiesSymbol     = Symbol('instanceProperties'),
    configuringSymbol            = Symbol('configuring'),
    lazyConfigValues             = Symbol('lazyConfigValues'),
    DATE_TYPE                    = toString.call(new Date()),
    whitespace                   = /\s+/,
    createClsProps               = (result, cls) => {
        result[cls] = 1;
        return result;
    };

/**
 * This class holds the description of a config property. Only one instance of this class is needed for each config
 * name (e.g., "text"). If config options are supplied, however, they also contribute to the cached instance.
 *
 * Instances should always be retrieved by calling `Config.get()`.
 *
 * The **Configs** of this class correspond to `options` that can be supplied to the `get()` method. These affect the
 * behavior of the config property in some way, as descried by their respective documentation.
 *
 * This class is not used directly.
 *
 * ## The Setter
 * The primary functionality provided by `Config` is its standard setter. This setter function ensures consistent
 * behavior when modifying config properties.
 *
 * The standard setter algorithm is as follows (using the `'text'` config for illustration):
 *
 *  - If the class defines a `changeText()` method, call it passing the new value and the current value:
 *    `changeText(newText, oldText)`.<br>
 *    Then:
 *    * If `changeText()` exits without returning a value (i.e., `undefined`), exit and do nothing further. The
 *      assumption is that the changer method has done all that is required.
 *    * Otherwise, the return value of `changeText()` replaces the incoming value passed to the setter.
 *  - If the new value (or the value returned by `changeText()`) is `!==` to the current value:
 *    * Update the stored config value in `this._text`.
 *    * If the class defines an `updateText()` method, call it passing the new value and the previous value.
 *      `updateText(newText, oldText)`
 *    * If the class defines an `onConfigChange()` method, call it passing an object with the following properties:
 *        - `name` - The config's name
 *        - `value` - The new value
 *        - `was` - The previous value
 *        - `config` - The `Config` instance.
 *
 * NOTE: unlike `changeText()` and `updateText()`, the name of the `onConfigChange()` method is unaffected by the
 * config's name.
 *
 * @internal
 */
export default class Config {
    /**
     * Returns the `Config` instance for the given `name` and `options`.
     * @param {String} name The name of the config (e.g., 'text' for the text config).
     * @param {Object} [options] Config behavior options.
     * @returns {Core.Config}
     * @internal
     */
    static get(name, options) {
        const
            { cache } = this,
            baseCfg = cache[name] || (cache[name] = new Config(name));

        let cfg = baseCfg,
            key;

        if (options) {
            key = Config.makeCacheKey(name, options);

            if (!(cfg = key && cache[key])) {
                cfg = baseCfg.extend(options);

                if (key) {
                    cache[key] = cfg;
                }
            }
        }

        return cfg;
    }

    constructor(name) {
        const
            me = this,
            cap = name[0].toUpperCase() + name.substr(1);

        me.base = me;  // so extend()ed configs have a link to the base definition
        me.name = name;
        me.field = '_' + name;
        me.capName = cap;
        me.changer = 'change' + cap;
        me.initializing = 'initializing' + cap;
        me.updater = 'update' + cap;
    }

    /**
     * The descriptor to use with `Reflect.defineProperty()` for defining this config's getter and setter.
     * @property {Object}
     * @private
     */
    get descriptor() {
        let descriptor = this._descriptor;

        if (!descriptor || !hasOwnProperty.call(this, '_descriptor')) {
            // lazily make the descriptor
            this._descriptor = descriptor = this.makeDescriptor();
        }

        return descriptor;
    }

    /**
     * The descriptor to use with `Reflect.defineProperty()` for defining this config's initter.
     * @property {Object}
     * @private
     */
    get initDescriptor() {
        let descriptor = this._initDescriptor;

        if (!descriptor || !hasOwnProperty.call(this, '_initDescriptor')) {
            // lazily make the descriptor
            this._initDescriptor = descriptor = this.makeInitter();
        }

        return descriptor;
    }

    /**
     * This method compares two values for semantic equality. By default, this is based on the `===` operator. This
     * is often overridden for configs that accept `Date` or array values.
     * @param {*} value1
     * @param {*} value2
     * @returns {Boolean}
     * @internal
     */
    equal(value1, value2) {
        return value1 === value2;
    }

    /**
     * Extends this config with a given additional set of options. These objects are just prototype extensions of this
     * instance.
     * @param {Object} options
     * @returns {Core.Config}
     * @internal
     */
    extend(options) {
        const
            cfg = Object.assign(Object.create(this), options),
            { equal, merge } = options,
            { equalityMethods } = Config;

        if (typeof equal === 'string') {
            if (equal.endsWith('[]')) {
                cfg.equal = Config.makeArrayEquals(equalityMethods[equal.substr(0, equal.length - 2)]);
            }
            else {
                cfg.equal = equalityMethods[equal];
            }
        }

        if (typeof merge === 'string') {
            // Base uses { merge : 'replace' } for defaultConfig properties
            cfg.merge = Config.mergeMethods[merge];
        }

        return cfg;
    }

    /**
     * Defines the property on a given target object via `Reflect.defineProperty()`. If the object has its own getter,
     * it will be preserved. It is invalid to define a setter.
     * @param {Object} target
     * @internal
     */
    define(target) {
        const existing = getOwnPropertyDescriptor(target, this.name);

        let descriptor = this.descriptor;

        //<debug>
        if (existing && existing.set) {
            throw new Error(`${target.constructor ? target.constructor.name : target.name}.${
                this.name} config cannot have a defined setter`);
        }
        //</debug>

        if (existing && existing.get) {
            descriptor = Object.assign({}, descriptor);
            descriptor.get = existing.get;
        }

        defineProperty(target, this.name, descriptor);
    }

    /**
     * Defines the property initter on the `target`. This is a property getter/setter that propagates the configured
     * value when the property is read.
     * @param {Object} target
     * @param {*} value
     * @internal
     */
    defineInitter(target, value) {
        const
            { name } = this,
            properties = target[instancePropertiesSymbol];

        let lazyValues, prop;

        // If there is an existing property with a getter/setter, *not* a value
        // defined on the object for this config we must call it in our injected getter/setter.
        if (!properties[name] && (/* assign */prop = getOwnPropertyDescriptor(target, name)) && !('value' in prop)) {
            properties[name] = prop;
        }

        // Set up a temporary instance property which will pull in the value from the initialConfig if the getter
        // is called first.
        defineProperty(target, name, this.initDescriptor);

        if (this.lazy) {
            lazyValues = target[lazyConfigValues] || (target[lazyConfigValues] = { $counter_ : 0 });

            lazyValues[name] = value;
            ++lazyValues.$counter_;
        }
    }

    /**
     * Returns an equality function for arrays of a base type, for example `'date'`.
     * @param {Function} [fn] The function to use to compare array elements. By default, operator `===` is used.
     * @returns {Function}
     * @private
     */
    static makeArrayEquals(fn) {
        return (value1, value2) => {
            let i,
                equal = value1 && value2 && value1.length === (i = value2.length);

            if (equal && Array.isArray(value1) && Array.isArray(value2)) {
                if (fn) {
                    while (equal && i-- > 0) {
                        equal = fn(value1[i], value2[i]);
                    }
                }
                else {
                    while (equal && i-- > 0) {
                        equal = value1[i] === value2[i];
                    }
                }
            }
            else {
                equal = fn ? fn(value1, value2) : (value1 === value2);
            }

            return equal;
        };
    }

    /**
     * Returns the key to use in the Config `cache`.
     * @param {String} name The name of the config property.
     * @param {Object} options The config property options.
     * @returns {String}
     * @private
     */
    static makeCacheKey(name, options) {
        const keys = Object.keys(options).sort();

        for (let key, type, value, i = keys.length; i-- > 0; /* empty */) {
            value = options[key = keys[i]];

            if (value == null && value === false) {
                keys.splice(i, 1);
            }
            else {
                type = typeof value;

                if (type === 'function') {
                    return null;
                }

                if (type === 'string') {
                    keys[i] = `${key}:"${value}"`;
                }
                else if (type === 'number') {
                    keys[i] = `${key}:${value}`;
                }
                // that leaves bool and object, but there are no (valid) config options that are objects... so ignore
            }
        }

        return keys.length ? `${name}>${keys.join('|')}` : name;  // eg: 'text>render|merge:v => v|bar'
    }

    /**
     * Creates and returns a property descriptor for this config suitable to be passed to `Reflect.defineProperty()`.
     * @returns {Object}
     * @private
     */
    makeDescriptor() {
        const
            config = this,
            { base, field, changer, updater, name } = config;

        if (base !== config && base.equal === config.equal) {
            // At present only the equal option affects the setter, so all configs can share the
            // descriptor of the base-most config definition unless their equality test fns differ.
            return base.descriptor;
        }

        return {
            get() {
                // Allow folks like Widget.compose() to monitor getter calls
                this.configObserver?.get(name, this);

                return this[field];
            },

            set(value) {
                const me = this;

                let was = me[field],
                    changed, newValue;

                // Resolve values starting with 'up.' by traversing owners to find it
                if (typeof value === 'string') {
                    let resolvedValue = value;

                    if (value.startsWith('up.')) {
                        resolvedValue = me.owner?.resolveProperty(value.substr(3));
                    }
                    else if (value.startsWith('this.')) {
                        resolvedValue = me.resolveProperty(value.substr(5));
                    }

                    // TODO: Ignoring functions for now, we need to handle scope to make those work
                    if (typeof resolvedValue !== 'function') {
                        value = resolvedValue;
                    }
                }

                // If the "changeTitle()" fellow falls off the end, it must have changed all the needful things.
                // Otherwise, it returned the final config value (it may have changed it instead, for example, making
                // an instance from a config object).
                if (me[changer]) {
                    changed = (newValue = me[changer](value, was)) === undefined;

                    if (!changed) {
                        value = newValue;
                        was = me[field];  // in case it was modified by the changer fn...
                    }
                }

                // inline the default equal() for better perf:
                if (!changed && !((config.equal === equal) ? was === value : config.equal(was, value))) {
                    me[field] = value;
                    changed = true;

                    // Check for a "syncTitle()" method and call it if present.
                    if (me[updater]) {
                        me[updater](value, was);
                    }
                }

                if (changed && !me.onConfigChange.$nullFn) {
                    me.onConfigChange({ name, value, was, config });
                }
            }
        };
    }

    /**
     * Creates and returns a property descriptor for this config's initter suitable to pass to
     * `Reflect.defineProperty()`.
     * @returns {Object}
     * @private
     */
    makeInitter() {
        const config = this;

        if (config !== config.base) {
            if (config.lazy) {
                return config.makeLazyInitter();
            }

            // At present no other options affect the setter, so all configs can share the descriptor of the base-most
            // config definition.
            return config.base.initDescriptor;
        }

        return config.makeBasicInitter();
    }

    makeBasicInitter() {
        const
            config = this,
            { initializing, name } = config;

        return {
            configurable : true,

            get() {
                const me = this;

                config.removeInitter(me);

                // Set the value from the configuration.
                me[initializing] = true;
                me[name] = me[configuringSymbol][name];
                me[initializing] = false;

                // The property has been *pulled* from the configuration.
                // Prevent the setting loop in configure from setting it again.
                me.configDone[name] = true;

                // Finally, allow the prototype getter to return the value.
                return me[name];
            },

            set(value) {
                config.removeInitter(this);

                // The config has been set (some internal code may have called the setter)
                // so prevent it from being called again and overwritten with data from initialConfig.
                this.configDone[name] = true;

                // Set the property normally (Any prototype setter will be invoked)
                this[name] = value;
            }
        };
    }

    makeLazyInitter() {
        const
            config = this,
            { initializing, name } = config;

        return {
            configurable : true,

            get() {
                const
                    me = this,
                    value = me[lazyConfigValues][name];

                config.removeInitter(me);

                if (!me.isDestroying) {
                    // Set the value from the lazy config object.
                    me[initializing] = true;
                    me[name] = value;
                    me[initializing] = false;
                }

                // Finally, allow the prototype getter to return the value.
                return me[name];
            },

            set(value) {
                config.removeInitter(this);

                // Set the property normally (Any prototype setter will be invoked)
                this[name] = value;
            }
        };
    }

    /**
     * Removes the property initter and restores the instance to its original form.
     * @param {Object} instance
     * @private
     */
    removeInitter(instance) {
        const
            { name } = this,
            instanceProperty = instance[instancePropertiesSymbol][name];

        // If we took over from an instance property, replace it
        if (instanceProperty) {
            defineProperty(instance, name, instanceProperty);
        }
        // Otherwise just delete the instance property who's getter we are in.
        else {
            delete instance[name];
        }

        if (this.lazy) {
            if (!--instance[lazyConfigValues].$counter_) {
                delete instance[lazyConfigValues];
            }
        }
    }

    /**
     * This method combines (merges) two config values. This is called in two cases:
     *
     *  - When a derived class specifies the value of a config defined in a super class.
     *  - When a value is specified in the instance config object.
     *
     * @param {*} newValue In the case of derived classes, this is the config value of the derived class. In the case
     * of the instance config, this is the instance config value.
     * @param {*} currentValue In the case of derived classes, this is the config value of the super class. In the case
     * of the instance config, this is the class config value.
     * @param {Object} meta The class meta object from which the `newValue` is coming. This parameter is `null` if the
     * `newValue` is from an instance configuration.
     * @returns {*}
     * @internal
     */
    merge(newValue, currentValue) {
        if (currentValue && newValue && Objects.isObject(currentValue) && Objects.isObject(newValue)) {
            newValue = Objects.merge(Objects.clone(currentValue), newValue);
        }

        return newValue;
    }
}

const
    { prototype } = Config,
    { equal } = prototype;

Config.symbols = {
    configuring        : configuringSymbol,
    instanceProperties : instancePropertiesSymbol,
    lazyConfigs        : lazyConfigValues
};

/**
 * This object holds `Config` instances keyed by their name. For example:
 * ```
 *  Config.cache = {
 *      disabled : Config.get('disabled'),
 *      text     : Config.get('text'),
 *      title    : Config.get('title')
 *  };
 * ```
 * @member {Object} cache
 * @static
 * @private
 */
Config.cache = Object.create(null);  // object w/no properties not even inherited ones

/**
 * This object holds config value equality methods. By default, the `===` operator is used to compare config values for
 * semantic equality. When an `equal` option is specified as a string, that string is used as a key into this object.
 *
 * All equality methods in this object have the same signature as the {@link #function-equal equal()} method.
 *
 * This object has the following equality methods:
 *
 * - `array` : Compares arrays of values using `===` on each element.
 * - `date` : Compares values of `Date` type.
 * - `strict` : The default equal algorithm based on `===` operator.
 * @member {Object} equalityMethods
 * @static
 * @private
 */
Config.equalityMethods = {
    array : Config.makeArrayEquals(),

    date(value1, value2) {
        if (value1 === value2) {
            return true;
        }

        // see DateHelper.isDate() but cannot import due to circularity
        if (value1 && value2 && toString.call(value1) === DATE_TYPE && toString.call(value2) === DATE_TYPE) {
            // https://jsbench.me/ltkb3vk0ji/1 - getTime is >2x faster vs valueOf/Number/op+
            return value1.getTime() === value2.getTime();
        }

        return false;
    },

    strict : Config.equal = equal
};

/**
 * This object holds config value merge methods. By default, {@link Core.helper.ObjectHelper#function-merge-static} is
 * used to merge object's by their properties. Config merge methods are used to combine config values from derived
 * classes with config values from super classes, as well as instance config values with those of the class.
 *
 * All merge methods in this object have the same signature as the {@link #function-merge merge()} method.
 *
 * This object has the following merge methods:
 *
 * - `distinct`   : Combines arrays of values ensuring that no value is duplicated. When given an object, its truthy
 *   keys are included, while its falsy keys are removed from the result.
 * - `merge`      : The default merge algorithm for `configurable()` properties, based on
 *   {@link Core.helper.ObjectHelper#function-merge-static}.
 * - `items`      : Similar to `merge`, but allows reordering (see `Objects.mergeItems`).
 * - `objects`    : The same as to `merge` except this method promotes `true` to an empty object.
 * - 'classList'  : Incoming strings are converted to an object where the string is a property name with a truthy value.
 * - `replace`    : Always returns `newValue` to replace the super class value with the derived class value, or the
 *   class value with the instance value.
 * @member {Object} mergeMethods
 * @static
 * @private
 */
Config.mergeMethods = {
    distinct(newValue, oldValue) {
        let ret = oldValue ? oldValue.slice() : [];

        if (newValue != null) {
            if (Objects.isObject(newValue)) {
                if (oldValue === undefined) {
                    ret = newValue;
                }
                else {
                    let key, index;

                    for (key in newValue) {
                        index = ret.indexOf(key);

                        if (newValue[key]) {
                            if (index < 0) {
                                ret.push(key);
                            }
                        }
                        else if (index > -1) {
                            ret.splice(index, 1);
                        }
                    }
                }
            }
            else if (Array.isArray(newValue)) {
                newValue.forEach(v => !ret.includes(v) && ret.push(v));
            }
            else if (!ret.includes(newValue)) {
                ret.push(newValue);
            }
        }

        return ret;
    },

    merge : Config.merge = prototype.merge,

    classList(newValue, oldValue) {
        // 'foo bar' -> { foo : 1, bar : 1 }
        if (typeof newValue === 'string') {
            if (!newValue.length) {
                return oldValue;
            }
            newValue = newValue.split(whitespace).reduce(createClsProps, {});
        }
        return Config.merge(newValue, oldValue);
    },

    objects(newValue, oldValue) {
        return (newValue === true) ? oldValue || {} : Config.merge(newValue, oldValue);
    },

    replace(newValue) {
        return newValue;
    },

    items(newValue, oldValue) {
        return Objects.mergeItems(oldValue, newValue, {
            merge : (oldValue, newValue) => prototype.merge(newValue, oldValue)
        });
    }
};

Object.assign(prototype, {
    _descriptor     : null,
    _initDescriptor : null,

    /**
     * A function that compares values for equality. This test is used to determine if the `update` method should be
     * called when the setter is invoked.
     *
     * To handle `Date` values:
     * ```
     *  class Foo extends Base {
     *      static get configurable() {
     *          return {
     *              date : {
     *                  $config : {
     *                      equal : 'date'
     *                  },
     *
     *                  value : null
     *              }
     *          }
     *      }
     *
     *      updateDate(date) {
     *          // date has changed
     *      }
     *  }
     * ```
     *
     * Also useful for some configs:
     * ```
     *  class Foo extends Base {
     *      static get configurable() {
     *          return {
     *              bar : {
     *                  $config : {
     *                      equal : ObjectHelper.isEqual
     *                  },
     *
     *                  value : null
     *              }
     *          }
     *      }
     *
     *      updateBar(value) {
     *          // value has changed
     *      }
     *  }
     * ```
     * @config {Function} equal
     * @internal
     */

    /**
     * Indicates that this config property should not automatically initialize during construction, but instead should
     * wait for the first explicit use of the property getter.
     * @config {Boolean}
     * @default
     * @internal
     */
    lazy : false,

    /**
     * Indicates that this config property should automatically be set to `null` on destroy.
     * @config {Boolean}
     * @default
     * @internal
     */
    nullify : false,

    /**
     * Indicates that this config participates in rendering. This has does not affect the behavior of the property
     * directly, but allows classes that perform rendering to detect which config changes will affect the rendered
     * result.
     * @config {Boolean}
     * @default
     * @internal
     */
    render : false

    // TODO FUTURES
    // clear   (bool - set to null during cleanup)
    // destroy (bool - destroy value during cleanup)
    // evented (bool - fire event on change / after updater)
});
