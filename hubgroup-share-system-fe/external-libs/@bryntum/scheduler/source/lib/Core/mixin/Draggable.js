import Base from '../Base.js';
import EventHelper from '../helper/EventHelper.js';
import BrowserHelper from '../helper/BrowserHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';

import DragContext from '../util/drag/DragContext.js';
import DragProxy from '../util/drag/DragProxy.js';

/**
 * @module Core/mixin/Draggable
 */

/**
 * Mix this into another class to enable drag/drop support.
 *
 * To use a draggable, it must be associated with an element that contains draggable content:
 *
 * ```javascript
 *  let draggable = new MyDraggable({
 *      dragRootElement : someElement
 *  });
 * ```
 *
 * Once the `dragRootElement` is assigned, any element inside that root is a candidate for dragging. To limit the
 * allowed element, set the {@link #config-dragSelector} config.
 *
 * ```javascript
 *  let draggable = new MyDraggable({
 *      dragRootElement : someElement,
 *      dragSelector    : '.drag-this'
 *  });
 * ```
 * @mixin
 * @internal
 */
export default Target => class Draggable extends (Target || Base) {
    static get $name() {
        return 'Draggable';
    }

    //region Configs

    static get configurable() {
        return {
            /**
             * The current `DragContext`. This is created immediately on pointerdown but does not become active until
             * some movement occurs. This {@link #config-dragThreshold threshold} is configurable.
             * @member {Core.util.drag.DragContext}
             * @readonly
             */
            dragging : null,

            /**
             * A CSS selector to use to ascend from the {@link #config-dragRootElement} to find the element that will
             * gain the {@link #property-draggingCls} and {@link #property-draggingStartedCls} CSS classes.
             * @config {String}
             */
            draggingClsSelector : null,

            /**
             * The listeners to add to the `document` during a drag.
             * @config {Object}
             * @private
             */
            dragDocumentListeners : {
                element : document,
                keydown : 'onDragKeyDown',
                keyup   : 'onDragKeyUp',

                // On mobile, a long-press will (sometimes) trigger a context menu, so we suppress it:
                contextmenu : 'onDragContextMenu',

                // We don't use pointermove/up because they get snared in the "touch-action" vs "pan-x/y" trap and we
                // cannot prevent panning (aka scrolling) in response to move events if we go that way:
                mousemove : 'onDragPointerMove',
                mouseup   : 'onDragPointerUp',

                // Touch desktops don't fire touchend event when touch has ended, instead pointerup is fired. iOS does
                // fire touchend:
                pointerup : 'onDragPointerUp',
                touchend  : 'onDragPointerUp',
                touchmove : {
                    handler : 'onDragPointerMove',
                    passive : false // We need to be able to preventDefault on the touchmove
                }
            },

            /**
             * A CSS selector to use to ascend from the drag element to find the element that will gain the
             * {@link #property-draggingItemCls} CSS class. If not supplied, the drag element will gain this CSS
             * class.
             * @config {String}
             */
            dragItemSelector : null,

            /**
             * A CSS class to add to items identified by the {@link #config-dragItemSelector} when the mouse
             * enters.
             * @config {String}
             */
            dragItemOverCls : null,

            /**
             * A function to call when the pointer enters a {@link #config-dragItemSelector}.
             * @config {Function} onDragItemMouseEnter
             */

            /**
             * A function to call when the pointer moves inside a {@link #config-dragItemSelector}.
             * @config {Function} onDragItemMouseMove
             */

            /**
             * A function to call when the pointer leaves a {@link #config-dragItemSelector}.
             * @config {Function} onDragItemMouseLeave
             */

            /**
             * Configure as `'x'` to lock dragging to the `X` axis (the drag will only move horizontally) or `'y'`
             * to lock dragging to the `Y` axis (the drag will only move vertically).
             * @config {String}
             */
            dragLock : null,

            /**
             * The minimum distance a drag must move to be considered a drop and not
             * {@link Core.util.drag.DragContext#property-aborted aborted}.
             * @config {Number}
             * @default
             */
            dragMinDistance : 1,

            /**
             * The {@link Core.util.drag.DragProxy drag proxy} is a helper object that can be used to display feedback
             * during a drag.
             * @config {Object|Core.util.drag.DragProxy}
             */
            dragProxy : {
                $config : ['lazy', 'nullify'],

                value : null
            },

            /**
             * The outer element where dragging will operate (attach events to it and use as root limit when looking
             * for ancestors).
             * @config {HTMLElement}
             */
            dragRootElement : {
                $config : 'nullify',

                value : null
            },

            /**
             * Set to `true` to allow a drag to drop on to the same element from which the drag started.
             * @config {Boolean}
             * @default
             */
            dragSameTargetDrop : false,

            /**
             * A CSS selector used to determine which element(s) can be dragged.
             * @config {String}
             * @default
             */
            dragSelector : null,

            /**
             * The number of milliseconds after a pointerup to ignore click events on the document. This
             * is used to avoid the "up" event itself generating a `click` on the target.
             * @config {Number}
             * @default
             */
            dragSwallowClickTime : 50,

            /**
             * The amount of pixels to move pointer/mouse before it counts as a drag operation.
             * @config {Number}
             * @default
             */
            dragThreshold : 5,

            /**
             * The number of milliseconds that must elapse after a `touchstart` event before it is considered a drag. If
             * movement occurs before this time, the drag is aborted. This is to allow touch swipes and scroll gestures.
             * @config {Number}
             * @default
             */
            dragTouchStartDelay : 300,

            /**
             * The CSS selector to use to identify the closest valid target from the event target.
             * @config {String}
             */
            dropTargetSelector : null,

            /**
             * The {@link #config-dragSelector} item the mouse is currently over.
             * @member {HTMLElement} overItem
             * @readonly
             */
            overItem : null,

            testConfig : {
                // In Edge synthetic click events are fired asynchronously and can take considerable
                // amount of time. Setting larger click swallow timeout to make sure Edge has time to fire click event.
                // Caught by test EventDrag4.t in Edge
                dragSwallowClickTime : BrowserHelper.isEdge ? 300 : 50
            }
        };
    }

    static get properties() {
        return {
            /**
             * The CSS class to add to the {@link #config-dragRootElement} (or {@link #config-draggingClsSelector} from
             * there) as soon as the pointerdown event occurs.
             * @member {String}
             * @readonly
             */
            draggingCls : 'b-draggable-active',

            /**
             * The CSS class to add to the `body` element as soon as the {@link #config-dragThreshold} is reached and
             * an actual drag is in progress.
             * @member {String}
             * @readonly
             */
            draggingBodyCls : 'b-draghelper-active',  // match DragHelper since we need the same treatment

            /**
             * The CSS class to add to the element being dragged as soon as the pointerdown event occurs.
             * @member {String}
             * @readonly
             */
            draggingItemCls : 'b-dragging-item',

            /**
             * The CSS class to add to the {@link #config-dragRootElement} (or {@link #config-draggingClsSelector} from
             * there) as soon as the {@link #config-dragThreshold} is reached and an actual drag is in progress.
             * @member {String}
             * @readonly
             */
            draggingStartedCls : 'b-draggable-started',

            /**
             * The CSS class that is added to the {@link #config-dragRootElement}, i.e., `'b-draggable'`.
             * @property {String}
             * @readonly
             */
            draggableCls : 'b-draggable'
        };
    }

    //endregion

    //region Drag Processing
    // These template methods are implemented by derived classes as desired. There is only one overlap with Droppable's
    // template methods (dragDrop) so that a class can easily mixin both Draggable and Droppable and always distinguish
    // whether it is acting as the source, the target, or both.

    /**
     * This template method is called when the mousedown of a potential drag operation occurs. This happens before the
     * gesture is known to be a drag, meaning the {@link #config-dragThreshold} has not been reached. This method
     * should initialize the {@link Core.util.drag.DragContext} using the {@link Core.util.drag.DragContext#function-set}
     * method. Alternatively, this method may return `false` to prevent the drag operation.
     *
     * *Important:* Because no drag has occurred at the time this method is called, only minimal processing should be
     * done (such as initializing the {@link Core.util.drag.DragContext}). Anything more should be done in the
     * {@link #function-dragStart} method or in response to the {@link #event-dragStart} event which happen only if
     * the user drags the mouse before releasing the mouse button.
     * @param {Core.util.drag.DragContext} drag
     */
    beforeDrag(drag) {
        const
            { dragRootElement, dragSelector } = this,
            target = dragSelector && drag.element.closest(dragSelector);

        return !dragSelector || Boolean(target && target === dragRootElement || dragRootElement.contains(target));
    }

    /**
     * This template method is called when the drag operation starts. This occurs when the {@link #config-dragThreshold}
     * has been reached.
     * Your implementation may return `false` to prevent the startup of the drag operation.
     * @param {Core.util.drag.DragContext} drag
     */
    dragStart(drag) {
        // template
    }

    /**
     * This template method is called as the drag moves. This occurs on each mouse/pointer/touchmove event.
     * @param {Core.util.drag.DragContext} drag
     */
    dragOver(drag) {
        // template
    }

    /**
     * This template method is called when the drag enters a {@link Core.mixin.Droppable target}.
     * @param {Core.util.drag.DragContext} drag
     */
    dragEnterTarget(drag) {
        // template
    }

    /**
     * This template method is called when the drag leaves a {@link Core.mixin.Droppable target}.
     * @param {Core.util.drag.DragContext} drag
     * @param {Core.mixin.Droppable} oldTarget The previous value of `drag.target`.
     */
    dragLeaveTarget(drag, oldTarget) {
        // template
    }

    /**
     * This template method is called when the drag operation completes. This occurs on the pointerup event.
     *
     * This method is not called if the drag is {@link Core.util.drag.DragContext#property-aborted aborted}.
     * @param {Core.util.drag.DragContext} drag
     */
    dragDrop(drag) {
        // template
    }

    /**
     * This template method is called when the drag operation completes. This occurs on the pointerup event or perhaps
     * a keypress event.
     *
     * This method is always called, even if the drag is {@link Core.util.drag.DragContext#property-aborted aborted}.
     * @param {Core.util.drag.DragContext} drag
     */
    dragEnd(drag) {
        // template
    }

    //endregion

    //region Drag Management
    // These methods are called by the DragContext and generally manage element updates (adding/removing classes) or
    // event firing. In most cases these methods then call a corresponding Drag Processing template method intended
    // for derived classes to implement.

    get activeDrag() {
        const { dragging : drag } = this;

        return (drag?.started && !drag.completed) ? drag : null;
    }

    /**
     * Return the `Events` instance from which drag events are fired.
     * @internal
     * @property {Core.mixin.Events}
     */
    get dragEventer() {
        return this.trigger ? this : null;  // simple Events feature detector
    }

    get draggingClassElement() {
        const { draggingClsSelector, dragRootElement } = this;

        return draggingClsSelector ? dragRootElement?.closest(draggingClsSelector) : dragRootElement;
    }

    beginDrag(drag) {
        const { draggingCls, draggingClassElement } = this;

        if (draggingCls && draggingClassElement) {
            draggingClassElement.classList.add(draggingCls);
            drag.cleaners.push(() => draggingClassElement.classList.remove(draggingCls));
        }
    }

    async endDrag(drag) {
        const
            me = this,
            { dragEventer, dragProxy } = me;

        if (drag.valid) {
            // The implementation may be async. If so, any Promise must always be
            // propagated back to a point which may have to await it
            await me.dragDrop(drag);
        }

        if (me.isDestroyed) {
            return;
        }

        if (drag.pending) {
            drag.destroy();
        }
        else {
            me.dragEnd(drag);
            dragProxy?.dragEnd(drag);

            /**
             * This event is fired when a drag gesture is completed due to the user aborting it (with the `ESC` key) or
             * if the {@link Core.util.drag.DragContext#function-abort} method was called.
             * @event dragCancel
             * @param {Core.mixin.Draggable} source The draggable instance that fired the event.
             * @param {Core.util.drag.DragContext} drag The drag context.
             * @param {Event} event The browser event.
             */
            /**
             * This event is fired when a drag gesture is completed successfully.
             *
             * This event is **not** fired if the drag was aborted by the user pressing the `ESC` key or if the
             * {@link Core.util.drag.DragContext#function-abort} method was called.
             * @event drop
             * @param {Core.mixin.Draggable} source The draggable instance that fired the event.
             * @param {Core.util.drag.DragContext} drag The drag context.
             * @param {Event} event The browser event.
             */
            dragEventer?.trigger(drag.valid ? 'drop' : 'dragCancel', { drag, event : drag.event });

            // The drag context could have registered finalizers added by the above methods or event. If so, we need to
            // wait for finalization of the drag before we clear our "dragging" config.
            me.finalizeDrag(drag);
        }
    }

    async finalizeDrag(drag) {
        await drag.finalize();

        // The doFinalize() method of DragContext is called by the above await... which nulls our "dragging" config
    }

    moveDrag(drag) {
        if (this.dragOver(drag) !== false) {
            const { dragEventer, dragProxy } = this;

            dragProxy?.dragMove(drag);

            /**
             * This event is fired as a drag gesture progresses due to cursor movement.
             * @event drag
             * @param {Core.mixin.Draggable} source The draggable instance that fired the event.
             * @param {Core.util.drag.DragContext} drag The drag context.
             * @param {Event} event The browser event.
             */
            dragEventer?.trigger('drag', { drag, event : drag.event });
        }
    }

    setupDragContext(event) {
        const
            me = this,
            { dragItemSelector, id } = me,
            { target } = event;

        return {
            event,
            id              : id ? `${id}-drag-${me._nextDragId = (me._nextDragId || 0) + 1}` : null,
            itemElement     : dragItemSelector ? target.closest(dragItemSelector) : target,
            touchStartDelay : me.dragTouchStartDelay,
            source          : me,
            threshold       : me.dragThreshold
        };
    }

    startDrag(drag) {
        const
            { draggingStartedCls, draggingClassElement, draggingItemCls, dragEventer, dragProxy } = this,
            { itemElement } = drag;

        /**
         * This event is fired prior to starting a drag gesture. This does not occur immediately after the user
         * performs the pointer/mousedown/touchstart but only after the {@link #config-dragThreshold} amount of
         * movement has taken place.
         *
         * The drag is canceled if a listener returns `false`.
         * @event beforeDragStart
         * @param {Core.mixin.Draggable} source The draggable instance that fired the event.
         * @param {Core.util.drag.DragContext} drag The drag context.
         * @param {Event} event The browser event.
         * @preventable
         */
        if (dragEventer?.trigger('beforeDragStart', { drag, event : drag.event }) === false) {
            return false;
        }

        if (draggingStartedCls && draggingClassElement) {
            draggingClassElement.classList.add(draggingStartedCls);
            drag.cleaners.push(() => draggingClassElement.classList.remove(draggingStartedCls));
        }

        if (draggingItemCls && itemElement) {
            itemElement.classList.add(draggingItemCls);
            drag.cleaners.push(() => itemElement.classList.remove(draggingItemCls));
        }

        dragProxy?.dragStart(drag);

        const result = this.dragStart(drag);

        if (result !== false) {
            /**
             * This event is fired when a drag gesture has started. This does not occur immediately after the user
             * performs the pointer/mousedown/touchstart but only after the {@link #config-dragThreshold} amount of
             * movement has taken place.
             * @event dragStart
             * @param {Core.mixin.Draggable} source The draggable instance that fired the event.
             * @param {Core.util.drag.DragContext} drag The drag context.
             * @param {Event} event The browser event.
             */
            dragEventer?.trigger('dragStart', { drag, event : drag.event });
        }

        return result;
    }

    trackDrag(drag) {
        const { dropTargetSelector } = this;

        drag.valid = !(dropTargetSelector && !drag.targetElement?.closest(dropTargetSelector));

        this.moveDrag(drag);
    }

    //endregion

    //region Configs

    configureListeners(drag) {
        const
            me = this,
            listeners = ObjectHelper.assign({
                thisObj : me
            }, me.dragDocumentListeners);

        // Only listen for the events related to how the drag was initiated:
        if ('touches' in drag.startEvent) {
            delete listeners.mousemove;
            delete listeners.mouseup;
        }
        else {
            delete listeners.contextmenu;
            delete listeners.touchmove;
            delete listeners.touchend;
            delete listeners.pointerup;
        }

        return listeners;
    }

    //endregion

    //region Configs

    updateDragging(drag) {
        const me = this;

        if (drag) {
            const listeners = me.configureListeners(drag);

            drag.cleaners.push(EventHelper.on(listeners));

            me.beginDrag(drag);
        }
    }

    changeDragProxy(config, existing) {
        return DragProxy.reconfigure(existing, config, {
            owner : this,

            defaults : {
                owner : this
            }
        });
    }

    updateDragRootElement(rootEl, was) {
        const
            me = this,
            {
                draggableCls,
                dragItemSelector,
                onDragItemMouseMove
            }  = me;

        was?.classList.remove(draggableCls);
        me._dragRootDetacher?.();

        if (rootEl) {
            const listeners = {
                thisObj    : me,
                element    : rootEl,
                mousedown  : 'onDragMouseDown',
                // We have touchstart listener in place since Siesta/Chrome can send these events even on non-touch
                // devices:
                touchstart : 'onDragTouchStart'
            };

            if (onDragItemMouseMove) {
                listeners.mousemove = {
                    delegate : dragItemSelector,
                    handler  : 'onDragItemMouseMove'
                };
            }

            if (me.dragItemOverCls || onDragItemMouseMove || me.onDragItemMouseEnter || me.onDragItemMouseLeave) {
                Object.assign(listeners, {
                    mouseover : {
                        delegate : dragItemSelector,
                        handler  : 'onDragItemMouseOver'
                    },
                    mouseout : {
                        delegate : dragItemSelector,
                        handler  : 'onDragItemMouseOut'
                    }
                });
            }

            rootEl.classList.add(draggableCls);
            me._dragRootDetacher = EventHelper.on(listeners);
        }
    }

    //endregion

    //region Events

    onDragItemMouseOver(event) {
        this.overItem = event;
    }

    onDragItemMouseOut(event) {
        if (!this.dragging) {
            this.overItem = event;
        }
    }

    changeOverItem(event) {
        this.enterLeaveEvent = event;

        if (event.type === 'mouseout') {
            // Must return null, not undefined to unset the overItem property
            return event.relatedTarget?.closest(this.dragItemSelector) || null;
        }
        else {
            return event.target.closest(this.dragItemSelector);
        }
    }

    updateOverItem(overItem, oldOverItem) {
        const
            me                  = this,
            { dragItemOverCls } = me;

        if (oldOverItem) {
            dragItemOverCls && oldOverItem.classList.remove(dragItemOverCls);
            me.onDragItemMouseLeave?.(me.enterLeaveEvent, oldOverItem);
        }

        if (overItem) {
            dragItemOverCls && overItem.classList.add(dragItemOverCls);
            me.onDragItemMouseEnter?.(me.enterLeaveEvent, overItem);
        }
    }

    onDragContextMenu(event) {
        event.preventDefault();
    }

    onDragKeyDown(event) {
        this.dragging.keyDown(event);
    }

    onDragKeyUp(event) {
        this.dragging.keyUp(event);
    }

    /**
     * Grab draggable element on mouse down.
     * @param {Event} event
     * @private
     */
    onDragMouseDown(event) {
        // only dragging with left mouse button
        if (event.button === 0) {
            this.onDragPointerDown(event);
        }
    }

    /**
     * Grab draggable element on pointerdown.
     * @param {Event} event
     * @private
     */
    onDragPointerDown(event) {
        let { dragging : drag } = this;

        // If a drag is ongoing already, finalize it and don't proceed with new drag (happens if user does pointerup
        // outside browser window). Also handles the edge case of trying to start a new drag while previous is awaiting
        // finalization, in which case it just bails out.
        if (!drag) {
            drag = this.setupDragContext(event);

            // The DragContext consults our beforeDrag handler, and if that succeeds, the Context injects itself into
            // this instance as our draggable ("this.dragging").
            // NOTE: This is not yet an actual drag. At this stage, the context is used to detect movement prior to
            // mouseup (aka "a drag"). Should the requisite amount of movement occur, the drag will be started.
            if (drag) {
                drag = new DragContext(drag);

                if (drag.begin() === false) {
                    drag.destroy();
                }
            }
        }
        else if (!drag.isFinalizing) {
            drag.abort();
        }
    }

    onDragPointerMove(event) {
        const { dragging : drag } = this;

        if (drag && !drag.completed) {
            drag?.move(event);
        }
    }

    onDragPointerUp(event) {
        const { dragging : drag } = this;

        if (drag && !drag.completed) {
            drag.end(event);

            this.endDrag(drag);
        }
    }

    /**
     * @param {Event} event
     * @private
     */
    onDragTouchStart(event) {
        // only allowing one finger for now...
        if (event.touches.length === 1) {
            this.onDragPointerDown(event);
        }
    }

    //endregion
};
