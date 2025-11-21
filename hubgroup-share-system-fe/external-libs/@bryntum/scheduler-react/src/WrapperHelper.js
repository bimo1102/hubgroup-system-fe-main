/**
 * React widget helper
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {
    Fullscreen,
    ObjectHelper,
    StringHelper,
    VersionHelper,
    Widget,
    WidgetHelper,
    DomHelper
} from '@bryntum/scheduler/scheduler.umd';

export default function WrapperHelper() {
    /**
     * Development warning. Showed when environment is set to 'development'
     * @param {String} clsName vue component instance
     * @param {String} msg console message
     */
    function devWarning(clsName, msg) {
        if (VersionHelper.isTestEnv || process.env.NODE_ENV === 'development') {
            console.warn(
                `Bryntum${clsName}Component development warning!\n${msg}\n` +
                    'Please check integration guide: https://www.bryntum.com/docs/scheduler/#guides/integration/react.md'
            );
        }
    }

    function devWarningContainer(clsName, containerParam) {
        devWarning(
            clsName,
            `Using "${containerParam}" parameter for configuration is not recommended.\n` +
            'Widget is placed automatically inside it\'s container element.\n' +
            `Solution: remove "${containerParam}" parameter from configuration.`
        );
    }

    function devWarningConfigProp(clsName, prop) {
        devWarning(
            clsName,
            `Using "${prop}" parameter for configuration is not recommended.\n` +
                `Solution: Use separate parameter for each "${prop}" value to enable reactive updates of the API instance`
        );
    }

    function devWarningUpdateProp(clsName, prop) {
        devWarning(
            clsName,
            `"${prop}" is a static config option for component constructor only. No runtime changes are supported!`
        );
    }

    /**
     * Creates bryntum component config from react component
     * @param {Object} me react component instance
     * @return {Object} config object
     */
    function createConfig(me) {
        const { element, props } = me,
            { instanceClass, isView } = me.constructor,
            filter = (arr) => arr.filter((prop) => props[prop] !== undefined),
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
            };

        // If component has no container specified in config then use adopt to Wrapper's element
        const containerParam = ['adopt', 'appendTo', 'insertAfter', 'insertBefore'].find(
            (prop) => bryntumConfig[prop]
        );
        if (!containerParam) {
            bryntumConfig.adopt = element;
        }
        else {
            devWarningContainer(instanceClass.$name, containerParam);
        }

        // Assign configs. Skip properties
        configNames
            .concat(propertyConfigNames)
            .concat(featureNames)
            .forEach((prop) => {
                applyPropValue(bryntumConfig, prop, props[prop]);
                if (['features', 'config'].includes(prop)) {
                    devWarningConfigProp(instanceClass.$name, prop);
                }
            });

        // Prepare watch arrays
        me.configNames = configNames;
        me.propertyNames = configNames.concat(propertyNames).concat(propertyConfigNames).concat(featureNames);

        // Cleanup unused instance arrays
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
    function applyPropValue(configOrInstance, prop, value, isConfig = true) {
        if (prop === 'features' && typeof value === 'object') {
            Object.keys(value).forEach((key) =>
                applyPropValue(configOrInstance, `${key}Feature`, value[key], isConfig)
            );
        }
        else if (prop === 'config' && typeof value === 'object') {
            Object.keys(value).forEach((key) =>
                applyPropValue(configOrInstance, key, value[key], isConfig)
            );
        }
        else if (prop === 'columns' && !isConfig) {
            configOrInstance['columns'].data = value;
        }
        else if (prop.endsWith('Feature')) {
            const features    = configOrInstance['features'],
                  featureName = prop.replace('Feature', '');
            if (isConfig) {
                features[featureName] = value;
            }
            else {
                const feature = features[featureName];
                if (feature) {
                    feature.setConfig(value);
                }
            }
        }
        else {
            configOrInstance[prop] = value;
        }
    }

    /**
     * Creates bryntum Widget from react component
     * @param {Object} me react component instance
     * @return {Object} widget object
     */
    function createWidget(me) {
        const { instanceClass, isView } = me.constructor,
              config                    = createConfig(me),
              instance                  =
                  instanceClass.$name === 'Widget'
                      ? WidgetHelper.createWidget(config)
                      : new instanceClass(config);

        // Backwards compatibility for gridInstance, schedulerInstance etc.
        if (isView) {
            me[StringHelper.uncapitalize(instanceClass.$name) + 'Instance'] = instance;
        }

        if (isView) {
            // Backwards compatibility for gridInstance, schedulerInstance etc.
            me[StringHelper.uncapitalize(instanceClass.$name) + 'Instance'] = instance;

            // Process stores (handle syncDataOnLoad and listeners needed by React renderers)
            if (me.dataStores) {
                Object.keys(me.dataStores).forEach((storeName) => {
                    const store = instance[storeName];
                    if (store) {
                        // Set `syncDataOnLoad` to `true` by default
                        // TODO: remove when https://github.com/bryntum/support/issues/2764 is done
                        store.syncDataOnLoad = store.syncDataOnLoad ?? true;

                        store.on('beforeRemove', (context) => beforeRemoveRecords(me, context));
                    }
                });
            }
        }

        // To be able to detect data changes later
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
        const button = Fullscreen.enabled
            ? WidgetHelper.createWidget({
                type       : 'button',
                appendTo   : element,
                icon       : 'b-icon b-icon-fullscreen',
                tooltip    : 'Fullscreen',
                cls        : 'b-raised b-blue',
                toggleable : true,
                onToggle   : async({ pressed }) => {
                    if (pressed) {
                        await Fullscreen.request(document.documentElement);
                    }
                    else {
                        await Fullscreen.exit();
                      }
                  }
              })
            : null;

        if (button) {
            Fullscreen.onFullscreenChange(() => {
                button.pressed = Fullscreen.isFullscreen;
            });
        }
        return button;
    }

    /**
     * Hook called by engine when requesting a cell editor
     */
    function processCellEditor({ editor, field }) {
        const me = this.reactComponent;

        // String etc handled by feature, only care about fns returning React components here
        if (!me || typeof editor !== 'function') {
            return;
        }

        // Wrap React editor in an empty widget, to match expectations from CellEdit/Editor and make alignment
        // etc. work out of the box
        const wrapperWidget = new Widget({
            name : field // For editor to be hooked up to field correctly
        });

        // Ref for accessing the React editor later
        wrapperWidget.reactRef = React.createRef();

        // column.editor is expected to be a function returning a React component (can be JSX). Function is
        // called with the ref from above, it has to be used as the ref for the editor to wire things up
        const reactComponent = editor(wrapperWidget.reactRef);
        if (reactComponent.$$typeof !== Symbol.for('react.element')) {
            throw new Error('Expect a React element');
        }

        let editorValidityChecked = false;

        // Add getter/setter for value on the wrapper, relaying to getValue()/setValue() on the React editor
        Object.defineProperty(wrapperWidget, 'value', {
            enumerable : true,
            get() {
                return wrapperWidget.reactRef.current.getValue();
            },
            set(value) {
                const component = wrapperWidget.reactRef.current;

                if (!editorValidityChecked) {
                    const cellMethods = ['setValue', 'getValue', 'isValid', 'focus'],
                    misses      = cellMethods.filter((fn) => !(fn in component));
                    if (misses.length > 0) {
                        throw new Error(
                            `Missing method(s) ${misses.join(', ')} in ${
                                component.constructor.name
                            }. Cell editors must ${cellMethods.join(', ')}`
                        );
                    }
                    editorValidityChecked = true;
                }

                const context = wrapperWidget.owner.cellEditorContext;
                component.setValue(value, context);
            }
        });

        // Add getter for isValid to the wrapper, mapping to isValid() on the React editor
        Object.defineProperty(wrapperWidget, 'isValid', {
            enumerable : true,
            get() {
                return wrapperWidget.reactRef.current.isValid();
            }
        });

        // Override widgets focus handling, relaying it to focus() on the React editor
        wrapperWidget.focus = () => {
            const { current } = wrapperWidget.reactRef;
            current.focus && current.focus();
        };

        // Create a portal, making the React editor belong to the React tree although displayed in a Widget
        const portal = ReactDOM.createPortal(reactComponent, wrapperWidget.element);
        wrapperWidget.reactPortal = portal;

        const { state } = me;
        // Store portal in state to let React keep track of it (inserted into the Bryntum component)
        state.portals.set(`portal-${field}`, portal);
        me.setState({
            portals    : state.portals,
            generation : state.generation++
        });

        return { editor: wrapperWidget };
    }

    /**
     * Calculates the portalId from passed ids
     * @param {String|Number} id
     * @param {String|Number} columnId
     * @returns {String} portalId as `portal-${id}-${columnId}`
     */
    function getPortalId(id, columnId) {
        return `portal-${id}-${columnId}`;
    }

    /**
     * Delete portal and its container
     * @param {Component} me React Component, the wrapper itself
     * @param {String} portalId As returned from getPortalId function
     */
    function deletePortal(me, portalId) {
        const portal = me.state.portals.get(portalId);
        if (portal) {
            const portalContainer = portal.containerInfo;

            // remove portal from Map
            me.state.portals.delete(portalId);

            // cleanup portal container
            portalContainer.parentElement?.removeChild(portalContainer);
        }
    }

    /**
     * Release (currently only delete) React portal hosted in this cell
     * @param {Component} me React Component, the wrapper itself
     * @param {DOMElement} cellElement The grid cell to be freed of the React portal
     */
    function releaseReactCell(me, cellElement) {
        const { id, columnId, hasPortal } = cellElement._domData;

        if (hasPortal) {
            const portalId = getPortalId(id, columnId);
            deletePortal(me, portalId);
        }
    }

    /**
     * Calls releaseReactCell that implements the cleanup
     * @param {Component} me React Component, the wrapper itself
     * @param {Object} context
     * @param {Model[]} context.records Array of records that are going to be removed
     */
    function beforeRemoveRecords(me, { records, removingAll }) {
        const { instance: grid } = me;

        if (removingAll) {
            [...me.state.portals.keys()].forEach(portalId => deletePortal(me, portalId));
        }
        else {
            records.forEach((record) => {
                // grid.getRowById is not defined in Calendar
                const row = grid.getRowById ? grid.getRowById(record.id) : undefined;
                if (row) {
                    row.cells.forEach((cell) => {
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
        requestAnimationFrame(() => {
            me.setState((currentState) => {
                return { generation: currentState.generation++ };
            });
        });
    };

    /**
     * Hook called by instance when rendering cells within
     * Row::renderCell(), creates portals for JSX supplied by renderers
     * @param {Object} context
     * @param {Object} context.rendererData Data passed from renderCell
     * @param {Object} context.cellElementData Data passed from renderCell
     */
    function processCellContent({ rendererData, cellElementData, rendererHtml: reactNode }) {
        // Collect variables
        const me = this.reactComponent;
        const { state, portalsCache, portalContainerClass } = me;
        const { cellElement, column, record } = rendererData;
        const portalId = getPortalId(record.id, column.id);
        const renderElement = cellElement.querySelector(column.editTargetSelector) || cellElement;

        // Do nothing if we have no place to render to
        if (!renderElement) {
            return;
        }
        if (reactNode && reactNode.$$typeof === Symbol.for('react.element') && !record.meta.specialRow) {
            // Move React portal container out of the way if necessary
            if (renderElement.portalContainer && renderElement.portalContainer.dataset.portalId === portalId) {
                portalsCache.appendChild(renderElement.portalContainer);
                renderElement.portalContainer = null;
            }

            // Try to get portal from the portals Map
            let portal = state.portals.get(portalId);

            // Handle measuring
            if (rendererData.isMeasuring) {
                if (portal) {
                    // Remember the original parent of portal and the cell element width
                    const portalContainer = portal.containerInfo;
                    const parent = portalContainer.parentNode;
                    cellElement.style.width = 'auto'; // element is re-used, need to reset width
                    const cellElementWidth = cellElement.offsetWidth;

                    // Append portal to the provided cell and get width
                    cellElement.appendChild(portalContainer);
                    const width = portalContainer.offsetWidth;

                    // Move the portal back to its original container
                    parent.appendChild(portalContainer);

                    // Set width of the cell. It will be processed by Column code.
                    cellElement.style.width = `${(width + cellElementWidth)}px`
                }
                return;
            }

            // Check if record changed, delete portal and its container if yes
            if (portal && portal.generation !== record.generation) {
                deletePortal(me, portalId);
                portal = null;
            }

            // Cleanup renderElement - necessary for grouping feature
            const childPortalContainer = renderElement.querySelector(`.${portalContainerClass}`);
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
            }
            else {
                // Create new portal container
                const portalContainer = DomHelper.append(renderElement, {
                    tag: 'div',
                    className: portalContainerClass,
                    dataset: { portalId } // for reference in tests
                });
                renderElement.portalContainer = portalContainer;

                // Create a new portal in the portal container
                portal = ReactDOM.createPortal(reactNode, portalContainer, portalId);

                // Add the new portal to Map
                state.portals.set(portalId, portal);

                // Trigger React redraw
                updateGeneration(me);
            }

            // Save data for use elsewhere
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
    function hasFrameworkRenderer({ cellContent, column }) {
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
        const { props, instance, propertyNames, configNames, dataStores } = me;
        const { instanceClass } = me.constructor;
        const dataNames = Object.values(dataStores ?? {});

        propertyNames.filter(prop => !dataNames.includes(prop)).forEach((prop) => {
            // `isEqual` compares content but we need to compare instances of functions
                if (typeof props[prop] === 'function' && props[prop] !== nextProps[prop]) {
                    instance[prop] = nextProps[prop];
                }
                else if (!ObjectHelper.isEqual(props[prop], nextProps[prop])) {
                    applyPropValue(instance, prop, nextProps[prop], false);
                    // Check if property is a config and notify
                    if (configNames.includes(prop)) {
                        devWarningUpdateProp(instanceClass.$name, prop);
                    }
                }
            }
        );

        if (dataStores) {
            // Process stores data
            Object.keys(dataStores).forEach((storeName) => {
                const dataName = dataStores[storeName];
                if (props[dataName] && !ObjectHelper.isDeeplyEqual(props[dataName],nextProps[dataName]) ) {
                    instance[dataName] = nextProps[dataName];
                }
            });
        }

        // Reflect JSX cell changes
        return nextState?.generation !== me.state?.generation;
    }

    return {
        createFullscreenButton,
        createWidget,
        shouldComponentUpdate
    };
}
