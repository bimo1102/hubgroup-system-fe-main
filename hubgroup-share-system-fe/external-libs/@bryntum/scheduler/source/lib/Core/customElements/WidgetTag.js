/**
 * @module Core/customElements/WidgetTag
 */

import BrowserHelper from '../helper/BrowserHelper.js';
import DomHelper from '../helper/DomHelper.js';
import Tooltip from '../widget/Tooltip.js';

/**
 * A base class for a custom web component element wrapping one {@link Core.widget.Widget}.
 */
export default class WidgetTag extends (window.customElements ? HTMLElement : Object) {
    /**
     * The widget instance rendered in the shadow root
     * @property {Core.widget.Widget}
     * @name widget
     */

    /**
     * Path to theme to use within the web component.
     *
     * ```html
     * <bryntum-grid stylesheet="resources/grid.stockholm.css">
     * </bryntum-grid>
     * ```
     *
     * @config {String} stylesheet
     */

    /**
     * Path to folder containing Font Awesome 5 Free.
     *
     * ```html
     * <bryntum-grid fa-path="resources/fonts">
     * </bryntum-grid>
     * ```
     *
     * @config {String} faPath
     */

    connectedCallback() {
        this.setup();
    }

    async setup() {
        const me = this;

        // Setup just once
        if (me.shadowRoot) {
            return;
        }

        let linkResolver, font;

        const
            product    = me.tagName.substring('BRYNTUM-'.length).toLowerCase(),
            // Only load fa if not already on page, otherwise each instance will load it
            faPath     = (!BrowserHelper.isChrome || !document.fonts.check(`normal 14px "Font Awesome 5 Free"`)) && me.getAttribute('fa-path'),
            themeLink  = document.getElementById('bryntum-theme'),
            theme      = me.getAttribute('theme') || 'stockholm',
            stylesheet = me.getAttribute('stylesheet') || themeLink?.href || `${product}.${theme}.css`,
            // Go over to the dark side
            shadowRoot = me.attachShadow({ mode : 'open' }),
            // Include css and target div in shadow dom
            link       = me.linkTag = DomHelper.createElement({
                tag    : 'link',
                rel    : 'stylesheet',
                href   : stylesheet,
                parent : shadowRoot
            }),
            promises   = [new Promise(resolve => {
                linkResolver = resolve;
            })],
            config = {
                appendTo : shadowRoot,
                features : {}
            };

        me.convertDatasetToConfigs(me.dataset, config);

        link.onload = () => linkResolver();

        // Load FontAwesome if path was supplied
        if (faPath) {
            // FF cannot use the name "Font Awesome 5 Free", have if fixed in CSS to handle it also without spaces
            font = new FontFace(BrowserHelper.isFirefox ? 'FontAwesome5Free' : 'Font Awesome 5 Free', `url("${faPath}/fa-solid-900.woff2")`);
            promises.push(font.load());
        }

        await Promise.all(promises);

        if (font) {
            document.fonts.add(font);
        }

        // Create columns, data and configure features
        for (const tag of me.children) {
            const tagName = tag.tagName;

            if (tagName === 'FEATURE') {
                const
                    name          = tag.dataset.name,
                    featureConfig = Object.assign({}, tag.dataset);

                delete featureConfig.name;

                if (Object.keys(featureConfig).length) {
                    config.features[name] = featureConfig;
                }
                else {
                    config.features[name] = tag.textContent !== 'false';
                }
            }
            else if (tagName === 'TBAR' || tagName === 'BBAR') {
                config[tagName.toLowerCase()] = Array.from(tag.children).map(item => me.convertDatasetToConfigs(item.dataset));
            }
            else if (tagName === 'INLINESTYLE') {
                const style = document.createElement('style');
                style.innerHTML = tag.innerHTML;
                shadowRoot.appendChild(style);
            }
        }

        me.widget = me.createInstance(config);
    }

    convertDatasetToConfigs(dataset, config = {}) {
        for (const key in dataset) {
            let value = dataset[key];

            switch (value) {
                case 'true':
                case 'false':
                case 'null':
                    value = JSON.parse(value);
                    break;
            }

            config[key] = value;
        }

        return config;
    }

    /**
     * Destroys the inner widget instance and cleans up
     */
    destroy() {
        const me = this;

        if (!me.widget) {
            // Removed before anything could be created
            return;
        }

        const
            { shadowRoot } = me,
            sharedTips     = shadowRoot.bryntum,
            constructor    = me.widget.constructor,
            floatRoot      = shadowRoot.querySelector('.b-float-root');

        sharedTips?.tooltip?.get(Tooltip)?.destroy();
        sharedTips?.errorTooltip?.destroy();
        me.widget.destroy();
        floatRoot?.remove();
        constructor.removeFloatRoot(floatRoot);
        me.linkTag.remove();

        // <debug>
        if (shadowRoot.children.length > 0) {
            throw new Error(`Leaked elements in shadowRoot: ${Array.from(shadowRoot.children).map(el => el)}`);
        }
        // </debug>
        me.widget = null;
    }
}
