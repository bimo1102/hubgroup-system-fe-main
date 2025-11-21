/**
 * @module Scheduler/crud/mixin/AbstractCrudManagerValidation
 */

/**
 * Mixin proving responses validation API to Crud Manager.
 * @mixin
 */
export default Target => class AbstractCrudManagerValidation extends Target {

    static get $name() {
        return 'AbstractCrudManagerValidation';
    }

    static get configurable() {
        return {
            /**
             * Config enabling responses structure validation by the Crud Manager.
             * When the config is `true` the Crud Manager checks every parsed response structure for errors
             * and if found dumps them as warnings to the browser console.
             * The config is intended to help developers implementing backend integration.
             *
             * **Please note that this option is intended for development stage only and is recommended to be disabled in production.**
             * @config {Boolean}
             * @default
             */
            validateResponse : false,

            /**
             * When `true` treats parsed responses without `success` property as successful.
             * In this mode a parsed response is treated as invalid if it has explicitly set `success : false`.
             * @config {Boolean}
             * @default
             */
            skipSuccessProperty : true,

            crudLoadValidationWarningPrefix : 'CrudManager load response error(s):',

            crudSyncValidationWarningPrefix : 'CrudManager sync response error(s):',

            supportShortSyncResponseNote : 'Note: Please consider enabling "supportShortSyncResponse" option to allow less detailed sync responses (https://bryntum.com/docs/scheduler/#Scheduler/crud/AbstractCrudManagerMixin#config-supportShortSyncResponse)',

            disableValidationNote : 'Note: To disable this validation please set the "validateResponse" config to false'
        };
    }

    get crudLoadValidationMandatoryStores() {
        return [];
    }

    getStoreLoadResponseWarnings(storeInfo, responded, expectedResponse) {
        const
            messages        = [],
            { storeId }     = storeInfo,
            mandatoryStores = this.crudLoadValidationMandatoryStores,
            result          = { [storeId] : {} };

        // if the store section is responded
        if (responded) {
            if (!responded.rows) {
                messages.push(`- "${storeId}" store section should have a "rows" property with an array of the store records.`);

                result[storeId].rows = ['...'];
            }
        }
        // if the store is mandatory
        else if (mandatoryStores?.includes(storeId)) {
            messages.push(`- No "${storeId}" store section found. It should contain the store data.`);

            result[storeId].rows = ['...'];
        }

        // extend expected response w/ this store part
        if (messages.length) {
            Object.assign(expectedResponse, result);
        }

        return messages;
    }

    getLoadResponseWarnings(response) {
        const
            messages         = [],
            expectedResponse = {};

        if (!this.skipSuccessProperty) {
            expectedResponse.success = true;
        }

        // iterate stores to check properties validity
        this.forEachCrudStore((store, storeId, storeInfo) => {
            messages.push(...this.getStoreLoadResponseWarnings(storeInfo, response?.[storeId], expectedResponse));
        });

        if (messages.length) {
            messages.push('Please adjust your response to look like this:\n' +
                JSON.stringify(expectedResponse, null, 4).replace(/"\.\.\."/g, '...'));

            messages.push(this.disableValidationNote);
        }

        return messages;
    }

    validateLoadResponse(response) {
        const messages = this.getLoadResponseWarnings(response);

        if (messages.length) {
            console.warn(this.crudLoadValidationWarningPrefix + '\n' + messages.join('\n'));
        }
    }

    getStoreSyncResponseWarnings(storeInfo, requested, responded, expectedResponse) {
        const
            messages         = [],
            missingRows      = [],
            missingRemoved   = [],
            { storeId }      = storeInfo,
            result           = { [storeId] : {} },
            phantomIdField   = storeInfo.phantomIdField || this.phantomIdField,
            { modelClass }   = storeInfo.store,
            idField          = modelClass.getFieldDataSource(modelClass.idField),
            respondedRows    = responded?.rows || [],
            respondedRemoved = responded?.removed || [];

        let showSupportShortSyncResponseNote = false;

        // if added records were passed in the request they should be mentioned in the response
        if (requested?.added) {
            missingRows.push(
                ...requested.added.filter(record => {
                    return !respondedRows.find(row => row[phantomIdField] == record[phantomIdField]) &&
                        !respondedRemoved.find(row => row[phantomIdField] == record[phantomIdField] || row[idField] == record[phantomIdField]);
                }).map(record => ({ [phantomIdField] : record[phantomIdField], [idField] : '...' }))
            );

            if (missingRows.length) {
                const missingIds = missingRows.map(row => '#' + row[phantomIdField]).join(', ');

                messages.push(`- "${storeId}" store "rows" section should mention added record(s) ${missingIds} sent in the request. ` +
                    'It should contain the added records identifiers (both phantom and "real" ones assigned by the backend).');
            }
        }

        // if short responses are enabled
        if (this.supportShortSyncResponse) {
            // if the data is not object, will return error
            if (!missingRows.length && responded) {
                if (typeof responded !== 'object' || Array.isArray(responded)) {
                    messages.push(`- "${storeId}" store section should be an Object.`);
                    result[storeId]['...'] = '...';
                }

                // for request to edit records, if rows is present, it must be an array
                if (responded.rows && !Array.isArray(responded.rows)) {
                    messages.push(`- "${storeId}" store "rows" section should be an array`);
                    missingRows.push('...');
                }

                // removed if presented must be an array
                if (responded.removed && !Array.isArray(responded.removed)) {
                    messages.push(`- "${storeId}" store "removed" section should be an array:`);
                    missingRemoved.push('...');
                }
            }
        }
        // if short responses are disabled
        else {
            // if updated records were passed in the request they should be mentioned in the response
            if (requested?.updated) {
                const missingUpdatedRows = requested.updated.filter(record => !respondedRows.find(row => row[idField] == record[idField]))
                    .map(record => ({ [idField] : record[idField] }));

                missingRows.push(...missingUpdatedRows);

                if (missingUpdatedRows.length) {
                    const missingIds = missingUpdatedRows.map(row => '#' + row[idField]).join(', ');

                    messages.push(`- "${storeId}" store "rows" section should mention updated record(s) ${missingIds} sent in the request. ` +
                        `It should contain the updated record identifiers.`);

                    showSupportShortSyncResponseNote = true;
                }

            }

            if (missingRows.length) {
                missingRows.push('...');
            }

            // if removed records were passed in the request they should be mentioned in the response
            if (requested?.removed) {
                missingRemoved.push(
                    ...requested.removed.filter(record => !respondedRows.find(row => row[idField] == record[idField]))
                        .map(record => ({ [idField] : record[idField] }))
                );

                if (missingRemoved.length) {
                    const missingIds = missingRemoved.map(row => '#' + row[idField]).join(', ');

                    messages.push(`- "${storeId}" store "removed" section should mention removed record(s) ${missingIds} sent in the request. ` +
                        `It should contain the removed record identifiers.`);

                    result[storeId].removed = missingRemoved;
                    missingRemoved.push('...');

                    showSupportShortSyncResponseNote = true;
                }
            }

        }

        if (missingRows.length) {
            result[storeId].rows = missingRows;
        }

        // get rid of store section if no rows/removed there
        if (!messages.length) {
            delete result[storeId];
        }

        // extend expected response w/ this store part
        Object.assign(expectedResponse, result);

        return { messages, showSupportShortSyncResponseNote };
    }

    getSyncResponseWarnings(response, requestDesc) {
        const
            messages         = [],
            expectedResponse = {},
            request          = requestDesc.pack;

        if (!this.skipSuccessProperty) {
            expectedResponse.success = true;
        }

        let showSupportShortSyncResponseNote = false;

        // iterate stores to check properties validity
        this.forEachCrudStore((store, storeId, storeInfo) => {
            const warnings = this.getStoreSyncResponseWarnings(storeInfo, request?.[storeId], response[storeId], expectedResponse);

            showSupportShortSyncResponseNote = showSupportShortSyncResponseNote || warnings.showSupportShortSyncResponseNote;

            messages.push(...warnings.messages);
        });

        if (messages.length) {
            messages.push('Please adjust your response to look like this:\n' +
                JSON.stringify(expectedResponse, null, 4).replace(/"\.\.\.":\s*"\.\.\."/g, ',,,').replace(/"\.\.\."/g, '...'));

            if (showSupportShortSyncResponseNote) {
                messages.push(this.supportShortSyncResponseNote);
            }

            messages.push(this.disableValidationNote);
        }

        return messages;
    }

    validateSyncResponse(response, request) {
        const messages = this.getSyncResponseWarnings(response, request);

        if (messages.length) {
            console.warn(this.crudSyncValidationWarningPrefix + '\n' + messages.join('\n'));
        }
    }
};
