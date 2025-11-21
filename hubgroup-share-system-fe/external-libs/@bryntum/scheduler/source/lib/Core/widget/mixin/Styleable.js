import Base from '../../Base.js';
import BrowserHelper from '../../helper/BrowserHelper.js';
import ObjectHelper from '../../helper/ObjectHelper.js';
import StringHelper from '../../helper/StringHelper.js';

/**
 * @module Core/widget/mixin/Styleable
 */

/**
 * Mixin for widgets that allows manipulating CSS variables. Works by setting style properties of the target widgets
 * element.
 *
 * As part of configuration:
 *
 * ```javascript
 * const taskBoard = new TaskBoard({
 *    css : {
 *        cardBorderTop    : '5px solid currentColor',
 *        columnBackground : '#ddd'
 *    }
 * });
 * ```
 *
 * And/or at runtime:
 *
 * ```javascript
 * taskBoard.css.cardBackground = '#333';
 * ```
 *
 * @mixin
 */
export default Target => class Styleable extends (Target || Base) {
    static $name = 'Styleable';

    static configurable = {
        /**
         * CSS variable prefix, appended to the keys used in {@link #config-css}.
         *
         * For example:
         *
         * ```javascript
         * {
         *    cssVarPrefix : 'taskboard',
         *
         *    css : {
         *        cardBackground : '#333'
         *    }
         * }
         * ```
         *
         * Results in the css var `--taskboard-card-background` being set to `#333`.
         * @config {String}
         * @category CSS
         */
        cssVarPrefix : '',

        /**
         * Allows runtime manipulating of CSS variables.
         *
         * See {@link #config-css} for more information.
         *
         * ```javascript
         * taskBoard.css.columnBackground = '#ccc';
         *
         * // Will set "--taskboard-column-background : #ccc"
         * ```
         *
         * @member {Proxy} css
         * @category DOM
         */

        /**
         * Initial CSS variables to set.
         *
         * Each key will be applied as a CSS variable to the target elements style. Key names are hyphenated and
         * prefixed with {@link #config-cssVarPrefix} in the process. For example:
         *
         * ```javascript
         * {
         *    cssVarPrefix : 'taskboard',
         *
         *    css : {
         *        cardBackground : '#333'
         *    }
         * }
         * ```
         *
         * Results in the css var `--taskboard-card-background` being set to `#333`.
         *
         * @config {Object}
         * @category CSS
         */
        css : {}
    };

    changeCssVarPrefix(prefix) {
        ObjectHelper.assertString(prefix, 'prefix');

        if (prefix && !prefix.endsWith('-')) {
            prefix = prefix + '-';
        }

        return prefix || '';
    }

    changeCss(css) {
        ObjectHelper.assertObject(css, 'css');

        const me = this;

        if (!BrowserHelper.global.Proxy) {
            throw new Error('Proxy not supported');
        }

        const proxy = new Proxy({}, {
            get(target, property) {
                // TODO: Worth keeping the live css object? Or just overhead if not often used?
                const styles = getComputedStyle(me.element || document.documentElement);
                return styles.getPropertyValue(`--${me.cssVarPrefix}${StringHelper.hyphenate(property)}`)?.trim();
            },

            set(target, property, value) {
                const element = me.element || document.documentElement;
                element.style.setProperty(`--${me.cssVarPrefix}${StringHelper.hyphenate(property)}`, value);
                return true;
            }
        });

        if (css) {
            if (me._element) {
                ObjectHelper.assign(proxy, css);
            }
            else {
                me.$initialCSS = css;
            }
        }

        return proxy;
    }

    // Apply any initially supplied CSS when we have an element
    updateElement(element, ...args) {
        super.updateElement(element, ...args);

        if (this.$initialCSS) {
            ObjectHelper.assign(this.css, this.$initialCSS);
        }
    }

    get widgetClass() {}
};
