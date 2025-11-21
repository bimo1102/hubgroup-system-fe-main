import Base from '../../Base.js';
import ObjectHelper from '../../helper/ObjectHelper.js';

/**
 * @module Core/data/mixin/StoreSearch
 */

const
    stringFound = (value, find) => String(value).toLowerCase().indexOf(find) !== -1,
    comparisons = {
        string  : stringFound,
        number  : stringFound,
        boolean : stringFound,
        date    : (value, find) => {
            if (value instanceof Date && find instanceof Date) {
                return String(value) === String(find);
            }
            return String(value.getMonth() + 1).indexOf(find) !== -1 ||
                String(value.getDate()).indexOf(find) !== -1 ||
                String(value.getFullYear()).indexOf(find) !== -1;
        }
    };

/**
 * Mixin for Store that handles searching (multiple records) and finding (single record).
 *
 * @example
 * // find all records that has a field containing the string john
 * let hits = store.search('john');
 *
 * @mixin
 */
export default Target => class StoreSearch extends (Target || Base) {
    static get $name() {
        return 'StoreSearch';
    }

    //region Search (multiple hits)

    /**
     * Find all hits matching the specified input
     * @param {String} find Value to search for
     * @param {Object[]} fields Fields to search value in
     * @returns {Object[]} Array of hits, in the format { index: x, data: record }
     * @category Search
     */
    search(find, fields = null) {
        const
            records = this.storage.values,
            len     = records.length,
            found   = [];

        if (find == null) {
            return null;
        }

        if (typeof find === 'string') {
            find = String(find).toLowerCase();
        }

        let i,
            record,
            value,
            valueType,
            comparison;

        for (i = 0; i < len; i++) {
            record = records[i];
            for (const key of fields || record.fieldNames) {
                value      = record[key];
                valueType  = (value instanceof Date) ? 'date' : typeof value;
                comparison = comparisons[valueType];

                if (value && comparison && comparison(value, find)) {
                    found.push({
                        index : i,
                        data  : record,
                        field : key,
                        id    : record.id
                    });
                }
            }
        }

        return found;
    }

    /**
     * Find all hits in a column
     * @param {String} field The store field to search in
     * @param {*} value Value to search for
     * @returns {*} Array of hits, in the format { index: x, data: record }
     * @category Search
     */
    findByField(field, value) {
        let records = this.storage.values,
            i,
            len     = records.length,
            record,
            found   = [],
            fieldValue;

        if (value !== null && value !== undefined) {
            value = String(value).toLowerCase();
        }

        for (i = 0; i < len; i++) {
            record     = records[i];
            fieldValue = record[field];

            const
                type = fieldValue instanceof Date ? 'date' : typeof fieldValue,
                comparison = {
                    date      : () => Boolean(fieldValue) && fieldValue.toLocaleString().includes(value),
                    string    : () => Boolean(fieldValue) && fieldValue.toLowerCase().includes(value),
                    number    : () => typeof fieldValue === 'number' && fieldValue.toString().includes(value),
                    object    : () => fieldValue === value, // typeof null === object
                    undefined : () => fieldValue === value
                };

            if (((value === null || value === undefined) && fieldValue === value) || value && comparison[type]()) {
                found.push({
                    id    : record.id,
                    index : i,
                    data  : record
                });
            }
        }

        return found;
    }

    //endregion

    //region Find (single hit)

    /**
     * Finds the first record for which the specified function returns true
     * @param {Function} fn Comparison function, called with record as parameter
     * @param {Boolean} [searchAllRecords] True to ignore any applied filters when searching
     * @returns {Core.data.Model} Record or undefined if none found
     *
     * @example
     * store.find(record => record.color === 'blue');
     * @category Search
     */
    find(fn, searchAllRecords = false)  {
        let records = searchAllRecords ? this.storage.allValues : this.storage.values;

        if (this.isGrouped) {
            records = this.collectGroupRecords(searchAllRecords, false);
        }

        return records.find(fn);
    }

    /**
     * Finds the first record for which the specified field has the specified value
     * @param {String} fieldName Field name
     * @param {*} value Value to find
     * @param {Boolean} [searchAllRecords] True to ignore any applied filters when searching
     * @returns {Core.data.Model} Record or undefined if none found
     * @category Search
     */
    findRecord(fieldName, value, searchAllRecords = false) {
        const matchFn = r => ObjectHelper.isEqual(r[fieldName], value);

        if (this.tree) {
            return this.query(matchFn)[0];
        }
        return (searchAllRecords ? this.storage.allValues : this.storage.values).find(matchFn);
    }

    /**
     * Searches the Store records using the passed function.
     * @param {Function} fn A function that is called for each record. Return true to indicate a match
     * @param {Boolean} [searchAllRecords] True to ignore any applied filters when searching
     * @returns {Core.data.Model[]} An array of the matching Records
     * @category Search
     */
    query(fn, searchAllRecords = false) {
        let records = searchAllRecords ? this.storage.allValues : this.storage.values;

        if (this.isTree) {
            const matches = [];

            this.traverse((node) => {
                if (fn(node)) {
                    matches.push(node);
                }
            }, undefined, undefined, searchAllRecords);
            return matches;
        }
        else if (this.isGrouped) {
            records = this.collectGroupRecords(searchAllRecords, false);
        }

        return records.filter(fn);
    }
    //endregion

    //region Others

    /**
     * Returns true if the supplied function returns true for any record in the store
     * @param {Function} fn A function that should return true to indicate a match
     * @param {Boolean} [searchAllRecords] True to ignore any applied filters when searching
     * @returns {Boolean}
     *
     * @example
     * store.some(record => record.age > 95); // true if any record has age > 95
     * @category Search
     */
    some(fn, searchAllRecords = false) {
        let records = searchAllRecords ? this.storage.allValues : this.storage.values;

        if (this.isGrouped) {
            records = this.collectGroupRecords(searchAllRecords, false);
        }

        return records.some(fn);
    }

    //endregion
};
