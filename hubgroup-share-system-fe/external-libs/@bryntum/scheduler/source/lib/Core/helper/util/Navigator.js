import Base from '../../Base.js';
import DomHelper from '../DomHelper.js';
import EventHelper from '../EventHelper.js';
import Events from '../../mixin/Events.js';
import Widget from '../../widget/Widget.js';

/**
 * @module Core/helper/util/Navigator
 */

/**
 * A helper class which allows keyboard navigation within the {@link #config-target} element.
 * @private
 */
export default class Navigator extends Events(Base) {
    static get configurable() {
        return {
            /**
             * The owning Widget which is using this Navigator.
             * @config {Core.widget.Widget}
             */
            ownerCmp : null,

            /**
             * The encapsulating element in which navigation takes place.
             * @config {HTMLElement}
             */
            target : null,

            /**
             * The element which provides key events for navigation. Optional. Defaults to the {@link #config-target} element.
             * @config {HTMLElement}
             */
            keyEventTarget : null,

            /**
             * An optional key event processor which may preprocess the key event. Returning `null` prevents processing of the event.
             * @config {Function}
             */
            processEvent : null,

            /**
             * A query selector which identifies descendant elements within the {@link #config-target} which are navigable.
             * @config {String}
             */
            itemSelector : null,

            /**
             * The currently focused element within the {@link #config-target}.
             * @config {HTMLElement}
             */
            activeItem : null,

            /**
             * A CSS class name to add to focused elements.
             * @config {String}
             * @default
             */
            focusCls : 'b-active',

            /**
             * An object containing key definitions keys by the key name eg:
             *
             * ```javascript
             *  keys : {
             *      "CTRL+SPACE" : 'onCtrlSpace',
             *      ENTER        : 'onEnterKey'
             *  }```
             *
             * The {@link #config-ownerCmp} is used as the `this` reference and to resolve string method names.
             *
             * Modified key names must be created prepending one or more `'CTRL+'`, `'SHIFT+'`, `'ALT+'`
             * in that order, for example `"CTRL+SHIFT+ENTER" : 'showMenu'`
             * @config {Object}
             * @default
             */
            keys : null,

            /**
             * Configure as `true` to also navigate when the `CTRL` modifier key is used along with
             * navigation keys.
             * @config {Boolean}
             * @default false
             */
            allowCtrlKey : null,

            /**
             * Configure as `true` to also navigate when the `SHIFT` modifier key is used along with
             * navigation keys.
             * @config {Boolean}
             * @default false
             */
            allowShiftKey : null,

            scrollDuration : 50,

            /**
             * Configure as, or set to `true` to disable the processing of keys.
             * @config {Boolean}
             */
            disabled : null,

            testConfig : {
                scrollDuration : 1
            }
        };
    }

    updateOwnerCmp(ownerCmp) {
        if (!this.itemSelector) {
            this.itemSelector = `.${this.ownerCmp.itemCls}`;
        }
    }

    onKeyDown(keyEvent) {
        const
            me              = this,
            {
                ownerCmp,
                itemSelector,
                activeItem,
                itemsTabbable
            } = me,
            { target }      = keyEvent,
            firstItem       = me.target.querySelector(itemSelector),
            // Not all key events have 'key'
            keyName         = (keyEvent.key || '').trim() || keyEvent.code,
            composedKeyName = `${keyEvent.ctrlKey ? 'CTRL+' : ''}${keyEvent.shiftKey ? 'SHIFT+' : ''}${keyEvent.altKey ? 'ALT+' : ''}${keyName}`,
            validTarget     = target.matches(itemSelector) || target === me.keyEventTarget;

        // Process the key gesture if there are items and we are visible.
        // Also, if key emanated from a valid target element (Not an owned positioned Widget).
        if (!me.disabled && firstItem && me.target.offsetParent && validTarget) {

            // Only set navigation key names if we are *not* using tabbing.
            if (!itemsTabbable) {
                // Detect whether the navigable items flow inline or downwards.
                if (me.inlineFlow == null) {
                    const
                        itemContainer     = firstItem.parentNode,
                        itemPositionStyle = DomHelper.getStyleValue(firstItem, 'position'),
                        itemDisplayStyle  = DomHelper.getStyleValue(firstItem, 'display'),
                        itemFloatStyle    = DomHelper.getStyleValue(firstItem, 'float');

                    // This is how we know that RIGHT and LEFT arrow should be used for next and previous.
                    // If inlineFlow is false, we use UP and DOWN. Consider tabs in a tab bar.
                    me.inlineFlow = (
                        itemPositionStyle === 'absolute' ||
                        itemDisplayStyle === 'inline' || itemDisplayStyle === 'inline-block' ||
                        itemFloatStyle === 'left' || itemFloatStyle === 'right' ||
                        (DomHelper.getStyleValue(itemContainer, 'display') === 'flex' && DomHelper.getStyleValue(itemContainer, 'flex-direction') === 'row')
                    );
                }

                if (!me.prevKey) {
                    if (me.inlineFlow) {
                        me.prevKey = 'ArrowLeft';
                        me.nextKey = 'ArrowRight';
                    }
                    else {
                        me.prevKey = 'ArrowUp';
                        me.nextKey = 'ArrowDown';
                    }
                }
            }

            // Feed the key event through our configured processor, process the event that returns if any.
            if (me.processEvent) {
                keyEvent = me.processEvent.call(ownerCmp, keyEvent);
                if (!keyEvent) {
                    return;
                }
            }

            if (activeItem) {
                switch (keyName) {
                    case me.prevKey:
                        if (me.disabled || keyEvent.ctrlKey && !me.allowCtrlKey) {
                            return;
                        }
                        if (keyEvent.shiftKey && !me.allowShiftKey) {
                            return;
                        }
                        keyEvent.preventDefault();
                        me.navigatePrevious(keyEvent);
                        break;
                    case me.nextKey:
                        if (me.disabled || keyEvent.ctrlKey && !me.allowCtrlKey) {
                            return;
                        }
                        if (keyEvent.shiftKey && !me.allowShiftKey) {
                            return;
                        }
                        keyEvent.preventDefault();
                        me.navigateNext(keyEvent);
                        break;
                    default: {
                        const keyHandler = me.keys && me.keys[composedKeyName];

                        if (keyHandler && !me.disabled) {
                            me.callback(keyHandler, me.thisObj || ownerCmp, [keyEvent]);
                        }

                        // Note that even if this.disabled, the ownerCmp will expect
                        // to have its key down handler invoked.
                        else if (ownerCmp.onInternalKeyDown) {
                            ownerCmp.onInternalKeyDown(keyEvent);
                        }

                        // One of the handlers moved focus.
                        // This KeyDown should not act upon the new target.
                        // For example popped up a Popup and focused its "close" Tool.
                        if (DomHelper.getActiveElement(target) !== target) {
                            keyEvent.preventDefault();
                        }

                        // No navigation must take place when items are tabbable.
                        if (itemsTabbable) {
                            return;
                        }
                    }
                }
            }
            else {
                if (itemsTabbable) {
                    return;
                }
                me.activeItem = me.previousActiveItem || me.getDefaultNavigationItem(keyEvent);
            }

            if (me.activeItem !== activeItem) {
                /**
                 * Fired when a user gesture causes the active item to change _or become `null`_.
                 * @event navigate
                 * @param {Event} event The browser event which instigated navigation. May be a click or key or focus move event.
                 * @param {HTMLElement} item The newly active item, or `null` if focus moved out.
                 * @param {HTMLElement} oldItem The previously active item, or `null` if focus is moving in.
                 */
                me.triggerNavigate(keyEvent);
            }
        }
    }

    getDefaultNavigationItem(keyEvent) {
        const { target, itemSelector, prevKey,  nextKey } = this;

        // Navigating backwards from after the component, we default to last item
        if (target.compareDocumentPosition(keyEvent.target) & 4 && keyEvent.key === prevKey) {
            return target.querySelector(`${itemSelector}:last-of-type`);
        }
        // Navigating forwards from before the component we default to the first item
        if (target.compareDocumentPosition(keyEvent.target) & 2 && keyEvent.key === nextKey) {
            return target.querySelector(`${itemSelector}`);
        }
    }

    navigatePrevious(keyEvent) {
        const me = this,
            previous = me.previous;

        keyEvent.preventDefault();
        if (previous) {
            me.ownerCmp.scrollable.scrollIntoView(previous, { animate : me.scrollDuration }).then(() => {
                me.activeItem = previous;
                me.triggerNavigate(keyEvent);
            });
        }
    }

    navigateNext(keyEvent) {
        const me = this,
            next = me.next;

        keyEvent.preventDefault();
        if (next) {
            me.ownerCmp.scrollable.scrollIntoView(next, { animate : me.scrollDuration }).then(() => {
                me.activeItem = next;
                me.triggerNavigate(keyEvent);
            });
        }
    }

    get owner() {
        return this.ownerCmp;
    }

    get previous() {
        return this.getAdjacent(-1);
    }

    get next() {
        return this.getAdjacent(1);
    }

    /**
     * Returns the next or previous navigable element starting from the passed `from` element,
     * navigating in the passed direction.
     * @param {HTMLElement} [from] The start point. Defaults to the current {@link #config-activeItem}
     * @param {Number} [direction=1] The direction. -1 for backwards, else forwards.
     */
    getAdjacent(direction = 1, from = this.activeItem) {
        const treeWalker = this.treeWalker;

        treeWalker.currentNode = from;
        treeWalker[direction < 0 ? 'previousNode' : 'nextNode']();
        if (treeWalker.currentNode !== this.activeItem) {
            return treeWalker.currentNode;
        }
    }

    onTargetFocusIn(focusInEvent) {
        const
            me         = this,
            { target } = focusInEvent,
            {
                itemsTabbable,
                skipScrollIntoView
            } = me;

        // Ignore navigating to a focus trap. It will bounce back in
        if (!target.matches('.b-focus-trap')) {
            if (target.matches(me.itemSelector)) {
                // We may need to know this in downstream code.
                // for example set activeItem must not scrollIntoView on click
                me.skipScrollIntoView = true;

                me.activeItem = target;

                me.skipScrollIntoView = skipScrollIntoView;

                // If we are using natural, TAB based navigation, trigger the navigate event after it really happens.
                if (me.activeItem && itemsTabbable) {
                    me.triggerNavigate(focusInEvent);
                }
            }
            // Upward focusing from within means a SHIFT+TAB, so go to previous sibling
            // PATCH: IE11 may receive event which related target is not an instance of HTMLElement
            else {
                const toWidget = Widget.fromElement(focusInEvent.target);

                // If we are focusing into an owned widget (such as an Editor), ignore. It will revert focus
                // when it hides.
                if (!toWidget || !me.owner.owns(toWidget)) {
                    if (!itemsTabbable && focusInEvent.relatedTarget?.matches?.(me.itemSelector)) {
                        me.owner.previousSibling?.focus();
                    }
                }
            }
        }
    }

    onTargetFocusOut(focusOutEvent) {
        const
            me                = this,
            { relatedTarget } = focusOutEvent;

        // Ignore navigating to a focus trap. It will bounce back in
        if (!relatedTarget?.matches('.b-focus-trap')) {
            if (!relatedTarget || !me.target.contains(relatedTarget) || !relatedTarget.matches(me.itemSelector)) {
                if (me.activeItem) {
                    me.activeItem = null;

                    // If we are using natural, TAB based navigation, trigger the navigate event after it really happens.
                    if (me.itemsTabbable) {
                        me.triggerNavigate(focusOutEvent);
                    }
                }
            }
        }
    }

    onTargetMouseDown(mouseDownEvent) {
        const
            me     = this,
            target = mouseDownEvent.target.closest(me.itemSelector);

        me.mouseDownEvent = mouseDownEvent;

        // Mousedown is the focus gesture.
        // This holds true even on touch platforms
        // where the mousedown event is synthesized -
        // preventing default prevents focus on the upcoming touchend.
        if (me.ownerCmp.itemsFocusable === false) {
            me.onFocusGesture(mouseDownEvent);
        }
        else if (target) {
            mouseDownEvent.preventDefault();
            DomHelper.focusWithoutScrolling(target);
        }
    }

    onTargetClick(clickEvent) {
        const
            me                     = this,
            { skipScrollIntoView } = me;

        if (me.skipNextClick || me.mouseDownEvent?.ignoreNavigation) {
            me.skipNextClick = false;
            return;
        }

        if (me.disabled) {
            return;
        }

        // We may need to know this in downstream code.
        // for example set activeItem must not scrollIntoView on click
        me.skipScrollIntoView = true;

        // ownerCmp's preprocessing of any navigate event.
        if (me.processEvent) {
            clickEvent = me.processEvent.call(me.ownerCmp, clickEvent);
        }

        if (clickEvent) {
            me.activeItem = clickEvent.target.closest(me.itemSelector);
            me.triggerNavigate(clickEvent);
        }
        me.skipScrollIntoView = skipScrollIntoView;
    }

    // We have to prevent focus moving from eg, an input field when we mousedown
    // or touchtap a non focusable item when ownerCmp has itemsFocusable: false.
    // If the event was not on an item, we must allow it through to allow Lists
    // to contain other widgets.
    onFocusGesture(event) {
        if (event.target === this.ownerCmp.contentElement || (event.target.closest(this.itemSelector) && this.ownerCmp.itemsFocusable === false)) {
            event.preventDefault();
        }
    }

    acceptNode(node) {
        return node.offsetParent && node.matches && node.matches(this.itemSelector) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }

    changeActiveItem(activeItem) {
        if (activeItem != null) {
            // List and Menu's getItem API allows number, or node or record or record id to be passed
            if (this.ownerCmp.getItem) {
                activeItem = this.ownerCmp.getItem(activeItem);
            }
        }
        return activeItem;
    }

    updateActiveItem(activeItem, oldActiveItem) {
        const
            me           = this,
            { ownerCmp } = me,
            isActive     = oldActiveItem && me.target.contains(oldActiveItem);

        if (isActive) {
            me.previousActiveItem = oldActiveItem;
        }

        // This may be set to null on focusout of the target element.
        // Cannot use truthiness test because index zero may be passed.
        if (activeItem != null) {
            // If the user was able to click the event, they will not expect it to attempt to scroll.
            if (!me.skipScrollIntoView) {
                ownerCmp.scrollable.scrollIntoView(activeItem, {
                    block  : 'nearest',
                    // If we are being called in response to focus movement, it will already be the document.activeElement
                    // so in that case, behave is if we were in non-focusing mode, and just add the focused class.
                    focus  : DomHelper.isFocusable(activeItem) && activeItem !== DomHelper.getActiveElement(activeItem),
                    silent : me.scrollSilently
                });
            }

            // No change in active item, do nothing after we've ensured it's fully in view.
            if (activeItem === oldActiveItem && isActive) {
                return;
            }

            if (oldActiveItem) {
                oldActiveItem.classList.remove(me.focusCls);
            }

            activeItem.classList.add(me.focusCls);
            me._activeItem = activeItem;
        }
        else {
            if (oldActiveItem) {
                oldActiveItem.classList.remove(me.focusCls);

                // If we are clearing the activeItem, and it's focused, keep focus
                // close by actively reverting it.
                if (oldActiveItem === DomHelper.getActiveElement(oldActiveItem)) {
                    ownerCmp.revertFocus();
                }
            }
            me._activeItem = null;
        }
    }

    updateTarget(target, oldTarget) {
        const me = this,
            listeners = {
                element  : target,
                thisObj  : me,
                focusin  : 'onTargetFocusIn',
                focusout : 'onTargetFocusOut'
            };

        if (!me.itemsTabbable) {
            // We don't need pointer events if items are tabbable
            listeners.mousedown = 'onTargetMouseDown';
            listeners.click = 'onTargetClick';
        }

        if (!Object.prototype.hasOwnProperty.call(me, 'acceptNode')) {
            me.acceptNode = me.acceptNode.bind(me);
            // https://github.com/webcomponents/webcomponentsjs/issues/556
            // Work around Internet Explorer wanting a function instead of an object.
            // IE also *requires* this argument where other browsers don't.
            me.acceptNode.acceptNode = me.acceptNode;
        }

        EventHelper.on(listeners);

        // This Navigator object acts as the filter for the TreeWalker. We must implement acceptNode(node)
        me.treeWalker = me.setupTreeWalker(target, NodeFilter.SHOW_ELEMENT, me.acceptNode, false);

        // If we were not configured with an outside key event provider (think the input field providing UP/DOWN keys for the dropdown)
        // then use the target element as the source.
        if (!me.keyEventTarget) {
            me.keyEventTarget = target;
        }

        //<debug>
        if (!me.itemSelector) {
            throw new Error('Element Navigator must be configured with an itemSelector');
        }
        if (!me.ownerCmp) {
            throw new Error('Element Navigator must be configured with an ownerCmp');
        }
        //</debug>

        // If the activeItem gets removed, we must know, and deactivate.
        (me.targetMutationMonitor = new MutationObserver(me.onTargetChildListChange.bind(me))).observe(target, {
            childList : true,
            subtree   : true
        });
    }

    setupTreeWalker(root, whatToShow, filter, entityReferenceExpansion) {
        // This Navigator object acts as the filter for the TreeWalker. We must implement acceptNode(node)
        return document.createTreeWalker(root, whatToShow, filter, entityReferenceExpansion);
    }

    onTargetChildListChange() {
        const activeItem = this.activeItem;

        // On DOM mutation, if the activeItem got changed, pull the one with the same ID out again.
        if (activeItem) {
            if (this.target.contains(activeItem)) {
                activeItem.classList.add(this.focusCls);
            }
            else {
                // Passing undefined results in the config setter assuming no-change
                // So we must use null to clear.
                this.activeItem = this.target.querySelector(`${this.itemSelector}[data-id="${activeItem.dataset.id}"]`) || null;
            }
        }
    }

    changeKeyEventTarget(keyEventTarget) {
        this._keyEventTarget = keyEventTarget;

        EventHelper.on({
            element : keyEventTarget,
            keydown : 'onKeyDown',
            thisObj : this
        });
    }

    triggerNavigate(event, item = this.activeItem) {
        const navEvent = {
            event,
            item,
            oldItem : this.previousActiveItem
        };

        this.trigger('navigate', navEvent);
        this.ownerCmp?.trigger('navigate', navEvent);
    }
}
