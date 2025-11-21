import Container from './Container.js';
import Widget from './Widget.js';
import BrowserHelper from '../helper/BrowserHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import EventHelper from '../helper/EventHelper.js';
import DomClassList from '../helper/util/DomClassList.js';
import Rectangle from '../helper/util/Rectangle.js';
import DomHelper from '../helper/DomHelper.js';
import FunctionHelper from '../helper/FunctionHelper.js';
import DynamicObject from '../util/DynamicObject.js';
import Toolable from './mixin/Toolable.js';

import './Toolbar.js';

/**
 * @module Core/widget/Panel
 */

/**
 * An object that describes a Panel's header.
 *
 * @typedef {Object} PanelHeader
 * @property {String|Object} [cls] Additional CSS class or classes to add to the header element.
 * @property {String} [dock="top"] Specify "left", "bottom", or "right" to control panel edge to which the header docks.
 * @property {String} title
 * @property {String} [titleAlign="start"] Specify "center" or "end" to align the panel's title differently.
 */

const
    acceptNode      = e => !e.classList.contains('b-focus-trap') && DomHelper.isFocusable(e) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP,
    pluckElement    = e => e.element,
    emptyArray      = [],
    noHeaderItems   = [emptyArray, emptyArray],

    finishBodyWrap = (config, final) => ({
        children : config.children,
        class    : {
            [`b-${config.vertical ? 'v' : 'h'}box`] : 1,
            'b-box-center'                          : 1,
            'b-panel-bar-wrap'                      : !final
        }
    }),

    wrapBody = (inner, vertical = false) => ({
        vertical,
        children : inner ? [inner] : []
    }),

    barConfigs = {
        dock   : 1,
        hidden : 1,
        weight : 1
    },

    dockDirection = {
        //       [vertical, before]
        top    : [true, true],
        bottom : [true, false],
        left   : [false, true],
        right  : [false, false]
    },

    headerDock = {
        header       : 1,
        'pre-header' : 1
    };

// https://github.com/webcomponents/webcomponentsjs/issues/556
// Work around Internet Explorer wanting a function instead of an object.
// IE also *requires* this argument where other browsers don't.
acceptNode.acceptNode = acceptNode;

/**
 * Panel widget. A general purpose container which may be used to contain child {@link Core.widget.Container#config-items}
 * or {@link Core.widget.Widget#config-html}.
 *
 * Also may dock a {@link #config-header} and {@link #config-footer} either at top/bottom or left/right
 *
 *
 * @example
 * let panel = new Panel({
 *   title   : 'A Test Panel',
 *   items : [
 *     { type : 'text', placeholder: 'Text' },
 *   ],
 *   bbar : [{
 *     text : 'Proceed',
 *     onClick : () => {
 *       alert('Proceeding!');
 *     }
 *   }]
 * });
 *
 * @classType panel
 *
 * @extends Core/widget/Container
 * @inlineexample Core/widget/Panel.js
 */
export default class Panel extends Container.mixin(Toolable) {
    //region Config
    static get $name() {
        return 'Panel';
    }

    // Factoryable type name
    static get type() {
        return 'panel';
    }

    static get configurable() {
        return {
            localizableProperties : ['title'],

            /**
             * Custom CSS classes to add to the panel's body element.
             *
             * May be specified as a space separated string, or as an object in which property names
             * with truthy values are used as the class names:
             *
             * ```javascript
             *  bodyCls : {
             *      'b-my-class'     : 1,
             *      [this.extraCls]  : 1,
             *      [this.activeCls] : this.isActive
             *  }
             *  ```
             *
             * @config {String|Object}
             * @category CSS
             */
            bodyCls : {
                $config : {
                    merge : 'classList'
                },

                value : null
            },

            /**
             * By default, tabbing within a Panel is not contained, ie you can TAB out of the Panel
             * forwards or backwards.
             * Configure this as `true` to disallow tabbing out of the Panel, and make tabbing circular within this Panel.
             * @config {Boolean}
             * @default false
             * @category Content
             */
            trapFocus : null,

            /**
             * A title to display in the header. Causes creation and docking of a header
             * to the top if no header is configured.
             *
             * If specified, overrides any title configured within the {@link #config-header} configuration.
             * @default
             * @config {String}
             * @category Content
             */
            title : null,

            /**
             * A config {@link PanelHeader object} for the panel's header or a string in place of a `title`.
             * @default
             * @config {String|Core.widget.Panel#PanelHeader}
             * @category Content
             */
            header : null,

            /**
             * An object containing config defaults for corresponding {@link #config-strips} objects with a matching name.
             *
             * By default, this object contains the keys `'bbar'` and `'tbar'` to provide default config values for the
             * {@link #config-bbar} and {@link #config-tbar} configs.
             *
             * This object also contains a key named `'*'` with default config properties to apply to all strips. This
             * object provides the default `type` (`'toolbar') and {@link Core.widget.Widget#config-dock} (`'top'`)
             * property for strips.
             * @config {Object} stripDefaults
             * @internal
             * @category Content
             */
            stripDefaults : {
                '*' : {
                    type : 'toolbar',
                    dock : 'top'
                },

                bbar : {
                    dock   : 'bottom',
                    weight : -1000
                },

                tbar : {
                    weight : -1000
                }
            },

            /**
             * An object containing widgets keyed by name. By default (when no `type` is given), strips are
             * {@link Core.widget.Toolbar toolbars}. If the value assigned to a strip is an array, it is converted to
             * the toolbar's {@link Core.widget.Container#config-items}.
             *
             * The {@link #config-bbar} and {@link #config-tbar} configs are shortcuts for adding toolbars to the
             * panel's `strips`.
             *
             * Strips are arranged based on their {@link Core.widget.Widget#config-dock} and
             * {@link Core.widget.Widget#config-weight} configs.
             *
             * For widgets using a `dock` of `'top'`, `'bottom'`, `'left'`, or `'right'` (an "edge strip"), the higher
             * the `weight` assigned to a widget, the closer that widget will be to the panel body.
             *
             * For widgets with `'header'` or `'pre-header'` for `dock` (a "header strip"), higher `weight` values
             * cause the widget to be placed closer to the panel's title.
             *
             * ```javascript
             *  new Panel({
             *      title : 'Test',
             *      html  : 'Panel strip test',
             *      strips : {
             *          left : [{
             *              text : 'Go'
             *          }]
             *      }
             *  });
             * ```
             * @config {Object} strips
             * @category Content
             */
            strips : {
                value   : null,
                $config : {
                    nullify : true
                }
            },

            /**
             * Config object of a footer. May contain a `dock`, `html` and a `cls` property. A footer is not a widget,
             * but rather plain HTML that follows the last element of the panel's body and {@link #config-strips}.
             *
             * The `dock` property may be `top`, `right`, `bottom` or `left`.
             * @config {Object|String}
             * @default
             * @category Content
             */
            footer : null,

            /**
             * The {@link Core.widget.Tool tools} to add either before or after the `title` in the Panel header. Each
             * property name is the reference by which an instantiated tool may be retrieved from the live
             * `{@link Core.widget.mixin.Toolable#property-tools}` property.
             * @config {Object} tools
             * @category Content
             */

            /**
             * A Config object representing the configuration of a {@link Core.widget.Toolbar},
             * or array of config objects representing the child items of a Toolbar.
             *
             * This creates a toolbar docked to the top of the panel immediately below the header.
             * @config {Object[]|Object}
             * @category Content
             */
            tbar : null,

            /**
             * A Config object representing the configuration of a {@link Core.widget.Toolbar},
             * or array of config objects representing the child items of a Toolbar.
             *
             * This creates a toolbar docked to the bottom of the panel immediately above the footer.
             * @config {Object[]|Object}
             * @category Content
             */
            bbar : null
        };
    }

    //endregion

    /**
     * The tool Widgets as specified by the {@link #config-tools} configuration
     * (and the {@link Core.widget.Popup#config-closable} configuration in the Popup subclass).
     * Each is a {@link Core.widget.Widget Widget} instance which may be hidden, shown and observed and styled just like any other widget.
     * @member {Object} tools
     * @category Content
     */

    /**
     * Get toolbar {@link Core.widget.Toolbar} docked to the top of the panel
     * @member {Core.widget.Toolbar} tbar
     * @readonly
     * @category Content
     */

    /**
     * Get toolbar {@link Core.widget.Toolbar} docked to the bottom of the panel
     * @member {Core.widget.Toolbar} bbar
     * @readonly
     * @category Content
     */

    /**
     * A header {@link #config-tools tool} has been clicked.
     * @event toolClick
     * @param {Core.widget.Tool} source - This Panel.
     * @param {Core.widget.Tool} tool - The tool which is being clicked.
     */

    //region Init & destroy

    compose() {
        const
            me = this,
            { focusable, hasItems } = me,
            body = me.composeBody(),
            header = me.composeHeader(),
            horz = header?.class['b-dock-left'] || header?.class['b-dock-right'];

        return {
            tabIndex : ((hasItems && focusable !== false) || focusable) ? 0 : null,

            class : {
                [`b-${horz ? 'h' : 'v'}box`] : 1
            },

            children : {
                topFocusTrap : {
                    tabIndex : 0,
                    class    : {
                        'b-focus-trap' : 1
                    }
                },

                // Note: we always put header before bodyWrap since it is likely (though untested) to be better for
                // a11y. We use flexbox order to make the right/bottom docking appear correct but it is likely that
                // the DOM order of the <header> element vs (optional) <footer> is important to screen readers.
                headerElement : header,

                bodyWrapElement : body,

                bottomFocusTrap : {
                    tabIndex : 0,
                    class    : {
                        'b-focus-trap' : 1
                    }
                }
            }
        };
    }

    composeBody() {
        const
            me = this,
            { bodyCls, bodyConfig, footer } = me,
            strips = ObjectHelper.values(me.strips, (k, v) => !dockDirection[v?.dock]).sort(me.byWeightSortFn);

        let bar, before, dock, i, name, vertical, wrap;

        if (footer) {
            dock = footer.dock || 'bottom';

            strips.unshift({
                dock,
                element : {
                    tag       : 'footer',
                    reference : 'footerElement',
                    html      : (typeof footer === 'string') ? footer : footer.html,
                    class     : {
                        [`b-dock-${dock}`]      : 1,
                        [`${footer.cls || ''}`] : 1
                    }
                }
            });
        }

        if (bodyCls) {
            if (!bodyConfig[name = 'className']) {
                name = 'class';
            }

            bodyConfig[name] = new DomClassList(bodyConfig[name]).assign(bodyCls);
        }

        /*
            The higher the weight, the closer to the center we place the toolbar. Consider:

                {
                    tbar : ...,
                    bbar :...,
                    strips : {
                        lbar1 : { weight : 10, ... },
                        tbar2 : { weight : 20, ... },
                        lbar2 : { weight : 30, ... },
                        rbar  : { weight : 40, ... }
                    }
                }

                +---------------------------------------------------+
                | tbar                                              |
                +---------+-----------------------------------------+
                |         | tbar2                                   |
                |         +---------+----------------------+--------+
                |         |         |                      |        |
                |  lbar1  |         |                      |        |
                |         |  lbar2  |                      |  rbar  |
                |         |         |                      |        |
                |         |         |                      |        |
                +---------+---------+----------------------+--------+
                | bbar                                              |
                +---------------------------------------------------+
         */
        for (i = strips.length; i-- > 0; /* empty */) {
            bar = strips[i];
            [vertical, before] = dockDirection[bar.dock];

            if (!wrap) {
                wrap = wrapBody(bodyConfig, vertical);
            }
            else if (wrap.vertical !== vertical) {
                wrap = wrapBody(finishBodyWrap(wrap), vertical);
            }

            wrap.children[before ? 'unshift' : 'push'](bar.element);
        }

        const body = finishBodyWrap(wrap || wrapBody(bodyConfig), true);

        body.class['b-panel-body-wrap'] = 1;
        body.class[`b-${me.$$name.toLowerCase()}-body-wrap`] = 1;

        return body;
    }

    get hasHeader() {
        const
            { header, title, tools, parent } = this,
            hasVisibleTools                  = Object.values(tools || {}).some(tool => !tool.hidden);

        // Explicitly declared header should always be shown
        // Implicitly created from title or tools can be suppressed by parent
        return header || (!parent?.suppressChildHeaders && (title || hasVisibleTools));
    }

    composeHeader(force) {
        const me = this;

        // Dont add a header unless we have one configured, have a title or have visible tools (or are forced to)
        if (!force && !me.hasHeader) {
            return;
        }

        const
            splits          = me.splitHeaderItems(),
            header          = me.header || {},
            [before, after] = (splits || noHeaderItems),
            classes         = me.$meta.hierarchy,
            title           = me.composeTitle(header),
            dock            = header.dock || 'top',
            cls             = new DomClassList({
                [`b-dock-${dock}`] : 1
            }, header.cls);

        let i, name;

        for (i = classes.indexOf(Panel); i < classes.length; ++i) {
            name = classes[i].$$name;

            if (name !== 'Grid') {
                cls[`b-${name.toLowerCase()}-header`] = 1;
            }
        }

        for (i = 0; i < before.length; ++i) {
            before[i].syncRotationToDock?.(dock);
        }

        for (i = 0; i < after.length; ++i) {
            after[i].syncRotationToDock?.(dock);
        }

        return {
            tag      : 'header',
            class    : cls,
            children : [
                ...before.map(pluckElement),
                title,
                ...after.map(pluckElement)
            ]
        };
    }

    composeTitle(header) {
        const
            title       = (typeof header === 'string') ? header : (this.title || header.title),
            titleConfig = {
                reference : 'titleElement',
                html      : title,
                class     : {
                    [`b-align-${header.titleAlign || 'start'}`] : 1,
                    'b-header-title'                            : 1
                }
            };

        if (ObjectHelper.isObject(title)) {
            delete titleConfig.html;
            ObjectHelper.merge(titleConfig, title);
        }

        return titleConfig;
    }

    splitHeaderItems() {
        const
            me = this,
            { endTools, startTools } = me,
            strips = ObjectHelper.values(me.strips, (k, v) => !headerDock[v?.dock]);

        if (strips.length + endTools.length + startTools.length) {
            // The "natural" order of equal weight tools/strips is: tool -> strip -> header <- strip <- tool
            return [
                // the problem w/mixing tools and strips is the strip weight needs to do two jobs (one when docked
                // in the body and one when docked in the header)
                [
                    ...startTools,
                    ...strips.filter(e => e.dock === 'pre-header').sort(me.byWeightSortFn)
                ],
                [
                    ...strips.filter(e => e.dock === 'header').sort(me.byWeightReverseSortFn),
                    ...endTools
                ]
            ];
        }
    }

    set bodyConfig(bodyConfig) {
        this._bodyConfig = bodyConfig;
    }

    get bodyConfig() {
        const
            me     = this,
            { hasNoChildren, textContent } = me,
            result = ObjectHelper.merge({
                reference : 'bodyElement',
                className : me.classHierarchy(Panel).reduce((prev, cls) => {
                    // This more or less matches logic from Widget.widgetClassList

                    const
                        { $$name }          = cls,
                        widgetClassProperty = Reflect.getOwnPropertyDescriptor(cls.prototype, 'widgetClass');

                    let widgetClass = $$name;

                    // If the Class has its own get widgetClass, call it upon this instance.
                    if (widgetClassProperty?.get) {
                        widgetClass = widgetClassProperty.get.call(me);
                    }

                    if (widgetClass) {
                        prev[`b-${$$name.toLowerCase()}-content`] = widgetClass;
                    }

                    return prev;
                }, {})
            }, me._bodyConfig);

        if (me.initializingElement || !me._element) {
            // we cannot use the html config since a getter reads innerHTML
            result.html = me.content || me._html;
        }

        result.className['b-box-center'] = 1;
        result.className['b-text-content'] = textContent && hasNoChildren;

        return result;
    }

    changeBodyCls(cls) {
        return DomClassList.from(cls);
    }

    changeTbar(bar) {
        this.getConfig('strips');

        this.strips = {
            tbar : bar
        };

        return this.strips.tbar;
    }

    changeBbar(bar) {
        this.getConfig('strips');

        this.strips = {
            bbar : bar
        };

        return this.strips.bbar;
    }

    // Override to iterate docked Toolbars in the correct order around contained widgets.
    get childItems() {
        const
            me     = this,
            strips = ObjectHelper.values(me.strips, (k, v) => !dockDirection[v?.dock]).sort(me.byWeightSortFn),
            [before, after] = me.splitHeaderItems() || noHeaderItems;  // tools and header strips

        return [
            ...before,
            ...after,
            ...strips.filter(b => dockDirection[b.dock][1]),  // the "before" strips come before the items
            ...(me._items || emptyArray),
            ...strips.filter(b => !dockDirection[b.dock][1]).reverse()
        ];
    }

    changeStrips(strips, oldStrips) {
        const
            me      = this,
            manager = me.$strips || (me.$strips = new DynamicObject({
                configName : 'strips',
                factory    : Widget,
                inferType  : false,  // the name of a bar in the strips object is not its type
                owner      : me,

                created(instance) {
                    const { dock } = instance;

                    if (!headerDock[dock] && !dockDirection[dock]) {
                        throw new Error(
                            `Invalid dock value "${dock}"; must be: top, left, right, bottom, header, or pre-header`);
                    }

                    FunctionHelper.after(instance, 'onConfigChange', (ret, { name }) => {
                        if (barConfigs[name]) {
                            me.onConfigChange({
                                name  : 'strips',
                                value : manager.target
                            });
                        }
                    });

                    instance.innerItem = false;
                    me.onChildAdd(instance);

                    instance.parent = me;  // in case we are given an instanced widget
                    instance.layout?.renderChildren();

                    if (instance.hasItems) {
                        me.hasItems = true;
                    }
                },

                setup(config, name) {
                    config = ObjectHelper.merge(ObjectHelper.clone(me.stripDefaults['*']), me.stripDefaults[name], config);

                    config.parent = me;  // so parent can be accessed during construction
                    config.ref    = name;

                    return config;
                },

                transform(config) {
                    if (Array.isArray(config)) {
                        config = {
                            items : config
                        };
                    }

                    return config || null;
                }
            }));

        manager.update(strips);

        if (!oldStrips) {
            // Only return the target once. Further calls are processed above so we need to return undefined to ensure
            // onConfigChange is called. By returning the same target on 2nd+ call, it passes the === test and won't
            // trigger onConfigChange.
            return manager.target;
        }
    }

    updateTrapFocus(trapFocus) {
        const me = this;

        me.element.classList[trapFocus ? 'add' : 'remove']('b-focus-trapped');

        me.focusTrapListener = me.focusTrapListener?.();

        if (trapFocus) {
            me.focusTrapListener = EventHelper.on({
                element  : me.element,
                focusin  : 'onFocusTrapped',
                delegate : '.b-focus-trap',
                thisObj  : me
            });

            // Create a TreeWalker which visits focusable elements.
            if (!me.treeWalker) {
                me.treeWalker = this.setupTreeWalker(me.element, NodeFilter.SHOW_ELEMENT, acceptNode, false);
            }
        }
    }

    //#region Max height

    updateMaxHeight(maxHeight) {
        super.updateMaxHeight(maxHeight);

        if (BrowserHelper.isIE11) {
            this.bodyWrapElement.style.flex = `1 1 ${maxHeight}px`;
        }
    }

    fixIEMaxHeightBug() {
        const { element, contentElement, bodyWrapElement } = this;

        // If this widget is flexed vertically, the maxHeight of the encapsulating element must be
        // propagated onto the contentElement.
        if (DomHelper.getStyleValue(element, 'flex-direction') === 'column') {
            // Release previous height constraint
            contentElement.style.maxHeight = '';

            let availableHeight = Rectangle.client(element).height;

            const
                siblings = element.childNodes,
                len      = siblings.length;

            // In case there are height-consuming siblings of the contentElement.
            // For example a header/footer. The heights of these must be subtracted.
            for (let i = 0; i < len; i++) {
                const sibling = siblings[i];
                if (sibling !== contentElement && sibling !== bodyWrapElement && !sibling.classList.contains('b-resize-monitors')) {
                    availableHeight -= sibling.offsetHeight;
                }
            }

            // Apply the adjusted height constraint to the contentElement
            this.contentElement.style.maxHeight = `${availableHeight}px`;
        }
    }

    //#endregion

    setupTreeWalker(root, whatToShow, filter, entityReferenceExpansion) {
        return document.createTreeWalker(root, whatToShow, filter, entityReferenceExpansion);
    }

    onFocusTrapped(e) {
        const me         = this,
            treeWalker = me.treeWalker;

        // The only way of focusing these invisible elements is by TAB-ing to them.
        // If we hit the bottom one, wrap to the top.
        if (e.target === me.bottomFocusTrap) {
            treeWalker.currentNode = me.topFocusTrap;
            treeWalker.nextNode();
        }
        // If we hit the top one, wrap to the bottom.
        else {
            treeWalker.currentNode = me.bottomFocusTrap;
            treeWalker.previousNode();
        }

        me.requestAnimationFrame(() => treeWalker.currentNode.focus());
    }

    get focusElement() {
        // Either use our Containerness to yield the focus element of
        // a descendant or fall back to the encapsulating element.
        return this.hasItems && (super.focusElement || this.element);
    }

    get contentElement() {
        return this.element && this.bodyElement;
    }

    get widgetClassList() {
        const
            me         = this,
            result     = super.widgetClassList;

        if (me.hasHeader) {
            result.push('b-panel-has-header', `b-header-dock-${me.header?.dock || 'top'}`);
        }

        if (me.tbar) {
            result.push('b-panel-has-top-toolbar');
        }

        if (me.bbar) {
            result.push('b-panel-has-bottom-toolbar');
        }

        return result;
    }

    //endregion
}

// Register this widget type with its Factory
Panel.initClass();
