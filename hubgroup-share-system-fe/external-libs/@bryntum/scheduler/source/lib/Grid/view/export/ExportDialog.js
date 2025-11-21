import Popup from '../../../Core/widget/Popup.js';
import LocaleManager from '../../../Core/localization/LocaleManager.js';
import './field/ExportRowsCombo.js';
import './field/ExportOrientationCombo.js';
import './field/LocalizableCombo.js';
import { FileFormat, PaperFormat } from '../../feature/export/Utils.js';
import Checkbox from '../../../Core/widget/Checkbox.js';
import Field from '../../../Core/widget/Field.js';

function buildComboItems(obj, fn = x => x) {
    return Object.keys(obj).map(key => ({ id : key, text : fn(key) }));
}

/**
 * @module Grid/view/export/ExportDialog
 */

/**
 * Dialog window used by the {@link Grid.feature.export.PdfExport pdf export feature}. It allows users to select export
 * options like paper format and columns to export. This dialog contains a number of predefined
 * {@link Core.widget.Field fields} which you can access through the popup's {@link #property-widgetMap}.
 *
 * ## Default widgets
 *
 * The default widgets of this dialog are:
 *
 * | Widget ref             | Type                                     | Weight | Description                                          |
 * |------------------------|------------------------------------------|--------|----------------------------------------------------- |
 * | `columnsField`         | {@link Core.widget.Combo Combo}          | 100    | Choose columns to export                             |
 * | `rowsRangeField`       | {@link Core.widget.Combo Combo}          | 200    | Choose which rows to export                          |
 * | `exporterTypeField`    | {@link Core.widget.Combo Combo}          | 300    | Type of the exporter to use                          |
 * | `alignRowsField`       | {@link Core.widget.Checkbox Checkbox}    | 400    | Align row top to the page top on every exported page |
 * | `repeatHeaderField`    | {@link Core.widget.Checkbox Checkbox}    | 500    | Toggle repeating headers on / off                    |
 * | `fileFormatField`      | {@link Core.widget.Combo Combo}          | 600    | Choose file format                                   |
 * | `paperFormatField`     | {@link Core.widget.Combo Combo}          | 700    | Choose paper format                                  |
 * | `orientationField`     | {@link Core.widget.Combo Combo}          | 800    | Choose orientation                                   |
 *
 * The default buttons are:
 *
 * | Widget ref             | Type                                     | Weight | Description                                          |
 * |------------------------|------------------------------------------|--------|------------------------------------------------------|
 * | `exportButton`         | {@link Core.widget.Button Button}        | 100    | Triggers export                                      |
 * | `cancelButton`         | {@link Core.widget.Button Button}        | 200    | Cancel export                                        |
 *
 *
 * ## Configuring default widgets
 *
 * Widgets can be customized with {@link Grid.feature.export.PdfExport#config-exportDialog} config
 *
 * ```javascript
 * const grid = new Grid({
 *     features : {
 *         pdfExport : {
 *             exportDialog : {
 *                 items : {
 *                     // hide the field
 *                     orientationField  : { hidden : true },
 *
 *                     // reorder fields
 *                     exporterTypeField : { weight : 150 },
 *
 *                     // change default format in exporter
 *                     fileFormatField   : { value : 'png' }
 *                 }
 *             }
 *         }
 *     }
 * });
 *
 * grid.features.pdfExport.showExportDialog();
 * ```
 *
 * ## Configuring default columns
 *
 * By default all visible columns are selected in the export dialog. This is managed by the
 * {@link #config-autoSelectVisibleColumns} config. To change default selected columns you should disable this config
 * and set field value. Value should be an array of valid column ids (or column instances). This way you can
 * preselect hidden columns:
 *
 * ```javascript
 * const grid = new Grid({
 *     columns : [
 *         { id : 'name', text : 'Name', field : 'name' },
 *         { id : 'age', text : 'Age', field : 'age' },
 *         { id : 'city', text : 'City', field : 'city', hidden : true }
 *     ],
 *     features : {
 *         pdfExport : {
 *             exportDialog : {
 *                 autoSelectVisibleColumns : false,
 *                 items : {
 *                     columnsField : { value : ['name', 'city'] }
 *                 }
 *             }
 *         }
 *     }
 * })
 *
 * // This will show export dialog with Name and City columns selected
 * // even though City column is hidden in the UI
 * grid.features.pdfExport.showExportDialog();
 * ```
 *
 * ## Adding fields
 *
 * You can add your own fields to the export dialog. To make such field value acessible to the feature it should follow
 * a specific naming pattern - it should have `ref` config ending with `Field`, see other fields for reference -
 * `orientationField`, `columnsField`, etc. Fields not matching this pattern are ignored. When values are collected from
 * the dialog, `Field` part of the widget reference is removed, so `orientationField` becomes `orientation`, `fooField`
 * becomes `foo`, etc.
 *
 * ```javascript
 * const grid = new Grid({
 *     features : {
 *         pdfExport : {
 *             exportDialog : {
 *                 items : {
 *                     // This field gets into export config
 *                     fooField : {
 *                         type : 'text',
 *                         label : 'Foo',
 *                         value : 'FOO'
 *                     },
 *
 *                     // This one does not, because name doesn't end with `Field`
 *                     bar : {
 *                         type : 'text',
 *                         label : 'Bar',
 *                         value : 'BAR'
 *                     },
 *
 *                     // Add a container widget to wrap some fields together
 *                     myContainer : {
 *                         type : 'container',
 *                         items : {
 *                             // This one gets into config too despite the nesting level
 *                             bazField : {
 *                                 type : 'text',
 *                                 label : 'Baz',
 *                                 value : 'BAZ'
 *                             }
 *                         }
 *                     }
 *                 }
 *             }
 *         }
 *     }
 * });
 *
 * // Assuming export dialog is opened and export triggered with default values
 * // you can receive custom field values here
 * grid.on({
 *     beforeExport({ config }) {
 *         console.log(config.foo) // 'FOO'
 *         console.log(config.bar) // undefined
 *         console.log(config.baz) // 'BAZ'
 *     }
 * });
 * ```
 *
 * ## Configuring widgets at runtime
 *
 * If you don't know column ids before grid instantiation or you want a flexible config, you can change widget values
 * before dialog pops up:
 *
 * ```javascript
 * const grid = new Grid({
 *     columns : [
 *         { id : 'name', text : 'Name', field : 'name' },
 *         { id : 'age', text : 'Age', field : 'age' },
 *         { id : 'city', text : 'City', field : 'city', hidden : true }
 *     ],
 *     features : {
 *         pdfExport : true
 *     }
 * });
 *
 * // Such listener would ignore autoSelectVisibleColumns config. Similar to the snippet
 * // above this will show Name and City columns
 * grid.features.pdfExport.exportDialog.on({
 *     beforeShow() {
 *         this.widgetMap.columnsField.value = ['age', 'city']
 *     }
 * });
 * ```
 *
 * @extends Core/widget/Popup
 */
export default class ExportDialog extends Popup {

    //region Config

    static get $name() {
        return 'ExportDialog';
    }

    static get type() {
        return 'exportdialog';
    }

    static get configurable() {
        return {
            autoShow  : false,
            autoClose : false,
            closable  : true,
            centered  : true,

            /**
             * Returns map of values of dialog fields.
             * @name values
             * @property {Object}
             * @readonly
             */

            /**
             * Grid instance to build export dialog for
             * @config {Grid.view.Grid}
             */
            client : null,

            /**
             * Set to `false` to not preselect all visible columns when the dialog is shown
             * @config {Boolean}
             */
            autoSelectVisibleColumns : true,

            /**
             * Set to `false` to allow using PNG + Multipage config in export dialog
             * @config {Boolean}
             */
            hidePNGMultipageOption : true,

            title : 'L{exportSettings}',

            defaults : {
                localeClass : this
            },
            items : {
                columnsField : {
                    type         : 'combo',
                    label        : 'L{ExportDialog.columns}',
                    store        : {},
                    valueField   : 'id',
                    displayField : 'text',
                    multiSelect  : true,
                    weight       : 100
                },
                rowsRangeField : {
                    type   : 'exportrowscombo',
                    label  : 'L{ExportDialog.rows}',
                    value  : 'all',
                    weight : 200
                },
                exporterTypeField : {
                    type                : 'localizablecombo',
                    label               : 'L{ExportDialog.exporterType}',
                    editable            : false,
                    value               : 'singlepage',
                    buildLocalizedItems : function() {
                        const dialog = this.parent;

                        return dialog.exporters.map(exporter => ({
                            id   : exporter.type,
                            text : dialog.optionalL(exporter.title, this)
                        }));
                    },
                    onChange({ value }) {
                        this.owner.widgetMap.alignRowsField.hidden    = value === 'singlepage';
                        this.owner.widgetMap.repeatHeaderField.hidden = value !== 'multipagevertical';
                    },
                    weight : 300
                },
                alignRowsField : {
                    type    : 'checkbox',
                    label   : 'L{ExportDialog.alignRows}',
                    checked : false,
                    hidden  : true,
                    weight  : 400
                },
                repeatHeaderField : {
                    type        : 'checkbox',
                    label       : 'L{ExportDialog.repeatHeader}',
                    localeClass : this,
                    hidden      : true,
                    weight      : 500
                },
                fileFormatField : {
                    type        : 'combo',
                    label       : 'L{ExportDialog.fileFormat}',
                    localeClass : this,
                    editable    : false,
                    value       : 'pdf',
                    items       : [],
                    onChange({ value, oldValue }) {
                        const dialog = this.parent;
                        if (dialog.hidePNGMultipageOption) {
                            const
                                exporterField = dialog.widgetMap.exporterTypeField,
                                exporter      = exporterField.store.find(r => r.id === 'singlepage');

                            if (value === FileFormat.png && exporter) {
                                this._previousDisabled = exporterField.disabled;
                                exporterField.disabled = true;

                                this._previousValue = exporterField.value;
                                exporterField.value = 'singlepage';
                            }
                            else if (oldValue === FileFormat.png && this._previousValue) {
                                exporterField.disabled = this._previousDisabled;
                                exporterField.value    = this._previousValue;
                            }
                        }
                    },
                    weight : 600
                },
                paperFormatField : {
                    type     : 'combo',
                    label    : 'L{ExportDialog.paperFormat}',
                    editable : false,
                    value    : 'A4',
                    items    : [],
                    weight   : 700
                },
                orientationField : {
                    type   : 'exportorientationcombo',
                    label  : 'L{ExportDialog.orientation}',
                    value  : 'portrait',
                    weight : 800
                }
            },
            bbar : {
                defaults : {
                    localeClass : this
                },
                items : {
                    exportButton : {
                        color   : 'b-green',
                        text    : 'L{ExportDialog.export}',
                        weight  : 100,
                        onClick : 'up.onExportClick'
                    },
                    cancelButton : {
                        color   : 'b-gray',
                        text    : 'L{ExportDialog.cancel}',
                        weight  : 200,
                        onClick : 'up.onCancelClick'
                    }
                }
            }
        };
    }

    //endregion

    construct(config = {}) {
        const
            me         = this,
            { client } = config;

        if (!client) {
            throw new Error('`client` config is required');
        }

        me.columnsStore = client.columns.chain(column => column.isLeaf && column.exportable);

        me.applyInitialValues(config);

        super.construct(config);

        LocaleManager.on({
            locale  : 'onLocaleChange',
            prio    : -1,
            thisObj : me
        });
    }

    applyInitialValues(config) {
        const
            me    = this,
            items = config.items = config.items || {};

        config.width               = config.width || me.L('L{width}');
        config.defaults            = config.defaults || {};
        config.defaults.labelWidth = config.defaults.labelWidth || me.L('L{ExportDialog.labelWidth}');

        items.columnsField     = items.columnsField || {};
        items.fileFormatField  = items.fileFormatField || {};
        items.paperFormatField = items.paperFormatField || {};

        items.fileFormatField.items  = buildComboItems(FileFormat, value => value.toUpperCase());
        items.paperFormatField.items = buildComboItems(PaperFormat);

        items.columnsField.store = me.columnsStore;
    }

    onBeforeShow() {
        const { columnsField, alignRowsField, exporterTypeField, repeatHeaderField } = this.widgetMap;

        if (this.autoSelectVisibleColumns) {
            columnsField.value = this.columnsStore.query(c => !c.hidden);
        }
        alignRowsField.hidden    = exporterTypeField.value === 'singlepage';
        repeatHeaderField.hidden = exporterTypeField.value !== 'multipagevertical';

        super.onBeforeShow?.(...arguments);
    }

    onLocaleChange() {
        const
            labelWidth = this.L('L{labelWidth}');

        this.width = this.L('L{width}');

        this.eachWidget(widget => {
            if (widget instanceof Field) {
                widget.labelWidth = labelWidth;
            }
        });
    }

    onExportClick() {
        const values = this.values;

        /**
         * Fires when export button is clicked
         * @event export
         * @param {Object} values Object containing config for {@link Grid.feature.export.PdfExport#function-export export()} method
         * @category Export
         */
        this.trigger('export', { values });
    }

    onCancelClick() {
        /**
         * Fires when cancel button is clicked. Popup will hide itself.
         * @event cancel
         * @category Export
         */
        this.trigger('cancel');
        this.hide();
    }

    get values() {
        const
            fieldRe = /field/i,
            result  = {};

        this.eachWidget(widget => {
            if (fieldRe.test(widget.ref)) {
                result[widget.ref.replace(fieldRe, '')] = widget instanceof Checkbox ? widget.checked : widget.value;
            }
        });

        return result;
    }
}

ExportDialog.initClass();
