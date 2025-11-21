/**
 * @module Core/Base
 */
import Objects from './helper/util/Objects.js';
import StringHelper from './helper/StringHelper.js';
import VersionHelper from './helper/VersionHelper.js';
import BrowserHelper from './helper/BrowserHelper.js';
import Config from './Config.js';

class MetaClass {
    constructor(options) {
        options && Object.assign(this, options);
    }

    getInherited(name, create = true) {
        let ret = this[name];

        // We use "in this" to allow the object to be set to null
        if (!(name in this)) {
            // If there is no object on this meta class, but there may be one on a super class. If create=false, the
            // idea is that a super class object will be "properly" inherited but otherwise no object will be created.
            ret = this.super?.getInherited(name, create);

            if (ret || create) {
                this[name] = ret = Object.create(ret || null);
            }
        }

        return ret;
    }
}

const
    // Using Object.getPrototypeOf instead of Reflect.getPrototypeOf because:
    // 1. The are almost the same, according to the MDN difference is handling getPrototypeOf('string')
    // 2. It allows to pass security check in SalesForce environment
    { getPrototypeOf }       = Object,
    { defineProperty }       = Reflect,
    { hasOwnProperty }       = Object.prototype,
    metaSymbol               = Symbol('classMetaData'),
    mixinTagSymbol           = Symbol('mixinTag'),
    originalConfigSymbol     = Symbol('originalConfig'),
    createdAtSymbol          = Symbol('createdAt'),
    configuringSymbol        = Config.symbols.configuring,
    instancePropertiesSymbol = Config.symbols.instanceProperties,
    lazyConfigsSymbol        = Config.symbols.lazyConfigs,
    defaultConfigOptions     = { merge : 'replace', simple : true },
    emptyFn                  = () => {},
    newMeta                  = o => new MetaClass(o),
    setupNames               = { /* foo : 'setupFoo' */ };

/**
 * Base class for all configurable classes.
 *
 * Subclasses do not have to implement a constructor with its restriction of having to call super()
 * before there is a `this` reference. Subclasses instead implement a `construct` method which is
 * called by the `Base` constructor. This may call its `super` implementation at any time.
 *
 * The `Base` constructor applies all configs to properties of the new instance. The instance
 * will have been configured after the `super.construct(config)` is called.
 *
 * See the Class System documentation in the guides for more information.
 *
 * @abstract
 */
export default class Base {
    static get isBase() {
        return true;
    }

    get isBase() {
        return true;
    }

    // defaultConfig & properties made private to not spam all other classes

    /**
     * A class property getter to add additional, special class properties.
     *
     * For example, a class adds a `declarable` class property like so:
     * ```
     *  class Something extends Base {
     *      static get declarable() {
     *          return ['extra'];
     *      }
     *
     *      static setupExtra(cls, meta) {
     *          // use cls.extra
     *      }
     *  }
     * ```
     * A derived class can then specify this property like so:
     * ```
     *  class Derived extends Something {
     *      static get extra() {
     *          // return extra information
     *      }
     *  }
     * ```
     * When the `Derived` class is initialized, the `setupExtra()` method is called and `Derived` is passed as the
     * argument. It is also the `this` pointer, but the parameter is minifiable. The second argument passed is the
     * `$meta` object for the class.
     *
     * Classes are initialized at the first occurrence of the following:
     *
     * - An instance is created
     * - The class `$meta` property is accessed
     *
     * @member {String[]} declarable
     * @static
     * @category Configuration
     * @internal
     */
    static get declarable() {
        return [
            'declarable',

            /**
             * A class property getter for the configuration properties of the class, which can be overridden by
             * configurations passed at construction time.
             *
             * Unlike a normal `static` property, this property is only ever used for the class that defines it (as in,
             * `hasOwnProperty`). It is retrieved for all classes in a class hierarchy, to gather their configs
             * individually and then combine them with those of derived classes.
             *
             * For example, a `Label` might declare a `text` config like so:
             * ```javascript
             *  class Label extends Base {
             *      static get configurable() {
             *          return {
             *              text : null
             *          };
             *      }
             *  }
             * ```
             * The `text` config is automatically inherited by classes derived from Label. By implementing
             * `get configurable()`, derived classes can change the default value of inherited configs, or define new
             * configs, or both.
             *
             * When a config property is declared in this way, the class author can also implement either of two
             * special methods that will be called when the config property is assigned a new value:
             *
             *  - `changeText()`
             *  - `updateText()`
             *
             * In the example above, the `Label` class could implement a `changeText()` method, an `updateText()`
             * method, or both. The generated property setter ensures these methods will be called when the `text`
             * property is assigned.
             *
             * The generated setter (for `text` in this example) performs the following steps:
             *
             *  - If the class defines a `changeText()` method, call it passing the new value and the current value:
             *    `changeText(newText, oldText)`.<br>
             *    Then:
             *    * If `changeText()` exits without returning a value (i.e., `undefined`), exit and do nothing
             *      further. The assumption is that the changer method has done all that is required.
             *    * Otherwise, the return value of `changeText()` replaces the incoming value passed to the setter.
             *  - If the new value (or the value returned by `changeText()`) is `!==` to the current value:
             *    * Update the stored config value in `this._text`.
             *    * If the class defines an `updateText()` method, call it passing the new value and the previous value.
             *      `updateText(newText, oldText)`
             *
             * #### Resolving a value from an owner
             * By specifying a value starting with `'up.'` for a config, the config system will resolve that value by
             * examining the ownership hierarchy. It will walk up the hierarchy looking for a property matching the name
             * (or dot separated path) after 'up.'. If one is found, the value will be read and used as the initial
             * value.
             *
             * ```javascript
             * class Parent extends Base {
             *     static get configurable() {
             *         return [
             *           'importantValue'
             *         ]
             *     }
             * }
             *
             * class Child extends Base {
             *     static get configurable() {
             *         return [
             *           'value'
             *         ]
             *     }
             * }
             *
             * const parent = new Parent({
             *     importantValue : 123
             * });
             *
             * const child = new Child({
             *     owner : parent,
             *     // Will be resolved from the owner
             *     value : 'up.importantValue'
             * });
             *
             * console.log(child.value); // logs 123
             * ```

             * Please note that this is for now a one way one time binding, the value will only be read initially and
             * not kept up to date on later changes.
             *
             * #### Value Merging
             * When a config property value is an object, the value declared by the base class is merged with values
             * declared by derived classes and the value passed to the constructor.
             * ```javascript
             *  class Example extends Base {
             *      static get configurable() {
             *          return {
             *              config : {
             *                  foo : 1,
             *                  bar : 2
             *              }
             *          };
             *      }
             *  }
             *
             *  class Example2 extends Example {
             *      static get configurable() {
             *          return {
             *              config : {
             *                  bar : 42,
             *                  zip : 'abc'
             *              }
             *          };
             *      }
             *  }
             *
             *  let ex = new Example2({
             *      config : {
             *          zip : 'xyz'
             *      }
             *  });
             * ```
             * The result of the merge would set `config` to:
             * ```javascript
             *  ex.foo = {
             *      foo : 1,    // from Example
             *      bar : 42,   // from Example2
             *      zip : 'xyz' // from constructor
             *  }
             * ```
             *
             * #### Config Options
             * Some config properties require additional options such as declarative information about the config that
             * may be useful to automate some operation. Consider a `Button`. It could declare that its `text` config
             * affects the rendered HTML by applying a `render` property to the config definition. Its base class could
             * then examine the config definition to find this property.
             *
             * To support this, config options ca be declared like so:
             * ```javascript
             *  class Button extends Widget {
             *      static get configurable() {
             *          return {
             *              text : {
             *                  value   : null,
             *                  $config : {
             *                      render : true
             *                  }
             *              }
             *          };
             *      }
             *  }
             * ```
             * The `$config` property can alternatively be just the names of the options that should be enabled (set
             * to `true`).
             *
             * For example, the following is equivalent to the above:
             * ```javascript
             *  class Button extends Widget {
             *      static get configurable() {
             *          return {
             *              text : {
             *                  value   : null,
             *                  $config : 'render'
             *              }
             *          };
             *  }
             * ```
             *
             * #### Default Value
             * It is common to set a config to a `null` value to take advantage of internal optimizations for `null`
             * values. In most cases the fact that this produces `undefined` as the actual initial value of the config
             * is acceptable. When this is not acceptable, a config can be declared like so:
             * ```javascript
             *  class Widget {
             *      static get configurable() {
             *          return {
             *              disabled : {
             *                  $config : null,
             *                  value   : null,
             *                  default : false
             *              }
             *          };
             *  }
             * ```
             * The `default` property above determines the value of the config while still gaining the benefits of
             * minimal processing due to the `null` value of the `value` property.
             * @member {Object} configurable
             * @static
             * @category Configuration
             * @internal
             */
            'configurable',

            /**
             * A class property getter for the default configuration of the class, which can be overridden by
             * configurations passed at construction time.
             *
             * Unlike a normal `static` property, this property is only ever used for the class that defines it (as in,
             * `hasOwnProperty`). It is retrieved for all classes in a class hierarchy, to gather their configs
             * individually and then combine them with those of derived classes.
             *
             * For example, a `Store` might declare its `url` config like so:
             * ```
             *  class Store extends Base {
             *      static get defaultConfig() {
             *          return {
             *              url : null
             *          };
             *      }
             *  }
             * ```
             * The `url` config is automatically inherited by classes derived from Store. By implementing
             * `get defaultConfig()`, derived classes can change the default value of inherited configs, or define new
             * configs, or both. When defining new configs, however, `configurable` is preferred.
             *
             * Config properties introduced to a class by this declaration do not participate in value merging and do
             * not get a generated setter. Config properties introduced by a base class using `configurable` can be
             * set to a different value using `defaultConfig` and in doing so, the values will be merged as appropriate
             * for `configurable`.
             *
             * @member {Object} defaultConfig
             * @static
             * @category Configuration
             * @internal
             */
            'defaultConfig',

            /**
             * A class property getter for the default values of internal properties for this class.
             * @member {Object} properties
             * @static
             * @category Configuration
             * @internal
             */
            'properties',

            /**
             * A class property getter for properties that will be applied to the class prototype.
             * @member {Object} prototypeProperties
             * @static
             * @category Configuration
             * @internal
             */
            'prototypeProperties'
        ];
    }

    /**
     * Base constructor, passes arguments to {@link #function-construct}.
     * @param {...Object} [args] Usually called with a config object, but accepts any params
     * @function constructor
     * @category Lifecycle
     */
    constructor(...args) {
        const
            me = this,
            C  = me.constructor;

        if (me.$meta.class !== C) {
            // This will happen only once for each class. We need to call the C.$meta getter which puts $meta on our
            // prototype. Since that alone would be optimized away (and would generate IDE and lint warnings), we call
            // emptyFn and simply pass the value.
            emptyFn(C.$meta);
        }

        // Allow subclasses to have a pseudo constructor with "this" already set:
        me.construct(...args);

        me.afterConstruct();
    }

    /**
     * Factory version of the Base constructor. Merges all arguments to create a config object that is passed along to
     * the constructor.
     * @param {...Object} [configs] Allows passing multiple config objects
     * @returns {Core.Base} New instance
     * @private
     */
    static new(...configs) {
        return new this(Objects.merge({}, ...configs));
    }

    /**
     * Base implementation applies configuration.
     *
     * Subclasses need only implement this if they have to initialize instance specific
     * properties required by the class. Often a `construct` method is
     * unnecessary. All initialization of incoming configuration properties can be
     * done in a `set propName` implementation.
     * @param {...Object} [args] Usually called with a config object, but accepts any params
     * @category Lifecycle
     */
    construct(...args) {
        

        // Passing null to base construct means bypass the config system and stack creation (to gain performance)
        if (args[0] !== null) {
            //<debug>
            this[createdAtSymbol] = new Error().stack;
            //</debug>

            this.configure(...args);
        }

        this.afterConfigure();
    }

    /**
     * Destroys the provided objects by calling their {@link #function-destroy} method.
     * Skips empty values or objects that are already destroyed.
     *
     * ```javascript
     * Base.destroy(myButton, toolbar1, helloWorldMessageBox);
     * ```
     * @param {...Object} [args] Objects to be destroyed
     * @category Lifecycle
     */
    static destroy(...args) {
        const shredder = object => {
            if (object?.destroy) {
                object.destroy();
            }
            else if (Array.isArray(object)) {
                object.forEach(shredder);
            }
        };

        shredder(args);
    }

    /**
     * Destroys this object. This is primarily accomplished by calling {@link #function-doDestroy}, however, prior to
     * calling `doDestroy`, {@link #property-isDestroying} is set to `true`. After {@link #function-doDestroy} returns,
     * {@link #property-isDestroyed} is set to `true`.
     *
     * Do not override this method in subclasses. To provide class-specific cleanup, implement {@link #function-doDestroy}
     * instead.
     * @category Lifecycle
     */
    destroy() {
        const
            me = this,
            { id } = me;

        

        // Let everyone know the object is going inert:
        me.isDestroying = true;

        // Make calling destroy() harmless:
        me.destroy = emptyFn;

        me.doDestroy();

        

        Object.setPrototypeOf(me, null);

        // Clear all remaining instance properties.
        for (const key in me) {
            if (key !== 'destroy' && key !== 'isDestroying') {
                delete me[key];
            }
        }

        delete me[originalConfigSymbol];

        // Let everyone know the object is inert:
        me.isDestroyed = true;
        me.id = id;  // for diagnostic reasons
    }

    /**
     * This method is required to help `unused` getters to survive production build process. Some tools, like angular,
     * will remove `unused` code in production build, making our side-effected getters behind, breaking code heavily.
     * @internal
     * @param getter Getter to evaluate
     */
    _thisIsAUsedExpression(getter) {}

    static get $$name() {
        return hasOwnProperty.call(this, '$name') && this.$name ||
            // _$name is filled by webpack for every class (cls._$name = '...')
            hasOwnProperty.call(this, '_$name') && this._$name ||
            this.name;
    }

    get $$name() {
        return this.constructor.$$name;
    }

    /**
     * Base implementation so that all subclasses and mixins may safely call super.startConfigure.
     *
     * This is called by the Base class before setting configuration properties, but after
     * the active initial getters have been set, so all configurations are available.
     *
     * This method allows all classes in the hierarchy to force some configs to be evaluated before others.
     * @internal
     * @category Lifecycle
     * @params {Object} config The configuration object use to set the initial state.
     */
    startConfigure(config) {

    }

    /**
     * Base implementation so that all subclasses and mixins may safely call super.finishConfigure.
     *
     * This is called by the Base class before exiting the {@link #function-configure} method.
     *
     * At this point, all configs have been applied, but the `isConfiguring` property is still set.
     *
     * This method allows all classes in the hierarchy to inject functionality
     * into the config phase.
     * @internal
     * @category Lifecycle
     * @params {Object} config The configuration object use to set the initial state.
     */
    finishConfigure(config) {

    }

    /**
     * Base implementation so that all subclasses and mixins may safely call `super.afterConfigure`. This is called by the Base class after the {@link #function-configure} method has been
     * called. At this point, all configs have been applied.
     *
     * This method allows all classes in the hierarchy to inject functionality
     * either before or after the super.afterConstruct();
     * @internal
     * @category Lifecycle
     */
    afterConfigure() {

    }

    /**
     * Base implementation so that all subclasses and mixins may safely call super.afterConstruct.
     *
     * This is called by the Base class after the {@link #function-construct} method has been
     * called.
     *
     * At this point, all configs have been applied.
     *
     * This method allows all classes in the hierarchy to inject functionality
     * either before or after the super.afterConstruct();
     * @internal
     * @function afterConstructor
     * @category Lifecycle
     */
    afterConstruct() {

    }

    /**
     * Provides a way of calling callbacks which may have been specified as the _name_ of a function
     * and optionally adds scope resolution.
     *
     * For example, if the callback is specified as a string, then if it is prefixed with `'this.'`
     * then the function is resolved in this object. This is useful when configuring listeners
     * at the class level.
     *
     * If the callback name is prefixed with `'up.'` then the ownership hierarchy is queried
     * using the `owner` property until an object with the named function is present, then the
     * named function is called upon that object.
     * @param {String|Function} fn The function to call, or the name of the function to call.
     * @param {Object} thisObject The `this` object of the function.
     * @param {Object[]} args The argument list to pass.
     * @category Misc
     */
    callback(fn, thisObject, args) { // Maintainer: do not make args ...args. This method may acquire more arguments
        if (thisObject === 'this') {
            thisObject = this;
        }

        const { handler, thisObj } = this.resolveCallback(fn, thisObject);

        return args ? handler.apply(thisObj, args) : handler.call(thisObj);
    }

    resolveProperty(propertyPath) {
        let thisObj = this;

        while (thisObj) {
            if (Objects.hasPath(thisObj, propertyPath)) {
                return Objects.getPath(thisObj, propertyPath);
            }

            thisObj = thisObj.owner;
        }

        return undefined;
    }

    /**
     * Provides a way of locating callbacks which may have been specified as the _name_ of a function
     * and optionally adds scope resolution.
     *
     * For example, if the callback is specified as a string, then if it is prefixed with `'this.'`
     * then the function is resolved in this object. This is useful when configuring listeners
     * at the class level.
     *
     * If the callback name is prefixed with `'up.'` then the ownership hierarchy is queried
     * using the `owner` property until an object with the named function is present, then the
     * named function is called upon that object.
     * @param {String|Function} handler The function to call, or the name of the function to call.
     * @param {Object} thisObj The `this` object of the function.
     * @param {Boolean} [enforceCallability = true] Pass `false` if the function may not exist, and a null return value is acceptable.
     * @returns {Object} `{ handler, thisObj }`
     * @category Misc
     */
    resolveCallback(handler, thisObj = this, enforceCallability = true) {
        // It's a string, we find it in its own thisObj
        if (handler.substr) {
            if (handler.startsWith('up.')) {
                handler = handler.substr(3);

                // Empty loop until we find the function owner
                for (thisObj = this.owner; thisObj && !thisObj[handler]; thisObj = thisObj.owner);

                if (!thisObj) {
                    //<debug>
                    if (enforceCallability) {
                        throw new Error(`Function ${handler} not found in ownership hierarchy`);
                    }
                    //</debug>
                    return;
                }
            }
            else if (handler.startsWith('this.')) {
                handler = handler.substr(5);
                thisObj = this;
            }
            if (!thisObj || !(thisObj instanceof Object)) {
                //<debug>
                if (enforceCallability) {
                    throw new Error(`Named method ${handler} requires a thisObj object`);
                }
                //</debug>
                return;
            }
            if (typeof thisObj[handler] !== 'function') {
                //<debug>
                if (enforceCallability) {
                    throw new Error(`No method named ${handler} on ${thisObj.$$name || 'thisObj object'}`);
                }
                //</debug>
                return;
            }

            handler = thisObj[handler];
        }

        return { handler, thisObj };
    }

    bindCallback(inHandler, inThisObj = this) {
        if (inHandler) {
            const { handler, thisObj } = this.resolveCallback(inHandler, inThisObj);
            if (handler) {
                return handler.bind(thisObj);
            }
        }
    }

    /**
     * Delays the execution of the passed function by the passed time quantum, or if the time is omitted
     * or not a number, delays until the next animation frame. Note that this will use
     * {@link Core.mixin.Delayable#function-setTimeout} || {@link Core.mixin.Delayable#function-requestAnimationFrame}
     * if this class mixes in `Delayable`, otherwise it uses the global methods. The function will
     * be called using `this` object as its execution scope.
     * @param {Function} fn The function to call on a delay.
     * @param {Number} [by] The number of milliseconds to delay.
     * @private
     */
    delay(fn, by) {
        // Force scope on the fn if we are not a Delayable
        fn = this.setTimeout ? fn : fn.bind(this);

        const invoker = this.setTimeout ? this : BrowserHelper.global;
        invoker[typeof by === 'number' ? 'setTimeout' : 'requestAnimationFrame'](fn, by);
    }

    /**
     * Classes implement this method to provide custom cleanup logic before calling `super.doDestroy()`. The general
     * pattern is as follows:
     *
     * ```javascript
     *  class Foo extends Base {
     *      doDestroy() {
     *          // perform custom cleanup
     *
     *          super.doDestroy();
     *      }
     *  }
     * ```
     *
     * This method is called by {@link #function-destroy} which also prevents multiple calls from reaching `doDestroy`.
     * Prior to calling `doDestroy`, {@link #property-isDestroying} is set to `true`. Upon return, the object is fully
     * destructed and {@link #property-isDestroyed} is set to `true`.
     *
     * Do not call this method directly. Instead call {@link #function-destroy}.
     * @category Lifecycle
     */
    doDestroy() {
        const
            me = this,
            { nullify } = me.$meta;

        if (nullify) {
            for (let i = 0; i < nullify.length; ++i) {
                if (me[nullify[i].field] != null) {     // if backing property is null/undefined then skip
                    me[nullify[i].name] = null;         // else, call setter to run through change/update
                }
            }
        }
    }

    /**
     * Destroys the named properties if they have been initialized, and if they have a `destroy` method.
     * Deletes the property from this object. For example:
     *
     *      this.destroyProperties('store', 'resourceStore', 'eventStore', 'dependencyStore', 'assignmentStore');
     *
     * @param {String} properties The names of the properties to destroy.
     * @internal
     * @category Lifecycle
     */
    destroyProperties(...properties) {
        const me = this;

        let key, propertyValue;

        for (key of properties) {
            // If the value has *not* been pulled in from the configuration object yet
            // we must not try to access it, as that will cause the property to be initialized.
            if (key in me && (!me[configuringSymbol] || !me[configuringSymbol][key])) {
                propertyValue = me[key];
                if (propertyValue && propertyValue.destroy) {
                    propertyValue.destroy();
                }
                delete me[key];
            }
        }
    }

    /**
     * Called by the Base constructor to apply configs to this instance. This must not be called.
     * @param {Object} config The configuration object from which instance properties are initialized.
     * @private
     * @category Lifecycle
     */
    configure(config = {}) {
        //<debug>
        // Guard against instances being passed in an attempt to clone.
        if (!Objects.isObject(config)) {
            throw new Error('Raw object must be passed to configure');
        }
        //</debug>

        const
            me                  = this,
            { beforeConfigure } = config,
            configs             = me.$meta.configs,
            fullConfig          = me.getDefaultConfiguration();

        let cfg, key, value;

        me.initialConfig = config;

        // Important flag for setters to know whether they are being called during
        // configuration when this object is not fully alive, or whether it's being reconfigured.
        me.isConfiguring = true;

        // Assign any instance properties declared by the class.
        Object.assign(me, me.getProperties());

        // Apply configuration to default from class definition. This is safe because it's either chained from or a
        // fork of the class values.
        for (key in config) {
            value = config[key];
            cfg   = configs[key];

            fullConfig[key] = cfg ? cfg.merge(value, fullConfig[key], null) : value;
        }

        if (beforeConfigure) {
            delete fullConfig.beforeConfigure;

            // noinspection JSValidateTypes
            beforeConfigure(me, fullConfig);
        }

        // Cache me.config for use by get config.
        me.setConfig(me[originalConfigSymbol] = fullConfig, true);

        me.isConfiguring = false;
    }

    /**
     * Returns the value of the specified config property. This is a method to allow
     * property getters to be explicitly called in a way that does not get optimized out.
     *
     * The following triggers the getter call, but optimizers will remove it:
     *
     *      inst.foo;   // also raises "expression has no side-effects" warning
     *
     * Instead, do the following to trigger a getter:
     *
     *      inst.getConfig('foo');
     *
     * @param {String} name
     * @internal
     * @category Configuration
     */
    getConfig(name) {
        return this[name];
    }

    /**
     * Sets configuration options this object with all the properties passed in the parameter object.
     * Timing is taken care of. If the setter of one config is called first, and references
     * the value of another config which has not yet been set, that config will be set just
     * in time, and the *new* value will be used.
     * @param {Object} config An object containing configurations to change.
     * @category Lifecycle
     */
    setConfig(config, isConstructing) {
        const
            me             = this,
            wasConfiguring = me[configuringSymbol],
            configDone     = wasConfiguring ? me.configDone : (me.configDone = {}),
            configs        = me.$meta.configs;

        let cfg, key;

        me[instancePropertiesSymbol] = {};
        // Cache configuration for use by injected property initializers.
        me[configuringSymbol]        = wasConfiguring ? Object.setPrototypeOf(Object.assign({}, config), wasConfiguring) : config;

        // For each incoming non-null configuration, create a temporary getter which will
        // pull the value in from the initialConfig so that it doesn't matter in
        // which order properties are set. You can access any property at any time.
        for (key in config) {
            // Don't default null configs in unless it's a direct property of the
            // the passed configuration. When used at construct time, defaultConfigs
            // will be prototype-chained onto the config.
            if (config[key] != null || hasOwnProperty.call(config, key)) {
                cfg = configs[key] || Config.get(key);

                cfg.defineInitter(me, config[key]);

                if (!isConstructing) {
                    configDone[key] = false;
                }
                else if (cfg.lazy) {
                    configDone[key] = true;
                }
            }
            else {
                configDone[key] = true;
            }
        }

        if (isConstructing) {
            me.startConfigure(config);
        }

        // Set all our properties from the config object.
        // If one of the properties needs to access a property that has not
        // yet been set, the above temporary property will pull it through.
        // Can't use Object.assign because that only uses own properties.
        // config value blocks are prototype chained subclass->superclass
        for (key in config) {
            // Only push the value through if the property initializer is still present.
            // If it gets triggered to pull the configuration value in, it deleted itself.
            if (!configDone[key]) {
                me[key] = config[key];
            }
        }

        if (wasConfiguring) {
            me[configuringSymbol] = wasConfiguring;
        }
        else {
            delete me[configuringSymbol];
        }

        if (isConstructing) {
            me.finishConfigure(config);
        }

        return me;
    }

    /**
     * Returns `true` if this instance has a non-null value for the specified config. This will not activate a lazy
     * config.
     *
     * @param {String} name The name of the config property.
     * @returns {Boolean}
     * @internal
     */
    hasConfig(name) {
        const
            me             = this,
            lazyConfig     = me[lazyConfigsSymbol],
            config         = me[configuringSymbol],
            hasValue       = me['_' + name] != null,
            hasLazyValue   = lazyConfig?.[name] != null,
            hasConfigValue = Boolean(
                !me.configDone[name] &&
                (config && (config[name] != null || hasOwnProperty.call(config, name)))
            );

        return hasValue || hasLazyValue || hasConfigValue;
    }

    /**
     * Ensures that the specified config is initialized if it is needed. If there is a config value specified, and it
     * was initialized by this call, this method returns `true`. If there was a config value specified, and it was
     * already initialized, this method returns `false`. If there was no value specified for the given config, this
     * method returns `null`.
     *
     * This is different than just reading the property because some property getters exist that do not actually just
     * read the config value back, but instead produce some result. Reading such properties to incidentally trigger a
     * possible config initializer can lead to incorrect results. For example, the Combo items config.
     *
     * @param {String} name The name of the config property.
     * @returns {Boolean}
     * @internal
     */
    triggerConfig(name) {
        const
            { configDone } = this,
            config         = this[configuringSymbol],
            triggered      = (config && (config[name] != null || hasOwnProperty.call(config, name)))
                ? !configDone[name] : null;

        if (triggered) {
            this.getConfig(name);
        }

        return triggered;
    }

    onConfigChange() {} // declared above because lint/IDE get angry about not declaring the args...
    /**
     * This method is called when any config changes.
     * @param {Object} info Object containing information regarding the config change.
     * @param {String} info.name The name of the config that changed.
     * @param {*} info.value The new value of the config.
     * @param {*} info.was The previous value of the config.
     * @param {Core.Config} info.config The `Config` object for the changed config property.
     * @method onConfigChange
     * @internal
     * @category Configuration
     */

    /**
     * Returns a *copy* of the full configuration which was used to configure this object.
     * @property {Object}
     * @category Lifecycle
     * @readonly
     */
    get config() {
        const
            result   = {},
            myConfig = this[originalConfigSymbol];

        // The configuration was created as a prototype chain of the class hierarchy's
        // defaultConfig values hanging off a copy of the initialConfig object, so
        // we must loop and copy since Object.assign only copies own properties.
        for (const key in myConfig) {
            result[key] = myConfig[key];
        }

        return result;
    }

    /**
     * Registers this class type with its Factory
     */
    static initClass() {
        return this.$meta.class;
    }

    /**
     * The class's {@link #property-$meta-static meta} object.
     * @property {Object}
     * @name $meta
     * @internal
     * @category Misc
     */

    /**
     * An object owned by this class that does not share properties with its super class.
     *
     * This object may contain other properties which are added as needed and are not documented here.
     *
     * @property {Object} $meta The class meta object.
     * @property {Function} $meta.class The class constructor that owns the meta object.
     * @property {Object} $meta.super The `$meta` object for the super class. This is `null` for `Base`.
     * @property {Object} $meta.config The object holding the default configuration values for this class.
     * @property {Object} $meta.configs An object keyed by config name that holds the defined configs for the class.
     * The value of each property is a {@link Core/Config} instance.
     * @property {Boolean} $meta.forkConfigs This will be `true` if the default configuration values for this class
     * (in the `config` property of the meta object) must be forked to avoid object sharing, or if the object can be
     * passed to `Object.create()` for efficiency.
     * @property {Array} $meta.hierarchy The array of classes in the ancestry of this class. This will start with
     * `Base` at index 0 and ends with this class.
     * @property {Array} $meta.properties The array of classes that define a "static get properties()" getter.
     * @internal
     * @static
     * @category Misc
     */
    static get $meta() {
        const me = this;
        let meta = me[metaSymbol];

        if (!hasOwnProperty.call(me, metaSymbol)) {
            me[metaSymbol] = meta = newMeta();

            meta.class = me;

            me.setupClass(meta);
        }

        return meta;
    }

    /**
     * This optional class method is called when a class is mixed in using the {@link #function-mixin-static mixin()}
     * method.
     * @internal
     */
    static onClassMixedIn() {
        // empty
    }

    /**
     * Returns the merge of the `baseConfig` and `config` config objects based on the configs defined by this class.
     * @param {Object} baseConfig The base config or defaults.
     * @param {...Object} configs One or more config objects that takes priority over `baseConfig`.
     * @returns {Object}
     * @internal
     */
    static mergeConfigs(baseConfig, ...configs) {
        const
            classConfigs = this.$meta.configs,
            result       = Objects.clone(baseConfig) || {};

        let config, i, key, value;

        for (i = 0; i < configs.length; ++i) {
            config = configs[i];

            if (config) {
                for (key in config) {
                    value = config[key];

                    if (classConfigs[key]) {
                        value = classConfigs[key].merge(value, result[key]);
                    }
                    else if (result[key] && value) {
                        value = Config.merge(value, result[key]);
                    }

                    result[key] = value;
                }
            }
        }

        return result;
    }

    /**
     * Applies one or more `mixins` to this class and returns the produced class constructor.
     *
     * For example, instead of writing this:
     * ```
     *  class A extends Delayable(Events(Localizable(Base))) {
     *      // ...
     *  }
     * ```
     *
     * Using this method, one would write this:
     * ```
     *  class A extends Base.mixin(Localizable, Events, Delayable) {
     *      // ...
     *  }
     * ```
     * If one of the mixins specified has already been mixed into the class, it will be ignored and not mixed in a
     * second time.
     * @param {...Function} mixins
     * @returns {Function}
     */
    static mixin(...mixins) {
        // Starting w/the first class C = this
        let C = this,
            i;

        // wrap each class C using mixins[i] to produce the next class
        for (i = 0; i < mixins.length; ++i) {
            const
                mixin = mixins[i],
                // Grab or create a unique Symbol for this mixin so we can tell if we've already mixed it in
                tag   = mixin[mixinTagSymbol] || (mixin[mixinTagSymbol] = Symbol('mixinTag'));

            if (C[tag]) {
                continue;
            }

            C      = mixin(C);
            C[tag] = true;  // properties on the constructor are inherited to subclass constructors...

            if (hasOwnProperty.call(C, 'onClassMixedIn')) {
                C.onClassMixedIn();
            }
        }

        return C;
    }

    /**
     * This method is called only once for any class. This can occur when the first instance is created or when the
     * `$meta` object is first requested.
     * @param {Object} meta The `$meta` object for the class.
     * @internal
     * @category Misc
     */
    static setupClass(meta) {
        const
            cls   = meta.class,
            // Trigger setupClass on the super class (if it has yet to happen):
            base  = getPrototypeOf(cls).$meta,
            name  = cls.$$name,
            names = base.names,
            proto = cls.prototype;

        defineProperty(proto, '$meta', {
            value : meta
        });

        Object.assign(meta, {
            super       : base,
            config      : Object.create(base.config),
            configs     : Object.create(base.configs),
            declarables : base.declarables,
            forkConfigs : base.forkConfigs,
            hierarchy   : Object.freeze([...base.hierarchy, cls]),
            names       : names.includes(name) ? names : Object.freeze([...names, name]),
            properties  : base.properties,
            nullify     : base.nullify?.slice()
        });

        if (names !== meta.names) {
            const is = 'is' + name;

            if (!hasOwnProperty.call(proto, is)) {
                defineProperty(proto, is, {
                    value : true
                });
            }

            if (!hasOwnProperty.call(cls, is)) {
                defineProperty(cls, is, {
                    value : true
                });
            }
        }

        // NOTE: we always use meta.declarables because setupDeclarable() can replace the array on the meta object
        // when new declarable properties are added...
        for (let decl, setupName, i = 0; i < meta.declarables.length; ++i) {
            decl = meta.declarables[i];

            if (hasOwnProperty.call(cls, decl)) {
                setupName = setupNames[decl] || (setupNames[decl] = `setup${StringHelper.capitalize(decl)}`);
                cls[setupName](cls, meta);
            }
        }

        /*  Add slash to the front of this line to enable the diagnostic block:
        //<debug>
        // Detect class derived from configurable classes that have colliding methods:
        if (!hasOwnProperty.call(cls, 'configurable') && !VersionHelper.isTestEnv) {
            const warn = console.warn.direct || console.warn;

            for (const cfg of Object.values(meta.configs)) {
                if (!cfg.simple) {
                    const desc = Object.getOwnPropertyDescriptor(proto, cfg.name);

                    if (desc) {
                        warn(`${cls.name}.${cfg.name} overridden`, desc);
                    }

                    if (hasOwnProperty.call(proto, cfg.changer)) {
                        warn(`${cls.name}.${cfg.name} has changer`);
                    }

                    if (hasOwnProperty.call(proto, cfg.updater)) {
                        warn(`${cls.name}.${cfg.name} has updater`);
                    }
                }
            }
        }
        //</debug>
        /**/
    }

    /**
     * This method is called as part of `setupClass()`. It will process the `configurable()` return object and the
     * `defaultConfig` return object.
     * @param {Object} meta The `meta` object for this class.
     * @param {Object} configs The config definition object.
     * @param {Boolean} simple `true` when processing `defaultConfig` and `false` when processing `configurable`.
     * @private
     * @category Configuration
     */
    static setupConfigs(meta, configs, simple) {
        const
            classConfigValues = meta.config,
            classConfigs      = meta.configs,
            proto             = meta.class.prototype;

        let { nullify } = meta,
            cfg, options, value, wasNullify;

        for (const name in configs) {
            value = configs[name];

            if (simple) {
                // Using "defaultConfig"
                if (!(cfg = classConfigs[name])) {
                    cfg = Config.get(name, defaultConfigOptions);
                }
                else {
                    // The property may be declared in a base class using configurable(), so it may have special
                    // merge processing:
                    value = cfg.merge(value, classConfigValues[name], meta);
                }

                /*  Add slash to the front of this line to enable the diagnostic block:
                //<debug>
                if (!VersionHelper.isTestEnv) {
                    const warn = console.warn.direct || console.warn;

                    if (hasOwnProperty.call(proto, cfg.changer)) {
                        warn(`${meta.class.name}.${cfg.name} has changer`);
                    }

                    if (hasOwnProperty.call(proto, cfg.updater)) {
                        warn(`${meta.class.name}.${cfg.name} has updater`);
                    }
                }
                //</debug>
                /**/
            }
            else {
                // Using "configurable"
                options = null;

                if (value && typeof value === 'object' && '$config' in value) {
                    options = value.$config;

                    if (options && !Objects.isObject(options)) {
                        options = Objects.createTruthyKeys(options);
                    }

                    if ('default' in value) {
                        defineProperty(proto, Config.get(name).field, {
                            configurable : true,
                            writable     : true,   // or else "this._value = x" will fail
                            value        : value.default
                        });
                    }

                    value = value.value;
                }

                if (!(cfg = classConfigs[name])) {
                    cfg = Config.get(name, options);

                    cfg.define(meta.class.prototype);

                    wasNullify = false;
                }
                else {
                    wasNullify = cfg.nullify;

                    if (options) {
                        // Defined by a base class, but maybe being adjusted by derived.
                        cfg = cfg.extend(options);

                        // In the future, we may need to redefine the property here if options affect the descriptor (such
                        // as event firing)
                    }

                    value = cfg.merge(value, classConfigValues[name], meta);
                }

                if (cfg.nullify && !wasNullify) {
                    (nullify || (nullify = (meta.nullify || (meta.nullify = [])))).push(cfg);
                }
            }

            // If any default properties are *mutable* Objects or Array we need to clone them.
            // so that instances do not share configured values.
            if (value && (Objects.isObject(value) || Array.isArray(value)) && !Object.isFrozen(value)) {
                meta.forkConfigs = true;
            }

            classConfigs[name]      = cfg;
            classConfigValues[name] = value;
        }
    }

    static setupConfigurable(cls, meta) {
        cls.setupConfigs(meta, cls.configurable, false);
    }

    static setupDefaultConfig(cls, meta) {
        cls.setupConfigs(meta, cls.defaultConfig, true);
    }

    static setupDeclarable(cls, meta) {
        const declarable = cls.declarable;

        let all = meta.declarables,
            forked, i;

        for (i = 0; i < declarable.length; ++i) {
            if (!all.includes(declarable[i])) {
                if (!forked) {
                    meta.declarables = forked = all = all.slice();
                }

                all.push(declarable[i]);
            }
        }
    }

    static setupProperties(cls, meta) {
        meta.properties = meta.super.properties.slice();
        meta.properties.push(cls);

        Object.freeze(meta.properties);
    }

    static setupPrototypeProperties(cls) {
        Object.assign(cls.prototype, cls.prototypeProperties);
    }

    /**
     * Gets the full {@link #property-defaultConfig-static} block for this object's entire inheritance chain
     * all the way up to but not including {@link Core.Base}
     * @return {Object} All default config values for this class.
     * @private
     * @category Configuration
     */
    getDefaultConfiguration() {
        return this.constructor.getDefaultConfiguration();
    }

    /**
     * Gets the full {@link #property-defaultConfig-static} block for the entire inheritance chain for this class
     * all the way up to but not including {@link Core.Base}
     * @return {Object} All default config values for this class.
     * @private
     * @category Configuration
     */
    static getDefaultConfiguration() {
        const
            meta   = this.$meta,
            config = meta.forkConfigs ? Base.fork(meta.config) : Object.create(meta.config);

        if (VersionHelper.isTestEnv && BrowserHelper.isBrowserEnv &&
            config.testConfig && BrowserHelper.global.__applyTestConfigs) {
            for (const o in config.testConfig) {
                config[o] = config.testConfig[o];
            }
        }

        return config;
    }

    static fork(obj) {
        let ret = obj,
            key, value;

        if (obj && Objects.isObject(obj) && !Object.isFrozen(obj)) {
            ret = Object.create(obj);

            for (key in obj) {
                value = obj[key];

                if (value) {
                    if (Objects.isObject(value)) {
                        ret[key] = Base.fork(value);
                    }
                    else if (Array.isArray(value)) {
                        ret[key] = value.slice();
                    }
                }
            }
        }

        return ret;
    }

    /**
     * Gets the full {@link #property-properties-static} block for this class's entire inheritance chain
     * all the way up to but not including {@link Core.Base}
     * @return {Object} All default config values for this class.
     * @private
     * @category Configuration
     */
    getProperties() {
        const
            // The meta.properties array is an array of classes that define "static get properties()"
            hierarchy = this.$meta.properties,
            result    = {};

        // TODO: if properties block does not change this could be cached? would speed up loading of big data sets
        //  into grid. The problem is that this call creates new (i.e., non-shared) instances of objects, arrays and
        //  Map objects that apply to each instance. These would all need to be cloned so it may be better to just
        //  call the properties getter each time and let it create new instances of whatever types.

        //for (cls of hierarchy) { // for-of transpiles badly and this is called a lot
        for (let i = 0; i < hierarchy.length; i++) {
            // Gather the class result in top-down order so that subclass properties override superclass properties
            Object.assign(result, hierarchy[i].properties);
        }

        return result;
    }

    static get superclass() {
        return getPrototypeOf(this);
    }

    /**
     * Used by the Widget and GridFeatureManager class internally. Returns the class hierarchy of this object
     * starting from the `topClass` class (which defaults to `Base`).
     *
     * For example `classHierarchy(Widget)` on a Combo would yield `[Widget, Field, TextField, PickerField, Combo]`
     * @param {Function} [topClass] The topmost class constructor to start from.
     * @returns {Function[]} The class hierarchy of this instance.
     * @private
     * @category Configuration
     */
    classHierarchy(topClass) {
        const
            hierarchy = this.$meta.hierarchy,
            index     = topClass ? hierarchy.indexOf(topClass) : 0;

        return (index > 0) ? hierarchy.slice(index) : hierarchy;
    }

    /**
     * Checks if an obj is of type using object's $$name property and doing string comparison of the property with the
     * type parameter.
     *
     * @param {String} type
     * @return {Boolean}
     */
    static isOfTypeName(type) {
        return this.$meta.names.includes(type);
    }

    /**
     * Removes all event listeners that were registered with the given `name`.
     * @param {String} name The name of the event listeners to be removed.
     * @category Events
     */
    detachListeners(name) {
        let detachers = this.$detachers;

        detachers = detachers?.[name];

        if (detachers) {
            while (detachers.length) {
                detachers.pop()();
            }
        }
    }

    /**
     * Tracks a detacher function for the specified listener name.
     * @param {String} name The name assigned to the associated listeners.
     * @param {Function} detacher The detacher function.
     * @private
     */
    trackDetacher(name, detacher) {
        const
            detachers = this.$detachers || (this.$detachers = {}),
            bucket    = detachers[name] || (detachers[name] = []);

        bucket.push(detacher);
    }

    /**
     * Removes all detacher functions for the specified `Events` object. This is called
     * by the `removeAllListeners` method on that object which is typically called by its
     * `destroy` invocation.
     * @param {Core.mixin.Events} eventer The `Events` instance to untrack.
     * @private
     */
    untrackDetachers(eventer) {
        const detachers = this.$detachers;

        if (detachers) {
            for (const name in detachers) {
                const bucket = detachers[name];

                for (let i = bucket.length; i-- > 0; /* empty */) {
                    if (bucket[i].eventer === eventer) {
                        bucket.splice(i, 1);
                    }
                }
            }
        }
    }
}

const proto = Base.prototype;

// Informs the standard config setter there is no need to call this fn:
proto.onConfigChange.$nullFn = true;

Base[metaSymbol] = proto.$meta = newMeta({
    class       : Base,
    config      : Object.freeze({}),
    configs     : Object.create(null),
    declarables : Base.declarable,
    forkConfigs : false,
    hierarchy   : Object.freeze([Base]),
    names       : Object.freeze(['Base']),
    nullify     : null,
    properties  : Object.freeze([]),
    super       : null
});

// Avoid some object shape changes:
Object.assign(proto, {
    $detachers : null,

    configObserver : null,

    /**
     * This property is set to `true` by {@link #function-destroy} after the {@link #function-doDestroy} method returns.
     * It is also one of the few properties that remains on the object after returning from `destroy()`. This property
     * is often checked in code paths that may encounter a destroyed object (like some event handlers) or in the
     * destruction path during cleanup.
     * @member {Boolean}
     * @readonly
     * @category Lifecycle
     */
    isDestroyed : false,

    /**
     * This property is set to `true` on entry to the {@link #function-destroy} method. It remains on the objects after
     * returning from `destroy()`. If {@link #property-isDestroyed} is `true`, this property will also be `true`, so
     * there is no need to test for both (for example, `comp.isDestroying || comp.isDestroyed`).
     * @member {Boolean}
     * @readonly
     * @category Lifecycle
     */
    isDestroying : false
});

//<debug>
if (BrowserHelper.isBrowserEnv) {
    window.bryntum.isDebug = true;
}

Base.DEBUG = true;
//</debug>



VersionHelper.setVersion('core', '4.2.3');
