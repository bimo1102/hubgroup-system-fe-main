/**
 * React wrapper for Bryntum ResourceCombo
 */
import React, { Component } from 'react';
import WrapperHelper from './WrapperHelper.js';
import { ResourceCombo } from '@bryntum/scheduler/scheduler.umd';

export default class BryntumResourceCombo extends Component {
    static instanceClass = ResourceCombo;

    configNames = [
        'adopt',
        'align',
        'anchor',
        'appendTo',
        'autoClose',
        'autoComplete',
        'autoExpand',
        'autoSelect',
        'bubbleEvents',
        'caseSensitive',
        'centered',
        'chipView',
        'clearable',
        'clearTextOnPickerHide',
        'cls',
        'config',
        'constrainTo',
        'contentElementCls',
        'createOnUnmatched',
        'defaultBindProperty',
        'displayField',
        'displayValueRenderer',
        'dock',
        'draggable',
        'editable',
        'emptyText',
        'encodeFilterParams',
        'filterOnEnter',
        'filterParamName',
        'filterSelected',
        'floating',
        'hideAnimation',
        'hidePickerOnSelect',
        'hideTrigger',
        'highlightExternalChange',
        'hint',
        'hintHtml',
        'htmlCls',
        'inputAlign',
        'inputAttributes',
        'inputWidth',
        'insertBefore',
        'insertFirst',
        'items',
        'keyStrokeChangeDelay',
        'keyStrokeFilterDelay',
        'labelCls',
        'labelPosition',
        'labels',
        'labelWidth',
        'listCls',
        'listeners',
        'listItemTpl',
        'localeClass',
        'localizableProperties',
        'maskDefaults',
        'masked',
        'maxLength',
        'minChars',
        'minLength',
        'monitorResize',
        'multiSelect',
        'multiValueSeparator',
        'name',
        'overlayAnchor',
        'owner',
        'picker',
        'pickerAlignElement',
        'pickerWidth',
        'placeholder',
        'positioned',
        'preventTooltipOnTouch',
        'primaryFilter',
        'required',
        'revertOnEscape',
        'ripple',
        'rootElement',
        'scrollAction',
        'showAnimation',
        'showTooltipWhenDisabled',
        'tab',
        'tabIndex',
        'tag',
        'textAlign',
        'title',
        'triggerAction',
        'validateFilter',
        'valueField',
        'weight'
    ];

    propertyConfigNames = [
        'alignSelf',
        'badge',
        'content',
        'dataset',
        'disabled',
        'extraData',
        'filterOperator',
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
        'onAction',
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
        'onSelect',
        'onShow',
        'onTrigger',
        'readOnly',
        'scrollable',
        'store',
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
