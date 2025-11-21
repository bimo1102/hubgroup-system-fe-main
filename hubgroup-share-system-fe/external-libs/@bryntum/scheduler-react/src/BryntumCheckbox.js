/**
 * React wrapper for Bryntum Checkbox
 */
import React, { Component } from 'react';
import WrapperHelper from './WrapperHelper.js';
import { Checkbox } from '@bryntum/scheduler/scheduler.umd';

export default class BryntumCheckbox extends Component {
    static instanceClass = Checkbox;

    configNames = [
        'adopt',
        'align',
        'anchor',
        'appendTo',
        'autoComplete',
        'autoSelect',
        'bubbleEvents',
        'centered',
        'clearable',
        'cls',
        'color',
        'config',
        'constrainTo',
        'contentElementCls',
        'defaultBindProperty',
        'dock',
        'draggable',
        'editable',
        'floating',
        'hideAnimation',
        'highlightExternalChange',
        'hint',
        'hintHtml',
        'htmlCls',
        'inputAlign',
        'inputAttributes',
        'inputWidth',
        'insertBefore',
        'insertFirst',
        'keyStrokeChangeDelay',
        'labelCls',
        'labelPosition',
        'labels',
        'labelWidth',
        'listeners',
        'localeClass',
        'localizableProperties',
        'maskDefaults',
        'masked',
        'monitorResize',
        'owner',
        'placeholder',
        'positioned',
        'preventTooltipOnTouch',
        'required',
        'revertOnEscape',
        'ripple',
        'rootElement',
        'scrollAction',
        'showAnimation',
        'showTooltipWhenDisabled',
        'tab',
        'tag',
        'text',
        'textAlign',
        'title',
        'weight'
    ];

    propertyConfigNames = [
        'alignSelf',
        'badge',
        'checked',
        'content',
        'dataset',
        'disabled',
        'extraData',
        'flex',
        'height',
        'hidden',
        'html',
        'id',
        'label',
        'margin',
        'maxHeight',
        'maxWidth',
        'minHeight',
        'minWidth',
        'name',
        'onAction',
        'onBeforeChange',
        'onBeforeDestroy',
        'onBeforeHide',
        'onBeforeShow',
        'onCatchAll',
        'onChange',
        'onClear',
        'onDestroy',
        'onFocusIn',
        'onFocusOut',
        'onHide',
        'onInput',
        'onPaint',
        'onReadOnly',
        'onResize',
        'onShow',
        'onTrigger',
        'readOnly',
        'scrollable',
        'tooltip',
        'triggers',
        'value',
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
