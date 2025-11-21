import SchedulerBase from './SchedulerBase.js';

import '../localization/En.js';

// default features
import '../feature/ColumnLines.js';
import '../feature/EventContextMenu.js'; // TODO: 'eventContextMenu' is deprecated. Please see https://bryntum.com/docs/scheduler/#guides/upgrades/4.0.0.md for more information.
import '../feature/EventCopyPaste.js';
import '../feature/EventDrag.js';
import '../feature/EventDragCreate.js';
import '../feature/EventEdit.js';
import '../feature/EventFilter.js';
import '../feature/EventMenu.js';
import '../feature/EventResize.js';
import '../feature/EventTooltip.js';
import '../feature/HeaderContextMenu.js'; // TODO: 'headerContextMenu' is deprecated. Please see https://bryntum.com/docs/scheduler/#guides/upgrades/4.0.0.md for more information.
import '../feature/ScheduleContext.js';
import '../feature/ScheduleContextMenu.js'; // TODO: 'scheduleContextMenu' is deprecated. Please see https://bryntum.com/docs/scheduler/#guides/upgrades/4.0.0.md for more information.
import '../feature/ScheduleMenu.js';
import '../feature/ScheduleTooltip.js';
import '../feature/StickyEvents.js';
import '../feature/TimeAxisHeaderMenu.js';

// Since Scheduler is based on SchedulerBase + GridBase, Grids default features needs to be pulled in here also
import '../../Grid/feature/CellEdit.js';
import '../../Grid/feature/CellMenu.js';
import '../../Grid/feature/ColumnDragToolbar.js';
import '../../Grid/feature/ColumnPicker.js';
import '../../Grid/feature/ColumnReorder.js';
import '../../Grid/feature/ColumnResize.js';
import '../../Grid/feature/ContextMenu.js'; // TODO: 'contextMenu' is deprecated. Please see https://bryntum.com/docs/grid/#guides/upgrades/4.0.0.md for more information.
import '../../Grid/feature/Filter.js';
import '../../Grid/feature/FilterBar.js';
import '../../Grid/feature/Group.js';
import '../../Grid/feature/HeaderMenu.js';
import '../../Grid/feature/Sort.js';
import '../../Grid/feature/Stripe.js';
import '../../Grid/column/CheckColumn.js'; // For checkbox selection mode

/**
 * @module Scheduler/view/Scheduler
 */

/**
 * The Scheduler widget is a very powerful and performant UI component that displays an arbitrary number of "locked"
 * columns with a schedule occupying the remaining space. The schedule has a timeaxis at the top, one row per resource
 * and any number of events per resource.
 *
 * ## Intro
 * The Scheduler widget has a wide range of features and a large API to allow users to work with it efficiently in the
 * browser.
 *
 * The timeaxis displayed at the top of the Scheduler is configured using a {@link Scheduler.view.TimelineBase#config-startDate},
 * {@link Scheduler.view.TimelineBase#config-endDate} and a {@link Scheduler.view.mixin.TimelineViewPresets#config-viewPreset}. The dates
 * determine the outer limits of the range shown in the timeaxis while the {@link Scheduler.preset.ViewPreset} decides
 * the appearance and which dates are actually shown. The Scheduler ships with a selection of predefined view presets,
 * which can be found in {@link Scheduler.preset.PresetManager}. If you want to specify view presets for a specific scheduler only, please
 * see {@link Scheduler.view.mixin.TimelineViewPresets#config-presets} config.
 *
 * The Scheduler uses a {@link Scheduler.data.ResourceStore} to hold resources and an {@link Scheduler.data.EventStore}
 * to hold events. You can use inline data or load data using ajax, see the "Working with data" guides for more
 * information.
 *
 * The simplest schedule configured with inline data would look like this:
 *
 *      let scheduler = new Scheduler({
 *          appendTo : document.body,
 *
 *          startDate  : new Date(2018,4,6),
 *          endDate    : new Date(2018,4,12),
 *          viewPreset : 'dayAndWeek',
 *
 *           columns : [
 *              { field : 'name', text : 'Name', width: 100 }
 *          ],
 *
 *          resources : [
 *              { id : 1, name : 'Bernard' },
 *              { id : 2, name : 'Bianca' }
 *          ],
 *
 *          events : [
 *              { id : 1, resourceId : 1, name : 'Interview', startDate : '2018-05-06', endDate : '2018-05-07' },
 *              { id : 2, resourceId : 1, name : 'Press conference', startDate : '2018-05-08', endDate : '2018-05-09' },
 *              { id : 3, resourceId : 2, name : 'Audition', startDate : '2018-05-06', endDate : '2018-05-08' },
 *              { id : 4, resourceId : 2, name : 'Script deadline', startDate : '2018-05-11', endDate : '2018-05-11' }
 *          ]
 *      });
 *
 * {@inlineexample Scheduler/view/Simplest.js}
 * ## Inheriting from Bryntum Grid
 * Bryntum Scheduler inherits from Bryntum Grid, meaning that most features available for the grid are also available
 * for the scheduler. Common features include columns, cell editing, context menus, row grouping, sorting and more.
 *
 * For more information on configuring columns, filtering, search etc. please see the {@link Grid.view.Grid Grid API docs}.
 * {@region Loading data}
 * As mentioned above Bryntum Scheduler uses an {@link Scheduler.data.EventStore} and a {@link Scheduler.data.ResourceStore}
 * to hold its data. Data is expected to be in JSON format and can be assigned inline (from memory) using the
 * {@link Scheduler.view.mixin.SchedulerStores#config-events} and
 * {@link Scheduler.view.mixin.SchedulerStores#config-resources} shortcuts:
 * ```
 * let scheduler = new Scheduler({
 *    events : myArrayOfEventData,
 *    resources : myArrayOfResourceData
 * });
 * ```
 * If you need to give additional store configuration, you can also specify store configs or instances:
 * ```
 * let resourceStore = new ResourceStore({
 *   // ResourceStore config object
 * })
 *
 * let scheduler = new Scheduler({
 *    // EventStore config object
 *    eventStore : {
 *       ...
 *    },
 *
 *    // Already existing ResourceStore instance
 *    resourceStore
 * });
 * ```
 * To use Ajax to fetch data from a server, specify {@link Core.data.AjaxStore#config-readUrl}:
 * ```
 * let scheduler = new Scheduler({
 *    eventStore : {
 *        readUrl  : 'backend/read_events.php',
 *        autoLoad : true
 *    }
 * });
 * // If you do not specify autoLoad, trigger loading manually:
 * scheduler.eventStore.load();
 * ```
 * For more information, see the "Working with data" guides.
 * {@endregion}
 * {@region Event styling}
 * Bryntum Schedulers appearance can be affected in a few different ways:
 *
 * * Switching themes
 * * Choosing event styles and colors
 * * Using renderer functions
 *
 * ### Switching themes
 * Scheduler ships with four different themes, simply include the css file for the theme you would like to use on your
 * page. The themes are located in the `/build` folder. For example to include the material theme:
 * ```
 * <link rel="stylesheet" href="build/scheduler.material.css" id="bryntum-theme">
 * ```
 * Included themes are (from left to right) classic-light, classic, classic-dark, stockholm and material:
 *
 * <img src="Scheduler/basic/thumb.classic-light.png" alt="Classic-Light theme" width="300" style="margin-right: .5rem">
 * <img src="Scheduler/basic/thumb.classic.png" alt="Classic theme" width="300" style="margin-right: .5rem">
 * <img src="Scheduler/basic/thumb.classic-dark.png" alt="Classic-Dark theme" width="300" style="margin-right: .5rem">
 * <img src="Scheduler/basic/thumb.stockholm.png" alt="Stockholm theme" width="300" style="margin-right: .5rem">
 * <img src="Scheduler/basic/thumb.material.png" alt="Material theme" width="300">
 *
 * ### Choosing event styles and colors
 * The style and color of each event can be changed by assigning to the `eventStyle` and `eventColor` configs. These
 * configs are available at 3 different levels:
 *
 * * Scheduler level, affects all events (see {@link Scheduler.view.mixin.TimelineEventRendering#config-eventStyle} and {@link Scheduler.view.mixin.TimelineEventRendering#config-eventColor}).
 * * Resource level, affects all events assigned to that resource (see {@link Scheduler.model.mixin.ResourceModelMixin#field-eventStyle}
 * and {@link Scheduler.model.mixin.ResourceModelMixin#field-eventColor}).
 * * Event level, affects that event (see {@link Scheduler/model/mixin/EventModelMixin#field-eventStyle} and
 * {@link Scheduler/model/mixin/EventModelMixin#field-eventColor}).
 *
 * {@inlineexample Scheduler/view/Styles.js}
 *
 * For available styles, see {@link Scheduler.view.mixin/TimelineEventRendering#config-eventStyle}. For colors,
 * {@link Scheduler.view.mixin/TimelineEventRendering#config-eventColor}. Also take a look at the
 * <a href="../examples/eventstyles" target="_blank">eventstyles demo</a>.
 *
 *
 * ### Sorting overlapping events
 *
 * The order of overlapping events rendered in a horizontal scheduler can be customized by overriding
 * {@link Scheduler.view.mixin.SchedulerEventRendering#config-horizontalEventSorterFn} function on the scheduler.
 * For example:
 * ```
 * let scheduler = new Scheduler({
 *     horizontalEventSorterFn(a, b) {
 *         return b.startDate.getTime() - a.startDate.getTime();
 *     },
 *     ...
 * });
 * ```
 *
 * {@inlineexample Scheduler/view/SortingOverlappingEvents.js}
 *
 * ### Using render functions
 * Render function can be used to manipulate the rendering of rows (resources) and events. For information on row
 * renderers, see {@link Grid.column.Column#config-renderer}.
 *
 * Event rendering can be manipulated by specifying an {@link Scheduler.view.mixin/SchedulerEventRendering#config-eventRenderer} function. The function is called
 * for each event before it is rendered to DOM. By using its arguments you can add CSS classes, modify styling and
 * determine the contents of the event:
 * ```
 * let scheduler = new Scheduler({
 *
 *   events    : [...],
 *   resources : [...],
 *
 *   ...,
 *
 *   eventRenderer({resourceRecord, eventRecord, renderData}) {
 *      // add css class to the event
 *      renderData.cls.add('my-css-class');
 *
 *      // use an icon
 *      renderData.iconCls = 'b-fa b-fa-some-nice-icon';
 *
 *      // return value is used as events text
 *      return `${resourceRecord.name}: ${eventRecord.name}`;
 *   }
 * });
 * ```
 * {@endregion}
 * {@region Event manipulation}
 * You can programmatically manipulate the events using data operations, see the "Working with data" guides for more
 * information. Events are reactive, changes reflect on the UI automatically. A small example on manipulating events:
 * ```
 * // change startDate of first event
 * scheduler.eventStore.first.startDate = new Date(2018,5,10);
 *
 * // remove last event
 * scheduler.eventStore.last.remove();
 *
 * // reassign an event
 * scheduler.eventStore.getById(10).resourceId = 2;
 * ```
 *
 * You can also allow your users to manipulate the events using the following features:
 *
 * * {@link Scheduler.feature.EventDrag}, drag and drop events within the schedule
 * * {@link Scheduler.feature.EventDragCreate}, create new events by click-dragging an empty area
 * * {@link Scheduler.feature.EventEdit}, show an event editing form
 * * {@link Scheduler.feature.SimpleEventEdit}, edit the event name easily
 * * {@link Scheduler.feature.EventResize}, resize events by dragging resize handles
 *
 * All of the features mentioned above are enabled by default.
 * {@endregion}
 * {@region Default configs}
 * There is a myriad of configs and features available for Scheduler (browse the API docs to find them), some of them on
 * by default and some of them requiring extra configuration. The code below tries to illustrate the major things that
 * are used by default:
 *
 * ```javascript
 * let scheduler = new Scheduler({
 *    // The following features are enabled by default:
 *    features : {
 *        cellEdit            : true, // Cell editing in the columns part
 *        columnLines         : true, // Column lines in the schedule part
 *        columnPicker        : true, // Header context menu item to toggle visible columns
 *        columnReorder       : true, // Reorder columns in grid part using drag and drop
 *        columnResize        : true, // Resize columns in grid part using the mouse
 *        cellMenu            : true, // Context menu for cells in the grid part
 *        eventMenu           : true, // Context menu for events
 *        eventDrag           : true, // Dragging events
 *        eventDragCreate     : true, // Drag creating events
 *        eventEdit           : true, // Event editor dialog
 *        eventFilter         : true, // Filtering events using header context menu
 *        eventCopyPaste      : true, // Allow using [Ctrl/CMD + C/X] and [Ctrl/CMD + V] to copy/cut and paste events
 *        eventResize         : true, // Resizing events using the mouse
 *        eventTooltip        : true, // Tooltips for events
 *        group               : true, // Row grouping
 *        headerMenu          : true, // Context menu for headers in the grid part
 *        timeAxisHeaderMenu  : true, // Header context menu for schedule part
 *        scheduleMenu        : true, // Context menu for empty parts of the schedule
 *        scheduleTooltip     : true, // Tooltip for empty parts of the schedule
 *        sort                : true  // Row sorting
 *    },
 *
 *    // From Grid
 *    animateRemovingRows       : false, // Rows will not slide out on removal
 *    autoHeight                : false, // Grid needs to have a height supplied through CSS (strongly recommended) or by specifying `height
 *    columnLines               : true,  // Grid part, themes might override it to hide lines anyway
 *    emptyText                 : 'No rows to display',
 *    enableTextSelection       : false, // Not allowed to select text in cells by default,
 *    fillLastColumn            : true,  // By default the last column is stretched to fill the grid
 *    fullRowRefresh            : true,  // Refreshes entire row when a cell value changes
 *    loadMask                  : 'Loading...',
 *    resizeToFitIncludesHeader : true,  // Also measure header when auto resizing columns
 *    responsiveLevels : {
 *      small : 400,
 *      medium : 600,
 *      large : '*'
 *    },
 *    rowHeight                  : 60,    // Scheduler specifies a default rowHeight in pixels
 *    showDirty                  : false, // No indicator for changed cells
 *
 *    // Scheduler specific
 *    autoAdjustTimeAxis             : true,      // startDate & endDate will be adjusted to display a suitable range
 *    allowOverlap                   : true,      // Events are allowed to overlap (overlays, stacks or packs depending on eventLayout)
 *    barMargin                      : 10,        // Space above + below each event
 *    createEventOnDblClick          : true,      // Allow creating new events by double clicking empty space
 *    enableDeleteKey                : true,      // Allow deleting events with delete / backspace keys
 *    enableEventAnimations          : true,      // Animate event changes
 *    eventBarTextField              : 'name',    // Field on EventModel to display in events
 *    eventColor                     : 'green',   // Use green as default color for events
 *    eventLayout                    : 'stack',   // Stack overlapping events by default
 *    eventStyle                     : 'plain',   // Use plain as default style for events
 *    managedEventSizing             : true,      // Calculate event sizes based on rowHeight & barMargin
 *    milestoneCharWidth             : 10,
 *    milestoneLayoutMode            : 'default',
 *    removeUnassignedEvent          : true,      // Remove event when all assignments for it are removed
 *    useInitialAnimation            : true,      // Fade in events initially
 *    viewPreset                     : 'weekAndDayLetter',
 *    zoomOnMouseWheel               : true,
 *    zoomOnTimeAxisDoubleClick      : true
 * });
 * ```
 * {@endregion}
 * {@region Performance}
 * To make scheduler performance as good as possible it only renders the events and resources that are within view (plus
 * an additional buffer). Since adding to and removing from DOM comes with a performance penalty the elements are
 * instead repositioned and reused as you scroll. A side effect of this is that you cannot do direct DOM element
 * manipulation in a reliable way, instead you should use row and event renderer functions to achieve what you want (see
 * the section on event styling above).
 *
 * To put the scheduler to the test, try our <a href="../examples/bigdataset" target="_blank">bigdataset demo</a>.
 * {@endregion}
 *
 * {@region Recurring Events}
 * From 4.0.0, there is no `RecurringEvents` Feature. There is an
 * {@link Scheduler.view.mixin.RecurringEvents#config-enableRecurringEvents enableRecurringEvents}
 * boolean config on the Scheduler. Occurrences of recurring events are provided on a "just in time"
 * basis by a new EventStore API which must now be used when interrogating an EventStore.
 *
 * {@link Scheduler.data.mixin.EventStoreMixin#function-getEvents} is a multipurpose event gathering method
 * which can be asked to return events which match a set of criteria including a date range and a
 * resource. By default, if the requested date range contains occurrences of a recurring event,
 * those occurrences are returned in the result array.
 *
 * ```js
 * myEventStore.getEvents({
 *     resourceRecord : myResourceRecord,
 *     startDate      : myScheduler.startDate,
 *     endDate        : myScheduler.endDate
 * });
 * ```
 *
 * Occurrences are *not* present in the store's data collection.
 *
 * To directly access occurrences of a recurring event which *intersect* a date range, use:
 *
 * ```js
 * recurringEvent.getOccurrencesForDateRange(startDate, endDate);
 * ```
 *
 * The `endDate` argument is optional if the occurrence for one date is required. This method always
 * returns an array. Note that it may be empty if no occurrences intersect the date range.
 *
 * ### Convert an occurrence to an exception
 * To programmatically convert an occurrence to be a single exception to its owner's sequence use:
 *
 * ```
 * myOccurrence.beginBatch();
 * myOccurrence.startDate = DateHelper.add(myOccurrence.startDate, 1, 'day');
 * myOccurrence.name = 'Postponed to next day';
 * myOccurrence.recurrence = null; // This means it does NOT become a new recurring base event.
 * myOccurrence.endBatch();
 * ```
 *
 * That will cause that event to be inserted into the store as a concrete event definition, firing
 * an `add` event as would be expected, and will add an `exceptionDates` to its owning recurring event.
 *
 * When syncing this change back to the server, the `exceptionDates` array for the modified
 * recurring event now contains the exception dates correctly serialized into string form using
 * the `dateFormat` of the field. The system-supplied default value for this is
 * `'YYYY-MM-DDTHH:mm:ssZ'`
 *
 * ### Convert an occurrence to a new recurring event sequence.
 * To programmatically convert an occurrence to be the start of a new recurring sequence, use:
 *
 * ```
 * myOccurrence.beginBatch();
 * myOccurrence.startDate = DateHelper.set(myOccurrence.startDate, 'hour', 14);
 * myOccurrence.name = 'Moved to 2pm from here on';
 * myOccurrence.endBatch();
 * ```
 *
 * That will cause that event to be inserted into the store as a concrete *recurring* event
 * definition, firing an `add` event as would be expected, and will terminate the previous
 * recurring owner of that occurrence on the day before the new event.
 * {@endregion}
 *
 * @extends Scheduler/view/SchedulerBase
 */
export default class Scheduler extends SchedulerBase {
    static get $name() {
        return 'Scheduler';
    }

    // Factoryable type name
    static get type() {
        return 'scheduler';
    }
}

// Register this widget type with its Factory
Scheduler.initClass();
