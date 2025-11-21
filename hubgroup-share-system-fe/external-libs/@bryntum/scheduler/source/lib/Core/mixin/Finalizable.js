import Base from '../Base.js';

/**
 * @module Core/mixin/Finalizable
 */

/**
 * This mixin provides an asynchronous completion mechanism. This allows a process to coordinate its async actions
 * (such as Ajax requests or user interaction) with cleanup.
 *
 * Consider a context tracking helper class, for example:
 * ```
 *  class Context extends Base.mixin(Finalizable) {
 *      // ...
 *
 *      async finish() {
 *          this.owner.trigger('finish', {
 *              context : this
 *          });
 *
 *          // Wait for any scheduled finalizer to run...
 *          await this.finalize();
 *      }
 *
 *      doFinalize() {
 *          this.destroy();
 *      }
 *  }
 * ```
 *
 * When the `finish` event is processed, the receiver can register a promise for whatever processing it would like to
 * perform:
 * ```
 *  class Foo {
 *      onFinish({ context }) {
 *          context.finalizer = this.askUser(context);
 *      }
 *
 *      async askUser(context) {
 *          //
 *      }
 *  }
 * ```
 * @mixin
 * @internal
 */
export default Target => class Finalizable extends (Target || Base) {
    static get $name() {
        return 'Finalizable';
    }

    construct(...args) {
        super.construct(...args);

        /**
         * This property can be set any time prior to calling {@link #function-finalize} (i.e., when the
         * {@link #property-isFinalizing} property goes to `true`). When set, this instance will `await` this
         * promise before completing the finalization process by calling {@link #function-doFinalize}.
         * @member {Promise} finalizer
         */
        this.finalizer = null;

        /**
         * This property holds the `Promise` that will resolve when {@link #function-finalize} has completed. It is
         * set when {@link #function-finalize} is called and cleared on return.
         * @member {Boolean} finalizing
         * @readonly
         * @private
         */
        this.finalizing = null;

        /**
         * This property is `true` once the instance completes the {@link #function-finalize} method.
         * @member {Boolean} isFinalized
         * @readonly
         */
        this.isFinalized = false;

        /**
         * This property is set to `true` when {@link #function-finalize} is called.
         * @member {Boolean} isFinalizing
         * @readonly
         */
        this.isFinalizing = false;
    }

    /**
     * This template method is called at the end of {@link #function-finalize}. By default it calls `destroy()`, but
     * can be replaced by the derived class. This can be useful if it is not the `Finalizable` instance that awaits
     * the {@link #function-finalize} method.
     */
    doFinalize() {
        this.destroy();
    }

    /**
     * This method is called (typically by this instance or its owner) to cleanup this instance while possibly first
     * waiting for the {@link #property-finalizer} promise to settle. Once settled, the {@link #function-doFinalize}
     * method is called.
     * @async
     */
    finalize() {
        const me = this;

        let ret = me.finalizing;

        if (!ret && !me.isFinalized) {
            me.isFinalizing = true;  // note: we never clear this flag (use isFinalized to know if we're done)
            // If we are called during finalization, we want to return the same promise, so we cache it away.
            me.finalizing = ret = me._awaitFinalizer();
        }

        return ret;
    }

    async _awaitFinalizer() {
        const me = this;

        try {
            await me.finalizer;
        }
        finally {
            // be sure we clean up even if an exception is thrown by the finalizer...

            me.finalizing = null;
            me.isFinalized = true;

            me.doFinalize();
        }
    }
};
