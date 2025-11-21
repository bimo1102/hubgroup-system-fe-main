import Base from '../../Base.js';
import Events from '../../mixin/Events.js';
import Factoryable from '../../mixin/Factoryable.js';
import DomHelper from '../../helper/DomHelper.js';

/**
 * @module Core/widget/layout/Layout
 */

/**
  * A helper class used by {@link Core.widget.Container Container}s which renders child widgets to their
  * {@link Core.widget.Widget#property-contentElement}. It also adds the Container's
  * {@link Core.widget.Container#config-itemCls} class to child items.
  *
  * Subclasses may modify the way child widgets are rendered, or may offer APIs for manipulating the child widgets.
  *
  * The {@link Core.widget.layout.Card Card} layout class offers slide-in, slide-out animation of multiple
  * child widgets. {@link Core.widget.TabPanel} uses Card layout.
  */
export default class Layout extends Base.mixin(Events, Factoryable) {
    static get type() {
        return 'default';
    }

    static get configurable() {
        return {
            /**
             * The owning Widget.
             * @member {Core.widget.Widget} owner
             * @readonly
             */
            /**
             * @config {Core.widget.Widget} owner
             * @private
             */
            owner : null,

            /**
             * The CSS class which should be added to the owning {@link Core.widget.Container}'s.
             * {@link Core.widget.Widget#property-contentElement}.
             * @config {String}
             */
            containerCls : 'b-auto-container',

            /**
             * The CSS class which should be added to the encapsulating element of child items.
             * @config {String}
             */
            itemCls : null
        };
    }

    static get factoryable() {
        // establish this class as the Factoryable base
        return {
            defaultType : 'default'
        };
    }

    get contentElement() {
        return this.owner?.contentElement;
    }

    onChildAdd(item) {
    }

    onChildRemove(item) {
    }

    renderChildren() {
        const
            me                               = this,
            { owner, containerCls, itemCls } = me,
            { contentElement, items }        = owner,
            ownerItemCls                     = owner.itemCls,
            itemCount                        = items?.length;

        contentElement.classList.add('b-content-element');

        if (containerCls) {
            contentElement.classList.add(containerCls);
        }

        // Need to check that container has widgets, for example TabPanel can have no tabs
        if (itemCount) {
            owner.textContent = false;

            for (let i = 0; i < itemCount; i++) {
                const
                    item = items[i],
                    { element } = item;

                element.dataset.itemIndex = i;
                if (itemCls) {
                    element.classList.add(itemCls);
                }
                if (ownerItemCls) {
                    element.classList.add(ownerItemCls);
                }

                // If instantiated by the app developer, external to Container#createWidget
                // a widget will have the b-outer class. Remove that if it' contained.
                element.classList.remove('b-outer');

                // Only trigger paint if the owner is itself painted, otherwise
                // the outermost Container will cascade the paint signal down.
                item.render(contentElement, Boolean(owner.isPainted));
            }
        }

        me.syncPendingConfigs();
        me.syncChildCount();
    }

    removeChild(child) {
        const
            me                 = this,
            { element }        = child,
            { owner, itemCls } = me,
            { contentElement } = owner,
            ownerItemCls       = owner.itemCls;

        // Chrome has turned very fussy recently.
        // If the parent does not contain the child to be removed, it throws.
        if (contentElement.contains(element)) {
            element.remove();
        }

        delete element.dataset.itemIndex;

        if (itemCls) {
            element.classList.remove(itemCls);
        }

        if (ownerItemCls) {
            element.classList.remove(ownerItemCls);
        }

        me.fixChildIndices();
        me.syncChildCount();
    }

    appendChild(child) {
        const
            { element }        = child,
            { owner, itemCls } = this,
            { contentElement } = owner,
            ownerItemCls       = owner.itemCls;

        element.dataset.itemIndex = owner.indexOfChild(child);

        owner.textContent = false;

        if (itemCls) {
            element.classList.add(itemCls);
        }

        if (ownerItemCls) {
            element.classList.add(ownerItemCls);
        }

        child.render(contentElement, Boolean(owner.isPainted));

        this.syncChildCount();
    }

    insertChild(toAdd, childIndex) {
        const
            me                 = this,
            { element }        = toAdd,
            { owner, itemCls } = me,
            { contentElement } = owner,
            nextSibling        = DomHelper.getChild(contentElement, `[data-item-index="${childIndex}"]`),
            ownerItemCls       = owner.itemCls;

        owner.textContent = false;

        if (itemCls) {
            element.classList.add(itemCls);
        }

        if (ownerItemCls) {
            element.classList.add(ownerItemCls);
        }

        contentElement.insertBefore(element, nextSibling);

        toAdd.render(null, Boolean(owner.isPainted));

        me.fixChildIndices();
        me.syncChildCount();
    }

    fixChildIndices() {
        this.owner.items.forEach((child, index) => {
            child.element.dataset.itemIndex = index;
        });
    }

    syncChildCount() {
        const
            { owner }  = this,
            { length } = owner.items;

        // Special CSS conditions may apply if there's only a single child.
        owner.contentElement?.classList[length === 1 ? 'add' : 'remove']('b-single-child');
    }

    /**
     * Registers a layout `config` property that cannot be acted upon at this time but must wait for the `owner` to
     * fully render its elements (in particular the `contentElement`).
     * @param {String} config The name of the config to sync later.
     * @internal
     */
    syncConfigLater(config) {
        const pendingConfigs = this.pendingConfigs || (this.pendingConfigs = []);

        if (!pendingConfigs.includes(config)) {
            pendingConfigs.push(config);
        }
    }

    /**
     * Sets the specified `style` to the value of the config given its `name`.
     * @param {String} name The name of the config with the value to apply to the given `style`.
     * @param {String} style The style property to set on the `contentElement`.
     * @param {Object} [map] An option object to convert the config's value to the `style` value.
     * @internal
     */
    syncConfigStyle(name, style, map) {
        const
            me = this,
            { contentElement } = me,
            value = me[name];

        if (contentElement) {
            contentElement.style[style] = map?.[value] || value;
        }
        else {
            me.syncConfigLater(name);
        }
    }

    syncPendingConfigs() {
        const
            me = this,
            { pendingConfigs } = me;

        let name;

        if (pendingConfigs) {
            me.pendingConfigs = null;

            while ((name /* assignment */ = pendingConfigs.pop())) {
                me[me.$meta.configs[name].updater](me[name]);
            }
        }
    }
}

Layout.initClass();
