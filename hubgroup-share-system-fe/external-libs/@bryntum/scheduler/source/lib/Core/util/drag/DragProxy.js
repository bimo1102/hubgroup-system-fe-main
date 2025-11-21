import Base from '../../Base.js';
import Factoryable from '../../mixin/Factoryable.js';

/**
 * @module Core/util/drag/DragProxy
 */

/**
 * Drag proxies are helper classes that represent the object being dragged in some visual way. This is an abstract
 * base with which particular drag proxy classes (such as, {@link Core.util.drag.DragTipProxy} are registered.
 *
 * Derived classes the various template methods of this class to manage their particular form of visual feedback.
 * @extends Core/Base
 * @internal
 */
export default class DragProxy extends Base.mixin(Factoryable) {
    static get type() {
        return 'default';
    }

    static get configurable() {
        return {
            /**
             * The currently active `DragContext`. This context will be active prior to be passed to the proxy. This
             * config is set by {@link #function-dragStart} and cleared by {@link #function-dragEnd}.
             * @config {Core.util.drag.DragContext}
             */
            dragging : null
        };
    }

    static get factoryable() {
        return {
            defaultType : DragProxy
        };
    }

    /**
     * The `Draggable` instance that owns this drag proxy.
     * @member {Core.mixin.Draggable} owner
     * @readonly
     */

    //region Configs

    updateDragging(drag, was) {
        if (was) {
            this.close(was);
        }

        if (drag) {
            this.open(drag);
        }
    }

    //endregion

    //region Operations

    /**
     * This template method is called when {@link #config-dragging} is reset to `null`.
     * @param {Core.util.drag.DragContext} drag The drag instance.
     */
    close(drag) {
        // template
    }

    /**
     * This template method is called when {@link #config-dragging} is set to a non-`null` value.
     * @param {Core.util.drag.DragContext} drag The drag instance.
     */
    open(drag) {
        // template
    }

    //endregion

    //region Drag Processing

    /**
     * This template method is called by the `Draggable` instance when the drag officially starts.

     * This sets the {@link #config-dragging} config to `drag`, which triggers the call to {@link #function-open}.
     * @param {Core.util.drag.DragContext} drag The drag instance.
     */
    dragStart(drag) {
        this.dragging = drag;
    }

    /**
     * This template method is called by the `Draggable` instance as drag movement occurs.
     * @param {Core.util.drag.DragContext} drag The drag instance.
     */
    dragMove(drag) {
        // template
    }

    /**
     * This template method is called by the `Draggable` instance when the drag completes.
     *
     * This sets the {@link #config-dragging} config to `null`, which triggers the call to {@link #function-close}.
     * @param {Core.util.drag.DragContext} drag The drag instance.
     */
    dragEnd(drag) {
        this.dragging = null;
    }

    //endregion
}

DragProxy.initClass();
