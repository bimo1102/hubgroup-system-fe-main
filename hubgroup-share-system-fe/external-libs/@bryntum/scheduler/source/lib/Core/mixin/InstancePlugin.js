import Base from '../Base.js';
import Events from '../mixin/Events.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import Localizable from '../localization/Localizable.js';

/**
 * @module Core/mixin/InstancePlugin
 */

function getDescriptor(me, fnName) {
    const property = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(me), fnName);

    return (property && (property.get || property.set)) ? property : null;
}

/**
 * Base class for plugins. Published functions will be available from the other class. `this` in published functions is
 * referenced to the plugin, access the other class using `this.client`.
 *
 * Observe that plugin doesn't apply itself on class level but instead on instance level. Plugin is its own instance
 * that can have own functions and data that is not exposed to target class.
 *
 * Functions can be published in four ways:
 *
 * * `assign` (when function is not already available on target)
 * * `before` (when function is already available on target, will be called before original function)
 * * `after` (when function is already available on target, will be called after original function)
 * * `override` (replaces function on target, but old function can be reached)
 *
 * To configure which functions get published and in what way, specify `pluginConfig` getter on plugin:
 *
 * ```
 * class Sort extends InstancePlugin {
 *   static get pluginConfig {
 *      return {
 *          before   : ['init'],
 *          after    : ['destroy', 'onElementClick'],
 *          override : ['render']
 *      };
 *   }
 * }
 * ```
 * @extends Core/Base
 * @mixes Core/localization/Localizable
 * @mixes Core/mixin/Events
 */
export default class InstancePlugin extends Base.mixin(Events, Localizable) {

    //region Config

    static get configurable() {
        return {
            clientListeners : null,

            /**
             * Get/set the plugin/feature `disabled` state.
             * @property {Boolean}
             * @name disabled
             * @category Common
             */
            /**
             * The plugin/feature `disabled` state.
             *
             * For a feature that is **off** by default that you want to enable later during runtime,
             * configure it with `disabled : true`.
             * ```javascript
             * const grid = new Grid({
             *      features : {
             *          featureName : {
             *              disabled : true // on and disabled, can be enabled later
             *          }
             *      }
             * });
             *
             * // enable the feature
             * grid.features.featureName.disabled = false;
             * ```
             *
             * If the feature is **off** by default, and you want to include and enable the feature, configure it as `true`:
             * ```javascript
             * const grid = new Grid({
             *      features : {
             *          featureName : true // on and enabled, can be disabled later
             *      }
             * });
             *
             * // disable the feature
             * grid.features.featureName.disabled = true;
             * ```
             *
             * If the feature is **on** by default, but you want to turn it **off**, configure it as `false`:
             * ```javascript
             * const grid = new Grid({
             *      features : {
             *          featureName : false // turned off, not included at all
             *      }
             * });
             * ```
             *
             * If the feature is **enabled** by default and you have no need of reconfiguring it,
             * you can omit the feature configuration.
             *
             * @config {Boolean}
             * @default
             * @category Common
             */
            disabled : false
        };
    }

    //endregion

    //region Init

    /**
     * Call from another instance to add plugins to it.
     * @example
     * InstancePlugin.initPlugins(this, Search, Stripe);
     * @param plugInto Instance to mix into (usually this)
     * @param plugins Classes to plug in
     * @internal
     */
    static initPlugins(plugInto, ...plugins) {
        const property = plugInto.plugins || (plugInto.plugins = {});

        for (const PluginClass of plugins) {
            property[PluginClass.$$name] = new PluginClass(plugInto);
        }
    }

    /**
     * The Widget which was passed into the constructor,
     * which is the Widget we are providing extra services for.
     * @property {Core.widget.Widget}
     * @readonly
     * @category Misc
     */
    get client() {
        return this._client;
    }

    set client(client) {
        this._client = client;
    }

    // We can act as an owner of a widget, so must be able to participate in focus reversion
    getFocusRevertTarget() {
        return this.client?.getFocusRevertTarget();
    }

    construct(...args) {
        const me = this;

        let [plugInto, config] = args,
            listeners;

        // When called with one argument (a config object), grab the "client" from the config object.
        if (args.length === 1) {
            if (ObjectHelper.isObject(plugInto)) {
                config = plugInto;
                plugInto = config.client;
            }
        }
        // Two args, so client is the first. Ensure the config doesn't contain a client property.
        else {
            config = ObjectHelper.assign({}, config);
            delete config.client;
        }

        me.client = plugInto;

        super.construct(config);

        me.applyPluginConfig(plugInto);

        listeners = me.clientListeners;

        if (listeners) {
            listeners = ObjectHelper.assign({}, listeners);
            listeners.thisObj = me;

            plugInto.on(listeners);
        }
    }

    /**
     * Applies config as found in plugInto.pluginConfig, or published all if no config found.
     * @private
     * @param plugInto Target instance to plug into
     */
    applyPluginConfig(plugInto) {
        const
            me     = this,
            config = me.pluginConfig || me.constructor.pluginConfig;

        if (config) {
            const { assign, chain, after, before, override } = config;

            assign && me.applyAssign(plugInto, assign);
            (chain || after) && me.applyChain(plugInto, chain || after);
            before && me.applyChain(plugInto, before, false);
            override && me.applyOverride(plugInto, override);
        }
    }

    /**
     * Applies assigning for specified functions.
     * @private
     * @param plugInto
     * @param fnNames
     */
    applyAssign(plugInto, fnNames) {
        fnNames.forEach(fnName => this.assign(plugInto, fnName));
    }

    /**
     * Applies chaining for specified functions.
     * @private
     * @param plugInto
     * @param functions
     * @param after
     */
    applyChain(plugInto, functions, after = true) {
        if (Array.isArray(functions)) {
            for (const fnName of functions) {
                this.chain(plugInto, fnName, fnName, after);
            }
        }
        else {
            for (const intoName in functions) {
                this.chain(plugInto, intoName, functions[intoName], after);
            }
        }
    }

    /**
     * Applies override for specified functions.
     * @private
     * @param plugInto
     * @param fnNames
     */
    applyOverride(plugInto, fnNames) {
        const me = this;

        if (!me.overridden) {
            me.overridden = {};
        }

        fnNames.forEach(fnName => {
            if (!me[fnName]) {
                throw new Error(`Trying to chain fn ${plugInto.$$name}#${fnName}, but plugin fn ${me.$$name}#${fnName} does not exist`);
            }
            // override
            if (typeof plugInto[fnName] === 'function') {
                me.overridden[fnName] = plugInto[fnName].bind(plugInto);
            }

            plugInto[fnName] = me[fnName].bind(me);
        });
    }

    /**
     * Assigns specified functions.
     * @private
     * @param plugInto
     * @param fnName
     */
    assign(plugInto, fnName) {
        const
            me       = this,
            property = getDescriptor(me, fnName);

        if (property) {
            // getter/setter, define corresponding property on target
            Object.defineProperty(plugInto, fnName, {
                configurable : true,
                enumerable   : true,
                get          : property.get && property.get.bind(me),
                set          : property.set && property.set.bind(me)
            });
        }
        else {
            plugInto[fnName] = me[fnName].bind(me);
        }
    }

    //endregion

    //region Chaining

    /**
     * Chains functions. When the function is called on the target class all functions in the chain will be called in
     * the order they where added.
     * @private
     * @param plugInto
     * @param intoName
     * @param hookName
     * @param after
     */
    chain(plugInto, intoName, hookName, after = true) {
        const
            me    = this,
            chains = plugInto.pluginFunctionChain || (plugInto.pluginFunctionChain = {}),
            hookFn =
                //<debug>
                // Previously, RowManager was (mistakenly) using chain to put a getter on
                // the grid. This will ensure that property getters are not passed in as
                // chain/before/after:
                !getDescriptor(me, hookName) &&
                //</debug>
                me[hookName] && me[hookName].bind(me),
            // Grab the fn so that we won't need our this pointer to call it. This is due
            // to this instance possibly being destroyed by the time a chain call is made.
            functionChainRunner = me.functionChainRunner;

        if (!hookFn) {
            throw new Error(`Trying to chain fn ${plugInto.$$name}#${hookName}, but plugin fn ${me.$$name}#${hookName} does not exist`);
        }

        if (!chains[intoName]) {
            let intoFn = plugInto[intoName];

            if (intoFn) {
                intoFn = intoFn.bind(plugInto);
                intoFn.$this = plugInto;
            }

            chains[intoName] = intoFn ? [intoFn] : [];

            plugInto[intoName] = (...params) => functionChainRunner(chains[intoName], params);
        }

        hookFn.$this = me;
        chains[intoName][after ? 'push' : 'unshift'](hookFn);
    }

    /**
     * Used to run multiple plugged in functions with the same name, see chain above. Returning false from a
     * function will abort chain.
     * @private
     * @param {Array} chain
     * @param {Array} params
     * @returns value returned from last function in chain (or false if any returns false)
     */
    functionChainRunner(chain, params) {
        // NOTE: even though we are an instance method, we must not use our "this" pointer
        // since our instance may be destroyed. We cope with that by receiving parameters
        // for everything we need (so we're just a pure function).
        let fn, i, returnValue;

        // changed from for..of to try and fix Edge problems
        for (i = 0; i < chain.length; i++) {
            fn = chain[i];

            // Feature hooks remain in place even after GridBase loops and destroys its
            // features, so skip over any destroyed features on the chain. In particular,
            // bindStore hooks will be called when GridBase sets store to null.
            if (!fn.$this.isDestroyed) {
                returnValue = fn(...params);

                if (returnValue === false) {
                    break;
                }
            }
        }

        return returnValue;
    }

    //endregion

    /**
     * Called when disabling/enabling the plugin/feature, not intended to be called directly. To enable or disable a
     * plugin/feature, see {@link #property-disabled}.
     *
     * By default removes the cls of the plugin from its client. Override in subclasses to take any other actions necessary.
     */
    doDisable(disable) {
        const
            me = this,
            { constructor } = me,
            cls = 'featureClass' in constructor ? constructor.featureClass : `b-${constructor.$$name.toLowerCase()}`;

        // Some features do not use a cls
        if (cls) {
            me.client?.element?.classList[disable ? 'remove' : 'add'](cls);
        }

        if (!me.isConfiguring) {
            if (disable) {
                /**
                 * Fired when the plugin/feature is disabled.
                 * @event disable
                 * @param {Core.mixin.InstancePlugin} source
                 */
                me.trigger('disable');
            }
            else {
                /**
                 * Fired when the plugin/feature is enabled.
                 * @event enable
                 * @param {Core.mixin.InstancePlugin} source
                 */
                me.trigger('enable');
            }
        }
    }

    updateDisabled(disabled) {
        this.doDisable(disabled);
    }

    throwOverrideIsMissing(data) {
        throw new Error(`Trying to override fn ${data.plugIntoName}#${data.fnName}, but plugin fn ${data.pluginName}#${data.fnName} does not exist`);
    }

    // Convenience method to read the rootElement from the owner widget
    get rootElement() {
        return this.client.rootElement;
    }
}
