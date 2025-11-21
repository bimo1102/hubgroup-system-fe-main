import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _createSuper from "@babel/runtime/helpers/esm/createSuper";

/**
 * React wrapper for Bryntum DateTimeField
 */
import React, { Component } from 'react';
import WrapperHelper from './WrapperHelper.js';
import { DateTimeField } from '@bryntum/scheduler/scheduler.umd';

var BryntumDateTimeField = /*#__PURE__*/function (_Component) {
  _inherits(BryntumDateTimeField, _Component);

  var _super = _createSuper(BryntumDateTimeField);

  function BryntumDateTimeField() {
    var _this;

    _classCallCheck(this, BryntumDateTimeField);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.configNames = ['adopt', 'align', 'anchor', 'appendTo', 'autoComplete', 'autoSelect', 'bubbleEvents', 'centered', 'clearable', 'cls', 'config', 'constrainTo', 'contentElementCls', 'dateField', 'defaultBindProperty', 'dock', 'draggable', 'editable', 'floating', 'hideAnimation', 'highlightExternalChange', 'hint', 'hintHtml', 'htmlCls', 'inputAlign', 'inputAttributes', 'inputWidth', 'insertBefore', 'insertFirst', 'keyStrokeChangeDelay', 'labelCls', 'labelPosition', 'labels', 'labelWidth', 'listeners', 'localeClass', 'localizableProperties', 'maskDefaults', 'masked', 'monitorResize', 'name', 'owner', 'placeholder', 'positioned', 'preventTooltipOnTouch', 'required', 'revertOnEscape', 'ripple', 'rootElement', 'scrollAction', 'showAnimation', 'showTooltipWhenDisabled', 'tab', 'tag', 'textAlign', 'timeField', 'title', 'weekStartDay', 'weight'];
    _this.propertyConfigNames = ['alignSelf', 'badge', 'content', 'dataset', 'disabled', 'extraData', 'flex', 'height', 'hidden', 'html', 'id', 'label', 'margin', 'maxHeight', 'maxWidth', 'minHeight', 'minWidth', 'onAction', 'onBeforeDestroy', 'onBeforeHide', 'onBeforeShow', 'onCatchAll', 'onChange', 'onClear', 'onDestroy', 'onFocusIn', 'onFocusOut', 'onHide', 'onInput', 'onPaint', 'onReadOnly', 'onResize', 'onShow', 'onTrigger', 'readOnly', 'scrollable', 'tooltip', 'triggers', 'value', 'width', 'x', 'y'];
    _this.propertyNames = ['anchorSize'];
    _this.instance = undefined;
    _this.element = undefined;
    return _this;
  }

  _createClass(BryntumDateTimeField, [{
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

  return BryntumDateTimeField;
}(Component);

BryntumDateTimeField.instanceClass = DateTimeField;
export { BryntumDateTimeField as default };