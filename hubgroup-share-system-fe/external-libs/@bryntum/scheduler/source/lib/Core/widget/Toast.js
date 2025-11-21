import Widget from './Widget.js';
import DomClassList from '../helper/util/DomClassList.js';

/**
 * @module Core/widget/Toast
 */

/**
 * Basic toast. Toasts are stacked on top of each other
 * @example
 * // simplest possible
 * Toast.show('Just toasting');
 *
 * // with config
 * Toast.show({
 *   html: 'Well toasted',
 *   showProgress: false
 * });
 *
 * // as instance (instance is also returned from Toast.show()
 * let toast = new Toast({
 *   html: 'Not going away',
 *   timeout: 0
 * });
 *
 * toast.show();
 *
 * @classType toast
 * @inlineexample Core/widget/Toast.js
 */
export default class Toast extends Widget {

    static get $name() {
        return 'Toast';
    }

    // Factoryable type name
    static get type() {
        return 'toast';
    }

    static get configurable() {
        return {
            testConfig : {
                destroyTimeout : 1,
                timeout        : 100
            },

            floating : true,

            /**
             * Timeout (in ms) until the toast is automatically dismissed. Set to 0 to never hide.
             * @config {Number}
             * @default
             */
            timeout : 2500,

            autoDestroy : null,

            // How long to wait after hide before destruction
            destroyTimeout : 200,

            /**
             * Show a progress bar indicating the time remaining until the toast is dismissed.
             * @config {Boolean}
             * @default
             */
            showProgress : true,

            /**
             * Toast color (should have match in toast.scss or your custom styling).
             * Valid values in Bryntum themes are:
             * * b-amber
             * * b-blue
             * * b-dark-gray
             * * b-deep-orange
             * * b-gray
             * * b-green
             * * b-indigo
             * * b-lime
             * * b-light-gray
             * * b-light-green
             * * b-orange
             * * b-purple
             * * b-red
             * * b-teal
             * * b-white
             * * b-yellow
             *
             * ```
             * new Toast({
             *    color : 'b-blue'
             * });
             * ```
             *
             * @config {String}
             */
            color : null,

            bottomMargin : 20
        };
    }

    compose() {
        const { appendTo, color, html, showProgress, style, timeout } = this;

        return {
            parent : appendTo || this.floatRoot,
            class  : {
                ...DomClassList.normalize(color, 'object'),
                'b-toast-hide' : 1  // toasts start hidden so we can animate them into view
            },

            html,
            style,

            children : {
                progressElement : showProgress && {
                    style : `animation-duration:${timeout / 1000}s;`,
                    class : {
                        'b-toast-progress' : 1
                    }
                }
            },

            listeners : {
                click : 'hide'
            }
        };
    }

    doDestroy() {
        this.untoast();

        super.doDestroy();
    }

    get nextBottom() {
        const { bottomMargin, element } = this;

        return parseInt(element.style.bottom, 10) + element.offsetHeight + bottomMargin;
    }

    /**
     * Show the toast
     */
    show() {
        super.show();

        const
            me = this,
            { element } = me,
            { toasts } = Toast;

        if (!toasts.includes(me)) {
            element.style.bottom = (toasts[0]?.nextBottom ?? me.bottomMargin) + 'px';

            toasts.unshift(me);
            element.getBoundingClientRect();  // force layout so that removing b-toast-hide runs our transition

            element.classList.remove('b-toast-hide');

            if (me.timeout > 0) {
                me.hideTimeout = me.setTimeout('hide', me.timeout);
            }
        }
    }

    /**
     * Hide the toast
     */
    hide() {
        const me = this;

        me.untoast();
        me.element.classList.add('b-toast-hide');

        if (me.autoDestroy && !me.destroyTimer) {
            me.destroyTimer = me.setTimeout('destroy', me.destroyTimeout);
        }
    }

    untoast() {
        const { toasts } = Toast;

        if (toasts.includes(this)) {
            toasts.splice(toasts.indexOf(this), 1);
        }
    }

    /**
     * Hide all visible toasts
     */
    static hideAll() {
        Toast.toasts.slice().reverse().forEach(toast => toast.hide());
    }

    /**
     * Easiest way to show a toast
     * @example
     * Toast.show('Hi');
     * @example
     * Toast.show({
     *   html   : 'Read quickly, please',
     *   timeout: 1000
     * });
     * @param {String|Object} config Message or toast config object
     * @returns {Core.widget.Toast}
     */
    static show(config) {
        const toast = Toast.new({
            autoDestroy : true,
            rootElement : document.body
        }, (typeof config === 'string') ? { html : config } : config);

        toast.show();

        return toast;
    }
}

Toast.toasts = [];

// Register this widget type with its Factory
Toast.initClass();
