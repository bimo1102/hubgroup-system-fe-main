import Base from '../Base.js';
import Delayable from '../mixin/Delayable.js';
import EventHelper from '../helper/EventHelper.js';
import DomHelper from '../helper/DomHelper.js';
import VersionHelper from '../helper/VersionHelper.js';

/**
 * @module Core/util/ScrollManager
 */

/**
 * Monitors the mouse position over an element and scrolls the element if the cursor is close to edges. This is used by
 * various features to scroll the grid section element, for example dragging elements close to edges.
 *
 * ```javascript
 * // Instantiate manager for the container element having overflowing content
 * const manager = new ScrollManager({ element : document.querySelector('.container') });
 *
 * // Start monitoring. When pointer approaches 50px region within monitored element edge, scrolling begins
 * manager.startMonitoring();
 *
 * // Stop monitoring.
 * manager.stopMonitoring();
 * ```
 */
export default class ScrollManager extends Delayable(Base) {
    //region Default config

    static get configurable() {
        return {
            /**
             * Default element to use for scrolling. Can be overridden in calls to `startMonitoring()`.
             * @config {HTMLElement}
             */
            element : null,

            /**
             * Width in pixels of the area at the edges of an element where scrolling should be triggered
             * @config {Number}
             * @default
             */
            zoneWidth : 50,

            /**
             * Scroll speed, higher number is slower. Calculated as "distance from zone edge / scrollSpeed"
             * @config {Number}
             * @default
             */
            scrollSpeed : 5,

            /**
             * The direction(s) to scroll ('horizontal', 'vertical' or 'both')
             * @config {String}
             */
            direction : 'both',

            /**
             * Number of milliseconds to wait before scroll starts when the mouse is moved close to an edge monitored by this scroll manager
             * @config {Number}
             * @default
             */
            startScrollDelay : 500,

            /**
             * Set to true to stop scrolling when pointing device leaves the scrollable element.
             * @config {Boolean}
             * @default
             */
            // https://github.com/bryntum/support/issues/394
            stopScrollWhenPointerOut : false,

            testConfig : {
                scrollSpeed      : 2,
                startScrollDelay : 0
            },

            activeScroll : {
                $config : ['lazy'],
                value   : {}
            },

            monitoring : {
                $config : ['lazy', 'nullify'],
                value   : true
            }
        };
    }

    changeMonitoring(value, was) {
        was?.clear();

        return new Map();
    }

    //endregion

    doDestroy() {
        this.stopMonitoring();
        super.doDestroy();
    }

    /**
     * Returns true if some of the monitored elements is being scrolled at the moment.
     * @property {Boolean}
     * @readonly
     */
    get isScrolling() {
        return Object.keys(this.activeScroll).length !== 0;
    }

    //region Start/stop monitoring

    /**
     * Starts monitoring an element. It will be scrolled if mouse is pressed and within `zoneWidth` pixels from element
     * edge. Supports monitoring multiple elements using `scrollables` option:
     *
     * ```javascript
     * new ScrollManager({ element : '.item' }).startMonitoring({
     *     scrollables : [
     *         {
     *             // Applies config to all elements matching `.item .child-item`
     *             // selector
     *             element : '.child-item',
     *             // Only manage vertical scroll
     *             direction : 'vertical',
     *             // Specific callback for this scrollable. Shared callback is
     *             // ignored.
     *             callback : () => console.log('Specific callback')
     *         },
     *         {
     *             // Instance can be used
     *             element : document.querySelector('.item .child2')
     *             // Direction and callback are not provided, so element will
     *             // be scrollable in horizontal direction and will use shared
     *             // callback
     *         }
     *     ],
     *     direction : 'horizontal',
     *     callback  : () => console.log('Shared callback')
     * })
     * ```
     *
     * @param {Object} config Element which might be scrolled or config { element, callback, thisObj }
     * @param {HTMLElement|String} [config.element] Element or selector. Overrides default element. **Deprecated**: use
     * `scrollables` instead
     * @param {String} [config.direction] Direction to scroll. Overrides default scroll direction
     * @param {Function} [config.callback] Callback to execute on every scroll of the target element.
     *
     * ```javascript
     * startMonitoring({
     *     callback(monitor) {
     *         // Current left and top scroll of the monitored element
     *         console.log(monitor.scrollLeft)
     *         console.log(monitor.scrollTop)
     *         // Scroll position relative to the initial position
     *         console.log(monitor.relativeScrollLeft)
     *         console.log(monitor.relativeScrollTop)
     *     }
     * })
     * ```
     *
     * @param {Object} [config.thisObj] Scope for the callback.
     * @param {Object[]} [config.scrollables] Array of configs if multiple elements should be monitored.
     * @param {HTMLElement|String} [config.scrollables.0.element] Element or selector.
     * @param {String} [config.scrollables.0.direction] Direction to scroll. Overrides upper config object direction.
     * @param {Function} [config.scrollables.0.callback] Callback to execute on every scroll of the target element.
     * Overrides upper config object callback.
     * @returns {Function} Returns function to cleanup instantiated monitors
     * ```javascript
     * const detacher = new ScrollManager({ element }).startMonitoring({ ... });
     * detacher(); // All monitors setup by the previous call are removed
     * ```
     */
    startMonitoring(config = {}) {
        const
            me = this,
            {
                element,
                direction : defaultDirection
            }  = me,
            {
                scrollables = [],
                direction   = defaultDirection,
                callback
            }  = config,
            attachedElements = [];

        if (config.element) {
            VersionHelper.deprecate('core', '5.0.0', '`element` config is deprecated, please use `scrollables` instead.');

            scrollables.push({
                element : config.element
            });
        }

        if (!scrollables.length) {
            scrollables.push({ element });
        }

        scrollables.forEach(scrollable => {
            const target = scrollable.element;

            if (typeof target === 'string') {
                DomHelper.forEachSelector(element, target, element => {
                    me.createMonitor(element, scrollable.direction || direction, scrollable.callback || callback);
                    attachedElements.push(element);
                });
            }
            else {
                me.createMonitor(target, scrollable.direction || direction, scrollable.callback || callback);
                attachedElements.push(target);
            }
        });

        return function detacher() {
            me.stopMonitoring(attachedElements);
        };
    }

    createMonitor(element, direction, callback) {
        const { monitoring } = this;

        if (!monitoring.has(element)) {
            monitoring.set(element, new ScrollManagerMonitor({
                scrollManager : this,
                element,
                direction,
                callback
            }));
        }
    }

    /**
     * Stops monitoring an element. If no particular element is given, stop monitoring everything.
     * @param {HTMLElement|HTMLElement[]} [element] Element or array of elements for which monitoring is not desired any
     * more and should stop as soon as possible.
     */
    stopMonitoring(element) {
        const
            me             = this,
            { monitoring } = me;

        if (element && !Array.isArray(element)) {
            element = [element];
        }

        if (monitoring) {
            // Stop all if no element given
            if (!element) {
                monitoring.forEach(monitor => me.stopMonitoring(monitor.element));
                return;
            }

            element.forEach(element => {
                const monitor = monitoring.get(element);

                // cant stop nothing...
                if (monitor) {
                    monitor.destroy();
                    monitoring.delete(element);
                }
            });
        }
    }

    //endregion

    /*
     * Attempts to reserve given scrolling direction for the given monitor.
     * @param {String} direction 'horizontal' or 'vertical'
     * @param {Object} monitor
     * @returns {Boolean} Returns true in case scroll direction was reserved for given monitor. False otherwise.
     * @private
     */
    requestScroll(direction, monitor) {
        const { activeScroll } = this;

        if (direction in activeScroll && activeScroll[direction] !== monitor) {
            return false;
        }
        else {
            activeScroll[direction] = monitor;
            return true;
        }
    }

    /*
     * Releases all scroll directions, blocked by given monitor
     * @param {Object} monitor
     * @private
     */
    releaseScroll(monitor) {
        const { activeScroll = {} } = this;

        Object.keys(activeScroll).forEach(key => {
            if (activeScroll[key] === monitor) {
                delete activeScroll[key];
            }
        });
    }

    //#region Scroll position

    getRelativeScroll(element, direction = 'left') {
        let result = 0;

        this.monitoring.forEach((monitor, monitoredElement) => {
            if (DomHelper.isDescendant(monitoredElement, element)) {
                result += direction === 'left' ? monitor.scrollRelativeLeft : monitor.scrollRelativeTop;
            }
        });

        return result;
    }

    //#endregion
}

class ScrollManagerMonitor extends Base {
    construct(config) {
        const
            me              = this,
            { element }     = config,
            startScrollLeft = element.scrollLeft,
            startScrollTop  = element.scrollTop;

        Object.assign(config, { startScrollLeft, startScrollTop });

        super.construct(config);

        // listen to mousemove to determine if scroll needed or not
        EventHelper.on({
            element,
            scroll    : 'onElementScroll',
            mousemove : 'onMouseMove',
            touchmove : 'onMouseMove',
            // Capture pointermove events early to start scrolling from top elements
            capture   : true,
            thisObj   : me
        });

        // `pointerleave` should have `capture: false`, otherwise it works much like `pointerout`
        EventHelper.on({
            element,
            pointerleave : 'onPointerLeave',
            thisObj      : me
        });
    }

    doDestroy() {
        this.stopScroll();
        super.doDestroy();
    }

    /**
     * Starts scrolling (see #performScroll). Called from onMouseMove.
     * @private
     */
    startScroll() {
        this.scrolling = true;
        this.performScroll();
    }

    /**
     * Stops scrolling. Called from onMouseMove.
     * @private
     */
    stopScroll() {
        const me = this;

        me.scrolling = false;
        if (me.scrollRequested) {
            me.scrollManager.cancelAnimationFrame(me.frameId);
            me.scrollRequested = false;
        }
        me.scrollManager.clearTimeout(me.scrollTimeout);
        me.scrollManager.releaseScroll(me);
        me.scrollTimeout = null;
    }

    onPointerLeave() {
        this.scrollManager.stopScrollWhenPointerOut && this.stopScroll();
    }

    /**
     * Listener for mouse move on monitored element. Determines if scrolling is needed, and if so how fast to scroll.
     * See #zoneWidth & #scrollSpeed configs.
     * @private
     * @param {MouseEvent} event
     */
    onMouseMove(event) {
        const
            me    = this,
            {
                scrollManager
            }     = me,
            box   = me.element.getBoundingClientRect(),
            width = scrollManager.zoneWidth,
            speed = scrollManager.scrollSpeed;

        // scroll left, right, up or down?
        me.scrollDeltaX = me.scrollDeltaY = 0;

        if (me.direction !== 'vertical') {
            const { scrollLeft, scrollWidth, clientWidth } = me.element;

            // Only start scrolling if it is possible
            if (event.clientX > box.right - width && scrollWidth - scrollLeft - clientWidth >= 1) {
                me.scrollDeltaX = Math.round((width - (box.right - event.clientX)) / speed) + 1;
            }
            else if (event.clientX < box.left + width && scrollLeft > 0) {
                me.scrollDeltaX = -Math.round((width + (box.left - event.clientX)) / speed) - 1;
            }
        }

        if (me.direction !== 'horizontal') {
            const { scrollTop, scrollHeight, clientHeight } = me.element;

            // Only start scrolling if it is possible
            if (event.clientY > box.bottom - width && scrollHeight - scrollTop - clientHeight >= 1) {
                me.scrollDeltaY = Math.round((width - (box.bottom - event.clientY)) / speed) + 1;
            }
            else if (event.clientY < box.top + width && scrollTop > 0) {
                me.scrollDeltaY = -Math.round((width + (box.top - event.clientY)) / speed) - 1;
            }
        }

        if (me.scrollDeltaX !== 0 && !scrollManager.requestScroll('horizontal', me)) {
            me.scrollDeltaX = 0;
        }

        if (me.scrollDeltaY !== 0 && !scrollManager.requestScroll('vertical', me)) {
            me.scrollDeltaY = 0;
        }

        if (me.scrollDeltaX === 0 && me.scrollDeltaY === 0) {
            me.stopScroll();
        }
        else if (!me.scrollTimeout) {
            me.scrollTimeout = scrollManager.setTimeout(() => me.startScroll(), scrollManager.startScrollDelay);
        }
    }

    /**
     * Scrolls by an amount determined by config.scrollDeltaX/Y on each frame. Start/stop by calling #startScroll and
     * #stopScroll.
     * @private
     */
    performScroll() {
        const
            me          = this,
            { element } = me;
        // this function is called repeatedly on each frame for as long as scrolling is needed

        // check that scrolling is needed
        if (me.scrolling && !me.scrollRequested) {
            // Scroll the determined amount of pixels if possible
            if (me.scrollDeltaX !== 0) {
                const
                    oldScrollLeft = element.scrollLeft,
                    newScrollLeft = Math.min(oldScrollLeft + me.scrollDeltaX, element.scrollWidth - element.clientWidth);

                if (newScrollLeft !== oldScrollLeft) {
                    element.scrollLeft = newScrollLeft;
                }
            }

            if (me.scrollDeltaY !== 0) {
                const
                    oldScrollTop = element.scrollTop,
                    newScrollTop = Math.min(oldScrollTop + me.scrollDeltaY, element.scrollHeight - element.clientHeight);

                if (newScrollTop !== oldScrollTop) {
                    element.scrollTop = newScrollTop;
                }
            }

            // scroll some more on next frame
            me.scrollRequested = true;

            me.frameId = me.scrollManager.requestAnimationFrame(() => {
                me.scrollRequested = false;
                me.performScroll(me);
            });
        }
    }

    onElementScroll() {
        this.config?.callback?.call(this.thisObj || this.scrollManager, this);
    }

    get scrollLeft() {
        return this.element.scrollLeft;
    }

    get scrollTop() {
        return this.verticalElement ? this.verticalElement.scrollTop : this.element.scrollTop;
    }

    get scrollRelativeLeft() {
        return this.scrollLeft - this.startScrollLeft;
    }

    get scrollRelativeTop() {
        return this.scrollTop - this.startScrollTop;
    }

    // There could be several scrollables controlling different axes. If we want to calculate combined scroll from all
    // those monitors (e.g. for the case when we drag scheduler event in both directions), we should ask scroll manager
    // to iterate over monitored elements and aggregate scroll.
    getRelativeLeftScroll(element) {
        return this.scrollManager.getRelativeScroll(element, 'left');
    }

    getRelativeTopScroll(element) {
        return this.scrollManager.getRelativeScroll(element, 'top');
    }
}
