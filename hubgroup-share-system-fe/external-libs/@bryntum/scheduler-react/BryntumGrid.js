import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _createSuper from "@babel/runtime/helpers/esm/createSuper";

/**
 * React wrapper for Bryntum Grid
 */
import React, { Component } from 'react';
import WrapperHelper from './WrapperHelper.js';
import { Grid } from '@bryntum/scheduler/scheduler.umd';

var BryntumGrid = /*#__PURE__*/function (_Component) {
  _inherits(BryntumGrid, _Component);

  var _super = _createSuper(BryntumGrid);

  function BryntumGrid() {
    var _this;

    _classCallCheck(this, BryntumGrid);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.dataStores = {};
    _this.featureNames = ['cellEditFeature', 'cellMenuFeature', 'cellTooltipFeature', 'columnAutoWidthFeature', 'columnDragToolbarFeature', 'columnPickerFeature', 'columnReorderFeature', 'columnResizeFeature', 'contextMenuFeature', 'excelExporterFeature', 'filterFeature', 'filterBarFeature', 'groupFeature', 'groupSummaryFeature', 'headerMenuFeature', 'pdfExportFeature', 'quickFindFeature', 'regionResizeFeature', 'rowCopyPasteFeature', 'rowReorderFeature', 'searchFeature', 'sortFeature', 'stickyCellsFeature', 'stripeFeature', 'summaryFeature', 'treeFeature'];
    _this.portalsCache = undefined;
    _this.portalContainerClass = 'b-react-portal-container';
    _this.state = {
      // Holds React portals
      portals: new Map(),
      // Needed to trigger refresh when portals change
      generation: 0
    };
    _this.configNames = ['adopt', 'align', 'anchor', 'animateRemovingRows', 'appendTo', 'autoHeight', 'bbar', 'bodyCls', 'bubbleEvents', 'centered', 'cls', 'columns', 'config', 'constrainTo', 'contentElementCls', 'contextMenuTriggerEvent', 'defaultBindProperty', 'defaultRegion', 'defaults', 'destroyStore', 'disableGridRowModelWarning', 'dock', 'draggable', 'emptyText', 'enableSticky', 'enableTextSelection', 'enableUndoRedoKeys', 'features', 'fillLastColumn', 'fixedRowHeight', 'floating', 'footer', 'fullRowRefresh', 'getRowHeight', 'header', 'hideAnimation', 'hideHeaders', 'hideWhenEmpty', 'htmlCls', 'insertBefore', 'insertFirst', 'itemCls', 'lazyItems', 'listeners', 'loadMask', 'loadMaskDefaults', 'loadMaskError', 'localeClass', 'localizableProperties', 'longPressTime', 'maskDefaults', 'masked', 'monitorResize', 'namedItems', 'owner', 'plugins', 'positioned', 'preserveFocusOnDatasetChange', 'preserveScrollOnDatasetChange', 'preventTooltipOnTouch', 'resizeToFitIncludesHeader', 'responsiveLevels', 'ripple', 'rootElement', 'scrollAction', 'scrollerClass', 'scrollManager', 'selectionMode', 'showAnimation', 'showDirty', 'showRemoveRowInContextMenu', 'showTooltipWhenDisabled', 'strips', 'subGridConfigs', 'syncMask', 'tab', 'tag', 'tbar', 'textAlign', 'textContent', 'title', 'trapFocus', 'weight'];
    _this.propertyConfigNames = ['alignSelf', 'columnLines', 'content', 'data', 'dataset', 'disabled', 'extraData', 'flex', 'height', 'hidden', 'html', 'id', 'items', 'layout', 'layoutStyle', 'margin', 'maxHeight', 'maxWidth', 'minHeight', 'minWidth', 'onBeforeCellEditStart', 'onBeforeDestroy', 'onBeforeExport', 'onBeforeFinishCellEdit', 'onBeforeHide', 'onBeforeRenderRows', 'onBeforeSetRecord', 'onBeforeShow', 'onBeforeToggleNode', 'onCancelCellEdit', 'onCatchAll', 'onCellClick', 'onCellContextMenu', 'onCellContextMenuBeforeShow', 'onCellContextMenuShow', 'onCellDblClick', 'onCellMenuBeforeShow', 'onCellMenuItem', 'onCellMenuShow', 'onCellMenuToggleItem', 'onCellMouseOut', 'onCellMouseOver', 'onCollapseNode', 'onContextMenuItem', 'onContextMenuToggleItem', 'onDestroy', 'onExpandNode', 'onExport', 'onFinishCellEdit', 'onFocusIn', 'onFocusOut', 'onHeaderContextMenuBeforeShow', 'onHeaderContextMenuShow', 'onHeaderMenuBeforeShow', 'onHeaderMenuItem', 'onHeaderMenuShow', 'onHeaderMenuToggleItem', 'onHide', 'onMouseOut', 'onMouseOver', 'onPaint', 'onReadOnly', 'onRenderRows', 'onResize', 'onResponsive', 'onScroll', 'onSelectionChange', 'onShow', 'onStartCellEdit', 'onSubGridCollapse', 'onSubGridExpand', 'onToggleNode', 'onToolClick', 'readOnly', 'rowHeight', 'scrollable', 'store', 'tools', 'tooltip', 'transitionDuration', 'width', 'x', 'y'];
    _this.propertyNames = ['anchorSize', 'isSettingValues', 'isValid', 'record', 'selectedCell', 'selectedRecord', 'selectedRecords', 'state', 'values'];
    _this.instance = undefined;
    _this.element = undefined;
    return _this;
  }

  _createClass(BryntumGrid, [{
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

  return BryntumGrid;
}(Component);

BryntumGrid.instanceClass = Grid;
BryntumGrid.isView = true;
export { BryntumGrid as default };