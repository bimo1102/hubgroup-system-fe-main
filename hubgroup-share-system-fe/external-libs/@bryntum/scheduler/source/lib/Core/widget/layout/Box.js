import Layout from './Layout.js';

/**
 * @module Core/widget/layout/Box
 */

const
    directionCls = [
        'b-hbox',
        'b-vbox'
    ],
    wrapMap = {
        false   : 'nowrap',
        true    : 'wrap',
        reverse : 'wrap-reverse'
    };

/**
 * A layout that applies `display: flex` to the {@link Core.widget.Widget#property-contentElement contentElement} of
 * its container to layout child items. This defaults to a horizontal layout of items, also known as an `'hbox'`.
 * ```javascript
 *  layout : {
 *      type : 'box'   // or equivalently, 'hbox'
 *  }
 * ```
 * @extends Core/widget/layout/Layout
 */
export default class Box extends Layout {
    static get $name() {
        return 'Box';
    }

    static get type() {
        return 'box';
    }

    static get alias() {
        return 'hbox';
    }

    static get configurable() {
        return {
            itemCls : 'b-box-item',

            /**
             * Sets the [align-items](https://developer.mozilla.org/en-US/docs/Web/CSS/align-items) style of the
             * {@link #property-owner owner's} {@link Core.widget.Widget#property-contentElement contentElement}.
             * @config {String} align
             * @default 'stretch'
             */
            align : null,

            /**
             * Sets the [align-content](https://developer.mozilla.org/en-US/docs/Web/CSS/align-content) style of the
             * {@link #property-owner owner's} {@link Core.widget.Widget#property-contentElement contentElement}.
             * @config {String} contentAlign
             * @default 'normal'
             */
            contentAlign : null,

            /**
             * Sets the [direction](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction) style of the
             * {@link #property-owner owner's} {@link Core.widget.Widget#property-contentElement contentElement}.
             * This config is not set directly. Set {@link #config-horizontal}, {@link #config-vertical}, and/or
             * {@link #config-reverse} instead.
             * @config {String} direction
             * @private
             */
            direction : null,

            /**
             * Set this value to `false` to set the [flex-direction](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction)
             * style of the {@link #property-owner owner's} {@link Core.widget.Widget#property-contentElement contentElement}
             * to `column`. Or alternatively, set {@link #config-vertical} to `true`.
             * @config {Boolean} horizontal
             * @default
             */
            horizontal : true,

            /**
             * Sets the [justify-content](https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content) style of the
             * {@link #property-owner owner's} {@link Core.widget.Widget#property-contentElement contentElement}.
             * @config {String} justify
             * @default 'flex-start'
             */
            justify : null,

            /**
             * Set this value to `true` to add `'-reverse'` to the [flex-direction](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction)
             * style of the {@link #property-owner owner's} {@link Core.widget.Widget#property-contentElement contentElement}.
             * This config combines with {@link #config-horizontal} or {@link #config-vertical} to set the `flex-direction`
             * style.
             * @config {Boolean} reverse
             * @default false
             */
            reverse : null,

            /**
             * Sets the [flex-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap) style of the
             * {@link #property-owner owner's} {@link Core.widget.Widget#property-contentElement contentElement}.
             *
             * The value of `true` is equivalent to `'wrap'`, `false` is equivalent to `'nowrap'`, and `'reverse'` is
             * equivalent to `'wrap-reverse'`.
             *
             * ```javascript
             *  layout : {
             *      type : 'box',
             *      wrap : false        // equivalent to 'nowrap'
             *      wrap : true         // equivalent to 'wrap'
             *      wrap : 'reverse'    // equivalent to 'wrap-reverse'
             *  }
             * ```
             * @config {String|Boolean} wrap
             * @default false
             */
            wrap : null
        };
    }

    /**
     * Set this value to `true` to set the [flex-direction](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction)
     * style of the {@link #property-owner owner's} {@link Core.widget.Widget#property-contentElement contentElement}
     * to `column`. Or alternatively, set {@link #config-horizontal} to `false`.
     * @config {Boolean} vertical
     * @default false
     */
    get vertical() {
        return this.horizontal === false;
    }

    set vertical(v) {
        return this.horizontal = !v;
    }

    updateAlign() {
        this.syncConfigStyle('align', 'alignItems');
    }

    updateContentAlign() {
        this.syncConfigStyle('contentAlign', 'alignContent');
    }

    updateDirection() {
        this.syncConfigStyle('direction', 'flexDirection');
    }

    updateHorizontal() {
        const
            me = this,
            classList = me.contentElement?.classList,
            vertical = Number(me.vertical);

        if (classList) {
            classList.remove(directionCls[1 - vertical]);
            classList.add(directionCls[vertical]);
        }
        else {
            me.syncConfigLater('horizontal');
        }

        me.syncDirection();
    }

    updateJustify() {
        this.syncConfigStyle('justify', 'justifyContent');
    }

    updateReverse() {
        this.syncDirection();
    }

    updateWrap() {
        this.syncConfigStyle('wrap', 'flexWrap', wrapMap);
    }

    syncDirection() {
        const
            me = this,
            { reverse } = me;

        me.direction = reverse ? `${me.vertical ? 'column' : 'row'}${reverse ? '-reverse' : ''}` : null;
    }
}

// Layouts must register themselves so that the static layout instantiation
// in Layout knows what to do with layout type names
Box.initClass();
