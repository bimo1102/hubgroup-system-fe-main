import Base from '../../Base.js';
import ArrayHelper from '../../helper/ArrayHelper.js';

/**
 * @module Core/data/mixin/StoreCRUD
 */

/**
 * Mixin for Store that handles modifying records (add, remove etc).
 *
 * @example
 * // add new record to store
 * store.add({ id: 1, team: 'FC Krasnodar' });
 *
 * // remove a record from store, using id
 * store.remove(1);
 *
 * @mixin
 */
export default Target => class StoreCRUD extends (Target || Base) {
    static get $name() {
        return 'StoreCRUD';
    }

    //region Config

    static get defaultConfig() {
        return {
            /**
             * Commit changes automatically
             * @config {Boolean}
             * @default
             * @category Common
             */
            autoCommit : false
        };
    }

    static get properties() {
        return {
            isRemoving   : false,
            suspendCount : 0
        };
    }

    //endregion

    //region Events

    /**
     * Fired after removing all records
     * @event removeAll
     * @param {Core.data.Store} source This Store
     */

    /**
     * Fired before committing changes. Return false from handler to abort commit
     * @event beforeCommit
     * @param {Core.data.Store} source This Store
     * @param {Object} changes Modification data
     */

    /**
     * Fired after committing changes
     * @event commit
     * @param {Core.data.Store} source This Store
     * @param {Object} changes Modification data
     */

    /**
     * Fired before records are removed from this store by the {@link #function-remove} or {@link #function-removeAll}.
     * Also fired when removing a child record in a tree store using {@link Core.data.mixin.TreeNode#function-removeChild}.
     * The remove may be vetoed by returning `false` from a handler.
     * @event beforeRemove
     * @param {Core.data.Store} source This Store
     * @param {Core.data.Model[]} records The records which are to be removed.
     * @param {Core.data.Model} parent The record from which children are being removed when using a tree store
     * @param {Boolean} isMove Set to `true` if the child node is being removed by
     * {@link Core.data.mixin.TreeNode#function-appendChild appendChild} to be moved
     * _within the same tree_.
     * @param {Boolean} removingAll Set to `true` if the operation is removing the store's entire data set.
     */

    /**
     * Fired before records are added to this store by the {@link #function-add} or {@link #function-insert}. In a tree
     * store, also fired by {@link Core.data.mixin.TreeNode#function-appendChild} and
     * {@link Core.data.mixin.TreeNode#function-insertChild}. The add or insert may be vetoed by returning `false`
     * from a handler.
     * @event beforeAdd
     * @param {Core.data.Store} source This Store
     * @param {Core.data.Model[]} records The records which are to be added
     * @param {Core.data.Model} parent The parent node when using a tree store
     * @preventable
     */

    /**
     * Fired after adding/inserting record(s). If the record was added to a parent, the `isChild` flag is set on the
     * event. If it was inserted, event contains `index`
     * @event add
     * @param {Core.data.Store} source This Store
     * @param {Core.data.Model[]} records Added records. In case of tree store, if branch is added, only branch root
     * is returned
     * @param {Core.data.Model[]} [allRecords] Flat list of all added records. In case of tree store, if branch is
     * added, all new records are returned, not only branch root
     * @param {Core.data.Model} [parent] If due to an {@link Core.data.mixin.TreeNode#function-appendChild appendChild}
     * call, this is the parent node added to.
     * @param {Number} [index] Insertion point in the store's {@link Core.data.Store#config-storage Collection}.
     * @param {Number} [oldIndex] Not used for tree stores. The index of the first record moved.
     * @param {Boolean} [isChild] Flag which is set to true if the records are added to a parent record
     * @param {Boolean} [isExpand] Flag which is set to true if records are added to the store by expanding parent
     * @param {Object} [isMove] An object keyed by the ids of the records which were moved from another
     * position in the store, or from another parent node in the store. The ids of moved records will be
     * property names with a value `true`.
     */

    /**
     * Fired when a record has been removed
     * @event remove
     * @param {Core.data.Store} source This Store
     * @param {Core.data.Model[]} records Removed records. In case of tree store, if branch is removed, only branch root
     * is returned
     * @param {Core.data.Model[]} [allRecords] Flat list of all removed records. In case of tree store, if branch is
     * removed, all removed records are returned, not only branch root
     * @param {Core.data.Model} [parent] If due to a {@link Core.data.mixin.TreeNode#function-removeChild removeChild}
     * call, this is the parent node removed from.
     * @param {Number} [index] Visible index at which record was removed. In case record is removed from the collapsed
     * branch -1 is returned.
     * @param {Boolean} [isChild] Flag which is set to true if the record is added to a parent record
     * @param {Boolean} [isCollapse] Flag which is set to true if records are removed from the store by collapsing parent
     * @param {Boolean} [isMove] Passed as `true` if the remove was part of a move operation within this Store.
     */
    //endregion

    //region Add, insert & remove

    /**
     * Removes a record from this store.
     * @param {String|String[]|Number|Number[]|Core.data.Model|Core.data.Model[]} records Record/array of records (or record ids) to remove
     * @param {Boolean} [silent] Specify `true` to suppress events/autoCommit
     * @returns {Core.data.Model[]} Removed records
     * @fires beforeRemove
     * @fires remove
     * @fires change
     * @category CRUD
     */
    remove(records, silent = false) {
        const
            me          = this,
            { storage } = me;

        if (records instanceof Set) {
            records = Array.from(records);
        }

        // Ensure we have an array of records in case we are passed IDs
        records = (Array.isArray(records) ? records : [records]).reduce((result, r) => {
            r = me.getById(r);
            if (r) {
                result.push(r);
            }
            return result;
        }, []);

        if (records.length) {

            // Flag that can be checked in linked store to determine if removal is ongoing
            me.isRemoving = true;

            if (me.tree) {
                // In case it's a set of records from different parents, group them by parent
                const
                    removeChildArgs = records.reduce((result, child) => {
                        const
                            parent = child.parent;

                        if (parent) {
                            if (!result[parent.id]) {
                                result[parent.id] = [parent, []];
                            }
                            result[parent.id][1].push(child);
                        }
                        return result;
                    }, {});

                // Remove the records each from their correct parent
                for (const argBlock of Object.values(removeChildArgs)) {
                    argBlock[0].removeChild(argBlock[1], false, silent);
                }

                me.isRemoving = false;

                return records;
            }
            // Ensure that records in collapsed groups are removed and events fired.
            else if (me.isGrouped) {
                const
                    oldCount                 = storage.count,
                    recordsInCollapsedGroups = [],
                    changedGroupParents      = new Set();

                // Collect any records which are in collapsed groups which will not be in the storage
                // Collection, and so will not cause a store change.
                // If we find some, we must fire the event which the store will react to and update itself.
                for (const rec of records) {
                    const { groupParent } = rec.instanceMeta(me);

                    if (groupParent && groupParent.meta.collapsed) {
                        recordsInCollapsedGroups.push(rec);
                    }

                    // Collect group header records which change so they can announce this to cause UI updates.
                    ArrayHelper.remove(groupParent.groupChildren, rec);
                    groupParent.meta.childCount--;
                    changedGroupParents.add(groupParent);
                }

                // The changed group parents must announce their changes, otherwise the group headers
                // in a UI will not refresh to reflect the change.
                for (const groupParent of changedGroupParents) {
                    if (groupParent.groupChildren.length > 0) {
                        me.onModelChange(groupParent, {}, {});
                    }
                }

                // The store must react as if these records in collapsed groups have been removed from storage
                if (recordsInCollapsedGroups.length) {
                    storage.trigger('change', {
                        action   : 'splice',
                        removed  : recordsInCollapsedGroups,
                        added    : [],
                        replaced : [],
                        oldCount
                    });
                }
            }

            // Give chance to veto or take action before records disappear.
            if (!records.length || (!silent && me.trigger('beforeRemove', { records }) === false)) {
                me.isRemoving = false;
                return null;
            }

            if (silent) {
                me.suspendEvents();
            }

            storage.remove(records);

            if (silent) {
                me.resumeEvents();
            }

            if (me.autoCommit) {
                me.doAutoCommit();
            }

            me.isRemoving = false;
        }

        return records;
    }

    /**
     * Clears store data. Used by removeAll, separate function for using with chained stores.
     * @private
     * @category CRUD
     */
    clear(isLoading = false) {
        const
            me          = this,
            { storage } = me;

        // For tree store, we have to check unfilteredChildren to see if store has contents
        if (me.storage.totalCount || me.rootNode?.unfilteredChildren?.length) {
            // Give chance to veto or take action before records disappear.
            if (!isLoading && me.trigger('beforeRemove', { records : storage.allValues, removingAll : true }) === false) {
                return null;
            }

            // For tree scenario, clean up root node too
            if (me.rootNode) {
                // A chained tree store shares root node with its master store
                if (!me.isChained) {
                    me.rootNode.clearChildren(isLoading);
                }
            }
            else if (isLoading) {
                // If we are loading, we suspend events, and Store#onDataChange won't get to
                // do all this stuff.
                const allRecords = me.registeredRecords;

                for (let i = allRecords.length - 1, rec; i >= 0; i--) {
                    rec = allRecords[i];
                    if (rec && !rec.isDestroyed) {
                        rec.unjoinStore(me);
                    }
                }
            }

            if (isLoading) {
                me.removed.clear();
                storage.suspendEvents();
            }
            // Clearing the storage will trigger 'removeAll' and 'change' if `removing`
            storage.clear();
            if (isLoading) {
                storage.resumeEvents();
            }

            me.added.clear();
            me.modified.clear();
        }
    }

    /**
     * Removes all records from the store.
     * @param {Boolean} [silent] Specify `true` to suppress events
     * @returns {Boolean} `true` unless the action was prevented, in which case it returns `false`
     * @fires beforeRemove
     * @fires removeAll
     * @fires change
     * @category CRUD
     */
    removeAll(silent = false) {
        const
            me      = this,
            storage = me.storage;

        let result;

        me.isRemoving = true;

        // No reaction to the storage Collection's change event.
        if (silent) {
            storage.suspendEvents();

            // If silent, the storage Collection won't fire the event we react to
            // to unjoin, and we allow the removing flag in remove() to be true,
            // so *it* will not do the unJoin, so if silent, so do it here.
            const allRecords = me.registeredRecords;

            for (let i = allRecords.length - 1, rec; i >= 0; i--) {
                rec = allRecords[i];
                if (rec && !rec.isDestroyed && !rec.isRoot) {
                    rec.unjoinStore(me);
                }
            }
        }

        if (me.tree) {
            result = me.rootNode.clear() !== false;
        }
        else {
            result = me.clear() !== null;
        }

        if (silent) {
            storage.resumeEvents();
        }

        me.isRemoving = false;

        return result;
    }

    /**
     * Add records to store.
     * @param {Core.data.Model|Core.data.Model[]|Object|Object[]} records Array of records/data or a single record/data to add to store
     * @param {Boolean} [silent] Specify `true` to suppress events
     * @returns {Core.data.Model[]} Added records
     * @fires add
     * @fires change
     * @category CRUD
     */
    add(records, silent = false) {
        const
            me      = this,
            storage = me.storage;

        if (!Array.isArray(records)) {
            records = [records];
        }
        else if (!records.length) {
            // Adding zero records, bail out
            return;
        }

        me.tree = me.tree || Boolean(me.autoTree && records[0].children);

        if (me.tree) {
            const
                // Map and not Object to allow keys to keep their type
                parentIdMap = new Map(),
                added       = [];

            records.forEach(node => {
                const
                    parentId = node[me.modelClass.parentIdField];
                if (!parentIdMap.has(parentId)) {
                    parentIdMap.set(parentId, []);
                }

                parentIdMap.get(parentId).push(node);
            });

            parentIdMap.forEach((nodes, parentId) => {
                const
                    parentNode = parentId == null ? me.rootNode : me.getById(parentId);

                if (!parentNode) {
                    throw new Error(`Parent node with id ${parentId} not found, cannot add children.`);
                }

                added.push(...parentNode.appendChild(nodes, silent));
            });

            return added;
        }

        // Give chance to cancel action before records added.
        if (!silent) {
            if (me.trigger('beforeAdd', { records }) === false) {
                return null;
            }
        }

        me.tree = me.tree || Boolean(me.autoTree && records[0].children);

        if (me.tree) {
            return me.rootNode.appendChild(records);
        }

        const added = me.processRecords(records);

        if (silent) {
            me.suspendEvents();
        }

        storage.add(added);

        if (silent) {
            me.resumeEvents();
        }

        if (me.autoCommit) {
            me.doAutoCommit();
        }

        return added;
    }

    processRecords(records, onRecordCreated) {
        return records.map(data => {
            const record = this.processRecord(data.isModel ? data : this.createRecord(data));

            onRecordCreated?.call(this, record);

            return record;
        });
    }

    /**
     * Insert records to store.
     * @param {Number} index Index to insert at
     * @param {Core.data.Model|Core.data.Model[]|Object|Object[]} records Array of records/data or a single record/data to insert to store
     * @param {Boolean} [silent] Specify `true` to suppress events
     * @returns {Core.data.Model[]} Inserted records
     * @fires add
     * @fires change
     * @category CRUD
     */
    insert(index, records, silent = false) {
        const
            me            = this,
            storage       = me.storage,
            insertBefore  = me.getAt(index),
            _records      = storage.values,
            removeIndices = [];

        if (!Array.isArray(records)) records = [records];

        // Give chance to cancel action before records added.
        if (!silent && me.trigger('beforeAdd', { records }) === false) {
            return null;
        }

        let isNoop, start, i;

        // If the records starting at index or (index - 1), are the same sequence
        // that we are being asked to add, this is a no-op.
        if (_records[start = index] === records[0] || _records[start = index - 1] === records[0]) {
            for (isNoop = true, i = 0; isNoop && i < records.length; i++) {
                if (records[i] !== _records[start + i]) {
                    isNoop = false;
                }
            }
        }
        if (isNoop) {
            return null;
        }

        const added = me.processRecords(records, record => {
            const
                removedAtIndex = storage.indexOf(record);

            if (record.children && record.children.length && me.autoTree) {
                me.tree = true;
            }

            // already in store, do some cleanup
            if (removedAtIndex > -1) {
                if (removedAtIndex < index && insertBefore) index--;
                removeIndices.push(removedAtIndex);
            }

            // Store previous index to be able to determine that it is a move, since Collection does not handle that
            record.meta.previousIndex = removedAtIndex;
        });

        if (me.tree) {
            const
                root = me.rootNode;

            return root.insertChild(records, root.children && root.children[index], silent);
        }

        // Silently remove them, so that they will be inserted into place.
        // Collection is stable by default, and inserting an existing item
        // is a no-op.
        me.suspendEvents();
        me.storage.remove(removeIndices);
        me.resumeEvents();

        if (silent) {
            me.suspendEvents();
        }
        storage.splice(index, 0, ...added);
        if (silent) {
            me.resumeEvents();
        }

        if (me.autoCommit) {
            me.doAutoCommit();
        }

        return added;
    }

    /**
     * Moves a record, or block of records to another location.
     * @param {Core.data.Model|Core.data.Model[]} records The record(s) to move.
     * @param {Core.data.Model} beforeRecord the record to insert the first record(s) before.
     * @category CRUD
     */
    move(records, beforeRecord) {
        this.storage.move(records, beforeRecord);
    }

    //endregion

    //region Update multiple

    setMultiple(filterFn, field, value) {
        const
            me      = this,
            records = [],
            changes = [];

        me.forEach(r => {
            if (filterFn(r)) {
                changes.push(r.set(field, value, true));
                records.push(r);
            }
        });

        // TODO: should consolidate with update, make it take an array instead? to only have to listen for one event outside of store?

        me.trigger('updateMultiple', { records, all : me.records.length === records.length });
        me.trigger('change', { action : 'updatemultiple', records, all : me.records.length === records.length });

        if (me.reapplyFilterOnUpdate && me.isFiltered) me.filter();
    }

    setAll(field, value) {
        const
            me      = this,
            changes = [];

        me.forEach(r => {
            changes.push(r.set(field, value, true));
        });

        me.trigger('updateMultiple', { records : me.records, all : true });
        me.trigger('change', { action : 'updatemultiple', records : me.records, all : true });

        if (me.reapplyFilterOnUpdate && me.isFiltered) me.filter();
    }

    //endregion

    //region Commit

    /**
     * Accepts all changes, resets the modification tracking:
     * * Clears change tracking for all records
     * * Clears added
     * * Clears modified
     * * Clears removed
     * Leaves the store in an "unmodified" state.
     * @internal
     */
    acceptChanges() {
        const
            me = this;

        // Clear record change tracking
        me.added.forEach(r => r.clearChanges(false));
        me.modified.forEach(r => r.clearChanges(false));

        // Clear store change tracking
        me.added.clear();
        me.modified.clear();
        me.removed.clear();
    }

    /**
     * Commits changes, per default only returns changes and resets tracking.
     * @param {Boolean} [silent] Specify `true` to suppress events
     * @returns {Object} Changes, see {@link #property-changes}
     * @fires beforeCommit
     * @fires commit
     * @category CRUD
     */
    commit(silent = false) {
        // resets stores tracking of changed records, doesn't store changes, only returns them
        const
            { changes } = this;

        if (!silent && this.trigger('beforeCommit', { changes }) === false) {
            return false;
        }

        this.acceptChanges();

        if (!silent) {
            this.trigger('commit', { changes });
        }

        return changes;
    }

    /**
     * Reverts all changes in the store (adds removed records back, and removes newly added records).
     * @fires change
     * @category CRUD
     */
    revertChanges() {
        const
            me          = this,
            { changes } = me;

        me.add(me.removed.values, true);
        me.remove(me.added.values, true);
        me.modified.forEach(r => r.revertChanges(true));

        me.added.clear();
        me.modified.clear();
        me.removed.clear();

        me.trigger('change', { action : 'clearchanges', changes });
    }

    /**
     * Get uncommitted changes as an object of added/modified/removed arrays of records.
     *
     * ```javascript
     * // Format:
     * {
     *      added: [], // array of Core.data.Model
     *      modified: [], // array of Core.data.Model
     *      removed: [] // array of Core.data.Model
     * }
     * ```
     *
     * @type {Object}
     * @property {Object} changes
     * @property {Core.data.Model[]} changes.added Records that have been added
     * @property {Core.data.Model[]} changes.modified Records that have changes to persistable fields
     * @property {Core.data.Model[]} changes.removed Records that have been removed
     * @readonly
     * @category Records
     */
    get changes() {
        const
            me       = this,
            // Only include modified records that have persistable changes
            modified = me.modified.values.filter(r => r.rawModifications);

        return (me.added.count || modified.length || me.removed.count) ? {
            // Slicing to have changes intact when triggering commit
            added   : me.added.values.slice(),
            modified,
            removed : me.removed.values.slice()
        } : null;
    }

    /**
     * Setting autoCommit to true automatically commits changes to records.
     * @property {Boolean}
     * @category Records
     */
    get autoCommit() {
        return this._autoCommit;
    }

    set autoCommit(auto) {
        this._autoCommit = auto;
        if (auto && this.changes) {
            this.commit();
        }
    }

    /**
     * Suspends automatic commits upon store changes. Can be called multiple times (it uses an internal counter).
     * @category Records
     */
    suspendAutoCommit() {
        this.suspendCount++;
    }

    /**
     * Resumes automatic commits upon store changes. Will trigger commit if the internal counter is 0.
     * @category Records
     */
    resumeAutoCommit(doCommit = true) {
        this.suspendCount--;

        if (this.autoCommit && doCommit) {
            this.doAutoCommit();
        }
    }

    doAutoCommit() {
        if (this.suspendCount <= 0) {
            this.commit();
        }
    }

    //endregion

    //region Changes from other store

    /**
     * Applies changes from another store to this store. Useful if cloning records in one store to display in a
     * grid in a popup etc. to reflect back changes.
     * @param {Core.data.Store} otherStore
     * @category CRUD
     */
    applyChangesFromStore(otherStore) {
        const
            me      = this,
            changes = otherStore.changes;

        if (!changes) return;

        if (changes.added) {
            me.add(changes.added);
        }

        if (changes.removed) {
            // Remove using id, otherwise indexOf in remove fn won't yield correct result
            me.remove(changes.removed.map(r => r.id));
        }

        if (changes.modified) {
            changes.modified.forEach(record => {
                const
                    localRecord = me.getById(record.id);
                localRecord.set(record.modifications);
            });
        }
    }

    //endregion
};
