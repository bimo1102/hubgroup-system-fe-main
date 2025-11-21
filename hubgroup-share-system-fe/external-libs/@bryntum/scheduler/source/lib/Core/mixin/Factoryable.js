import Base from '../Base.js';
import StringHelper from '../helper/StringHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import BrowserHelper from '../helper/BrowserHelper.js';

/**
 * @module Core/mixin/Factoryable
 */

const
    { defineProperty } = Reflect,
    ownerSymbol        = Symbol('owner'),
    typeSplitRe        = /[\s,]+/;

/**
 * This mixin is applied to base classes of a type that will be dynamically created by type name aliases.
 * ```
 *  class Layout extends Base.mixin(Factoryable) {
 *      static get factoryable() {
 *          return {
 *              defaultType : 'default'
 *          };
 *      }
 *
 *      static get type() {
 *          return 'default';
 *      }
 *  }
 *
 *  class Fit extends Layout {
 *      static get type() {
 *          return 'fit';
 *      }
 *  }
 * ```
 *
 * Once a family of classes has been defined, instances are created using the `create()` method:
 * ```
 *  const layout = Layout.create(config);
 * ```
 *
 * In the above example, `config` can be a type name (such as "fit") or a config object with a `type` property that
 * holds the type name.
 *
 * Factories can also extend other factories. For example, one factory creates objects that are useful across a wide
 * range of consumers, and a second factory creates objects for a more specialized consumer. If that specialized
 * consumer can also consume objects from the first factory, then the second factory can specify this relationship:
 * ```
 *  class General extends Base.mixin(Factoryable) {
 *      ...
 *  }
 *
 *  class Specialized extends Base.mixin(Factoryable) {
 *      static get factoryable() {
 *          return {
 *              extends : General,
 *              ...
 *          };
 *      }
 *  }
 * ```
 * The `extends` factoryable option can be either a class that mixes in `Factoryable` or an array of such classes.
 * @mixin
 * @internal
 */
export default Target => class Factoryable extends (Target || Base) {
    static get $name() {
        return 'Factoryable';
    }

    static get declarable() {
        return [
            /**
             * This property getter returns options that control the factory process. This property getter must be
             * defined by the class that mixes in `Factoryable` in order to initialize the factory properly.
             * ```
             *  static get factoryable() {
             *      return {
             *          defaultType : 'default'
             *      };
             *  }
             * ```
             * If there are no special options to provide, this method can return nothing (`undefined`):
             * ```
             *  static get factoryable() {
             *      // initialize the factory with all default options
             *  }
             * ```
             * @static
             * @member {Object} factoryable
             * @property {Boolean} [factoryable.caseless=true] Specify `false` to use case-sensitive type names. The
             * default is to ignore case.
             * @property {String} [factoryable.defaultType=null] The default type to create when a config object has
             * no `typeKey` property.
             * @property {Function|Function[]} [factoryable.extends] One or more classes that mix in `Factoryable` to
             * use for resolving type names when a type name is not found in this factory.
             * @property {String} [factoryable.typeKey='type'] The name of the property in a config object that holds
             * the type name.
             * @internal
             */
            'factoryable',

            /**
             * One or more additional type name aliases for this class. This can be useful for renaming and maintaining
             * a previous type name.
             * ```
             *  class Fit extends Layout {
             *      static get type() {
             *          return 'fit';
             *      }
             *
             *      static get alias() {
             *          return 'fill';  // deprecated type name (now known as 'fit')
             *      }
             *  }
             * ```
             * @static
             * @member {String|String[]} alias
             * @internal
             */
            'alias',

            /**
             * The (canonical) type name for this class by which instances can be created using the static
             * {@link #function-create-static create()} method.
             * @static
             * @member {String} type
             */
            'type'
        ];
    }

    /**
     * Registers a class (`cls`) associated with the given `type`.
     * @param {String|String[]} type A string, array of strings or a comma-separated string containing the type names
     * for the specified `cls` class.
     * @param {Function} cls The class (constructor function)
     * @param {Boolean} [replace] Pass `true` to overwrite existing registered types. Otherwise, this method will throw
     * an exception if the `type` is already registered with this factory.
     * @internal
     */
    static register(type, cls, replace = BrowserHelper.global.__BRYNTUM_EXAMPLE) {
        // `replace` default value is set to true while we are run inside a bryntum demo where code editor changes might
        // lead to same widget class being registered over and over.
        const
            { factoryable }        = this.initClass(),
            { caseless, registry } = factoryable,
            types                  = StringHelper.split(type, typeSplitRe);  // if type is a string[] it will just be returned

        for (let lower, name, i = 0; i < types.length; ++i) {
            name = types[i];
            lower = caseless ? name.toLowerCase() : name;

            if (!replace && lower in registry) {
                throw new Error(`Type "${name}" already registered with ${factoryable.class.name} factory`);
            }

            // Ensure class being registered is initialized. (initClass returns the class)
            registry[name] = registry[lower] = cls.initClass();
        }
    }

    /**
     * Returns 'true` if the passed instance is of the passed type or of a derived class.
     * @param {Object} instance The object to test.
     * @param {String} type The type to test against
     */
    static isA(instance, type) {
        return this.isType(instance, type, true);
    }

    /**
     * Returns 'true` if the passed instance is of the passed type.
     * @param {Object} instance The object to test.
     * @param {String} type The type to test against
     * @param {Boolean} [deep] Pass `true` to return `true` if the class is a subclass of the passed type.
     */
    static isType(instance, type, deep) {
        const
            { factoryable }        = this,
            { caseless, registry } = factoryable,
            typeCls                = registry[caseless ? type.toLowerCase() : type];

        // If the type to be tested against maps to a class, see if the instance is an instanceof that
        if (typeCls) {
            if (deep) {
                return instance instanceof typeCls;
            }

            return instance.constructor === typeCls;
        }

        return false;
    }

    static setupAlias(cls) {
        cls.register(cls.alias, cls);
    }

    static setupFactoryable(cls, meta) {
        const superClass = meta.super.class;

        let { factoryable } = cls;

        factoryable = {
            caseless    : true,
            defaultType : null,
            extends     : superClass.factoryable ? [superClass] : null,
            typeKey     : 'type',

            ...factoryable
        };

        factoryable.class = cls;
        factoryable.registry = Object.create(null);

        if (factoryable.extends && !Array.isArray(factoryable.extends)) {
            factoryable.extends = [factoryable.extends];
        }

        // Replace the class/static getter with a new one that returns the complete factoryable object:
        defineProperty(cls, 'factoryable', {
            get() {
                return factoryable;
            }
        });
    }

    static setupType(cls) {
        const { type } = cls;

        cls.register(type, cls);

        // Copy the static type property onto the prototype as a readonly property:
        defineProperty(cls.prototype, 'type', {
            value : type
        });
    }

    /**
     * Creates an instance from this factory, given the type name or a config object.
     * @param {String|Object} config The type name string or config object.
     * @param {String|Function|Object} [options] Creation options (for details see {@link #function-reconfigure-static}).
     * @returns {Object}
     */
    static create(config, options) {
        return this.reconfigure(null, config, options);
    }

    /**
     * Reconfigures an optional existing instance based on the provided config and returns the correctly configured
     * instance. This will be the `existingInstance` if the `config` does not specify a different type.
     *
     * If `config` is `null` (or simply falsy), this method will destroy the `existingInstance` (if any) and return
     * `null`.
     *
     * If there is no `existingInstance`, the config must specify a type. That is, it must be a string (the type name)
     * or an object containing a `type` property, the `defaultType` must be provided or the factory itself must have
     * a `defaultType` specified (see {@link #property-factoryable-static}).
     *
     * When an `existingInstance` is provided and a type is specified, the instance will be reconfigured via `setConfig`
     * if it is of that type. Otherwise, the `existingInstance` is destroyed (if it is owned by the `options.owner`)
     * and a new instance of the correct type is created.
     *
     * @param {Object} existingInstance The instance to reconfigure. This can be `null`.
     *
     * @param {String|Object} config The type name string or config object.
     *
     * @param {String|Function|Object} [options] Additional options to control the reconfiguration process. If this
     * value is a string or a class constructor, it treated as `options.type`. If this value is an class instance, it
     * is used as the `options.owner`. If this is a function, it is treated as `options.setup`. NOTE: functions declared
     * using the `function` keyword are equivalent to class constructors. Use an arrow function or a class method to
     * avoid this when a `setup` function is intended.
     *
     * @param {String|Function} [options.type] The default type to use if the `config` object does not specify a type.
     *
     * @param {Object} [options.owner] The owner of any created instances. If the `existingInstance` is being replaced,
     * this value determines if the instance will be destroyed.
     *
     * @param {Object} [options.defaults] A config object of default values to use when creating a new instance.
     *
     * @param {Function|String} [options.setup] A function or the name of a method (on the `options.owner`) to call
     * prior to creating a new instance. It is passed the config object that will be used to create the instance. If a
     * truthy value is returned, that value is passed to the constructor instead of the provided config object.
     *
     * @param {Function|String} [options.transform] A function or the name of a method (on the `options.owner`) to call
     * with the raw config object prior to processing and the value it returns replaces the raw value. This function is
     * used to transform strings or arrays (for example) into proper config objects.
     *
     * @param {Function|String} [options.cleanup] A function or the name of a method (on the `options.owner`) to call
     * prior to destroying the `existingInstance`. The `existingInstance` is passed as the sole argument.
     *
     * @returns {Object} The reconfigured instance (either `existingInstance` or a new instance of the desired type)
     */
    static reconfigure(existingInstance, config, options) {
        const
            me              = this,
            { factoryable } = me,
            { typeKey }     = factoryable;

        let defaultType = options,
            cleanup, defaults, mergeType, owner, prepared, setup, t, transform, type;

        // Pick apart the options and set the vars accordingly
        if (options && !ObjectHelper.isClass(options)) {  // if (options is not the defaultType)
            defaultType = null;

            t = typeof options;

            if (t === 'function') {
                setup = options;
            }
            else if (t === 'string') {
                defaultType = options;
            }
            else if (ObjectHelper.isObject(options)) {
                // TODO revert to
                //  ({ cleanup, defaults, owner, setup, type : defaultType } = options);
                //  after this issue is fixed https://github.com/bryntum/bryntum-suite/issues/1457
                cleanup     = options.cleanup;
                defaults    = options.defaults;
                owner       = options.owner;
                setup       = options.setup;
                defaultType = options.type;
                transform   = options.transform;
            }
            else {
                owner = options;
            }
        }

        if (transform) {
            config = (typeof transform === 'string') ? owner[transform](config) : transform(config);
        }

        type = config;

        // Figure out config... it's either a type (string), a config object or the actual instance.
        if (typeof type === 'string') {
            config = {};
        }
        else if (config) {
            if (config === true) {
                config = {};
            }

            if (!ObjectHelper.isObject(config)) {
                // If we are being given an instance (not a config object), discard or destroy the existingInstance
                if (owner && config !== existingInstance && existingInstance?.[ownerSymbol] === owner) {
                    (typeof cleanup === 'string') ? owner[cleanup](existingInstance) : cleanup?.(existingInstance);
                    existingInstance.destroy();
                }

                return config;
            }

            type = config[typeKey];
        }

        type = type && me.resolveType(type);

        // We've got our orders... make it so...

        if (existingInstance) {
            // We can have a type-less config object when reconfiguring an existing instance, but if we have a type,
            // the existingInstance must be of that type. If !config that means we are nulling out.
            if (config && (!type || existingInstance.constructor === type)) {
                if (typeKey in config) {
                    config = ObjectHelper.assign({}, config);
                    delete config[typeKey];  // so "type" won't be processed as a config property
                }

                existingInstance.setConfig(config);

                return existingInstance;
            }

            if (owner && existingInstance[ownerSymbol] === owner) {
                (typeof cleanup === 'string') ? owner[cleanup](existingInstance) : cleanup?.(existingInstance);
                existingInstance.destroy();
            }
        }

        if (config) {
            if (defaults) {
                if (!(mergeType = type)) {
                    if (!(mergeType = defaults[typeKey] || defaultType || factoryable.defaultType)) {
                        throw new Error(`No default mergeType defined for ${factoryable.class.name} factory`);
                    }

                    mergeType = me.resolveType(mergeType);
                }

                if (mergeType) {
                    // Allow the merge fn of each config to perform the task:
                    config = mergeType.mergeConfigs(defaults, config);
                }
            }

            if (setup) {
                prepared = (typeof setup === 'string') ? owner[setup](config, type, defaults) : setup(config, type, defaults);

                if (prepared === null) {
                    return prepared;
                }

                config = prepared || config;
            }

            if (!type) {
                // One more check on config[typeKey] since the setup() function may have added it...
                if (!(type = config[typeKey] || defaultType || factoryable.defaultType)) {
                    throw new Error(`No default type defined for ${factoryable.class.name} factory`);
                }

                type = me.resolveType(type);
            }

            if (defaults && !mergeType) {
                config = type.mergeConfigs(defaults, config);
            }

            if (typeKey in config) {
                config = ObjectHelper.assign({}, config);
                delete config[typeKey];  // so "type" won't be processed as a config property
            }

            config = new type(config);

            if (owner) {
                config[ownerSymbol] = owner;
            }
        }

        return config || null;
    }

    /**
     * This method returns the constructor of the class registered for the given type name.
     * @param {String} type The type name to look up.
     * @param {Boolean} [optional] Pass `true` to return `null` if `type` is not found instead of throwing an exception.
     * @returns {Function}
     * @private
     */
    static resolveType(type, optional) {
        if (typeof type !== 'string') {
            return type;
        }

        const
            { factoryable } = this,
            bases           = factoryable.extends;

        let result = factoryable.registry[factoryable.caseless ? type.toLowerCase() : type],
            i;

        for (i = 0; !result && bases && i < bases.length; ++i) {
            // Pass optional=true to base factory so the error is our own should the lookup fail:
            result = bases[i].resolveType(type, /* optional = */true);
        }

        if (!result && !optional) {
            throw new Error(`Invalid type name "${type}" passed to ${factoryable.class.name} factory`);
        }

        return result;
    }
};
