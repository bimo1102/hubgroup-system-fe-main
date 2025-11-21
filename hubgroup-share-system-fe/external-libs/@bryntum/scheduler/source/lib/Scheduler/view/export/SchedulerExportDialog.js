import DateHelper from '../../../Core/helper/DateHelper.js';
import GridExportDialog from '../../../Grid/view/export/ExportDialog.js';
import { ScheduleRange } from '../../feature/export/Utils.js';
import '../../view/export/field/ScheduleRangeCombo.js';
import Field from '../../../Core/widget/Field.js';

/**
 * @module Scheduler/view/export/SchedulerExportDialog
 */

/**
 * Extends the Grid's {@link Grid.view.export.ExportDialog} and adds a few extra fields specific to the scheduler.
 *
 * ## Default widgets
 *
 * The default widgets of this dialog are:
 *
 * | Widget ref             | Type                                     | Weight | Description                                          |
 * |------------------------|------------------------------------------|--------|----------------------------------------------------- |
 * | `columnsField`         | {@link Core.widget.Combo Combo}          | 100    | Choose columns to export                             |
 * | `scheduleRangeField`   | {@link Core.widget.Combo Combo}          | 150    | Choose date range to export                          |
 * | `rangesContainer`      | {@link Core.widget.Container Container}  | 151    | Container for range fields                           |
 * | \>`rangeStartField`    | {@link Core.widget.DateField DateField}  | 10     | Choose date range start                              |
 * | \>`rangeEndField`      | {@link Core.widget.DateField DateField}  | 30     | Choose date range end                                |
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
 * *\> nested items*
 *
 * ## Configuring default widgets
 *
 * Widgets can be customized with {@link Scheduler.feature.export.PdfExport#config-exportDialog} config:
 *
 * ```javascript
 * const scheduler = new Scheduler({
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
 *                     fileFormatField   : { value : 'png' },
 *
 *                     // Configure nested fields
 *                     rangesContainer : {
 *                         items : {
 *                             rangeStartField : { value : new Date() },
 *                             rangeEndField : { value : new Date() }
 *                         }
 *                     }
 *                 }
 *             }
 *         }
 *     }
 * });
 *
 * scheduler.features.pdfExport.showExportDialog();
 * ```
 *
 * ## Using DateTime fields for range start/end
 *
 * This config system is also capable (but not limited to) of changing layout of the container and replacing widget type:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         pdfExport : {
 *             exportDialog : {
 *                 items : {
 *                     rangesContainer : {
 *                         // DateTime fields are longer, so we better lay them out
 *                         // vertically
 *                         layoutStyle : {
 *                             flexDirection : 'column'
 *                         },
 *                         items : {
 *                             rangeStartField : {
 *                                 // Use DateTime widget for ranges
 *                                 type       : 'datetime',
 *
 *                                 // Sync label width with other fields
 *                                 labelWidth : '12em'
 *                             },
 *                             rangeEndField : {
 *                                 type       : 'datetime',
 *                                 labelWidth : '12em'
 *                             },
 *                             // Add a filler widget that would add a margin at the bottom
 *                             filler : {
 *                                 height : '0.6em',
 *                                 weight : 900
 *                             }
 *                         }
 *                     }
 *                 }
 *             }
 *         }
 *     }
 * });
 *
 * ```
 *
 * ## Configuring default columns
 *
 * By default all visible columns are selected in the export dialog. This is managed by
 * {@link #config-autoSelectVisibleColumns} config. To change default selected columns you should disable this config
 * and set field value. Value should be an array of valid column ids (or column instances). This way you can
 * preselect hidden columns:
 *
 * ```javascript
 * const scheduler = new Scheduler({
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
 * scheduler.features.pdfExport.showExportDialog();
 * ```
 *
 * ## Adding fields
 *
 * You can add your own fields to the export dialog. To make such field value acessible to the feature it should follow
 * naming pattern - it should have `ref` config ending with `Field`, see other fields for reference - `orientationField`,
 * `columnsField`, etc. Fields not matching this pattern are ignored. When values are collected from the dialog, `Field`
 * part of the widget reference is removed, so `orientationField` becomes `orientation`, `fooField` becomes `foo`, etc.
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
 * const scheduler = new Scheduler({
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
 * scheduler.features.pdfExport.exportDialog.on({
 *     beforeShow() {
 *         this.widgetMap.columnsField.value = ['age', 'city']
 *     }
 * });
 * ```
 *
 * @extends Grid/view/export/ExportDialog
 */
export default class SchedulerExportDialog extends GridExportDialog {

    //region Config

    static get $name() {
        return 'SchedulerExportDialog';
    }

    static get type() {
        return 'schedulerexportdialog';
    }

    static get configurable() {
        return {
            defaults : {
                localeClass : this
            },
            items : {
                scheduleRangeField : {
                    type   : 'schedulerangecombo',
                    label  : 'L{Schedule range}',
                    value  : 'completeview',
                    weight : 150,
                    onChange({ value }) {
                        this.parent.widgetMap.rangesContainer.hidden = value !== ScheduleRange.daterange;
                    }
                },
                rangesContainer : {
                    type     : 'container',
                    flex     : '1 0 100%',
                    weight   : 151,
                    hidden   : true,
                    defaults : {
                        localeClass : this
                    },
                    items : {
                        filler : {
                            // Filler widget to align date fields
                            weight : 0,
                            type   : 'widget'
                        },
                        rangeStartField : {
                            type       : 'datefield',
                            label      : 'L{Export from}',
                            labelWidth : '3em',
                            flex       : '1 0 25%',
                            weight     : 10,
                            onChange({ value }) {
                                this.parent.widgetMap.rangeEndField.min = DateHelper.add(value, 1, 'd');
                            }
                        },
                        filler2 : {
                            // Another filler to move label further from previous field
                            type   : 'widget',
                            weight : 20,
                            width  : '0.5em'
                        },
                        rangeEndField : {
                            type       : 'datefield',
                            label      : 'L{Export to}',
                            labelWidth : '1em',
                            flex       : '1 0 25%',
                            weight     : 30,
                            onChange({ value }) {
                                this.parent.widgetMap.rangeStartField.max = DateHelper.add(value, -1, 'd');
                            }
                        }
                    }
                }
            }
        };
    }

    //endregion

    onLocaleChange() {
        const
            labelWidth = this.L('labelWidth');

        this.width = this.L('L{width}');

        this.items.forEach(widget => {
            if (widget instanceof Field) {
                widget.labelWidth = labelWidth;
            }
            else if (widget.ref === 'rangesContainer') {
                widget.items[0].width = labelWidth;
            }
        });
    }

    applyInitialValues(config) {
        super.applyInitialValues(config);

        const
            me                   = this,
            {
                client,
                scheduleRange
            }                    = config,
            items                = config.items = config.items || {},
            scheduleRangeField   = items.scheduleRangeField = items.scheduleRangeField || {},
            rangesContainer      = items.rangesContainer = items.rangesContainer || {},
            rangesContainerItems = rangesContainer.items = rangesContainer.items || {},
            filler               = rangesContainerItems.filler = rangesContainerItems.filler || {},
            rangeStartField      = rangesContainerItems.rangeStartField = rangesContainerItems.rangeStartField || {},
            rangeEndField        = rangesContainerItems.rangeEndField = rangesContainerItems.rangeEndField || {};

        filler.width = me.L('labelWidth');

        scheduleRangeField.value = scheduleRangeField.value || scheduleRange;

        if (scheduleRangeField.value === ScheduleRange.daterange) {
            rangesContainer.hidden = false;
        }

        const rangeStart = rangeStartField.value = rangeStartField.value || client.startDate;
        rangeStartField.max = DateHelper.max(client.startDate, DateHelper.add(client.endDate, -1, 'd'));

        let rangeEnd = rangeEndField.value || client.endDate;

        // This is the only place where we can validate date range before it gets to export feature
        if (rangeEnd <= rangeStart) {
            rangeEnd = DateHelper.add(rangeStart, 1, 'd');
        }

        rangeEndField.value = rangeEnd;
        rangeEndField.min   = DateHelper.min(client.endDate, DateHelper.add(client.startDate, 1, 'd'));
    }
}
