import Base from './Base.js';
import Events from './mixin/Events.js';
import DomHelper from './helper/DomHelper.js';

/**
 * @module Core/GlobalEvents
 */

const
    GlobalEvents = new (class extends Base.mixin(Events) {
        suspendFocusEvents() {
            focusEventsSuspended = true;
        }

        resumeFocusEvents() {
            focusEventsSuspended = false;
        }

        setupFocusListenersOnce(rootElement, EventHelper) {
            if (rootElement && !GlobalEvents.observedElements.has(rootElement)) {
                GlobalEvents.setupFocusListeners(rootElement, EventHelper);
                GlobalEvents.observedElements.add(rootElement);
            }
        }

        // This is imported by EventHelper and that makes the call to set up the listeners
        // `detach` argument is required to not setup more listeners than we need to. In case of salesforce we include floatroot
        // inside the webcomponent element and thus don't need default listeners on document. In regular webcomponents demo we
        // don't need to do it, because with multiple components on one page that would force us to make more complex lookups.
        setupFocusListeners(element = document, EventHelper, detach = false) {
            const listeners = {
                element,
                touchstart(touchstart) {
                    if (!globaltouchStart && touchstart.changedTouches.length === 1) {
                        globaltouchStart = touchstart.changedTouches[0];
                    }
                    else {
                        globaltouchStart = null;
                    }
                },
                // Just this one has to be passive: false so that we are allowed to preventDefault
                // if we are part of a contextmenu longpress emulation. Otherwise the gesture will
                // proceed to cause a mousedown event.
                touchend : {
                    handler : event => {
                        if (globaltouchStart) {
                            // If the touchstart was used to synthesize a contextmenu event
                            // stop the touch gesture processing right now.
                            // Also prevent the conversion of the touch into  click.
                            if (globaltouchStart.identifier === EventHelper.contextMenuTouchId) {
                                event.stopImmediatePropagation();
                                event.preventDefault();
                            }
                            else if (event.changedTouches.length === 1 && event.changedTouches[0].identifier === globaltouchStart.identifier) {
                                GlobalEvents.trigger('globaltap', { event });
                            }
                            globaltouchStart = null;
                        }
                    },
                    passive : false
                },
                mousedown : {
                    handler : event => {
                        lastInteractionType = 'mouse';
                        if (!globaltouchStart) {
                            GlobalEvents.trigger('globaltap', { event });
                        }
                    },
                    passive : false
                },
                keydown() {
                    lastInteractionType = 'key';
                },
                keypress() {
                    lastInteractionType = 'key';
                },
                focusin(focusin) {
                    const { Widget } = GlobalEvents;

                    // https://app.assembla.com/spaces/bryntum/tickets/5503
                    // Caused by the browser scrolling a focused element into view. The browser will do *whatever it takes*
                    // to scroll a focused element so that as much of it is in view as possible. Its first point of scrolling will
                    // be the float containing element. That must never scroll.
                    // TODO: Remove when https://www.w3.org/TR/css-overflow-3/#valdef-overflow-clip is supported.
                    Widget.resetFloatRootScroll();

                    if (focusEventsSuspended) {
                        return;
                    }

                    const
                        fromElement     = !focusin.relatedTarget
                            ? null
                            : (focusin.relatedTarget instanceof HTMLElement ? focusin.relatedTarget : document.body),
                        toElement       = focusin.target || document.body,
                        fromWidget      = Widget.fromElement(fromElement),
                        toWidget        = Widget.fromElement(toElement),
                        commonAncestor  = DomHelper.getCommonAncestor(fromWidget, toWidget),
                        // Flag if the fromElement is DOCUMENT_POSITION_FOLLOWING toElement
                        backwards       = !!(fromElement && (toElement.compareDocumentPosition(fromElement) & 4)),
                        topVisibleModal = Widget.query(isTopVisibleModal);

                    let currentFocus = null;

                    if (toElement && toElement !== document.body) {
                        currentFocus = DomHelper.getActiveElement(toElement);
                    }
                    else {
                        currentFocus = DomHelper.getActiveElement(document);
                    }

                    // If there is a topmost modal, and the focus is moving to somewhere *not* a descendant of that
                    // modal then we enforce modality and sweep focus back into the modal. By default the Container
                    // class will yield the first focusable descendant widget's focusEl as its focusEl, so
                    // that will be out of the box behaviour for Popups.
                    if (topVisibleModal && (!toWidget || !topVisibleModal.owns(toWidget))) {
                        topVisibleModal.focus();
                        return;
                    }

                    let event = createWidgetEvent('focusout', fromElement, focusin.target, fromWidget, toWidget, backwards);

                    // Bubble focusout event up the "from" side of the tree
                    for (let target = fromWidget; target && target !== commonAncestor; target = target.owner) {
                        if (!target.isDestroying && target.onFocusOut) {
                            target.onFocusOut(event);

                            // It is possible for focusout handlers to refocus themselves (editor's invalidAction='block'), so
                            // check if the focus is still where it was when we started unless we are in a document
                            // loss of focus situation (no target)
                            if (focusin.target && currentFocus !== DomHelper.getActiveElement(focusin.target)) {
                                // If the focus has moved, that movement would have kicked off a nested sequence of focusin/out
                                // notifications, so everyone has already been notified... no more to do here.
                                return;
                            }
                        }
                    }

                    // Focus is moving upwards to the ancestor widget.
                    // Its focus method might delegate focus to a focusable descendant.
                    if (commonAncestor && focusin.target === commonAncestor.element) {
                        // If one of the handlers above has not moved focus onwards
                        // and the common ancestor is a container which delegates
                        // focus inwards to a descendant, then give it the opportunity to do that.
                        if (!commonAncestor.isDestroying && DomHelper.getActiveElement(commonAncestor) === toElement && commonAncestor.focusElement && commonAncestor.focusElement !== commonAncestor.element) {
                            // Wait until out of the focusin handler to move focus on.
                            commonAncestor.setTimeout(() => commonAncestor.focus?.(), 0);
                        }
                    }
                    // Focus is moving between two branches of a subtree.
                    // Bubble focusin event up the "to" side of the tree
                    else {
                        event = createWidgetEvent('focusin', toElement, fromElement, fromWidget, toWidget, backwards);
                        for (let target = toWidget; target && target !== commonAncestor; target = target.owner) {
                            if (!target.isDestroying) {
                                target.onFocusIn?.(event);
                            }
                        }
                    }

                    // Fire element focusmove event. Grid navigation will use  this when cells are focusable.
                    const commonAncestorEl = DomHelper.getCommonAncestor(fromElement?.nodeType === Element.ELEMENT_NODE ? fromElement : null, toElement) || toElement.parentNode;

                    event = createWidgetEvent('focusmove', toElement, fromElement, fromWidget, toWidget, backwards, { bubbles : true });
                    commonAncestorEl.dispatchEvent(event);
                },
                focusout(focusout) {
                    if (focusEventsSuspended) {
                        return;
                    }

                    if (!focusout.relatedTarget || !GlobalEvents.Widget.fromElement(focusout.relatedTarget)) {
                        // When switching between tabs in Salesforce app `relatedTarget` of the focusout event might be not an instance of
                        // HTMLElement.
                        const target = focusout.relatedTarget && focusout.relatedTarget instanceof HTMLElement ? focusout.relatedTarget : null;

                        listeners.focusin({
                            target,
                            relatedTarget : focusout.target
                        });
                    }
                },
                capture : true,
                passive : true
            };

            // detach previous listeners
            detach && detacher?.();

            detacher = EventHelper.on(listeners);
        }

        get lastInteractionType() {
            return lastInteractionType;
        }
    })(),
    isTopVisibleModal = w => w.isVisible && w.isTopModal;

GlobalEvents.observedElements = new Set();

/**
 * Fired after the theme is changed
 * @event theme
 * @param {Core.GlobalEvents} source
 * @param {String} theme The new theme name
 */

let globaltouchStart,
    focusEventsSuspended = false,
    lastInteractionType,
    detacher;

function createWidgetEvent(eventName, target, relatedTarget, fromWidget, toWidget, backwards, options) {
    const result = new CustomEvent(eventName, options);

    // Workaround for Salesforce. They use strict mode and define non-configurable property `target`. We use this
    // CustomEvent as a synthetic one, feels fine to use non-standard handle for target.
    Object.defineProperty(result, '_target', {
        get() {
            return target;
        }
    });
    Object.defineProperty(result, 'relatedTarget', {
        get() {
            return relatedTarget;
        }
    });
    result.fromWidget = fromWidget;
    result.toWidget = toWidget;
    result.backwards = backwards;

    return result;
}

/**
 * A singleton firing global application level events like 'theme'.
 *
 * ```javascript
 * GlobalEvents.on({
 *    theme() {
 *        // react to theme changes here
 *    }
 * });
 * ```
 *
 * @class
 * @singleton
 * @mixes Core/mixin/Events
 */
export default GlobalEvents;
