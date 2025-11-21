import InstancePlugin from '../../Core/mixin/InstancePlugin.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import DomHelper from '../../Core/helper/DomHelper.js';

/**
 * @module Scheduler/feature/StickyEvents
 */
const zeroMargins = { width : 0, height : 0 };

/**
 * This feature causes the inner text of events to stay in view as long as possible while the event's
 * bar is being moved out of view by sliding the content rightwards (or downwards in vertical mode).
 *
 * This feature may need to be be disabled when using complex
 * {@link Scheduler.view.mixin.SchedulerEventRendering#config-eventBodyTemplate eventBodyTemplates}
 * (See the "Nested events demo) because it relies on controlling the position of the inner element
 * of the event body.
 *
 * This feature is **enabled** by default.
 *
 * @extends Core/mixin/InstancePlugin
 * @demo Scheduler/bigdataset
 * @classtype stickyEvents
 * @feature
 */
export default class StickyEvents extends InstancePlugin {
    static get $name() {
        return 'StickyEvents';
    }

    static get type() {
        return 'stickyEvents';
    }

    // Plugin configuration. This plugin chains some of the functions in Scheduler.
    static get pluginConfig() {
        return {
            chain : ['onEventDataGenerated']
        };
    }

    construct(scheduler, config) {
        super.construct(scheduler, config);

        this.toUpdate = new Set();

        // When the Scheduler fires its scroll events, we check the rowMap cache of
        // rendered events in rows, each of which contains an array of event domConfigs.
        // If any of those event layouts currently owns an element (is not derendered)
        // and have a start that is less than the scroll position, the eventContent is
        // nudged forward so that it remains in view.
        scheduler.on({
            horizontalScroll : 'onSchedulerScroll',
            scroll           : 'onSchedulerScroll',
            thisObj          : this,
            prio             : 10000
        });
    }

    onEventDataGenerated(eventData) {
        this.syncEventContentPosition(eventData);
        this.updateStyles();
    }

    onSchedulerScroll({ subGrid }) {
        const
            { client } = this,
            method     = client.isHorizontal ? 'horizontalSyncAllEventsContentPosition' : 'verticalSyncAllEventsContentPosition';

        // If we're horizontal, and it's not the Scheduler's subgrid scrolling horizontally, do not react.
        // (There is no subgrid on vertical scroll in horizontal mode)
        if (client.isHorizontal && subGrid && !subGrid.isTimeAxisSubGrid) {
            return;
        }

        this[method](client);
    }

    updateStyles() {
        for (const { contentEl, style } of this.toUpdate) {
            DomHelper.applyStyle(contentEl, style);
        }

        this.toUpdate.clear();
    }

    horizontalSyncAllEventsContentPosition(scheduler) {
        const domConfigs = scheduler.currentOrientation.visibleEventDOMConfigs;

        if (domConfigs) {
            for (let i = 0, { length } = domConfigs; i < length; i++) {
                const
                    domConfig       = domConfigs[i],
                    { elementData } = domConfig;

                if (!elementData.elementConfig._element) {
                    elementData.elementConfig._element = domConfig._element;
                }
                this.syncEventContentPosition(elementData, elementData.eventRecord.isResourceTimeRange ? domConfig.children[0] : domConfig.children[0].children[0]);
            }
        }

        this.updateStyles();
    }

    verticalSyncAllEventsContentPosition(scheduler) {
        const { resourceMap } = scheduler.currentOrientation;

        for (const eventsData of resourceMap.values()) {
            for (const { renderData, elementConfig } of Object.values(eventsData)) {
                const args = [renderData];

                if (elementConfig && renderData.eventRecord.isResourceTimeRange) {
                    args.push(elementConfig.children[0]);
                }

                this.syncEventContentPosition.apply(this, args);
            }
        }
        this.updateStyles();
    }

    onEventDrag(eventBar) {
        const
            { client }        = this,
            { isHorizontal }  = client,
            sizeProperty      = `offset${isHorizontal ? 'Width' : 'Height'}`,
            scrollPosition    = isHorizontal ? client.timeAxisSubGrid.scrollable.x : client.scrollable.y,
            contentEl         = eventBar.querySelector('.b-sch-event-content'),
            eventStart        = DomHelper[isHorizontal ? 'getTranslateX' : 'getTranslateY'](eventBar),
            eventEnd          = eventStart + eventBar[sizeProperty] - 1,
            transformDim      = isHorizontal ? 'X' : 'Y',
            barSize           = eventBar[sizeProperty],
            contentSize       = contentEl?.[sizeProperty];

        if (!eventBar.classList.contains('b-milestone-wrap') && contentSize && eventStart < scrollPosition && eventEnd >= scrollPosition) {
            const
                edgeSize = this.getEventContentMargins(contentEl)[isHorizontal ? 'width' : 'height'],
                justify   = contentEl && DomHelper.getStyleValue(contentEl.parentNode, 'justifyContent'),
                c         = justify === 'center' ? (barSize - contentSize) / 2 : 0,
                maxOffset = barSize - contentSize - edgeSize,
                offset = Math.min(scrollPosition - eventStart, maxOffset - 2) - c;

            DomHelper.applyStyle(contentEl, {
                transform : offset > 0 ? `translate${transformDim}(${offset}px)` : ''
            });
        }
    }

    syncEventContentPosition(renderData, eventContent = renderData.eventContent) {
        if (
            // Allow client disable stickiness for certain events
            renderData.eventRecord.stickyContents === false ||
            // Bail out early for released elements
            renderData.elementConfig?._element?.lastDomConfig.isReleased
        ) {
            return;
        }

        const
            { client }        = this,
            { isHorizontal }  = client,
            { elementConfig } = renderData,
            scrollPosition    = isHorizontal ? client.timeAxisSubGrid.scrollable.x : client.scrollable.y,
            firstEventChild   = elementConfig?.children[0]?.children[0],
            contentEl         = (firstEventChild?.className === 'b-sch-event-content' && firstEventChild._element ? firstEventChild._element : eventContent._element) || client.getEventElement(renderData.eventRecord)?.querySelector('.b-sch-event-content'),
            contentWidth      = contentEl?.offsetWidth,
            justify           = contentEl?.parentNode && DomHelper.getStyleValue(contentEl.parentNode, 'justifyContent'),
            c                 = justify === 'center' ? (renderData.width - contentWidth) / 2 : 0,
            eventStart        = isHorizontal ? renderData.left + c : renderData.top,
            eventEnd          = eventStart + (isHorizontal ? renderData.width : renderData.height) - 1,
            transformDim      = isHorizontal ? 'X' : 'Y';

        // If an event is moving back into view, the element it was previously attached to may be under the control
        // of another element now. If that is the case, we must leave it alone, the first DomSync that the
        // rerendering does will take care of it.
        // Event id will be stringified in the element's dataset, so use ==
        // Do not process events being dragged.
        if (elementConfig?.dataset.syncId == elementConfig?._element?.dataset.syncId && !contentEl?.parentElement.parentElement.classList.contains('b-dragging')) {
            const
                style = typeof eventContent.style === 'string'
                    ? (eventContent.style = DomHelper.parseStyle(eventContent.style))
                    : eventContent.style || (eventContent.style = {});

            // Only process non-milestone events. Milestones have no width.
            // If there's no offsetWidth, it's still b-released, so we cannot measure it.
            // If the event starts off the left edge, but its right edge is still visible,
            // translate the contentEl to compensate. If not, undo any translation.
            if (!renderData.eventRecord.isMilestone && (!contentEl || contentWidth) && eventStart < scrollPosition && eventEnd >= scrollPosition) {
                const
                    edgeSizes = this.getEventContentMargins(contentEl),
                    maxOffset = contentEl ? (isHorizontal
                        ? renderData.width - contentWidth - edgeSizes.width
                        : renderData.height - contentEl.offsetHeight - edgeSizes.height) - c : Number.MAX_SAFE_INTEGER,
                    offset = Math.min(scrollPosition - eventStart, maxOffset - 2);

                style.transform = offset > 0 ? `translate${transformDim}(${offset}px)` : '';
            }
            else {
                style.transform = '';
            }

            if (contentEl) {
                this.toUpdate.add({ contentEl, style });
            }
        }
    }

    // Only measure the margins of an event's contentEl once
    getEventContentMargins(contentEl) {
        if (contentEl?.classList.contains('b-sch-event-content')) {
            return DomHelper.getEdgeSize(contentEl, 'margin');
        }
        return zeroMargins;
    }
}

GridFeatureManager.registerFeature(StickyEvents, true, 'Scheduler');
GridFeatureManager.registerFeature(StickyEvents, false, 'ResourceHistogram');
