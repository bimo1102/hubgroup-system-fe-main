import Store from '../data/Store.js';
import AjaxStore from '../data/AjaxStore.js';
import Model from '../data/Model.js';
import Filter from '../util/CollectionFilter.js';
import PickerField from './PickerField.js';
import ChipView from './ChipView.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import Objects from '../helper/util/Objects.js';
import Collection from '../util/Collection.js';
import DomHelper from '../helper/DomHelper.js';
import DomSync from '../helper/DomSync.js';
import EventHelper from '../helper/EventHelper.js';
import Navigator from '../helper/util/Navigator.js';
import List from './List.js';
import StringHelper from '../helper/StringHelper.js';

const
    errorFieldRequired  = 'L{Field.fieldRequired}',
    errorValidateFilter = 'L{Field.validateFilter}';

/**
 * @module Core/widget/Combo
 */

/**
 * Combo (dropdown) widget. Consists of a text field with a trigger icon, which displays a List. Can be
 * populated from a Store.
 *
 * This field can be used as an {@link Grid/column/Column#config-editor} for the {@link Grid/column/Column}.
 *
 * Please be aware that when populating the Combo with objects or records you have to configure {@link #config-valueField} and {@link #config-displayField}
 * to point to the correct field names in your data.
 *
 * ### Basic scenarios
 * {@inlineexample Core/widget/Combo.js vertical}
 *
 * ### Multiselect + grouped list
 *
 * {@inlineexample Core/widget/ComboMultiselect.js}
 *
 * ## Snippet: Loading data from simple string array
 * ```javascript
 * const combo = new Combo({
 *     items       : ['Small', 'Smaller', 'Really small', 'Tiny'],
 *     placeholder : 'Pick size of diamond for ring'
 * });
 *```
 *
 * ## Snippet: Loading data from array with item configs
 * ```javascript
 * const combo = new Combo({
 *     items : [{ value: 'a', text: 'First' }, { value: 'z', text: 'Last' }]
 * });
 *```
 *
 * ## Snippet: Loading data from store
 * ```javascript
 * const combo = new Combo({
 *     store        : memberStore,
 *     valueField   : 'id',
 *     displayField : 'name'
 * });
 *```
 *
 * ## Snippet: Grouped list
 * To group the list contents, simply group your store using {@link Core.data.mixin.StoreGroup#config-groupers}. You
 * can decide if clicking a header should toggle all group children (or if it should do nothing) with the
 * {@link Core.widget.List#config-allowGroupSelect} flag.
 * ```javascript
 * const combo = new Combo({
 *     width            : 400,
 *     displayField     : 'name',
 *     valueField       : 'id',
 *     multiSelect      : true,
 *     picker : {
 *         allowGroupSelect : false,
 *         // Show icon based on group name
 *         groupHeaderTpl   : (record, groupName) => `
 *             <i class="icon-${groupName}"></i>${groupName}
 *         `
 *     },
 *     value : [1, 4],
 *     store : new Store({
 *         fields : [
 *             'type'
 *         ],
 *         groupers : [
 *             { field : 'type', ascending : true }
 *         ],
 *         data : [
 *             { id : 1, name : 'pizza', type : 'food' },
 *             { id : 2, name : 'bacon', type : 'food' },
 *             { id : 3, name : 'egg', type : 'food' },
 *             { id : 4, name : 'Gin tonic', type : 'drinks' },
 *             { id : 5, name : 'Wine', type : 'drinks' },
 *             { id : 6, name : 'Beer', type : 'drinks' }
 *         ]
 *     })
 * });
 *```
 *
 * @extends Core/widget/PickerField
 * @classType combo
 *
 */
export default class Combo extends PickerField {

    // Do not remove. Assertion strings for Localization sanity check.
    // 'L{Field.fieldRequired}'
    // 'L{Field.validateFilter}'

    //region Config
    static get $name() {
        return 'Combo';
    }

    // Factoryable type name
    static get type() {
        return 'combo';
    }

    // Factoryable type aliases
    static get alias() {
        return 'combobox,dropdown';
    }

    static get configurable() {
        return {
            /**
             * Optionally a {@link Core.util.CollectionFilter Filter} config object which
             * the combo should use for filtering using the typed value.
             * This may use a `filterBy` property to test its `value` against any field
             * in the passed record.
             * ```javascript
             * {
             *     type          : 'combo',
             *     store         : myStore,
             *     primaryFilter : {
             *         filterBy(record) {
             *             if (this.value == null) {
             *                 return true;
             *             }
             *             const value = this.value.toLowerCase();
             *
             *             // Match typed value with forename or surname
             *             return record.forename.toLowerCase().startsWith(value) || record.surname.toLowerCase().startsWith(value);
             *         }
             *     }
             * }
             * ```
             * @config {Object}
             */
            primaryFilter : {},

            picker : {
                type                : 'list',
                floating            : true,
                scrollAction        : 'realign',
                itemsFocusable      : false,
                activateOnMouseover : true,
                align               : {
                    align    : 't0-b0',
                    axisLock : true
                },
                maxHeight  : 324,
                scrollable : {
                    overflowY : true
                },
                autoShow     : false,
                focusOnHover : false
            },

            /**
             * Configure as `true` to allow selection of multiple values from the dropdown list.
             *
             * Each value is displayed as a "Chip" to the left of the input area. Chips may be
             * selected using the `LEFT` and `RIGHT` arrow keys and deleted using the `DELETE` key
             * to remove values from the field. There is also a clickable close icon in each chip.
             *
             * Use {@link Core.widget.List#config-toggleAllIfCtrlPressed} to implement "select all" behaviour.
             *
             * ```javascript
             * {
             *     type   : 'combo',
             *     store  : myStore,
             *     picker : {
             *         toggleAllIfCtrlPressed : true
             *     }
             * }
             * ```
             *
             * @config {Boolean}
             * @default false
             */
            multiSelect : null,

            /**
             * Rows to display in the dropdown (list items).
             *
             * If an object, the property names provide the {@link #config-value} for the Combo, and
             * the property values provide the displayed test in the list and input area eg:
             *
             *     items : {
             *         small  : 'Small',
             *         medium : 'Medium',
             *         large  : 'Large'
             *     }
             *
             * If an array, each entry may be
             *  - an object containing properties which must include
             * the {@link #config-valueField} and {@link #config-displayField} which populates the dropdown
             * with text and provides the corresponding field value.
             *  - An array whose first value provides the {@link #config-value} for the Combo and whose
             * second value provides the displayed test in the list and input area.
             *  - An array of values where the {@link #config-valueField} and {@link #config-displayField} are the same.
             *
             * eg:
             *
             *     items : [
             *         {value : 'small',  text : 'Small'},
             *         {value : 'medium', text : 'Medium'},
             *         {value : 'large',  text : 'Large'},
             *     ]
             *
             * or
             *
             *     items : [
             *         ['small',  'Small'],
             *         ['medium', 'Medium'],
             *         ['large',  'Large'],
             *     ]
             *
             * or
             *
             *     items : [ 'Small', 'Medium', 'Large' ]
             *
             * @config {Object[]|String[]|Object}
             */
            items : null,

            /**
             * Get/set store to display items from. Also accepts a Store config object.
             * @property {Core.data.Store|Object}
             * @name store
             */
            /**
             * A store used to populate items.
             * @config {Core.data.Store}
             */
            store : null,

            /**
             * Field used for item value when populating from store. Setting this to `null` will
             * yield the selected record as the Combo's {@link #property-value}.
             * @config {String}
             */
            valueField : undefined,

            /**
             * Field used for item text when populating from store
             * @config {String}
             */
            displayField : 'text',

            /**
             * Width of picker, defaults to this combo's {@link #config-pickerAlignElement} width
             * @config {Number}
             */
            pickerWidth : null,

            /**
             * The minimum string length to trigger the filtering, only relevant when {@link #config-editable} is `true`.
             *
             * This defaults to `1` in the case of local filtering, but `4` if the
             * {@link #config-filterParamName} is set to cause remote dropdown loading.
             *
             * @config {Number}
             * @default
             */
            minChars : null,

            selected : null,

            /**
             * Template string used to render the list items in the dropdown list
             *
             * ```javascript
             * new Combo({
             *     listItemTpl : ({ text }) => `<div class="combo-color-box ${text}"></div>${text}`,
             *     editable    : false,
             *     items       : [
             *         'Black',
             *         'Green',
             *         'Orange',
             *         'Pink',
             *         'Purple',
             *         'Red',
             *         'Teal'
             *     ]
             * });
             * ```
             *
             * @config {Function}
             * @param {Core.data.Model} record The record representing the item being rendered
             * @returns {String}
             */
            listItemTpl : null,

            /**
             * Template function that can be used to customize the displayed value
             * @param {Core.data.Model} record The record to provide a textual value for.
             * @param {Core.widget.Combo} combo A reference to this Combo.
             * @config {Function}
             * @returns {String}
             */
            displayValueRenderer : null,

            /**
             * CSS class to add to picker
             * @config {String}
             */
            listCls : null,

            triggers : {
                expand : {
                    cls     : 'b-icon-picker',
                    handler : 'onTriggerClick'
                }
            },

            /**
             * If the dropdown is to be populated with a filtered query to a remote server, specify the
             * name of the parameter to pass the typed string here. By default, the string is simply sent
             * as the value of the parameter. For special encoding, configure the combo with {@link #config-encodeFilterParams}
             * @config {String}
             */
            filterParamName : null,

            /**
             * A function which creates an array of values for the {#config-filterParamName} to pass
             * any filters to the server upon load.
             *
             * The default behaviour is just to set the parameter value to the filter's `value`,
             * but the filter can be fully encoded for example:
             *
             * ```javascript
             *    {
             *        encodeFilterParams(filters) {
             *            const result = [];
             *
             *            for (const { property, operator, value, caseSensitive } of filters) {
             *                result.push(JSON.stringify({
             *                    field : property,
             *                    operator,
             *                    value,
             *                    caseSensitive
             *                }));
             *           }
             *        return result;
             *    }
             * ```
             * @config {Function}
             */
            encodeFilterParams : filters => filters.map(f => f.value),

            /**
             * If `false`, filtering will be triggered once you exceed {@link #config-minChars}. To filter only when
             * hitting Enter key, set this to `true`;
             * @config {Boolean}
             */
            filterOnEnter : false,

            /**
             * Configure as `true` to hide the expand trigger. This is automatically set to `true` if
             * remote filtering is enabled by setting the {@link #config-filterParamName} config.
             * @config {Boolean}
             * @default false
             */
            hideTrigger : null,

            /**
             * This implies that the picker will display an anchor pointer, but also means that the picker will align closer
             * to the input field so that the pointer pierces the {@link #config-pickerAlignElement}
             * @config {Boolean}
             * @default false
             */
            overlayAnchor : null,

            /**
             * The delay in milliseconds to wait after the last keystroke before filtering the list.
             * @config {Number}
             * @default
             */
            keyStrokeFilterDelay : null,

            defaultAction : 'select',

            /**
             * How to query the store upon click of the expand trigger. Specify one of these values:
             *
             *  - `'all'` - Clear the filter and display the whole dataset in the dropdown.
             *  - `'last'` - Filter the dataset using the last filter value.
             *  - `null`/any other - Use the value in the input field to filter the dataset.
             *
             * @config {String}
             * @default
             */
            triggerAction : 'all',

            /**
             * Get/sets of the operator type for the combo primary filter.
             *
             * @member {String} filterOperator
             */
            /**
             * The name of an operator type as implemented in {@link Core.util.CollectionFilter#config-operator}
             * to use when filtering the dropdown list based upon the typed value.
             *
             * This defaults to `'startsWith'`, but the `'*'` operator may be used to match all
             * values which _contain_ the typed value.
             *
             * Not used when {@link #config-filterParamName} is set to cause remote dropdown loading.
             * The exact filtering operation is up to the server.
             *
             * @config {String}
             */
            filterOperator : 'startsWith',

            /**
             * Configure as `true` to force case matching when filtering the dropdown list based upon the typed value.
             *
             * @config {Boolean}
             * @default false
             */
            caseSensitive : false,

            /**
             * By default, the picker is hidden on selection in single select mode, and
             * remains to allow more selections when {@link #config-multiSelect} is `true`.
             * Setting this to a `Boolean` value can override that default.
             * @config {Boolean}
             */
            hidePickerOnSelect : null,

            /**
             * A config object to configure the {@link Core.widget.ChipView} to display the
             * selected value set when {@link #config-multiSelect} is `true`.
             *
             * For example the {@link Core.widget.List#config-itemTpl} or
             * {@link Core.widget.ChipView#config-iconTpl} might be configured to display
             * richer chips for selected items.
             * @config {Object}
             */
            chipView : {
                $config : ['lazy', 'nullify'],

                value : {
                    type : 'combochipview'
                }
            },

            chipStore : {
                $config : ['lazy', 'nullify'],
                value   : {}
            },

            /**
             * When {@link #config-multiSelect} is `true`, you may configure `filterSelected` as
             * `true` to hide items in the dropdown when they are added to the selection.
             * It will appear as if the requested item has "moved" into the field's
             * {@link #config-chipView ChipView}.
             *
             * @config {Boolean}
             * @default false
             */
            filterSelected : null,

            /**
             * Text to display in the drop down when there are no items in the underlying store
             * @config {String}
             * @default
             */
            emptyText : null,

            /**
             * Get/sets combo value, selects corresponding item in the list
             * Setting null clears the field.
             *
             * If {@link #config-multiSelect} is `true`, then multiple values may be passed as an array.
             * If the values are records, these become the selected record set held by {@link #property-valueCollection},
             * and the `value` yielded by this field is an array of all the {@link #config-valueField}s from the records.
             * @fires select
             * @fires action
             * @property {Object}
             * @name value
             */
            /**
             * The initial value of this Combo box. In single select mode (default) it's a simple string value, for
             * {@link #config-multiSelect} mode, it should be an array of record ids.
             * @config {String|Number[]|String[]}
             * @default
             */
            value : null,

            valueCollection : {
                $config : ['nullify', 'lazy'],
                value   : {}
            },

            /**
             * `true` to cause the field to be in an invalid state while the typed filter string does not match a record in the store.
             * @config {Boolean}
             * @default
             */
            validateFilter : true,

            /**
             * `true` to clear value typed to a multiselect combo when picker is collapsed
             * @config {Boolean}
             * @default
             */
            clearTextOnPickerHide : true,

            // set to true to destroy the old combo store when it is replaced with a new store
            destroyStore : false
        };
    }

    /**
     * A constant value for the {@link #config-triggerAction} config to indicate that clicking the trigger should
     * filter the dataset using the last filter query string, *not* the input field value.
     * @member {String} queryLast
     * @readonly
     * @static
     */
    static get queryLast() {
        return 'last';
    }

    //endregion

    construct(config) {
        super.construct(...arguments);

        // Ensure there will always be a store created if Combo is created without items/store
        if (!this.store) {
            this.items = [];
        }

        if (this.filterOnEnter) {
            this.hideTrigger = true;
        }
    }

    startConfigure(config) {
        this.usingRecordAsValue = config.valueField === null;

        super.startConfigure(...arguments);
    }

    afterConfigure() {
        super.afterConfigure();

        const me = this;

        if (!('_value' in me)) {
            me._value = me.valueField === me.displayField ? '' : null;
            // _lastValue should stay keeping an initial value if any
            me._lastValue = me._lastValue || me._value;
        }
    }

    get childItems() {
        const
            { _chipView, _picker } = this,
            result = [];

        if (_chipView) {
            result.push(_chipView);
        }

        if (_picker) {
            result.push(_picker);
        }

        return result;
    }

    get innerElements() {
        const
            chipViewElement = this._chipView?.element,  // don't trigger chipView create on first compose()
            { input, inputElement } = this;

        if (chipViewElement) {
            // Once the input el is transplanted inside the chipView, normal compose() calls won't sync it, so we
            // have to do so now:
            DomSync.sync({
                targetElement : input,
                domConfig     : inputElement
            });
        }

        return [chipViewElement || inputElement];
    }

    changeChipStore(chipStore) {
        if (chipStore && !(chipStore instanceof Store)) {
            chipStore = new Store(Store.mergeConfigs({
                storage : this.valueCollection
            }, chipStore));
        }

        return chipStore;
    }

    updateChipStore(store, was) {
        was?.destroy();
    }

    changeChipView(chipView, oldChipView) {
        const
            me = this;

        me.element.classList[chipView ? 'add' : 'remove']('b-uses-chipview');

        if (chipView) {
            const { input } = me;

            if (!me.chipStore) {
                me.chipStore = {};
            }

            return ComboChipView.reconfigure(oldChipView, chipView, {
                defaults : {
                    parent       : me,
                    insertBefore : input,
                    store        : me.chipStore,
                    closable     : !me.readOnly,

                    navigator : {
                        class          : ComboChipNavigator,
                        keyEventTarget : input
                    }
                }
            });
        }

        oldChipView?.destroy();
    }

    updateChipView(chipView) {
        const me = this;

        me._chipViewEventDetacher  = me._chipViewEventDetacher?.();

        me.chipStore = chipView?.store;

        if (chipView) {
            // Insert the input field
            chipView.element.appendChild(me.input);

            // Focus must flow into our field from the ChipView
            me._chipViewEventDetacher  = EventHelper.on({
                element   : chipView.element,
                mousedown : 'onChipViewMousedown',
                thisObj   : me
            });
        }
    }

    updateMultiSelect(multiSelect, oldMultiSelect) {
        const
            me             = this,
            {
                input,
                element
            }              = me,
            fixValue       = !me.isConfiguring;

        let { value } = me;

        element.classList[multiSelect ? 'add' : 'remove']('b-multiselect');

        if (multiSelect) {
            const
                { chipView }   = me,
                { parentNode } = input,
                chipViewEl  = chipView?.element;

            // If the input's parentNode is not the chipView's element, we need to restore that DOM arrangement
            if (chipViewEl && chipViewEl !== parentNode) {
                // This is where the chipView is created in the DOM but it may have been removed.
                parentNode.insertBefore(chipViewEl, input);
                chipViewEl.appendChild(input);
                me.chipView.refresh();
            }

            input.value = '';

            if (fixValue && !Array.isArray(value)) {
                value = value ? [value] : null;
            }
        }
        // else when !multiSelect, if the input's parentNode is the chipView's element, we need to put things back the
        // other way
        else {
            // avoid triggering lazy config if !multiSelect
            const
                chipView   = me._chipView,
                { parentNode } = input,
                chipViewEl = chipView?.element;

            if (chipViewEl === parentNode) {
                // Put the input back in its proper place
                chipViewEl.parentNode.insertBefore(input, chipViewEl);

                // When no longer multiSelect, remove the chipView from the DOM. We do not destroy it because derived
                // classes or the instance config may have specified chipView config options. If we destroyed it, we could
                // not then properly recreate it.
                chipViewEl.remove();
                element.classList.remove('b-uses-chipview');
            }

            if (fixValue && typeof value !== 'string') {
                value = (value && value.length) ? value[0] : null;
            }
        }

        if (fixValue) {
            me.value = value;
        }
    }

    onChipViewMousedown(mousedownEvent) {
        mousedownEvent.preventDefault();
        if (!this.containsFocus) {
            this.focus();
        }
    }

    onChipClose(records, options = {}) {
        // Do not clean value collection if input field is not empty - probably text is selected
        // and user just wants to remove it, not the picked values
        if (options.isKeyEvent && this.input.value === '' || !options.isKeyEvent) {
            this._isUserAction = true;
            this.valueCollection.remove(records);
            this._isUserAction = false;
        }
    }

    updateFilterParamName(filterParamName) {
        if (this.hideTrigger !== false) {
            this.hideTrigger = Boolean(filterParamName);
        }
    }

    updateHideTrigger(hideTrigger) {
        this.element.classList[hideTrigger ? 'add' : 'remove']('b-hide-trigger');
    }

    //region Getters/setters

    updateKeyStrokeFilterDelay(delay) {
        const me = this;

        if (delay) {
            me.filterList = me.buffer(me.doFilter, delay);
        }
    }

    updateReadOnly(readOnly) {
        super.updateReadOnly(...arguments);

        // Disable closing (removing) chips when we are read-only.
        this._chipView && (this._chipView.closable = !readOnly);
    }

    updateFilterOperator(filterOperator) {
        if (this.primaryFilter) {
            this.primaryFilter.operator = filterOperator;
        }
    }

    get minChars() {
        const minChars = this._minChars;

        if (minChars != null) {
            return minChars;
        }

        // If it's not actually set, default differently for remote filtering.
        return this.remoteFilter ? 4 : 1;
    }

    get items() {
        return this.store.allRecords;
    }

    /**
     * Prepares items to work in attached menu (converts strings to items)
     * @private
     */
    changeItems(items) {
        const me = this;

        if (items == null) {
            if (me.store && !me.store.isItemStore) {
                return;
            }
            items = [];
        }

        if (items instanceof Store) {
            me.store = items;
            return;
        }

        const displayField = me.displayField;

        let itemModel,
            valueField = me.valueField,
            storeData;

        if (Array.isArray(items)) {
            storeData = items.map(item => {
                let result = item;

                if (item instanceof Model) {
                    itemModel = item.constructor;
                    if (!valueField) {
                        me.valueField = valueField = itemModel.idField;
                    }
                }
                else {
                    if (typeof item === 'string' || typeof item === 'number') {
                        if (!valueField) {
                            me.valueField = valueField = me.displayField;
                        }
                        result = {
                            [valueField]   : item,
                            [displayField] : item
                        };
                    }
                    else {
                        if (!valueField) {
                            me.valueField = valueField = 'value';
                        }
                        if (Array.isArray(item)) {
                            result = {
                                [valueField]   : item[0],
                                [displayField] : item[1]
                            };
                        }
                    }
                }

                if (item.selected) {
                    me.value = result;
                }
                return result;
            });
        }
        // Must be a value -> text map
        else {
            if (!valueField) {
                me.valueField = valueField = 'value';
            }

            storeData = [];

            Object.entries(items).forEach(([key, value]) => {
                storeData.push({
                    [valueField]   : key,
                    [displayField] : value
                });
            });
        }

        // Allow reconfiguring with a new set of items
        if (me.store) {
            me.store.data = storeData;
        }
        else {
            const valueFieldDefinition = valueField === displayField ? {
                name       : 'value',
                dataSource : displayField
            } : valueField;

            me.store = new Store({
                isItemStore : true,
                data        : storeData,
                idField     : valueField,
                modelClass  : itemModel || class extends Model {
                    static get idField() {
                        // Need to use instance var and not rely on closure for cases where valueField changes
                        // (like first assigning [] and then ['a'] without configured valueField
                        return me.valueField;
                    }

                    static set idField(idField) {
                        super.idField = idField;
                    }

                    static get fields() {
                        return [valueFieldDefinition, displayField];
                    }
                }
            });
        }
    }

    get value() {
        const
            me                              = this,
            { valueCollection, valueField } = me;

        if (valueField == null) {
            return me.multiSelect ? valueCollection.values.slice() : valueCollection.first;
        }

        let value;

        if (me.multiSelect) {
            value = valueCollection.count ? valueCollection.map(r => r[valueField]) : (me._lastValue || []);
        }
        else {
            value = valueCollection.count ? valueCollection.first[valueField] : me._lastValue;
        }

        return value;
    }

    set value(value) {
        super.value = value;
    }

    changeValue(value, oldValue) {
        const me = this;

        if (value === oldValue) {
            // Sync without highlight
            me.syncInputFieldValue(true);
            return;
        }

        if (!me.multiSelect && Array.isArray(value) && value.length > 1) {
            throw new Error('Multiple values cannot be set to a non-multiSelect Combo');
        }

        // This forces promotion of the items config into a Store if it has not already been injected
        me.triggerConfig('items');

        const
            {
                valueField,
                displayField,
                store,
                valueCollection,
                _picker
            }            = me,
            { storage }  = store,
            hidePicker   = me.hidePickerOnSelect ?? !me.multiSelect,
            isUserAction = me._isUserAction || _picker?._isUserAction || hidePicker && me.pickerVisible || false;

        // if not remoteFilter mode and AjaxStore has been used, try again to set a value after first store loading
        if (!me.remoteFilter && store.isAjaxStore && !store.count) {
            store.on('load', () => me.value = value, { once : true, thisObj : me });
            // save value to make sure getter returns the correct data fot multiSelect while data loading
            me._lastValue = value;
            return;
        }
        // It's a remote filter store, so we have to do a filter down to just match(es)
        // and add the result to the valueCollection
        if (me.remoteFilter) {
            // The null case will drop through and be processed as for local just by clearing the valueCollection
            if (value != null) {

                if (Objects.isObject(value) || value.isModel) {
                    this.store.data = [value];
                    this.valueCollection.splice(0, this.valueCollection.count, this.store.first);
                }
                else {
                    const wasConfiguring = me.isConfiguring;

                    me.primaryFilter.setConfig({
                        value,
                        disabled : false
                    });

                    store.performFilter(true).then(() => {
                        const { isConfiguring } = me;

                        // Carry the wasConfiguring flag from the set value call frame so that
                        // if it's the configuring set value, we do not now fire the change event.
                        me.isConfiguring = wasConfiguring;
                        valueCollection.splice(0, valueCollection.count, store.allRecords);
                        me.isConfiguring = isConfiguring;
                    });
                }
                return;
            }
        }
        // Else, if it's a *locally* filtered store, then
        // unfilter it so we can do the value lookup.
        else if (store.filtered) {
            me.primaryFilter.disabled = true;
            store.filter();
        }

        let record;

        if (value != null) {
            // If value is set as an array, make sure to slice it to not mutate original array below
            const
                arrayPassed = Array.isArray(value),
                values      = arrayPassed ? value.slice() : [value];

            for (let i = 0, len = values.length; i < len; i++) {
                let currentValue = values[i];

                if (currentValue instanceof Model) {
                    // The required record value may not yet be in the store. Add it if not.
                    if (!storage.includes(currentValue)) {
                        store.add(currentValue);
                    }
                }
                else {
                    const isObject = ObjectHelper.isObject(currentValue);

                    // If they passed a data object, match the valueField
                    if (isObject) {
                        currentValue = currentValue[valueField];
                    }

                    // Use the Store Collection's extra indices to quickly find a match.
                    // They may not be found if the current valueCollection state and
                    // filterSelected mean that some are filtered out, so check in
                    // valueCollection if not found in the Store.
                    record =
                        (storage.getBy(displayField, currentValue) ||
                        storage.getBy(valueField, currentValue)) ||
                        (valueCollection.getBy(displayField, currentValue) ||
                        valueCollection.getBy(valueField, currentValue));

                    // If it's a potentially non-unique index (such as the by-displayField index)
                    // then key lookups yield a Set. Use the first entry as the match.
                    if (record instanceof Set) {
                        record = [...record][0];
                    }

                    if (record) {
                        // If the incoming value was a matched object, use it to update the record
                        if (isObject) {
                            record.set(values[i]);
                        }
                        values[i] = record;
                    }
                    else {
                        values.splice(i, 1);
                        len--;
                        i--;
                    }
                }
            }

            const noMatches = !values.length;

            // Remove all old values, add new values in one shot.
            const vcGen = valueCollection.generation;
            valueCollection.splice(0, valueCollection.count, values);

            // If we got no matches, onValueCollectionChange will set the _value to null.
            // Tests specify that the _value should be set to the incoming unmatched value.
            // Handle the case that an array was passed.
            if (noMatches) {
                me._value = arrayPassed ? (value[0] ?? null) : value;
                // _lastValue has to be updated here to have an actual value for syncInputFieldValue() and syncEmpty() below
                me._lastValue = me._value;
            }

            // If no change has fed through to onValueCollectionChange, just ensure the input matches.
            // Must be done last so that the fallback of using this._value if the passed value did
            // not match a record can be used.
            if (noMatches || valueCollection.generation === vcGen) {
                me.syncInputFieldValue();
            }

            me.syncEmpty();

            // If there were matches, onValueCollectionChange would have triggered the change event.
            // If not, we trigger it here.
            if (noMatches && !me.isConfiguring) {
                me.triggerFieldChange({
                    value,
                    oldValue,
                    userAction : isUserAction,
                    valid      : me.isValid
                });
            }
        }
        else {
            if (valueCollection.count) {
                valueCollection.clear();
            }
            else {
                const oldValue = me._value;

                // Cache the value for use by our change handler next time, and also so that
                // when get value yields null, the fallback to ._value will be correct
                me._value = null;

                me.syncInputFieldValue();
                me.syncEmpty();
                if (!me.isConfiguring) {
                    me.triggerFieldChange({
                        value,
                        oldValue,
                        userAction : isUserAction,
                        valid      : me.isValid
                    });
                }
            }
        }

        me._lastValue = me._value;
    }

    hasChanged(oldValue, newValue) {
        if (this.multiSelect) {
            return !ObjectHelper.isEqual(oldValue, newValue);
        }

        return super.hasChanged(...arguments);
    }

    onComboStoreChange({ action }) {
        // Local filter-on-type is happening, do not sync the input value.
        if (action !== 'filter') {
            this.syncInputFieldValue(true);
        }
    }

    syncInputFieldValue(skipHighlight) {
        // We only sync the input's value if we are not using the chip view (DependencyField).
        // If we are multiselecting, our value is represented by a ChipView.
        // The ChipView automatically syncs itself with our valueCollection.
        if (!this.usesChipView) {
            super.syncInputFieldValue(skipHighlight);
        }
    }

    get usesChipView() {
        return Boolean(this.multiSelect && this._chipView);
    }

    /**
     * Returns `true` if this field has no selected records.
     * @property {Boolean}
     * @readonly
     */
    get isEmpty() {
        return this.valueCollection.count === 0;
    }

    get inputValue() {
        // This must be evaluated first, and NOT moved to be directly used as the
        // second expression in the ternary. If called during configuration, this
        // will import the configured value from the config object and ensure the
        // value is matched against the store, and that the "selected" property is set.
        const me = this;

        let result = me.selected ? me.selected[me.displayField] : me.value;

        if (me.displayValueRenderer) {
            result = me.callback(me.displayValueRenderer, me, [me.selected, me]);
        }

        return result == null ? '' : result;
    }

    /**
     * A {@link Core/util/Collection} which holds the currently selected records
     * from the store which dictates this field's value.
     *
     * Usually, this will contain one record, the record selected.
     *
     * When {@link #config-multiSelect} is `true`, there may be several records selected.
     * @member {Core.util.Collection} valueCollection
     * @readonly
     */
    changeValueCollection(valueCollection, oldValueCollection) {
        oldValueCollection?.destroy();

        if (valueCollection) {
            if (!valueCollection.isCollection) {
                valueCollection = new Collection({
                    listeners : {
                        noChange : 'onValueCollectionNoChange',
                        change   : 'onValueCollectionChange',
                        prio     : -1000, // The ChipView must react to changes first.
                        thisObj  : this
                    }
                });
            }
            return valueCollection;
        }
    }

    changePrimaryFilter(primaryFilter) {
        if (!(primaryFilter instanceof Filter)) {
            if (typeof primaryFilter === 'function') {
                primaryFilter = {
                    filterBy : primaryFilter
                };
            }

            // This is the filter that performs filtering on typing.
            primaryFilter = new Filter({
                // Need an id to replace any existing combo filter on the store.
                // Dodge pre-commit hook by quoting property:
                'id' : 'primary',  // eslint-disable-line quote-props

                disabled      : true,
                property      : this.displayField,
                operator      : this.filterOperator,
                caseSensitive : this.caseSensitive,

                ...primaryFilter
            });
        }

        return primaryFilter;
    }

    changeStore(store) {
        if (Array.isArray(store)) {
            this.items = store;
            return;
        }

        if (store) {
            if (typeof store === 'string') {
                store = Store.getStore(store);
            }
            else if (ObjectHelper.isObject(store)) {
                store = new (store.readUrl ? AjaxStore : Store)(store);
                this.destroyStore = true;
            }

            const
                me = this,
                remoteFilter = me.remoteFilter || store.restfulFilter,
                { filterParamName, valueCollection } = me,
                storeFilters = [];

            if (remoteFilter && filterParamName) {
                store.filterParamName = filterParamName;

                if (me.encodeFilterParams) {
                    store.encodeFilterParams = me.encodeFilterParams;
                }
            }

            // If no value field provided, read it off of the Store's modelClass
            // Unless we want to use full record as the value
            if (!me.valueField && !me.usingRecordAsValue) {
                me.valueField = store.modelClass.idField;
            }

            storeFilters.push(me.primaryFilter);

            if (remoteFilter) {
                if (me.filterSelected) {
                    store.storage.autoFilter = true;
                    store.storage.addFilter({
                        id       : `${me.id}-selected-filter`,
                        filterBy : r => !valueCollection.includes(r)
                    });
                }
            }
            else if (me.filterSelected) {
                me.selectedItemsFilter = r => !valueCollection.includes(r);
                storeFilters.push(me.selectedItemsFilter);
                store.reapplyFilterOnAdd = true;
            }

            // Allow fast lookup in the valueCollection by value or displayed value.
            // We add these now because we are now guaranteed to have inferred
            // displayField and startField from any passed items array items is
            // promoted to a Store.
            valueCollection.addIndex({
                property : me.displayField,
                unique   : false
            });
            valueCollection.addIndex({
                property : me.valueField,
                unique   : true
            });

            store.filter(storeFilters);
        }

        return store;
    }

    updateStore(store, oldStore) {
        const
            me = this,
            { _picker } = me;

        let storeListeners;

        if (this.destroyStore && oldStore) {
            oldStore.destroy();
        }

        if (_picker) {
            _picker.store = store;
        }

        // Allow fast lookup by value or displayed value
        store.storage.addIndex({
            property : me.displayField,
            unique   : false
        });
        store.storage.addIndex({
            property : me.valueField,
            unique   : true
        });

        if (me.remoteFilter) {
            storeListeners = {
                filter : 'onRemoteFilter'
            };
        }

        if (me.displayValueRenderer) {
            (storeListeners || (storeListeners = {})).change = 'onComboStoreChange';
            me.syncInputFieldValue();
        }

        me.detachListeners('store');

        // Make sure we don't hold on to old records when store is changed
        // + update value collection with records from new store
        if (oldStore) {
            const oldValue = me.value;
            me.isConfiguring = true;
            me.value = null;
            me.isConfiguring = false;
            me.value = oldValue;
        }

        if (storeListeners) {
            storeListeners.name = 'store';
            storeListeners.thisObj = me;

            store.on(storeListeners);
        }
    }

    get remoteFilter() {
        // Don't use "this.store" since we need to run during changeStore()
        return Boolean(this.filterParamName || this._store?.restfulFilter);
    }

    /**
     * Get selected record.
     * @property {Core.data.Model[]}
     * @readonly
     */
    get record() {
        return this.selected;
    }

    /**
     * Get the selected record(s).
     * @property {Core.data.Model[]}
     * @readonly
     */
    get records() {
        return this.valueCollection.values.slice();
    }

    get selected() {
        return this.valueCollection.first;
    }

    //endregion

    //region Value handling

    /**
     * Check if field value is valid
     * @internal
     */
    onEditComplete() {
        const me             = this,
            selectionCount = me.valueCollection.count;

        super.onEditComplete();

        // Ensure the input area matches the selected value
        if (selectionCount) {
            me.clearError(errorValidateFilter);
            me.syncInputFieldValue();
        }
        if (me.required && !selectionCount) {
            me.setError(errorFieldRequired);
        }
    }

    //endregion

    //region Events

    /**
     * User clicked trigger icon, toggle list.
     * @private
     */
    onTriggerClick() {
        const me = this;

        // Bail out if enter key is required to trigger a filter
        if (me.remoteFilter && me.filterOnEnter) {
            return;
        }

        if (me.pickerVisible) {
            me.hidePicker();
        }
        else {
            if (!me.readOnly && !me.disabled) {
                switch (me.triggerAction?.toLowerCase()) {
                    case 'all':
                        me.doFilter(null);
                        break;
                    case 'last':
                        me.doFilter(me.lastQuery);
                        break;
                    default:
                        me.doFilter(me.input.value);
                }
            }
        }
    }

    /**
     * User types into input field in editable combo, show list and filter it.
     * @private
     */
    internalOnInput(event) {
        const me       = this,
            value    = me.input.value,
            inputLen = value.length;

        // IE11 triggers input event on focus for some reason, ignoring it if not editable
        if (!me.editable) {
            return;
        }

        me.syncEmpty();
        me.syncInputWidth();

        me.inputting = true;

        if (inputLen >= me.minChars && !me.filterOnEnter) {
            me.filterList(value);
        }
        else {
            // During typing, the field is invalid
            if (me.validateFilter && !me.remoteFilter) {
                me[inputLen ? 'setError' : 'clearError'](errorValidateFilter);
            }
            me.hidePicker();
        }
        me.inputting = false;

        /**
         * User typed into the field. Please note that the value attached to this event is the raw input field value and
         * not the combos value
         * @event input
         * @param {Core.widget.Combo} source The combo
         * @param {String} value Raw input value
         */
        me.trigger('input', { value, event });
    }

    syncInputWidth() {
        const me = this;

        if (me.usesChipView) {
            const
                input        = me.input,
                // padding on the input el won't change, so cache the measurement:
                inputPadding = me._inputPadding ||
                    (me._inputPadding = DomHelper.getEdgeSize(input, 'padding', 'lr')),
                value        = input.value || '',
                width        =
                    // +'W' to avoid text getting clipped or horizontal scrolling
                    DomHelper.measureText(value + 'W', input, false, me.element) +
                    inputPadding.width;

            // Normally the input is given "flex: 1 1 0px" so it will fill the space
            // so we just need to adjust the flex-basis to ensure the input is at least
            // as long as the text. Since it is also flex-shrink, it will not become
            // any larger than one "row".
            input.style.flex = `1 1 ${Math.ceil(width)}px`;
        }
    }

    // This is potentially a buffered function to respond to keystrokes in a buffered manner.
    // This only becomes useful as a saving when using remote querying where each filter is an Ajax request.
    filterList(queryString) {
        this.doFilter(queryString);
    }

    doFilter(queryString) {
        const
            me = this,
            {
                store,
                _picker : picker
            } = me,
            disableFilter = queryString == null || queryString === '';

        me.lastQuery = queryString;

        me.primaryFilter.setConfig({
            value    : queryString,
            disabled : disableFilter
        });

        if (me.remoteFilter) {
            store.clear(true);
        }

        // Force the lazy config to create picker since the List needs to add its beforeLoad listener
        // showing a mask in case of remote filtering
        me.getConfig('picker');

        store.filter();

        if (picker?.isVisible) {
            // If aligned above, filtering will change its height so will need realigning
            if (picker.lastAlignSpec.zone === 0) {
                picker.realign();
            }
        }
        else {
            me.showPicker();
        }

        if (store.count) {
            // If we are filtering, activate the first match
            if (!disableFilter) {
                me.picker.navigator.activeItem = 0;
            }
        }
        // If we were actively *locally* filtering on a string but there were no matches
        // and we are validateFilter: true, then mark as invalid even though we
        // may have an underlying valid selected value.
        else if (!me.remoteFilter && !disableFilter && me.validateFilter) {
            me.setError(errorValidateFilter);
        }
    }

    onRemoteFilter() {
        const
            me     = this,
            picker = me._picker;

        // If we are filtering, activate the first match
        if (me.store.count) {
            if (picker) {
                picker.navigator.activeItem = 0;
            }
        }
        // Invalid if no matches after filtering
        else {
            if (me.validateFilter) {
                me.setError(errorValidateFilter);
            }
        }

        // If we have selection, evict selected items from the newly remote-filtered list
        if (me.filterSelected && me.valueCollection.count) {
            me.store.storage.onFiltersChanged();

            // Store does not react to Collection filtering yet because it does its own filtering and
            // then fires its own event. So we have to refresh the picker to hide the selected items.
            if (picker) {
                picker.refresh();
            }
        }
    }

    /**
     * This reacts to our {@link #property-valueCollection} being mutated in any way.
     * The `change`, `select` and `action` events are fired here.
     *
     * This could happen in four ways:
     *
     *  - User selected or deselected an item in the dropdown list.
     *  - `set value` changes the content.
     *  - The {@link #config-multiSelect} Chip view (which uses this in its store) deletes a record.
     *  - The application programmatically mutates the {@link #property-valueCollection}.
     *
     * @private
     */
    onValueCollectionChange({ source : valueCollection }) {
        const me              = this,
            { multiSelect, _picker } = me,
            hidePicker      = me.hidePickerOnSelect ?? !multiSelect,
            record          = multiSelect ? valueCollection.values.slice() : valueCollection.first,
            records         = valueCollection.values.slice(),
            isUserAction    = me._isUserAction || _picker?._isUserAction || hidePicker && me.pickerVisible || false,
            oldValue        = me._value;

        if (hidePicker) {
            me.hidePicker();
        }

        if (!valueCollection.count && me.required) {
            me.setError(errorFieldRequired);
        }
        else {
            me.clearError(errorFieldRequired);
            me.clearError(errorValidateFilter);
        }

        if (me.validateFilter && record) {
            me.clearError(errorValidateFilter);
        }

        // Re-evaluate *local* filtering so that selected items are filtered out of the dropdown.
        // For remote filtering, we programmatically add a filter to the store's storage
        if (me.filterSelected) {
            if (me.remoteFilter) {
                me.store.storage.onFiltersChanged();

                // Store does not react to Collection filtering yet because it does its own filtering and
                // then fires its own event. So we have to refresh the picker to hide the selected items.
                if (me._picker) {
                    me._picker.refresh();
                }
            }
            else {
                me.store.filter();
            }
        }

        // Clear the cached value so that there's no fallback when we read back the value below
        me._value = null;
        me._lastValue = null;

        // Cache the value for use by our change handler next time, and also so that
        // if we just cleared the valueCollection, the fallback to ._value will be correct
        const value = me.cacheCurrentValue(me.value);

        me.syncInputFieldValue();
        me.syncEmpty();

        if (!me.isConfiguring) {
            me.triggerFieldChange({
                value,
                oldValue,
                userAction : isUserAction,
                valid      : me.isValid
            });

            /**
             * An item in the list was selected
             * @event select
             * @param {Core.widget.Combo} source The combo
             * @param {Core.data.Model} record Selected record
             * @param {Core.data.Model[]} records Selected records as an array if {@link #config-multiSelect} is `true`
             * @param {Boolean} userAction `true` if the value change is due to user interaction.
             */
            me.trigger('select', { record, records, userAction : isUserAction });

            /**
             * Th default action was performed (an item in the list was selected)
             * @event action
             * @param {Core.widget.Combo} source The combo
             * @param {*} value The {@link #config-valueField value} of the selected record
             * @param {Core.data.Model} record Selected record
             * @param {Core.data.Model[]} records Selected records as an array if {@link #config-multiSelect} is `true`
             * @param {Boolean} userAction `true` if the value change is due to user interaction.
             */
            if (me.defaultAction === 'select') {
                me.trigger('action', { value, record, records, userAction : isUserAction });
            }
        }
    }

    // Caching a copy of current value, which can be changed by subclasses (see AssignmentField for reference)
    cacheCurrentValue(v) {
        return this._value = v;
    }

    /**
     * This listens for when a record from the list is selected, but is already part of
     * the selection and so the {@link #property-valueCollection} rejects that as a no-op.
     * At this point, the user will still expect the picker to hide.
     * @param {Object} event The noChange event containing the splice parameters
     * @private
     */
    onValueCollectionNoChange({ toAdd }) {
        if (!this.multiSelect && toAdd.length && this.pickerVisible) {
            this.picker.hide();
        }
    }

    //endregion

    //region Picker

    showPicker() {
        const
            me         = this,
            { picker } = me;

        if (me.readOnly) {
            return;
        }

        picker.multiSelect = me.multiSelect;

        super.showPicker();

        // Once we have access to the anchor size, overlay the anchor pointer over the target if configured to do so.
        if (me.overlayAnchor && !picker.align.offset) {
            picker.align.offset = -picker.anchorSize[1];
            picker.realign();
        }

        // Activate and make visible the *single* selected item.
        // Not valid if multiselect because the user's interest will not be focused on any one item.
        if (!me.multiSelect && me.selected) {
            picker.restoreActiveItem(me.selected, true);
        }

        me.input.focus();
    }

    /**
     * Creates default picker widget
     *
     * @internal
     */
    changePicker(picker, oldPicker) {
        const
            me              = this,
            pickerWidth     = me.pickerWidth || picker?.width;

        picker = List.reconfigure(oldPicker, picker ? List.mergeConfigs({
            owner       : me,
            store       : me.store,
            selected    : me.valueCollection,
            multiSelect : me.multiSelect,
            cls         : me.listCls,
            itemTpl     : me.listItemTpl || (record => StringHelper.encodeHtml(record[me.displayField])),
            forElement  : me[me.pickerAlignElement],
            align       : {
                matchSize : pickerWidth == null,
                anchor    : me.overlayAnchor,
                target    : me[me.pickerAlignElement],
                // Reasonable minimal height to fit few combo items below the combo.
                // When height is not enough, list will appear on top. That works for windows higher than 280px,
                // worrying about shorter windows sounds overkill.
                // We cannot use relative measures here, each combo list item is ~40px high
                minHeight : Math.min(3, me.store.count) * 40
            },
            width     : pickerWidth,
            navigator : {
                keyEventTarget : me.input
            }
        }, picker) : null, me);

        picker && (picker.element.dataset.emptyText = me.emptyText || me.L('L{noResults}'));

        return picker;
    }

    onPickerHide() {
        const me = this;

        super.onPickerHide();

        // https://app.assembla.com/spaces/bryntum/tickets/7736
        if (me.multiSelect && me.clearTextOnPickerHide) {
            me.input.value = '';
        }
    }

    //endregion

    internalOnKeyEvent(keyEvent) {
        const
            me       = this,
            value    = me.input.value,
            inputLen = value.length;

        super.internalOnKeyEvent(...arguments);

        if (keyEvent.type === 'keydown' && keyEvent.key === 'Enter' && me.filterOnEnter && inputLen >= me.minChars) {
            keyEvent.stopPropagation();
            me.filterList(value);
        }
    }
}

class ComboChipView extends ChipView {
    static get $name() {
        return 'ComboChipView';
    }

    static get type() {
        return 'combochipview';
    }

    static get defaultConfig() {
        return {
            closeHandler : 'up.onChipClose',

            itemsFocusable : false,

            multiSelect : true,

            itemTpl(record) {
                return StringHelper.encodeHtml(record[this.owner.displayField]);
            },

            scrollable : {
                overflowY : 'auto'
            }
        };
    }
}

class ComboChipNavigator extends Navigator {
    static get defaultConfig() {
        return {
            allowShiftKey : true
        };
    }

    onTargetClick(clickEvent) {
        const item = clickEvent.target.closest(this.itemSelector);

        if (item && !clickEvent.shiftKey && !item.contains(clickEvent.target.closest('[data-noselect]'))) {
            this.ownerCmp.selected.clear();
        }
        // Our own updateActiveItem also selects because on superclass *key* navigation
        // (which is async on scroll end), it sets activeItem, and we select at that time.
        // So set a flag which disables this.
        this.inClickHandler = true;
        this.activeItem = item;
        this.inClickHandler = false;
    }

    onKeyDown(keyEvent) {
        // ENTER does not toggle selectedness in a ChipView.
        // ChipView's selection is bound to navigation.
        if (keyEvent.key !== 'Enter') {
            super.onKeyDown(keyEvent);
        }
    }

    updateActiveItem(activeItem, oldActiveItem) {
        const chipView = this.ownerCmp;

        super.updateActiveItem(activeItem, oldActiveItem);

        // Selection simply follows navigation in a ChipView
        if (activeItem && !this.inClickHandler) {
            chipView.selected.add(chipView.getRecord(activeItem));
        }
    }

    navigatePrevious(keyEvent) {
        const chipView = this.ownerCmp;

        if (chipView.navigator.activeItem && !keyEvent.shiftKey) {
            chipView.selected.clear();
        }
        if (this.previous) {
            super.navigatePrevious(keyEvent);
        }
        else {
            this.activeItem = null;
        }
    }

    navigateNext(keyEvent) {
        const chipView = this.ownerCmp;

        // SHIFT+navigate preserves selection
        if (chipView.navigator.activeItem && !keyEvent.shiftKey) {
            chipView.selected.clear();
        }
        if (this.next) {
            super.navigateNext(keyEvent);
        }
        else {
            this.activeItem = null;
        }
    }
}

// Register this widget type with its Factory
Combo.initClass();
ComboChipView.initClass();
