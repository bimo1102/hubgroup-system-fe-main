import HorizontalLayout from './HorizontalLayout.js';

/**
 * @module Scheduler/eventlayout/HorizontalLayoutStack
 */

/**
 * Handles layout of events within a row (resource) in horizontal mode. Stacks events, increasing row height when to fit
 * all overlapping events.
 *
 * This layout is used by default in horizontal mode.
 *
 * @extends Scheduler/eventlayout/HorizontalLayout
 * @private
 */
export default class HorizontalLayoutStack extends HorizontalLayout {
    // Input: Array of event layout data
    // heightRun is used when pre-calculating row heights, taking a cheaper path
    layoutEventsInBands(events, heightRun = false) {
        let verticalPosition = 0;

        do {
            let eventIndex = 0,
                event      = events[0];

            while (event) {
                if (!heightRun) {
                    // Apply band height to the event cfg
                    event.top = this.bandIndexToPxConvertFn.call(
                        this.bandIndexToPxConvertThisObj || this,
                        verticalPosition,
                        event.eventRecord,
                        event.resourceRecord
                    );
                }

                // Remove it from the array and continue searching
                events.splice(eventIndex, 1);

                eventIndex = this.findClosestSuccessor(event, events);
                event = events[eventIndex];
            }

            verticalPosition++;
        } while (events.length > 0);

        // Done!
        return verticalPosition;
    }

    // TODO: optimize this for better performance with many events per resource
    findClosestSuccessor(eventRenderData, events) {
        const
            eventEnd    = eventRenderData.endMS,
            isMilestone = eventRenderData.eventRecord && eventRenderData.eventRecord.duration === 0;

        let minGap      = Infinity,
            closest,
            gap,
            event;

        for (let i = 0, l = events.length; i < l; i++) {
            event = events[i];
            gap = event.startMS - eventEnd;

            if (
                gap >= 0 && gap < minGap &&
                // Two milestones should not overlap
                (gap > 0 || event.endMS - event.startMS > 0 || !isMilestone)
            ) {
                closest = i;
                minGap  = gap;
            }
        }

        return closest;
    }
}
