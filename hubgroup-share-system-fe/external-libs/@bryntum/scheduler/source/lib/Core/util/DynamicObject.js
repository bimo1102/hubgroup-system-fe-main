import Base from '../Base.js';
import FunctionHelper from '../helper/FunctionHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';

/**
 * @module Core/util/DynamicObject
 */

const PENDING = Symbol('pendingCreate');

/**
 * This class is used to manage dynamic creation and configuration of individual properties of an object. This pattern
 * is used to allow the names of an object to each represent a dynamically instantiated object. For example, the
 * `features` config of Calendar is defined like so:
 *
 * ```javascript
 *  class Calendar extends ... {
 *      static get configurable() {
 *          return {
 *              features : {
 *                  drag : {
 *                      // configs for Drag feature
 *                  }
 *              }
 *          }
 *      }
 *  }
 * ```
 * This class is used to manage the `features` objects in the above case. The `drag` property value is promoted from
 * the config object defined by the class and user instance on first request. Like config properties themselves, these
 * features may access other features during their initialization. These accesses are trapped by this class to ensure
 * the config object is promoted to an instantiated instance.
 *
 * A {@link #config-factory} is provided to this object to allow it to create instances from names like `'drag'`.
 * @internal
 */
export default class DynamicObject extends Base {
    static get prototypeProperties() {
        return {
            /**
             * Optional function that will be passed an instance prior to destroying it.
             * @param {String} name The property name in the Dynamic object by which the new instance may be referenced.
             * @param {Object} instance The value of the property.
             * @config {Function}
             */
            cleanup : null,

            /**
             * Optional name of the config property managed by this instance. If changes are made directly, this
             * property is used to run the `onConfigChange` method of the `owner`.
             * @config {String}
             */
            configName : null,

            /**
             * Optional function to call as instances are created. Each new instance is passed to this function.
             * @param {Object} instance The newly created instance.
             * @param {String} key The property name in the dynamic object by which the new instance may be referenced.
             * @config {Function}
             */
            created : null,

            /**
             * The {@link Core.mixin.Factoryable factory} to use to create instances.
             * @config {Object}
             */
            factory : null,

            /**
             * By default, the name of the member is used for the type. Set this config to `true` to also allow the
             * config object for a property to contain a `type` property. Set this to `false` to ignore the name of the
             * member and rely on the {@link #config-factory} to process the config object.
             * @config {Boolean|String}
             * @default
             */
            inferType : 'name',

            /**
             * The owning object to pass along to the instances as the `ownerName` property.
             * @config {Object}
             */
            owner : null,

            /**
             * The property name by which to store the `owner` on each instance.
             * @config {String}
             */
            ownerName : null,

            /**
             * Set to `false` to prevent using a `Proxy` even if that JavaScript platform feature is available. Using
             * a `Proxy` is ideal because it allows for all forms of access to the dynamic properties to be handled
             * instead of only those that have predefined configuration values.
             * @config {Boolean}
             * @private
             */
            proxyable : typeof Proxy !== 'undefined',

            /**
             * Optional function that will be passed a config object prior to instantiating an object. This function
             * can either modify the passed object or return a new object.
             * @param {Object} config The config object used to create the object
             * @param {String} name The property name in the Dynamic object by which the new instance may be referenced.
             * @config {Function}
             */
            setup : null,

            /**
             * Optional function that will be passed a raw config object prior to processing and the value it returns
             * replaces the raw value. This function is used to transform strings or arrays (for example) into proper
             * config objects.
             * @param {*} config The original value of the config object parameter
             * @config {Function}
             */
            transform : null
        };
    }

    static get properties() {
        return {
            /**
             * Holds config objects for each defined object. These are used to hold class and instance config values
             * and use them to create instances on first request, or when `flush()` is called. Further, if the instance
             * is initially assigned instead of retrieved, these values act as the defaults for the instance and are
             * combined with those provided in the assignment.
             * @member {Object} defaults
             * @private
             */
            defaults : {},

            /**
             * This object holds the actual instances that are retrieved by the dynamic accessor or `Proxy`.
             * @member {Object} instances
             * @private
             */
            instances : {},

            /**
             * The object that contains the dynamic accessors for each instance. This object is not used when using a
             * `Proxy`.
             * @member {Object} object
             * @private
             */
            object : Object.create({})
        };
    }

    /**
     * Returns the `Proxy` instance used to manage dynamic assignments. If the JavaScript platform does not support the
     * `Proxy` class, this will be `null`.
     * @property {Proxy}
     * @private
     */
    get proxy() {
        const me = this;

        let proxy = null;

        if (me.proxyable) {
            proxy = new Proxy(me.instances, {
                get(o, name) {
                    return me.get(name);
                },
                set(o, name, value) {
                    me.set(name, value);
                    return true;
                },
                deleteProperty(o, name) {
                    me.set(name, null);
                    return true;
                }
            });
        }

        // Replace our getter with the result for quicker future use.
        Reflect.defineProperty(me, 'proxy', {
            configurable : true,  // allow destroy() to delete it
            value        : proxy
        });

        return proxy;
    }

    /**
     * Returns the object that contains the dynamic properties. This may be a `Proxy` instance or an object with getter
     * and setter accessors.
     * @property {Object}
     * @internal
     */
    get target() {
        return this.proxy || this.object;
    }

    /**
     * This method establishes the initial definition of a dynamic property. When using a `Proxy`, this method simply
     * needs to cache away the initial config for use by the getter. When `Proxy` is unavailable, this method will
     * also defined a getter/setter to intercept access to the dynamic property.
     * @param {String} name The name of the dynamic property.
     * @param {Object} config The initial config object for the dynamic property.
     * @private
     */
    define(name, config) {
        const
            me            = this,
            { transform } = me,
            transformed   = transform ? transform(config, name) : config,
            instantiated  = ObjectHelper.isInstantiated(transformed);

        me.instances[name] = PENDING;

        if (!instantiated) {
            me.setDefaults(name, transformed);
        }

        // We provide get/set accessors on our `object` so that we can create the instance on first use and provide
        // the correct defaults. The setter also handles reassignment and reconfiguration. These accessors are
        // placed on the prototype of `object` so that we can add/remove the same accessors from `object` itself.
        // This allows users of the object to see the correct number of "own" keys for enumeration.
        me.defineProp(name, true);

        if (instantiated) {
            me.set(name, transformed);
        }
    }

    /**
     * Define the get/set accessors for `name` on our `object` or its prototype.
     * @param {String} name
     * @param {Boolean} [base] Pass `true` to indicate the property should be defined on the prototype.
     * @private
     */
    defineProp(name, base) {
        const
            me = this,
            { object } = me;

        if (!me.proxy) {
            Reflect.defineProperty(base ? Object.getPrototypeOf(object) : object, name, {
                configurable : !base,
                enumerable   : true,

                get() {
                    return me.get(name);
                },

                set(value) {
                    return me.set(name, value);
                }
            });
        }
    }

    /**
     * Ensures that all defined members are touched to trigger their creation.
     * @internal
     */
    flush() {
        const me = this;

        // Iterate the defaults object to loop over all the defined items:
        try {
            me.updating = true;

            for (const name in me.defaults) {
                me.get(name);
            }

            me.afterConfigureOwner = me.afterConfigureOwner?.();
        }
        finally {
            me.updating = false;
        }
    }

    /**
     * Returns (lazily creating as necessary) the value of a dynamic property given its name.
     * @param {String} name
     * @returns {Object}
     * @private
     */
    get(name) {
        const { defaults, instances } = this;

        if (instances[name] === PENDING) {
            this.set(name, PENDING);
        }

        // Return null for defined instances that have been nulled out and undefined otherwise:
        return instances[name] || (defaults[name] && null);
    }

    /**
     * Sets the value of a dynamic property given its name and value.
     * @param {String} name
     * @param {Object} value
     * @private
     */
    set(name, value) {
        const
            me = this,
            { cleanup, configName, defaults, factory, instances, owner, setup, transform, updating } = me,
            inform = owner && configName && !updating,
            was = (instances[name] === PENDING) ? null : instances[name],
            instance = factory.reconfigure(was, (value === PENDING) ? {} : (value || null), {
                cleanup   : cleanup && (instance => cleanup(instance, name)),
                defaults  : defaults[name] || me.setDefaults(name, {}),
                owner     : me.owner,
                setup     : setup && ((config, type, defaults) => setup(config, name, type, defaults)),
                transform : transform && (config => transform(config, name))
            });

        if (instance !== was) {
            const before = inform && { ...instances };

            instances[name] = instance;

            if (instance) {
                me.defineProp(name);
                me.created?.(instance, name);
            }
            else {
                delete me.object[name];
                delete instances[name];
            }

            if (inform) {
                owner.onConfigChange({
                    name   : configName,
                    config : owner.$meta.configs[configName],
                    value  : me.target,
                    was    : before
                });
            }
        }
    }

    /**
     * Stores the default config values for use in the factory reconfiguration process.
     * @param {String} name The name and default type of the dynamic property. Depending on {@link #config-inferType},
     * this may not be overridden by a type property in the config object.
     * @param {Object} config The config object.
     * @returns {Object}
     * @private
     */
    setDefaults(name, config) {
        const
            { defaults, factory, inferType, instances, owner, ownerName } = this,
            { typeKey } = factory.factoryable;

        config = (config === true) ? {} : ObjectHelper.assign({}, config);  // copy props even from prototype

        if (inferType === 'name' || (inferType === true && !config[typeKey])) {
            config[typeKey] = name;
        }

        // Store this object as the "owner" on the config object so instances can access their creating object:
        if (ownerName) {
            config[ownerName] = owner;
        }

        config.beforeConfigure = instance => {
            // Ensure the feature is injected into the features object before initialization so that it is
            // available to call chains from its initialization.
            instances[name] = instance;
        };

        return defaults[name] = config;
    }

    /**
     * Updates the members of `object` based on the provided configuration.
     * @param {Object} members The configuration for the instances of `object`.
     * @internal
     */
    update(members) {
        const
            me = this,
            { owner } = me;

        let name, config;

        try {
            me.updating = true;

            if (members) {
                // We prime the features so that if any configuration code accesses a feature, it will self initialize,
                // but if not, they will remain in a primed state until afterConfigure.
                for (name in members) {
                    config = members[name];

                    if (me.defaults[name]) {  // if (already defined)
                        me.set(name, config);
                    }
                    else if (config) {
                        me.define(name, config);
                    }
                }

                // NOTE: we leave alone any existing features that were not present in the given object. To remove a
                // feature, you must set it to null or set all features to null.
            }
            else {
                for (name in me.instances) {
                    me.set(name, null);
                }
            }
        }
        finally {
            me.updating = false;
        }

        if (owner) {
            // Normally we wait for afterConfigure to create all the objects, but if we are being called after that
            // point in the life cycle, we need to flush them out now. We still use the same delay technique in case
            // the user adds multiple properties dynamically.
            if (!owner.isConfiguring) {
                me.flush();
            }
            else if (!me.afterConfigureOwner) {
                // Since we are being called while the owner isConfiguring, set a hook on owner.afterConfigure() so
                // that we can make good on creating the child objects.
                me.afterConfigureOwner = FunctionHelper.before(owner, 'afterConfigure', 'flush', me);
            }
        }
    }
}

DynamicObject.initClass();
