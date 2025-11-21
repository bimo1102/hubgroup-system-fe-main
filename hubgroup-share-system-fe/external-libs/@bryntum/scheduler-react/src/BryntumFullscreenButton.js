/**
 * React Fullscreen button wrapper
 */

import React, { Component } from 'react';
import { Fullscreen } from '@bryntum/scheduler/scheduler.umd';
import WrapperHelper from './WrapperHelper.js';

export default class BryntumFullscreenButton extends Component {

    componentDidMount() {
        const { createFullscreenButton } = WrapperHelper();
        this.button = createFullscreenButton(this.el);

        if (this.button) {
            if (!this.props.skipRender) {
                this.button.render();
            }
        }
    }

    componentWillUnmount() {
        if (this.button) {
            Fullscreen.onFullscreenChange(null);
        }
    }

    render() {
        return <div ref={el => (this.el = el)} />
    }
}

