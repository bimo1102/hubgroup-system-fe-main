import Panel from './Panel.js';
import BrowserHelper from '../helper/BrowserHelper.js';
import EventHelper from '../helper/EventHelper.js';
import GlobalEvents from '../GlobalEvents.js';
import DomHelper from '../helper/DomHelper.js';

/**
 * @module Core/widget/Popup
 */

/**
 * A floating Popup widget, which can contain child {@link Core.widget.Container#config-items widgets} or plain html. Serves as the base class
 * for Menu / Tooltip.
 *
 * @example
 * let popup = new Popup({
 *   forElement : document.querySelector('button'),
 *   items      : [
 *     { type : 'text', placeholder: 'Text' },
 *     { type: 'button', text: 'Okay', style: 'width: 100%', color: 'b-orange'}
 *   ]
 * });
 *
 * @classType popup
 * @inlineexample Core/widget/Popup.js
 *
 * @extends Core/widget/Panel
 */
export default class Popup extends Panel {
    //region Config
    static get $name() {
        return 'Popup';
    }

    // Factoryable type name
    static get type() {
        return 'popup';
    }

    static get configurable() {
        return {

            /**
             * Auto show flag for Popup.
             * If truthy then Popup is shown automatically upon hover.
             * @config {Boolean}
             * @default
             */
            autoShow : true,

            /**
             * By default a Popup is transient, and will {@link #function-close} when the user clicks or
             * taps outside its owned widgets and when focus moves outside its owned widgets.
             *
             * **Note**: {@link #config-modal Modal} popups won't {@link #function-close} when focus moves outside even if autoClose is `true`.
             *
             * Configure as `false` to make a Popup non-transient.
             * @config {Boolean}
             * @default
             */
            autoClose : true,

            /**
             * Show popup when user clicks the element that it is anchored to. Cannot be combined with showOnHover
             * @config {Boolean}
             * @default
             */
            showOnClick : false,

            /**
             * DOM element to attach popup.
             * @config {HTMLElement}
             */
            forElement : null,

            monitorResize : true,

            floating : true,
            hidden   : true,

            axisLock : true, // Flip edges if align violates constrainTo

            hideAnimation : BrowserHelper.isIE11 ? null : {
                opacity : {
                    from     : 1,
                    to       : 0,
                    duration : '.3s',
                    delay    : '0s'
                }
            },

            showAnimation : BrowserHelper.isIE11 ? null : {
                opacity : {
                    from     : 0,
                    to       : 1,
                    duration : '.4s',
                    delay    : '0s'
                }
            },

            stripDefaults : {
                bbar : {
                    layout : {
                        justify : 'flex-end'
                    }
                }
            },

            testConfig : {
                hideAnimation : null,
                showAnimation : null
            },

            /**
             * The action to take when calling the {@link #function-close} method.
             * By default, the popup is hidden.
             *
             * This may be set to `'destroy'` to destroy the popup upon close.
             * @config {String}
             * @default
             */
            closeAction : 'hide',

            /**
             * By default, tabbing within a Popup is circular - that is it does not exit.
             * Configure this as `false` to allow tabbing out of the Popup.
             * @config {Boolean}
             * @default
             */
            trapFocus : true,

            /**
             * By default a Popup is focused when it is shown.
             * Configure this as `false` to prevent automatic focus on show.
             * @config {Boolean}
             * @default
             */
            focusOnToFront : true,

            /**
             * Show a tool in the header to close this Popup, and allow `ESC` close it.
             * The tool is available in the {@link Core.widget.mixin.Toolable#property-tools} object
             * under the name `close`. It uses the CSS class `b-popup-close` to apply a
             * default close icon. This may be customized with your own CSS rules.
             * @default false
             * @config {Boolean}
             */
            closable : null,

            /**
             * Show a tool in the header to maximize this popup
             * @config {Boolean}
             * @default false
             */
            maximizable : null,

            /**
             * Optionally show an opaque mask below this Popup when shown.
             * Configure this as `true` to show the mask.
             *
             * When a Popup is modal, it defaults to being {@link Core.widget.Widget#config-centered centered}.
             * Also it won't {@link #function-close} when focus moves outside even if {@link #config-autoClose} is `true`.
             *
             * May also be an object containing the following properties:
             * * `closeOnMaskTap` Specify as `true` to {@link #function-close} when mask is tapped.
             * The default action is to focus the popup.
             *
             * Usage:
             * ```javascript
             * new Popup({
             *     title  : 'I am modal',
             *     modal  : {
             *         closeOnMaskTap : true
             *     },
             *     height : 100,
             *     width  : 200
             * });
             * ```
             *
             * @default false
             * @config {Boolean}
             */
            modal : null,

            /**
             * Set to `true` to make this widget take all available space in the visible viewport.
             * @member {Boolean} maximized
             * @category Float & align
             */
            /**
             * Set to `true` to make this widget take all available space in the visible viewport.
             * @config {Boolean}
             * @default false
             * @category Float & align
             */
            maximized : null,

            tools : {
                close : {
                    cls     : 'b-popup-close',
                    handler : 'close',
                    weight  : -1000,
                    hidden  : true // shown when closable set to true
                },
                maximize : {
                    cls     : 'b-popup-expand',
                    handler : 'toggleMaximized',
                    weight  : -999,
                    hidden  : true // shown when maximizable set to true
                }
            },

            highlightReturnedFocus : true
        };
    }

    //endregion

    //region Init & destroy

    finalizeInit() {
        const me = this;

        me.anchoredTo        = me.forElement;
        me.initialAnchor     = me.anchor;

        if (me.forElement && me.showOnClick) {
            // disable autoShow if not enabled by config
            if (!me.initialConfig.autoShow) {
                me.autoShow = false;
            }
            EventHelper.on({
                element : me.forElement,
                click   : 'onElementUserAction',
                thisObj : me
            });
        }

        super.finalizeInit();

        if (me.autoShow) {
            if (me.autoShow === true) {
                me.show();
            }
            else {
                me.setTimeout(() => me.show(), me.autoShow);
            }
        }
    }

    onPaint({ firstPaint }) {
        super.onPaint?.(...arguments);

        const me = this;

        if (me.maximizable && me.headerElement) {
            EventHelper.on({
                element  : me.headerElement,
                dblclick : me.onHeaderDblClick,
                thisObj  : me
            });
        }
    }

    doDestroy() {
        this.syncModalMask();
        super.doDestroy();
    }

    //endregion

    compose() {
        const { hasNoChildren, textContent } = this;

        return {
            class : {
                // Popup has extra CSS responsibilities at the top level.
                // The CSS needs to know whether it should impose a max-width.
                'b-text-popup' : Boolean(textContent && hasNoChildren)
            }
        };
    }

    //region Show/hide

    /**
     * Performs the configured {@link #config-closeAction} upon this popup.
     * By default, the popup hides. The {@link #config-closeAction} may be
     * configured as `'destroy'`.
     * @fires beforeclose If popup is not hidden
     */
    close() {
        const me = this;

        /**
         * Fired when the {@link #function-close} method is called and the popup is not hidden.
         * May be vetoed by returning `false` from a handler.
         * @event beforeClose
         * @param {Core.widget.Popup} source - This Popup
         */
        if (
            (!me._hidden && me.trigger('beforeClose') !== false) ||
            // we should destroy it even if it's hidden just omit beforeclose event
            (me._hidden && me.closeAction === 'destroy')
        ) {
            // Focus moves unrelated to where the user's attention is upon this gesture.
            // Go into the keyboard mode where the focused widget gets a rendition so that
            // it is obvious where focus now is.
            // Must jump over EventHelper's global mousedown listener which will remove this class.
            if (me.containsFocus && me.highlightReturnedFocus) {
                me.setTimeout(() => me.element.classList.add('b-using-keyboard'), 0);
            }

            return me[me.closeAction]();
        }
    }

    toggleMaximized() {
        this.maximized = !this.maximized;
    }

    updateMaximized(value) {
        DomHelper.toggleClasses(this.element, ['b-maximized'], value);
    }

    //endregion

    //region Events

    onInternalKeyDown(event) {
        // close on escape key
        if (event.key === 'Escape') {
            event.stopImmediatePropagation();
            this.close(true);
        }
    }

    onDocumentMouseDown({ event }) {
        const me = this;

        if (me.modal && event.target === Popup.modalMask) {
            event.preventDefault();
            if (me.modal.closeOnMaskTap) {
                me.close();
            }
            else if (!me.containsFocus) {
                me.focus();
            }
        }
        // in case of outside click and if popup is focused, focusout will trigger closing
        else if (!me.owns(event.target) && me.autoClose && !me.containsFocus) {
            me.close();
        }
    }

    get isTopModal() {
        return DomHelper.isVisible(Popup.modalMask) && this.element.previousElementSibling === Popup.modalMask;
    }

    onFocusIn(e) {
        const activeEl = DomHelper.getActiveElement(this);

        super.onFocusIn(e);

        // No event handler has moved focus, and target is outermost el
        // then delegate to the focusElement which for a Container
        // is found by finding the first visible, focusable descendant widget.
        if (DomHelper.getActiveElement(this) === activeEl && e.target === this.element) {
            this.focus();
        }
    }

    onFocusOut(e) {
        // For mobile browsers with virtual keyboard, when pressing Done key, focus should move back to the popup
        // https://github.com/bryntum/support/issues/2903
        const usingVirtualKeyboard = window.visualViewport && window.visualViewport.height < document.documentElement.clientHeight;

        if (!usingVirtualKeyboard && !this.modal && this.autoClose) {
            this.close();
        }

        super.onFocusOut(e);
    }

    onShow() {
        const me = this;

        if (me.autoClose) {
            me.addDocumentMouseDownListener();
        }

        // TODO: It's the floating "toFront" operation that should handle
        // focusing based on config focusOnToFront.
        if (me.focusOnToFront) {
            me.focus();
        }

        super.onShow && super.onShow();

        // Insert the modal mask below this Popup if needed
        me.syncModalMask();
    }

    addDocumentMouseDownListener() {
        if (!this.mouseDownRemover) {
            this.mouseDownRemover = GlobalEvents.on({
                globaltap : 'onDocumentMouseDown',
                thisObj   : this
            });
        }
    }

    syncModalMask() {
        const
            me        = this,
            { modal } = me;

        // Note the difference between Popup.modalMask and this.modalMask.
        // this.modalMask syncs the position of the element in the DOM
        // to be below this element. Popup.modalMask just returns the element.
        if (modal && me.isVisible) {
            // If we have not been explicitly positioned, a modal is centered.
            if (typeof me._x !== 'number' && typeof me._y !== 'number') {
                me.centered = true;
            }
            me.modalMask.classList.remove('b-hide-display');
            me.element.classList.add('b-modal');
        }
        else if (me.isPainted) {
            me.element.classList.remove('b-modal');

            const
                remainingModals = me.floatRoot.querySelectorAll('.b-modal'),
                topModal        = remainingModals.length ? Popup.fromElement(remainingModals[remainingModals.length - 1], 'popup') : null;

            // If there are any other visible modals, drop the mask to just below the new topmost
            if (topModal) {
                topModal.syncModalMask();
            }
            else {
                Popup.modalMask.classList.add('b-hide-display');
            }
        }
    }

    onHide() {
        const me = this;

        if (me.mouseDownRemover) {
            me.mouseDownRemover();
            me.mouseDownRemover = null;
        }

        super.onHide && super.onHide();

        // Insert the modal mask below the topmost Popup if needed, else hide it
        me.syncModalMask();
    }

    onElementUserAction() {
        this.show();
    }

    onHeaderDblClick() {
        if (this.maximizable) {
            this.toggleMaximized();
        }
    }

    //endregion

    updateClosable(closable) {
        this.tools.close.hidden = !closable;
    }

    updateMaximizable(maximizable) {
        this.tools.maximize.hidden = !maximizable;
    }

    /**
     * Returns the modal mask element for this Popup correctly positioned just below this Popup.
     * @internal
     */
    get modalMask() {
        const { modalMask } = Popup;

        if (modalMask.nextElementSibling !== this.element) {
            this.floatRoot.insertBefore(modalMask, this.element);
        }

        return modalMask;
    }

    /**
     * Returns the modal mask element. It does NOT guarantee its placement in the DOM relative
     * to any Popup. To get the modal mask for a particular Popup, use the instance property.
     * @internal
     */
    static get modalMask() {
        if (!this._modalMask) {
            this._modalMask = DomHelper.createElement({
                className : 'b-modal-mask b-hide-display'
            });
            // Mousewheel should not scroll the body "through" a modal mask.
            EventHelper.on({
                element : this._modalMask,
                wheel   : e => e.preventDefault()
            });
        }
        return this._modalMask;
    }
}

// Register this widget type with its Factory
Popup.initClass();
