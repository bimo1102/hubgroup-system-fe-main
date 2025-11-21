/**
 * @module Core/helper/FunctionHelper
 */

const { hasOwnProperty } = Object.prototype;

/**
 * Provides functionality for working with functions
 * @internal
 */
export default class FunctionHelper {
    /**
     * Inserts a function after the specified `method` is called on an `object`. To remove this hook, invoke the
     * function returned by this method.
     * ```
     *  class A {
     *      method() {
     *          console.log('method');
     *      }
     *  }
     *
     *  let instance = new A();
     *
     *  let detach = FunctionHelper.after(instance, 'method', () => { console.log('after') });
     *
     *  instance.method();
     *  > method
     *  > after
     *
     *  detach();
     *  instance.method();
     *  > method
     * ```
     * The value returned by the original method is passed as the first argument to `fn` followed by all the arguments
     * passed by the caller.
     *
     * If `fn` returns a value (not `undefined`), that value is returned from the method call instead of the value
     * returned by the original method.
     * ```
     *  class A {
     *      method(x) {
     *          console.log('method', x);
     *          return x * 2
     *      }
     *  }
     *
     *  let instance = new A();
     *
     *  let detach = FunctionHelper.after(instance, 'method', (ret, x) => {
     *      console.log('after', ret, x);
     *      return x / 2;
     *  });
     *
     *  console.log(instance.method(50));
     *  > method 50
     *  > after 100 50
     *  > 25
     *
     *  detach();
     *  console.log(instance.method(50));
     *  > method 50
     *  > 100
     * ```
     *
     * @param {Object} object The object to hook.
     * @param {String} method The name of the method on `object` to hook.
     * @param {Function|String} fn The function or method name (on `thisObj`) to call after `method`.
     * @param {Object} [thisObj] The `this` pointer value for calling `fn`.
     * @param {Object} [options] Additional options
     * @param {Boolean} [options.return=true] Specify `false` to not include the return value of the hooked method as
     * the first argument to `fn`.
     * @returns {Function} The function to call to remove the hook.
     */
    static after(object, method, fn, thisObj, options) {
        const
            named = typeof fn === 'string',
            withReturn = options?.return !== false,
            hook = (...args) => {
                const
                    // if object.destroy() occurs, our hook will be removed, so this fn won't be called in that case
                    origResult = hook.$nextHook.call(object, ...args),
                    hookResult = thisObj?.isDestroyed ? undefined : (withReturn
                        ? (named ? thisObj[fn](origResult, ...args) : fn.call(thisObj, origResult, ...args))
                        : (named ? thisObj[fn](...args) : fn.call(thisObj, ...args))
                    );

                return (hookResult === undefined) ? origResult : hookResult;
            };

        return FunctionHelper.hookMethod(object, method, hook);
    }

    /**
     * Inserts a function before the specified `method` is called on an `object`. To remove this hook, invoke the
     * function returned by this method.
     * ```
     *  class A {
     *      method() {
     *          console.log('method');
     *      }
     *  }
     *
     *  let instance = new A();
     *
     *  let detach = FunctionHelper.before(instance, 'method', () => { console.log('before') });
     *
     *  instance.method();
     *  > before
     *  > method
     *
     *  detach();
     *  instance.method();
     *  > method
     * ```
     * If `fn` returns `false`, the original method is not invoked and `false` is returned to the caller.
     * ```
     *  class A {
     *      method(x) {
     *          console.log('method', x);
     *          return x * 2;
     *      }
     *  }
     *
     *  let instance = new A();
     *
     *  let detach = FunctionHelper.before(instance, 'method', x => {
     *      console.log('before', x);
     *      return false;
     *  });
     *
     *  console.log(instance.method(50));
     *  > before 50
     *  > false
     *
     *  detach();
     *  console.log(instance.method(50));
     *  > method 50
     *  > 100
     * ```
     *
     * @param {Object} object The object to hook.
     * @param {String} method The name of the method on `object` to hook.
     * @param {Function|String} fn The function or method name (on `thisObj`) to call before `method`.
     * @param {Object} [thisObj] The `this` pointer value for calling `fn`.
     * @returns {Function} The function to call to remove the hook.
     */
    static before(object, method, fn, thisObj) {
        const
            named = typeof fn === 'string',
            hook = (...args) => {
                const ret = (thisObj?.isDestroyed
                    ? 0
                    : (named ? thisObj[fn](...args) : fn.call(thisObj, ...args))
                );

                return (ret === false) ? ret : hook.$nextHook.call(object, ...args);
            };

        return FunctionHelper.hookMethod(object, method, hook);
    }

    static curry(func) {
        return function curried(...args) {
            if (args.length >= func.length) {
                return func.apply(this, args);
            }
            else {
                return function(...args2) {
                    return curried.apply(this, args.concat(args2));
                };
            }
        };
    }

    static bindAll(obj) {
        for (const key in obj) {
            if (typeof obj[key] === 'function') {
                obj[key] = obj[key].bind(obj);
            }
        }
    }

    /**
     * Returns a function which calls the passed `interceptor` function first, and the passed `original` after
     * as long as the `interceptor` does not return `false`.
     * @param {Function} original The function to call second.
     * @param {Function} interceptor The function to call first.
     * @param {Object} [thisObj] The `this` reference when the functions are called.
     * @returns The return value from the `original` function **if it was called**, else `false`.
     */
    static createInterceptor(original, interceptor, thisObj) {
        return (...args) => {
            if (interceptor.call(thisObj, ...args) !== false) {
                return original.call(thisObj, ...args);
            }
            return false;
        };
    }

    /**
     * Returns a function which calls the passed `sequence` function after calling
     * the passed `original`.
     * @param {Function} original The function to call first.
     * @param {Function} sequence The function to call second.
     * @param {Object} [thisObj] The `this` reference when the functions are called.
     * @returns The value returned from the sequence if it returned a value, else the return
     * value from the original function.
     */
    static createSequence(original, sequence, thisObj) {
        return (...args) => {
            const origResult = original.call(thisObj, ...args),
                sequenceResult = sequence.call(thisObj, ...args);

            return (sequenceResult === undefined) ? origResult : sequenceResult;
        };
    }

    /**
     * Create a "debounced" function which will call on the "leading edge" of a timer period.
     * When first invoked will call immediately, but invocations after that inside its buffer
     * period will be rejected, and *one* invocation will be made after the buffer period has expired.
     *
     * This is useful for responding immediately to a first mousemove, but from then on, only
     * calling the action function on a regular timer while the mouse continues to move.
     *
     * @param {Function} fn The function to call.
     * @param {Number} buffer The milliseconds to wait after each execution before another execution takes place.
     * @param {Object} [thisObj] `this` reference for the function.
     * @param {Array} [extraArgs] The argument list to append to those passed to the function.
     * @param {Function} [alt] A function to call when the invocation is rejected due to buffer time not having expired.
     */
    static createThrottled(fn, buffer, thisObj, extraArgs, alt) {
        let lastCallTime = -Number.MAX_VALUE,
            callArgs,
            timerId;

        const
            invoke = () => {
                timerId = 0;
                lastCallTime = performance.now();
                callArgs.push.apply(callArgs, extraArgs);
                fn.apply(thisObj, callArgs);
            },
            result = function(...args) {
                const elapsed = performance.now() - lastCallTime;

                callArgs = args;

                // If it's been more then the buffer period since we invoked, we can call it now
                if (elapsed >= buffer) {
                    clearTimeout(timerId);
                    invoke();
                }
                // Otherwise, kick off a timer for the requested period.
                else {
                    if (!timerId) {
                        timerId = setTimeout(invoke, buffer - elapsed);
                    }
                    if (alt) {
                        callArgs.push.apply(callArgs, extraArgs);
                        alt.apply(thisObj, callArgs);
                    }
                }
            };

        result.cancel = () => clearTimeout(timerId);

        return result;
    }

    /**
     * Create a "debounced" function which will call on the "trailing edge" of a timer period.
     * When first invoked will wait until the buffer period has expired to call the function, and
     * more calls within that time will restart the timer.
     *
     * This is useful for responding to keystrokes, but deferring action until the user pauses typing.
     *
     * @param {Function} fn The function to call.
     * @param {Number} buffer The milliseconds to wait after each execution before another execution takes place.
     * @param {Object} [thisObj] `this` reference for the function.
     * @param {Array} [args] The argument list to append to those passed to the function.
     */
    static createBuffered(fn, buffer, thisObj, args) {
        let callArgs,
            timerId;

        const
            invoke = () => {
                timerId = 0;
                result.isPending = false;
                callArgs.push.apply(callArgs, args);
                fn.apply(thisObj, callArgs);
            },
            result = function(...args) {
                callArgs = args;

                // Cancel any impending invocation. It's pushed out for <buffer> ms from each call
                if (timerId) {
                    clearTimeout(timerId);
                }

                result.isPending = true;

                timerId = setTimeout(invoke, buffer);
            };

        result.cancel = () => {
            result.isPending = false;
            clearTimeout(timerId);
        };

        return result;
    }

    static hookMethod(object, method, hook) {
        hook.$nextHook = object[method];
        object[method] = hook;

        return () => {
            // Object will have no hooks on the instance if it is destroyed (perhaps other reasons too)
            if (hasOwnProperty.call(object, method)) {
                let f = object[method],
                    next;

                if (f === hook) {
                    // When this is the outermost hook, we may be the last hook. If $nextHook is found on the object's
                    // prototype, simply delete the slot to expose it. Otherwise, there's another hook, so make it the
                    // outermost.
                    if (Object.getPrototypeOf(object)?.[method] === hook.$nextHook) {
                        delete object[method];
                    }
                    else {
                        object[method] = hook.$nextHook;
                    }
                }
                else {
                    // Not being the outermost hook means we have outer hooks that should chain to the one we want to
                    // remove. Be cautious because the object could be destroyed.
                    for (; (next = f?.$nextHook); f = next) {
                        if (next === hook) {
                            f.$nextHook = hook.$nextHook;
                            break;
                        }
                    }
                }
            }
        };
    }

    /**
     * Protects the specified `method` on a given `object` such that calling it will not throw exceptions.
     * @param {Object} object The object whose method is to be protected.
     * @param {String} method The name of the method to protect.
     * @param {Function} [handler] An optional function to call for any thrown exceptions.
     * @internal
     */
    static noThrow(object, method, handler) {
        const fn = object[method];

        object[method] = (...args) => {
            try {
                return fn.apply(object, args);
            }
            catch (e) {
                return handler?.(e);
            }
        };
    }

    static returnTrue() {
        return true;
    }

    static animate(duration, fn, thisObj, easing = 'linear') {
        let cancel = false;

        const result = new Promise(resolve => {
            const start = performance.now(),
                iterate = () => {
                    const progress = Math.min((performance.now() - start) / duration, 1),
                        delayable = thisObj && thisObj.setTimeout ? thisObj : window;

                    if (!cancel) {
                        if (fn.call(thisObj, this.easingFunctions[easing](progress)) === false) {
                            resolve();
                        }
                    }
                    if (cancel || progress === 1) {
                        // Push resolution into the next animation frame so that
                        // this frame completes before the resolution handler runs.
                        delayable.requestAnimationFrame(() => resolve());
                    }
                    else {
                        delayable.requestAnimationFrame(iterate);
                    }
                };

            iterate();
        });

        result.cancel = () => {
            cancel = true;
            return false;
        };

        return result;
    }
}

/* eslint-disable */
const half = 0.5, e1 = 1.70158, e2 = 7.5625, e3 = 1.525, e4 = 2/2.75, e5 = 2.25/2.75, e6 = 1/2.75, e7 = 1.5/2.75, e8 = 2.5/2.75, e9 = 2.625/2.75, e10 = 0.75, e11 = 0.9375, e12 = 0.984375, s1 = 1.70158, s2 = 1.70158;
FunctionHelper.easingFunctions = {
    linear         : t => t,
    easeInQuad     : t => Math.pow(t,2),
    easeOutQuad    : t => -(Math.pow((t-1),2)-1),
    easeInOutQuad  : t => (t/=half)<1 ? half*Math.pow(t,2) : -half*((t-=2)*t-2),
    easeInCubic    : t => Math.pow(t,3),
    easeOutCubic   : t => Math.pow((t-1),3)+1,
    easeInOutCubic : t => (t/=half)<1 ? half*Math.pow(t,3) : half*(Math.pow((t-2),3)+2),
    easeInQuart    : t => Math.pow(t,4),
    easeOutQuart   : t => -(Math.pow((t-1),4)-1),
    easeInOutQuart : t => (t/=half)<1 ? half*Math.pow(t,4) : -half*((t-=2)*Math.pow(t,3)-2),
    easeInQuint    : t => Math.pow(t,5),
    easeOutQuint   : t => (Math.pow((t-1),5)+1),
    easeInOutQuint : t => (t/=half)<1 ? half*Math.pow(t,5) : half*(Math.pow((t-2),5)+2),
    easeInSine     : t => -Math.cos(t*(Math.PI/2))+1,
    easeOutSine    : t => Math.sin(t*(Math.PI/2)),
    easeInOutSine  : t => -half*(Math.cos(Math.PI*t)-1),
    easeInExpo     : t => t===0 ? 0 : Math.pow(2,10*(t-1)),
    easeOutExpo    : t => t===1 ? 1 : -Math.pow(2,-10*t)+1,
    easeInOutExpo  : t => (t===0) ? 0 : (t===1) ? 1 : ((t/=half)<1) ? half*Math.pow(2,10*(t-1)) : half*(-Math.pow(2,-10*--t)+2),
    easeInCirc     : t => -(Math.sqrt(1-(t*t))-1),
    easeOutCirc    : t => Math.sqrt(1-Math.pow((t-1),2)),
    easeInOutCirc  : t => (t/=half)<1 ? -half*(Math.sqrt(1-t*t)-1) : half*(Math.sqrt(1-(t-=2)*t)+1),
    easeOutBounce  : t => ((t)<e6) ? (e2*t*t) : (t<e4) ? (e2*(t-=e7)*t+e10) : (t<e8) ? (e2*(t-=e5)*t+e11) : (e2*(t-=e9)*t+e12),
    easeInBack     : t => (t)*t*((e1+1)*t-e1),
    easeOutBack    : t => (t=t-1)*t*((e1+1)*t+e1)+1,
    easeInOutBack  : t => {
        let v1 = s1;
        return ((t/=half)<1) ? half*(t*t*(((v1*=(e3))+1)*t -v1)) : half*((t-=2)*t*(((v1*=(e3))+1)*t+v1)+2);
    },
    elastic        : t => -1*Math.pow(4,-8*t)*Math.sin((t*6-1)*(2*Math.PI)/2)+1,
    swingFromTo    : t => {
        let v2 = s2;
        return ((t/=half)<1) ? half*(t*t*(((v2*=(e3))+1)*t-v2)) : half*((t-=2)*t*(((v2*=(e3))+1)*t+v2)+2);
    },
    swingFrom      : t => t*t*((e1+1)*t-e1),
    swingTo        : t => (t-=1)*t*((e1+1)*t+e1)+1,
    bounce         : t => (t<e6) ? (e2*t*t) : (t<e4) ? (e2*(t-=e7)*t+e10) : (t<e8) ? (e2*(t-=e5)*t+e11) : (e2*(t-=e9)*t+e12),
    bouncePast     : t => (t<e6) ? (e2*t*t) : (t<e4) ? 2-(e2*(t-=e7)*t+e10) : (t<e8) ? 2-(e2*(t-=e5)*t+e11) : 2-(e2*(t-=e9)*t+e12),
    easeFromTo     : t => (t/=half)<1 ? half*Math.pow(t,4) : -half*((t-=2)*Math.pow(t,3)-2),
    easeFrom       : t => Math.pow(t,4),
    easeTo         : t => Math.pow(t,0.25)
};
