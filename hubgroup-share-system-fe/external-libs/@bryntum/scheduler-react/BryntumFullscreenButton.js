import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _createSuper from "@babel/runtime/helpers/esm/createSuper";

/**
 * React Fullscreen button wrapper
 */
import React, { Component } from 'react';
import { Fullscreen } from '@bryntum/scheduler/scheduler.umd';
import WrapperHelper from './WrapperHelper.js';

var BryntumFullscreenButton = /*#__PURE__*/function (_Component) {
  _inherits(BryntumFullscreenButton, _Component);

  var _super = _createSuper(BryntumFullscreenButton);

  function BryntumFullscreenButton() {
    _classCallCheck(this, BryntumFullscreenButton);

    return _super.apply(this, arguments);
  }

  _createClass(BryntumFullscreenButton, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _WrapperHelper = WrapperHelper(),
          createFullscreenButton = _WrapperHelper.createFullscreenButton;

      this.button = createFullscreenButton(this.el);

      if (this.button) {
        if (!this.props.skipRender) {
          this.button.render();
        }
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.button) {
        Fullscreen.onFullscreenChange(null);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      return /*#__PURE__*/React.createElement("div", {
        ref: function ref(el) {
          return _this.el = el;
        }
      });
    }
  }]);

  return BryntumFullscreenButton;
}(Component);

export { BryntumFullscreenButton as default };