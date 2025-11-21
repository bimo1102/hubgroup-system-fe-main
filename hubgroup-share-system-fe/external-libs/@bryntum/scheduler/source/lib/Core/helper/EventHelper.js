import DomHelper from './DomHelper.js';
import ObjectHelper from './ObjectHelper.js';
import FunctionHelper from './FunctionHelper.js';
import BrowserHelper from './BrowserHelper.js';
import Rectangle from './util/Rectangle.js';
import './util/Point.js';
import StringHelper from './StringHelper.js';

/**
 * @module Core/helper/EventHelper
 */

const
    touchProperties = [
        'clientX',
        'clientY',
        'pageX',
        'pageY',
        'screenX',
        'screenY'
    ],
    isOption = {
        element    : 1,
        thisObj    : 1,
        once       : 1,
        delegate   : 1,
        delay      : 1,
        capture    : 1,
        passive    : 1,
        throttled  : 1,
        autoDetach : 1,
        expires    : 1
    },
    ctrlKeyProp = {
        get : () => true
    },
    normalizedKeyNames = {
        Spacebar : 'Space',
        Del      : 'Delete',
        Esc      : 'Escape',
        Left     : 'ArrowLeft',
        Up       : 'ArrowUp',
        Right    : 'ArrowRight',
        Down     : 'ArrowDown'
    },
    ignoreModifierKeys     = {
        Meta    : 1,
        Control : 1,
        Alt     : 1
    },
    // Allow an unsteady finger to jiggle by this much
    longpressMoveThreshold = 5;

function getAccessorFromPrototype(target, property) {
    let descriptor, accessor;

    while ((target = Object.getPrototypeOf(target)) && !accessor) {
        descriptor = Object.getOwnPropertyDescriptor(target, property);

        accessor = descriptor && descriptor.get;
    }

    return accessor;
}

/**
 * Utility methods for dealing with Events, normalizing Touch/Pointer/Mouse events.
 */
export default class EventHelper {
    static normalizeEvent(event) {
        return ObjectHelper.copyPropertiesIf(event, event.changedTouches[0] || event.touches[0], touchProperties);
    }

    /**
     * Returns the `[x, y]` coordinates of the event in the viewport coordinate system.
     * @param {Event} event The event
     * @return {Number[]} The coordinate.
     */
    static getXY(event) {
        if (event.touches) {
            event = event.touches[0];
        }
        return [event.clientX, event.clientY];
    }

    /**
     * Returns the pixel distance between two mouse/touch/pointer events.
     * @param {Event} event1 The first event.
     * @param {Event} event2 The second event.
     * @return {Number} The distance in pixels between the two events.
     */
    static getDistanceBetween(event1, event2) {
        const
            xy1 = EH.getXY(event1),
            xy2 = EH.getXY(event2);

        // No point in moving this to Point. We are dealing only with number values here.
        return Math.sqrt(Math.pow(xy1[0] - xy2[0], 2) + Math.pow(xy1[1] - xy2[1], 2));
    }

    /**
     * Returns a {@link Core.helper.util.Point} which encapsulates the `pageX/Y` position of the event.
     * May be used in {@link Core.helper.util.Rectangle} events.
     * @param {Event} event A browser mouse/touch/pointer event.
     * @return {Core.helper.util.Point} The page point.
     */
    static getPagePoint(event) {
        return new Rectangle.Point(event.pageX, event.pageY);
    }

    /**
     * Returns a {@link Core.helper.util.Point} which encapsulates the `clientX/Y` position of the event.
     * May be used in {@link Core.helper.util.Rectangle} events.
     * @param {Event} event A browser mouse/touch/pointer event.
     * @return {Core.helper.util.Point} The page point.
     */
    static getClientPoint(event) {
        return new Rectangle.Point(event.clientX, event.clientY);
    }

    /**
     * Add a listener or listeners to an element
     * @param {HTMLElement} element The element to add a listener/listeners to.
     * @param {String|Object} eventName Either a string, being the name of the event to listen for,
     * or an options object containing event names and options as keys. See the options parameter
     * for details, or the {@link #function-on-static} method for details.
     * @param {Function} [handler] If the second parameter is a string event name, this is the handler function.
     * @param {Object} [options] If the second parameter is a string event name, this is the options.
     * @param {HTMLElement} options.element The element to add the listener to.
     * @param {Object} options.thisObj The default `this` reference for all handlers added in this call.
     * @param {Boolean} [options.autoDetach=true] The listeners are automatically removed when the `thisObj` is destroyed.
     * @param {String} [options.delegate] A CSS selector string which only fires the handler when the event takes place in a matching element.
     * @param {Boolean} [options.once] Specify as `true` to have the listener(s) removed upon first invocation.
     * @param {Number} [options.delay] The number of milliseconds to delay the handler call after the event fires:
     * @param {Number|Object} [options.expires] The listener only waits for a specified time before
     * being removed. The value may be a number or an object containing an expiry handler.
     * @param {Number} [options.expires.delay] How long to wait for the event for.
     * @param {String|Function} [options.expires.alt] The function to call when the listener expires
     * **without having been triggered**.
     * @returns {Function} A detacher function which removes all the listeners when called.
     */
    static addListener(element, eventName, handler, options) {
        if (element.nodeType) {
            // All separate params, element, eventName and handler
            if (typeof eventName === 'string') {
                options = Object.assign({
                    element,
                    [eventName] : handler
                }, options);
            }
            // element, options
            else {
                options = Object.assign({
                    element
                }, eventName);
            }
        }
        // Just an options object passed
        else {
            options = element;
        }
        return EH.on(options);
    }

    /**
     * Adds a listener or listeners to an element.
     * all property names other than the options listed below are taken to be event names,
     * and the values as handler specs.
     *
     * A handler spec is usually a function reference or the name of a function in the `thisObj`
     * option.
     *
     * But a handler spec may also be an options object containing a `handler` property which is
     * the function or function name, and local options, including `element` and `thisObj`
     * which override the top level options.
     *
     *  Usage example
     *
     * ```javascript
     * construct(config) {
     *     super.construct(config);
     *
     *     // Add auto detaching event handlers to this Widget's reference elements
     *     EventHelper.on({
     *         element : this.iconElement,
     *         click   : '_handleIconClick',
     *         thisObj : this,
     *         contextmenu : {
     *             element : document,
     *             handler : '_handleDocumentContextMenu'
     *         }
     *     });
     * }
     *```
     *
     * The `click` handler on the `iconElement` calls `this._handleIconClick`.
     *
     * The `contextmenu` handler is added to the `document` element, but the `thisObj`
     * is defaulted in from the top `options` and calls `this._handleDocumentContextMenu`.
     *
     * Note that on touch devices, `dblclick` and `contextmenu` events are synthesized.
     * Synthesized events contain a `browserEvent` property containing the final triggering
     * event of the gesture. For example a synthesized `dblclick` event would contain a
     * `browserEvent` property which is the last `touchend` event. A synthetic `contextmenu`
     * event will contain a `browserEvent` property which the longstanding `touchstart` event.
     *
     * @param {Object} options The full listener specification.
     * @param {HTMLElement} options.element The element to add the listener to.
     * @param {Object} options.thisObj The default `this` reference for all handlers added in this call.
     * @param {Boolean} [options.autoDetach=true] The listeners are automatically removed when the `thisObj` is destroyed.
     * @param {String} [options.delegate] A CSS selector string which only fires the handler when the event takes place in a matching element.
     * @param {Boolean} [options.once] Specify as `true` to have the listener(s) removed upon first invocation.
     * @param {Number} [options.delay] The number of milliseconds to delay the handler call after the event fires.
     * @param {Number} [options.throttled] For rapidly repeating events (Such as `wheel` or `scroll` or `mousemove`)
     * this is the number of milliseconds to delay subsequent handler calls after first invocation which happens immediately.
     * @param {Number|Object} [options.expires] The listener only waits for a specified time before
     * being removed. The value may be a number or an object containing an expiry handler.
     * @param {Number} [options.expires.delay] How long to wait for the event for.
     * @param {String|Function} [options.expires.alt] The function to call when the listener expires
     * **without having been triggered**.
     * @returns {Function} A detacher function which removes all the listeners when called.
     */
    static on(options) {
        const
            element        = options.element,
            thisObj        = options.thisObj,
            handlerDetails = [];

        for (const eventName in options) {
            // Only treat it as an event name if it's not a supported option
            if (!isOption[eventName]) {
                let handlerSpec = options[eventName];
                if (typeof handlerSpec !== 'object') {
                    handlerSpec = {
                        handler : handlerSpec
                    };
                }
                const targetElement = handlerSpec.element || element;
                // If we need to convert taphold to an emulated contextmenu, add a wrapping function
                // in addition to the contextmenu listener. Platforms may support mouse *and* touch.
                if (BrowserHelper.isTouchDevice && !BrowserHelper.isAndroid) {
                    if (eventName === 'contextmenu') {
                        handlerDetails.push(EH.addElementListener(targetElement, 'touchstart', {
                            handler : EH.createContextMenuWrapper(handlerSpec.handler, handlerSpec.thisObj || thisObj)
                        }, options));
                    }
                }

                // Keep track of the real handlers added.
                // addElementLister returns [ element, eventName, addedFunction, capture ]
                handlerDetails.push(EH.addElementListener(targetElement, eventName, handlerSpec, options));
            }
        }

        const detacher = () => {
            for (let handlerSpec, i = 0; i < handlerDetails.length; i++) {
                handlerSpec = handlerDetails[i];
                EH.removeEventListener(handlerSpec[0], handlerSpec[1], handlerSpec[2]);
            }
            handlerDetails.length = 0;
        };

        // { autoDetach : true, thisObj : scheduler } means remove all listeners when the scheduler dies.
        if (thisObj && options.autoDetach !== false) {
            thisObj.doDestroy = FunctionHelper.createInterceptor(thisObj.doDestroy, detacher, thisObj);
        }

        return detacher;
    }

    /**
     * Used internally to add a single event handler to an element.
     * @param {HTMLElement} element The element to add the handler to.
     * @param {String} eventName The name of the event to add a handler for.
     * @param {Function|String|Object} handlerSpec Either a function to call, or
     * the name of a function to call in the `thisObj`, or an object containing
     * the handler local options.
     * @param {Function|String} [handlerSpec.handler] Either a function to call, or
     * the name of a function to call in the `thisObj`.
     * @param {HTMLElement} [handlerSpec.element] Optionally a local element for the listener.
     * @param {Object} [handlerSpec.thisObj] A local `this` specification for the handler.
     * @param {Object} defaults The `options` parameter from the {@link #function-addListener-static} call.
     * @private
     */
    static addElementListener(element, eventName, handlerSpec, defaults) {
        const
            handler           = EH.createHandler(element, eventName, handlerSpec, defaults),
            handlerHasPassive = ('passive' in handlerSpec),
            expires           = handlerSpec.expires || defaults.expires;

        let options = handlerSpec.capture || defaults.capture;

        // If we are passed the passive option and the browser supports it, then convert
        // The capture option into the object options form.
        if ((handlerHasPassive || ('passive' in defaults)) && BrowserHelper.supportsPassive) {
            options = {
                capture : !!options,
                passive : handlerHasPassive ? handlerSpec.passive : defaults.passive
            };
        }

        element.addEventListener(eventName, handler, options);

        if (expires) {
            // Extract expires : { delay : 100, alt : 'onExpireFn' }
            const
                thisObj   = handlerSpec.thisObj || defaults.thisObj,
                delayable = thisObj?.isDelayable ? thisObj : window,
                { alt }   = expires,
                delay     = alt ? expires.delay : expires,
                { spec }  = handler;

            // expires is not applied with other options in createHandler(), store it here
            spec.expires = expires;

            spec.timerId = delayable[typeof delay === 'number' ? 'setTimeout' : 'requestAnimationFrame'](() => {
                spec.timerId = null;

                EH.removeEventListener(element, eventName, handler);

                // If we make it here and the handler has not been called, invoke the alt handler
                if (alt && !handler.called) {
                    (typeof alt === 'string' ? thisObj[alt] : alt).call(thisObj);
                }
            }, delay, `listener-timer-${performance.now()}`);
        }

        return [element, eventName, handler, options];
    }

    static fixEvent(event) {
        const { type } = event;

        // Normalize key names
        if (type.startsWith('key')) {
            const normalizedKeyName = normalizedKeyNames[event.key];
            if (normalizedKeyName) {
                Object.defineProperty(event, 'key', {
                    get : () => normalizedKeyName
                });
            }

            // Polyfill the code property for SPACE because it is not set for synthetic events.
            if (event.key === ' ' && !event.code) {
                Object.defineProperty(event, 'code', {
                    get : () => 'Space'
                });
            }
        }

        // Sync OSX's meta key with the ctrl key. This will only happen on Mac platform.
        // It's read-only, so define a local property to return true for ctrlKey.
        if (event.metaKey && !event.ctrlKey) {
            Object.defineProperty(event, 'ctrlKey', ctrlKeyProp);
        }

        // When we listen to event on document and get event which bubbled from shadow dom, reading its target would
        // return shadow root element. We need actual element which started the event
        if (event.target?.shadowRoot && event.composedPath && !BrowserHelper.isIE11 && !BrowserHelper.isEdge) {
            const
                targetElement  = event.composedPath()[0],
                originalTarget = event.target;

            // Can there be an event which actually originated from custom element, not its shadow dom?
            if (event.target !== targetElement) {
                Object.defineProperty(event, 'target', {
                    get          : () => targetElement,
                    configurable : true
                });

                // Save original target just in case
                Object.defineProperty(event, 'originalTarget', {
                    get          : () => originalTarget,
                    configurable : true
                });
            }
        }

        // Chrome 78 has a bug where moving out of the left edge of an element can report a mousemove
        // with that element as the target, but offsetX as -1 and moving out the right edge can report
        // that the element is the target but an offset of the offsetWidth. Patch the event until they fix it.
        // https://bugs.chromium.org/p/chromium/issues/detail?id=1010528
        // Tested in EventHelper.js
        if (BrowserHelper.isChrome && event.target && 'offsetX' in event) {
            // Wrap reading `offsetX/Y` until this property is actually accessed in the code to avoid forced reflow.
            // To avoid getting infinite loop, property descriptor is looked up in the prototype chain. Should be
            // better than forcing DOM reflow on every single event.
            if (!Object.getOwnPropertyDescriptor(event, 'offsetX')) {
                Object.defineProperty(event, 'offsetX', {
                    get : () => {
                        const
                            accessor        = getAccessorFromPrototype(event, 'offsetX'),
                            offsetX         = accessor.call(event),
                            { target }      = event,
                            { offsetWidth } = target,
                            x               = Math.min(Math.max(offsetX, 0), offsetWidth - 1);

                        if (offsetX < 0 || offsetX >= offsetWidth) {
                            return x;
                        }

                        return offsetX;
                    }
                });
            }

            if (!Object.getOwnPropertyDescriptor(event, 'offsetY')) {
                Object.defineProperty(event, 'offsetY', {
                    get : () => {
                        const
                            accessor         = getAccessorFromPrototype(event, 'offsetY'),
                            offsetY          = accessor.call(event),
                            { target }       = event,
                            { offsetHeight } = target,
                            y                = Math.min(Math.max(offsetY, 0), offsetHeight - 1);

                        if (offsetY < 0 || offsetY >= offsetHeight) {
                            return y;
                        }

                        return offsetY;
                    }
                });
            }
        }

        // Firefox has a bug where it can report that the target is the #document when mouse is over a pseudo element
        if (event.target?.nodeType === Element.DOCUMENT_NODE && 'clientX' in event) {
            const targetElement = DomHelper.elementFromPoint(event.clientX, event.clientY);
            Object.defineProperty(event, 'target', {
                get : () => targetElement
            });
        }

        // Firefox has a bug where it can report a textNode as an event target/relatedTarget.
        // We standardize this to report the parentElement.
        if (event.target?.nodeType === Element.TEXT_NODE) {
            const targetElement = event.target.parentElement;
            Object.defineProperty(event, 'target', {
                get : () => targetElement
            });
        }
        if (event.relatedTarget?.nodeType === Element.TEXT_NODE) {
            const relatedTargetElement = event.target.parentElement;
            Object.defineProperty(event, 'relatedTarget', {
                get : () => relatedTargetElement
            });
        }

        // If it's a touch event, move the positional details
        // of touches[0] up to the event.
        if (type.startsWith('touch') && event.touches.length) {
            this.normalizeEvent(event);
        }

        return event;
    }

    static createHandler(element, eventName, handlerSpec, defaults) {
        const
            delay            = handlerSpec.delay || defaults.delay,
            throttled        = handlerSpec.throttled || defaults.throttled,
            block            = handlerSpec.block || defaults.block,
            once             = handlerSpec.once || defaults.once,
            thisObj          = handlerSpec.thisObj || defaults.thisObj,
            capture          = handlerSpec.capture || defaults.capture,
            delegate         = handlerSpec.delegate || defaults.delegate,
            wrappedFn        = handlerSpec.handler;

        //Capture initial conditions in case of destruction of thisObj.
        // Destruction completely wipes the object.
        //<debug>
        const
            thisObjClassName = (thisObj && thisObj.constructor.name) || 'Object',
            thisObjId        = (thisObj && thisObj.id) || 'unknown';
        //</debug>

        // Innermost level of wrapping which calls the user's handler.
        // Normalize the event cross-browser, and attempt to normalize touch events.
        let handler = (event, ...args) => {
            // Flag for the expiry timer
            handler.called = true;

            // When playing a demo using DemoBot, only handle synthetic events
            if (EH.playingDemo && event.isTrusted) {
                return;
            }

            // If the thisObj is already destroyed, we cannot call the function.
            // If in dev mode, warn the developer with a JS error.
            if (thisObj && thisObj.isDestroyed) {
                //<debug>
                throw new Error(`Attempting to fire ${eventName} event on destroyed ${thisObjClassName} instance with id: ${thisObjId}`);
                //</debug>
                // eslint-disable-next-line
                return;
            }

            // Fix up events to handle various browser inconsistencies
            event = EH.fixEvent(event);

            // delegate: '.b-field-trigger' only fires when click is in a matching el.
            // currentTarget becomes the delegate.
            if (delegate) {
                // Maintainer: In Edge event.target can be an empty object for transitionend events
                const delegatedTarget = event.target.closest?.call && event.target.closest(delegate);
                if (!delegatedTarget) {
                    return;
                }
                // Allow this to be redefined as it bubbles through listeners up the parentNode axis
                // which might have their own delegate settings.
                Object.defineProperty(event, 'currentTarget', {
                    get          : () => delegatedTarget,
                    configurable : true
                });
            }

            (typeof wrappedFn === 'string' ? thisObj[wrappedFn] : wrappedFn).call(thisObj, event, ...args);
        };

        // Allow events to be blocked for a certain time
        if (block) {
            const wrappedFn = handler;
            let   lastCallTime, lastTarget;

            handler = (e, ...args) => {
                const now = performance.now();
                if (!lastCallTime || e.target !== lastTarget || now - lastCallTime > block) {
                    lastTarget = e.target;
                    lastCallTime = now;
                    wrappedFn(e, ...args);
                }
            };
        }

        // Go through options, each creates a new handler by wrapping the previous handler to implement the options.
        // Right now, we have delay. Note that it may be zero, so test != null
        if (delay != null) {
            const
                wrappedFn = handler,
                delayable = thisObj && thisObj.setTimeout ? thisObj : window;

            handler = (...args) => {
                delayable.setTimeout(() => {
                    wrappedFn(...args);
                }, delay);
            };
        }

        // If they specified the throttled option, wrap the handler in a createdThrottled
        // version. Allow the called to specify an alt function to call when the event
        // fires before the buffer time has expired.
        if (throttled != null) {
            let alt, buffer = throttled;

            if (throttled.buffer) {
                alt = e => throttled.alt.call(EH, EH.fixEvent(e));
                buffer = throttled.buffer;
            }

            if (thisObj && thisObj.isDelayable) {
                handler = thisObj.throttle(handler, {
                    delay     : buffer,
                    throttled : alt
                });
            }
            else {
                handler = FunctionHelper.createThrottled(handler, buffer, thisObj, null, alt);
            }
        }

        // This must always be the last option processed so that it is the outermost handler
        // which is the one added to the element and is called immediately so that the
        // handler is removed immediately.
        // TODO: Use the native once option when all browsers support it. Only IE11 doesn't.
        if (once) {
            const wrappedFn = handler;
            handler = (...args) => {
                //element.removeEventListener(eventName, handler, capture);
                EH.removeEventListener(element, eventName, handler);
                wrappedFn(...args);
            };
        }

        // Only autoDetach here if there's a local thisObj is in the handlerSpec for this one listener.
        // If it's in the defaults, then the "on" method will handle it.
        if (handlerSpec.thisObj && handlerSpec.autoDetach !== false) {
            thisObj.doDestroy = FunctionHelper.createInterceptor(thisObj.doDestroy, () => EH.removeEventListener(element, eventName, handler), thisObj);
        }

        handler.spec = {
            delay,
            throttled,
            block,
            once,
            thisObj,
            capture,
            delegate
        };

        return handler;
    }

    static removeEventListener(element, eventName, handler) {
        const { expires, timerId, thisObj, capture } = handler.spec;

        // Cancel outstanding expires.alt() call when removing the listener
        if (expires?.alt && timerId) {
            const delayable = thisObj?.isDelayable ? thisObj : window;
            delayable[typeof expires.delay === 'number' ? 'clearTimeout' : 'cancelAnimationFrame'](timerId);
        }

        element.removeEventListener(eventName, handler, capture);
    }

    static onTransitionEnd({
        element,
        property,
        handler,
        mode     = 'transition',
        duration = DomHelper[`get${mode === 'transition' ? 'Property' : ''}${StringHelper.capitalize(mode)}Duration`](element, property),
        thisObj  = window,
        args     = []
    }) {
        let timerId;

        const
            callbackArgs = [element, property, ...args],
            timerSource = thisObj.isDelayable ? thisObj : window,
            doCallback  = () => {
                detacher();
                if (!thisObj.isDestroyed) {
                    if (thisObj.callback) {
                        thisObj.callback(handler, thisObj, callbackArgs);
                    }
                    else {
                        handler.apply(thisObj, callbackArgs);
                    }
                }
            },
            detacher    = EH.on({
                element,
                [`${mode}end`]({ propertyName, target }) {
                    if (propertyName === property && target === element) {
                        if (timerId) {
                            timerSource.clearTimeout(timerId);
                            timerId = null;
                        }

                        doCallback();
                    }
                }
            });

        // If the transition has not signalled its end within duration + 50 milliseconds
        // then give up on it. Remove the listener and call the handler.
        if (duration != null) {
            timerId = timerSource.setTimeout(doCallback, duration + 50);
        }

        return detacher;
    }

    static async waitForTransitionEnd(config) {
        return new Promise(resolve => {
            config.handler = resolve;
            EventHelper.onTransitionEnd(config);
        });
    }

    /**
     * Private function to wrap the passed function. The returned wrapper function to be used as
     * a `touchstart` handler which will call the passed function passing a fabricated `contextmenu`
     * event if there's no `touchend` or `touchmove` after a default of 400ms.
     * @param {String|Function} handler The handler to call.
     * @param {Object} thisObj The owner of the function.
     * @private
     */
    static createContextMenuWrapper(handler, me) {
        return event => {
            // Only attempt conversion to contextmenu if it's a single touch start.
            if (event.touches.length === 1) {
                const tapholdStartTouch = event.touches[0],
                    // Dispatch a synthetic "contextmenu" event from the touchpoint in <longPressTime> milliseconds.
                    tapholdTimer = setTimeout(() => {
                        // Remove the gesture cancelling listeners
                        touchMoveRemover();

                        const contextmenuEvent = new MouseEvent('contextmenu', tapholdStartTouch);
                        Object.defineProperty(contextmenuEvent, 'target', {
                            get() {
                                return tapholdStartTouch.target;
                            }
                        });
                        if (typeof handler === 'string') {
                            handler = me[handler];
                        }

                        contextmenuEvent.browserEvent = event;

                        // Call the wrapped handler passing the fabricated contextmenu event
                        handler.call(me, contextmenuEvent);
                        EH.contextMenuTouchId = tapholdStartTouch.identifier;
                    }, EH.longPressTime),
                    // This is what gets called if the user moves their touchpoint,
                    // or releases the touch before <longPressTime>ms is up
                    onMoveOrPointerUp = ({ clientX, clientY, type }) => {
                        let cancel = type === 'touchend' || type === 'pointerup';

                        // for move events, check if we only moved a little
                        if (!cancel) {
                            const
                                deltaX = Math.abs(clientX - tapholdStartTouch.clientX),
                                deltaY = Math.abs(clientY - tapholdStartTouch.clientY);

                            cancel = deltaX >= longpressMoveThreshold || deltaY >= longpressMoveThreshold;
                        }

                        if (cancel) {
                            EH.contextMenuTouchId = null;
                            touchMoveRemover();
                            clearTimeout(tapholdTimer);
                        }
                    },
                    // Touchmove or touchend before that timer fires cancels the timer and removes these listeners.
                    touchMoveRemover  = EH.on({
                        element     : document,
                        touchmove   : onMoveOrPointerUp,
                        touchend    : onMoveOrPointerUp,
                        pointermove : onMoveOrPointerUp,
                        pointerup   : onMoveOrPointerUp,
                        capture     : true
                    });
            }
        };
    }

    /**
     * Private function to wrap the passed function. The returned wrapper function to be used as
     * a `touchend` handler which will call the passed function passing a fabricated `dblclick`
     * event if there is a `click` within 300ms.
     * @param {String|Function} handler The handler to call.
     * @param {Object} thisObj The owner of the function.
     * @private
     */
    static createDblClickWrapper(element, handler, me) {
        let startId, secondListenerDetacher, tapholdTimer;

        return () => {
            if (!secondListenerDetacher) {
                secondListenerDetacher = EH.on({
                    element,

                    // We only get here if a touchstart arrives within 300ms of a click
                    touchstart : secondStart => {
                        startId = secondStart.changedTouches[0].identifier;
                        // Prevent zoom
                        secondStart.preventDefault();
                    },
                    touchend : secondClick => {
                        if (secondClick.changedTouches[0].identifier === startId) {
                            secondClick.preventDefault();

                            clearTimeout(tapholdTimer);
                            startId = secondListenerDetacher = null;

                            const targetRect          = Rectangle.from(secondClick.changedTouches[0].target, null, true),
                                offsetX             = secondClick.changedTouches[0].pageX - targetRect.x,
                                offsetY             = secondClick.changedTouches[0].pageY - targetRect.y,
                                dblclickEventConfig = Object.assign({
                                    browserEvent : secondClick
                                }, secondClick),
                                dblclickEvent       = new MouseEvent('dblclick', dblclickEventConfig);

                            Object.defineProperty(dblclickEvent, 'target', {
                                get() {
                                    return secondClick.target;
                                }
                            });

                            Object.defineProperty(dblclickEvent, 'offsetX', {
                                get() {
                                    return offsetX;
                                }
                            });

                            Object.defineProperty(dblclickEvent, 'offsetY', {
                                get() {
                                    return offsetY;
                                }
                            });

                            if (typeof handler === 'string') {
                                handler = me[handler];
                            }

                            // Call the wrapped handler passing the fabricated dblclick event
                            handler.call(me, dblclickEvent);
                        }
                    },
                    once : true
                });

                // Cancel the second listener is there's no second click within <dblClickTime> milliseconds.
                tapholdTimer = setTimeout(() => {
                    secondListenerDetacher();
                    startId = secondListenerDetacher = null;
                }, EH.dblClickTime);
            }
        };
    }
}

const EH = EventHelper;

/**
 * The time in milliseconds for a `taphold` gesture to trigger a `contextmenu` event.
 * @member {Number} [longPressTime=500]
 * @readonly
 * @static
 */
EH.longPressTime = 500;

/**
 * The time in milliseconds within which a second touch tap event triggers a `dblclick` event.
 * @member {Number} [dblClickTime=300]
 * @readonly
 * @static
 */
EH.dblClickTime = 300;

// Flag body if last user action used keyboard, used for focus styling etc.
EH.on({
    element : document,
    mousedown({ target }) {
        if (!DomHelper.isTouchEvent) {
            const rootEl = DomHelper.getRootElement(target);

            DomHelper.usingKeyboard = false;

            rootEl.classList?.remove('b-using-keyboard');
            DomHelper.removeClsGlobally(rootEl, 'b-using-keyboard');
        }
    },
    touchmove({ changedTouches }) {
        const
            target = changedTouches[0].target,
            rootEl = DomHelper.getRootElement(target);

        DomHelper.usingKeyboard = false;

        rootEl.classList?.remove('b-using-keyboard');
        DomHelper.removeClsGlobally(rootEl, 'b-using-keyboard');
    },
    keydown({ target, key }) {
        if (!ignoreModifierKeys[key]) {
            DomHelper.usingKeyboard = true;

            const rootElement = DomHelper.getRootElement(target);

            // if shadow root, add to outer children (shadow root itself lacks a classList :( )
            if (rootElement.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                Array.from(rootElement.children).forEach(node => {
                    if (node.matches('.b-outer')) {
                        node.classList.add('b-using-keyboard');
                    }
                });
            }
            else {
                // document.body
                rootElement.classList.add('b-using-keyboard');
            }
        }
    }
});

// When dragging on a touch device, we need to prevent scrolling from happening.
// Dragging only starts on a touchmove event, by which time it's too late to preventDefault
// on the touchstart event which started it.
// To do this we need a capturing, non-passive touchmove listener at the document level so we can preventDefault.
// This is in lieu of a functioning touch-action style on iOS Safari. When that's fixed, this will not be needed.
if (BrowserHelper.isTouchDevice) {
    EH.on({
        element   : document,
        touchmove : event => {
            // If we're touching a b-dragging event, then stop any panning by preventing default.
            if (event.target.closest('.b-dragging')) {
                event.preventDefault();
            }
        },
        passive : false,
        capture : true
    });
}
