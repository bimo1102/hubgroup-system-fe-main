import Base from '../../../Core/Base.js';
import StringHelper from '../../../Core/helper/StringHelper.js';

/**
 * @module Scheduler/crud/encoder/JsonEncoder
 */

/**
 * Implements data encoding functional that should be mixed to a {@link Scheduler.crud.AbstractCrudManager} sub-class.
 * Uses _JSON_ as an encoding system.
 *
 * @example
 * // create a new CrudManager using AJAX as a transport system and JSON for encoding
 * class MyCrudManager extends JsonEncode(AjaxTransport(AbstractCrudManager)) {}
 *
 * @mixin
 */
export default Target => class JsonEncoder extends (Target || Base) {
    static get $name() {
        return 'JsonEncoder';
    }

    static get defaultConfig() {
        return {
            /**
             * Configuration of the JSON encoder used by the _Crud Manager_.
             *
             * @config {Object}
             * @property {Object} encoder.requestData Static data to send with the data request.
             *
             * ```js
             * new CrudManager({
             *     // add static "foo" property to all requests data
             *     encoder : {
             *         requestData : {
             *             foo : 'Bar'
             *         }
             *     },
             *     ...
             * });
             * ```
             *
             * The above snippet will result adding "foo" property to all requests data:
             *
             * ```json
             *     {
             *         "requestId"   : 756,
             *         "type"        : "load",
             *
             *         "foo"         : "Bar",
             *
             *         "stores"      : [
             *             ...
             * ```
             */
            encoder : {}
        };
    }

    /**
     * Encodes a request object to _JSON_ encoded string. If encoding fails (due to circular structure), it returns null.
     * Supposed to be overridden in case data provided by the _Crud Manager_ has to be transformed into format requested by server.
     * @param {Object} requestData The request to encode.
     * @returns {String} The encoded request.
     */
    encode(requestData) {
        requestData = Object.assign({}, this.encoder?.requestData, requestData);

        return StringHelper.safeJsonStringify(requestData);
    }

    /**
     * Decodes (parses) a _JSON_ response string to an object. If parsing fails, it returns null.
     * Supposed to be overridden in case data provided by server has to be transformed into format requested by the _Crud Manager_.
     * @param {String} responseText The response text to decode.
     * @returns {Object} The decoded response.
     */
    decode(responseText) {
        return StringHelper.safeJsonParse(responseText);
    }
};
