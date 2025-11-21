import Base from '../Base.js';
import VersionHelper from '../helper/VersionHelper.js';
import BrowserHelper from '../helper/BrowserHelper.js';

const { defineProperty } = Reflect;

let performance;

if (BrowserHelper.isBrowserEnv) {
    performance = window.performance;
}
else {
    performance = {
        now() {
            return new Date().getTime();
        }
    };
}

/**
 * @module Core/mixin/Delayable
 */

// Global timeout collections for tests
let globalDelays = null;

if (VersionHelper.isTestEnv) {
    const bryntum = BrowserHelper.global.bryntum || (BrowserHelper.global.bryntum = {});

    globalDelays = bryntum.globalDelays = {
        timeouts        : new Map(),
        intervals       : new Map(),
        animationFrames : new Map(),
        isEmpty(includeIntervals = false) {
            return globalDelays.timeouts.size + globalDelays.animationFrames.size + (includeIntervals ? globalDelays.intervals.size : 0) === 0;
        }
    };
}

const
    /**
     * Creates and returns a function that will call the user-supplied `fn`.
     *
     * @param {Core.mixin.Delayable} me
     * @param {Function} fn The user function to call when the timer fires.
     * @param {Function} wrapFn The function the user will call to start the timer.
     * @param {Object} options The invoke options.
     * @param {Array} [options.appendArgs] The argument list to append to those passed to the function.
     * @param {Object} [options.thisObj] The `this` reference for `fn`.
     * @returns {Function}
     * @private
     */
    makeInvoker = (me, fn, wrapFn, options) => {
        const
            named      = typeof fn === 'string',
            appendArgs = options && options.appendArgs || [],
            // The invoker fn is intended to be wired directly to native setTimeout/requestAnimationFrame/etc and so
            // it does not receive any arguments worth passing on to the user's fn. Those come from the original call
            // to the wrapFn.
            invoker    = () => {
                wrapFn.timerId = null;
                wrapFn.lastCallTime = performance.now();

                // Grab args now and null the stored args out (to avoid leaks):
                const args = wrapFn.args;

                wrapFn.args = null;

                if (named) {
                    me[fn](...args, ...appendArgs);
                }
                else {
                    fn.call(me, ...args, ...appendArgs);
                }

                wrapFn.called = true;
                ++wrapFn.calls;
            };

        if (options) {
            me = options.thisObj || me;
        }

        // We put most everything as properties on the wrapFn so that it can all be inspected in the debugger (unlike
        // closure variables) and expected in tests.
        wrapFn.lastCallTime = -9e9;  // performance.now() = 0 at start...
        wrapFn.calls = 0;
        wrapFn.invoker = invoker;

        invoker.wrapFn = wrapFn;

        return invoker;
    },

    /**
     * Decorates the supported `wrapFn` with additional methods and an `isPending` readonly
     * property. These decorations are available to user code to help manage the scheduling
     * behavior of the buffered function.
     *
     * @param {Core.mixin.Delayable} me
     * @param {Function} wrapFn The function the user will call to start the timer.
     * @param {String} cancelFn The name of the function that will cancel a timer.
     * @returns {Function} The `wrapFn` is returned.
     * @private
     */
    decorateWrapFn = (me, wrapFn, cancelFn = 'clearTimeout') => {
        wrapFn.cancel = () => {
            if (wrapFn.isPending) {
                me[cancelFn](wrapFn.timerId);
                // avoid leaks and cleanup:
                wrapFn.args = wrapFn.timerId = null;
            }
        };

        wrapFn.flush = () => {
            if (wrapFn.isPending) {
                me[cancelFn](wrapFn.timerId);
                wrapFn.timerId = null;
                // we don't call cancel() since it also sets args=null

                wrapFn.invoker();
            }
        };

        wrapFn.now = (...args) => {
            wrapFn.cancel();
            wrapFn.args = args;
            wrapFn.invoker();
        };

        wrapFn.resume = all => {
            const n = wrapFn.suspended;

            wrapFn.suspended = (all || n < 1) ? 0 : (n - 1);
        };

        wrapFn.suspend = () => {
            ++wrapFn.suspended;
        };

        wrapFn.immediate = false;
        wrapFn.suspended = 0;
        wrapFn.timerId = null;

        defineProperty(wrapFn, 'isPending', {
            get() {
                return wrapFn.timerId !== null;
            }
        });

        return wrapFn;
    };

/**
 * Tracks setTimeout, setInterval and requestAnimationFrame calls and clears them on destroy.
 *
 * @example
 * someClass.setTimeout(() => console.log('hi'), 200);
 * someClass.setInterval(() => console.log('annoy'), 100);
 * // can also use named timeouts for easier tracking
 * someClass.setTimeout(() => console.log('named'), 300, 'named');
 * someClass.clearTimeout('named');
 *
 * @mixin
 */
export default Target => class Delayable extends (Target || Base) {
    static get $name() {
        return 'Delayable';
    }

    static get declarable() {
        return [
            /**
             * This class property returns an object that specifies methods to wrap with configurable timer behaviors.
             *
             * It is used like so:
             * ```
             *  class Foo extends Delayable() {
             *      static get delayable() {
             *          return {
             *              expensiveMethod : 500
             *          };
             *      }
             *
             *      expensiveMethod() {
             *          this.things();
             *          this.moreThings();
             *          this.evenMoreThings();
             *      }
             *  }
             * ```
             * With the above in place, consider:
             * ```
             *  let instance = new Foo();
             *
             *  instance.expensiveMethod();
             * ```
             * Instead of the above code immediately calling the `expensiveMethod()`, it will start a timer that will
             * invoke the method 500ms later. Because `expensiveMethod()` is an instance method, each instance of `Foo`
             * will have its own timer.
             *
             * NOTE: Only instance methods are currently supported (i.e., only non-`static` methods).
             *
             * #### Options
             * The value of each key configures how the method will be scheduled. If the value is a number, it is
             * promoted to a config object of `type='buffer'` as in the following:
             * ```
             *  class Foo extends Delayable() {
             *      static get delayable() {
             *          return {
             *              expensiveMethod : {
             *                  type  : 'buffer',
             *                  delay : 500
             *              }
             *          };
             *      }
             *  });
             * ```
             * The `type` property of the config object must be one of three values. Other options can be provided
             * depending on the `type`:
             *
             *  - `buffer`<br>
             *    Other options:
             *     - `delay` (Number) : The number of milliseconds to wait before calling the underlying method. A
             *       value of 0 is equivalent to setting `immediate: true`.
             *     - `immediate` (Boolean) : Set to `true` to call immediately (effectively disabling the buffer).
             *  - `raf` (short for "request animation frame")<br>
             *    Other options:
             *     - `cancelOutstanding` (Boolean) : Set to `true` to cancel any pending animation frame requests and
             *       schedule a new one on each call.
             *     - `immediate` (Boolean) : Set to `true` to call immediately.
             *  - `throttle`<br>
             *    Other options:
             *     - `delay` (Number) : The number of milliseconds to wait after each execution before another
             *       execution takes place. A value of 0 is equivalent to setting `immediate: true`.
             *     - `immediate` (Boolean) : Set to `true` to call immediately (effectively disabling the throttle).
             *
             * While `immediate: true` can be specified at the class level, it is more typical to set it on the
             * instance's method as described below.
             *
             * #### Delayable Method API
             * Delayable methods have a consistent API to manage their scheduling. This API is added to the methods
             * themselves.
             *
             * For example:
             * ```
             *  let instance = new Foo();
             *
             *  instance.expensiveMethod();         // schedule a call in 500ms
             *  instance.expensiveMethod.isPending; // true
             *  instance.expensiveMethod.cancel();
             *  instance.expensiveMethod.flush();
             *  instance.expensiveMethod.now();
             *
             *  instance.expensiveMethod.delay = 10;
             *  instance.expensiveMethod();         // schedule a call in 10ms
             * ```
             *
             * ##### `isPending` (Boolean, readonly)
             * This boolean property will be `true` if a call has been scheduled, and false otherwise.
             *
             * ##### `cancel()`
             * Cancels a pending call if one has been scheduled. Otherwise this method does nothing.
             *
             * ##### `flush()`
             * Cancels the timer and causes the pending call to execute immediately. If there is no pending call, this
             * method does nothing.
             *
             * ##### `now()`
             * Cancels the timer (if one is pending) and executes the method immediately. If there is no pending call,
             * this method will still call the underlying method.
             *
             * @static
             * @member {Object} delayable
             * @internal
             */
            'delayable'
        ];
    }

    doDestroy() {
        const me = this;

        // Normally one would expect this call at the end of this method... but in this case we need to run cleanup
        // of this stuff after config nullification since those can trigger delayable method calls.
        super.doDestroy();

        if (me.timeoutIds) {
            me.timeoutIds.forEach((fn, id) => {
                if (typeof fn === 'function') {
                    fn();
                }

                clearTimeout(id);

                if (globalDelays) {
                    globalDelays.timeouts.delete(id);
                }
            });
            me.timeoutIds = null;
        }

        if (me.timeoutMap) {
            me.timeoutMap.forEach((name, id) => clearTimeout(id));
            me.timeoutMap = null;
        }

        if (me.intervalIds) {
            me.intervalIds.forEach(id => {
                clearInterval(id);

                if (globalDelays) {
                    globalDelays.intervals.delete(id);
                }
            });
            me.intervalIds = null;
        }

        if (me.animationFrameIds) {
            me.animationFrameIds.forEach(id => {
                cancelAnimationFrame(id);

                if (globalDelays) {
                    globalDelays.animationFrames.delete(id);
                }
            });
            me.animationFrameIds = null;
        }
    }

    /**
     * Check if a named timeout is active
     * @param name
     * @internal
     */
    hasTimeout(name) {
        return !!(this.timeoutMap && this.timeoutMap.has(name));
    }

    /**
     * Same as native setTimeout, but will be cleared automatically on destroy. If a propertyName is supplied it will
     * be used to store the timeout id.
     * @param {Object} timeoutSpec An object containing the details about that function, and the time delay.
     * @param {Function|String} timeoutSpec.fn The function to call, or name of function in this object to call. Used as the `name` parameter if a string.
     * @param {Number} timeoutSpec.delay The milliseconds to delay the call by.
     * @param {Object[]} timeoutSpec.args The arguments to pass.
     * @param {String} [timeoutSpec.name] The name under which to register the timer. Defaults to `fn.name`.
     * @param {Boolean} [timeoutSpec.runOnDestroy] Pass `true` if this function should be executed if the Delayable instance is destroyed while function is scheduled.
     * @param {Boolean} [timeoutSpec.cancelOutstanding] Pass `true` to cancel any outstanding invocation of the passed function.
     * @returns {Number}
     * @internal
     */
    setTimeout({ fn, delay, name, runOnDestroy, cancelOutstanding, args }) {
        if (arguments.length > 1 || typeof arguments[0] === 'function') {
            [fn, delay, name, runOnDestroy] = arguments;
        }
        if (typeof fn === 'string') {
            name = fn;
        }
        else if (!name) {
            name = fn.name;
        }

        if (cancelOutstanding) {
            this.clearTimeout(name);
        }

        const
            me         = this,
            timeoutIds = me.timeoutIds || (me.timeoutIds = new Map()),
            timeoutMap = me.timeoutMap || (me.timeoutMap = new Map()),
            timeoutId  = setTimeout(() => {
                if (typeof fn === 'string') {
                    fn = me[name];
                }

                // Cleanup before invocation in case fn throws
                timeoutIds && timeoutIds.delete(timeoutId);
                timeoutMap && timeoutMap.delete(name);
                globalDelays && globalDelays.timeouts.delete(timeoutId);

                fn.apply(me, args);

            }, delay);

        timeoutIds.set(timeoutId, runOnDestroy ? fn : true);

        if (globalDelays) {
            globalDelays.timeouts.set(timeoutId, { fn, delay, name });
        }

        if (name) {
            timeoutMap.set(name, timeoutId);
        }

        return timeoutId;
    }

    /**
     * clearTimeout wrapper, either call with timeout id as normal clearTimeout or with timeout name (if you specified
     * a name to setTimeout())
     * property to null.
     * @param {Number|String} idOrName timeout id or name
     * @internal
     */
    clearTimeout(idOrName) {
        let id = idOrName;

        if (typeof id === 'string') {
            if (this.timeoutMap) {
                id = this.timeoutMap.get(idOrName);
                this.timeoutMap.delete(idOrName);
            }
            else {
                return;
            }
        }

        clearTimeout(id);

        this.timeoutIds && this.timeoutIds.delete(id);
        globalDelays && globalDelays.timeouts.delete(id);
    }

    /**
     * clearInterval wrapper
     * @param {Number} id
     * @internal
     */
    clearInterval(id) {
        clearInterval(id);

        this.intervalIds && this.intervalIds.delete(id);

        globalDelays && globalDelays.intervals.delete(id);
    }

    /**
     * Same as native setInterval, but will be cleared automatically on destroy
     * @param fn
     * @param delay
     * @returns {Number}
     * @internal
     */
    setInterval(fn, delay) {
        const intervalId = setInterval(fn, delay);

        (this.intervalIds || (this.intervalIds = new Set())).add(intervalId);

        globalDelays && globalDelays.intervals.set(intervalId, { fn, delay });

        return intervalId;
    }

    /**
     * Relays to native requestAnimationFrame and adds to tracking to have call automatically canceled on destroy.
     * @param {Function} fn
     * @param {Object[]} [extraArgs] The argument list to append to those passed to the function.
     * @param {Object} [thisObj] `this` reference for the function.
     * @returns {Number}
     * @internal
     */
    requestAnimationFrame(fn, extraArgs = [], thisObj = this) {
        const
            animationFrameIds = this.animationFrameIds || (this.animationFrameIds = new Set()),
            frameId           = requestAnimationFrame(() => {
                globalDelays && globalDelays.animationFrames.delete(frameId);
                animationFrameIds.delete(frameId);
                return fn.apply(thisObj, extraArgs);
            });

        animationFrameIds.add(frameId);

        globalDelays && globalDelays.animationFrames.set(frameId, { fn, extraArgs, thisObj });

        return frameId;
    }

    /**
     * Creates a function which will execute once, on the next animation frame. However many time it is
     * called in one event run, it will only be scheduled to run once.
     * @param {Function|String} fn The function to call, or name of function in this object to call.
     * @param {Object[]} [args] The argument list to append to those passed to the function.
     * @param {Object} [thisObj] `this` reference for the function.
     * @param {Boolean} [cancelOutstanding] Cancel any outstanding queued invocation upon call.
     * @internal
     */
    createOnFrame(fn, args = [], thisObj = this, cancelOutstanding) {
        let rafId;

        const result = (...callArgs) => {
            // Cancel if outstanding if requested
            if (rafId && cancelOutstanding) {
                this.cancelAnimationFrame(rafId);
                rafId = null;
            }
            if (!rafId) {
                rafId = this.requestAnimationFrame(() => {
                    if (typeof fn === 'string') {
                        fn = thisObj[fn];
                    }
                    rafId = null;
                    callArgs.push(...args);
                    fn.apply(thisObj, callArgs);
                });
            }
        };

        result.cancel = () => this.cancelAnimationFrame(rafId);

        return result;
    }

    /**
     * Relays to native cancelAnimationFrame and removes from tracking.
     * @param {Number} handle
     * @internal
     */
    cancelAnimationFrame(handle) {
        cancelAnimationFrame(handle);

        this.animationFrameIds && this.animationFrameIds.delete(handle);

        globalDelays && globalDelays.animationFrames.delete(handle);
    }

    async nextAnimationFrame() {
        return new Promise(resolve => this.requestAnimationFrame(resolve));
    }

    /**
     * Wraps a function with another function that delays it specified amount of time, repeated calls to the wrapper
     * resets delay.
     * @param {Function|String} fn The function to call. If this is a string, it is looked up as a method on `this`
     * instance (or `options.thisObj` instead, if provided).
     * @param {Object|Number} options The delay in milliseconds or an options object.
     * @param {Number} options.delay The delay in milliseconds.
     * @param {Array} [options.appendArgs] The argument list to append to those passed to the function.
     * @param {Object} [options.thisObj] The `this` reference for the function.
     * @returns {Function} Wrapped function to call.
     * @internal
     */
    buffer(fn, options) {
        let delay = options;

        if (options && typeof options !== 'number') {  // if (config object)
            delay = options.delay;
        }
        else {
            options = null;
        }

        const
            bufferWrapFn = (...params) => {
                if (bufferWrapFn.suspended) {
                    return;
                }

                const { delay } = bufferWrapFn;

                bufferWrapFn.cancel();
                bufferWrapFn.called = false;
                bufferWrapFn.args = params;

                // If delay=0, the buffer has been disabled so always call immediately.
                if (bufferWrapFn.immediate || !delay) {
                    invoker();
                }
                else {
                    bufferWrapFn.timerId = this.setTimeout(invoker, delay);
                }
            },

            invoker = makeInvoker(this, fn, bufferWrapFn, options);

        bufferWrapFn.delay = delay;

        return decorateWrapFn(this, bufferWrapFn);
    }

    /**
     * Returns a function that when called will schedule a call to `fn` on the next animation frame.
     *
     * @param {Function|String} fn The function to call. If this is a string, it is looked up as a method on `this`
     * instance (or `options.thisObj` instead, if provided).
     * @param {Boolean|Object} [options] An options object or the `cancelOutstanding` boolean property of it.
     * @param {Boolean} [options.cancelOutstanding] Pass `true` to cancel any pending animation frame requests and
     * schedule a new one on each call to the returned function.
     * @param {Array} [options.appendArgs] The argument list to append to those passed to the function.
     * @param {Object} [options.thisObj] The `this` reference for the function.
     * @returns {Function}
     * @internal
     */
    raf(fn, options) {
        // NOTE: This method is only intended for use with `delayable`. It has a signature that is compatible
        // with `buffer()` and `throttle()`. The name is 'raf' to make the following aesthetically pleasing:
        //
        //  class Foo extends Delayable() {
        //      static get delayable() {
        //          return {
        //              bar : 'raf'
        //          };
        //      }
        //  }

        let cancelOutstanding = options;

        if (options && typeof options !== 'boolean') {  // if (config object)
            cancelOutstanding = options.cancelOutstanding;
        }
        else {
            options = null;
        }

        const
            rafWrapFn = (...params) => {
                if (rafWrapFn.suspended) {
                    return;
                }

                // Reschedule the frame on each call if requested
                if (rafWrapFn.cancelOutstanding) {
                    rafWrapFn.cancel();
                }

                rafWrapFn.called = false;
                rafWrapFn.args = params;

                if (rafWrapFn.immediate) {
                    invoker();
                }
                else if (!rafWrapFn.isPending) {
                    rafWrapFn.timerId = this.requestAnimationFrame(invoker);
                }
            },

            invoker = makeInvoker(this, fn, rafWrapFn, options);

        rafWrapFn.cancelOutstanding = cancelOutstanding;

        return decorateWrapFn(this, rafWrapFn, 'cancelAnimationFrame');
    }

    /**
     * Create a "debounced" function which will call on the "leading edge" of a timer period.
     * When first invoked will call immediately, but invocations after that inside its buffer
     * period will be rejected, and *one* invocation will be made after the buffer period has expired.
     *
     * This is useful for responding immediately to a first mousemove, but from then on, only
     * calling the action function on a regular timer while the mouse continues to move.
     *
     * @param {Function|String} fn The function to call. If this is a string, it is looked up as a method on `this`
     * instance (or `options.thisObj` instead, if provided).
     * @param {Number|Object} options The milliseconds to wait after each execution before another execution takes place
     * or a object containing options.
     * @param {Object} [options.thisObj] `this` reference for the function.
     * @param {Array} [options.appendArgs] The argument list to append to those passed to the function.
     * @param {Function|String} [options.throttled] A function to call when the invocation is delayed due to buffer
     * time not having expired. If this is a string, it is looked up as a method on `this` instance (or `options.thisObj`
     * instead, if provided). When called, the same arguments are passed as would have been passed to `fn`, including
     * any `options.appendArgs`.
     * @internal
     */
    throttle(fn, options) {
        let delay = options,
            throttled;

        if (options && typeof options !== 'number') {  // if (config object)
            delay = options.delay;
            throttled = options.throttled;
        }
        else {
            options = null;
        }

        const
            me = this,

            throttleWrapFn = (...args) => {
                if (throttleWrapFn.suspended) {
                    return;
                }

                const
                    { delay } = throttleWrapFn,
                    elapsed = performance.now() - throttleWrapFn.lastCallTime;

                throttleWrapFn.args = args;

                // If it's been more then the delay period since we invoked, we can call it now.
                // Setting delay=0 effectively disables the throttle (which is the goal)
                if (throttleWrapFn.immediate || elapsed >= delay) {
                    me.clearTimeout(throttleWrapFn.timerId);
                    invoker();
                }
                else {
                    // Kick off a timer for the requested period.
                    if (!throttleWrapFn.isPending) {
                        throttleWrapFn.timerId = me.setTimeout(invoker, delay - elapsed);
                        throttleWrapFn.called = false;
                    }

                    if (throttled) {
                        // Args have to be stored on the wrapFn for the invoker to pick them up:
                        throttled.wrapFn.args = args;
                        throttled();
                    }
                }
            },

            invoker = makeInvoker(me, fn, throttleWrapFn, options);

        throttleWrapFn.delay = delay;

        if (throttled) {
            // Make an invoker for this callback to handle thisObj and typeof=string etc (pass a dud wrapFn):
            throttled = makeInvoker(me, throttled, () => {}, options);
        }

        return decorateWrapFn(me, throttleWrapFn);
    }

    static setupDelayable(cls) {
        cls.setupDelayableMethods(cls.delayable);
    }

    /**
     * This method initializes the `delayable` methods on this class.
     * @param {Object} delayable The `delayable` property.
     * @param {Function} [cls] This parameter will be used internally to process static methods.
     * @private
     */
    static setupDelayableMethods(delayable, cls = null) {
        const
            me = this,
            statics = delayable.static,
            target = cls || me.prototype;

        if (statics) {
            //<debug>
            if (cls) {
                throw new Error(`[${this.name}.delayable] Unexpected "static" property`);
            }
            //</debug>

            // TODO me.setupDelayableMethods(statics, me);
            delete delayable.static;
        }

        for (const name in delayable) {
            let options = delayable[name];
            const
                implName = name + 'Now',
                type = typeof options;

            target[implName] = target[name];

            if (type === 'number') {
                options = {
                    type  : 'buffer',
                    delay : options
                };
            }
            else if (type === 'string') {
                options = {
                    type : options
                };
            }

            //<debug>
            if (cls) {
                // TODO add support for static buffered methods (a bit of refactoring needed on the underlying timer
                //  methods since they only work for instances).
                continue;
            }
            //</debug>

            // For instance methods, we place a getter on the prototype. When the method is first accessed from the
            // prototype, we create an instance-specific version by calling this.buffer()/throttle() (based on the type
            // desired) and set that as the instance-level property.
            defineProperty(target, name, {
                get() {
                    const value = this[options.type]((...params) => {
                        this[implName](...params);
                    }, options);

                    defineProperty(this, name, { value });

                    return value;
                }
            });
        }
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement thus.
    get widgetClass() {}
};
