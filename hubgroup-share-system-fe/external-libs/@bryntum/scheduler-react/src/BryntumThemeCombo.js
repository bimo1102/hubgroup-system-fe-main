/**
 * Theme switcher combo
 */
import React, { useEffect, useRef } from 'react';
import { Combo, DomHelper, BrowserHelper } from '@bryntum/scheduler/scheduler.umd';
import { PropTypes } from 'prop-types';

const BryntumThemeCombo = (props) => {
    const elRef = useRef(null);
    const combo = useRef(null);
    const { container, store, label, width, position } = props;

    useEffect(() => {
        const element = elRef.current || container;
        const config = {
            [position]: element,
            store,
            label,
            width,
            editable: false,
            cls: 'b-bright',
            onChange({ value }) {
                DomHelper.setTheme(value).then((context) => {
                    if (context) {
                        const { theme, prev } = context;
                        DomHelper.removeClasses(document.body, [`b-theme-${prev}`]);
                        DomHelper.addClasses(document.body, [`b-theme-${theme}`]);
                    }
                });
            }
        };
        if (combo.current) {
            Object.assign(combo.current, { store, label, width });
        } else {
            combo.current = new Combo(config);
        }
        combo.current.value = BrowserHelper.searchParam('theme', 'stockholm');
    }, [container, label, store, width, position]);

    return props.container ? null : <div className="b-theme-combo" ref={elRef}></div>;
};

BryntumThemeCombo.propTypes = {
    container: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Element)]),
    store: PropTypes.array,
    label: PropTypes.string,
    width: PropTypes.string,
    position: PropTypes.string
};

BryntumThemeCombo.defaultProps = {
    store: [
        { id: 'stockholm', text: 'Stockholm' },
        { id: 'classic', text: 'Classic' },
        { id: 'classic-light', text: 'Classic Light' },
        { id: 'classic-dark', text: 'Classic Dark' },
        { id: 'material', text: 'Material' }
    ],
    label: 'Select theme',
    width: '16em',
    position: 'insertFirst'
};
export default BryntumThemeCombo;
