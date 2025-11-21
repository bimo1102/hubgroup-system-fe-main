import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

/**
 * Theme switcher combo
 */
import React, { useEffect, useRef } from 'react';
import { Combo, DomHelper, BrowserHelper } from '@bryntum/scheduler/scheduler.umd';

var BryntumThemeCombo = function BryntumThemeCombo(props) {
  var elRef = useRef(null);
  var combo = useRef(null);
  var container = props.container,
      store = props.store,
      label = props.label,
      width = props.width,
      position = props.position;
  useEffect(function () {
    var _config;

    var element = elRef.current || container;
    var config = (_config = {}, _defineProperty(_config, position, element), _defineProperty(_config, "store", store), _defineProperty(_config, "label", label), _defineProperty(_config, "width", width), _defineProperty(_config, "editable", false), _defineProperty(_config, "cls", 'b-bright'), _defineProperty(_config, "onChange", function onChange(_ref) {
      var value = _ref.value;
      DomHelper.setTheme(value).then(function (context) {
        if (context) {
          var theme = context.theme,
              prev = context.prev;
          DomHelper.removeClasses(document.body, ["b-theme-".concat(prev)]);
          DomHelper.addClasses(document.body, ["b-theme-".concat(theme)]);
        }
      });
    }), _config);

    if (combo.current) {
      Object.assign(combo.current, {
        store: store,
        label: label,
        width: width
      });
    } else {
      combo.current = new Combo(config);
    }

    combo.current.value = BrowserHelper.searchParam('theme', 'stockholm');
  }, [container, label, store, width, position]);
  return props.container ? null : /*#__PURE__*/React.createElement("div", {
    className: "b-theme-combo",
    ref: elRef
  });
};

BryntumThemeCombo.defaultProps = {
  store: [{
    id: 'stockholm',
    text: 'Stockholm'
  }, {
    id: 'classic',
    text: 'Classic'
  }, {
    id: 'classic-light',
    text: 'Classic Light'
  }, {
    id: 'classic-dark',
    text: 'Classic Dark'
  }, {
    id: 'material',
    text: 'Material'
  }],
  label: 'Select theme',
  width: '16em',
  position: 'insertFirst'
};
export default BryntumThemeCombo;