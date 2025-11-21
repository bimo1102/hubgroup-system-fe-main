import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";

/**
 * React widget helper
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Fullscreen, ObjectHelper, StringHelper, VersionHelper, Widget, WidgetHelper, DomHelper } from '@bryntum/scheduler/scheduler.umd';
export default function WrapperHelper() {
  /**
   * Development warning. Showed when environment is set to 'development'
   * @param {String} clsName vue component instance
   * @param {String} msg console message
   */
  function devWarning(clsName, msg) {
    if (VersionHelper.isTestEnv || process.env.NODE_ENV === 'development') {
      console.warn("Bryntum".concat(clsName, "Component development warning!\n").concat(msg, "\n") + 'Please check integration guide: https://www.bryntum.com/docs/scheduler/#guides/integration/react.md');
    }
  }

  function devWarningContainer(clsName, containerParam) {
    devWarning(clsName, "Using \"".concat(containerParam, "\" parameter for configuration is not recommended.\n") + 'Widget is placed automatically inside it\'s container element.\n' + "Solution: remove \"".concat(containerParam, "\" parameter from configuration."));
  }

  function devWarningConfigProp(clsName, prop) {
    devWarning(clsName, "Using \"".concat(prop, "\" parameter for configuration is not recommended.\n") + "Solution: Use separate parameter for each \"".concat(prop, "\" value to enable reactive updates of the API instance"));
  }

  function devWarningUpdateProp(clsName, prop) {
    devWarning(clsName, "\"".concat(prop, "\" is a static config option for component constructor only. No runtime changes are supported!"));
  }
  /**
   * Creates bryntum component config from react component
   * @param {Object} me react component instance
   * @return {Object} config object
   */


  function createConfig(me) {
    var element = me.element,
        props = me.props,
        _me$constructor = me.constructor,
        instanceClass = _me$constructor.instanceClass,
        isView = _me$constructor.isView,
        filter = function filter(arr) {
      return arr.filter(function (prop) {
        return props[prop] !== undefined;
      });
    },
        configNames = filter(me.configNames || []),
        propertyConfigNames = filter(me.propertyConfigNames || []),
        propertyNames = filter(me.propertyNames || []),
        featureNames = filter(me.featureNames || []),
        bryntumConfig = {
      reactComponent: me,
      listeners: {},
      features: {},
      hasFrameworkRenderer: isView ? hasFrameworkRenderer : undefined,
      processCellContent: isView ? processCellContent : undefined,
      processCellEditor: isView ? processCellEditor : undefined
    }; // If component has no container specified in config then use adopt to Wrapper's element


    var containerParam = ['adopt', 'appendTo', 'insertAfter', 'insertBefore'].find(function (prop) {
      return bryntumConfig[prop];
    });

    if (!containerParam) {
      bryntumConfig.adopt = element;
    } else {
      devWarningContainer(instanceClass.$name, containerParam);
    } // Assign configs. Skip properties


    configNames.concat(propertyConfigNames).concat(featureNames).forEach(function (prop) {
      applyPropValue(bryntumConfig, prop, props[prop]);

      if (['features', 'config'].includes(prop)) {
        devWarningConfigProp(instanceClass.$name, prop);
      }
    }); // Prepare watch arrays

    me.configNames = configNames;
    me.propertyNames = configNames.concat(propertyNames).concat(propertyConfigNames).concat(featureNames); // Cleanup unused instance arrays

    me.propertyConfigNames && delete me.propertyConfigNames;
    me.featureNames && delete me.featureNames;
    return bryntumConfig;
  }
  /**
   * Applies property value to Bryntum config or instance.
   * @param {Object} configOrInstance target object
   * @param {String} prop property name
   * @param {Object} value value
   * @param {Boolean} isConfig config setting mode
   */


  function applyPropValue(configOrInstance, prop, value) {
    var isConfig = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

    if (prop === 'features' && typeof value === 'object') {
      Object.keys(value).forEach(function (key) {
        return applyPropValue(configOrInstance, "".concat(key, "Feature"), value[key], isConfig);
      });
    } else if (prop === 'config' && typeof value === 'object') {
      Object.keys(value).forEach(function (key) {
        return applyPropValue(configOrInstance, key, value[key], isConfig);
      });
    } else if (prop === 'columns' && !isConfig) {
      configOrInstance['columns'].data = value;
    } else if (prop.endsWith('Feature')) {
      var features = configOrInstance['features'],
          featureName = prop.replace('Feature', '');

      if (isConfig) {
        features[featureName] = value;
      } else {
        var feature = features[featureName];

        if (feature) {
          feature.setConfig(value);
        }
      }
    } else {
      configOrInstance[prop] = value;
    }
  }
  /**
   * Creates bryntum Widget from react component
   * @param {Object} me react component instance
   * @return {Object} widget object
   */


  function createWidget(me) {
    var _me$constructor2 = me.constructor,
        instanceClass = _me$constructor2.instanceClass,
        isView = _me$constructor2.isView,
        config = createConfig(me),
        instance = instanceClass.$name === 'Widget' ? WidgetHelper.createWidget(config) : new instanceClass(config); // Backwards compatibility for gridInstance, schedulerInstance etc.

    if (isView) {
      me[StringHelper.uncapitalize(instanceClass.$name) + 'Instance'] = instance;
    }

    if (isView) {
      // Backwards compatibility for gridInstance, schedulerInstance etc.
      me[StringHelper.uncapitalize(instanceClass.$name) + 'Instance'] = instance; // Process stores (handle syncDataOnLoad and listeners needed by React renderers)

      if (me.dataStores) {
        Object.keys(me.dataStores).forEach(function (storeName) {
          var store = instance[storeName];

          if (store) {
            var _store$syncDataOnLoad;

            // Set `syncDataOnLoad` to `true` by default
            // TODO: remove when https://github.com/bryntum/support/issues/2764 is done
            store.syncDataOnLoad = (_store$syncDataOnLoad = store.syncDataOnLoad) !== null && _store$syncDataOnLoad !== void 0 ? _store$syncDataOnLoad : true;
            store.on('beforeRemove', function (context) {
              return beforeRemoveRecords(me, context);
            });
          }
        });
      }
    } // To be able to detect data changes later


    if (config.data) {
      instance.lastDataset = config.data.slice();
    }

    return instance;
  }
  /**
   * Creates Fullscreen button
   * @param element append to this element
   * @return {Object} button
   */


  function createFullscreenButton(element) {
    var button = Fullscreen.enabled ? WidgetHelper.createWidget({
      type: 'button',
      appendTo: element,
      icon: 'b-icon b-icon-fullscreen',
      tooltip: 'Fullscreen',
      cls: 'b-raised b-blue',
      toggleable: true,
      onToggle: function () {
        var _onToggle = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(_ref) {
          var pressed;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  pressed = _ref.pressed;

                  if (!pressed) {
                    _context.next = 6;
                    break;
                  }

                  _context.next = 4;
                  return Fullscreen.request(document.documentElement);

                case 4:
                  _context.next = 8;
                  break;

                case 6:
                  _context.next = 8;
                  return Fullscreen.exit();

                case 8:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        function onToggle(_x) {
          return _onToggle.apply(this, arguments);
        }

        return onToggle;
      }()
    }) : null;

    if (button) {
      Fullscreen.onFullscreenChange(function () {
        button.pressed = Fullscreen.isFullscreen;
      });
    }

    return button;
  }
  /**
   * Hook called by engine when requesting a cell editor
   */


  function processCellEditor(_ref2) {
    var editor = _ref2.editor,
        field = _ref2.field;
    var me = this.reactComponent; // String etc handled by feature, only care about fns returning React components here

    if (!me || typeof editor !== 'function') {
      return;
    } // Wrap React editor in an empty widget, to match expectations from CellEdit/Editor and make alignment
    // etc. work out of the box


    var wrapperWidget = new Widget({
      name: field // For editor to be hooked up to field correctly

    }); // Ref for accessing the React editor later

    wrapperWidget.reactRef = React.createRef(); // column.editor is expected to be a function returning a React component (can be JSX). Function is
    // called with the ref from above, it has to be used as the ref for the editor to wire things up

    var reactComponent = editor(wrapperWidget.reactRef);

    if (reactComponent.$$typeof !== Symbol.for('react.element')) {
      throw new Error('Expect a React element');
    }

    var editorValidityChecked = false; // Add getter/setter for value on the wrapper, relaying to getValue()/setValue() on the React editor

    Object.defineProperty(wrapperWidget, 'value', {
      enumerable: true,
      get: function get() {
        return wrapperWidget.reactRef.current.getValue();
      },
      set: function set(value) {
        var component = wrapperWidget.reactRef.current;

        if (!editorValidityChecked) {
          var cellMethods = ['setValue', 'getValue', 'isValid', 'focus'],
              misses = cellMethods.filter(function (fn) {
            return !(fn in component);
          });

          if (misses.length > 0) {
            throw new Error("Missing method(s) ".concat(misses.join(', '), " in ").concat(component.constructor.name, ". Cell editors must ").concat(cellMethods.join(', ')));
          }

          editorValidityChecked = true;
        }

        var context = wrapperWidget.owner.cellEditorContext;
        component.setValue(value, context);
      }
    }); // Add getter for isValid to the wrapper, mapping to isValid() on the React editor

    Object.defineProperty(wrapperWidget, 'isValid', {
      enumerable: true,
      get: function get() {
        return wrapperWidget.reactRef.current.isValid();
      }
    }); // Override widgets focus handling, relaying it to focus() on the React editor

    wrapperWidget.focus = function () {
      var current = wrapperWidget.reactRef.current;
      current.focus && current.focus();
    }; // Create a portal, making the React editor belong to the React tree although displayed in a Widget


    var portal = ReactDOM.createPortal(reactComponent, wrapperWidget.element);
    wrapperWidget.reactPortal = portal;
    var state = me.state; // Store portal in state to let React keep track of it (inserted into the Bryntum component)

    state.portals.set("portal-".concat(field), portal);
    me.setState({
      portals: state.portals,
      generation: state.generation++
    });
    return {
      editor: wrapperWidget
    };
  }
  /**
   * Calculates the portalId from passed ids
   * @param {String|Number} id
   * @param {String|Number} columnId
   * @returns {String} portalId as `portal-${id}-${columnId}`
   */


  function getPortalId(id, columnId) {
    return "portal-".concat(id, "-").concat(columnId);
  }
  /**
   * Delete portal and its container
   * @param {Component} me React Component, the wrapper itself
   * @param {String} portalId As returned from getPortalId function
   */


  function deletePortal(me, portalId) {
    var portal = me.state.portals.get(portalId);

    if (portal) {
      var _portalContainer$pare;

      var portalContainer = portal.containerInfo; // remove portal from Map

      me.state.portals.delete(portalId); // cleanup portal container

      (_portalContainer$pare = portalContainer.parentElement) === null || _portalContainer$pare === void 0 ? void 0 : _portalContainer$pare.removeChild(portalContainer);
    }
  }
  /**
   * Release (currently only delete) React portal hosted in this cell
   * @param {Component} me React Component, the wrapper itself
   * @param {DOMElement} cellElement The grid cell to be freed of the React portal
   */


  function releaseReactCell(me, cellElement) {
    var _cellElement$_domData = cellElement._domData,
        id = _cellElement$_domData.id,
        columnId = _cellElement$_domData.columnId,
        hasPortal = _cellElement$_domData.hasPortal;

    if (hasPortal) {
      var portalId = getPortalId(id, columnId);
      deletePortal(me, portalId);
    }
  }
  /**
   * Calls releaseReactCell that implements the cleanup
   * @param {Component} me React Component, the wrapper itself
   * @param {Object} context
   * @param {Model[]} context.records Array of records that are going to be removed
   */


  function beforeRemoveRecords(me, _ref3) {
    var records = _ref3.records,
        removingAll = _ref3.removingAll;
    var grid = me.instance;

    if (removingAll) {
      _toConsumableArray(me.state.portals.keys()).forEach(function (portalId) {
        return deletePortal(me, portalId);
      });
    } else {
      records.forEach(function (record) {
        // grid.getRowById is not defined in Calendar
        var row = grid.getRowById ? grid.getRowById(record.id) : undefined;

        if (row) {
          row.cells.forEach(function (cell) {
            releaseReactCell(me, cell);
          });
        }
      });
    }
  }
  /**
   * Increments generation - necessary to trigger React updates
   * @param {Component} me React Component, the wrapper itself
   */


  function updateGeneration(me) {
    // React update on next frame
    requestAnimationFrame(function () {
      me.setState(function (currentState) {
        return {
          generation: currentState.generation++
        };
      });
    });
  }

  ;
  /**
   * Hook called by instance when rendering cells within
   * Row::renderCell(), creates portals for JSX supplied by renderers
   * @param {Object} context
   * @param {Object} context.rendererData Data passed from renderCell
   * @param {Object} context.cellElementData Data passed from renderCell
   */

  function processCellContent(_ref4) {
    var rendererData = _ref4.rendererData,
        cellElementData = _ref4.cellElementData,
        reactNode = _ref4.rendererHtml;
    // Collect variables
    var me = this.reactComponent;
    var state = me.state,
        portalsCache = me.portalsCache,
        portalContainerClass = me.portalContainerClass;
    var cellElement = rendererData.cellElement,
        column = rendererData.column,
        record = rendererData.record;
    var portalId = getPortalId(record.id, column.id);
    var renderElement = cellElement.querySelector(column.editTargetSelector) || cellElement; // Do nothing if we have no place to render to

    if (!renderElement) {
      return;
    }

    if (reactNode && reactNode.$$typeof === Symbol.for('react.element') && !record.meta.specialRow) {
      // Move React portal container out of the way if necessary
      if (renderElement.portalContainer && renderElement.portalContainer.dataset.portalId === portalId) {
        portalsCache.appendChild(renderElement.portalContainer);
        renderElement.portalContainer = null;
      } // Try to get portal from the portals Map


      var portal = state.portals.get(portalId); // Handle measuring

      if (rendererData.isMeasuring) {
        if (portal) {
          // Remember the original parent of portal and the cell element width
          var portalContainer = portal.containerInfo;
          var parent = portalContainer.parentNode;
          cellElement.style.width = 'auto'; // element is re-used, need to reset width

          var cellElementWidth = cellElement.offsetWidth; // Append portal to the provided cell and get width

          cellElement.appendChild(portalContainer);
          var width = portalContainer.offsetWidth; // Move the portal back to its original container

          parent.appendChild(portalContainer); // Set width of the cell. It will be processed by Column code.

          cellElement.style.width = "".concat(width + cellElementWidth, "px");
        }

        return;
      } // Check if record changed, delete portal and its container if yes


      if (portal && portal.generation !== record.generation) {
        deletePortal(me, portalId);
        portal = null;
      } // Cleanup renderElement - necessary for grouping feature


      var childPortalContainer = renderElement.querySelector(".".concat(portalContainerClass));

      if (childPortalContainer && childPortalContainer.dataset.portalId !== portalId) {
        portalsCache.appendChild(childPortalContainer);
      }

      if (renderElement.textContent && renderElement === cellElement) {
        renderElement.textContent = ''; // group title can be still here
      }

      if (portal) {
        // Move portal container back to the cell if we have one
        renderElement.appendChild(portal.containerInfo);
        renderElement.portalContainer = portal.containerInfo;
      } else {
        // Create new portal container
        var _portalContainer = DomHelper.append(renderElement, {
          tag: 'div',
          className: portalContainerClass,
          dataset: {
            portalId: portalId
          } // for reference in tests

        });

        renderElement.portalContainer = _portalContainer; // Create a new portal in the portal container

        portal = ReactDOM.createPortal(reactNode, _portalContainer, portalId); // Add the new portal to Map

        state.portals.set(portalId, portal); // Trigger React redraw

        updateGeneration(me);
      } // Save data for use elsewhere


      cellElementData.hasPortal = true;
      portal.generation = record.generation;
    }
  }
  /**
   * Checks if the object is a React element.
   * All React elements require an additional $$typeof: Symbol.for('react.element') field declared on the object for security reasons.
   * The object which React.createElement() return has $$typeof property equals to Symbol.for('react.element')
   *
   * Sources:
   * https://reactjs.org/blog/2015/12/18/react-components-elements-and-instances.html
   * https://github.com/facebook/react/pull/4832
   *
   * @param {Object} obj
   * @return {Boolean}
   * @internal
   */


  function isReactElement(obj) {
    return obj && obj.$$typeof === Symbol.for('react.element');
  }
  /**
   *
   * @param { Object } context
   * @param { * } context.cellContent Content to be rendered in cell (set by renderer)
   * @param { Column } context.column Column being rendered
   * @returns { Boolean } `true` if there is a React Renderer in this cell, `false` otherwise
   */


  function hasFrameworkRenderer(_ref5) {
    var cellContent = _ref5.cellContent,
        column = _ref5.column;
    return isReactElement(cellContent);
  }
  /**
   * Component about to be updated, from changing a prop using state.
   * React to it depending on what changed and prevent react from re-rendering our component.
   * @param {Object} me react component instance
   * @param nextProps
   * @param nextState
   * @return {boolean}
   */


  function shouldComponentUpdate(me, nextProps, nextState) {
    var _me$state;

    var props = me.props,
        instance = me.instance,
        propertyNames = me.propertyNames,
        configNames = me.configNames,
        dataStores = me.dataStores;
    var instanceClass = me.constructor.instanceClass;
    var dataNames = Object.values(dataStores !== null && dataStores !== void 0 ? dataStores : {});
    propertyNames.filter(function (prop) {
      return !dataNames.includes(prop);
    }).forEach(function (prop) {
      // `isEqual` compares content but we need to compare instances of functions
      if (typeof props[prop] === 'function' && props[prop] !== nextProps[prop]) {
        instance[prop] = nextProps[prop];
      } else if (!ObjectHelper.isEqual(props[prop], nextProps[prop])) {
        applyPropValue(instance, prop, nextProps[prop], false); // Check if property is a config and notify

        if (configNames.includes(prop)) {
          devWarningUpdateProp(instanceClass.$name, prop);
        }
      }
    });

    if (dataStores) {
      // Process stores data
      Object.keys(dataStores).forEach(function (storeName) {
        var dataName = dataStores[storeName];

        if (props[dataName] && !ObjectHelper.isDeeplyEqual(props[dataName], nextProps[dataName])) {
          instance[dataName] = nextProps[dataName];
        }
      });
    } // Reflect JSX cell changes


    return (nextState === null || nextState === void 0 ? void 0 : nextState.generation) !== ((_me$state = me.state) === null || _me$state === void 0 ? void 0 : _me$state.generation);
  }

  return {
    createFullscreenButton: createFullscreenButton,
    createWidget: createWidget,
    shouldComponentUpdate: shouldComponentUpdate
  };
}