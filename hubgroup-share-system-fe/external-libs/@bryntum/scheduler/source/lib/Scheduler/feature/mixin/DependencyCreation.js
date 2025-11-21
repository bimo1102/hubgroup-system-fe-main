import Base from '../../../Core/Base.js';
import DomHelper from '../../../Core/helper/DomHelper.js';
import Objects from '../../../Core/helper/util/Objects.js';
import Rectangle from '../../../Core/helper/util/Rectangle.js';
import Tooltip from '../../../Core/widget/Tooltip.js';
import EventHelper from '../../../Core/helper/EventHelper.js';
import DependencyBaseModel from '../../model/DependencyBaseModel.js';

/**
 * @module Scheduler/feature/mixin/DependencyCreation
 */

// TODO: refactor this class using StateChart utility to be implemented in Core/util/StateChart.js or XState library if allowed to be used
/**
 * Mixin for Dependencies feature that handles dependency creation (drag & drop from terminals which are shown on hover).
 * Requires {@link Core.mixin.Delayable} to be mixed in alongside.
 *
 * @mixin
 */
export default Target => class DependencyCreation extends (Target || Base) {
    static get $name() {
        return 'DependencyCreation';
    }

    //region Config

    static get defaultConfig() {
        return {
            /**
             * `false` to require a drop on a target event bar side circle to define the dependency type.
             * If dropped on the event bar, the `defaultValue` of the DependencyModel `type` field will be used to
             * determine the target task side.
             *
             * @member {Boolean} allowDropOnEventBar
             */
            /**
             * `false` to require a drop on a target event bar side circle to define the dependency type.
             * If dropped on the event bar, the `defaultValue` of the DependencyModel `type` field will be used to
             * determine the target task side.
             *
             * @config {Boolean}
             * @default
             */
            allowDropOnEventBar : true,

            /**
             * `false` to not show a tooltip while creating a dependency
             * @config {Boolean}
             * @default
             */
            showCreationTooltip : true,

            /**
             * A tooltip config object that will be applied to the dependency creation tooltip
             * @config {Object}
             */
            creationTooltip : null,

            /**
             * CSS class used for terminals
             * @config {String}
             * @default
             */
            terminalCls : 'b-sch-terminal',

            /**
             * Where (at events borders) to display terminals
             * @config {String[]}
             * @default
             */
            terminalSides : ['left', 'top', 'right', 'bottom'],

            /**
             * Set to `false` to not allow creating dependencies
             * @config {Boolean}
             * @default
             */
            allowCreate : true
        };
    }

    //endregion

    //region Init & destroy

    construct(view, config) {
        super.construct(view, config);

        const me = this;

        me.view = view;
        me.eventName = view.scheduledEventName;

        view.on('readOnly', () => me.updateCreateListeners());

        me.updateCreateListeners();
    }

    doDestroy() {
        const me = this;

        me.detachListeners('view');

        me.creationData = null;

        me.mouseUpMoveDetacher?.();
        me.creationTooltip?.destroy();

        super.doDestroy();
    }

    updateCreateListeners() {
        const me = this;

        if (!me.view) {
            return;
        }

        me.detachListeners('view');

        if (me.isCreateAllowed) {
            me.view.on({
                name                          : 'view',
                [`${me.eventName}mouseenter`] : 'onTimeSpanMouseEnter',
                [`${me.eventName}mouseleave`] : 'onTimeSpanMouseLeave',
                thisObj                       : me
            });
        }
    }

    set allowCreate(value) {
        this._allowCreate = value;

        this.updateCreateListeners();
    }

    get allowCreate() {
        return this._allowCreate;
    }

    get isCreateAllowed() {
        return this.allowCreate && !this.view.readOnly && !this.disabled;
    }

    //endregion

    //region Events

    /**
     * Show terminals when mouse enters event/task element
     * @private
     */
    onTimeSpanMouseEnter({
        event, source, [`${this.eventName}Record`]: record, [`${this.eventName}Element`]: element
    }) {
        if (!record.isCreating) {
            const eventBarElement = DomHelper.down(element, source.eventInnerSelector);
            this.showTerminals(record, eventBarElement);

            if (this.creationData && event.target.closest(this.client.eventSelector)) {
                this.creationData.timeSpanElement = eventBarElement;
                this.onOverTargetEventBar(event);
            }
        }
    }

    /**
     * Hide terminals when mouse leaves event/task element
     * @private
     */
    onTimeSpanMouseLeave(event) {
        const
            me              = this,
            element         = event[`${me.eventName}Element`],
            target          = event.event.relatedTarget,
            timeSpanElement = me.creationData?.timeSpanElement;

        if (!me.creationData || !timeSpanElement || !DomHelper.isDescendant(timeSpanElement, target)) {
            me.hideTerminals(element);
        }

        if (me.creationData && !me.creationData.finalizing) {
            me.creationData.timeSpanElement = null;
            me.onOverNewTargetWhileCreating();
        }
    }

    onTerminalMouseOver(event) {
        if (this.creationData) {
            this.onOverTargetEventBar(event);
        }
    }

    /**
     * Remove hover styling when mouse leaves terminal. Also hides terminals when mouse leaves one it and not creating a
     * dependency.
     * @private
     */
    onTerminalMouseOut(event) {
        const
            me = this,
            el = DomHelper.up(event.target, me.view.eventSelector);

        if (el && (!me.showingTerminalsFor || !DomHelper.isDescendant(el, me.showingTerminalsFor)) && (!me.creationData || el !== me.creationData.timeSpanElement)) {
            me.hideTerminals(el);
            me.view.unhover(event);
        }

        if (me.creationData) {
            me.onOverNewTargetWhileCreating(event.relatedTarget, me.creationData.target);
        }
    }

    /**
     * Start creating a dependency when mouse is pressed over terminal
     * @private
     */
    onTerminalMouseDown(event) {
        const me = this;

        // ignore non-left button clicks
        if (event.button === 0 && !me.creationData) {
            const
                scheduler              = me.view,
                timeAxisSubGridElement = scheduler.timeAxisSubGridElement,
                terminalNode           = event.target,
                timeSpanElement        = terminalNode.closest(scheduler.eventInnerSelector),
                viewBounds             = Rectangle.from(scheduler.element, document.body);

            event.preventDefault();
            event.stopPropagation();

            me.creationData = {
                source         : scheduler.resolveTimeSpanRecord(timeSpanElement),
                fromSide       : terminalNode.dataset.side,
                startPoint     : Rectangle.from(terminalNode, timeAxisSubGridElement).center,
                startX         : event.pageX - viewBounds.x + scheduler.scrollLeft,
                startY         : event.pageY - viewBounds.y + scheduler.scrollTop,
                valid          : false,
                sourceResource : scheduler.resolveResourceRecord?.(timeSpanElement)
            };

            me.mouseUpMoveDetacher = EventHelper.on({
                mouseup : {
                    element : scheduler.rootElement,
                    handler : 'onMouseUp'
                },
                mousemove : {
                    element : timeAxisSubGridElement,
                    handler : 'onMouseMove'
                },
                thisObj : me
            });

            // If root element is anything but Document (it could be Document Fragment or regular Node in case of LWC)
            // then we should also add listener to document to cancel dependency creation
            me.documentMouseUpDetacher = EventHelper.on({
                mouseup : {
                    element : document,
                    handler : 'onDocumentMouseUp'
                },
                keydown : {
                    element : document,
                    handler : ({ key }) => {
                        if (key === 'Escape') {
                            me.abort();
                        }
                    }
                },
                thisObj : me
            });
        }
    }

    /**
     * Update connector line showing dependency between source and target when mouse moves. Also check if mouse is over
     * a valid target terminal
     * @private
     */
    onMouseMove(event) {
        const
            me                            = this,
            { view, creationData : data } = me,
            viewBounds                    = Rectangle.from(view.element, document.body),
            deltaX                        = (event.pageX - viewBounds.x + view.scrollLeft) - data.startX,
            deltaY                        = (event.pageY - viewBounds.y + view.scrollTop) - data.startY,
            length                        = Math.round(Math.sqrt(deltaX * deltaX + deltaY * deltaY)) - 3,
            angle                         = Math.atan2(deltaY, deltaX);

        let { connector } = me;

        if (!connector) {
            if (me.onRequestDragCreate() === false) {
                return;
            }
            connector = me.connector;
        }

        connector.style.width     = `${length}px`;
        connector.style.transform = `rotate(${angle}rad)`;

        me.lastMouseMoveEvent = event;
    }

    onRequestDragCreate() {
        const
            me                            = this,
            { view, creationData : data } = me;

        /**
         * Fired on the owning Scheduler/Gantt before a dependency creation drag operation starts. Return `false to
         * prevent it
         * @event beforeDependencyCreateDrag
         * @on-owner
         * @param {Object} data [DEPRECATED] in a favor of top level params
         * @param {Scheduler.model.TimeSpan} data.source [DEPRECATED] in favor of the source param
         * @param {Scheduler.model.TimeSpan} source The source task
         */
        if (view.trigger('beforeDependencyCreateDrag', { data, source : data.source }) === false) {
            me.abort();
            return false;
        }

        view.element.classList.add('b-creating-dependency');

        me.connector = me.createConnector(data.startPoint.x, data.startPoint.y);

        /**
         * Fired on the owning Scheduler/Gantt when a dependency creation drag operation starts
         * @event dependencyCreateDragStart
         * @on-owner
         * @param {Object} data [DEPRECATED] in a favor of top level params
         * @param {Scheduler.model.TimeSpan} source The source task
         */
        view.trigger('dependencyCreateDragStart', { data, source : data.source  });

        if (me.showCreationTooltip) {
            me.creationTooltip = me.creationTooltip || me.createDragTooltip();

            me.creationTooltip.disabled = false;
            me.creationTooltip.show();
        }

        view.scrollManager.startMonitoring({
            scrollables : [
                {
                    element   : view.timeAxisSubGrid.scrollable.element,
                    direction : 'horizontal'
                },
                {
                    element   : view.scrollable.element,
                    direction : 'vertical'
                }
            ],
            callback : () => me.lastMouseMoveEvent && me.onMouseMove(me.lastMouseMoveEvent)
        });
    }

    onOverTargetEventBar({ target }) {
        const
            me                                                = this,
            { view, creationData: data, allowDropOnEventBar } = me,
            overEventRecord                                   = view.resolveTimeSpanRecord(target);

        if (Objects.isPromise(data.valid) || (!allowDropOnEventBar && !target.classList.contains(me.terminalCls))) {
            return;
        }

        if (overEventRecord !== data.source) {
            me.onOverNewTargetWhileCreating(target, overEventRecord);
        }
    }

    async onOverNewTargetWhileCreating(target, overEventRecord) {
        const
            me                                                           = this,
            { view, creationData: data, connector, allowDropOnEventBar } = me;

        if (Objects.isPromise(data.valid)) {
            return;
        }

        connector.classList.remove('b-valid', 'b-invalid');
        data.timeSpanElement && DomHelper.removeClsGlobally(data.timeSpanElement, 'b-sch-terminal-active');

        if (!overEventRecord || overEventRecord === data.source || (!allowDropOnEventBar && !target.classList.contains(me.terminalCls))) {
            data.target = data.toSide = null;
            data.valid = false;
            connector.classList.add('b-invalid');
        }
        else {
            let toSide  = target.dataset.side;
            data.target = overEventRecord;

            // If we allow dropping anywhere on a task, resolve target side based on the default type of the
            // dependency model used
            if (allowDropOnEventBar && !target.classList.contains(me.terminalCls)) {
                toSide = me.getTargetSideFromType(me.dependencyStore.modelClass.fieldMap.type.defaultValue || DependencyBaseModel.Type.EndToStart);
            }

            if (view.resolveResourceRecord) {
                data.targetResource = view.resolveResourceRecord(target);
            }

            let dependencyType;

            data.toSide = toSide;

            const
                fromSide       = data.fromSide,
                updateValidity = valid => {
                    if (!me.isDestroyed) {
                        data.valid = valid;
                        target.classList.add(valid ? 'b-valid' : 'b-invalid');
                        connector.classList.add(valid ? 'b-valid' : 'b-invalid');
                        /**
                         * Fired on the owning Scheduler/Gantt when asynchronous dependency validation completes
                         * @event dependencyValidationComplete
                         * @on-owner
                         * @param {Object} data [DEPRECATED] in a favor of top level params
                         * @param {Scheduler.model.TimeSpan} source The source task
                         * @param {Scheduler.model.TimeSpan} target The target task
                         * @param {Number} dependencyType The dependency type, see {@link Scheduler.model.DependencyBaseModel#property-Type-static}
                         */
                        view.trigger('dependencyValidationComplete', {
                            data, source : data.source, target : data.target, dependencyType
                        });
                    }
                };

            // NOTE: Top/Bottom sides are not taken into account due to
            //       scheduler doesn't check for type value anyway, whereas
            //       gantt will reject any other dependency types undefined in
            //       DependencyBaseModel.Type enumeration.
            switch (true) {
                case fromSide === 'left' && toSide === 'left':
                    dependencyType = DependencyBaseModel.Type.StartToStart;
                    break;
                case fromSide === 'left' && toSide === 'right':
                    dependencyType = DependencyBaseModel.Type.StartToEnd;
                    break;
                case fromSide === 'right' && toSide === 'left':
                    dependencyType = DependencyBaseModel.Type.EndToStart;
                    break;
                case fromSide === 'right' && toSide === 'right':
                    dependencyType = DependencyBaseModel.Type.EndToEnd;
                    break;
            }

            /**
             * Fired on the owning Scheduler/Gantt when asynchronous dependency validation starts
             * @event dependencyValidationStart
             * @on-owner
             * @param {Object} data [DEPRECATED] in a favor of top level params
             * @param {Scheduler.model.TimeSpan} source The source task
             * @param {Scheduler.model.TimeSpan} target The target task
             * @param {Number} dependencyType The dependency type, see {@link Scheduler.model.DependencyBaseModel#property-Type-static}
             */
            view.trigger('dependencyValidationStart', {
                data, source : data.source, target : data.target, dependencyType
            });

            data.valid = me.dependencyStore.isValidDependency(data.source, data.target, dependencyType);

            // Promise is returned when using the engine
            if (Objects.isPromise(data.valid)) {
                const asyncValid = await data.valid;
                updateValidity(asyncValid);
            }
            else {
                updateValidity(data.valid);
            }

            const validityCls = data.valid ? 'b-valid' : 'b-invalid';
            connector.classList.add(validityCls);
            data.timeSpanElement?.querySelector(`.b-sch-terminal[data-side=${toSide}]`).classList.add('b-sch-terminal-active', validityCls);
        }

        me.updateTooltip();
    }

    /**
     * Create a new dependency if mouse release over valid terminal. Hides connector
     * @private
     */
    async onMouseUp(event) {
        const
            me   = this,
            data = me.creationData;

        data.finalizing = true;
        me.mouseUpMoveDetacher?.();

        if (data.valid) {
            /**
             * Fired on the owning Scheduler/Gantt when a dependency drag creation operation is about to finalize
             *
             * @event beforeDependencyCreateFinalize
             * @on-owner
             * @preventable
             * @async
             * @param {Scheduler.model.TimeSpan} source The source task
             * @param {Scheduler.model.TimeSpan} target The target task
             * @param {String} fromSide The from side (left / right / top / bottom)
             * @param {String} toSide The to side (left / right / top / bottom)
             */
            const result = await me.view.trigger('beforeDependencyCreateFinalize', data);

            if (result === false) {
                data.valid = false;
            }
            // Await any async validation logic before continuing
            else if (Objects.isPromise(data.valid)) {
                const valid = await data.valid;

                data.valid = valid;
            }

            if (data.valid) {
                let dependency = me.createDependency(data);

                if (Objects.isPromise(dependency)) {
                    dependency = await dependency;
                }

                data.dependency = dependency;

                /**
                 * Fired on the owning Scheduler/Gantt when a dependency drag creation operation succeeds
                 * @event dependencyCreateDrop
                 * @on-owner
                 * @param {Object} data [DEPRECATED] in a favor of top level params
                 * @param {Scheduler.model.TimeSpan} source The source task
                 * @param {Scheduler.model.TimeSpan} target The target task
                 * @param {Scheduler.model.DependencyBaseModel} dependency The created dependency
                 */
                me.view.trigger('dependencyCreateDrop', { data, source : data.source, target : data.target, dependency });
                this.doAfterDependencyDrop(data);
            }
            else {
                me.doAfterDependencyDrop(data);
            }
        }
        else {
            data.valid = false;
            me.doAfterDependencyDrop(data);
        }

        this.abort();
    }

    doAfterDependencyDrop(data) {
        /**
         * Fired on the owning Scheduler/Gantt after a dependency drag creation operation finished, no matter to outcome
         * @event afterDependencyCreateDrop
         * @on-owner
         * @param {Object} data [DEPRECATED] in a favor of top level params
         * @param {Scheduler.model.TimeSpan} source The source task
         * @param {Scheduler.model.TimeSpan} target The target task
         * @param {Scheduler.model.DependencyBaseModel} dependency The created dependency
         */
        this.view.trigger('afterDependencyCreateDrop', {
            data,
            ...data
        });
    }

    onDocumentMouseUp({ target }) {
        if (!this.view.timeAxisSubGridElement.contains(target)) {
            this.abort();
        }
    }

    /**
     * Aborts dependency creation, removes proxy and cleans up listeners
     */
    abort() {
        const
            me                     = this,
            { view, creationData } = me;

        // Remove terminals from source and target events.
        if (creationData) {
            const { source, sourceResource, target, targetResource } = creationData;

            if (source) {
                const el = view.getElementFromEventRecord(source, sourceResource);
                if (el) {
                    me.hideTerminals(el);
                }
            }
            if (target) {
                const el = view.getElementFromEventRecord(target, targetResource);
                if (el) {
                    me.hideTerminals(el);
                }
            }
        }

        if (me.creationTooltip) {
            me.creationTooltip.disabled = true;
        }

        me.creationData = me.lastMouseMoveEvent = null;

        me.mouseUpMoveDetacher?.();

        me.documentMouseUpDetacher?.();

        me.removeConnector();
    }

    //endregion

    //region Connector

    /**
     * Creates a connector line that visualizes dependency source & target
     * @private
     */
    createConnector(x, y) {
        const
            me   = this,
            view = me.view;

        me.clearTimeout(me.removeConnectorTimeout);
        me.connector = DomHelper.createElement({
            parent    : view.timeAxisSubGridElement,
            className : `${me.baseCls}-connector`,
            style     : `left:${x}px;top:${y}px`
        });

        view.element.classList.add('b-creating-dependency');

        return me.connector;
    }

    createDragTooltip() {
        const
            me       = this,
            { view } = me;

        const tooltip =  me.creationTooltip = Tooltip.new({
            id             : `${view.id}-dependency-drag-tip`,
            cls            : 'b-sch-dependency-creation-tooltip',
            loadingMsg     : '',
            anchorToTarget : false,
            // Keep tip visible until drag drop operation is finalized
            forElement     : view.timeAxisSubGridElement,
            trackMouse     : true,
            // Do not constrain at all, want it to be able to go outside of the viewport to not get in the way
            constrainTo    : null,

            header : {
                dock : 'right'
            },

            listeners : {
                beforeShow : () => {
                    // Show initial content immediately
                    me.updateTooltip();
                }
            }
        }, me.creationTooltip);

        tooltip.show();

        return tooltip;
    }

    /**
     * Remove connector
     * @private
     */
    removeConnector() {
        const
            me                  = this,
            { connector, view } = me;

        if (connector) {
            connector.classList.add('b-removing');
            connector.style.width = '0';
            me.removeConnectorTimeout = me.setTimeout(() => {
                connector.remove();
                me.connector = null;
            }, 200);
        }

        view.element.classList.remove('b-creating-dependency');
        me.creationTooltip && me.creationTooltip.hide();

        view.scrollManager.stopMonitoring();
    }

    //endregion

    //region Terminals

    /**
     * Show terminals for specified event at sides defined in #terminalSides.
     * @param {Scheduler.model.TimeSpan} timeSpanRecord Event/task to show terminals for
     * @param {HTMLElement} element Event/task element
     */
    showTerminals(timeSpanRecord, element) {
        const me = this;

        if (!me.isCreateAllowed) {
            return;
        }

        const
            cls                 = me.terminalCls,
            terminalsVisibleCls = `${cls}s-visible`;

        // We operate on the event bar, not the wrap
        element = DomHelper.down(element, me.view.eventInnerSelector);

        // bail out if terminals already shown or if view is readonly
        // do not draw new terminals if we are resizing event
        if (!element.classList.contains(terminalsVisibleCls) && !this.view.element.classList.contains('b-resizing-event') && !me.view.readOnly) {

            // create terminals for desired sides
            me.terminalSides.forEach(side => {
                const terminal = DomHelper.createElement({
                    parent    : element,
                    className : `${cls} ${cls}-${side}`,
                    dataset   : {
                        side,
                        feature : true
                    }
                });

                terminal.detacher = EventHelper.on({
                    element   : terminal,
                    mouseover : 'onTerminalMouseOver',
                    mouseout  : 'onTerminalMouseOut',
                    mousedown : {
                        handler : 'onTerminalMouseDown',
                        capture : true
                    },
                    thisObj : me
                });
            });

            element.classList.add(terminalsVisibleCls);
            timeSpanRecord.cls.add(terminalsVisibleCls);

            me.showingTerminalsFor = element;
        }
    }

    /**
     * Hide terminals for specified event
     * @param {HTMLElement} eventElement Event element
     */
    hideTerminals(eventElement) {
        // remove all terminals
        const
            me                  = this,
            eventParams         = me.client.getTimeSpanMouseEventParams(eventElement),
            timeSpanRecord      = eventParams?.[`${me.eventName}Record`],
            terminalsVisibleCls = `${me.terminalCls}s-visible`;

        DomHelper.forEachSelector(eventElement, `.${me.terminalCls}`, terminal => {
            terminal.detacher && terminal.detacher();
            terminal.remove();
        });

        DomHelper.down(eventElement, me.view.eventInnerSelector).classList.remove(terminalsVisibleCls);
        timeSpanRecord.cls.remove(terminalsVisibleCls);

        me.showingTerminalsFor = null;
    }

    //endregion

    //region Dependency creation

    /**
     * Create a new dependency from source terminal to target terminal
     * @internal
     */
    createDependency(data) {
        const
            { source, target, fromSide, toSide } = data,
            type               = (fromSide === 'left' ? 0 : 2) + (toSide === 'right' ? 1 : 0);

        return this.dependencyStore.add({
            from : source.id,
            to   : target.id,
            type,
            fromSide,
            toSide
        })[0];
    }

    getTargetSideFromType(type) {
        if (type === DependencyBaseModel.Type.StartToStart || type === DependencyBaseModel.Type.EndToStart) {
            return 'left';
        }

        return 'right';
    }

    //endregion

    //region Tooltip

    /**
     * Update dependency creation tooltip
     * @private
     */
    updateTooltip() {
        const
            me            = this,
            data          = me.creationData,
            { valid }     = data,
            tip           = this.creationTooltip,
            { classList } = tip.element;

        Object.assign(data, {
            fromText : data.source.name,
            toText   : data.target?.name ?? '',
            fromSide : data.fromSide,
            toSide   : data.toSide || ''
        });

        let tipTitleIconClsSuffix,
            tipTitleText;

        // Promise, when using engine
        if (Objects.isPromise(valid)) {
            classList.remove('b-invalid');
            classList.add('b-checking');

            return new Promise(resolve => valid.then(valid => {
                data.valid = valid;

                if (!tip.isDestroyed) {
                    resolve(me.updateTooltip());
                }
            }));
        }
        // Valid
        else if (valid === true) {
            classList.remove('b-invalid');
            classList.remove('b-checking');
            tipTitleIconClsSuffix = 'valid';
            tipTitleText = me.L('L{Dependencies.valid}');
        }
        // Invalid
        else {
            classList.remove('b-checking');
            classList.add('b-invalid');
            tipTitleIconClsSuffix = 'invalid';
            tipTitleText = me.L('L{Dependencies.invalid}');
        }

        tip.title = `<i class="b-icon b-icon-${tipTitleIconClsSuffix}"></i>${tipTitleText}`;

        tip.html = `<table class="b-sch-dependency-creation-tooltip">
                        <tr><td>${me.L('L{Dependencies.from}')}: </td><td>${data.fromText}</td><td><div class="b-sch-box b-${data.fromSide}"></div></td></tr>
                        <tr><td>${me.L('L{Dependencies.to}')}: </td><td>${data.toText}</td><td><div class="b-sch-box b-${data.toSide}"></div></td></tr>
                    </table>`;
    }

    //endregion
};
