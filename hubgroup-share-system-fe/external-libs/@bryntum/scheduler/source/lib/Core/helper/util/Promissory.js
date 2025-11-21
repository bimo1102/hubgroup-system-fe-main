/**
 * @module Core/helper/util/Promissory
 */

/**
 * Encapsulates a Promise and provides `resolve()` and `reject()` methods.
 *
 * For example:
 * ```
 *  load() {
 *      this.loading = new Promissory();
 *      this.store.load();
 *
 *      return this.loading.promise;
 *  }
 *
 *  onStoreLoad(store, err) {
 *      if (err) {
 *          this.loading.resolve(this);
 *      }
 *      else {
 *          this.loading.reject(err);
 *      }
 *  }
 *
 * ```
 * @private
 */
export default class Promissory {
    constructor(fn) {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });

        if (fn) {
            fn(this);
        }
    }
}
