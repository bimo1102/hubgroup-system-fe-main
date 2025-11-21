/**
 * Header for Bryntum demos
 */
import React, { Fragment } from 'react';
import { propTypes } from 'prop-types';
import BryntumFullscreenButton from './BryntumFullscreenButton';

const BryntumDemoHeader = (props) => {
    const { href, title } = props;
    return (
        <Fragment>
            <header className="demo-header">
                <div id="title-container">
                    <a id="title" href={href}>
                        {title}
                    </a>
                </div>
                {props.children}
                <BryntumFullscreenButton />
            </header>
        </Fragment>
    );
};

BryntumDemoHeader.propTypes = {
    title: propTypes.string,
    href: propTypes.string
};

BryntumDemoHeader.defaultProps = {
    title: 'Bryntum React demo',
    href: 'https://bryntum.com'
};

export default BryntumDemoHeader;
