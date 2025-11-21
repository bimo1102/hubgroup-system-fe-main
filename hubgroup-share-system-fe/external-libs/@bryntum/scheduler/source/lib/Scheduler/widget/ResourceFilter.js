import List from '../../Core/widget/List.js';
import Store from '../../Core/data/Store.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import StringHelper from '../../Core/helper/StringHelper.js';

/**
 * @module Scheduler/widget/ResourceFilter
 */

/**
 * A List which allows selection of resources to filter a specified eventStore to only show
 * events for the selected resources.
 *
 * @extends Core/widget/List
 * @classType resourceFilter
 */
export default class ResourceFilter extends List {
    static get $name() {
        return 'ResourceFilter';
    }

    // Factoryable type name
    static get type() {
        return 'resourcefilter';
    }

    static get delayable() {
        return {
            applyFilter : 'raf'
        };
    }

    static get configurable() {
        return {
            /**
             * The {@link Scheduler.data.EventStore EventStore} to filter.
             * Events for resources which are deselected in this List will be filtered out.
             * @config {Scheduler.data.EventStore}
             */
            eventStore : null,

            multiSelect            : true,
            toggleAllIfCtrlPressed : true,
            itemTpl                : record => StringHelper.encodeHtml(record.name || '')
        };
    }

    itemIconTpl(record, i) {
        const
            { eventColor } = record,
            // Named colors are applied using CSS
            cls            = DomHelper.isNamedColor(eventColor) ? ` b-sch-foreground-${eventColor}` : '',
            // CSS style color is used as is
            style          = !cls && eventColor ? ` style="color:${eventColor}"` : '';

        return this.multiSelect ? `<div class="b-selected-icon b-icon${cls}"${style}></div>` : '';
    }

    updateEventStore(eventStore) {
        const
            { resourceStore } = eventStore,
            // HACK: Temp workaround until List's store is dynamically updatable
            chainedStoreConfig = this.initialConfig.store instanceof Store ? this.initialConfig.store.initialConfig : this.store?.config;

        this.store = resourceStore.makeChained(null, null, chainedStoreConfig);

        if (!resourceStore.count) {
            resourceStore.project.on({
                name    : 'project',
                refresh : 'initFilter',
                thisObj : this
            });
        }
        else {
            this.initFilter();
        }
    }

    initFilter() {
        const { eventStore } = this;

        if (eventStore.count && eventStore.resourceStore.count) {
            this.selected.add(this.store.getRange());
            this.detachListeners('project');
        }
    }

    onSelectionChange({ source : selected }) {
        // Filter disabled if all resources selected
        const
            me       = this,
            disabled = selected.count === me.eventStore.resourceStore.count;

        super.onSelectionChange(...arguments);

        // If this is the first selection change triggered from the first project refresh
        // in which all the resources are selected, then we don't need to apply the filters.
        // because all resources are selected
        if (!me.resourceFilter) {
            // Our client EventStore is filtered to only show events for our selected resources.
            // Events without an associated resource are filtered into visibility.
            // The addFilter function with silent param adds the filter but don't reevaluate filtering.
            me.resourceFilter = me.eventStore.addFilter({
                id       : `${me.id}-filter-instance`,
                filterBy : e => !e.resource || me.selected.includes(e.resources),
                disabled
            }, true);

            return;
        }

        // Filter disabled if all resources selected
        me.resourceFilter.disabled = disabled;

        // Have the client EventStore refresh its filtering but after a small delay so the List UI updates immediately.
        me.applyFilter();
    }

    applyFilter() {
        this.eventStore.filter();
    }
}

// Register this widget type with its Factory
ResourceFilter.initClass();
