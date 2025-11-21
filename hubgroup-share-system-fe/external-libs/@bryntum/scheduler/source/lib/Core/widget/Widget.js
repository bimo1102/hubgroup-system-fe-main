import Base from '../Base.js';
import Config from '../Config.js';
import BrowserHelper from '../helper/BrowserHelper.js';
import DomClassList from '../helper/util/DomClassList.js';
import DomHelper, { hasLayout, isInDocument } from '../helper/DomHelper.js';
import DomSync from '../helper/DomSync.js';
import FunctionHelper from '../helper/FunctionHelper.js';
import Fullscreen from '../helper/util/Fullscreen.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import ResizeMonitor from '../helper/ResizeMonitor.js';
import EventHelper from '../helper/EventHelper.js';
import Rectangle from '../helper/util/Rectangle.js';
import Point from '../helper/util/Point.js';
import Scroller from '../helper/util/Scroller.js';
import '../localization/En.js';
import Localizable from '../localization/Localizable.js';
import Events from '../mixin/Events.js';
import Delayable from '../mixin/Delayable.js';
import Factoryable from '../mixin/Factoryable.js';
import Identifiable from '../mixin/Identifiable.js';
import GlobalEvents from '../GlobalEvents.js';
import Mask from './Mask.js';

// TODO: Needs more docs

/**
 * @module Core/widget/Widget
 */

const
    floatRoots = [],
    isTransparent      = /transparent|rgba\(0,\s*0,\s*0,\s*0\)/,
    textInputTypes     = {
        INPUT    : 1,
        TEXTAREA : 1
    },
    addElementListeners = (me, element, domConfig) => {
        let listeners = domConfig?.listeners;

        listeners = listeners?.on || listeners;

        if (listeners) {
            domConfig.listeners = {
                on : listeners,
                un : EventHelper.on(ObjectHelper.assign({
                    element,
                    thisObj : me
                }, listeners))
            };
        }
    },
    mergeAnim = (value, was) => {
        // The show/hideAnimation objects can only have one animation property, but it is fine to merge if they have
        // the same property.
        return (value && was && was[ObjectHelper.keys(value)[0]]) ? Config.merge(value, was) : value;
    },
    // Need braces here. MUST NOT return false
    widgetTriggerPaint = w => {
        w.isVisible && w.triggerPaint();
    },
    negationPseudo     = /^:not\((.+)\)$/,
    isScaled           = w => w.scale != null,
    { hasOwnProperty } = Object.prototype,
    { defineProperty } = Reflect,
    parseDuration      = d => parseFloat(d) * (d.endsWith('ms') ? 1 : 1000),
    immediatePromise   = Promise.resolve(),
    alignedClass       = [
        'b-aligned-above',
        'b-aligned-right',
        'b-aligned-below',
        'b-aligned-left'
    ];

/**
 * Base class for other widgets. The Widget base class simply encapsulates an element, and may optionally contain some
 * specified {@link #config-html}.
 *
 * ## Rendering
 *
 * Subclasses should override the {@link #function-compose} method to return their encapsulating element and internal
 * DOM structure. The `compose()` method returns a {@link Core.helper.DomHelper#function-createElement-static} config
 * object that is* used to create the DOM structure, based on its {@link Core.Base#property-configurable-static}
 * properties:
 *
 * ```javascript
 *  class Button extends Widget {
 *      static get configurable() {
 *          return {
 *              cls  : null,
 *              text : null
 *          };
 *      }
 *
 *      compose() {
 *          const { cls, text } = this;  // collect all relevant configs properties (for auto-detection)
 *
 *          return {
 *              tag   : 'button',
 *              class : cls,
 *              text
 *          };
 *      }
 *  }
 * ```
 *
 * The config properties used by the `compose()` method are auto-detected when the method is first called for a class.
 * All relevant properties must be read, even if they end up not being used so that future changes to these properties
 * will mark the rendering as dirty.
 *
 * When a config property used by `compose()` is modified, the {@link #function-recompose} method is called. Since
 * `recompose()` is a {@link Core.mixin.Delayable#property-delayable-static delayable} method, calling it schedules a
 * delayed call to `compose()` and a DOM update. Accessing the Widget's primary `element` or any reference element
 * property will force the DOM update to occur immediately.
 *
 * ### Child Elements
 *
 * Unlike typical {@link Core.helper.DomHelper#function-createElement-static DOM config} objects, the object returned
 * by `compose()` can use an object to simplify naming:
 *
 * ```javascript
 *  class Button extends Widget {
 *      ...
 *
 *      compose() {
 *          const { cls, iconCls, text } = this;  // collect all relevant configs properties (for auto-detection)
 *
 *          return {
 *              tag   : 'button',
 *              class : cls,
 *
 *              children : {
 *                  iconElement : iconCls && {
 *                      class : {
 *                          'button-icon' : 1,
 *                          [iconCls]     : 1
 *                      }
 *                  },
 *
 *                  textElement : {
 *                      text
 *                  }
 *              }
 *          };
 *      }
 *  }
 * ```
 *
 * The keys of the `children` are [iterated](https://2ality.com/2015/10/property-traversal-order-es6.html) to convert
 * the values into the array required by {@link Core.helper.DomHelper#function-createElement-static}. The names of the
 * properties becomes the `reference` of the element.
 *
 * For example, the above is equivalent to the following:
 *
 * ```javascript
 *  class Button extends Widget {
 *      ...
 *
 *      compose() {
 *          const { cls, iconCls, text } = this;  // collect all relevant configs properties (for auto-detection)
 *
 *          return {
 *              tag   : 'button',
 *              class : cls,
 *
 *              children : [iconCls && {
 *                  reference : 'iconElement',
 *                  class : {
 *                      'button-icon' : 1,
 *                      [iconCls]     : 1
 *                  }
 *              }, {
 *                  reference : 'textElement',
 *                  text
 *              }]
 *          };
 *      }
 *  }
 * ```
 *
 * The object form of `children` is preferred for clarity but also because it facilitates inheritance.
 *
 * ### Inheritance
 *
 * When a derived class implements `compose()`, the object it returns is automatically merged with the object returned
 * by the base class.
 *
 * For example, the following class adds a new child element:
 *
 * ```javascript
 *  class MenuButton extends Button {
 *      ...
 *
 *      compose() {
 *          const { menuCls } = this;  // collect all relevant configs properties (for auto-detection)
 *
 *          return {
 *              children : {
 *                  menuElement : {
 *                      class : {
 *                          'button-menu' : 1,
 *                          [menuCls]     : 1
 *                      }
 *                  }
 *              }
 *          };
 *      }
 *  }
 * ```
 *
 * ### Listeners
 *
 * Reference elements may also define event `listeners` in the `compose()` method:
 *
 * ```javascript
 *  class Button extends Widget {
 *      compose() {
 *          const { cls, text } = this;
 *
 *          return {
 *              tag   : 'button',
 *              class : cls,
 *              text,
 *
 *              listeners : {
 *                  click : 'onClick'
 *              }
 *          };
 *      }
 *
 *      onClick(event) {
 *          // handle click event
 *      }
 *  }
 * ```
 *
 * ## Resolving properties
 *
 * Values for a Widgets properties can be resolved from the ownership hierarchy. For example a text field in a toolbar
 * can get its initial value from a property on the container owning the toolbar. This is achieved by prefixing the
 * desired property name with 'up.':
 *
 * ```javascript
 *  const grid = new Grid((
 *      tbar : [{
 *          type  : 'numberfield',
 *          // Fields value will be retrieved from the grids rowHeight property
 *          value : 'up.rowHeight'
 *      }]
 *  });
 * ```
 *
 * NOTE: this is for now a one way one time binding, the value will only be read initially and not kept up to date on
 * later changes.
 *
 * @mixes Core/mixin/Events
 * @mixes Core/localization/Localizable
 * @extends Core/Base
 * @classType widget
 */
export default class Widget extends Base.mixin(Localizable, Events, Delayable, Identifiable, Factoryable) {
    //region Config

    /**
     * Class name getter.
     * Used when original ES6 class name is minified or mangled during production build.
     * Should be overriden in each class which extends Widget or it descendants.
     *
     * ```javascript
     * class MyNewClass extends Widget {
     *     static get $name() {
     *        return 'MyNewClass';
     *     }
     * }
     * ```
     *
     * @static
     * @member {String} $name
     */
    static get $name() {
        return 'Widget';
    }

    // Factoryable type name
    static get type() {
        return 'widget';
    }

    static get configurable() {
        return {
            /**
             * Get this widget's encapsulating HTMLElement, which is created along with the widget but added to DOM at
             * render time.
             * @member {HTMLElement} element
             * @readonly
             * @category DOM
             */
            /**
             * A {@link Core.helper.DomHelper#function-createElement-static} config object or HTML string from which to
             * create the Widget's element.
             * @private
             * @config {Object|String}
             * @category DOM
             */
            element : true,

            callOnFunctions : true,

            /**
             * Get/set widgets id
             * @member {String} id
             * @category DOM
             */
            /**
             * Widget id, if not specified one will be generated. Also used for lookups through Widget.getById
             * @config {String}
             * @category DOM
             */
            id : '',

            /**
             * Html to display initially
             * @config {String}
             * @category DOM
             */
            html : null,

            /**
             * Set HTML content safely, without disturbing sibling elements which may have been
             * added to the {@link #property-contentElement} by plugins and features.
             * When specifying html, this widget's element will also have the {@link #config-htmlCls}
             * added to its classList, to allow targeted styling.
             * @member {String} content
             * @category DOM
             */
            /**
             * The HTML content that coexists with sibling elements which may have been added to the
             * {@link #property-contentElement} by plugins and features.
             * When specifying html, this widget's element will also have the {@link #config-htmlCls}
             * class added to its classList, to allow targeted styling.
             * @config {String} content
             * @category DOM
             */
            content : null,

            /**
             * Custom CSS classes to add to element.
             * May be specified as a space separated string, or as an object in which property names
             * with truthy values are used as the class names:
             * ```javascript
             *  cls : {
             *      'b-my-class'     : 1,
             *      [this.extraCls]  : 1,
             *      [this.activeCls] : this.isActive
             *  }
             *  ```
             *
             * @config {String|Object}
             * @category CSS
             */
            cls : {
                $config : {
                    merge : 'classList'
                },

                value : null
            },

            /**
             * Custom CSS classes to add to the {@link #property-contentElement}.
             * May be specified as a space separated string, or as an object in which property names
             * with truthy values are used as the class names:
             * ```javascript
             *  cls : {
             *      'b-my-class'     : 1,
             *      [this.extraCls]  : 1,
             *      [this.activeCls] : this.isActive
             *  }
             *  ```
             *
             * @config {String|Object}
             * @category CSS
             */
            contentElementCls : {
                $config : {
                    merge : 'classList'
                },

                value : null
            },

            /**
             * Controls the placement of this widget when it is added to a {@link Core.widget.Panel panel's}
             * {@link Core.widget.Panel#config-strips strips collection}. Typical values for this config are `'top'`,
             * `'bottom'`, `'left'`, or `'right'`, which cause the widget to be placed on that side of the panel's
             * body. Such widgets are called "edge strips".
             *
             * If this config is set to `'header'`, the widget is placed in the panel's header, following the title. If
             * this config is set to `'pre-header'`, the widget is placed before the title. Such widgets are called
             * "header strips".
             *
             * @config {String} dock
             * @category Layout
             */
            dock : null,

            parent : null,

            /**
             * The {@link Core.widget.Tab tab} created for this widget when it is placed in a
             * {@link Core.widget.TabPanel}.
             * @member {Core.widget.Tab} tab
             * @readonly
             * @category Misc
             */
            /**
             * A configuration for the {@link Core.widget.Tab tab} created for this widget when it is placed in a
             * {@link Core.widget.TabPanel}. For example, this config can be used to control the icon of the `tab` for
             * this widget:
             *
             * ```javascript
             *  items : [{
             *      type : 'panel',
             *      // other configs...
             *
             *      tab : {
             *          icon : 'b-fa-wrench'
             *      }
             *  }, ... ]
             * ```
             *
             * Another use for this config is to set the tab's {@link Core.widget.mixin.Rotatable#config-rotate} value
             * differently than the default managed by the `TabPanel`:
             *
             * ```javascript
             *  items : [{
             *      type : 'panel',
             *      // other configs...
             *
             *      tab : {
             *          rotate : false   // don't rotate even if tabBar is docked left or right
             *      }
             *  }, ... ]
             * ```
             *
             * Set this to `false` to prevent the creation of a `tab` for this widget. In this case, this widget must
             * be {@link #function-show shown} explicitly. The {@link Core.widget.TabPanel#config-activeTab} for the
             * tab panel will be -1 in this situation.
             *
             * ```javascript
             *  items : [{
             *      type : 'panel',
             *      tab  : false,    // no tab for this item
             *
             *      // other configs...
             *  }, ... ]
             * ```
             *
             * @config {Boolean|Object} tab
             * @category Misc
             */
            tab : null,

            /**
             * The CSS class(es) to add when HTML content is being applied to this widget.
             * @config {String|Object}
             * @category CSS
             */
            htmlCls : {
                $config : {
                    merge : 'classList'
                },

                value : {
                    'b-html' : 1
                }
            },

            /**
             * Custom style spec to add to element
             * @config {String}
             * @category CSS
             */
            style : null,

            /**
             * Get/set element's disabled state
             * @member {Boolean} disabled
             * @category Misc
             */
            /**
             * Disable or enable the widget. It is similar to {@link #config-readOnly} except a disabled widget
             * cannot be focused, uses a different rendition (usually greyish) and does not allow selecting its value.
             * @default false
             * @config {Boolean}
             * @category Misc
             */
            disabled : null,

            /**
             * Get/set element's readOnly state. This is only valid if the widget is an input
             * field, __or contains input fields at any depth__. Updating this property will trigger
             * a {@link #event-readOnly} event.
             *
             * All descendant input fields follow the widget's setting. If a descendant
             * widget has a readOnly config, that is set.
             * @member {Boolean} readOnly
             * @category Misc
             */
            /**
             * Whether this widget is read-only.  This is only valid if the widget is an input
             * field, __or contains input fields at any depth__.
             *
             * All descendant input fields follow the widget's setting. If a descendant
             * widget has a readOnly config, that is set.
             * @default false
             * @config {Boolean}
             * @category Misc
             */
            readOnly : {
                value   : null,
                default : false,
                $config : null
            },

            /**
             * Element (or element id) to adopt as this Widget's encapsulating element. The widget's
             * content will be placed inside this element.
             *
             * If this widget has not been configured with an id, it will adopt the id of the element
             * in order to preserve CSS rules which may apply to the id.
             * @config {HTMLElement|String}
             * @default
             * @category DOM
             */
            adopt : null,

            /**
             * Element (or element id) to append this widgets element to
             * @config {HTMLElement|String}
             * @default
             * @category DOM
             */
            appendTo : null,

            /**
             * Element (or element id) to insert this widget before. If provided, {@link #config-appendTo} config is ignored.
             * @config {HTMLElement|String}
             * @category DOM
             */
            insertBefore : null,

            /**
             * Element (or element id) to append this widget element to, as a first child. If provided, {@link #config-appendTo} config is ignored.
             * @config {HTMLElement|String}
             * @category DOM
             */
            insertFirst : null,

            /**
             * Object to apply to elements dataset (each key will be used as a data-attribute on the element)
             * @config {Object}
             * @category DOM
             */
            dataset : null,

            /**
             * Tooltip for the widget, either as a string or as a Tooltip config object.
             *
             * By default, the Widget will use a single, shared instance to display its tooltip as configured,
             * reconfiguring it to the specification before showing it. Therefore, it may not be permanently
             * mutated by doing things such as adding fixed event listeners.
             *
             * To have this Widget *own* its own `Tooltip` instance, add the property `newInstance : true`
             * to the configuration. In this case, the widget's {@link #property-owner} will be this Widget.
             * @config {String|Object}
             * @category Misc
             */
            tooltip : {
                $config : ['lazy', 'nullify'],
                value   : null
            },

            /**
             * Prevent tooltip from being displayed on touch devices. Useful for example for buttons that display a
             * menu on click etc, since the tooltip would be displayed at the same time.
             * @config {Boolean}
             * @default false
             * @category Misc
             */
            preventTooltipOnTouch : null,

            /**
             * Specify true to have widget monitoring its own resize.
             * @config {Boolean}
             * @default false
             * @category Misc
             */
            monitorResize : {
                $config : ['lazy', 'nullify'],
                value   : null
            },

            /**
             * Set to `true` to apply the default mask to the widget. Alternatively, this can be the mask message or a
             * {@link Core.widget.Mask} config object.
             * @config {Boolean|String|Object|Core.widget.Mask}
             * @category Misc
             */
            masked : null,

            /**
             * This config object contains the defaults for the {@link Core.widget.Mask} created for the
             * {@link #config-masked} config. Any properties specified in the `masked` config will override these
             * values.
             * @config {Object|Core.widget.Mask}
             * @default
             * @category Misc
             */
            maskDefaults : {
                target : 'element'
            },

            cache : {},

            /**
             * Set to `true` to move the widget out of the document flow and position it
             * absolutely in browser viewport space.
             * @config {Boolean}
             * @default
             * @category Float & align
             */
            floating : null,

            /**
             * Set to `true` when a widget is rendered into another widget's  {@link #property-contentElement}, but must not
             * participate in the standard layout of that widget, and must be positioned relatively to that
             * widget's {@link #property-contentElement}.
             *
             * {@link Core.widget.Editor Editor}s are positioned widgets.
             * @config {Boolean}
             * @default
             * @category Float & align
             */
            positioned : null,

            /**
             * Only valid if this Widget is {@link #config-floating}
             * Set to `true` to be able to drag a widget freely on the page. Or set to an object with a ´handleSelector´ property which controls when a drag
             * should start.
             *
             * ```javascript
             *
             * draggable : {
             *     handleSelector : ':not(button)'
             * }
             *
             * ```
             *
             * @config {Boolean|Object}
             * @default false
             * @category Float & align
             */
            draggable : null,

            /**
             * _Only valid if this Widget is {@link #config-floating}._
             *
             * How to align this element with its target when {@link #function-showBy} is called
             * passing a simple element as an align target.
             *
             * Either a full alignment config object as passed to {@link #function-showBy}, or for simple
             * cases, the edge alignment string to use.
             *
             * When using a simple string, the format is `'[trblc]n-[trblc]n'` and it specifies our edge and
             * the target edge plus optional offsets from 0 to 100 along the edges to align to.
             *
             * See the {@link #function-showBy} function for more details about using the object form.
             *
             * Once set, this is stored internally in object form.
             * @config {Object|String}
             * @category Float & align
             */
            align : 't-b',
            // NOTE: this config changes meaning in tools and grid columns, so we don't get too clever here (such as
            //  config merge fn that promotes strings to objects)

            /**
             * Only valid if this Widget is {@link #config-floating}
             * Set to `true` to centre the Widget in browser viewport space.
             * @config {Boolean}
             * @default
             * @category Float & align
             */
            centered : null,

            /**
             * Only valid if this Widget is {@link #config-floating} and being shown through {@link #function-showBy}.
             * Element, Widget or Rectangle to which this Widget is constrained.
             * @config {HTMLElement|Core.widget.Widget|Core.helper.util.Rectangle}
             * @default document.body
             * @category Float & align
             */
            constrainTo : undefined,

            /**
             * Only valid if this Widget is {@link #config-floating} and being shown through {@link #function-showBy}.
             * `true` to show a connector arrow pointing to the align target.
             * @config {Boolean}
             * @default false
             * @category Float & align
             */
            anchor : null,

            /**
             * The owning Widget of this Widget. If this Widget is directly contained, this will be the containing Widget.
             * If there is a `forElement`, this config will be that element's encapsulating Widget.
             *
             * If this Widget is floating, this config must be specified by the developer.
             * @config {Core.widget.Widget}
             * @category Float & align
             */
            owner : null,

            /**
             * Defines what to do if document is scrolled while Widget is visible (only relevant when floating is set to true).
             * Valid values: ´null´: do nothing, ´hide´: hide the widget or ´realign´: realign to the target if possible.
             * @config {String}
             * @default
             * @category Float & align
             */
            scrollAction : null,

            /**
             * Only valid if this Widget is {@link #config-floating}. An object which defined which CSS style
             * property should be animated upon hide, and how it should be animated eg:
             *
             * ```javascript
             * {
             *    opacity: {
             *        to : 0,
             *        duration: '10s',
             *        delay: '0s'
             *    }
             * }
             * ```
             *
             * Set to `'false'` to disable animation.
             *
             * @config {Boolean|Object}
             * @category Float & align
             */
            hideAnimation : {
                $config : {
                    merge : mergeAnim
                },

                value : null
            },

            /**
             * Only valid if this Widget is {@link #config-floating}. An object which defined which CSS style
             * property should be animated upon show, and how it should be animated eg:
             *
             * ```javascript
             * {
             *    opacity: {
             *        to : 1,
             *        duration: '10s',
             *        delay: '0s'
             *    }
             * }
             * ```
             *
             * Set to `'false'` to disable animation.
             *
             * @config {Boolean|Object}
             * @category Float & align
             */
            showAnimation : {
                $config : {
                    merge : mergeAnim
                },

                value : null
            },

            /**
             * The x position for the widget.
             *
             * Only valid if this Widget is {@link #config-floating} and not aligned or anchored to an element.
             *
             * @config {Number}
             * @default
             * @category Float & align
             */
            x : null,

            /**
             * The y position for the widget.
             *
             * Only valid if this Widget is {@link #config-floating} and not aligned or anchored to an element.
             *
             * @config {Number}
             * @default
             * @category Float & align
             */
            y : null,

            /**
             * Accessor to the {@link Core.helper.util.Scroller} which can be used
             * to both set and read scroll information.
             * @member {Core.helper.util.Scroller} scrollable
             * @category Layout
             */
            /**
             * Specifies whether (and optionally in which axes) a Widget may scroll. `true` means this widget
             * may scroll in both axes. May be an object containing boolean `overflowX` and `overflowY` properties which are applied
             * to CSS style properties `overflowX` and `overflowY`. If they are boolean, they are translated
             * to CSS overflow properties thus:
             *
             * *`true` -> `'auto'`
             * *`false` -> `'hidden'`
             *
             * After initialization, this property yields a {@link Core.helper.util.Scroller} which may be used
             * to both set and read scroll information.
             *
             * A Widget uses its `get overflowElement` property to select which element is to be scrollable.
             * By default, in the base `Widget` class, this is the Widget's encapsulating element. Subclasses
             * may implement `get overflowElement` to scroll inner elements.
             * @config {Boolean|Object|Core.helper.util.Scroller}
             * @default false
             * @category Scrolling
             */
            scrollable : {
                $config : ['nullify'],
                value   : null
            },

            /**
             * The class to instantiate to use as the {@link #config-scrollable}. Defaults to {@link Core.helper.util.Scroller}.
             * @internal
             * @config {Core.helper.util.Scroller}
             * @category Scrolling
             */
            scrollerClass : Scroller,

            /**
             * The name of the property to set when a single value is to be applied to this Widget. Such as when used
             * in a grid WidgetColumn, this is the property to which the column's `field` is applied.
             * @config {String}
             * @default 'html'
             * @category Misc
             */
            defaultBindProperty : 'html',

            /**
             * Event that should be considered the default action of the widget. When that event is triggered the
             * widget is also expected to trigger an `action` event. Purpose is to allow reacting to most widgets in
             * a coherent way.
             * @private
             * @config {String}
             * @category Misc
             */
            defaultAction : null,

            /**
             * When set to `true`, this widget is considered as a whole when processing {@link Core.widget.Toolbar}
             * overflow. When `false`, this widget's child items are considered instead.
             * @config {Boolean}
             * @default true
             * @category Layout
             * @internal
             */
            overflowable : {
                value   : null,
                default : true,
                $config : null
            },

            /**
             * Widget's width, used to set element style.width. Either specify a valid width string or a number, which
             * will get 'px' appended. We recommend using CSS as the primary way to control width, but in some cases
             * this config is convenient.
             * @config {String|Number}
             * @category Layout
             */
            width : null,

            /**
             * Widget's height, used to set element style.height. Either specify a valid height string or a number, which
             * will get 'px' appended. We recommend using CSS as the primary way to control height, but in some cases
             * this config is convenient.
             * @config {String|Number}
             * @category Layout
             */
            height : null,

            /**
             * The element's maxHeight. Can be either a String or a Number (which will have 'px' appended). Note that
             * like {@link #config-height}, _reading_ the value will return the numeric value in pixels.
             * @config {String|Number}
             * @category Layout
             */
            maxHeight : null,

            /**
             * The elements maxWidth. Can be either a String or a Number (which will have 'px' appended). Note that
             * like {@link #config-width}, _reading_ the value will return the numeric value in pixels.
             * @config {String|Number}
             * @category Layout
             */
            maxWidth : null,

            /**
             * The elements minWidth. Can be either a String or a Number (which will have 'px' appended). Note that
             * like {@link #config-width}, _reading_ the value will return the numeric value in pixels.
             * @config {String|Number}
             * @category Layout
             */
            minWidth : null,

            /**
             * The element's minHeight. Can be either a String or a Number (which will have 'px' appended). Note that
             * like {@link #config-height}, _reading_ the value will return the numeric value in pixels.
             * @config {String|Number}
             * @category Layout
             */
            minHeight : null,

            // not public, only used by us in docs
            scaleToFitWidth : null,
            allowGrowWidth  : true, // only used if scaleToFitWidth is true

            /**
             * Get element's margin property. This may be configured as a single number or a `TRBL` format string.
             * numeric-only values are interpreted as pixels.
             * @member {Number|String} margin
             * @category Layout
             */
            /**
             * Widget's margin. This may be configured as a single number or a `TRBL` format string.
             * numeric-only values are interpreted as pixels.
             * @config {Number|String}
             * @category Layout
             */
            margin : null,

            /**
             * Get element's flex property. This may be configured as a single number or a format string:
             *
             *      <flex-grow> <flex-shrink> <flex-basis>
             *
             * Numeric-only values are interpreted as the `flex-grow` value.
             * @member {Number|String} flex
             * @category Layout
             */
            /**
             * When this widget is a child of a {@link Core.widget.Container}, it will by default be participating in a
             * flexbox layout. This config allows you to set this widget's
             * <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/flex">flex</a> style.
             * This may be configured as a single number or a `<flex-grow> <flex-shrink> <flex-basis>` format string.
             * numeric-only values are interpreted as the `flex-grow` value.
             * @config {Number|String}
             * @category Layout
             */
            flex : null,

            /**
             * A widgets weight determines its position among siblings when added to a {@link Core.widget.Container}.
             * Higher weights go further down.
             * @config {Number}
             * @category Layout
             */
            weight : null,

            /**
             * Get/set this widget's `align-self` flexbox setting. This may be set to modify how this widget is aligned
             * within the cross axis of a flexbox layout container.
             * @member {String} alignSelf
             * @category Layout
             */
            /**
             * When this widget is a child of a {@link Core.widget.Container}, it will by default be participating in a
             * flexbox layout. This config allows you to set this widget's
             * <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/align-self">align-self</a> style.
             * @config {String}
             * @category Layout
             */
            alignSelf : null,

            /**
             * Configure as `true` to have the component display a translucent ripple when its
             * {@link #property-focusElement}, or {@link #property-element} is tapped *if the
             * current theme supports ripples*. Out of the box, only the Material theme supports ripples.
             *
             * This may also be a config object containing the following properties:
             *
             *  - `delegate  ` Optional. A CSS selector to filter which child elements trigger ripples. By default
             * the ripple is clipped to the triggering element.
             *  - `color     ` Optional, default = `#000`. A CSS color name or specification.
             *  - `radius    ` Optional, default is 100. The ending radius of the ripple.
             * Note that it will be clipped by the target element by default.
             *  - `clip      ` A string which describes how to clip the ripple if it is not to be clipped to the default
             * element. Either the property of the widget to use as the clipping element, or a selector to
             * allow clipping to the closest matching ancestor to the target element.
             *
             * eg:
             *```
             *    columns  : [{}...],
             *    ripple   : {
             *        color : 'red',
             *        clip  : '.b-grid-row'
             *    },
             *    ...
             *```
             * @config {Boolean|Object}
             * @category Misc
             */
            ripple : null,

            /**
             * A title to display for the widget. Only in effect when inside a container that uses it (such as TabPanel)
             * @default
             * @config {String}
             * @category DOM
             */
            title : null,

            localizableProperties : ['title'],

            // Set this flag to require element to have a size to be considered visible
            requireSize : false,

            /**
             * An identifier by which this widget will be registered in the {@link Core.widget.Container#property-widgetMap}
             * of all ancestor containers.
             *
             * If omitted, this widget will be registered using its {@link #config-id}. In most cases `ref` is
             * preferable over `id` since `id` is required to be globally unique while `ref` is not.
             *
             * The `ref` value is also added to the elements dataset, to allow targeting it using CSS etc.
             * @default
             * @config {String}
             * @category Misc
             */
            ref : null,

            /**
             * Get/set the widget hidden state.
             *
             * Note: `hidden : false` does *not* mean that this widget is definitely visible.
             * To ascertain visibility, use the {@link #property-isVisible} property.
             * @member {Boolean} hidden
             * @category Visibility
             */
            /**
             * Configure with true to make widget initially hidden.
             * @default false
             * @config {Boolean}
             * @category Layout
             */
            hidden : null,

            /**
             * Text alignment: 'left', 'center' or 'right'. Applied by adding a `b-text-align-xx` class to the widgets
             * element. Blank by default, which does not add any alignment class.
             * @config {String}
             * @category Layout
             */
            textAlign : null,

            // When adding our scroll listeners to hide/realign, we ignore events
            // happening too quickly as a result of the show/align action
            ignoreScrollDuration : 500,

            /**
             * The tag name of this Widget's root element
             * @config {String}
             * @default
             * @category DOM
             */
            tag : 'div',

            /**
             * Set this config to `false` to disable batching DOM updates on animation frames for this widget. This
             * has the effect of synchronously updating the DOM when configs affecting the rendered DOM are modified.
             * Depending on the situation, this could simplify code while increasing time spent updating the DOM.
             * @config {Boolean}
             * @default true
             * @internal
             */
            recomposeAsync : null,

            /**
             * If you are rendering this widget to a shadow root inside a web component, set this config to the shadowRoot
             * @config {ShadowRoot}
             * @default
             * @category Misc
             */
            rootElement : null
        };
    }

    static get prototypeProperties() {
        return {
            /**
             * true if no id was set, will use generated id instead (widget1, ...). Toggle automatically on creation
             * @member {Boolean} hasGeneratedId
             * @private
             * @category Misc
             */
            hasGeneratedId : false,

            /**
             * This readonly property is `true` for normal widgets in the {@link Core.widget.Container#config-items} of
             * a container. It is `false` for special widgets such as a {@link Core.widget.Panel#config-tbar}.
             * @member {Boolean} innerItem
             * @internal
             * @category Misc
             */
            innerItem : true
        };
    }

    static get declarable() {
        return [
            /**
             * This property declares the set of config properties that affect a Widget's rendering, i.e., the configs
             * used by the {@link #function-compose} method.
             *
             * For example:
             * ```javascript
             *  class Button extends Widget {
             *      static get renderConfigs() {
             *          return [ 'cls', 'iconCls', 'text' ];
             *      }
             *  }
             * ```
             *
             * Alternatively this can be an object:
             *
             * ```javascript
             *  class Button extends Widget {
             *      static get renderConfigs() {
             *          return {
             *              cls     : true,
             *              iconCls : true,
             *              text    : true
             *          };
             *      }
             *  }
             * ```
             * @member {Object|String[]} renderConfigs
             * @static
             * @category Configuration
             * @internal
             */
            'renderConfigs'
        ];
    }

    static get delayable() {
        return {
            recompose : 'raf'
        };
    }

    static get factoryable() {
        return {
            defaultType : 'widget'
        };
    }

    static get identifiable() {
        return {};
    }

    /**
     * Returns an array containing all existing Widgets. The returned array is generated by this call and is not an
     * internal structure.
     * @property {Core.widget.Widget[]}
     * @readonly
     * @internal
     */
    static get all() {
        return super.all;
    }

    /**
     * Get/set the {@link #config-recomposeAsync} config for all widgets. Setting this value will set the config for
     * all existing widgets and will be the default value for newly created widgets. Set this value to `null` to disable
     * the default setting for new widgets while leaving existing widgets unaffected.
     * @property {Boolean}
     * @internal
     */
    static get recomposeAsync() {
        return Widget._recomposeAsync;
    }

    static set recomposeAsync(value) {
        Widget._recomposeAsync = value;

        if (value != null) {
            const { all } = Widget;

            for (let i = 0; i < all.length; ++i) {
                if (all[i].isComposable) {
                    all[i].recomposeAsync = value;
                }
            }
        }
    }

    isType(type, deep) {
        return Widget.isType(this, type, deep);
    }

    static setupRenderConfigs(cls, meta) {
        let { renderConfigs } = cls,
            i;

        if (renderConfigs) {
            const obj =
                // Once a class declares renderConfigs, those are inherited and augmented:
                meta.getInherited('renderConfigs', /* create = */false) ||
                // Otherwise, since renderConfigs are declared on this class, we need to create them:
                Object.create(null);

            if (Array.isArray(renderConfigs)) {
                // Ex: renderConfigs: ['cls', 'text']
                for (i = 0; i < renderConfigs.length; ++i) {
                    obj[renderConfigs[i]] = true;
                }

                renderConfigs = obj;
            }
            else {
                // Ex: renderConfigs: { cls : true, text : true }
                renderConfigs = Object.assign(obj, renderConfigs);
            }
        }
        // else a class may declare renderConfigs=null to re-enable auto detection

        meta.renderConfigs = renderConfigs;
    }

    /**
     * Call once per class for custom widgets to have them register with the `Widget` class, allowing them to be created
     * by type.
     *
     * For example:
     * ```javascript
     * class MyWidget extends Widget {
     *   static get type() {
     *     return 'mywidget';
     *   }
     * }
     * MyWidget.initClass();
     * ```
     * @method initClass
     * @static
     * @category Lifecycle
     */

    //endregion

    //region Init & destroy

    construct(config = {}, ...args) {
        const me = this;

        me._isAnimatingCounter = 0;

        // Flag so we know when our dimensions have been constrained during alignment
        me.alignConstrained = 0;
        me.byRef = Object.create(null);

        me.callRealign        = me.realign.bind(me);
        me.doHideOrRealign    = me.doHideOrRealign.bind(me);
        me.onFullscreenChange = me.onFullscreenChange.bind(this);
        me.domSyncCallback    = me.domSyncCallback.bind(me);

        me._isUserAction = false;

        // Base class applies configs.
        super.construct(config, ...args);

        const { recomposeAsync } = Widget;

        if (recomposeAsync != null && me.recomposeAsync == null) {
            me.recomposeAsync = recomposeAsync;
        }

        me.finalizeInit();
    }

    startConfigure(config) {
        const
            me = this,
            // This will run the element change/update process if it was not kicked off by a derived class impl of
            // this method:
            { adopt, element } = me;

        if (adopt) {
            // Adopt the preexisting element as our element before configuration proceeds.
            me.adoptElement(element, adopt, config.id);
            me.updateElement(me._element, element);
        }

        super.startConfigure(config);
    }

    /**
     * Called by the Base constructor after all configs have been applied.
     * @internal
     * @category Lifecycle
     */
    finalizeInit() {
        if (this.insertBefore || this.appendTo || this.insertFirst || this.adopt) {
            this.render();
        }
    }

    doDestroy() {
        const
            me                               = this,
            { preExistingElements, element } = me;

        if (element) {
            const sharedTooltip = !me._tooltip && me._rootElement && Widget.Tooltip?.getSharedTooltip(me._rootElement, true);

            // If we are current user of the shared tooltip, hide it
            if (sharedTooltip?.activeTarget === element) {
                sharedTooltip.hide();
            }

            me.onExitFullscreen();

            // If we get destroyed very quickly after a call to show,
            // we must kill the timers which add the realign listeners.
            me.clearTimeout(me.scrollListenerTimeout);
            me.clearTimeout(me.resizeListenerTimeout);

            // Remove listeners which are only added during the visible phase.
            // In its own method because it's called on hide and destroy.
            me.removeTransientListeners();

            if (me.floating || me.positioned) {
                me.hide();
            }
            else {
                me.revertFocus();
            }

            ResizeMonitor.removeResizeListener(element.parentElement, me.onParentElementResize);
            ResizeMonitor.removeResizeListener(element, me.onElementResize);

            // Remove elements *which we own* on destroy,
            if (me.adopt) {
                for (let nodes = Array.from(element.childNodes), i = 0, { length } = nodes; i < length; i++) {
                    const el = nodes[i];

                    // If it's not preexisting, and not the floatRoot, remove it
                    if (!preExistingElements.includes(el) && el !== me.floatRoot) {
                        el.remove();
                    }
                }
                element.className     = me.adoptedElementClassName;
                element.style.cssText = me.adoptedElementCssText;
            }
            else {
                element.remove();
            }

            me.dragEventDetacher?.();
            me.dragOverEventDetacher?.();
            me.dragGhost.remove();
        }

        super.doDestroy();
    }

    //endregion

    //---------------------------------------------------------------------------------------------------------
    //region Render

    /**
     * Returns `true` if this class uses `compose()` to render itself.
     * @returns {Boolean}
     * @internal
     */
    get isComposable() {
        return !this.compose.$nullFn;
    }

    adoptElement(element, adopt, id) {
        const
            me             = this,
            adoptElement   = typeof adopt === 'string' ? document.getElementById(adopt) : adopt,
            previousHolder = Widget.fromElement(adoptElement);

        // If we are taking it over from a previous iteration, destroy the previous holder. This is not officially
        // supported, but CodeEditor relies on it working
        if (previousHolder && previousHolder.adopt && previousHolder !== me) {
            const previousHolderAdopt = typeof previousHolder.adopt === 'string'
                ? document.getElementById(previousHolder.adopt)
                : previousHolder.adopt;

            if (previousHolderAdopt === adoptElement) {
                previousHolder.destroy();
            }
        }

        // On destroy, leave these
        me.preExistingElements     = Array.from(adoptElement.childNodes);
        me.adoptedElementClassName = adoptElement.className;
        me.adoptedElementCssText   = adoptElement.style.cssText;

        // Adopt the host element's id if we don't have one so that we do not override
        // it and invalidate any ad-based CSS rules.
        if (adoptElement.id && !id) {
            me.id = element.id = adoptElement.id;
        }

        DomHelper.syncAttributes(element, adoptElement);

        for (let i = 0, { length } = element.childNodes; i < length; i++) {
            adoptElement.appendChild(element.childNodes[0]);
        }

        delete me._contentRange;

        // Silently update our element config (do not re-run change/update cycle):
        me._element = adoptElement;

        const
            domConfig = element.lastDomConfig,
            listeners = domConfig?.listeners;

        if (listeners && me.isComposable) {
            listeners.un?.();
            addElementListeners(me, adoptElement, domConfig);
        }

        // Maintain DomSync internal state from our original element:
        adoptElement.lastDomConfig = domConfig || adoptElement.lastDomConfig;
        adoptElement.$refOwnerId = me.id;

        if (!me.scaleToFitWidth) {
            me.getConfig('monitorResize');
        }
    }

    /**
     * Defines an element reference accessor on the class prototype. This accessor is used to flush any pending DOM
     * changes prior to accessing such elements.
     * @param {String} name
     * @param {String} key
     * @private
     */
    addRefAccessor(name, key) {
        const { prototype } = this.constructor;

        defineProperty(prototype, key, {
            writable : true,
            value    : null
        });

        defineProperty(prototype, name, {
            get() {
                // Asking for a ref el is a good sign that we need to sync the DOM:
                this.recompose.flush();
                return this[key];
            },
            set(el) {
                this[key] = el;
            }
        });
    }

    /**
     * This method is called by `DomHelper.createElement` and `DomSync.sync` as new reference elements are created.
     * @param {String} name The name of the element, i.e., the value of its `reference` attribute.
     * @param {HTMLElement} el The element instance
     * @param {Object} [domConfig] The DOM config object.
     * @internal
     */
    attachRef(name, el, domConfig) {
        const
            me = this,
            key = '_' + name;

        //<debug>
        if (me.$meta.configs[name]) {
            throw new Error(`Config "${name}" collides with reference element`);
        }
        //</debug>

        // Key elements contain owner pointer if data is supported (Not on IE SVG).
        el.dataset && (el.dataset.ownerCmp = me.id);

        if (me.isComposable) {
            if (!(key in me)) {
                me.addRefAccessor(name, key);
            }

            addElementListeners(me, el, domConfig);
        }

        me.byRef[name] = el;
        me[name] = el;
    }

    /**
     * This method is called by `DomSync.sync` as reference elements are removed from the DOM.
     * @param {String} name The name of the element, i.e., the value of its `reference` attribute.
     * @param {HTMLElement} el The element instance
     * @param {Object} domConfig The DOM config object.
     * @internal
     */
    detachRef(name, el, domConfig) {
        if (domConfig.listeners) {
            domConfig.listeners.un();
            domConfig.listeners = null;
        }

        this[name] = null;

        delete this.byRef[name];
    }

    /**
     * This method is called following an update to the widget's rendered DOM.
     * @internal
     */
    afterRecompose() {
        // empty
    }

    /**
     * Returns a {@link Core.helper.DomHelper#function-createElement-static} config object that defines this widget's
     * DOM structure. This object should be determined using {@link Core.Base#property-configurable-static} properties
     * to ensure this method is called again if these properties are modified.
     *
     * For more information see {@link Core.widget.Widget class documentation}.
     * @returns {Object}
     */
    compose() {
        const classes = DomClassList.normalize(this.widgetClassList, 'object');

        return {
            class : classes
        };
    }

    /**
     * This method iterates the class hierarchy from Widget down to the class of this instance and calls any `compose`
     * methods implemented by derived classes.
     * @returns {Object}
     * @private
     */
    doCompose() {
        const
            me = this,
            { $meta : meta } = me,
            classes = meta.hierarchy;

        let { composers } = meta,
            domConfig = null,
            c, key, firstTime, i, proto, renderConfigs;

        me.recompose.suspend();

        if (!composers) {
            firstTime = true;
            meta.composers = composers = [];

            // Widget starts the process w/the widgetClassList
            for (i = classes.indexOf(Widget); i < classes.length; ++i) {
                proto = classes[i].prototype;

                if (hasOwnProperty.call(proto, 'compose')) {
                    composers.push(proto);
                }
            }

            // See if the class (or a super class) has declared its `renderConfigs`. If so, we use them.
            if (!(renderConfigs = meta.getInherited('renderConfigs', /* create = */false))) {
                // If not, we create a Proxy or proxy-like object that can detect getter calls to determine them. While
                // technically the getters may not all trigger on any given rendering, we ignore this due to the high
                // cost of supporting such arbitrary compose() methods. By convention, compose() must read configs
                // consistently.
                renderConfigs = Object.create(null);

                // On the first composition for this class, watch the config properties that are read to auto populate
                // the renderConfigs:
                me.configObserver = {
                    get(name) {
                        renderConfigs[name] = true;
                    }
                };
            }

            meta.$renderConfigs = renderConfigs;
        }

        // This loop always runs at least once due to Widget base class, so ret will be assigned here:
        for (i = 0; i < composers.length; ++i) {
            c = composers[i].compose.call(me, domConfig);
            domConfig = domConfig ? DomHelper.merge(domConfig, c) : c;
        }

        if (hasOwnProperty.call(me, 'compose') && (c = me.compose)) {
            c = c.call(me, domConfig);
            DomHelper.merge(domConfig, c);
        }

        firstTime && delete me.configObserver;

        // When converting a children:{} into an array, we take a moment to ensure we have an accessor defined for
        // the element. This is needed if the element is initially unrendered since we need the accessor to flush a
        // pending recompose through just in time via the reference element getter.
        return DomHelper.normalizeChildren(domConfig, (childName, hoist) => {
            // Only care about refs that should be hoisted up to us
            if (hoist) {
                key = '_' + childName;

                if (!(key in me)) {
                    me.addRefAccessor(childName, key);
                }
            }
        });
    }

    get element() {
        // NOTE: We can replace the getter of a config property

        if (this.isComposable && !this.isDestroying) {
            // Asking for the primary el is a good sign that we need to sync the DOM:
            this.recompose.flush();
        }

        return this._element;
    }

    // Empty, bound in construct. Override in subclass
    domSyncCallback() {}

    changeElement(element) {
        const
            me = this,
            compose = me.isComposable;

        if (compose) {
            //<debug>
            if (element !== true) {
                throw new Error(`${this.$$name} cannot use compose() method with an element config`);
            }
            //</debug>

            element = me.doCompose();

            //<debug>
            if (!ObjectHelper.isObject(element)) {
                throw new Error(`${this.$$name} compose() method must return an object`);
            }
            //</debug>
        }

        if (typeof element === 'string') {
            element = DomHelper.createElementFromTemplate(element);
        }
        else if (ObjectHelper.isObject(element)) {
            if (me.initialSync) {
                const domConfig = element;

                element = document.createElement('div');

                // TODO : Don, refactor this to be able to call `recompose.now()` initially?

                DomSync.sync({
                    targetElement : element,
                    domConfig,
                    refOwner      : me,
                    callback      : me.domSyncCallback,

                    // This limits the sync() to only removing the classes and styles added by previous renderings. This
                    // allows dynamically added styles and classes to be preserved:
                    strict : true
                });

                me.recompose.resume();
            }
            else {
                element = DomHelper.createElement(element, {
                    refOwner : me
                });

                me.recompose.resume();
            }

            compose && addElementListeners(me, element, element.lastDomConfig);
        }
        else if (element.nodeType !== 1) {
            element = DomHelper.createElementFromTemplate(me.template(me));
        }

        element.id = me.id;

        return element;
    }

    updateElement(element) {
        const
            me = this,
            { className } = element,
            { contentElement, contentElementCls } = me,
            namedElements = !me.isComposable && element.querySelectorAll('[data-reference]'),
            // Start with the hierarchy classes, eg ['b-combo b-pickerfield b-textfield b-widget']
            classes = me.isComposable ? [] : me.widgetClassList;  // a dynamic array that we can safely modify

        className && classes.unshift(className);
        me._hidden && classes.push('b-hidden');
        me._readOnly && classes.push('b-readonly');

        // Calling element.remove() when we have the focus can result in a DOMException (notably when a blur/focusout
        // handler reentrancy results in a remove):
        //  DOMException: Failed to execute 'remove' on 'Element': The node to be removed is no longer a child
        //  of this node. Perhaps it was moved in a 'blur' event handler?
        FunctionHelper.noThrow(element, 'remove' /*, () => { debugger; } /**/); // delete "/*" to break on exception

        if (contentElementCls) {
            if (contentElement === element) {
                classes.push(contentElementCls);
            }
            else {
                contentElement.className += ' ' + contentElementCls;
            }
        }

        // The environmental classes only need to be added to orphan Widgets.
        // If we have a parent container, that will have them.
        if (!me.parent) {
            classes.push(...Widget.outerCls);
        }

        element.className = classes.join(' ');

        if (namedElements) {
            for (let el, i = 0; i < namedElements.length; ++i) {
                el = namedElements[i];
                me.attachRef(el.getAttribute('data-reference'), el);

                el.removeAttribute('data-reference');
            }
        }

        // Mutually exclusive with scaleToFitWidth.
        // Observe container element before the cascade down to descendants.
        // Outer elements are expected to fire resize first.
        // It's a lazy config, so this is the time to flush it through to begin monitoring.
        if (!me.adopt && !me.scaleToFitWidth) {
            me.getConfig('monitorResize');
        }
    }

    /**
     * Calling this {@link Core.mixin.Delayable#property-delayable-static} method marks this widget as dirty. The DOM
     * will be updated on the next animation frame:
     *
     * ```javascript
     *  widget.recompose();
     *
     *  console.log(widget.recompose.isPending);
     *  > true
     * ```
     *
     * A pending update can be flushed by calling `flush()` (this does nothing if no update is pending):
     *
     * ```javascript
     *  widget.recompose.flush();
     * ```
     *
     * This can be combined in one call to force a DOM update without first scheduling one:
     *
     * ```javascript
     *  widget.recompose.now();
     * ```
     */
    async recompose() {
        const
            me      = this,
            options = {
                targetElement : me.element,
                domConfig     : me.doCompose(),
                refOwner      : me,
                callback      : me.domSyncCallback,

                // This limits the sync() to only removing the classes and styles added by previous renderings. This
                // allows dynamically added styles and classes to be preserved:
                strict : true
            };

        if (me.transitionRecompose) {
            me.isTransitioningDom = true;

            await DomHelper.transition(ObjectHelper.assign({
                element : me.element,
                action() {
                    DomSync.sync(options);
                }
            }, me.transitionRecompose));

            me.isTransitioningDom = false;

            me.trigger('transitionedRecompose');
        }
        else {
            DomSync.sync(options);
        }

        if (options.changed) {
            me.afterRecompose();
        }

        me.recompose.resume();
    }

    render(parentElement = this.appendTo, triggerPaint = true) {
        const
            me          = this,
            { element } = me;

        me.emptyCache();

        if (me.syncElement && me.currentElement) {
            DomHelper.sync(element, me.currentElement);
        }
        else {
            let insertBefore = me.insertBefore;

            if (me.insertFirst) {
                parentElement = me.insertFirst;

                insertBefore = me.insertFirst.firstChild;
            }

            if (insertBefore) {
                if (typeof insertBefore === 'string') {
                    const id     = insertBefore;
                    insertBefore = document.getElementById(insertBefore);

                    if (!insertBefore) {
                        throw new Error(`No element found with id '${id}'`);
                    }
                }

                if (!parentElement) {
                    parentElement = insertBefore.parentElement;
                }
            }

            if (typeof parentElement === 'string') {
                const id      = parentElement;
                parentElement = document.getElementById(parentElement);

                if (!parentElement) {
                    throw new Error(`No element found with id '${id}'`);
                }
            }

            parentElement?.insertBefore(element, insertBefore);

            me.currentElement = element;
        }

        // The environmental classes only need to be added to a naked Widget.
        // If we are inside a Widget's element, that will have them.
        if (Widget.fromElement(element.parentElement)) {
            DomHelper.removeClasses(element, Widget.outerCls);
        }

        me.rendered = true;

        if (triggerPaint) {
            me.getConfig('contentRange');
            me.triggerPaint();
        }

        me.setupFocusListeners();
    }

    /**
     * A function which, when passed an instance of this Widget, produces a valid HTML string which is compiled
     * to create the encapsulating element for this Widget, and its own internal DOM structure.
     *
     * Note that this just creates the DOM structure that *this* Widget owns. If it contains child widgets
     * (Such as for example a grid), this is not included. The template creates own structure.
     *
     * Certain elements within the generated element can be identified as special elements with a `reference="name"`
     * property. These will be extracted from the element upon creation and injected as the named property into
     * the Widget. For example, a {@link Core.widget.TextField} will have an `input` property which is its
     * `<input>` element.
     * @param {Core.widget.Widget} me The widget for which to produce the initial HTML structure.
     * @internal
     */
    template(me) {
        return `<${me.tag} class="${me.html ? me.htmlCls : ''}" ${me.name ? `data-name="${me.name}"` : ''}>${me.html || ''}</${me.tag}>`;
    }

    updateRecomposeAsync(async) {
        this.recompose.immediate = !async;
    }

    //endregion
    //---------------------------------------------------------------------------------------------------------

    onConfigChange({ name }) {
        // The $renderConfigs object is either on our prototype (due to renderConfigs getter) or on our instance (due
        // to "get composer") unless we are not using compose(), in which case it will be null:
        if (this._element && !this.isDestroying && this.$meta.$renderConfigs?.[name]) {
            this.recompose();
        }
    }

    /**
     * Get widgets elements dataset or assign to it
     * @property {Object}
     * @category DOM
     */
    get dataset() {
        return this.element.dataset;
    }

    changeDataset(dataset) {
        Object.assign(this.dataset, dataset);
    }

    get dragGhost() {
        return this.constructor._dragGhost || (this.constructor._dragGhost = DomHelper.createElement({
            // Safari won't allow dragging an empty node
            html  : '\xa0',
            style : 'position:absolute;top:-10000em;left:-10000em'
        }));
    }

    updateParent(parent) {
        const { _element : element } = this;

        if (element) {
            DomHelper[parent ? 'removeClasses' : 'addClasses'](element, Widget.outerCls);
        }
    }

    get constrainTo() {
        const ret = this._constrainTo;

        return (ret === undefined) ? window : ret;
    }

    updateCentered(value) {
        const
            {
                element,
                _anchorElement
            } = this;

        if (value && !this.floating && !this.positioned) {
            throw new Error('`centered` is only relevant when a Widget is `floating` or `positioned`');
        }

        if (value) {
            element.classList.add('b-centered');
            element.style.transform = element.style.left = element.style.top = '';
            _anchorElement?.classList.add('b-hide-display');
            element.classList.remove('b-anchored');
        }
        else {
            element.classList.remove('b-centered');
        }
    }

    /**
     * The child element into which content should be placed. This means where {@link #config-html} should be put,
     * or, for {@link Core.widget.Container Container}s, where child items should be rendered.
     * @property {HTMLElement}
     * @readonly
     * @category DOM
     */
    get contentElement() {
        return this.element;
    }

    get contentRange() {
        const
            me                 = this,
            { contentElement } = me,
            contentRange       = me._contentRange || (me._contentRange = BrowserHelper.isIE11 ? document.createRange() : new Range());

        // Initialize the contentRange if it's collapsed.
        // It gets collapsed if the widget's element is removed from the DOM.
        if (contentRange.collapsed) {
            contentRange.setStart(contentElement, me.contentRangeStartOffset || 0);
            contentRange.setEnd(contentElement, me.contentRangeEndOffset || contentElement.childNodes.length);
        }

        return contentRange;
    }

    /**
     * This method fixes the element's `$refOwnerId` when this instance's `id` is changing.
     * @param {Node} el The element or DOM node to fix.
     * @param {String} id The new id being assigned.
     * @param {String} oldId The old id (previously assigned).
     * @private
     */
    fixRefOwnerId(el, id, oldId) {
        if (el.$refOwnerId === oldId) {
            el.$refOwnerId = id;

            for (let { childNodes } = el, i = childNodes.length; i-- > 0; /* empty */) {
                this.fixRefOwnerId(childNodes[i], id, oldId);
            }
        }
    }

    updateId(id, oldId) {
        super.updateId(id, oldId);

        if (oldId) {
            // NOTE this happens when we adopt an element w/an assigned id...

            const { byRef, element } = this;

            for (const ref in byRef) {
                byRef[ref].dataset && (byRef[ref].dataset.ownerCmp = id);  // SVG elements have no dataset
            }

            element.id = id;

            this.fixRefOwnerId(element, id, oldId);
        }
    }

    /**
     * Get/set widgets elements style. The setter accepts a cssText string or a style config object, the getter always
     * returns a CSSStyleDeclaration
     * @property {String|Object|CSSStyleDeclaration}
     * @category DOM
     */
    get style() {
        const { element } = this;

        return element ? element.ownerDocument.defaultView.getComputedStyle(element) : this._style;
    }

    updateStyle(style) {
        this.element && DomHelper.applyStyle(this.element, style);
    }

    updateTitle(title) {
        if (this.titleElement) {
            this.titleElement.innerHTML = title;
        }
    }

    //region floating

    /**
     * If this Widget is {@link #config-floating} or {@link #config-positioned}, and visible,
     * aligns the widget according to the passed specification. To stop aligning, call this method without arguments.
     * For details, see the {@link #function-showBy} method.
     * @param {Object} [spec] Alignment options. May be an object as processed by the {@link #function-showBy} method,
     * or an `HTMLElement` to align to using this Widget's {@link #config-align} configuration.
     * @category Float & align
     */
    alignTo(spec) {
        const
            me = this,
            {
                lastAlignSpec,
                element
            }  = me;

        // Ensure marker class of previous alignment side is removed.
        if (lastAlignSpec) {
            element.classList.remove(alignedClass[lastAlignSpec.zone]);
        }

        if (!spec) {
            me.removeTransientListeners();
            me.anchor = me.lastAlignSpec = null;
            return;
        }
        //<debug>
        if (!(me.floating || me.positioned)) {
            throw new Error('Only floating or positioned Widgets can use alignTo');
        }
        if (!(spec.nodeType || spec.target || spec.position || (spec.$$name === 'Point'))) {
            throw new Error('Widget.alignTo must be either passed a target to position by, or a position Point to position at');
        }
        //</debug>

        // You can "alignTo" an element or a Widget or a Point, and allow our align config.
        // property to specify how.
        if (spec.nodeType === Element.ELEMENT_NODE || spec instanceof Widget || (spec.$$name === 'Point')) {
            spec = {
                target : spec
            };
        }

        // Release size constraints so we can align from scratch each time.
        me.releaseSizeConstraints();

        const
            {
                scrollable,
                constrainTo
            }                 = me,
            scale             = me.scale || 1,
            passedTarget      = spec.target,
            target            = passedTarget && ((passedTarget instanceof Rectangle) ? passedTarget : (passedTarget.element || passedTarget)),
            myPosition        = Rectangle.from(element, me.positioned ? element.offsetParent : null, true),
            {
                width  : startWidth,
                height : startHeight
            }                 = myPosition,
            aligningToElement = target && target.nodeType === Element.ELEMENT_NODE;

        spec = ObjectHelper.assign({
            constrainTo,
            align    : 'b-t', // we can end up w/o a value for this if an object replaces a string
            axisLock : me.axisLock,
            anchor   : me.anchor
        }, me.align, spec);

        // As part of fallback process when fitting within constraints, this may shrink to minima specified
        // either on the align spec or the widget itself.
        const
            minWidth = spec.minWidth || me.minWidth,
            minHeight = spec.minHeight || me.minHeight;

        // Minima have a different meaning in an alignRectangle.
        // It means that the rectangle is willing to shrink down
        // to that size during constraint, *not* that it can never
        // be smaller than that size.
        myPosition.isAlignRectangle = true;
        minWidth && (myPosition.minWidth = minWidth * scale);
        minHeight && (myPosition.minHeight = minHeight * scale);

        // This is used by the realign call which may be called either when a global scroll is detected
        // or the constraining element is resized.
        me.lastAlignSpec = spec;

        if (aligningToElement && target.offsetParent) {
            // Translate the element into a browser viewport based Rectangle. Rectangle
            // Doesn't have the knowledge that we do to make this decision. Floating
            // alignment all takes place within browser viewport space, not document space.
            // Don't destroy the spec which was cached above with the element in it.
            spec        = Object.setPrototypeOf({}, spec);
            spec.target = Rectangle.from(target, me.positioned ? element.offsetParent : null, !me.positioned);

            // Force the target to have an area so that intersect works.
            spec.target.height = Math.max(spec.target.height, 1);
            spec.target.width  = Math.max(spec.target.width, 1);

            // Handle the target being clipped by the bounds of various elements.
            // For example in a grid, the SubGrid element will clip the left and right
            // but the main grid bodyContainer will clip the top and bottom.
            const clippedBy = me.clippedBy;
            if (clippedBy) {
                const clippedTarget = spec.target.intersect(clippedBy);

                // If there is an intersecting Rectangle with the forElement, align
                if (clippedTarget) {
                    spec.target = clippedTarget;
                }
                // This is the case where the target is scrolled or positioned out of view.
                else {
                    const result = me.hide();

                    // The hide method clears this flag.
                    // Only this hide invocation must complete with the
                    // targetHidden flag as true
                    // Hiding *might* destroy if autoClose is set.
                    if (!me.isDestroyed) {
                        me.lastAlignSpec.targetHidden = true;
                    }
                    return result;
                }
            }

            // This is the element which determines our position.
            // This is used in doHideOrRealign to see if a scroll event
            // will have affected our position.
            me.anchoredTo = target;
        }
        else {
            me.anchoredTo = null;
        }

        if (spec.anchor) {
            spec.anchorSize = me.anchorSize;
            if (!element.contains(me.anchorPathElement)) {
                element.appendChild(me.anchorElement);
            }
        }

        // If we're positioned, the constrainTo must be a Rectangle in our offsetParent's coordinate space
        if (constrainTo && !constrainTo.isRectangle && me.positioned) {
            const isViewport = constrainTo === document || constrainTo === window;

            spec.constrainTo = Rectangle.from(isViewport ? document.body : spec.constrainTo, element.offsetParent);
        }

        // Flag to prevent infinite loop when setting html from a beforeAlign listener
        me.isAligning = true;

        // Allow outside world to modify the suggested position
        me.trigger('beforeAlign', spec);

        me.isAligning = false;

        // Calculate the best position WRT target rectangle, our rectangle, a constrainTo rectangle
        // and the rectangle of an anchor pointer.
        const result = myPosition.alignTo(spec);

        // May change if constraint changes our shape, and we have to go round again
        let { align, anchor, x, y, width, height } = result;

        // Which zone, T=0, R=1, B=2, L=3 the result is in
        me.lastAlignSpec.zone = result.zone;

        // If the alignment specified that we must constrain a dimension in order to
        // fit within our constrainTo, then obey that. If we own a Scroller, then
        // inform it that we do now need to scroll that dimension.
        // These conditions are released upon each alignment call because conditions may change.
        if (height != startHeight) {
            if (!('configuredHeight' in me)) {
                me.configuredHeight = element.style.height;
            }
            me.height = height / scale;
            me.alignConstrained = me.alignConstrained | 1;
            if (scrollable) {
                scrollable.overflowY = true;
            }
        }
        if (width != startWidth) {
            if (!('configuredWidth' in me)) {
                me.configuredWidth = element.style.width;
            }
            me.width = width / scale;
            me.alignConstrained = me.alignConstrained | 2;
            if (scrollable) {
                scrollable.overflowX = scrollable.clientWidth > scrollable.scrollWidth;
            }
        }

        // If either dimension has been constrained, we may have changed shape
        // due to text wrapping/overflowing, so we have to realign at the
        // successful align setting.
        if (align && me.alignConstrained) {
            spec.align    = align;
            const newResult = Rectangle.from(element, me.positioned ? element.offsetParent : null, true).alignTo(spec);

            anchor = newResult.anchor;
            x      = newResult.x;
            y      = newResult.y;
            width  = newResult.width;
            height = newResult.height;
        }

        me.setXY(x, y);

        // Class indicates which edge of the target this is aligned to: 0, 1, 2, or 3 (TRBL)
        if (isFinite(result.zone)) {
            element.classList.add(alignedClass[result.zone]);
        }

        // If we asked it to also calculate our anchor position, position our anchor.
        // If we're not edge-to-edge aligned with our target, we cannot anchor.
        if (anchor?.edge) {
            const
                { edge }           = anchor,
                { anchorElement }  = me,
                elRect             = Rectangle.from(element),
                colorMatchPoint    = [];

            // Make the anchor color match the color of the closest adjacent element
            if (edge === 'top' || edge === 'bottom') {
                colorMatchPoint[0] = anchor.x;
                colorMatchPoint[1] = edge === 'top' ? 1 : elRect.height - 1;
            }
            else {
                colorMatchPoint[0] = edge === 'left' ? 1 : elRect.width - 1;
                colorMatchPoint[1] = anchor.y;
            }
            let colourSource = DomHelper.childFromPoint(element, ...colorMatchPoint);

            if (colourSource) {
                let fillColour = DomHelper.getStyleValue(colourSource, 'background-color');

                while (fillColour.match(isTransparent) && DomHelper.getStyleValue(colourSource, 'position') !== 'absolute') {
                    colourSource = colourSource.parentNode;
                    fillColour = DomHelper.getStyleValue(colourSource, 'background-color');
                }
                if (fillColour.match(isTransparent)) {
                    me.anchorPathElement.setAttribute('fill', me.defaultAnchorBackgroundColor);
                }
                else {
                    me.anchorPathElement.setAttribute('fill', fillColour);
                }
            }

            anchorElement.classList.remove('b-hide-display');
            anchorElement.style.transform = '';
            anchorElement.className       = `b-anchor b-anchor-${edge}`;

            // Anchor's position needs boosting if we are scaled down
            anchor.x && (anchor.x /= scale);
            anchor.y && (anchor.y /= scale);

            DomHelper.setTranslateXY(anchorElement, anchor.x, anchor.y);
            element.classList.add('b-anchored');
        }
        else if (me._anchorElement) {
            me.anchorElement.classList.add('b-hide-display');
            element.classList.remove('b-anchored');
        }

        // If we are to hide on scroll, we still need to know if the element we are
        // aligned to moves. If we have not been *explicitly* aligned to an element,
        // Use the element at our display position. For example, when a context menu
        // is shown on a grid header, then is the grid header is moved by a scroll
        // event, then we must hide.
        if (me.scrollAction === 'hide' && !aligningToElement) {
            // Our element is over the X, Y point now,
            // elementFromPoint must "see through" it.
            element.style.pointerEvents = 'none';
            const el = DomHelper.elementFromPoint(x, y);

            // If we own the element at the point, it means we are already visible
            // and have visible descendants, so we must not update the anchoredTo
            if (!me.owns(el)) {
                me.anchoredTo = el;
            }
            element.style.pointerEvents = '';
        }

        // If we're aligning to an element, then listen for scrolls so that we can remain aligned.
        // Scrolls can be instigated with no mousedown, so transient floating Widgets can be put
        // out of alignment by scrolls.
        if ((me.scrollAction === 'realign' && aligningToElement || me.scrollAction === 'hide') && !me.documentScrollListener) {
            // Firefox requires a longer timeout to not autohide as the result of a scroll event firing during Menu show
            me.clearTimeout(me.scrollListenerTimeout);
            me.scrollListenerTimeout = me.setTimeout(() => {
                me.documentScrollListener = true;
                document.addEventListener('scroll', me.doHideOrRealign, true);
            }, me.scrollAction === 'hide' ? me.ignoreScrollDuration : 0);
        }

        // If alignment specified monitorResize add a resize listener to the target so we can stay aligned.
        if (aligningToElement && spec.monitorResize && !me.targetResizeListener) {
            ResizeMonitor.addResizeListener(target, me.callRealign);
            me.targetResizeListener = true;
        }

        // Don't try to listen for window resizes to try realigning on Android.
        // That just means the keyboard has been shown.
        if (!BrowserHelper.isAndroid) {
            if (!me.constrainListeners && !(constrainTo instanceof Rectangle)) {
                // Always observe for changes to window size since aligned things
                // will possibly be out of place after a window resize
                me.clearTimeout(me.resizeListenerTimeout);
                me.resizeListenerTimeout = me.setTimeout(() => {
                    me.constrainListeners = true;
                    ResizeMonitor.addResizeListener(constrainTo || window, me.callRealign);
                }, me.ignoreScrollDuration);
            }
        }
    }

    realign(el) {
        const me = this;

        if (me.isVisible && (me.floating || me.positioned) && me.lastAlignSpec) {
            const target = me.lastAlignSpec.target;

            // If there was a DOM mutation which caused our target to become not layed out, or the target
            // is outside of the passed element's rectangle (passed from scroll handler), we must hide
            if (target && target.nodeType === Element.ELEMENT_NODE) {
                // It might occur that target gets detached from DOM in IE11
                if (BrowserHelper.isIE11 && !isInDocument(target)) {
                    return me.hide();
                }

                const
                    targetWidget    = Widget.fromElement(target),
                    targetRect      = Rectangle.from(target),
                    targetIsVisible = (!targetWidget || targetWidget.isVisible) && DomHelper.isVisible(target);

                // We can align to an element which has a zero dimension, but the
                // intersection check requires that both dimensions are non-zero.
                targetRect.minHeight = targetRect.minWidth = 1;
                if (target !== document.body && !targetIsVisible ||
                    el && el.nodeType === Element.ELEMENT_NODE && el.contains(target) && !Rectangle.from(el).intersect(targetRect)) {
                    return me.hide();
                }
            }
            DomHelper.addTemporaryClass(me.element, 'b-realigning', 300);
            me.alignTo(me.lastAlignSpec);
        }
    }

    /**
     * Returns the specified bounding rectangle of this widget.
     * @param {String} [which] By default, the rectangle returned is the bounding rectangle that contains the `element`
     * border. Pass any of these values to retrieve various rectangle:
     *  - `'border'` to get the {@link Core.helper.util.Rectangle#function-from-static border rectangle} (the default).
     *  - `'client'` to get the {@link Core.helper.util.Rectangle#function-client-static client rectangle}.
     *  - `'content'` to get the {@link Core.helper.util.Rectangle#function-content-static content rectangle}.
     *  - `'inner'` to get the {@link Core.helper.util.Rectangle#function-inner-static inner rectangle}.
     *  - `'outer'` to get the {@link Core.helper.util.Rectangle#function-outer-static outer rectangle}.
     * @param {HTMLElement} [relativeTo] Optionally, a parent element in whose space to calculate the Rectangle.
     * @param {Boolean} [ignorePageScroll=false] Use browser viewport based coordinates.
     * @returns {Core.helper.util.Rectangle}
     * @internal
     */
    rectangle(which, relativeTo, ignorePageScroll) {
        if (typeof which !== 'string') {
            ignorePageScroll = relativeTo;
            relativeTo = which;
            which = '';
        }
        else if (which === 'border') {
            which = '';
        }
        // which is locked in

        if (typeof relativeTo === 'boolean') {
            ignorePageScroll = relativeTo;
            relativeTo = null;
        }

        return Rectangle[which || 'from'](this.element, relativeTo, ignorePageScroll);
    }

    releaseSizeConstraints() {
        const me       = this,
            scroller = me.scrollable;

        // Release constraints so we can align from scratch each time.
        if (me.alignConstrained & 1) {
            me.height = me.configuredHeight;
            if (scroller) {
                scroller.overflowY = scroller.config.overflowY;
            }
        }
        if (me.alignConstrained & 2) {
            me.width = me.configuredWidth;
            if (scroller) {
                scroller.overflowX = scroller.config.overflowX;
            }
        }
        me.alignConstrained = 0;
    }

    /**
     * Only valid for {@link #config-floating} Widgets. Moves to the front of the visual stacking order.
     * @category Float & align
     */
    toFront() {
        const
            { element } = this,
            parent      = this.floating ? this.floatRoot : this.positioned ? element?.parentNode : null;

        //<debug>
        if (!parent) {
            throw new Error('Only floating or positioned Widgets can use toFront');
        }
        //</debug>
        if (element && element.nextSibling) {
            const r = this._toFrontRange || (this._toFrontRange = document.createRange());

            // Instead of moving this element (which may contain focus and therefore should not be moved),
            // Lasso all following nodes using a range and insert them before this.
            // If it contained focus, appending it triggers a focusOut event which will not be expected.
            r.setStartBefore(element.nextSibling);
            r.setEndAfter(parent.lastElementChild);
            parent.insertBefore(r.extractContents(), element);
        }
    }

    //endregion

    //region Getters/setters

    updateRef(ref) {
        this.element.dataset.ref = ref;
    }

    set clippedBy(clippedBy) {
        this._clippedBy = Array.isArray(clippedBy) ? clippedBy : clippedBy ? [clippedBy] : null;
    }

    get clippedBy() {
        const clippedBy = this._clippedBy;

        if (clippedBy?.length > 0) {
            let
                result = Rectangle.from(clippedBy?.[0], null, true), i;

            for (i = 1; i < clippedBy.length; i++) {
                result = result.intersect(Rectangle.from(clippedBy?.[i], null, true));
            }
            return result;
        }
    }

    /**
     * The child element which scrolls if any. This means the element used by the {@link #config-scrollable}.
     * @property {HTMLElement}
     * @readonly
     * @category DOM
     */
    get overflowElement() {
        return this.contentElement;
    }

    get maxHeightElement() {
        return this.element;
    }

    changeAlign(align) {
        return (typeof align === 'string') ? { align } : align;
    }

    changeScrollable(scrollable, oldScrollable) {
        if (typeof scrollable === 'boolean') {
            scrollable = {
                overflowX : scrollable,
                overflowY : scrollable
            };
        }

        if (scrollable) {
            //<debug>
            if (scrollable.constructor.name !== 'Object') {
                throw new Error('scrollable config must be an {overflowX: <boolean>, overflowY: <boolean>} object, or a boolean');
            }
            //</debug>

            scrollable.element = this.overflowElement;
            scrollable.widget = this;

            if (!scrollable.isScroller) {
                scrollable = oldScrollable ? oldScrollable.setConfig(scrollable) : new this.scrollerClass(scrollable);
            }

            // Keep overflow indicator classes in sync
            scrollable.syncOverflowState();
        }
        // Destroy the old scroller if the scroller is being nulled.
        else {
            oldScrollable?.destroy();
        }

        return scrollable;
    }

    /**
     * Get/set HTML to display. When specifying HTML, this widget's element will also have the
     * {@link #config-htmlCls} added to its classList, to allow targeted styling.
     * @property {String}
     * @category DOM
     */
    get html() {
        // Maintainer, we cannot use a ternary here, we need the this.initializingElement test to shortcut
        // to the true case to return the _html property to avoid infinite loops.
        if (this.initializingElement || !this.element) {
            return this.content || this._html;
        }

        return this.contentElement.innerHTML;
    }

    updateHtml(html) {
        const
            me         = this,
            isClearing = (html == null),
            {
                element,
                contentElement,
                htmlCls
            }          = me;

        if (element) {
            const anchorEl = (contentElement === element) && me._anchorElement;

            // Flag class that we are an HTML carrying element
            if (htmlCls) {
                // IE11 doesn't support multiple arguments
                // Salesforce doesn't support passing array
                htmlCls.values.forEach(value => element.classList[isClearing ? 'remove' : 'add'](value));
            }

            // Setting innerHTML destroys the anchorElement in some browsers
            // so we must temporarily remove it to preserve it.
            // Only if the contentElement is the main element.
            if (anchorEl) {
                me.element.removeChild(anchorEl);
            }

            if (html && typeof html === 'object') {
                DomSync.sync({
                    domConfig     : html,
                    targetElement : me.contentElement,
                    onlyChildren  : true
                });
            }
            else {
                me.contentElement.innerHTML = isClearing ? '' : html;
            }

            if (anchorEl) {
                element.appendChild(anchorEl);
            }

            if (me.isComposable) {
                me.recompose();
            }
            else if (me.floating || me.positioned) {
                // Must realign because content change might change dimensions
                if (!me.isAligning) {
                    me.realign();
                }
            }
        }
    }

    updateContent(html) {
        const
            me                  = this,
            isClearing           = (html == null),
            { element, htmlCls } = me;

        if (element) {
            const { contentRange } = me;

            // Flag class that we are an HTML carrying element
            if (htmlCls) {
                // IE11 doesn't support multiple arguments
                // Salesforce doesn't support passing array
                htmlCls.values.forEach(value => element.classList[isClearing ? 'remove' : 'add'](value));
            }

            // Only works if we are in the DOM
            if (isInDocument(element)) {
                // Replace the contents of our content range with the new content
                contentRange.deleteContents();
                if (!isClearing) {
                    contentRange.insertNode(DomHelper.createElementFromTemplate(html, {
                        fragment : true
                    }));
                }
            }
            else {
                me.contentElement.innerHTML = html;
            }

            // Cache in case it gets collapsed
            me.contentRangeStartOffset = contentRange.startOffset;
            me.contentRangeEndOffset = contentRange.endOffset;

            // Must realign because content change might change dimensions
            if ((me.floating || me.positioned) && !me.isAligning) {
                me.realign();
            }
        }
    }

    onThemeChange() {
        // If we have a *visible* anchor element, then a theme change may
        // invalidate it's size or this.defaultAnchorBackgroundColor, so a
        // run through realign (and get anchorSize) will fix that.
        if (this.anchorElement?.offsetParent) {
            this._anchorSize = null;
            this.realign();
        }
    }

    /**
     * Returns an `[x, y]` array containing the width and height of the anchor arrow used when
     * aligning this Widget to another Widget or element.
     *
     * The height is the height of the arrow when pointing upwards, the width is the width
     * of the baseline.
     * @property {Number[]}
     * @category Float & align
     */
    get anchorSize() {
        const me = this;

        let result = this._anchorSize;

        if (!result) {
            // TODO: Move the anchoring scheme to the Panel class when we have it.
            // These values will be in the SASS and styled into the SVG through the Panel's theme.
            const
                borderWidth   = parseFloat(DomHelper.getStyleValue(me.element, 'border-top-width')),
                borderColour  = DomHelper.getStyleValue(me.element, 'border-top-color'),
                anchorElement = me.anchorElement,
                { className } = anchorElement,
                svgEl         = anchorElement.firstElementChild,
                pathElement   = me.anchorPathElement = svgEl.lastElementChild,
                hidden        = me._hidden;

            // In case we are measuring after the size has been invalidated (such as via theme change)
            // and the widget is shown and aligned left or right. We must measure it in top alignment
            // so as to get the dimensions the right way round.
            anchorElement.className = 'b-anchor b-anchor-top';

            let backgroundColour = DomHelper.getStyleValue(me.contentElement, 'background-color');

            // If the background colour comes through from the outer element, use that.
            if (backgroundColour.match(isTransparent)) {
                backgroundColour = DomHelper.getStyleValue(me.element, 'background-color');
            }
            me.defaultAnchorBackgroundColor = backgroundColour;

            result                = anchorElement.getBoundingClientRect();
            const [width, height] = result = me._anchorSize = [result.width, result.height];

            // Restore orientation
            anchorElement.className = className;

            svgEl.setAttribute('height', height + borderWidth);
            svgEl.setAttribute('width', width);
            pathElement.setAttribute('d', `M0,${height}L${width / 2},0.5L${width},${height}`);
            if (borderWidth) {
                pathElement.setAttribute('stroke-width', borderWidth);
                pathElement.setAttribute('stroke', borderColour);
            }
            result[1] -= borderWidth;

            if (hidden) {
                me.element.classList.add('b-hidden');
            }

            if (!me.themeChangeListener) {
                me.themeChangeListener = GlobalEvents.on({
                    theme   : 'onThemeChange',
                    thisObj : me
                });
            }

            // Reset to default in case it has been positioned by a coloured header
            me.anchorPathElement.setAttribute('fill', me.defaultAnchorBackgroundColor);
        }

        return result;
    }

    get anchorElement() {
        const me = this;

        if (!me._anchorElement) {
            const
                useFilter = me.floating && !(BrowserHelper.isIE11 || BrowserHelper.isEdge),
                filterId  = `${me.id}-shadow-filter`;

            me._anchorElement = DomHelper.createElement({
                parent    : me.element,
                className : 'b-anchor b-anchor-top',
                children  : [{
                    tag      : 'svg',
                    ns       : 'http://www.w3.org/2000/svg',
                    version  : '1.1',
                    class    : 'b-pointer-el',
                    children : [useFilter
                        ? {
                            tag      : 'defs',
                            children : [{
                                tag      : 'filter',
                                id       : filterId,
                                children : [{
                                    tag             : 'feDropShadow',
                                    dx              : 0,
                                    dy              : -1,
                                    stdDeviation    : 1,
                                    'flood-opacity' : 0.2
                                }]
                            }]
                        }
                        : null, {
                        tag                         : 'path',
                        [useFilter ? 'filter' : ''] : `url(#${filterId})`
                    }]
                }]
            });
        }

        return me._anchorElement;
    }

    updateAnchor(anchor) {
        if (this._anchorElement) {
            this._anchorElement.classList[anchor ? 'remove' : 'add']('b-hide-display');
        }
    }

    updateDraggable(draggable) {
        const
            me          = this,
            { element } = me;

        if (draggable) {
            me.dragEventDetacher = EventHelper.addListener({
                element,
                dragstart : 'onWidgetDragStart',
                dragend   : 'onWidgetDragEnd',
                thisObj   : me
            });

            me.dragDetacher = EventHelper.on({
                element,
                mousedown(event) {
                    const
                        { target }    = event,
                        closestWidget = Widget.fromElement(target);

                    // Fix for FF draggable bug https://bugzilla.mozilla.org/show_bug.cgi?id=1189486
                    if (!DomHelper.up(event.target, '.b-field-inner') &&
                        // Only allow drag to start when the action originates from the widget element itself,
                        // or one of its toolbars. https://github.com/bryntum/support/issues/3214
                        closestWidget === this || (this.strips && Object.values(this.strips).includes(closestWidget))) {
                        element.setAttribute('draggable', 'true');
                    }
                },
                // Only needed for automatic listener removal on the destroy of the thisObj
                thisObj : me
            });
        }
        else {
            me.dragEventDetacher?.();
            me.dragOverEventDetacher?.();
            me.dragDetacher?.();
        }
    }

    onWidgetDragStart(e) {
        const
            me          = this,
            { element } = me;

        if (!me.validateDragStartEvent(e)) {
            return;
        }

        // Opt out of auto-alignment on scroll or DOM mutation.
        me.removeTransientListeners();

        const
            dragStartX           = e.clientX,
            dragStartY           = e.clientY,
            scrollingPageElement = (document.scrollingElement || document.body),
            widgetX              = me.getXY()[0],
            widgetY              = me.getXY()[1],
            dragListeners        = {
                element : me.rootElement,

                // Position using direct DOM access, do not go though the setXY method which clears
                // any centered config. User dragging only moves this show of the widget. Upon next
                // neutral show (with no extra positioning info), a centered widget will show centered again.
                dragover : event => {
                    // Centered adds positioning rules, it can't be centered during drag.
                    element.classList.remove('b-centered');
                    DomHelper.setTranslateXY(element, widgetX + event.clientX - dragStartX - scrollingPageElement.scrollLeft,
                        widgetY + event.clientY - dragStartY - scrollingPageElement.scrollTop);
                }
            };

        // Stop viewport panning on drag on touch devices
        if (BrowserHelper.isTouchDevice) {
            dragListeners.touchmove = e => e.preventDefault();
        }

        me.floatRoot.appendChild(me.dragGhost);

        me.setDragImage(e);

        // Prevent special cursor from being shown
        e.dataTransfer.effectAllowed = 'none';

        me.dragOverEventDetacher = EventHelper.addListener(dragListeners);

        // Various app events (Such as resize or visible child count change) can
        // cause a request to realign, so opt out of anchoring and alignedness
        // until we are next hidden.
        me.alignTo();
    }

    /**
     * Validates a `dragstart` event with respect to the target element. Dragging is not normally
     * initiated when the target is interactive such as an input field or its label, or a button.
     * This may be overridden to provide custom drag start validation.
     * @param {DragEvent} e The `dragstart` event to validate.
     * @returns {Boolean} Return `true` if the drag is to be allowed.
     * @internal
     */
    validateDragStartEvent(e) {
        const
            me                 = this,
            { element }        = me,
            actualTarget       = DomHelper.elementFromPoint(e.clientX, e.clientY), // Can't be resolved from the event :/
            { handleSelector } = me.draggable;

        if (handleSelector) {
            const blacklist = negationPseudo.exec(handleSelector)[1]; // Extract the content of :not()

            // If the selector was :not(), then if we are a descendant of a matching element, it's a no-drag
            if (blacklist) {
                if (actualTarget.closest(`#${element.id} ${blacklist}`)) {
                    e.preventDefault();
                    return false;
                }
            }
            // If we are not the descendant of a matching element, it's a no-drag
            else if (!actualTarget.closest(`#${element.id} ${handleSelector}`)) {
                e.preventDefault();
                return false;
            }
        }
        return true;
    }

    setDragImage(e) {
        if (e.dataTransfer.setDragImage) {
            // Firefox requires this to be called before setDragImage
            e.dataTransfer.setData('application/node type', '');

            // Override the default HTML5 drag ghost and just drag an empty node.
            // The large offset will cause it to be displayed offscreen on platforms
            // which will not hide drag images (iOS)
            e.dataTransfer.setDragImage(this.dragGhost, -9999, -9999);
        }
    }

    onWidgetDragEnd() {
        this.dragGhost.remove();
        this.dragOverEventDetacher();

        this.element.removeAttribute('draggable');
    }

    changeFloating(value) {
        // Coerce all to boolean so that we have a true/false value
        return Boolean(value);
    }

    //<debug>
    updateFloating(floating, was) {
        if (!this.isConfiguring) {
            throw new Error('Cannot set floating dynamically until the render pathway is fixed');
        }
        if (was) {
            // Unfloating SHOULD move a Widget back into its owner Container's contentEl.
            throw new Error('Cannot unfloat a Widget until we have the concept of Widget ownership and containment');
        }
    }
    //</debug>

    changePositioned(value) {
        // Coerce all to boolean so that we have a true/false value
        return Boolean(value);
    }

    updatePositioned(positioned) {
        this.element.classList[positioned ? 'add' : 'remove']('b-positioned');
    }

    getXY() {
        return [
            DomHelper.getPageX(this.element),
            DomHelper.getPageY(this.element)
        ];
    }

    /**
     * Moves this Widget to the x,y position. Both arguments can be omitted to just set one value.
     *
     * *For {@link #config-floating} Widgets, this is a position in the browser viewport.*
     * *For {@link #config-positioned} Widgets, this is a position in the element it was rendered into.*
     *
     * @param {Number} [x]
     * @param {Number} [y]
     * @category Float & align
     */
    setXY(x, y) {
        const me = this;

        if (me.floating || me.positioned) {
            if (x != null) {
                me._x       = x;
                me.centered = false;
            }
            if (y != null) {
                me._y       = y;
                me.centered = false;
            }
            DomHelper.setTranslateXY(me.element, me._x || 0, me._y || 0);
        }
        //<debug>
        else {
            throw new Error('Inline widgets cannot set position');
        }
        //</debug>
    }

    /**
     * Moves this Widget to the desired x position.
     *
     * Only valid if this Widget is {@link #config-floating} and not aligned or anchored to an element.
     * @property {Number} x
     * @type {Number}
     * @category Float & align
     */
    get x() {
        return this.getXY()[0];
    }

    changeX(x) {
        this.setXY(x);
    }

    /**
     * Moves this Widget to the desired y position.
     *
     * Only valid if this Widget is {@link #config-floating} and not aligned or anchored to an element.
     * @property {Number} y
     * @type {Number}
     * @category Float & align
     */
    get y() {
        return this.getXY()[1];
    }

    changeY(y) {
        this.setXY(null, y);
    }

    /**
     * Get elements offsetWidth or sets its style.width, or specified width if element not created yet.
     * @property {Number|String}
     * @category Layout
     */
    get width() {
        const
            me      = this,
            element = me.element;

        if (me.monitorResize) {
            // If the width is invalid, read it now.
            if (me._width == null) {
                me._width = element.offsetWidth;
            }

            // Usually this will be set in onInternalResize
            return me._width;
        }
        // No monitoring, we have to measure;
        return element.offsetWidth;
    }

    changeWidth(width) {
        DomHelper.setLength(this.element, 'width', width);

        // Invalidate the width, so it will be read from the DOM if a read is requested before the resize event
        this._width = null;

        // Setting width explicitly should reset flex, since it's not flexed anymore
        this._flex              = null;
        this.element.style.flex = '';
    }

    /**
     * Get/set elements maxWidth. Getter returns max-width from elements style, which is always a string. Setter accepts
     * either a String or a Number (which will have 'px' appended). Note that like {@link #config-width},
     * _reading_ the value will return the numeric value in pixels.
     * @property {String|Number}
     * @category Layout
     */
    get maxWidth() {
        return DomHelper.measureSize(this.element.style.maxWidth, this.element);
    }

    updateMaxWidth(maxWidth) {
        DomHelper.setLength(this.element, 'maxWidth', maxWidth);
    }

    /**
     * Get/set elements minWidth. Getter returns min-width from elements style, which is always a string. Setter accepts
     * either a String or a Number (which will have 'px' appended). Note that like {@link #config-width},
     * _reading_ the value will return the numeric value in pixels.
     * @property {String|Number}
     * @category Layout
     */
    get minWidth() {
        return DomHelper.measureSize(this.element.style.minWidth, this.element);
    }

    updateMinWidth(minWidth) {
        DomHelper.setLength(this.element, 'minWidth', minWidth);
    }

    updateFlex(flex) {
        // Width must be processed first, because its changer clears flex because flex wins over width;
        // The assumption that the containing element's flex-direction is 'row'
        // seems dodgy.
        this.getConfig('width');

        // Default grow to the same as flex and basis to 0.
        if (typeof flex === 'number' || !isNaN(flex)) {
            flex = `${flex} ${flex}`;
        }

        this.element.style.flex  = flex;
        this.element.style.width = '';
    }

    updateAlignSelf(alignSelf) {
        this.element.style.alignSelf = alignSelf;
    }

    updateMargin(margin) {
        // Convert eg 1 to "1px 1px 1px 1px" or "0 8px" to "0px 8px 0px 8px"
        this.element.style.margin = this.parseTRBL(margin).join(' ');
    }

    updateTextAlign(align, oldAlign) {
        oldAlign && this.element.classList.remove(`b-text-align-${oldAlign}`);
        this.element.classList.add(`b-text-align-${align}`);
    }

    updatePlaceholder(placeholder) {
        if (this.input) {
            if (placeholder == null) {
                this.input.removeAttribute('placeholder');
            }
            else {
                this.input.placeholder = placeholder;
            }
        }
    }

    /**
     * Get element's offsetHeight or sets its style.height, or specified height if element no created yet.
     * @property {Number|String}
     * @category Layout
     */
    get height() {
        const me      = this,
            element = me.element;

        if (me.monitorResize) {
            // If the height is invalid, read it now.
            if (me._height == null) {
                me._height = element.offsetHeight;
            }

            // Usually this will be set in onInternalResize
            return me._height;
        }
        // No monitoring, we have to measure;
        return element.offsetHeight;
    }

    changeHeight(height) {
        DomHelper.setLength(this.element, 'height', height);

        // Invalidate the height, so it will be read from the DOM if a read is requested before the resize event
        this._height = null;
    }

    /**
     * Get/set element's maxHeight. Getter returns max-height from elements style, which is always a string. Setter
     * accepts either a String or a Number (which will have 'px' appended). Note that like {@link #config-height},
     * _reading_ the value will return the numeric value in pixels.
     * @property {String|Number}
     * @category Layout
     */
    get maxHeight() {
        return DomHelper.measureSize(this.maxHeightElement.style.maxHeight, this.element);
    }

    updateMaxHeight(maxHeight) {
        const
            me          = this,
            { element } = me;

        DomHelper.setLength(me.maxHeightElement, 'maxHeight', maxHeight);

        // Flexbox does not handle overflow correctly when a vertically
        // flexed item is constrained by the maxHeight of its containing el.
        // So we have to propagate the maxHeight from the encapsulating element
        // onto the contentElement.
        if (BrowserHelper.isIE11 && me.contentElement !== element) {
            if (maxHeight == null) {
                ResizeMonitor.removeResizeListener(element, me.boundMaxHeightBugHandler);
            }
            else {
                ResizeMonitor.addResizeListener(element, me.boundMaxHeightBugHandler || (me.boundMaxHeightBugHandler = me.fixIEMaxHeightBug.bind(me)));
                if (document.body.contains(element)) {
                    me.fixIEMaxHeightBug();
                }
            }
        }
    }

    fixIEMaxHeightBug() {
        const { element, contentElement } = this;

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
                if (sibling !== contentElement && !sibling.classList.contains('b-resize-monitors')) {
                    availableHeight -= sibling.offsetHeight;
                }
            }

            // Apply the adjusted height constraint to the contentElement
            this.contentElement.style.maxHeight = `${availableHeight}px`;
        }
    }

    /**
     * Get/set element's minHeight. Getter returns min-height from elements style, which is always a string. Setter
     * accepts either a String or a Number (which will have 'px' appended). Note that like {@link #config-height},
     * _reading_ the value will return the numeric value in pixels.
     * @property {String|Number}
     * @category Layout
     */
    get minHeight() {
        return DomHelper.measureSize(this.element.style.minHeight, this.element);
    }

    updateMinHeight(minHeight) {
        DomHelper.setLength(this.element, 'minHeight', minHeight);
    }

    updateDisabled(disabled) {
        const
            me      = this,
            el      = me.element,
            focusEl = me.focusElement;

        me.trigger('beforeUpdateDisabled', { disabled });

        disabled && me.revertFocus();

        if (el) {
            el.classList[disabled ? 'add' : 'remove']('b-disabled');

            if (focusEl) {
                focusEl.disabled = disabled;
            }
        }

        me.onDisabled(disabled);
    }

    /**
     * Called when disabled state is changed.
     * Override in subclass that needs special handling when being disabled.
     * @param {Boolean} disabled current state
     * @private
     */
    onDisabled(disabled) {
    }

    /**
     * Disable the widget
     */
    disable() {
        this.disabled = true;
    }

    /**
     * Enable the widget
     */
    enable() {
        this.disabled = false;
    }

    /**
     * Requests fullscreen display for this widget
     * @returns {Promise} A Promise which is resolved with a value of undefined when the transition to full screen is complete.
     */
    requestFullscreen() {
        const
            me     = this,
            // If we are floating, target the float root as the fullscreen element
            result = Fullscreen.request(me.floating ? me.floatRoot : me.element);

        Fullscreen.onFullscreenChange(me.onFullscreenChange);

        if (!me.floating) {
            me.floatRoot._oldParent = me.floatRoot.parentElement;
            me.element.appendChild(me.floatRoot);
        }

        return result;
    }

    /**
     * Exits fullscreen mode
     * @returns {Promise} A Promise which is resolved once the user agent has finished exiting full-screen mode
     */
    exitFullscreen() {
        return Fullscreen.exit();
    }

    onFullscreenChange() {
        if (!Fullscreen.isFullscreen) {
            this.onExitFullscreen();
        }
    }

    onExitFullscreen() {
        const me = this;

        Fullscreen.unFullscreenChange(me.onFullscreenChange);

        // When exiting fullscreen mode or when this widget is destroyed, give floatRoot back to its old parent
        if (!me.floating && me._rootElement?.floatRoot?._oldParent) {
            me.floatRoot._oldParent.appendChild(me.floatRoot);
            me.floatRoot._oldParent = null;
        }
    }

    /**
     * Get/set a tooltip on the widget. Accepts a string or tooltip config (specify true (or 'true') to use placeholder
     * as tooltip). When using a string it will configure the tooltip with `textContent: true` which enforces a default
     * max width.
     *
     * By default, this uses a singleton Tooltip instance which may be accessed from the
     * `{@link Core.widget.Widget Widget}` class under the name `Widget.tooltip`.
     * This is configured according to the config object on pointer over.
     *
     * To request a separate instance be created just for this widget, add `newInstance : true`
     * to the configuration.
     *
     * @property {String|Object}
     * @category Misc
     */
    get tooltip() {
        if (this._tooltip) {
            return this._tooltip;
        }
        else {
            const tooltip = Widget.Tooltip?.getSharedTooltip(this.rootElement);

            // If the shared tooltip is currently in use by us, return it.
            // If it's not in use by us, we don't have a tooltip.
            if (tooltip && tooltip.activeTarget === this._element && tooltip.isVisible) {
                return tooltip;
            }
        }
    }

    //noinspection JSAnnotator
    changeTooltip(tooltip, oldTooltip) {
        const me = this;

        if (tooltip) {
            if (!(me.preventTooltipOnTouch && BrowserHelper.isTouchDevice)) {
                if (!tooltip.isTooltip && tooltip.constructor.name !== 'Object') {
                    tooltip = {
                        html        : (typeof tooltip === 'string') ? tooltip : me.placeholder,
                        textContent : true
                    };
                }

                // We have to explicitly request a new instance to avoid spam Tooltip instances.
                // If there is an incoming oldTooltip, then we own a newInstance.
                // TODO verify .isTooltip check is needed
                if (oldTooltip?.isTooltip || tooltip.newInstance) {
                    tooltip.type = 'tooltip';

                    if (!tooltip.forElement) tooltip.forElement = me.element;
                    if (!('showOnHover' in tooltip) && !tooltip.forSelector) tooltip.showOnHover = true;
                    if (!('autoClose' in tooltip)) tooltip.autoClose = true;

                    tooltip = Widget.reconfigure(oldTooltip, tooltip, me);
                }
                // The default is that tooltip content and configs from tipConfig
                else {
                    me.element.dataset.btip = true;
                    me.tipConfig            = tooltip;

                    // We do not set our property if we are sharing the singleton
                    return;
                }
            }
        }
        else {
            // If there is an incoming oldTooltip, then we own a newInstance.
            // Only destroy it if it's being set to null. Empty string
            // just means clear its content.
            if (oldTooltip) {
                if (tooltip == null && oldTooltip.isTooltip) {
                    oldTooltip.destroy();
                }
                else {
                    // We do not update the property if we are just clearing its content
                    oldTooltip.html = null;
                    return;
                }
            }
            // We are sharing, so just clear the btip
            else {
                delete me.element.dataset.btip;
            }
        }

        return tooltip;
    }

    get tooltipText() {
        const tooltip = this._tooltip;

        if (tooltip) {
            return tooltip.isTooltip ? tooltip.contentElement.innerText : typeof tooltip === 'string' ? tooltip : tooltip.html;
        }
        else if (this.tipConfig) {
            return this.tipConfig.html;
        }
    }

    /**
     * Determines visibility by checking if the Widget is hidden, or any ancestor is hidden and that it has an
     * element which is visible in the DOM
     * @property {Boolean}
     * @category Visibility
     * @readonly
     */
    get isVisible() {
        const
            me          = this,
            { element } = me;

        // If we are hidden, or destroying, or any ancestors are hidden, we're not visible
        return Boolean(element && !me._hidden && !me.isDestroying && isInDocument(element) &&
            (!me.requireSize || hasLayout(element)) &&
            (!me.owner || me.owner.isVisible)
        );
    }

    /**
     * Focuses this widget if it has a focusable element.
     */
    focus() {
        if (this.isFocusable) {
            DomHelper.focusWithoutScrolling(this.focusElement);
        }
    }

    /**
     * Get this widget's primary focus holding element if this widget is itself focusable, or contains focusable widgets.
     * @property {HTMLElement}
     * @readonly
     * @category DOM
     */
    get focusElement() {
        // Override in widgets which are focusable.
    }

    get isFocusable() {
        const focusElement = this.focusElement;

        // We are only focusable if the focusEl is deeply visible, that means
        // it must have layout - an offsetParent. Body does not have offsetParent.
        return focusElement && this.isVisible && !this.disabled &&
            (focusElement === document.body || focusElement.offsetParent);
    }

    /**
     * Shows this widget
     * @category Visibility
     * @async
     * @returns {Promise} A promise which is resolved when the widget is shown
     */
    async show() {
        return new Promise(resolve => {
            const
                me = this,
                {
                    showAnimation,
                    element
                }             = me,
                { style }     = element;

            let styleProp, animProps;

            /**
             * Triggered before a widget is shown. Return `false` to prevent the action.
             * @preventable
             * @event beforeShow
             * @param {Core.widget.Widget} source The widget being shown.
             */
            if (!me.isVisible && me.trigger('beforeShow') !== false && (!me.internalBeforeShow || me.internalBeforeShow() !== false)) {
                // Cancel any current hide/show animation
                me.cancelHideShowAnimation();

                // Centered config value takes precedence over x and y configs.
                // This also ensures that widgets configured with centered: true
                // and draggable : true will show in the center on next show after
                // being dragged by the user which is the intuitive UX.
                me.updateCentered(me._centered);

                if (me.floating) {
                    const floatRoot = me.floatRoot;

                    if (!floatRoot.contains(element)) {
                        // Replace this Widget's DOM into the container if it's already rendered
                        if (me.rendered) {
                            floatRoot.appendChild(me.element);
                        }
                        else {
                            // Pass triggerPaint as false. The calls will not propagate
                            // anyway since we are still hidden.
                            me.render(floatRoot, false);
                        }
                    }

                    // Because we are outside of any owner's element, we need to see if they're scaled so
                    // that we match. See scaled examples with tooltips in API docs guides section.
                    if (style.transform.includes('scale')) {
                        me.scale = null;
                        style.transform = style.transformOrigin = '';
                    }

                    const scaledAncestor = me.closest(isScaled);
                    if (scaledAncestor) {
                        const { scale } = scaledAncestor;

                        // Our scale is the same while we are visible and owned by that scaled ancestor.
                        // Now floating descendants will follow suit.
                        me.scale = scale;
                        style.transform = `scale(${scale})`;
                        style.transformOrigin = `0 0`;
                    }
                }

                me._hidden = false;

                element.classList.remove('b-hidden');

                // The changer vetoes the config change and routes here, so we must call this.
                me.onConfigChange({
                    name   : 'hidden',
                    value  : false,
                    was    : true,
                    config : me.$meta.configs.hidden
                });

                if (showAnimation) {
                    styleProp = Object.keys(showAnimation)[0];
                    animProps = showAnimation[styleProp];

                    const currentAnimation = me.currentAnimation = {
                        styleProp,
                        resolve
                    };

                    me.isAnimating = true;

                    // afterHideShowAnimate will always be called even if the transition aborts
                    me.currentAnimation.detacher = EventHelper.onTransitionEnd({
                        element,
                        property : styleProp,
                        duration : parseDuration(animProps.duration) + 20,
                        handler  : () => me.afterHideShowAnimate(currentAnimation),
                        thisObj  : me
                    });

                    // Setting transition style initial value before showing,
                    // then reading the style to ensure transition will animate
                    style[styleProp] = animProps.from;
                    DomHelper.getStyleValue(element, styleProp);

                    style.transition = `${styleProp} ${animProps.duration} ease ${animProps.delay}`;
                    style[styleProp] = animProps.to;
                }

                me.afterShow(!showAnimation && resolve);

                // Note: popups can be dismissed in the process of focusin/out if an editor has invalidAction='block',
                // so we may be hidden at this point...

                // If we're not being called from showBy, do default aligning unless its centered
                if (!me.inShowBy && me.floating && me.forElement && !me.centered && !me.hidden) {
                    me.alignTo(me.forElement);
                }
            }
            else {
                resolve();
            }
        });
    }

    /**
     * Show aligned to another target element or {@link Core.widget.Widget} or {@link Core.helper.util.Rectangle}
     * @param {Object|HTMLElement} spec Alignment specification, or the element to align to using the configured
     * {@link #config-align}.
     * @param {HTMLElement|Core.widget.Widget|Core.helper.util.Rectangle} spec.target The Widget or Element or Rectangle to align to.
     * @param {Boolean} [spec.anchor] True to show a pointer arrow connecting to the target. Defaults to false.
     * @param {Boolean} [spec.overlap] True to allow this to overlap the target.
     * @param {String} spec.align The alignment specification string, `[trblc]n-[trblc]n`. Defaults to this instance's
     * {@link #config-align} setting.
     * @param {HTMLElement|Core.widget.Widget|Core.helper.util.Rectangle} [spec.constrainTo] The Widget or Element or Rectangle to constrain to.
     * If the requested alignment cannot be constrained (it will first shrink the resulting Rectangle according
     * to the `minWidth` and `minHeight` properties of this spec, or the Widget), then it will try aligning at other edges
     * (honouring the `axisLock` option), and pick the fallback alignment which results in the shortest translation.
     * @param {Number|Number[]} [spec.constrainPadding] The amount of pixels to pad from the `constrainTo` target,
     * either a single value, or an array of values in CSS edge order.
     * @param {Number} [spec.minHeight] The minimum height this widget may be compressed to when constraining within the `constrainTo` option.
     * @param {Number} [spec.minWidth] The minimum width this widget may be compressed to when constraining within the `constrainTo` option.
     * @param {Boolean} [spec.axisLock] Specify as `true` to fall back to aligning against the opposite
     * edge if the requested alignment cannot be constrained into the `constrainTo` option. Specify as
     * `'flexible'` to allow continuation to try the other edges if a solution cannot be found on the originally requested axis.
     * @param {Boolean} [spec.matchSize] __Only honored when `axisLock` is enabled and alignment succeeds on the requested axis.__
     * Specify as `true` to have this widget's size along the aligned edge match the size of the target's edge.
     * For example, a combobox's dropdown should match the width of the combobox.
     * @param {Number|Number[]} [spec.offset] The offset to create an extra margin round the target
     * to offset the aligned widget further from the target. May be configured as -ve to move the aligned widget
     * towards the target - for example producing the effect of the anchor pointer piercing the target.
     * @param {Boolean} [spec.monitorResize] Configure as `true` to monitor the element being aligned to for
     * resizing while visible to correct alignment.
     * @category Float & align
     * @async
     * @returns {Promise} A promise which is resolved when the widget is shown
     */
    async showBy(spec) {
        //<debug>
        if (!(this.floating || this.positioned)) {
            throw new Error('Only floating or positioned Widgets can use showBy');
        }
        //</debug>
        const me = this;

        let result;

        if (me.isVisible) {
            DomHelper.addTemporaryClass(me.element, 'b-realigning', 300);
        }
        else {
            // Prevent show from rerouting here.
            me.inShowBy  = true;
            result = me.show();
            me.inShowBy  = false;
        }

        if (me.isVisible) {
            me.alignTo(spec);
        }

        return result || immediatePromise;
    }

    /**
     * Show this widget anchored to a coordinate
     * @param {Number|Number[]} x The x position (or an array with [x,y] values) to show by
     * @param {Number} [y] The y position to show by
     * @param {Object} [options] See {@link #function-showBy} for reference
     * @category Float & align
     * @async
     * @returns {Promise} A promise which is resolved when the widget is shown
     */
    async showByPoint(x, y, options) {
        const xy = arguments.length === 1 ? x : [x, y];

        return this.showBy(Object.assign({
            position  : new Point(xy[0] + 1, xy[1] + 1),
            // Override any matchSize that we might have in our align config.
            // Otherwise we are going to be 1px wide/high
            matchSize : false,
            align     : 't-b'
        }, options));
    }

    afterShow(resolveFn) {
        const me = this;

        // This method is injected when maxHeight is set on IE11.
        // Flexbox does not handle overflow correctly when a vertically
        // flexed item is constrained by the maxHeight of its containing el.
        // So we have to propagate the maxHeight from the encapsulating element
        // onto the contentElement.
        if (me.boundMaxHeightBugHandler) {
            me.boundMaxHeightBugHandler();
        }
        /**
         * Triggered after a widget is shown.
         * @event show
         * @param {Core.widget.Widget} source The widget
         */
        me.trigger('show');

        // Cache our preferred anchoredness in case it's overridden by a drag.
        me._configuredAnchorState = me.anchor;

        // Keep any owning container informed about visibility state.
        // It may not be a Container. SubGrid class is still a Widget
        // which contains grid headers.
        me.parent?.onChildShow?.();

        me.triggerPaint();

        resolveFn && resolveFn();
    }

    triggerPaint() {
        const
            me          = this,
            { element } = me,
            firstPaint  = !me.isPainted;

        if (me.isVisible) {
            if (firstPaint) {
                // Not for public use, only used in docs
                if (me.scaleToFitWidth && !me.monitorResize) {
                    me.onParentElementResize = me.onParentElementResize.bind(me);
                    ResizeMonitor.addResizeListener(element.parentElement, me.onParentElementResize);
                    me.updateScale();
                }
            }

            // Trigger paint only on immediate children.
            // Each one will call this recursively.
            // paint is triggered in a bottom up manner.
            me.eachWidget(widgetTriggerPaint, false);

            if (firstPaint && me.isVisible) {
                me.rootElement = DomHelper.getRootElement(element);
                // Make sure the shared tooltip is initialized
                me.getConfig('tooltip');

                // Late setup of Ripple
                if (!Widget.Ripple && Widget.RippleClass) {
                    Widget.Ripple = new Widget.RippleClass({
                        rootElement : me.rootElement
                    });
                }
            }

            /**
             * Triggered when a widget which had been in a non-visible state for any reason
             * achieves visibility.
             *
             * A non-visible state *might* mean the widget is hidden and has just been shown.
             *
             * But this event will also fire on widgets when a non-visible (unrendered, or hidden)
             * ancestor achieves visibility, for example a {@link Core.widget.Popup Popup} being shown.
             *
             * TLDR: __This event can fire multiple times__
             * @event paint
             * @param {Core.widget.Widget} source The widget being painted.
             * @param {Boolean} firstPaint `true` if this is the first paint.
             */
            me.isPainted = true;

            me.trigger('paint', { firstPaint });

            if (firstPaint) {
                // On first paint, we should announce our size immediately.
                // When the real event comes along, onElementResize will reject it because the size will be the same.
                if (me.monitorResize && !me.scaleToFitWidth) {
                    ResizeMonitor.onElementResize([{ target : element }]);
                }
            }
        }
    }

    cancelHideShowAnimation() {
        const
            me                            = this,
            { currentAnimation, element } = me;

        if (currentAnimation) {
            me.isAnimating = false;

            element.classList.remove('b-hiding');

            currentAnimation.detacher();
            currentAnimation.resolve();

            element.style.transition = element.style[currentAnimation.styleProp] = '';
            me.currentAnimation = null;
        }
    }

    afterHideShowAnimate(currentAnimation) {
        // We receive the currentAnimation as understood by the party starting the animation... if that is not the
        // current value of "this.currentAnimation" we can ignore this call.
        const me = this;

        // If menu is destroyed too soon in Edge, this method will be invoked for destroyed element. Since all of our
        // properties are cleared on destroy, this check will prevent undesired reactions:
        if (currentAnimation === me.currentAnimation) {
            me.cancelHideShowAnimation();

            // Element must be fully hidden after the animation effect finishes
            if (me._hidden) {
                me.afterHideAnimation();
            }
        }
    }

    /**
     * Hide widget
     * @param {Boolean} animate Pass `true` (default) to animate the hide action
     * @category Visibility
     * @returns {Promise} A promise which is resolved when the widget has been hidden
     */
    hide(animate = true) {
        return new Promise(resolve => {
            const
                me            = this,
                { element }   = me,
                { style }     = element,
                hideAnimation = animate && me.hideAnimation;

            // If we get hidden very quickly after a call to show,
            // we must kill the timers which add the realign listeners.
            me.clearTimeout(me.scrollListenerTimeout);
            me.clearTimeout(me.resizeListenerTimeout);

            /**
             * Triggered before a widget is hidden. Return `false` to prevent the action.
             * @preventable
             * @event beforeHide
             * @param {Core.widget.Widget} source The widget being hidden.
             */
            // replaced check for isVisible with _hidden, need to hide a component not yet in view in EventEditor
            if (!me._hidden && me.trigger('beforeHide') !== false) {
                me._hidden = true;

                // The changer vetoes the config change and routes here, so we must call this.
                me.onConfigChange({
                    name   : 'hidden',
                    value  : true,
                    was    : false,
                    config : me.$meta.configs.hidden
                });

                if (!element) {
                    resolve();
                    return;
                }

                if (element.contains(DomHelper.getActiveElement(element))) {
                    me.revertFocus(true);
                }

                // Focus exit causes close if autoClose: true, and if closeAction: 'hide'
                // that might destroy us, so exit now if that happens.
                if (me.isDestroyed) {
                    resolve();
                    return;
                }

                // Cancel any current hide/show animation
                me.cancelHideShowAnimation();

                if (hideAnimation) {
                    const
                        styleProp = Object.keys(hideAnimation)[0],
                        animProps = hideAnimation[styleProp];

                    // Make sure we are not already at the final value of the hide animation (i.e. calling hide() directly after show())
                    if (Number(getComputedStyle(me.element)[styleProp]) !== animProps.to) {
                        const currentAnimation = me.currentAnimation = {
                            styleProp,
                            resolve
                        };

                        // Element must behave as though it were not there during
                        // the animated hide. This means pointer-events:none
                        element.classList.add('b-hiding');
                        me.isAnimating = true;

                        // afterHideShowAnimate will always be called even if the transition aborts
                        me.currentAnimation.detacher = EventHelper.onTransitionEnd({
                            element,
                            property : styleProp,
                            duration : parseDuration(animProps.duration) + 20,
                            handler  : () => me.afterHideShowAnimate(currentAnimation),
                            thisObj  : me
                        });

                        // Setting transition style initial value before showing,
                        // then reading the style to ensure transition will animate
                        style[styleProp] = animProps.from;
                        DomHelper.getStyleValue(element, styleProp);

                        style.transition = `${styleProp} ${animProps.duration} ease ${animProps.delay}`;
                        style[styleProp] = animProps.to;
                    }
                    else {
                        element.classList.add('b-hidden');
                    }
                }
                else {
                    element.classList.add('b-hidden');
                }

                // only supply resolve function if not using animation
                me.afterHide(!hideAnimation && resolve, hideAnimation);
            }
        });
    }

    doHideOrRealign({ target, isTrusted }) {
        const
            me         = this,
            {
                anchoredTo,
                lastAlignSpec,
                element
            }          = me,
            lastTarget = lastAlignSpec?.target,
            position   = lastAlignSpec?.position,
            activeEl   = DomHelper.getActiveElement(me),
            [x, y]     = me.getXY();

        // Scroll is inside this widget, or owned by this widget: no action
        if (target.nodeType === Node.ELEMENT_NODE && (element.contains(target) || me.owns(target))) {
            return;
        }

        // If it's a synthesized scroll event (such as from our ResizeMonitor polyfill), ignore it
        // If we're scrolling because a focused textual input field which we contain is being shifted into view,
        // we must not reposition - we'll just move with the document content.
        // event.target might be missing with LockerService enabled
        if (!isTrusted || (target?.nodeType === Element.DOCUMENT_NODE && element.contains(activeEl) && textInputTypes[activeEl] && window.innerHeight < document.body.offsetHeight)) {
            return;
        }

        // Perform the realignment. If the scroll did not in fact cause us to become unaligned, then we don't have to hide.
        me.realign(target);

        // Might destroy on hide in realign, so check for isDestroyed.
        if (!me.isDestroyed && me.scrollAction === 'hide') {
            const
                [newX, newY] = me.getXY(),
                moved        = newX !== x || newY !== y;

            // If the scroll caused our position to become invalid, and we either don't know what element
            // we're anchored to (or not anchored to one at all), or the element we're anchored to has been
            // affected by the scroll, we must hide.
            // target might be missing with LockerService enabled
            if ((moved || lastTarget?.$$name === 'Point' || position) && (!anchoredTo || target && DomHelper.isDescendant(target, anchoredTo))) {
                me.hide();
            }
        }
    }

    afterHide(resolveFn = null, hideAnimation = this.hideAnimation) {
        const
            me                = this,
            { lastAlignSpec } = me;

        // The flag must be cleared on a normal hide.
        // It's set after the hide() call in alignTo
        // if the target is outside our clippedTo region.
        if (lastAlignSpec) {
            lastAlignSpec.targetHidden = null;
        }

        // If a drag caused us to lose our anchor, restore it upon hide.
        me._anchor = me._configuredAnchorState;

        // Remove listeners which are only added during the visible phase.
        // In its own method because it's called on hide and destroy.
        me.removeTransientListeners();

        // Postprocessing to be done after the hideAnimation finishes.
        // If there's no animation, we call it immediately.
        // We set the element to be hidden here, after any animation completes.
        // We also remove floating Widgets from the DOM when they are hidden.
        if (!hideAnimation) {
            me.afterHideAnimation();
        }

        /**
         * Triggered after a widget was hidden
         * @event hide
         * @param {Core.widget.Widget} source The widget
         */
        me.trigger('hide');

        // Keep any owning container informed about visibility state.
        // It may not be a Container. SubGrid class is still a Widget
        // which contains grid headers.
        me.parent?.onChildHide?.();

        resolveFn && resolveFn();  // cannot do resolveFn?.() since resolveFn can be false
    }

    removeTransientListeners() {
        const me = this;

        me.clearTimeout(me.resizeListenerTimeout);
        me.clearTimeout(me.scrollListenerTimeout);

        if (me.documentScrollListener) {
            document.removeEventListener('scroll', me.doHideOrRealign, true);
            me.documentScrollListener = false;
        }

        if (me.targetResizeListener) {
            ResizeMonitor.removeResizeListener(me.lastAlignSpec.target, me.callRealign);
            me.targetResizeListener = false;
        }

        if (me.constrainListeners) {
            ResizeMonitor.removeResizeListener(me.lastAlignSpec.constrainTo || window, me.callRealign);
            me.constrainMutationMonitor && me.constrainMutationMonitor.disconnect();
            me.constrainListeners = false;
        }
    }

    afterHideAnimation() {
        const
            me          = this,
            { element } = me;

        if (me.floating && me.floatRoot.contains(element)) {
            element.remove();
        }
        else {
            element.classList.add('b-hidden');
        }

        // Reset anchor to its default colour after hide
        if (me.defaultAnchorBackgroundColor) {
            // Reset to default in case it has been positioned by a coloured header
            me.anchorPathElement.setAttribute('fill', me.defaultAnchorBackgroundColor);
        }
    }

    changeHidden(value) {
        const me = this;

        let ret;

        if (me.isConfiguring) {
            ret = Boolean(value);
            me.element.classList[value ? 'add' : 'remove']('b-hidden');
        }
        else {
            // These methods are async but set _hidden when they get past the before event, so don't set ret and
            // the setter won't set _hidden automatically.

            me.trigger('beforeChangeHidden', { hidden : value });

            if (value) {
                me.hide();
            }
            else {
                me.show();
            }
        }

        return ret;
    }

    /**
     * Get id assigned by user (not generated id)
     * @returns {String}
     * @readonly
     * @private
     * @category Misc
     */
    get assignedId() {
        return this.hasGeneratedId ? null : this.id;
    }

    /**
     * Get the owning Widget of this Widget. If this Widget is directly contained, then the containing
     * Widget is returned. If this Widget is floating, the configured `owner` property is returned.
     * If there is a `forElement`, that element's encapsulating Widget is returned.
     * @property {Core.widget.Widget}
     * @readonly
     * @category Widget hierarchy
     */
    get owner() {
        let owner = this.parent || this._owner;

        // More expensive operation, conditioned to not penalize all calls
        if (!owner) {
            const owningEl = this.forElement?.nodeType === Element.ELEMENT_NODE ? this.forElement : this.element?.parentNode;

            owner = (owningEl?.closest('.b-widget') && Widget.fromElement(owningEl));
        }

        return owner;
    }

    /**
     * Get this Widget's previous sibling in the parent {@link Core.widget.Container Container}, or, if not
     * in a Container, the previous sibling widget in the same _parentElement_.
     * @property {Core.widget.Widget}
     * @readonly
     * @category Widget hierarchy
     */
    get previousSibling() {
        return this.getSibling(-1);
    }

    /**
     * Get this Widget's next sibling in the parent {@link Core.widget.Container Container}, or, if not
     * in a Container, the next sibling widget in the same _parentElement_.
     * @property {Core.widget.Widget}
     * @readonly
     * @category Widget hierarchy
     */
    get nextSibling() {
        return this.getSibling(1);
    }

    getSibling(increment) {
        const
            me         = this,
            { parent } = me,
            siblings   = parent ? parent.childItems : Array.from(me.element.parentElement.querySelectorAll('.b-widget'));

        return parent ? siblings[siblings.indexOf(me) + increment] : Widget.fromElement(siblings[siblings.indexOf(me.element) + increment]);
    }

    /**
     * Looks up the {@link #property-owner} axis to find an ancestor which matches the passed selector.
     * The selector may be a widget type identifier, such as `'grid'`, or a function which will return
     * `true` when passed the desired ancestor.
     * @param {String|Function} selector A Type identifier or selection function.
     * @param {Boolean} [deep] When using a string identifier, pass `true` if all superclasses should be included, ie if a `Grid` should match `'widget'`.
     * @param {Number|String|Core.widget.Widget} [limit] how many steps to step up before aborting the search, or a selector to stop at or the topmost ancestor to consider.
     * @category Widget hierarchy
     */
    up() {
        const { owner } = this;

        if (owner) {
            return owner.closest(...arguments);
        }
    }

    /**
     * Starts with this Widget, then Looks up the {@link #property-owner} axis to find an ancestor which matches the passed selector.
     * The selector may be a widget type identifier, such as `'grid'`, or a function which will return
     * `true` when passed the desired ancestor.
     * @param {String|Function} selector A Type identifier or selection function.
     * @param {Boolean} [deep] When using a string identifier, pass `true` if all superclasses should be included, ie if a `Grid` should match `'widget'`.
     * @param {Number|String|Core.widget.Widget} [limit] how many steps to step up before aborting the search, or a selector to stop at or the topmost ancestor to consider.
     * @category Widget hierarchy
     */
    closest(selector, deep, limit) {
        const
            limitType     = typeof limit,
            numericLimit  = limitType === 'number',
            selectorLimit = limitType === 'string';

        for (let result = this, steps = 1; result; result = result.owner, steps++) {
            if (Widget.widgetMatches(result, selector, deep)) {
                return result;
            }
            if (numericLimit && steps >= limit) {
                return;
            }
            else if (selectorLimit && (Widget.widgetMatches(result, limit, deep))) {
                return;
            }
            else if (result === limit) {
                return;
            }
        }
    }

    /**
     * Returns `true` if this Widget owns the passed Element, Event or Widget. This is based on the widget hierarchy,
     * not DOM containment. So an element in a `Combo`'s dropdown list will be owned by the `Combo`.
     * @param {HTMLElement|Event|Core.widget.Widget} target The element event or Widget to test for being
     * within the ownership tree of this Widget.
     * @category Widget hierarchy
     */
    owns(target) {
        if (target) {
            // Passed an event, grab its target
            if (target.eventPhase) {
                target = target.target;
            }

            // We were passed an HTMLElement
            if (target.nodeType === Element.ELEMENT_NODE) {
                if (this.element.contains(target)) {
                    return true;
                }
                target = Widget.fromElement(target);
            }

            //<debug>
            if (target && !(target instanceof Widget)) {
                throw new Error('owns() must be passed an HTMLElement or a Widget');
            }
            //</debug>

            while (target) {
                if (target === this) {
                    return true;
                }
                target = target.owner;
            }
        }
        return false;
    }

    /**
     * Iterate over all ancestors of this widget.
     *
     * *Note*: Due to this method aborting when the function returns `false`, beware of using short form arrow
     * functions. If the expression executed evaluates to `false`, iteration will terminate.
     * @param {Function} fn Function to execute for all ancestors. Terminate iteration by returning `false`.
     * @returns {Boolean} Returns `true` if iteration was not aborted by a step returning `false`
     * @category Widget hierarchy
     */
    eachAncestor(fn) {
        let ancestor = this.owner;

        while (ancestor) {
            if (fn(ancestor) === false) {
                return false;
            }
            ancestor = ancestor.owner;
        }

        return true;
    }

    changeMonitorResize(monitorResize, oldMonitorResize) {
        // They are mutually exclusive. scaleToFitWidth disables monitorResize
        const result = this.scaleToFitWidth ? false : Boolean(monitorResize);

        // null and undefined both mean false. Avoid going through the updater if no change.
        if (result !== Boolean(oldMonitorResize)) {
            return result;
        }
    }

    updateMonitorResize(monitorResize) {
        const me = this;

        if (!hasOwnProperty.call(me, 'onElementResize')) {
            me.onElementResize = me.onElementResize.bind(me);
        }

        ResizeMonitor[monitorResize ? 'addResizeListener' : 'removeResizeListener'](me.element, me.onElementResize);
    }

    changeReadOnly(readOnly) {
        readOnly = Boolean(readOnly);

        // It starts as undefined, so if false is passed, that's a no-change.
        if (Boolean(this._readOnly) !== readOnly) {
            return readOnly;
        }
    }

    updateReadOnly(readOnly) {
        // Can be called from the element initialization because of the way Panel is set up.
        // tbar and bbar are instantiated, and their elements added to the gathered element
        // config object, but that can have consequences which can lead here.
        // eslint-disable-next-line no-unused-expressions
        this.element?.classList[readOnly ? 'add' : 'remove']('b-readonly');

        // Do not update  children at configure time.
        // Container will sync its items.
        if (!this.isConfiguring) {
            // Implemented at this level because Widgets can own a descendant tree without being
            // a Container. For example Combos own a ChipView and a List. Buttons own a Menu etc.
            this.eachWidget(widget => {
                if (!('_originalReadOnly' in widget)) {
                    // Store initial readOnly/disabled value.
                    // the config getter copies the properties in a loop
                    // so execute once and cache the value.
                    widget._originalReadOnly = widget.config.readOnly || false;
                }

                // Set if truthy, otherwise reset to initial value
                widget.readOnly = readOnly || widget._originalReadOnly;
            }, false);

            /**
             * Fired when a Widget's read only state is toggled
             * @event readOnly
             * @param {Boolean} readOnly Read only or not
             */
            this.trigger('readOnly', { readOnly });
        }
    }

    /**
     * Iterate over all widgets owned by this widget and any descendants.
     *
     * *Note*: Due to this method aborting when the function returns `false`, beware of using short form arrow
     * functions. If the expression executed evaluates to `false`, iteration will terminate.
     * @param {Function} fn A function to execute upon each descendant widget.
     * Iteration terminates if this function returns `false`.
     * @param {Core.widget.Widget} fn.widget The current descendant widget.
     * @param {Object} fn.control An object containing recursion control options.
     * @param {Boolean} fn.control.down A copy of the `deep` parameter. This can be adjusted by `fn` to decide which
     * widgets should be recursed. This value will always be the value of `deep` on entry and the value of `control.down`
     * upon return determines the recursion into the current widget.
     * @param {Boolean} [deep=true] Pass as `false` to only consider immediate child widgets.
     * @returns {Boolean} Returns `true` if iteration was not aborted by a step returning `false`
     * @category Widget hierarchy
     */
    eachWidget(fn, deep = true) {
        const
            widgets = this.childItems,
            length = widgets ? widgets.length : 0,
            control = {};

        for (let i = 0; i < length; i++) {
            const widget = widgets[i];

            control.down = deep;

            // Abort if a call returns false
            if (fn(widget, control) === false) {
                return false;
            }

            if (control.down && widget.eachWidget) {
                // Abort if a deep call returns false
                if (widget.eachWidget(fn, deep) === false) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Returns an array of all descendant widgets which the passed
     * filter function returns `true` for.
     * @param {Function} filter A function which, when passed a widget,
     * returns `true` to include the widget in the results.
     * @returns {Core.widget.Widget[]} All matching descendant widgets.
     * @category Widget hierarchy
     */
    queryAll(filter) {
        const result = [];

        this.eachWidget(w => {
            if (filter(w)) {
                result.push(w);
            }
        });

        return result;
    }

    /**
     * Returns the first descendant widgets which the passed
     * filter function returns `true` for.
     * @param {Function} filter A function which, when passed a widget,
     * returns `true` to return the widget as the sole result.
     * @returns {Core.widget.Widget} The first matching descendant widget.
     * @category Widget hierarchy
     */
    query(filter) {
        let result = null;

        this.eachWidget(w => {
            if (filter(w)) {
                result = w;
                return false;
            }
        });

        return result;
    }

    /**
     * Get a widget by ref, starts on self and traverses up the owner hierarchy checking `widgetMap` at each level.
     * Not checking the top level widgetMap right away to have some acceptance for duplicate refs.
     * @param {String} ref ref to find
     * @returns {Core.widget.Widget}
     * @internal
     * @category Widget hierarchy
     */
    getWidgetByRef(ref) {
        if (ref instanceof Widget) {
            return ref;
        }

        return this?.widgetMap?.[ref] || this?.owner?.getWidgetByRef(ref);
    }

    onFocusIn(e) {
        const
            me          = this,
            { element } = me;

        me.containsFocus = true;
        me.focusInEvent  = e;
        element.classList.add('b-contains-focus');

        if (element.contains(e._target) && me.onInternalKeyDown && !me.keyDownListenerRemover) {
            me.keyDownListenerRemover = EventHelper.on({
                element,
                keydown : 'onInternalKeyDown',
                thisObj : me
            });
        }

        /**
         * Fired when focus enters this Widget.
         * @event focusIn
         * @param {Core.widget.Widget} source - This Widget
         * @param {HTMLElement} fromElement The element which lost focus.
         * @param {HTMLElement} toElement The element which gained focus.
         * @param {Core.widget.Widget} fromWidget The widget which lost focus.
         * @param {Core.widget.Widget} toWidget The widget which gained focus.
         * @param {Boolean} backwards `true` if the `toElement` is before the `fromElement` in document order.
         */
        me.trigger('focusin', e);
    }

    onFocusOut(e) {
        const me = this;

        if (me.keyDownListenerRemover) {
            me.keyDownListenerRemover();
            me.keyDownListenerRemover = null;
        }

        if (!me.isDestroyed) {
            // Focus to nowhere, focus a close relation
            if (!e.relatedTarget) {
                me.revertFocus(!me.isVisible);
            }

            me.containsFocus = false;
            me.element.classList.remove('b-contains-focus');

            /**
             * Fired when focus exits this Widget's ownership tree. This is different from a `blur` event.
             * focus moving from within this Widget's ownership tree, even if there are floating widgets
             * will not trigger this event. This is when focus exits this widget completely.
             * @event focusOut
             * @param {Core.widget.Widget} source - This Widget
             * @param {HTMLElement} fromElement The element which lost focus.
             * @param {HTMLElement} toElement The element which gained focus.
             * @param {Core.widget.Widget} fromWidget The widget which lost focus.
             * @param {Core.widget.Widget} toWidget The widget which gained focus.
             * @param {Boolean} backwards `true` if the `toElement` is before the `fromElement` in document order.
             */
            me.trigger('focusout', e);
        }
    }

    /**
     * Returns a function that will set the focus (`document.activeElement`) to the most consistent element possible
     * based on the focus state at the time this method was called. Derived classes can implement `captureFocusItem()`
     * to refine this process to include logical items (e.g., a grid cell) that would be more stable than DOM element
     * references.
     *
     * If this widget does not contain the focus, the returned function will do nothing.
     * @returns {Function}
     * @internal
     */
    captureFocus() {
        const
            me = this,
            activeElementWas = DomHelper.getActiveElement(me),
            restore = me.contains(activeElementWas) && me.captureFocusItem(activeElementWas);

        return (scrollIntoView) => {
            if (restore && !me.isDestroying) {
                const activeElementNow = DomHelper.getActiveElement(me);

                if (activeElementNow !== activeElementWas) {
                    restore(scrollIntoView);
                }
            }
        };
    }

    /**
     * This method is called by `captureFocus()` when this widget contains the focus and it returns a function that
     * restores the focus to the correct internal element. The returned function is only called if the current
     * `document.activeElement` is different from the passed `activeElement`.
     *
     * This method can be replaced by derived classes to capture stable identifiers for the currently focused, logical
     * item (for example, a cell of a grid).
     *
     * @param {HTMLElement} activeElement The current `document.activeElement`.
     * @returns {Function} Returns a function that accepts a boolean argument. Defaults to `true`, `false` attempts to
     * focus without scrolling.
     * @internal
     */
    captureFocusItem(activeElement) {
        return (scrollIntoView = true) => {
            if (this.contains(activeElement)) {
                scrollIntoView ? activeElement.focus() : DomHelper.focusWithoutScrolling(activeElement);
            }
        };
    }

    /**
     * Returns `true` if this widget is or contains the specified element or widget.
     * @param {HTMLElement|Core.widget.Widget} elementOrWidget The element or widget
     * @param {Boolean} [strict] Pass `true` to test for strict containment (if `elementOrWidget` is this widget, the
     * return value will be `false`).
     * @returns {Boolean}
     */
    contains(elementOrWidget, strict) {
        const { element } = this;

        if (elementOrWidget && element) {
            if (elementOrWidget.isWidget) {
                elementOrWidget = elementOrWidget.element;
            }

            // el.contains(el) === true
            return element.contains(elementOrWidget) && (!strict || element !== elementOrWidget);
        }
    }

    /**
     * If this Widget contains focus, focus is reverted to the source from which it entered if possible,
     * or to a close relative if not.
     * @param {Boolean} [force] Pass as `true` to move focus to the previously focused item, or the
     * closest possible relative even if this widget does not contain focus.
     */
    revertFocus(force) {
        const
            me            = this,
            activeElement = DomHelper.getActiveElement(me);

        let target = me.focusInEvent?.relatedTarget;

        if (force || (me.containsFocus && target?.nodeType === Element.ELEMENT_NODE && me.element.contains(activeElement))) {
            if (!target || !DomHelper.isFocusable(target)) {
                target = me.getFocusRevertTarget();
            }

            if (target && DomHelper.isFocusable(target)) {
                DomHelper.focusWithoutScrolling(target);
            }
            else {
                // If we could not find a suitable target to receive focus, we still need to not be focused. Oddly,
                // one cannot do "document.body.focus()" but explicitly calling blur() has that effect. If we do not
                // do this, and we retain the focus, we can have issue w/closeAction=destroy which can cause the blur
                // in afterHideAnimation which then causes that element.remove() to throw DOM exceptions.
                activeElement?.blur();
            }
        }
    }

    /**
     * This method finds a close sibling (or parent, or parent's sibling etc recursively) to which focus
     * can be directed in the case of revertFocus not having a focusable element from our focusInEvent.
     *
     * This can happen when the "from" component is destroyed or hidden. We should endeavour to prevent
     * focus escaping to `document.body` for accessibility and ease of use, and keep focus close.
     * @internal
     */
    getFocusRevertTarget() {
        const
            me              = this,
            {
                owner,
                focusInEvent
            }               = me,
            searchDirection = focusInEvent ? (focusInEvent.backwards ? 1 : -1) : -1;

        let target        = focusInEvent && focusInEvent.relatedTarget;
        const toComponent = target && Widget.fromElement(target);

        // If the from element is now not focusable, for example an Editor which hid
        // itself on focus leave, then we have to find a sibling/parent/parent's sibling
        // to take focus. Anything is better than flipping to document.body.
        if (owner && !owner.isDestroyed && (!target || !DomHelper.isFocusable(target) || (toComponent && !toComponent.isFocusable))) {
            target = null;

            // If this widget can have siblings, then find the closest
            // (in the direction focus arrived from) focusable sibling.
            if (owner.eachWidget) {
                const siblings = [];

                // Collect focusable siblings.
                // With this included so we can find ourselves.
                owner.eachWidget(w => {
                    if (w === me || w.isFocusable) {
                        siblings.push(w);
                    }
                }, false);

                if (siblings.length > 1) {
                    const myIndex = siblings.indexOf(me);

                    target = siblings[myIndex + searchDirection] ||
                        siblings[myIndex - searchDirection];
                }
            }

            // No focusable siblings found to take focus, try the owner
            if (!target && owner.isFocusable) {
                target = owner;
            }

            // If non of the above found any related focusable widget,
            // Go through these steps for the owner.
            target = target ? target.focusElement : owner.getFocusRevertTarget();
        }

        return target;
    }

    /**
     * Used by the Widget class internally to create CSS classes based on this Widget's
     * inheritance chain to allow styling from each level to apply.
     *
     * For example Combo would yield `"["b-widget", "b-field", "b-textfield", "b-pickerfield", "b-combo"]"`
     *
     * May be implemented in subclasses to add or remove classes from the super.widgetClassList
     * @returns {String[]} The css class list named using the class name.
     * @internal
     * @category DOM
     */
    get widgetClassList() {
        const
            me        = this,
            myCls     = me.cls,
            classes   = me.$meta.hierarchy,
            classList = myCls?.values || [];

        for (let cls, name, widgetClass, widgetClassProperty, i = classes.indexOf(Widget); i < classes.length; ++i) {
            cls = classes[i];
            widgetClassProperty = Reflect.getOwnPropertyDescriptor(cls.prototype, 'widgetClass');

            // If the Class has its own get widgetClass, call it upon this instance.
            if (widgetClassProperty?.get) {
                widgetClass = widgetClassProperty.get.call(me);
            }
            else {
                // All built in widgets should define $name to be safer from minification/obfuscation, but user
                // created might not so fall back to actual name. UMD files use a _$name property
                // which the Base $$name getter uses as a fallback.
                name = (
                    hasOwnProperty.call(cls, '$$name') ||
                    hasOwnProperty.call(cls, '$name') ||
                    hasOwnProperty.call(cls, '_$name')
                )
                    ? cls.$$name
                    : cls.name;

                // Throw error in case of an obfuscated name or an autogenerated name.
                // These should never be released without a meaningful $name getter.
                if (name.length < 3 || name.includes('$')) {
                    // class.$name comes from parent API class which has it
                    console.warn(`Class "${name}" which extends "${cls.$name}" should have "$name" static getter with no less than 3 chars.`);
                }

                widgetClass = `b-${name.toLowerCase()}`;
            }

            if (widgetClass) {
                classList.push(...DomClassList.normalize(widgetClass, 'array'));
            }
        }

        if (me.floating) {
            classList.push('b-floating');
        }

        if (BrowserHelper.isTouchDevice) {
            classList.push('b-touch');
        }

        return classList;
    }

    changeCls(cls) {
        return DomClassList.from(cls);
    }

    changeContentElementCls(cls) {
        return DomClassList.from(cls);
    }

    changeHtmlCls(cls) {
        return DomClassList.from(cls);
    }

    //endregion

    //region Cache

    /**
     * Gets dom elements in the view. Caches the results for faster future calls.
     * @param {String} query CSS selector
     * @param {Boolean} children true to fetch multiple elements
     * @param {HTMLElement} element Element to use as root for the query, defaults to the views outermost element
     * @returns {HTMLElement|HTMLElement[]|null} A single element or an array of elements (if parameter children is set to true)
     * @internal
     * @category DOM
     */
    fromCache(query, children = false, element = this.element) {
        if (!element) return null;

        const me = this;

        if (!me.cache[query]) {
            me.cache[query] = children ? DomHelper.children(element, query) : DomHelper.down(element, query);
        }
        return me.cache[query];
    }

    /**
     * Clear caches, forces all calls to fromCache to requery dom. Called on render/rerender.
     * @internal
     * @category DOM
     */
    emptyCache() {
        this.cache = {};
    }

    //endregion

    //region Mask

    changeMasked(mask, maskInstance) {
        if (mask === true || mask === '') {
            // empty string don't render well, so promote it to an &nbsp; as well
            mask = '\xA0';  // nbsp
        }

        if (maskInstance) {
            if (typeof mask === 'string') {
                maskInstance.text = mask;
                mask = maskInstance;
            }
            else if (mask) {
                maskInstance.setConfig(mask);
                mask = maskInstance;
            }
            else {
                maskInstance.destroy();
            }
        }
        else if (mask) {
            const Mask = Widget.resolveType('mask');

            mask = Mask.mergeConfigs(this.maskDefaults, mask);
            mask.owner = this;
            mask = Mask.mask(mask);
        }

        return mask || null;
    }

    onMaskAutoClose(mask) {
        if (mask.isDestroyed && mask === this.masked) {
            this.masked = null;
        }
    }

    /**
     * Mask the widget, showing the specified message
     * @param {String|Object} msg Mask message (or a {@link Core.widget.Mask} config object
     * @returns {Core.widget.Mask}
     */
    mask(msg) {
        this.masked = msg;

        return this.masked;
    }

    /**
     * Unmask the widget
     */
    unmask() {
        this.masked = null;
    }

    //endregion

    //region Monitor resize

    onInternalResize(element, width, height, oldWidth, oldHeight) {
        this._width  = element.offsetWidth;
        this._height = element.offsetHeight;
    }

    onElementResize(resizedElement) {
        const
            me        = this,
            {
                element,
                scrollable
            }         = me,
            oldWidth  = me._width,
            oldHeight = me._height,
            newWidth  = element.offsetWidth,
            newHeight = element.offsetHeight;

        if (me.floating) {
            me.onFloatingWidgetResize(...arguments);
        }

        if (scrollable) {
            scrollable.syncOverflowState?.();
        }

        if (!me.suspendResizeMonitor && (oldWidth !== newWidth || oldHeight !== newHeight)) {
            me.onInternalResize(element, newWidth, newHeight, oldWidth, oldHeight);
            /**
             * Fired when the encapsulating element of a Widget resizes *only when {@link #config-monitorResize} is `true`*.
             * @event resize
             * @param {Core.widget.Widget} source - This Widget
             * @param {Number} width The new width
             * @param {Number} height The new height
             * @param {Number} oldWidth The old width
             * @param {Number} oldHeight The old height
             */
            me.trigger('resize', { width : newWidth, height : newHeight, oldWidth, oldHeight });
        }
    }

    onFloatingWidgetResize(resizedElement, lastRect, myRect) {
        const
            me = this,
            {
                lastAlignSpec,
                constrainTo
            }  = me;
        // If this Popup changes size while we are aligned and we are aligned to
        // a target (not a position), then we might need to realign.
        if (me.isVisible && lastAlignSpec && lastAlignSpec.target) {
            const
                heightChange    = !lastRect || myRect.height !== lastRect.height,
                widthChange     = !lastRect || myRect.width !== lastRect.width,
                failsConstraint = constrainTo && !Rectangle.from(constrainTo).contains(Rectangle.from(me.element, null, true));

            // Only realign if:
            // the height has changed and we are not aligned below, or
            // the width has changed and we are not aligned to the right.
            if ((heightChange && lastAlignSpec.zone !== 2) || (widthChange && lastAlignSpec.zone !== 1) || failsConstraint) {
                // Must move to next AF because in Chrome, the resize monitor might fire
                // before the element is painted and the anchor color matching
                // scheme cannot work in that case.
                me.requestAnimationFrame(() => me.realign());
            }
        }
    }

    updateScale() {
        const me            = this,
            element       = me.element,
            parentElement = element.parentElement;

        // this could be placed elsewhere but want to keep it contained to not spam other code,
        // since this is a very specific use case in our docs
        if (!me.configuredWidth) {
            me.configuredWidth = me.width;
        }

        // TODO: handle autoHeight, but seems it assigns height to late with current setup

        // We are scaling to fit inside the width, so ensure that we are not the cause of a scrollbar
        // in our current, unscaled state by hiding while we measure the parent's offsetWidth which
        // we are going to scale to.
        element.style.display = 'none';

        const
            rect          = Rectangle.client(parentElement),
            scale         = rect.width / me.configuredWidth,
            adjustedScale = me.scale = me.allowGrowWidth ? Math.min(scale, 1) : scale;

        element.style.transform       = `scale(${adjustedScale})`;
        element.style.transformOrigin = 'top left';
        element.style.display         = '';

        if (me.allowGrowWidth && scale > 1) {
            // increase width
            me.width = me.configuredWidth * scale;
        }
    }

    onParentElementResize(event) {
        this.updateScale();
    }

    //endregion

    /**
     * Returns a `TRBL` array of values parse from the passed specification. This can be used to parse`
     * a value list for `margin` or `padding` or `border-width` etc - any CSS value which takes a `TRBL` value.
     * @param {Number|String|String[]} values The `TRBL` value
     * @param {String} [units=px] The units to add to values which are specified as numeric.
     * @internal
     */
    parseTRBL(values, units = 'px') {
        values = values || 0;

        if (typeof values === 'number') {
            return [`${values}${units}`, `${values}${units}`, `${values}${units}`, `${values}${units}`];
        }
        //<debug>
        else if (typeof values !== 'string') {
            throw new Error('parseTRBL must be passed a single numeric value, or a "T R B L"/"TB RL"/"TRBL"/"TRB" string');
        }
        //</debug>

        const
            parts = values.split(' '),
            len   = parts.length;

        if (len === 1) {
            parts[1] = parts[2] = parts[3] = parts[0];
        }
        else if (len === 2) {
            parts[2] = parts[0];
            parts[3] = parts[1];
        }
        else if (len === 3) {
            parts[3] = parts[1];
        }

        return [
            isFinite(parts[0]) ? `${parts[0]}${units}` : parts[0],
            isFinite(parts[1]) ? `${parts[1]}${units}` : parts[2],
            isFinite(parts[2]) ? `${parts[2]}${units}` : parts[3],
            isFinite(parts[3]) ? `${parts[3]}${units}` : parts[4]
        ];
    }

    // Returns root node for this widget, either a document or a shadowRoot
    get documentRoot() {
        return this.owner?.documentRoot || this.element.getRootNode();
    }

    // Returns top most DOM element of the visible DOM tree for this widget element, either document.body or a shadowRoot
    get rootElement() {
        const me = this;

        if (!me._rootElement) {
            let root = me.owner?.rootElement || (me.forElement instanceof HTMLElement && DomHelper.getRootElement(me.forElement));

            // Check element, we may be in the DOM just not visible
            if (!root) {
                const elRoot = me.element instanceof HTMLElement && DomHelper.getRootElement(me.element);

                // Make sure we got a proper root
                if (elRoot === document.body || elRoot.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                    root = elRoot;
                }
            }

            if (!root) {
                // <debug>
                console.warn(`${me.constructor.name}: Floating Widgets must have "rootElement" to be assigned to a float root (to support web components)`);
                // </debug>
                root = document.body;
            }

            me._rootElement = root;
        }

        return me._rootElement;
    }

    get floatRoot() {
        const
            me          = this,
            rootElement = me.rootElement || me.owner?.rootElement;

        let { floatRoot } = rootElement;

        if (!floatRoot) {
            const
                { outerCls } = Widget,
                themeName    = DomHelper.themeInfo?.name;

            if (!DomHelper.isValidFloatRootParent(rootElement)) {
                throw new Error('Attaching float root to wrong root');
            }

            // When outside of our examples, the body element doesn't get the theme class.
            // The floatRoot must carry it for floating items to be themed.
            if (themeName) {
                outerCls.push(`b-theme-${themeName.toLowerCase()}`);
            }

            floatRoot = rootElement.floatRoot = DomHelper.createElement({
                className : `b-float-root ${outerCls.join(' ')}`,
                parent    : rootElement
            });

            floatRoots.push(floatRoot);

            // Make float root immune to keyboard-caused size changes
            if (BrowserHelper.isAndroid) {
                floatRoot.style.height = `${screen.height}px`;
                EventHelper.on({
                    element           : window,
                    orientationchange : () => floatRoot.style.height = `${screen.height}px`
                });
            }

            // Resize float root upon keyboard-caused visual viewport size change
            // https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API
            if (!BrowserHelper.isHoverableDevice && window.visualViewport) {
                EventHelper.on({
                    element : window.visualViewport,
                    resize  : ({ target: viewport }) => floatRoot.style.height = `${viewport.height}px`
                });
            }

            // Keep floatRoot up to date with the theme
            GlobalEvents.on({
                theme : ({ theme, prev }) => {
                    // TODO handle for all roots
                    floatRoot.classList.add(`b-theme-${theme.toLowerCase()}`);
                    floatRoot.classList.remove(`b-theme-${prev.toLowerCase()}`);
                }
            });
        }
        // Angular might shuffle elements around so we have to ensure floatRoot is a child of the right parent
        else if (!rootElement.contains(floatRoot)) {
            // Reattach floatRoot if it was detached
            rootElement.appendChild(floatRoot);
        }

        return floatRoot;
    }

    get floatRootMaxZIndex() {
        let max = 1;

        Array.from(this.floatRoot.children).forEach(child => {
            const zIndex = parseInt(getComputedStyle(child).zIndex || 0, 10);

            if (zIndex > max) {
                max = zIndex;
            }
        });

        return max;
    }

    static resetFloatRootScroll() {
        floatRoots.forEach(floatRoot => floatRoot.scrollTop = floatRoot.scrollLeft = 0);
    }

    static get floatRoots() {
        return floatRoots;
    }

    static removeFloatRoot(floatRoot) {
        floatRoots.splice(floatRoots.indexOf(floatRoot), 1);
    }

    // CSS classes describing outer-most Widgets to provide styling / behavioral CSS style rules
    static get outerCls() {
        const result = ['b-outer'];

        if (BrowserHelper.isTouchDevice) {
            result.push('b-touch-events');
        }
        if (DomHelper.scrollBarWidth) {
            result.push('b-visible-scrollbar');
        }
        else {
            result.push('b-overlay-scrollbar');
        }
        if (BrowserHelper.isChrome) {
            result.push('b-chrome');
        }
        else if (BrowserHelper.isSafari) {
            result.push('b-safari');
        }
        else if (BrowserHelper.isFirefox) {
            result.push('b-firefox');
        }
        else if (BrowserHelper.isIE11) {
            result.push('b-ie');
        }
        else if (BrowserHelper.isEdge) {
            result.push('b-edge');
        }
        // So that we don't get the polyfill styles applied if we have ResizeMonitor available.
        // The polyfill styles can break certain elements styling.
        if (!window.ResizeObserver) {
            result.push('b-no-resizeobserver');
        }
        return result;
    }

    get isAnimating() {
        return this._isAnimatingCounter > 0;
    }

    set isAnimating(value) {
        const me = this;

        if (me._isAnimatingCounter === 0 && value) {
            me.element.classList.add('b-animating');
            this.trigger('animationStart');
        }
        else if (me._isAnimatingCounter === 1 && !value) {
            me.element.classList.remove('b-animating');
            this.trigger('animationEnd');
        }

        me._isAnimatingCounter += value ? 1 : -1;

        me._isAnimatingCounter = Math.max(0, me._isAnimatingCounter);
    }

    // Waits until all transitions are completed
    async waitForAnimations() {
        if (this.isAnimating) {
            await this.await('animationend', { checkLog : false });
        }
    }

    /**
     * Analogous to document.querySelector, finds the first Bryntum widget matching the passed
     * selector. Right now, only class name (lowercased) selector strings, or
     * a filter function which returns `true` for required object are allowed:
     * ```
     * bryntum.query('grid').destroy();
     * ```
     * @param {String|Function} selector A lowercased class name, or a filter function.
     * @param {Boolean} [deep] Specify `true` to search the prototype chain (requires supplying a string `selector`). For
     *   example 'widget' would then find a Grid
     * @return {Core.widget.Widget} The first matched widget if any.
     * @category Widget hierarchy
     */
    static query(selector, deep = false) {
        const { idMap } = Widget.identifiable;

        for (const id in idMap) {
            if (Widget.widgetMatches(idMap[id], selector, deep)) {
                return idMap[id];
            }
        }
        return null;
    }

    /**
     * Analogous to document.querySelectorAll, finds all Bryntum widgets matching the passed
     * selector. Right now, only registered widget `type` strings, or a filter function which
     * returns `true` for required object are allowed:
     * ```
     * let allFields = bryntum.queryAll('field', true);
     * ```
     * @param {String|Function} selector A lowercased class name, or a filter function.
     * @param {Boolean} [deep] Specify `true` to search the prototype chain (requires supplying a string `selector`). For
     *   example 'widget' would then find a Grid
     * @return {Core.widget.Widget[]} The first matched widgets if any - an empty array will be returned
     * if no matches are found.
     * @category Widget hierarchy
     */
    static queryAll(selector, deep = false) {
        const
            { idMap }  = Widget.identifiable,
            result     = [];

        for (const id in idMap) {
            if (Widget.widgetMatches(idMap[id], selector, deep)) {
                result.push(idMap[id]);
            }
        }
        return result;
    }

    /**
     * Returns the Widget which owns the passed element (or event).
     * @param {HTMLElement|Event} element The element or event to start from
     * @param {String|Function} [type] The type of Widget to scan upwards for. The lowercase
     * class name. Or a filter function which returns `true` for the required Widget.
     * @param {HTMLElement|Number} [limit] The number of components to traverse upwards to find a
     * match of the type parameter, or the element to stop at.
     * @return {Core.widget.Widget} The found Widget or null.
     * @category Misc
     */
    static fromElement(element, type, limit) {
        const typeOfType = typeof type;

        // Check if an event was passed
        if (element && !element.nodeType) {
            element = element.target;
        }

        if (typeOfType === 'number' || type && type.nodeType === Element.ELEMENT_NODE) {
            limit = type;
            type = null;
        }

        let target = element,
            depth = 0,
            topmost, cmpId, cmp;

        if (typeof limit !== 'number') {
            topmost = limit;
            limit = Number.MAX_VALUE;
        }
        if (typeOfType === 'string') {
            type = type.toLowerCase();
        }

        while (target && target.nodeType === Element.ELEMENT_NODE && depth < limit && target !== topmost) {
            cmpId = (target.dataset && target.dataset.ownerCmp) || target.id;

            if (cmpId) {
                cmp = Widget.getById(cmpId);

                if (cmp) {
                    if (type) {
                        if (typeOfType === 'function') {
                            if (type(cmp)) {
                                return cmp;
                            }
                        }
                        else if (Widget.widgetMatches(cmp, type, true)) {
                            return cmp;
                        }
                    }
                    else {
                        return cmp;
                    }
                }

                // Increment depth on every *Widget* found
                depth++;
            }

            target = target.parentNode;
        }

        return null;
    }

    // NOTE: Not named `triggerChange` to not conflict with existing fn on Field
    /**
     * Triggers a 'change' event with the supplied params. After triggering it also calls `onFieldChange()` on each
     * ancestor the implements that function, supplying the same set of params.
     * @param {Object} params Event params, used both for triggering and notifying ancestors
     * @param {Boolean} [trigger] `false` to not trigger, only notifying ancestors
     * @internal
     */
    triggerFieldChange(params, trigger = true) {
        if (trigger) {
            this.trigger('change', params);
        }

        this.eachAncestor(ancestor => {
            if (ancestor.onFieldChange) {
                ancestor.onFieldChange(params);
            }

            // Stop going up when reaching an ancestor that isolates its fields
            if (ancestor.isolateFields) {
                return false;
            }
        });
    }

    // Sets up the focus listeners, one set for every document root (shadow root or document)
    setupFocusListeners() {
        // Listen to focus events on shadow root to handle focus inside the shadow dom
        GlobalEvents.setupFocusListenersOnce(this._rootElement, EventHelper);
    }

    static widgetMatches(candidate, selector, deep) {
        if (selector === '*') {
            return true;
        }
        if (typeof selector === 'function') {
            return selector(candidate);
        }
        return Widget.isType(candidate, selector, deep);
    }

    /**
     * Attached a tooltip to the specified element.
     * @example
     * Widget.attachTooltip(element, {
     *   text: 'Useful information goes here'
     * });
     * @param {HTMLElement} element Element to attach tooltip for
     * @param {Object|String} configOrText Tooltip config or tooltip string, see example and source
     * @returns {HTMLElement}
     * @category Misc
     */
    static attachTooltip(element, configOrText) {
        if (typeof configOrText === 'string') configOrText = { html : configOrText };

        // TODO: refactor this
        // eslint-disable-next-line no-new
        Widget.create(Object.assign({
            forElement : element
        }, configOrText), 'tooltip');

        return element;
    }

}

const proto = Widget.prototype;

proto.compose.$nullFn = true;

// Register this widget type with its Factory
Widget.initClass();
Widget.register('mask', Mask);

// These low level classes must not import Widget because that would cause circularity.
// Instead Widget injects a reference to itself into them.
DomHelper.Widget = Widget;
GlobalEvents.Widget = Widget;

// We use the same map to track instances by ID
Mask.identifiable.idMap = Widget.identifiable.idMap;

// Simplify querying widgets by exposing fns in bryntum ns
Object.assign((window.bryntum || (window.bryntum = {})), {
    get         : Widget.getById.bind(Widget),
    query       : Widget.query,
    queryAll    : Widget.queryAll,
    fromElement : Widget.fromElement
});
