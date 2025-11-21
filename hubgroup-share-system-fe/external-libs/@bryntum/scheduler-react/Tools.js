/**
 * Header tools
 *
 * It is a simple container div that wraps the children
 * passed in props. There can only be one tools in the page due
 * to the id we set.
 */
import React from 'react';

var tools = function tools(props) {
  return /*#__PURE__*/React.createElement("div", {
    id: "tools"
  }, props.children ? props.children : '');
};

export default tools;