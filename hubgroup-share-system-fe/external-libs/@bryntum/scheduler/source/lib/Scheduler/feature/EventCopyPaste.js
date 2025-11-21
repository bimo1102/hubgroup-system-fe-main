import InstancePlugin from '../../Core/mixin/InstancePlugin.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import './ScheduleContext.js';

/**
 * @module Scheduler/feature/EventCopyPaste
 */

/**
 * Allow using [Ctrl/CMD + C/X] and [Ctrl/CMD + V] to copy/cut and paste events. This feature also adds entries
 * to the {@link Scheduler.feature.EventMenu} (see example below for how to configure)
 *
 * This feature is **enabled** by default
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         eventCopyPaste : true
 *     }
 * });
 * ```
 *
 * ```javascript
 * // Custom copy text + remove cut option from event menu:
 * const scheduler = new Scheduler({
 *     features : {
 *         eventCopyPaste : true,
 *         eventMenu : {
 *             items : {
 *                 copyEvent : {
 *                     text : 'Copy booking'
 *                 },
 *                 cutEvent  : false
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * @extends Core/mixin/InstancePlugin
 * @inlineexample Scheduler/feature/EventCopyPaste.js
 * @classtype eventCopyPaste
 * @feature
 */
export default class EventCopyPaste extends InstancePlugin {
    static get $name() {
        return 'EventCopyPaste';
    }

    static get pluginConfig() {
        return {
            assign : [
                'copyEvents',
                'pasteEvents'
            ],
            chain : [
                'onElementKeyDown',
                'populateEventMenu',
                'populateScheduleMenu',
                'onEventDataGenerated'
            ]
        };
    }

    static get properties() {
        return {
            recordsFromClipboard : []
        };
    }

    construct(scheduler, config) {
        super.construct(scheduler, config);

        // enable scheduleContext to highlight cell on click to paste
        if (scheduler.features.scheduleContext) {
            scheduler.features.scheduleContext.disabled = false;
        }

        scheduler.on('scheduleclick', this.onSchedulerClick, this);

        this.scheduler = scheduler;
    }

    onEventDataGenerated(eventData) {
        const { eventRecord } = eventData;

        eventData.cls['b-cut-item'] = eventRecord.meta.isCut;
    }

    onSchedulerClick(context) {
        this._cellClickedContext = context;
    }

    onElementKeyDown(event) {
        if (event.ctrlKey) {
            switch (event.key.toLowerCase()) {
                // copy
                case 'c':
                    this.onCtrlCKey();
                    break;
                // cut
                case 'x':
                    this.onCtrlXKey();
                    break;
                // paste
                case 'v':
                    this.onCtrlVKey();
                    break;
            }
        }
    }

    /**
     * Copy events to clipboard to paste later
     * @param {Array} [records] Uses `selectedAssignments` by default, pass other records to copy them
     * @param {Boolean} [isCut] Copies by default, pass `true` to cut
     * @category Edit
     */
    copyEvents(records, isCut = false) {
        const
            me            = this,
            { scheduler } = me;

        if (scheduler.readOnly) {
            return;
        }

        me._isCut = isCut;
        // records is used when call comes from context menu where the current event is the context
        me.recordsFromClipboard = records || scheduler.selectedEvents;

        scheduler.eventStore.forEach(rec => {
            rec.meta.isCut = me._isCut && me.recordsFromClipboard.includes(rec);
        });

        // refresh to call onEventDataGenerated and reapply the cls for records where the cut was canceled
        scheduler.refreshWithTransition();
    }

    onCtrlCKey() {
        this.copyEvents();
    }

    onCtrlXKey() {
        this.copyEvents(null, true);
    }

    onCtrlVKey() {
        const { date, resourceRecord } = this._cellClickedContext || {};

        this.pasteEvents(date, resourceRecord);
    }

    /**
     * Paste events to date/resource to assign
     *
     * @param {Date} [date] The date where the event(s) will be pasted
     * @param {Object} [resourceRecord] Resource when the event(s) will be pasted
     * @category Edit
     */
    pasteEvents(date, resourceRecord) {
        const
            me      = this,
            records = me.recordsFromClipboard;

        if (!records.length) {
            return;
        }

        records.forEach(rec => {
            const recCfg = {};

            if (resourceRecord) {
                recCfg.resourceId = resourceRecord.id;
            }

            if (date) {
                Object.assign(recCfg, {
                    startDate : date,
                    endDate   : DateHelper.add(date, rec.duration, rec.durationUnit)
                });
            }

            if (me._isCut) {
                rec.set(recCfg);
                rec.meta.isCut = false;
            }
            else {
                recCfg.name = `${rec.name} - copy`;
                me.scheduler.eventStore.add(rec.copy(recCfg));
            }
        });

        if (me._isCut) {
            // reset clipboard
            me._isCut = false;
            me.recordsFromClipboard = [];
        }
    }

    populateEventMenu({ eventRecord, items }) {
        const me = this;

        if (!me.scheduler.readOnly) {
            items.copyEvent = {
                text        : 'L{copyEvent}',
                localeClass : me,
                icon        : 'b-icon b-icon-copy',
                weight      : 110,
                onItem      : () => me.copyEvents([eventRecord], false)
            };

            items.cutEvent = {
                text        : 'L{cutEvent}',
                localeClass : me,
                icon        : 'b-icon b-icon-cut',
                weight      : 120,
                onItem      : () => me.copyEvents([eventRecord], true)
            };
        }
    }

    populateScheduleMenu({ items }) {
        const
            me            = this,
            { scheduler } = me;

        if (!scheduler.readOnly && me.recordsFromClipboard.length) {
            items.pasteEvent = {
                text        : 'L{pasteEvent}',
                localeClass : me,
                icon        : 'b-icon b-icon-paste',
                disabled    : scheduler.resourceStore.count === 0,
                weight      : 110,
                onItem      : ({ date, resourceRecord }) => me.pasteEvents(date, resourceRecord, scheduler.getRowFor(resourceRecord))
            };
        }
    }
}

EventCopyPaste.featureClass = 'b-event-copypaste';

GridFeatureManager.registerFeature(EventCopyPaste, true, 'Scheduler');
