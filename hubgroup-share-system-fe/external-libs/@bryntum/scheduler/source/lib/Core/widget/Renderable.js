import Delayable from '../mixin/Delayable.js';
import DomHelper from '../helper/DomHelper.js';
import DomSync from '../helper/DomSync.js';
import EventHelper from '../helper/EventHelper.js';
import Events from '../mixin/Events.js';
import Localizable from '../localization/Localizable.js';
import Identifiable from '../mixin/Identifiable.js';
import Base from '../Base.js';

const { defineProperty } = Reflect;

/**
 * @module Core/widget/Renderable
 */

/**
 * This class provides element rendering and automatic synchronization based on config property changes.
 *```
 *  class Label extends Renderable {
 *      static get configurable() {
 *          return {
 *              text : {
 *                  value: null,
 *
 *                  $config : 'render'
 *              }
 *          };
 *      }
 *
 *      renderDom() {
 *          return {
 *              tag: 'label',
 *              children: [
 *                  this.text
 *              ]
 *          };
 *      }
 *  }
 *```
 * A class can opt to not specify its render configs. In this case, these will be determined automatically, but with
 * some additional cost. This may not be worth considering if only a few instances are ever likely.
 *
 * @private
 */
export default class Renderable extends Base.mixin(Localizable, Events, Delayable, Identifiable) {
    static get configurable() {
        return {
            /**
             * The top-level DOM element for this object. This element is produced from the {@link #function-renderDom}
             * method of the derived class. As configs used by `renderDom` change, a synchronization of the DOM is
             * scheduled by calling {@link #function-refreshDom}. This call is made automatically by this class, making
             * it rarely necessary to call `refreshDom` directly.
             * @config {HTMLElement}
             * @category DOM
             */
            element : null
        };
    }

    static get delayable() {
        return {
            refreshDom : 'raf'
        };
    }

    static get identifiable() {
        return { };
    }

    /**
     * Returns the Set of configs defined as `render: true`, that is, the configs that determine the rendering (via
     * `renderDom`). If no such configs are defined, this method returns `null`.
     *
     * @returns {Set}
     * @private
     */
    static get renderConfigs() {
        const
            me = this,
            meta = me.$meta;

        let renderConfigs = meta.renderConfigs,
            configs, name;

        if (renderConfigs === undefined) {  // if (first time for this class)
            renderConfigs = null;
            configs = meta.configs;

            for (name in configs) {
                if (configs[name].render) {
                    (renderConfigs || (renderConfigs = new Set())).add(name);
                }
            }

            // Put $renderConfigs on the prototype so that onConfigChange is as simple as possible:
            meta.renderConfigs = me.prototype.$renderConfigs = renderConfigs;
        }

        return renderConfigs;
    }

    //region Init

    construct(...args) {
        this.$iid = ++Renderable.$idSeed;
        this.byRef = {};

        super.construct(...args);

        if (this.onDraw !== Renderable.prototype.onDraw) {
            this.initDrawable();
        }
    }

    startConfigure(config) {
        this.element = this.renderContext.renderDom(); // calls changeElement()

        super.startConfigure(config);
    }

    //endregion

    //region Configs

    get element() {
        // NOTE: We can replace the getter of a config property

        // Asking for the primary el is a good sign that we need to sync the DOM:
        this.refreshDom.flush();

        return this._element;
    }

    /**
     * This is called when the `element` config is assigned (via the setter).
     * @param {HTMLElement} element The new element being assigned.
     * @param {HTMLElement} oldElement The old element (previously assigned) or `null`.
     * @returns {HTMLElement}
     * @private
     */
    changeElement(element, oldElement) {
        const me = this;

        if (oldElement) {
            oldElement.remove();
        }

        if (element) {
            element.id = me.id;
            element = DomHelper.createElement(element, {
                refOwner : me
            });
        }

        return element;
    }

    updateId(id, oldId) {
        const me = this;

        if (oldId) {
            const element = me.element;

            element.id = id;

            me.fixRefOwnerId(element, id, oldId);
        }
    }

    //endregion

    //region Misc

    /**
     * Returns the `classList` of this instance's `element`.
     * @property {DOMTokenList}
     */
    get classes() {
        return this.element.classList;
    }

    /**
     * This method fixes the element's `$refOwnerId` when this instance's `id` is changing.
     * @param {HTMLElement} el The element to fix.
     * @param {String} id The new id being assigned.
     * @param {String} oldId The old id (previously assigned).
     * @private
     */
    fixRefOwnerId(el, id, oldId) {
        if (el.$refOwnerId === oldId) {
            el.$refOwnerId = id;

            const ref = el.$reference;

            if (ref) {
                el.id = `${id}-${ref}`;
            }

            for (const c of el.childNodes) {
                this.fixRefOwnerId(c, id, oldId);
            }
        }
    }

    onConfigChange({ name }) {
        // The $renderConfigs Set is either on our prototype (due to renderConfigs getter) or on our instance (due to
        // renderContext getter):
        if (!this.isConfiguring && this.$renderConfigs.has(name)) {
            this.refreshDom();
        }
    }

    //endregion

    //region Rendering

    /**
     * This method is called by `DomHelper.createElement` and `DomSync.sync` as new reference elements are created.
     * @param {String} name The name of the element, i.e., the value of its `reference` attribute.
     * @param {HTMLElement} el The element instance
     * @param {Object} domConfig The DOM config object.
     * @private
     */
    attachRef(name, el, domConfig) {
        const
            me = this,
            key = '_' + name,
            { listeners } = domConfig;

        if (!(key in me)) {
            defineProperty(me, name, {
                get() {
                    // Asking for a ref el is a good sign that we need to sync the DOM:
                    me.refreshDom.flush();

                    return me[key];
                },
                set(el) {
                    me[key] = el;

                    // Key elements contain owner pointer (Not supported on IE SVG).
                    // if (el && el.dataset) {
                    //     el.dataset.ownerCmp = me.id;
                    // }
                }
            });
        }

        el.id = `${me.id}-${name}`;

        me.byRef[name] = el;
        me[name] = el;

        if (listeners) {
            domConfig.listeners = {
                on : listeners,
                un : EventHelper.on(Object.assign({
                    element : el,
                    thisObj : me
                }, listeners))
            };
        }
    }

    /**
     * This method is called by `DomSync.sync` as reference elements are removed from the DOM.
     * @param {String} name The name of the element, i.e., the value of its `reference` attribute.
     * @param {HTMLElement} el The element instance
     * @param {Object} domConfig The DOM config object.
     * @private
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
     * This method returns a {@link Core.helper.DomHelper#function-createElement-static} config object that describes
     * the desired elements for this instance.
     *
     * This method is called to produce the initial DOM structure and again as necessary to generate the DOM for the
     * current state. The DOM produced by these subsequent calls is then passed through
     * {@link Core.helper.DomSync#function-sync-static DomSync.sync()} to update the DOM.
     * @returns {Object}
     */
    renderDom() {
        // abstract method provided by derived class
        return {};
    }

    /**
     * This property is the object to use when calling the `renderDom` method. It may evaluate to this instance (if
     * the class declares its render configs) or a helper object to track config usage during the `renderDom` call.
     * @property {Object}
     * @private
     */
    get renderContext() {
        const
            me = this,
            meta = me.$meta,
            C = me.constructor;

        let renderConfigs = meta.renderConfigs || C.renderConfigs,
            context = me;

        // If the class author did not declare any configs as render:true, then we make a proxy-like object that can
        // detect getter calls to build that Set. Since the getters may not all trigger on any given rendering, we
        // cannot share this work across instances since they may take different control paths.
        if (!renderConfigs) {
            context = Object.create(me);
            renderConfigs = new Set();

            for (const name in meta.configs) {
                defineProperty(context, name, {
                    get() {
                        renderConfigs.add(name);
                        return me[name];
                    }
                });
            }

            // In order to be substitutable for the Renderable, we need the same method name... we just need to run
            // renderDom w/ our context as "this":
            context.renderDom = () => {
                return me.renderDom.call(context);
            };

            me.$renderConfigs = renderConfigs;

            //<debug>
            Object.freeze(context);
            //</debug>
        }

        // Replace this getter with the actual context so we don't get called again:
        defineProperty(me, 'renderContext', {
            value : context
        });

        return context;
    }

    /**
     * This method synchronized the DOM produced by {@link #function-renderDom} with what was previously produced and
     * updates the elements accordingly.
     *
     * This method is buffered such that calls to it do not immediately execute. To perform the refresh immediately,
     * do this:
     *```
     *  instance.refreshDom.now();
     *```
     * To flush any potential updates to the DOM (and do nothing if there are none), do this:
     *```
     *  instance.refreshDom.flush();
     *```
     * To determine if there are updates to the DOM pending, do this:
     *```
     *  if (instance.refreshDom.isPending) {
     *      ...
     *  }
     *```
     */
    refreshDom() {
        DomSync.sync({
            targetElement : this.element,
            domConfig     : this.renderContext.renderDom(),
            refOwner      : this,

            // This limits the sync() to only removing the classes and styles added by previous renderings. This
            // allows dynamically added styles and classes to be preserved:
            strict : true
        });
    }

    //endregion

    onListen(eventName) {
        // Only add the b-drawable-el when someone first listens for the draw event since it may never happen...
        if (eventName === 'draw') {
            this.initDrawable();
        }
    }

    initDrawable() {
        const me = this;

        if (!me.intersector) {
            let el = Object.values(me.byRef).find(el => el.classList.contains('b-drawable'));

            if (!el) {
                el = me.element;
                el.classList.add('b-drawable');
            }

            // TODO Not supported in IE11 even w/polyfills at the moment
            me.intersector = true;
            // me.intersector = new IntersectionObserver(entries => {
            //     if (!me.isDestroyed) {
            //         entries.forEach(ent => {
            //             if (ent.isIntersecting) {
            //                 me.onDraw({
            //                     count : ++me.drawCounter
            //                 });
            //             }
            //         });
            //     }
            // });
            //
            // me.intersector.observe(el);

            EventHelper.on({
                element : DomHelper.createElement({ parent : el, class : 'b-drawable-el' }),

                animationend({ animationName }) {
                    if (animationName === 'b-drawable-anim') {
                        me.onDraw({
                            count : ++me.drawCounter
                        });
                    }
                }
            });
        }
    }

    onDraw(ev) {
        this.trigger('draw', ev);
    }
}

Renderable.$idSeed = 0;

Object.assign(Renderable.prototype, {
    drawCounter    : 0,
    hasGeneratedId : false,
    intersector    : null
});
