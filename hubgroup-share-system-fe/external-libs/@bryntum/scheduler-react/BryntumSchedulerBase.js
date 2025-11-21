import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _createSuper from "@babel/runtime/helpers/esm/createSuper";

/**
 * React wrapper for Bryntum SchedulerBase
 */
import React, { Component } from 'react';
import WrapperHelper from './WrapperHelper.js';
import { SchedulerBase } from '@bryntum/scheduler/scheduler.umd';

var BryntumSchedulerBase = /*#__PURE__*/function (_Component) {
  _inherits(BryntumSchedulerBase, _Component);

  var _super = _createSuper(BryntumSchedulerBase);

  function BryntumSchedulerBase() {
    var _this;

    _classCallCheck(this, BryntumSchedulerBase);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.dataStores = {
      "assignmentStore": "assignments",
      "dependencyStore": "dependencies",
      "eventStore": "events",
      "resourceStore": "resources",
      "resourceTimeRangeStore": "resourceTimeRanges",
      "timeRangeStore": "timeRanges"
    };
    _this.featureNames = ['cellEditFeature', 'cellMenuFeature', 'cellTooltipFeature', 'columnAutoWidthFeature', 'columnDragToolbarFeature', 'columnLinesFeature', 'columnPickerFeature', 'columnReorderFeature', 'columnResizeFeature', 'contextMenuFeature', 'dependenciesFeature', 'dependencyEditFeature', 'eventContextMenuFeature', 'eventCopyPasteFeature', 'eventDragFeature', 'eventDragCreateFeature', 'eventDragSelectFeature', 'eventEditFeature', 'eventFilterFeature', 'eventMenuFeature', 'eventResizeFeature', 'eventTooltipFeature', 'excelExporterFeature', 'filterFeature', 'filterBarFeature', 'groupFeature', 'groupSummaryFeature', 'headerContextMenuFeature', 'headerMenuFeature', 'headerZoomFeature', 'labelsFeature', 'nonWorkingTimeFeature', 'panFeature', 'pdfExportFeature', 'quickFindFeature', 'regionResizeFeature', 'resourceTimeRangesFeature', 'rowCopyPasteFeature', 'rowReorderFeature', 'scheduleContextFeature', 'scheduleContextMenuFeature', 'scheduleMenuFeature', 'scheduleTooltipFeature', 'searchFeature', 'simpleEventEditFeature', 'sortFeature', 'stickyCellsFeature', 'stickyEventsFeature', 'stripeFeature', 'summaryFeature', 'timeAxisHeaderMenuFeature', 'timeRangesFeature', 'treeFeature'];
    _this.portalsCache = undefined;
    _this.portalContainerClass = 'b-react-portal-container';
    _this.state = {
      // Holds React portals
      portals: new Map(),
      // Needed to trigger refresh when portals change
      generation: 0
    };
    _this.configNames = ['adopt', 'align', 'allowCreate', 'allowOver', 'allowOverlap', 'anchor', 'anchorToTarget', 'animateRemovingRows', 'appendTo', 'autoAdjustTimeAxis', 'autoClose', 'autoHeight', 'autoShow', 'bbar', 'bodyCls', 'bubbleEvents', 'bufferCoef', 'bufferThreshold', 'centered', 'closable', 'closeAction', 'cls', 'columns', 'config', 'constrainTo', 'contentElementCls', 'contextMenuTriggerEvent', 'createEventOnDblClick', 'creationTooltip', 'crudManagerClass', 'date', 'defaultBindProperty', 'defaultRegion', 'defaultResourceImageName', 'defaults', 'descriptionRenderer', 'destroyStore', 'destroyStores', 'disableGridRowModelWarning', 'dismissDelay', 'dock', 'draggable', 'durationDisplayPrecision', 'emptyText', 'enableDeleteKey', 'enableEventAnimations', 'enableRecurringEvents', 'enableSticky', 'enableTextSelection', 'enableUndoRedoKeys', 'endParamName', 'eventBarTextField', 'eventBodyTemplate', 'eventColor', 'eventRenderer', 'eventRendererThisObj', 'eventSelectionDisabled', 'eventStyle', 'features', 'fillLastColumn', 'fixedRowHeight', 'floating', 'focusOnToFront', 'footer', 'forceFit', 'forElement', 'forSelector', 'fullRowRefresh', 'getDateConstraints', 'getHtml', 'getRowHeight', 'header', 'hideAnimation', 'hideDelay', 'hideHeaders', 'hideOnDelegateChange', 'hideWhenEmpty', 'highlightPredecessors', 'highlightSuccessors', 'horizontalEventSorterFn', 'hoverDelay', 'htmlCls', 'infiniteScroll', 'insertBefore', 'insertFirst', 'itemCls', 'lazyItems', 'listeners', 'loadingMsg', 'loadMask', 'loadMaskDefaults', 'loadMaskError', 'localeClass', 'localizableProperties', 'longPressTime', 'maintainSelectionOnDatasetChange', 'managedEventSizing', 'maskDefaults', 'masked', 'maximizable', 'maximized', 'milestoneCharWidth', 'milestoneLayoutMode', 'milestoneTextPosition', 'modal', 'mode', 'monitorResize', 'mouseOffsetX', 'mouseOffsetY', 'multiEventSelect', 'namedItems', 'owner', 'partner', 'passStartEndParameters', 'plugins', 'positioned', 'preCalculateHeightLimit', 'preserveFocusOnDatasetChange', 'preserveScrollOnDatasetChange', 'preventTooltipOnTouch', 'range', 'removeUnassignedEvent', 'resizeToFitIncludesHeader', 'resourceColumns', 'resourceImageExtension', 'resourceImagePath', 'responsiveLevels', 'ripple', 'rootElement', 'scrollAction', 'scrollerClass', 'scrollManager', 'selectionMode', 'showAnimation', 'showCreationTooltip', 'showDirty', 'showOnClick', 'showOnHover', 'showRecurringUI', 'showRemoveRowInContextMenu', 'showTooltipWhenDisabled', 'snapRelativeToEventStartDate', 'startParamName', 'stepUnit', 'stickyHeaders', 'strips', 'subGridConfigs', 'suppressFit', 'syncMask', 'tab', 'tag', 'tbar', 'terminalCls', 'terminalSides', 'textAlign', 'textContent', 'timeAxis', 'title', 'trapFocus', 'triggerSelectionChangeOnRemove', 'verticalTimeAxisColumn', 'visibleDate', 'visibleZoomFactor', 'weekStartDay', 'weight', 'zoomKeepsOriginalTimespan', 'zoomOnMouseWheel', 'zoomOnTimeAxisDoubleClick'];
    _this.propertyConfigNames = ['alignSelf', 'allowDropOnEventBar', 'assignments', 'assignmentStore', 'barMargin', 'columnLines', 'content', 'crudManager', 'data', 'dataset', 'dependencies', 'dependencyStore', 'disabled', 'displayDateFormat', 'endDate', 'eventLayout', 'events', 'eventStore', 'extraData', 'fillTicks', 'flex', 'height', 'hidden', 'html', 'id', 'items', 'layout', 'layoutStyle', 'margin', 'maxHeight', 'maxWidth', 'maxZoomLevel', 'milestoneAlign', 'minHeight', 'minWidth', 'minZoomLevel', 'onAfterDependencyCreateDrop', 'onAfterDependencySave', 'onAfterDragCreate', 'onAfterEventDrop', 'onAfterEventSave', 'onAssignmentSelectionChange', 'onBeforeAssignmentDelete', 'onBeforeCellEditStart', 'onBeforeDependencyAdd', 'onBeforeDependencyCreateDrag', 'onBeforeDependencyCreateFinalize', 'onBeforeDependencyDelete', 'onBeforeDependencyEdit', 'onBeforeDependencyEditShow', 'onBeforeDependencySave', 'onBeforeDestroy', 'onBeforeDragCreate', 'onBeforeDragCreateFinalize', 'onBeforeEventAdd', 'onBeforeEventDelete', 'onBeforeEventDrag', 'onBeforeEventDropFinalize', 'onBeforeEventEdit', 'onBeforeEventEditShow', 'onBeforeEventResize', 'onBeforeEventResizeFinalize', 'onBeforeEventSave', 'onBeforeExport', 'onBeforeFinishCellEdit', 'onBeforeHide', 'onBeforePresetChange', 'onBeforeRenderRows', 'onBeforeSetRecord', 'onBeforeShow', 'onBeforeToggleNode', 'onCancelCellEdit', 'onCatchAll', 'onCellClick', 'onCellContextMenu', 'onCellContextMenuBeforeShow', 'onCellContextMenuShow', 'onCellDblClick', 'onCellMenuBeforeShow', 'onCellMenuItem', 'onCellMenuShow', 'onCellMenuToggleItem', 'onCellMouseOut', 'onCellMouseOver', 'onCollapseNode', 'onContextMenuItem', 'onContextMenuToggleItem', 'onDataChange', 'onDependencyClick', 'onDependencyCreateDragStart', 'onDependencyCreateDrop', 'onDependencyDblClick', 'onDependencyMouseOut', 'onDependencyMouseOver', 'onDependencyValidationComplete', 'onDependencyValidationStart', 'onDestroy', 'onDragCreateEnd', 'onDragCreateStart', 'onEventClick', 'onEventContextMenu', 'onEventDblClick', 'onEventDrag', 'onEventDragAbort', 'onEventDragStart', 'onEventDrop', 'onEventEditBeforeSetRecord', 'onEventKeyDown', 'onEventKeyUp', 'onEventMenuBeforeShow', 'onEventMenuItem', 'onEventMenuShow', 'onEventMouseDown', 'onEventMouseOut', 'onEventMouseOver', 'onEventMouseUp', 'onEventPartialResize', 'onEventResizeEnd', 'onEventResizeStart', 'onEventSelectionChange', 'onExpandNode', 'onExport', 'onFinishCellEdit', 'onFocusIn', 'onFocusOut', 'onHeaderContextMenuBeforeShow', 'onHeaderContextMenuShow', 'onHeaderMenuBeforeShow', 'onHeaderMenuItem', 'onHeaderMenuShow', 'onHeaderMenuToggleItem', 'onHide', 'onMouseOut', 'onMouseOver', 'onNavigate', 'onPaint', 'onPresetChange', 'onReadOnly', 'onReleaseEvent', 'onRenderEvent', 'onRenderRows', 'onResize', 'onResourceHeaderClick', 'onResourceHeaderContextmenu', 'onResourceHeaderDblclick', 'onResponsive', 'onScheduleClick', 'onScheduleContextMenu', 'onScheduleDblClick', 'onScheduleMenuBeforeShow', 'onScheduleMenuItem', 'onScheduleMenuShow', 'onScheduleMouseMove', 'onScroll', 'onSelectionChange', 'onShow', 'onStartCellEdit', 'onSubGridCollapse', 'onSubGridExpand', 'onTimeAxisChange', 'onTimeAxisHeaderClick', 'onTimeAxisHeaderContextMenu', 'onTimeAxisHeaderContextMenuBeforeShow', 'onTimeAxisHeaderContextMenuItem', 'onTimeAxisHeaderContextMenuShow', 'onTimeAxisHeaderDblClick', 'onTimelineViewportResize', 'onToggleNode', 'onToolClick', 'presets', 'project', 'readOnly', 'resourceMargin', 'resources', 'resourceStore', 'resourceTimeRanges', 'resourceTimeRangeStore', 'rowHeight', 'scrollable', 'snap', 'startDate', 'store', 'tickSize', 'timeRanges', 'timeRangeStore', 'tools', 'tooltip', 'transitionDuration', 'useInitialAnimation', 'viewPreset', 'width', 'workingTime', 'x', 'y'];
    _this.propertyNames = ['anchorSize', 'eventColors', 'eventStyles', 'isEngineReady', 'isSettingValues', 'isValid', 'record', 'scrollLeft', 'scrollTop', 'selectedAssignments', 'selectedCell', 'selectedEvents', 'selectedRecord', 'selectedRecords', 'state', 'timeResolution', 'values', 'zoomLevel'];
    _this.instance = undefined;
    _this.element = undefined;
    return _this;
  }

  _createClass(BryntumSchedulerBase, [{
    key: "componentDidMount",
    value:
    /**
     * Invoked immediately after a component is mounted (inserted into the tree)
     */
    function componentDidMount() {
      var _WrapperHelper = WrapperHelper(),
          createWidget = _WrapperHelper.createWidget;

      this.instance = createWidget(this);
    } // React component removed, destroy instance

  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.instance) {
        this.instance.destroy();
      }
    }
    /**
     * Component about to be updated, from changing a prop using state.
     * React to it depending on what changed and prevent react from re-rendering our component.
     * @param nextProps
     * @param nextState
     * @return {boolean}
     */

  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var _WrapperHelper2 = WrapperHelper(),
          shouldComponentUpdate = _WrapperHelper2.shouldComponentUpdate;

      return shouldComponentUpdate(this, nextProps, nextState);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var className = "b-react-".concat(this.constructor.instanceClass.$name.toLowerCase(), "-container");
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        className: className,
        ref: function ref(element) {
          return _this2.element = element;
        }
      }, _toConsumableArray(this.state.portals).map(function (item) {
        return item[1];
      })), /*#__PURE__*/React.createElement("div", {
        ref: function ref(el) {
          return _this2.portalsCache = el;
        },
        className: "b-react-portals-cache",
        style: {
          display: 'none'
        }
      }));
    }
  }]);

  return BryntumSchedulerBase;
}(Component);

BryntumSchedulerBase.instanceClass = SchedulerBase;
BryntumSchedulerBase.isView = true;
export { BryntumSchedulerBase as default };