/**
 * React wrapper for Bryntum TimePicker
 */
import React, { Component } from 'react';
import WrapperHelper from './WrapperHelper.js';
import { TimePicker } from '@bryntum/scheduler/scheduler.umd';

export default class BryntumTimePicker extends Component {
    static instanceClass = TimePicker;

    configNames = [
        'adopt',
        'align',
        'anchor',
        'appendTo',
        'autoClose',
        'autoShow',
        'bbar',
        'bodyCls',
        'bubbleEvents',
        'centered',
        'closable',
        'closeAction',
        'cls',
        'config',
        'constrainTo',
        'contentElementCls',
        'defaultBindProperty',
        'defaults',
        'dock',
        'draggable',
        'floating',
        'focusOnToFront',
        'footer',
        'forElement',
        'header',
        'hideAnimation',
        'hideWhenEmpty',
        'htmlCls',
        'insertBefore',
        'insertFirst',
        'itemCls',
        'lazyItems',
        'listeners',
        'localeClass',
        'localizableProperties',
        'maskDefaults',
        'masked',
        'maximizable',
        'modal',
        'monitorResize',
        'namedItems',
        'owner',
        'positioned',
        'preventTooltipOnTouch',
        'ripple',
        'rootElement',
        'scrollAction',
        'showAnimation',
        'showOnClick',
        'showTooltipWhenDisabled',
        'strips',
        'tab',
        'tag',
        'tbar',
        'textAlign',
        'textContent',
        'title',
        'trapFocus',
        'weight'
    ];

    propertyConfigNames = [
        'alignSelf',
        'content',
        'dataset',
        'disabled',
        'extraData',
        'flex',
        'format',
        'height',
        'hidden',
        'html',
        'id',
        'items',
        'layout',
        'layoutStyle',
        'margin',
        'maxHeight',
        'maximized',
        'maxWidth',
        'minHeight',
        'minWidth',
        'onBeforeClose',
        'onBeforeDestroy',
        'onBeforeHide',
        'onBeforeSetRecord',
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
        'onTimeChange',
        'onToolClick',
        'readOnly',
        'scrollable',
        'tools',
        'tooltip',
        'value',
        'width',
        'x',
        'y'
    ];

    propertyNames = [
        'anchorSize',
        'initialValue',
        'isSettingValues',
        'isValid',
        'max',
        'min',
        'record',
        'values'
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
