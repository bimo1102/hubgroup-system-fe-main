
/**
 * @module Core/helper/AsyncHelper
 */

/**
 * A helper class to make asynchronous tasks `await` friendly.
 */
export default class AsyncHelper {
    /**
     * Returns a promise that resolves on next animation frame.
     * ```
     *  async method() {
     *      // do work
     *      await AsyncHelper.animationFrame();
     *      // do more work
     *  }
     * ```
     * @returns {Promise}
     */
    static animationFrame() {
        return new Promise(resolve => {
            requestAnimationFrame(resolve);
        });
    }

    /**
     * Returns a promise that resolves after a specified number of milliseconds.
     * ```
     *  async method() {
     *      await AsyncHelper.sleep(10);
     *      // ...
     *  }
     * ```
     * @param {Number} millis The number of milliseconds to sleep.
     * @returns {Promise}
     */
    static sleep(millis) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, millis);
        });
    }

    /**
     * Returns a promise that resolves as soon as possible, allowing the browser to minimally process other messages.
     * This is the shortest possible delay the browser offers, so be aware that it does not necessarily allow the
     * browser to paint or reflow if used in a long loop. It does, however, allow other async methods to execute.
     * ```
     *  async method() {
     *      await AsyncHelper.yield();
     *      // ...
     *  }
     * ```
     * @returns {Promise}
     */
    static yield() {
        return Promise.resolve();
    }
}
