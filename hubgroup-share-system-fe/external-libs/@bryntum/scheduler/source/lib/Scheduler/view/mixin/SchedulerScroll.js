import Base from '../../../Core/Base.js';
import DomHelper from '../../../Core/helper/DomHelper.js';

/**
 * @module Scheduler/view/mixin/SchedulerScroll
 */

const
    immediatePromise     = Promise.resolve(),
    defaultScrollOptions = {
        block      : 'nearest',
        edgeOffset : 20
    },
    unrenderedScrollOptions = {
        highlight : false,
        focus     : false
    };

/**
 * Functions for scrolling to events, dates etc.
 *
 * @mixin
 */
export default Target => class SchedulerScroll extends (Target || Base) {
    static get $name() {
        return 'SchedulerScroll';
    }

    //region Scroll to event

    /**
     * Scrolls an event record into the viewport.
     * If the resource store is a tree store, this method will also expand all relevant parent nodes to locate the event.
     *
     * @param {Scheduler.model.EventModel} eventRecord the event record to scroll into view
     * @param {Object} [options] How to scroll.
     * @param {String} [options.block=nearest] How far to scroll the event: `start/end/center/nearest`.
     * @param {Number} [options.edgeOffset=20] edgeOffset A margin *in pixels* around the event to bring into view.
     * @param {Boolean|Number} [options.animate] Set to `true` to animate the scroll, or the number of milliseconds to animate over.
     * @param {Boolean} [options.highlight] Set to `true` to highlight the event element when it is in view.
     * @param {Boolean} [options.focus] Set to `true` to focus the event element when it is in view.
     * @returns {Promise} A Promise which resolves when the scrolling is complete.
     *
     * This function is not applicable for events with multiple assignments, please use #scrollResourceEventIntoView instead.
     */
    scrollEventIntoView(eventRecord, options = defaultScrollOptions) {
        const
            me        = this,
            resources = eventRecord.resources || [eventRecord];

        if (resources.length > 1) {
            throw new Error('scrollEventIntoView() is not applicable for events with multiple assignments, please use scrollResourceEventIntoView() instead.');
        }

        if (!resources.length) {
            console.warn('You have asked to scroll to an event which is not assigned to a resource');
            return immediatePromise;
        }

        return me.scrollResourceEventIntoView(resources[0], eventRecord, null, options);
    }

    /**
     * Scrolls an assignment record into the viewport.
     *
     * If the resource store is a tree store, this method will also expand all relevant parent nodes
     * to locate the event.
     *
     * @param {Scheduler.model.AssignmentModel} assignmentRecord A resource record an event record is assigned to
     * @param {Number} index DOM node index, applicable only for weekview
     * @param {Object} [options] How to scroll.
     * @param {String} [options.block=nearest] How far to scroll the event: `start/end/center/nearest`.
     * @param {Number} [options.edgeOffset=20] edgeOffset A margin *in pixels* around the event to bring into view.
     * @param {Boolean/Number} [options.animate] Set to `true` to animate the scroll, or the number of milliseconds to animate over.
     * @param {Boolean} [options.extendTimeAxis=true] By default, if the requested event is outside the time axis, the time axis is extended.
     * @param {Boolean} [options.highlight] Set to `true` to highlight the event element when it is in view.
     * @param {Boolean} [options.focus] Set to `true` to focus the event element when it is in view.
     * @returns {Promise} A Promise which resolves when the scrolling is complete.
     */
    scrollAssignmentIntoView(assignmentRecord, ...args) {
        return this.scrollResourceEventIntoView(assignmentRecord.resource, assignmentRecord.event, ...args);
    }

    /**
     * Scrolls a resource event record into the viewport.
     *
     * If the resource store is a tree store, this method will also expand all relevant parent nodes
     * to locate the event.
     *
     * @param {Scheduler.model.ResourceModel} resourceRecord A resource record an event record is assigned to
     * @param {Scheduler.model.EventModel} eventRecord An event record to scroll into view
     * @param {Number} index DOM node index, applicable only for weekview
     * @param {Object} [options] How to scroll.
     * @param {String} [options.block=nearest] How far to scroll the event: `start/end/center/nearest`.
     * @param {Number} [options.edgeOffset=20] edgeOffset A margin *in pixels* around the event to bring into view.
     * @param {Boolean|Number} [options.animate] Set to `true` to animate the scroll, or the number of milliseconds to animate over.
     * @param {Boolean} [options.extendTimeAxis=true] By default, if the requested event is outside the time axis, the time axis is extended.
     * @param {Boolean} [options.highlight] Set to `true` to highlight the event element when it is in view.
     * @param {Boolean} [options.focus] Set to `true` to focus the event element when it is in view.
     * @returns {Promise} A Promise which resolves when the scrolling is complete.
     */
    scrollResourceEventIntoView(resourceRecord, eventRecord, index, options = defaultScrollOptions) {
        const
            me             = this,
            eventStart     = eventRecord.startDate,
            eventEnd       = eventRecord.endDate,
            eventIsOutside = eventRecord.isScheduled && eventStart < me.timeAxis.startDate | ((eventEnd > me.timeAxis.endDate) << 1);

        let el;

        if (options.edgeOffset == null) {
            options.edgeOffset = 20;
        }

        // Make sure event is within TimeAxis time span unless extendTimeAxis passed as false.
        // The EventEdit feature passes false because it must not mutate the TimeAxis.
        // Bitwise flag:
        //  1 === start is before TimeAxis start.
        //  2 === end is after TimeAxis end.
        if (eventIsOutside && options.extendTimeAxis !== false) {
            const currentTimeSpanRange = me.timeAxis.endDate - me.timeAxis.startDate;

            // Event is too wide, expand the range to encompass it.
            if (eventIsOutside === 3) {
                me.setTimeSpan(
                    new Date(eventStart.valueOf() - currentTimeSpanRange / 2),
                    new Date(eventEnd.getTime() + currentTimeSpanRange / 2)
                );
            }
            // Event is partially or wholly outside but will fit.
            // Move the TimeAxis to include it. That will maintain visual position.
            else {
                // Event starts before
                if (eventIsOutside & 1) {
                    me.setTimeSpan(
                        new Date(eventStart),
                        new Date(eventStart.valueOf() + currentTimeSpanRange)
                    );
                }
                // Event ends after
                else {
                    me.setTimeSpan(
                        new Date(eventEnd.valueOf() - currentTimeSpanRange),
                        new Date(eventEnd)
                    );
                }
            }
        }

        // If we're a tree, ensure parents are expanded first
        me.expandTo?.(resourceRecord);

        // Establishing element to scroll to
        el = me.getElementFromEventRecord(eventRecord, resourceRecord);

        if (el) {
            // It's usually the event wrapper that holds focus
            if (!DomHelper.isFocusable(el)) {
                el = el.parentNode;
            }

            const scroller = me.timeAxisSubGrid.scrollable;

            // Force horizontalscroll to be triggered directly on scroll instead of on next frame, to have events
            // already drawn when promise resolves
            me.timeAxisSubGrid.forceScrollUpdate = true;
            // Scroll into view with animation and highlighting if needed.
            return scroller.scrollIntoView(el, options);
        }
        else if (eventIsOutside && options.extendTimeAxis === false) {
            console.warn('You have asked to scroll to an event which is outside the current view and extending timeaxis is disabled');
            return immediatePromise;
        }
        else if (!eventRecord.isOccurrence && !me.eventStore.isAvailable(eventRecord)) {
            console.warn('You have asked to scroll to an event which is not available');
            return immediatePromise;
        }
        else if (eventRecord.isScheduled) {
            // Event scheduled but not rendered, scroll to calculated location
            return me.scrollUnrenderedEventIntoView(resourceRecord, eventRecord, options);
        }
        else {
            // Event not scheduled, just scroll resource row into view
            return me.scrollResourceIntoView(resourceRecord, options);
        }
    }

    /**
     * Scrolls an unrendered event into view. Internal function used from #scrollResourceEventIntoView.
     * @private
     */
    scrollUnrenderedEventIntoView(resourceRec, eventRec, options = defaultScrollOptions) {
        // We must only resolve when the event's element has been painted
        // *and* the scroll has fully completed.
        return new Promise(resolve => {
            const
                me               = this,
                // Knock out highlight and focus options. They must be applied after the scroll
                // has fully completed and we have an element. Use a default edgeOffset of 20.
                modifiedOptions  = Object.assign({ edgeOffset : 20 }, options, unrenderedScrollOptions),
                scroller         = me.timeAxisSubGrid.scrollable,
                box              = me.getResourceEventBox(eventRec, resourceRec),
                scrollerViewport = scroller.viewport;

            if (!scrollerViewport) {
                resolve();
                return;
            }

            // In case of subPixel position, scroll the whole pixel into view
            box.x = Math.ceil(box.x);
            box.y = Math.ceil(box.y);

            const
                targetRect    = box.translate(scrollerViewport.x - scroller.x, scrollerViewport.y - scroller.y),
                delta         = scroller.getDeltaTo(targetRect, modifiedOptions)[me.isHorizontal ? 'xDelta' : 'yDelta'],
                onEventRender = async({ eventRecord, element, targetElement }) => {
                    if (eventRecord === eventRec) {
                        // Vertical's renderEvent is different to horizontal's
                        const el = element || targetElement;

                        detacher();

                        // Don't resolve until the scroll has fully completed.
                        await initialScrollPromise;
                        // If we were scrolling rightwards, then because the rectangle was only *estimated*
                        // we must now ensure that the scroll position is fully correct for the *element*.
                        // TODO: Needed? The position should be correct with the new rendering
                        if (delta > 0) {
                            await scroller.scrollIntoView(el, { edgeOffset : options.edgeOffset });
                        }
                        options.highlight && DomHelper.highlight(el);
                        options.focus && el.focus();

                        resolve();
                    }
                },
                // On either paint or repaint of the event, resolve the scroll promise and detach the listeners.
                detacher = me.on({
                    renderEvent : onEventRender
                }),
                initialScrollPromise = scroller.scrollIntoView(targetRect, modifiedOptions);
        });
    }

    /**
     * Scrolls the specified resource into view, works for both horizontal and vertical modes.
     * @param {Scheduler.model.ResourceModel} resourceRecord A resource record an event record is assigned to
     * @param {Object} [options] How to scroll.
     * @param {String} [options.column] Field name or ID of the column, or the Column instance to scroll to (in horizontal mode).
     * @param {String} [options.block] How far to scroll the element: `start/end/center/nearest`.
     * @param {Number} [options.edgeOffset] edgeOffset A margin around the element or rectangle to bring into view.
     * @param {Boolean|Number} [options.animate] Set to `true` to animate the scroll, or the number of milliseconds to animate over.
     * @param {Boolean} [options.highlight] Set to `true` to highlight the element when it is in view.
     * @returns {Promise} A promise which is resolved when the scrolling has finished.
     */
    scrollResourceIntoView(resourceRecord, options = defaultScrollOptions) {
        if (this.isVertical) {
            return this.currentOrientation.scrollResourceIntoView(resourceRecord, options);
        }
        else {
            return this.scrollRowIntoView(resourceRecord, options);
        }
    }

    //endregion

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement thus.
    get widgetClass() {}
};
