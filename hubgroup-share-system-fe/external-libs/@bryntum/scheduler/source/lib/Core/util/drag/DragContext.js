import Base from '../../Base.js';
import DomHelper from '../../helper/DomHelper.js';
import EventHelper from '../../helper/EventHelper.js';
import Delayable from '../../mixin/Delayable.js';
import Finalizable from '../../mixin/Finalizable.js';
import Identifiable from '../../mixin/Identifiable.js';
import DomDataStore from '../../data/DomDataStore.js';
import Objects from '../../helper/util/Objects.js';

/**
 * @module Core/util/drag/DragContext
 */

const
    ABORTED  = Symbol('dragAbort'), // Drag has been aborted
    INIT     = Symbol('dragInit'),  // Button is down but insufficient movement to start the drag
    DRAGGING = Symbol('dragDrag'),  // Button is down and movement has started a drag
    DROPPED  = Symbol('dragDrop'),  // Button has been released and drop has occurred
    lockDirections = {
        x : 'horizontal',
        y : 'vertical'
    };

/**
 * This class is created during drag operations of {@link Core/mixin/Draggable}. It holds the state of an ongoing drag
 * operation.
 * @extends Core/Base
 * @internal
 */
export default class DragContext extends Base.mixin(Finalizable, Delayable, Identifiable) {
    static get configurable() {
        return {
            /**
             * The element that will have the {@link Core.mixin.Draggable#property-draggingItemCls}. This element is
             * determined by the {@link Core.mixin.Draggable#config-dragItemSelector}.
             * @config {HTMLElement}
             */
            itemElement : null,

            /**
             * The `ScrollManager` instance to use for scrolling while dragging.
             * @config {Core.util.ScrollManager}
             * @private
             */
            scrollManager : null,

            /**
             * Config for `startMonitoring` call.
             * @config {Object}
             * @private
             */
            monitoringConfig : null,

            /**
             * The source of the drag operation.
             * @config {Core.mixin.Draggable}
             * @default
             * @readonly
             */
            source : null,

            /**
             * The current target of the drag.
             * @member {Core.mixin.Droppable}
             * @readonly
             */
            target : null,

            /**
             * The current target element of the drag.
             * @member {HTMLElement}
             * @private
             */
            targetElement : null,

            /**
             * The minimum distance from the touchstart/mousedown/pointerdown that must be moved to actually start a
             * drag operation.
             * @config {Number}
             * @default
             * @readonly
             */
            threshold : 5,

            /**
             * The minimum amount of time a touch must be maintained before it will initiate a drag. Movement prior to
             * this time will cancel the drag in order to allow touch scrolling.
             * @config {Number}
             * @default
             */
            touchStartDelay : 300
        };
    }

    static get identifiable() {
        return {};
    }

    /**
     * The current DOM event being processed.
     * @member {Event} event
     * @readonly
     */

    construct(...args) {
        super.construct(...args);

        const
            me = this,
            { event } = me;

        Object.assign(me, {
            /**
             * This property holds the `altKey` state of the most recent event.
             * @member {Boolean}
             */
            altKey : null,

            /**
             * An array of functions to call when cleaning up the context instance.
             * @member {Function[]}
             * @private
             */
            cleaners : [],

            /**
             * This property holds the `ctrlKey` state of the most recent event.
             * @member {Boolean}
             */
            ctrlKey : null,

            /**
             * Container for data associated with the drag. Data items are added by the {@link Core.mixin.Draggable}
             * when the drag starts.
             * @member {Map}
             * @private
             */
            data : new Map(),

            /**
             * The element from which the drag operation started.
             * @member {HTMLElement}
             * @readonly
             */
            element : event.target,

            /**
             * The event that completed the drag (a `mouseup`, `pointerup` or `touchend`).
             * @member {Event}
             * @readonly
             */
            endEvent : null,

            /**
             * The most recent `mousemove`, `pointermove` or `touchmove` event.
             * @member {Event}
             * @private
             */
            lastMoveEvent : null,

            /**
             * This property holds the `metaKey` state of the most recent event.
             * @member {Boolean}
             */
            metaKey : null,

            /**
             * The previous {@link #property-target} of the drag.
             * @member {Core.mixin.Droppable}
             * @readonly
             */
            previousTarget : null,

            /**
             * The scroll actions reported by the {@link #config-scrollManager}.
             * @member {Object}
             * @private
             */
            scrollerAction : null,

            /**
             * This property holds the `shiftKey` state of the most recent event.
             * @member {Boolean}
             */
            shiftKey : null,

            /**
             * This property holds the current state of the drag process.
             *
             * This will be one of the following values:
             *
             *  - `DragContext.STATE.INIT` - The button is down but there is insufficient movement to start the drag.
             *  - `DragContext.STATE.DRAGGING` - The button is down and movement has started the drag.
             *  - `DragContext.STATE.DROPPED` - The button has been released and drop has occurred.
             *  - `DragContext.STATE.ABORTED` - The drag has been aborted (this happens if the user presses the `ESC`
             *    key or if the {@link #function-abort} method is called).
             *
             * @member {Symbol}
             * @readonly
             * @internal
             */
            state : INIT,

            /**
             * The event that started the drag operation.
             * @member {Event}
             * @readonly
             */
            startEvent : event,

            /**
             * The timer that fires when a touch pointermove is allowed to start the drag. A touch pointermove event
             * prior to this will `abort()` the drag to allow touch scrolling.
             * @member {Number}
             * @private
             */
            touchStartTimer : null,

            /**
             * Stores the value from writes to the {@link #property-valid} property.
             * @member {Boolean}
             * @private
             */
            _valid : true
        });

        if (('touches' in event) && me.touchStartDelay) {
            me.touchStartTimer = me.setTimeout(() => me.touchStartTimer = null, me.touchStartDelay, 'touchStartDelay');
        }
    }

    doDestroy() {
        const
            me = this,
            { source, target } = me;

        me.cleanup();

        if (target?.dropping === me) {
            target.dropping = null;
        }

        if (source?.dragging === me) {
            source.dragging = null;
        }

        super.doDestroy();
    }

    /**
     * This property is `true` if the {@link #function-abort} method was called and `false` otherwise. This
     * is typically because the user pressed the ESC key, however, a drag can be aborted for other reasons.
     * @property {Boolean}
     * @readonly
     */
    get aborted() {
        return this.state === ABORTED;
    }

    /**
     * Returns `true` if the drag has completed either by mouse/pointerup or the {@link #function-abort} method.
     * @property {Boolean}
     * @readonly
     */
    get completed() {
        return this.aborted || this.endEvent !== null;
    }

    /**
     * This property is `true` if the drag {@link #config-threshold} has not yet been reached.
     * @property {Boolean}
     * @readonly
     */
    get pending() {
        return this.state === INIT;
    }

    /**
     * This property is `true` if the drag {@link #config-threshold} has been reached and the drag operation is active.
     * @property {Boolean}
     * @readonly
     */
    get started() {
        return this.state !== INIT && !this.aborted;
    }

    /**
     * This property is `true` when the drag is in a valid drop state. This can be set to `false` to indicate the drop
     * is invalid. Setting to `true` does not ensure that the property will be `true` when next read due to other factors
     * that are required to make the drop valid. For example, setting `valid = true` will still return `false` if called
     * before the drag {@link #config-threshold} has not been reached or if the {@link #function-abort} method has been
     * called.
     * @property {Boolean}
     */
    get valid() {
        return this.started && this.targetElement != null && this._valid;
    }

    set valid(v) {
        this._valid = v;
    }

    //region Data Access

    /**
     * Retrieves a data item from the drag source. This method can only be called after the drag has completed.
     * @param {String|String[]} name The name of the data item.
     * @returns {*}
     * @async
     */
    async get(name) {
        if (this.aborted) {
            throw new Error('Data is not available on aborted drag');
        }
        if (!this.completed) {
            throw new Error('Data is not available until drag completion');
        }

        if (Array.isArray(name)) {
            return Promise.all(name.map(s => this.get(s)));
        }

        let value = this.data.get(name);

        if (typeof value === 'function') {
            value = await value();

            this.data.set(name, value);
        }

        return value;
    }

    /**
     * Returns `true` if the named data item is present.
     * @param {String} name The name of the data item.
     * @returns {Boolean}
     */
    has(name) {
        return this.data.has(name);
    }

    /**
     * Retrieves a data item from the drag source if it is available. This will return `true` for an item that was
     * {@link #function-set} using a renderer function.
     * @param {String|String[]} name The name of the data item.
     * @returns {*}
     */
    peek(name) {
        if (this.aborted) {
            throw new Error('Data is not available on aborted drag');
        }

        if (Array.isArray(name)) {
            return name.map(s => this.peek(s));
        }

        let value = this.data.get(name);

        if (typeof value === 'function') {
            value = true;
        }

        return value;
    }

    /**
     * Sets a data item for the drag. If a function is passed, it is called to render the data only if that data is
     * actually requested via the {@link #function-get} method. A data renderer function can be `async`.
     * @param {String} name The name of the data item.
     * @param {*} value The value of the data item.
     */
    set(name, value) {
        this.data.set(name, value);
    }

    //endregion
    //region Configs

    changeTarget(target, was) {
        if (target !== was) {
            const me = this;

            me._target = target;
            me.previousTarget = was;

            if (was) {
                was.dropping = null;
            }

            if (target) {
                target.dropping = me;  // calls dragEnter/Leave on the target

                if (target.dropping !== me) {  // if (target did not accept us)
                    target = null;

                    me.valid = false;
                }
            }

            me._target = was;
        }

        return target;
    }

    updateTarget(target, was) {
        const me = this;

        if (was) {
            me.source.dragLeaveTarget(me, was);
        }

        if (target) {
            me.valid = true;

            // Always give the target an initial dragMove since feedback/indicators will need to update on move and
            // the lack of a move on entry will just make that a special case.
            target.dragMove(me);

            me.source.dragEnterTarget(me);
        }
    }

    updateTargetElement(targetElement) {
        let droppable,
            droppables,
            droppableSelector,
            i,
            t;

        // We interrogate all encapsulating DOM elements to see if we are in a Droppable's element.
        // If we find an element which has Droppables registered for it, we attempt to set each as
        // our target, and go with the first one that accepts us.
        // changeTarget sets target.dropping to this Context, and the target's dragEnter implementation
        // may reject it by returning false.
        for (t = targetElement; t; t = t.parentElement) {
            droppables = DomDataStore.get(t, 'droppables');

            if (droppables) {
                for (i = 0; i < droppables.length; ++i) {
                    droppable = droppables[i];

                    // If the event target is *inside* the Droppable's root, we can ask the Droppable
                    // to accept this DragContext.
                    // Otherwise we can get a hit on borders.
                    if (droppable.dropRootElement.contains(targetElement)) {
                        droppableSelector = droppable.droppableSelector;

                        // If the target element is not inside the Droppable's selector, give up.
                        if (!droppableSelector || targetElement.closest(`#${DomHelper.getId(droppable.dropRootElement)} ${droppableSelector}`)) {
                            this.target = droppable;

                            // The found Droppable accepted this DragContext, so we're done -
                            // we are using this Droppable.
                            if (this.target === droppable) {
                                return;
                            }
                        }
                    }
                }
            }
        }
    }

    //endregion
    //region Operations

    /**
     * Aborts the drag. After calling this method, {@link #property-aborted} will be `true`, {@link #property-valid}
     * will be `false` and {@link #property-completed} will be `true`.
     */
    abort() {
        const
            me = this,
            { element, source } = me;

        // Force a synchronous layout so that transitions from this point will work.
        element?.getBoundingClientRect();

        if (me.state !== DROPPED) {
            me.state = ABORTED;
            me.cleanup();
        }

        source?.endDrag(me);
    }

    begin() {
        const
            me = this,
            { source } = me,
            ret = source.beforeDrag(me);

        if (ret !== false) {
            source.dragging = me;
        }

        return ret;
    }

    cleanup() {
        let cleaner;

        while ((cleaner = this.cleaners.pop())) {
            cleaner();
        }
    }

    end(event) {
        const
            me = this,
            { lastMoveEvent : lastEvent, target } = me,
            { dragSwallowClickTime } = me.source;

        me.event = me.endEvent = event;
        me.syncFlags();

        if (me.started) {
            if (lastEvent?.clientX !== event.clientX || lastEvent?.clientY !== event.clientY ||
                lastEvent?.target !== event.target) {
                // Make sure the drop event is preceded by a move to the final position...
                me.track();
            }

            if (dragSwallowClickTime) {
                // Prevent the impending document click from the mouseup event from propagating
                // into a click on our element.
                EventHelper.on({
                    element : document,
                    capture : true,
                    expires : dragSwallowClickTime, // In case a click did not ensue, remove the listener
                    once    : true,

                    click(event) {
                        event.stopPropagation();
                    }
                });
            }

            me.state = DROPPED;

            if (target !== me.source) {
                // If we are the target and not also the source, we need to call dragDrop() now. If we are
                // the source, dragDrop() will be called by Draggable.
                target?.dragDrop(me);
            }
        }
    }

    fakeKey(event, down) {
        const
            me = this,
            { lastMoveEvent } = me;

        if (lastMoveEvent && me.element) {
            let changed;

            // Indicate that this is a 'fake' mousemove event as a result of the keydown
            lastMoveEvent.isKey = true;

            if (event.key === 'Alt') {
                if (me.altKey !== down) {
                    me.altKey = down;
                    changed = true;
                }
            }
            else if (event.key === 'Control') {
                if (me.ctrlKey !== down) {
                    me.ctrlKey = down;
                    changed = true;
                }
            }

            if (changed) {
                me.event = lastMoveEvent;

                me.track();
            }
        }
    }

    keyDown(event) {
        if (!this.completed) {
            if (event.key === 'Escape') {
                this.abort();
            }
            else if (this.isDragToggleKey(event.key)) {
                this.fakeKey(event, true);
            }
        }
    }

    keyUp(event) {
        if (!this.completed && this.isDragToggleKey(event.key)) {
            this.fakeKey(event, false);
        }
    }

    getDistance(event) {
        return EventHelper.getDistanceBetween(this.startEvent, event);
    }

    isDragToggleKey(key) {
        return key === 'Control' || key === 'Alt';
    }

    move(event) {
        const
            me = this,
            { target } = event,
            distance = me.getDistance(event),
            significant = distance >= me.threshold;

        me.syncFlags();

        if (me.touchStartTimer) {
            if (significant) {
                me.abort();
            }
            return;
        }

        if (target && target.nodeType === Node.ELEMENT_NODE) {
            if (significant && !me.started) {
                me.event = event;

                // triggers beforeDragStart, dragStart. returning false from beforeDragStart aborts drag
                if (me.start() === false) {
                    me.abort();
                    return;
                }
            }

            if (me.started) {
                me.lastMoveEvent = me.event = event;

                // to prevent view drag (scroll) on ipad
                if (event.type === 'touchmove') {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                }

                me.track();
            }
        }
    }

    start() {
        const
            me = this,
            { scrollManager, monitoringConfig, source } = me,
            { draggingBodyCls : activeCls, dragLock } = source,
            element = /* source.dragWithin || */ source.dragRootElement;

        me.state = DRAGGING;

        // Now that the drag drop is confirmed to be starting, activate the configured scrollManager if present
        if (scrollManager) {
            const detacher = scrollManager.startMonitoring(Objects.merge({
                scrollables : [{
                    element
                }],
                direction : lockDirections[dragLock] || dragLock || 'both',
                callback(scrollerAction) {
                    const { lastMoveEvent } = me;

                    if (lastMoveEvent && me.element) {
                        // Indicate that this is a 'fake' mousemove event as a result of the scrolling
                        lastMoveEvent.isScroll = true;

                        me.event = lastMoveEvent;
                        me.scrollerAction = scrollerAction;

                        me.track();

                        me.scrollerAction = null;
                    }
                }
            }, monitoringConfig));

            me.cleaners.push(detacher);
        }

        // Global informational class for when DragHelper is dragging
        const rootEl = source.dragRootElement.closest('.b-outer') || document.body;
        rootEl.classList.add(activeCls);

        me.cleaners.push(() => rootEl.classList.remove(activeCls));

        if (source.startDrag(me) === false) {
            me.cleanup();

            return false;
        }
    }

    syncFlags() {
        const
            me = this,
            { event } = me;

        me.altKey = event.altKey;
        me.ctrlKey = event.ctrlKey;
        me.metaKey = event.metaKey;
        me.shiftKey = event.shiftKey;
    }

    track() {
        const
            me = this,
            { event, source, target } = me;

        let targetElement = event.target,
            touch;

        // NOTE: we cannot syncFlags here since we are called to pass along keydown events as movement updates

        // "pointer-events:none" touchmove has no effect for the touchmove event target, meaning we cannot know
        // what's under the cursor as easily in touch devices
        if (event.type === 'touchmove') {
            touch = event.changedTouches[0];

            // From MDN:
            //  * clientX/Y - the coordinates of the touch point relative to the left/top edge of the browser viewport,
            //    not including any scroll offset.
            //  * The elementFromPoint() method returns the topmost Element at the specified coordinates (relative to
            //    the viewport).
            targetElement = DomHelper.elementFromPoint(touch.clientX, touch.clientY);
        }

        me.targetElement = targetElement;  // when we change elements, update me.target

        if (target === me.target) {
            // if we have a target and that did not change due to setting targetElement, we need to inform the target
            // of the drag move
            target?.dragMove(me);
        }

        source.trackDrag(me);
    }

    //endregion
}

DragContext.prototype.STATE = DragContext.STATE = Object.freeze({
    ABORTED,
    INIT,
    DRAGGING,
    DROPPED
});
