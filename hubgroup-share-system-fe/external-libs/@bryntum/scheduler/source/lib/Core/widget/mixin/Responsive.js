import Base from '../../Base.js';
import ObjectHelper from '../../helper/ObjectHelper.js';

/**
 * @module Core/widget/mixin/Responsive
 */

/**
 * A breakpoint definition. Used when defining breakpoints, see {@link #config-breakpoints}.
 *
 * ```javascript
 * {
 *     name    : 'Small',
 *     configs : {
 *         text  : null,
 *         color : 'b-blue'
 *     },
 *     callback() {
 *         console.log('Applied small');
 *     }
 * }
 * ```
 *
 * @typedef Breakpoint
 * @property {String} name Name of the breakpoint
 * @property {Object} [configs] An optional configuration object to apply to the widget when the breakpoint is activated
 * @property {Function} [callback] An optional callback, called when the breakpoint is activated
 */

/**
 * Mixin that simplifies adding responsive behaviour to widgets, by allowing them to define responsive
 * {@link #config-breakpoints} based on max-width/max-height.
 *
 * Each {@link #typedef-Breakpoint brekpoint} can contain configs that are applied to the widget and a callback called
 * when the breakpoint is activated.
 *
 * The mixin triggers an event when switching breakpoints, allowing the application to define its own behaviour. It also
 * uses the name of a breakpoint to apply a CSS class to Widget, for example `small` -> `b-breakpoint-small`.
 *
 * ```javascript
 * class ResponsiveButton extends Button.mixin(Responsive) {}
 *
 * const button = new ResponsiveButton({
 *     breakpoints : {
 *         width : {
 *             // When width drops to 50 or below, hide text and show icon
 *             50 : {
 *                 name    : 'small',
 *                 configs : { text : null, icon : 'b-fa b-fa-plus' },
 *                 callback() {
 *                     console.log('Applied small');
 *                 }
 *             },
 *             // When width is above 50, hide icon and show text
 *             '*' : {
 *                  name    : 'large',
 *                  configs : { text : 'Add', icon : null }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * @mixin
 */
export default Target => class Responsive extends (Target || Base) {

    static $name = 'Responsive';

    static configurable = {
        /**
         * Defines responsive breakpoints, based on max-width or max-height.
         *
         * When the widget is resized, the defined breakpoints are queried to find the closest larger or equal
         * breakpoint for both width and height. If the found breakpoint differs from the currently applied, it is
         * applied.
         *
         * Applying a breakpoint triggers an event that applications can catch to react to the change. It also
         * optionally applies a set of configs and calls a configured callback.
         *
         * ```javascript
         * breakpoints : {
         *     width : {
         *         50 : { name : 'small', configs : { text : 'Small', ... } }
         *         100 : { name : 'medium', configs : { text : 'Medium', ... } },
         *         '*' : { name : 'largem', configs : { text : 'Large', ... } }
         *     }
         * }
         * ```
         *
         * @config {Object}
         * @param {Object} width Max-width breakpoints, with keys as numerical widths (or '*' for larger widths than the
         * largest defined one) and the value as a {@link #typedef-Breakpoint breakpoint definition}
         * @param {Object} height Max-height breakpoints, with keys as numerical heights (or '*' for larger widths than
         * the largest defined one) and the value as a {@link #typedef-Breakpoint breakpoint definition}
         */
        breakpoints : null
    };

    changeBreakpoints(breakpoints) {
        ObjectHelper.assertObject(breakpoints, 'breakpoints');

        // Normalize breakpoints
        if (breakpoints?.width) {
            Object.keys(breakpoints.width).forEach(key => {
                breakpoints.width[key].maxWidth = key;
            });
        }

        if (breakpoints?.height) {
            Object.keys(breakpoints.height).forEach(key => {
                breakpoints.height[key].maxHeight = key;
            });
        }

        return breakpoints;
    }

    updateBreakpoints(breakpoints) {
        if (breakpoints) {
            this.monitorResize = true;
        }
    }

    // Get a width/height breakpoint for the supplied dimension
    getBreakpoint(levels, dimension) {
        const
            // Breakpoints as reverse sorted array of numerical widths [NaN for *, 50, 100]
            ascendingLevels = Object.keys(levels).map(l => parseInt(l)).sort(),
            // Find first one larger than current width
            breakpoint     = ascendingLevels.find(bp => dimension <= bp);

        // Return matched breakpoint or * if available and none matched
        return levels[breakpoint ?? (levels['*'] && '*')];
    }

    // Apply a breakpoints configs, trigger event and call any callback
    activateBreakpoint(orientation, breakpoint) {
        const
            me             = this,
            prevBreakpoint = me[`current${orientation}Breakpoint`];

        if (breakpoint !== prevBreakpoint) {
            me[`current${orientation}Breakpoint`] = breakpoint;

            me.setConfig(breakpoint.configs);

            prevBreakpoint && me.element.classList.remove(`b-breakpoint-${prevBreakpoint.name.toLowerCase()}`);
            me.element.classList.add(`b-breakpoint-${breakpoint.name.toLowerCase()}`);

            /**
             * Triggered when a new max-width based breakpoint is applied.
             * @event responsiveWidthChange
             * @param {Core.widget.Widget} source The widget
             * @param {Core.widget.mixin.Responsive#typedef-Breakpoint} breakpoint The applied breakpoint
             * @param {Core.widget.mixin.Responsive#typedef-Breakpoint} prevBreakpoint The previously applied breakpoint
             */
            /**
             * Triggered when a new max-height based breakpoint is applied.
             * @event responsiveHeightChange
             * @param {Core.widget.Widget} source The widget
             * @param {Core.widget.mixin.Responsive#typedef-Breakpoint} breakpoint The applied breakpoint
             * @param {Core.widget.mixin.Responsive#typedef-Breakpoint} prevBreakpoint The previously applied breakpoint
             */

            me.trigger(`responsive${orientation}Change`, { breakpoint, prevBreakpoint });

            breakpoint.callback?.({ source : me, breakpoint, prevBreakpoint });

            me.recompose?.();
        }
    }

    // Called on resize to pick and apply a breakpoint, if size changed enough
    applyResponsiveness(width, height) {
        const
            me = this,
            {
                width  : widths,
                height : heights
            }  = me.breakpoints ?? {};

        if (widths) {
            const breakpoint = me.getBreakpoint(widths, width);
            me.activateBreakpoint('Width', breakpoint);
        }

        if (heights) {
            const breakpoint = me.getBreakpoint(heights, height);
            me.activateBreakpoint('Height', breakpoint);
        }
    }

    onInternalResize(element, width, height, oldWidth, oldHeight) {
        super.onInternalResize(element, width, height, oldWidth, oldHeight);

        this.applyResponsiveness(width, height);
    }

};
