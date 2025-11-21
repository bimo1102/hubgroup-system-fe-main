/**
 * React wrapper for Bryntum List
 */
import React, { Component } from 'react';
import WrapperHelper from './WrapperHelper.js';
import { List } from '@bryntum/scheduler/scheduler.umd';

export default class BryntumList extends Component {
    static instanceClass = List;

    configNames = [
        'activateOnMouseover',
        'adopt',
        'align',
        'allowGroupSelect',
        'anchor',
        'appendTo',
        'bubbleEvents',
        'centered',
        'cls',
        'config',
        'constrainTo',
        'contentElementCls',
        'defaultBindProperty',
        'displayField',
        'dock',
        'draggable',
        'floating',
        'groupHeaderTpl',
        'hideAnimation',
        'htmlCls',
        'insertBefore',
        'insertFirst',
        'itemTpl',
        'listeners',
        'localeClass',
        'localizableProperties',
        'maskDefaults',
        'masked',
        'monitorResize',
        'multiSelect',
        'owner',
        'positioned',
        'preventTooltipOnTouch',
        'ripple',
        'rootElement',
        'scrollAction',
        'selectAllItem',
        'selected',
        'showAnimation',
        'showTooltipWhenDisabled',
        'store',
        'tab',
        'tag',
        'textAlign',
        'title',
        'toggleAllIfCtrlPressed',
        'weight'
    ];

    propertyConfigNames = [
        'alignSelf',
        'content',
        'dataset',
        'disabled',
        'extraData',
        'flex',
        'height',
        'hidden',
        'html',
        'id',
        'items',
        'margin',
        'maxHeight',
        'maxWidth',
        'minHeight',
        'minWidth',
        'onBeforeDestroy',
        'onBeforeHide',
        'onBeforeShow',
        'onCatchAll',
        'onDestroy',
        'onFocusIn',
        'onFocusOut',
        'onHide',
        'onItem',
        'onPaint',
        'onReadOnly',
        'onResize',
        'onShow',
        'readOnly',
        'scrollable',
        'tooltip',
        'width',
        'x',
        'y'
    ];

    propertyNames = [
        'anchorSize'
    ];

    // Component instance
    instance = undefined;

    // Component element
    element = undefined;

    /**
     * Invoked immediately after a component is mounted (inserted into the tree)
     */
    componentDidMount() {
        const { createWidget } = WrapperHelper();
        this.instance = createWidget(this);
    }

    // React component removed, destroy instance
    componentWillUnmount() {
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
    shouldComponentUpdate(nextProps, nextState) {
        const { shouldComponentUpdate } = WrapperHelper();
        return shouldComponentUpdate(this, nextProps, nextState);
    }

    render() {
        const className = `b-react-${this.constructor.instanceClass.$name.toLowerCase()}-container`;
        return (
            <div className={className} ref={(element) => (this.element = element)}></div>
        );
    } 
}
