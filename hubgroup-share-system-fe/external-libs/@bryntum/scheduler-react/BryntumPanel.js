import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _createSuper from "@babel/runtime/helpers/esm/createSuper";

/**
 * React wrapper for Bryntum Panel
 */
import React, { Component } from 'react';
import WrapperHelper from './WrapperHelper.js';
import { Panel } from '@bryntum/scheduler/scheduler.umd';

var BryntumPanel = /*#__PURE__*/function (_Component) {
  _inherits(BryntumPanel, _Component);

  var _super = _createSuper(BryntumPanel);

  function BryntumPanel() {
    var _this;

    _classCallCheck(this, BryntumPanel);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.configNames = ['adopt', 'align', 'anchor', 'appendTo', 'bbar', 'bodyCls', 'bubbleEvents', 'centered', 'cls', 'config', 'constrainTo', 'contentElementCls', 'defaultBindProperty', 'defaults', 'dock', 'draggable', 'floating', 'footer', 'header', 'hideAnimation', 'hideWhenEmpty', 'htmlCls', 'insertBefore', 'insertFirst', 'itemCls', 'lazyItems', 'listeners', 'localeClass', 'localizableProperties', 'maskDefaults', 'masked', 'monitorResize', 'namedItems', 'owner', 'positioned', 'preventTooltipOnTouch', 'ripple', 'rootElement', 'scrollAction', 'showAnimation', 'showTooltipWhenDisabled', 'strips', 'tab', 'tag', 'tbar', 'textAlign', 'textContent', 'title', 'trapFocus', 'weight'];
    _this.propertyConfigNames = ['alignSelf', 'content', 'dataset', 'disabled', 'extraData', 'flex', 'height', 'hidden', 'html', 'id', 'items', 'layout', 'layoutStyle', 'margin', 'maxHeight', 'maxWidth', 'minHeight', 'minWidth', 'onBeforeDestroy', 'onBeforeHide', 'onBeforeSetRecord', 'onBeforeShow', 'onCatchAll', 'onDestroy', 'onFocusIn', 'onFocusOut', 'onHide', 'onPaint', 'onReadOnly', 'onResize', 'onShow', 'onToolClick', 'readOnly', 'scrollable', 'tools', 'tooltip', 'width', 'x', 'y'];
    _this.propertyNames = ['anchorSize', 'isSettingValues', 'isValid', 'record', 'values'];
    _this.instance = undefined;
    _this.element = undefined;
    return _this;
  }

  _createClass(BryntumPanel, [{
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
      return /*#__PURE__*/React.createElement("div", {
        className: className,
        ref: function ref(element) {
          return _this2.element = element;
        }
      });
    }
  }]);

  return BryntumPanel;
}(Component);

BryntumPanel.instanceClass = Panel;
export { BryntumPanel as default };