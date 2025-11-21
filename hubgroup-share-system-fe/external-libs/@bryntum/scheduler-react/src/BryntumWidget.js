/**
 * React wrapper for Bryntum Widget
 */
import React, { Component } from 'react';
import WrapperHelper from './WrapperHelper.js';
import { Widget } from '@bryntum/scheduler/scheduler.umd';

export default class BryntumWidget extends Component {
    static instanceClass = Widget;

    configNames = [
        'adopt',
        'align',
        'anchor',
        'appendTo',
        'bubbleEvents',
        'centered',
        'cls',
        'config',
        'constrainTo',
        'contentElementCls',
        'defaultBindProperty',
        'dock',
        'draggable',
        'floating',
        'hideAnimation',
        'htmlCls',
        'insertBefore',
        'insertFirst',
        'listeners',
        'localeClass',
        'localizableProperties',
        'maskDefaults',
        'masked',
        'monitorResize',
        'owner',
        'positioned',
        'preventTooltipOnTouch',
        'ripple',
        'rootElement',
        'scrollAction',
        'showAnimation',
        'showTooltipWhenDisabled',
        'tab',
        'tag',
        'textAlign',
        'title',
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
