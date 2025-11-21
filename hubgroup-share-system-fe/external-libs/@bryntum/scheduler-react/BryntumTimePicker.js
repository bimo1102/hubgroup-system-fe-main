import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _createSuper from "@babel/runtime/helpers/esm/createSuper";

/**
 * React wrapper for Bryntum TimePicker
 */
import React, { Component } from 'react';
import WrapperHelper from './WrapperHelper.js';
import { TimePicker } from '@bryntum/scheduler/scheduler.umd';

var BryntumTimePicker = /*#__PURE__*/function (_Component) {
  _inherits(BryntumTimePicker, _Component);

  var _super = _createSuper(BryntumTimePicker);

  function BryntumTimePicker() {
    var _this;

    _classCallCheck(this, BryntumTimePicker);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.configNames = ['adopt', 'align', 'anchor', 'appendTo', 'autoClose', 'autoShow', 'bbar', 'bodyCls', 'bubbleEvents', 'centered', 'closable', 'closeAction', 'cls', 'config', 'constrainTo', 'contentElementCls', 'defaultBindProperty', 'defaults', 'dock', 'draggable', 'floating', 'focusOnToFront', 'footer', 'forElement', 'header', 'hideAnimation', 'hideWhenEmpty', 'htmlCls', 'insertBefore', 'insertFirst', 'itemCls', 'lazyItems', 'listeners', 'localeClass', 'localizableProperties', 'maskDefaults', 'masked', 'maximizable', 'modal', 'monitorResize', 'namedItems', 'owner', 'positioned', 'preventTooltipOnTouch', 'ripple', 'rootElement', 'scrollAction', 'showAnimation', 'showOnClick', 'showTooltipWhenDisabled', 'strips', 'tab', 'tag', 'tbar', 'textAlign', 'textContent', 'title', 'trapFocus', 'weight'];
    _this.propertyConfigNames = ['alignSelf', 'content', 'dataset', 'disabled', 'extraData', 'flex', 'format', 'height', 'hidden', 'html', 'id', 'items', 'layout', 'layoutStyle', 'margin', 'maxHeight', 'maximized', 'maxWidth', 'minHeight', 'minWidth', 'onBeforeClose', 'onBeforeDestroy', 'onBeforeHide', 'onBeforeSetRecord', 'onBeforeShow', 'onCatchAll', 'onDestroy', 'onFocusIn', 'onFocusOut', 'onHide', 'onPaint', 'onReadOnly', 'onResize', 'onShow', 'onTimeChange', 'onToolClick', 'readOnly', 'scrollable', 'tools', 'tooltip', 'value', 'width', 'x', 'y'];
    _this.propertyNames = ['anchorSize', 'initialValue', 'isSettingValues', 'isValid', 'max', 'min', 'record', 'values'];
    _this.instance = undefined;
    _this.element = undefined;
    return _this;
  }

  _createClass(BryntumTimePicker, [{
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

  return BryntumTimePicker;
}(Component);

BryntumTimePicker.instanceClass = TimePicker;
export { BryntumTimePicker as default };