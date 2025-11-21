import ObjectHelper from './ObjectHelper.js';
import Widget from '../widget/Widget.js';
import Toast from '../widget/Toast.js';
import Mask from '../widget/Mask.js';
import Point from './util/Point.js';

/**
 * @module Core/helper/WidgetHelper
 */

/**
 * Helper for creating widgets.
 */
export default class WidgetHelper {
    //region Querying

    /**
     * Returns the widget with the specified id.
     * @param {String} Id of widget to find
     * @returns {Core.widget.Widget} The widget if any
     * @category Querying
     */
    static getById(id) {
        return Widget.getById(id);
    }

    /**
     * Returns the Widget which owns the passed element (or event).
     * @param {HTMLElement|Event} element The element or event to start from
     * @param {String|Function} [type] The type of Widget to scan upwards for. The lowercase
     * class name. Or a filter function which returns `true` for the required Widget.
     * @param {HTMLElement|Number} [limit] The number of components to traverse upwards to find a
     * match of the type parameter, or the element to stop at.
     * @returns {Core.widget.Widget} The found Widget or null.
     * @category Querying
     */
    static fromElement(element, type, limit) {
        return Widget.fromElement(element, type, limit);
    }

    //endregion

    //region Widgets

    /**
     * Create a widget.
     * @example
     * WidgetHelper.createWidget({
     *   type: 'button',
     *   icon: 'user',
     *   text: 'Edit user'
     * });
     * @param {Object} config Widget config
     * @returns {Object} The widget
     * @category Widgets
     */
    static createWidget(config = {}) {
        return config.isWidget ? config : Widget.create(config);
    }

    /**
     * Appends a widget (array of widgets) to the DOM tree. If config is empty, widgets are appended to the DOM. To
     * append widget to certain position you can pass HTMLElement or its id as config, or as a config, that will be
     * applied to all passed widgets.
     *
     * Usage:
     *
     * ```javascript
     * // Will append button as last item to element with id 'container'
     * let [button] = WidgetHelper.append({ type : 'button' }, 'container');
     *
     * // Same as above, but will add two buttons
     * let [button1, button2] = WidgetHelper.append([
     *     { type : 'button' },
     *     { type : 'button' }
     *     ], { appendTo : 'container' });
     *
     * // Will append two buttons before element with id 'someElement'. Order will be preserved and all widgets will have
     * // additional class 'my-cls'
     * let [button1, button2] = WidgetHelper.append([
     *     { type : 'button' },
     *     { type : 'button' }
     *     ], {
     *         insertBefore : 'someElement',
     *         cls          : 'my-cls'
     *     });
     * ```
     *
     * @param {Object|Object[]} widget Widget config or array of such configs
     * @param {HTMLElement|String|Object} [config] Element (or element id) to which to append the widget or config to apply to all passed widgets
     * @returns {Core.widget.Widget[]} Array or widgets
     * @category Widgets
     */
    static append(widget, config) {
        widget = Array.isArray(widget) && widget || [widget];

        if (config instanceof HTMLElement || typeof config === 'string') {
            config = {
                appendTo : config
            };
        }

        // We want to fix position to insert into to keep order of passed widgets
        if (config.insertFirst) {
            const target = typeof config.insertFirst === 'string' ? document.getElementById(config.insertFirst) : config.insertFirst;

            if (target.firstChild) {
                config.insertBefore = target.firstChild;
            }
            else {
                config.appendTo = target;
            }
        }

        return widget.map(item => Widget.create(ObjectHelper.assign({}, config || {}, item)));
    }

    //endregion

    //region Popups

    /**
     * Shows a popup (~tooltip) containing widgets connected to specified element.
     * @example
     * WidgetHelper.openPopup(element, {
     *   position: 'bottom center',
     *   items: [
     *      { widgetConfig }
     *   ]
     * });
     * @param {HTMLElement} element Element to connect popup to
     * @param {Object} config Config object, or string to use as html in popup
     * @returns {*|{close, widgets}}
     * @category Popups
     */
    static openPopup(element, config) {
        return Widget.create(ObjectHelper.assign({
            forElement : element
        }, typeof config === 'string' ? {
            html : config
        } : config), 'popup');
    }

    /**
     * Shows a context menu connected to the specified element.
     * @example
     * WidgetHelper.showContextMenu(element, {
     *   items: [
     *      { id: 'addItem', icon: 'add', text: 'Add' },
     *      ...
     *   ],
     *   onItem: item => alert('Clicked ' + item.text)
     * });
     * @param {HTMLElement|Number[]} element Element (or a coordinate) to show the context menu for
     * @param {Object} config Context menu config, see example
     * @returns {*|{close}}
     * @category Popups
     */
    static showContextMenu(element, config) {
        const me = this;

        if (me.currentContextMenu) {
            me.currentContextMenu.destroy();
        }

        if (element instanceof HTMLElement) {
            config.forElement = element;
        }
        else if (Array.isArray(element)) {
            config.forElement = {
                target : new Point(...element)
            };
        }
        else if (element instanceof Point) {
            config.forElement = {
                target : element
            };
        }

        me.currentContextMenu = Widget.create(config, 'menu');

        me.currentContextMenu.on('destroy', () => {
            me.currentContextMenu = null;
        });

        return me.currentContextMenu;
    }

    /**
     * Attached a tooltip to the specified element.
     * @example
     * WidgetHelper.attachTooltip(element, {
     *   text: 'Useful information goes here'
     * });
     * @param {HTMLElement} element Element to attach tooltip for
     * @param {String|Object} configOrText Tooltip config or tooltip string, see example and source
     * @returns {Object}
     * @category Popups
     */
    static attachTooltip(element, configOrText) {
        return Widget.attachTooltip(element, configOrText);
    }

    /**
     * Checks if element has tooltip attached
     *
     * @param {HTMLElement} element Element to check
     * @return {Boolean}
     * @category Popups
     */
    static hasTooltipAttached(element) {
        return Widget.resolveType('tooltip').hasTooltipAttached(element);
    }

    /**
     * Destroys any tooltip attached to an element, removes it from the DOM and unregisters any tip related listeners
     * on the element.
     *
     * @param {HTMLElement} element Element to remove tooltip from
     * @category Popups
     */
    static destroyTooltipAttached(element) {
        return Widget.resolveType('tooltip').destroyTooltipAttached(element);
    }

    //endregion

    //region Mask

    /**
     * Masks the specified element, showing a message in the mask.
     * @param {HTMLElement} element Element to mask
     * @param {String} msg Message to show in the mask
     * @category Mask
     */
    static mask(element, msg = 'Loading') {
        if (element) {
            // Config object normalization
            if (element instanceof HTMLElement) {
                element = {
                    target : element,
                    text   : msg
                };
            }

            return Mask.mask(element, element.target);
        }
    }

    /**
     * Unmask the specified element.
     * @param {HTMLElement} element
     * @category Mask
     */
    static unmask(element, close = true) {
        if (element.mask) {
            if (close) {
                element.mask.close();
            }
            else {
                element.mask.hide();
            }
        }
    }

    //endregion

    //region Toast

    /**
     * Show a toast
     * @param {String} msg message to show in the toast
     * @category Mask
     */
    static toast(msg) {
        return Toast.show(msg);
    }

    //endregion
}
