import Delayable from './Delayable.js';
import DomClassList from '../helper/util/DomClassList.js';
import EventHelper from '../helper/EventHelper.js';

/**
 * @module Core/mixin/Hoverable
 */

const
    EDGES = {
        e : 'b-hover-edge',
        t : 'b-hover-top',
        r : 'b-hover-right',
        b : 'b-hover-bottom',
        l : 'b-hover-left'
    },
    EDGE_CLASSES = {
        [EDGES.e] : 1,
        [EDGES.t] : 1,
        [EDGES.r] : 1,
        [EDGES.b] : 1,
        [EDGES.l] : 1
    },
    ZONES = {
        t  : [EDGES.e, EDGES.t],
        r  : [EDGES.e, EDGES.r],
        b  : [EDGES.e, EDGES.b],
        l  : [EDGES.e, EDGES.l],
        tr : [EDGES.e, EDGES.t, EDGES.r],
        bl : [EDGES.e, EDGES.b, EDGES.l],
        tl : [EDGES.e, EDGES.t, EDGES.l],
        br : [EDGES.e, EDGES.b, EDGES.r]
    };

/**
 * This mixin provides mouse hover tracking.
 * ```
 *  class Tracker extends Base.mixin(Hoverable) {
 *      hoverEnter(leaving) {
 *          // this.hoverTarget has been entered from "leaving"
 *          // this.hoverTarget will never be null, but leaving may be null
 *      }
 *
 *      hoverLeave(leaving) {
 *          // this.hoverTarget has been entered from "leaving"
 *          // this.hoverTarget may be null, but leaving will never be null
 *      }
 *
 *      hoverMove(event) {
 *          // called when a mousemove is made within a hover target
 *          // this.hoverTarget will never be null
 *      }
 *  }
 *
 *  let tracker = new Tracker({
 *      hoverRootElement : document.body,
 *      hoverSelector    : '.hoverable'
 *  });
 * ```
 * @mixin
 * @internal
 */
export default Target => class Hoverable extends Target.mixin(Delayable) {
    static get $name() {
        return 'Hoverable';
    }

    //region Configs

    static get configurable() {
        return {
            /**
             * A CSS class to add to the {@link #config-hoverTarget target} element.
             * @config {String}
             */
            hoverCls : null,

            /**
             * A CSS class to add to the {@link #config-hoverTarget target} element to enable CSS animations. This class
             * is added after calling {@link #function-hoverEnter}.
             * @config {String}
             */
            hoverAnimationCls : null,

            /**
             * A CSS class to add to the {@link #config-hoverRootElement root} element.
             * @config {String}
             */
            hoverRootCls : null,

            /**
             * A CSS class to add to the {@link #config-hoverRootElement root} element when there is an active
             * {@link #config-hoverTarget target}.
             * @config {String}
             */
            hoverRootActiveCls : null,

            /**
             * The number of milliseconds to delay notification of changes in the {@link #config-hoverTarget}.
             * @config {Number}
             */
            hoverDelay : null,

            /**
             * The current element that the cursor is inside as determined by `mouseover` and `mouseout`. Changes in
             * this config trigger re-evaluation of the {@link #config-hoverSelector} to determine if there is a
             * {@link #config-hoverTarget}.
             * @config {HTMLElement}
             * @private
             */
            hoverElement : null,

            /**
             * An element to ignore. Mouse entry into this element will not trigger a change in either of the
             * {@link #config-hoverElement} or {@link #config-hoverTarget} values.
             * @config {HTMLElement}
             */
            hoverIgnoreElement : null,

            /**
             * This property is a string containing one character for each edge that is hoverable. For example, a
             * value of "tb" indicates that the top and bottom edges are hoverable.
             * @config {String}
             */
            hoverEdges : null,

            /**
             * When {@link #config-hoverEdges} is used, this value determines the size (in pixels) of the edge. When
             * the cursor is within this number of pixels of an edge listed in `hoverEdges`, the appropriate CSS class
             * is added to the {@link #config-hoverTarget}:
             *
             *  - `b-hover-top`
             *  - `b-hover-right`
             *  - `b-hover-bottom`
             *  - `b-hover-left`
             *
             * Depending on the values of `hoverEdges`, it is possible to have at most two of these classes present at
             * any one time (when the cursor is in a corner).
             * @config {Number}
             * @default
             */
            hoverEdgeSize : 10,

            /**
             * The outer element where hover tracking will operate (attach events to it and use as root limit when
             * looking for ancestors).
             *
             * A common choice for this will be `document.body`.
             * @config {HTMLElement}
             */
            hoverRootElement : {
                $config : 'nullify',

                value : null
            },

            /**
             * A selector for the [closest](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest) API to
             * determine the actual element of interest. This selector is used to process changes to the
             * {@link #config-hoverElement} to determine the {@link #config-hoverTarget}.
             * @config {String}
             */
            hoverSelector : null,

            /**
             * The currently active hover target. This will be the same as {@link #config-hoverElement} unless there is
             * a {@link #config-hoverSelector}.
             * @config {HTMLElement}
             */
            hoverTarget : {
                $config : 'nullify',

                value : null
            },

            /**
             * Set to `true` to include tracking of `mousemove` events for the active {@link #config-hoverTarget}. This
             * is required for the {@link #function-hoverMove} method to be called.
             * @config {Boolean}
             * @default false
             */
            hoverTrack : null,

            /**
             * A string value containing one character per active edge (e.g., "tr").
             * @config {String}
             * @private
             */
            hoverZone : null
        };
    }

    static get delayable() {
        return {
            setHoverTarget : 0
        };
    }

    //endregion
    //region State Handling

    /**
     * This method is called when the cursor enters the {@link #config-hoverTarget}. The `hoverTarget` will not be
     * `null`.
     * @param {HTMLElement} leaving The element that was previously the `hoverTarget`. This value may be null.
     */
    hoverEnter(leaving) {
        // template
    }

    /**
     * This method should return true if the given `element` should be ignored. By default, this is `true` if the
     * `element` is contained inside the {@link #config-hoverIgnoreElement}.
     * @param {HTMLElement} element
     * @returns {Boolean}
     * @protected
     */
    hoverIgnore(element) {
        return this.hoverIgnoreElement?.contains(element);
    }

    /**
     * This method is called when the cursor leaves the {@link #config-hoverTarget}. The `hoverTarget` may be `null`
     * or refer to the new `hoverTarget`
     * @param {HTMLElement} leaving The element that was previously the `hoverTarget`. This value will not be null.
     */
    hoverLeave(leaving) {
        // template
    }

    /**
     * This method is called when the mouse moves within a {@link #config-hoverTarget}, but only if enabled by the
     * {@link #config-hoverTrack} config.
     * @param {Event} event
     */
    hoverMove(event) {
        // template
    }

    //endregion
    //region Events

    onHoverMouseMove(event) {
        const
            me = this,
            { hoverEdges, hoverEdgeSize, hoverTarget } = me;

        if (hoverTarget) {
            if (hoverEdges) {
                const
                    { top, left, width, height, right, bottom } = hoverTarget.getBoundingClientRect(),
                    { clientX, clientY } = event,
                    centerX = left + width / 2,
                    centerY = top + height / 2,
                    t = clientY <  (hoverEdgeSize ? top    + hoverEdgeSize : centerY),
                    r = clientX >= (hoverEdgeSize ? right  - hoverEdgeSize : centerX),
                    b = clientY >= (hoverEdgeSize ? bottom - hoverEdgeSize : centerY),
                    l = clientX <  (hoverEdgeSize ? left   + hoverEdgeSize : centerX),
                    tb = ((t || b) ? (t ? 't' : 'b') : ''),
                    rl = ((r || l) ? (r ? 'r' : 'l') : '');

                me.hoverZone = (hoverEdges.includes(tb) ? tb : '') + (hoverEdges.includes(rl) ? rl : '');
            }

            me.hoverEvent = event;
            me.hoverTrack && me.hoverMove(event);
        }
    }

    onHoverMouseOver(event) {
        this.hoverEvent = event;
        this.hoverElement = event.target;
    }

    onHoverMouseOut(event) {
        this.hoverEvent = event;
        this.hoverElement = event.relatedTarget;
    }

    //endregion
    //region Configs

    // hoverDelay

    updateHoverDelay(delay) {
        this.setHoverTarget.delay = delay;
    }

    // hoverEdges

    changeHoverEdges(edges) {
        return (edges === true) ? 'trbl' : (edges || '').replace('v', 'tb').replace('h', 'lr');
    }

    updateHoverEdges() {
        this.syncHoverListeners();
    }

    // hoverElement

    changeHoverElement(element) {
        if (!this.hoverIgnore(element)) {
            return element;
        }
    }

    updateHoverElement(hoverEl) {
        const { hoverSelector } = this;

        if (hoverSelector) {
            hoverEl = hoverEl?.closest(hoverSelector);
        }

        this.setHoverTarget(hoverEl);  // this may be delayed
    }

    // hoverRootElement

    updateHoverRootElement(rootEl, was) {
        const { hoverRootCls } = this;

        if (hoverRootCls) {
            was?.classList.remove(hoverRootCls);
            rootEl?.classList.add(hoverRootCls);
        }

        this.syncHoverListeners();
    }

    // hoverTarget

    changeHoverTarget(hoverEl, was) {
        if (was) {
            this.hoverZone = null;
        }

        return hoverEl;
    }

    updateHoverTarget(hoverEl, was) {
        const
            me = this,
            { hoverCls, hoverAnimationCls, hoverRootActiveCls, hoverRootElement } = me;

        if (hoverRootActiveCls) {
            hoverRootElement?.classList[hoverEl ? 'add' : 'remove'](hoverRootActiveCls);
        }

        if (was) {
            hoverCls && was.classList.remove(hoverCls);
            hoverAnimationCls && was.classList.remove(hoverAnimationCls);

            me.hoverLeave(was);
        }

        if (hoverEl) {
            hoverCls && hoverEl.classList.add(hoverCls);

            me.hoverEnter(was);

            if (me.hoverTrack) {
                me.hoverMove(me.hoverEvent);
            }

            if (hoverAnimationCls) {
                hoverEl.getBoundingClientRect();   // force layout so next change starts animation
                hoverEl.classList.add(hoverAnimationCls);
            }
        }
    }

    // hoverTrack

    updateHoverTrack() {
        this.syncHoverListeners();
    }

    // hoverZone

    updateHoverZone(zone) {
        const { hoverAnimationCls, hoverTarget } = this;

        if (hoverTarget) {
            const
                { className } = hoverTarget,
                cls = DomClassList.change(className, /* add= */zone ? ZONES[zone] : null, /* remove= */EDGE_CLASSES);

            if (className !== cls) {
                hoverTarget.className = cls;

                if (zone && hoverAnimationCls) {
                    hoverTarget.classList.remove(hoverAnimationCls);
                    hoverTarget.getBoundingClientRect();   // force layout so next change starts animation
                    hoverTarget.classList.add(hoverAnimationCls);
                }
            }
        }
    }

    //endregion

    //region Misc

    setHoverTarget(target) {
        // this method runs later based on the hoverDelay
        this.hoverTarget = target;
    }

    syncHoverListeners() {
        const
            me = this,
            element = me.hoverRootElement,
            listeners = {
                element,
                thisObj   : me,
                mouseover : 'onHoverMouseOver',
                mouseout  : 'onHoverMouseOut'
            };

        if (me.hoverTrack || me.hoverEdges) {
            listeners.mousemove = 'onHoverMouseMove';
        }

        me._hoverRootDetacher?.();
        me._hoverRootDetacher = element && EventHelper.on(listeners);
    }

    //endregion
};
