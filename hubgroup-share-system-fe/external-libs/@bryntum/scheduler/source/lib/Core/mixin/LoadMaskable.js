import Mask from '../widget/Mask.js';
import ObjectHelper from '../helper/ObjectHelper.js';

/**
 * @module Core/mixin/LoadMaskable
 */

/**
 * Simple mixin for load masking configs and helper methods.
 * @mixin
 */
export default Target => class LoadMaskable extends Target {
    static get $name() {
        return 'LoadMaskable';
    }

    static get configurable() {
        return {
            /**
             * A {@link Core.widget.Mask} config object to adjust the {@link Core.widget.Widget#config-maskDefaults}
             * when data is loading. The message and optional configuration from the
             * {@link Core.mixin.LoadMaskable#config-loadMask} config take priority over these options, just as they do
             * for `maskDefaults`, respectively.
             *
             * The final mask configuration for a load mask is as if the following were applied:
             *
             * ```
             *  Object.assign({},
             *      widget.maskDefaults,
             *      widget.loadMaskDefaults,
             *      widget.loadMask);
             * ```
             * @config {Object|Core.widget.Mask}
             * @category Masking
             */
            loadMaskDefaults : {
                useTransition : true,
                showDelay     : 1000
            },

            /**
             * A {@link Core.widget.Mask} config object to adjust the {@link Core.widget.Widget#config-maskDefaults}
             * when an error occurs loading data.
             *
             * The final mask configuration for an error mask is as if the following were applied:
             *
             * ```
             *  Object.assign({},
             *      widget.maskDefaults,
             *      widget.loadMaskDefaults,
             *      widget.loadMaskError,
             *      errorMessage);
             * ```
             * @config {Object|Core.widget.Mask}
             * @category Masking
             */
            loadMaskError : {
                icon      : 'b-icon b-icon-warning',
                autoClose : 3000,
                showDelay : 0
            },

            /**
             * A {@link Core.widget.Mask} config object, or a message to be shown when a store is performing a remote operation,
             * or Crud Manager is loading data from the sever. Set to `null` to disable default load mask.
             *
             * @config {String|Object|null}
             * @default "Loading..."
             * @category Masking
             */
            loadMask : {
                text : 'L{GridBase.loadMask}'
            },

            /**
             * A {@link Core.widget.Mask} config object, or a message to be shown when Crud Manager
             * is persisting changes on the server. Set to `null` to disable default sync mask.
             *
             * This config is similar to {@link Core.mixin.LoadMaskable#config-loadMask} but designed for saving data.
             *
             * To create a custom sync mask need to subscribe to the Crud Manager events and show
             * {@link Core.widget.Mask Mask} on `beforeSend` and hide it on `requestDone` and `requestFail`.
             *
             * To create a custom sync mask, set this config to `null` and subscribe to the CrudManager's events to
             * show or hide the {@link Core.widget.Widget#config-masked mask} as desired.
             *
             * ```javascript
             *  widget.crudManager.on({
             *      loadStart() {
             *          widget.masked = {
             *              text : 'Data is loading...'
             *          };
             *      },
             *      load() {
             *          widget.masked = null;
             *      },
             *      loadCanceled() {
             *          widget.masked = null;
             *      },
             *      syncStart() {
             *          widget.masked = null;
             *      },
             *      sync() {
             *          widget.masked = null;
             *      },
             *      syncCanceled() {
             *          widget.masked = null;
             *      },
             *      requestFail({ response }) {
             *          widget.masked.error = response.message || 'Sync failed';
             *      }
             *  });
             *
             *  store.load();
             * ```
             *
             * @config {String|Object|null}
             * @default "Saving changes, please wait..."
             * @category Masking
             */
            syncMask : {
                text : 'L{GridBase.syncMask}'
            },

            localizableProperties : ['loadMask.text', 'syncMask.text']
        };
    }

    /**
     * Applies the {@link Core.mixin.LoadMaskable#config-loadMask} as the {@link Core.widget.Widget#config-masked mask}
     * for this widget.
     * @internal
     */
    applyLoadMask() {
        const
            me = this,
            { loadMask } = me;

        if (loadMask) {
            me.masked = Mask.mergeConfigs(me.loadMaskDefaults, loadMask);
        }
    }

    /**
     * Updates the current {@link Core.widget.Widget#config-masked mask} for this widget to present the specified
     * `error`.
     * @param {String} error The error message to display in the mask.
     * @internal
     */
    applyMaskError(error) {
        const { loadMaskError, masked } = this;

        if (masked) {
            ObjectHelper.assign(masked.errorDefaults, loadMaskError);
            masked.error = error;
        }
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement thus.
    get widgetClass() {}
};
