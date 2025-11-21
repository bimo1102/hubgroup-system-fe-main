/**
 * React wrapper for Bryntum Menu
 */
import React, { Component } from 'react';
import WrapperHelper from './WrapperHelper.js';
import { Menu } from '@bryntum/scheduler/scheduler.umd';

export default class BryntumMenu extends Component {
    static instanceClass = Menu;

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
        'focusOnHover',
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
        'onItem',
        'onPaint',
        'onReadOnly',
        'onResize',
        'onShow',
        'onToggle',
        'onToolClick',
        'readOnly',
        'scrollable',
        'tools',
        'tooltip',
        'width',
        'x',
        'y'
    ];

    propertyNames = [
        'anchorSize',
        'isSettingValues',
        'isValid',
        'parentMenu',
        'record',
        'selectedElement',
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
