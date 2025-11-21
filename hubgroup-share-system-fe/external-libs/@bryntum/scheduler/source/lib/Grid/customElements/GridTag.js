import Grid from '../view/Grid.js';
import WidgetTag from '../../Core/customElements/WidgetTag.js';

//TODO: If we want to improve on this, add settings as attributes, replace data-field with field etc.

/**
 * @module Grid/customElements/GridTag
 */

/**
 * Import this file to be able to use the tag &lt;bryntum-grid&gt; to create a grid.
 *
 * This is more of a proof of concept than a ready to use class. Example:
 *
 * ```html
 * <bryntum-grid>
 *   <column data-field="name">Name</column>
 *   <column data-field="city">City</column>
 *   <column data-field="food">Food</column>
 *   <data data-id="1" data-name="Daniel" data-city="Stockholm" data-food="Hamburgers"></data>
 *   <data data-id="2" data-name="Steve" data-city="Lund" data-food="Pasta"></data>
 *   <data data-id="3" data-name="Sergei" data-city="St Petersburg" data-food="Pizza"></data>
 * </bryntum-grid>
 * ```
 *
 * To get styling correct, supply the path to the theme you want to use and to the folder that holds Font Awesome:
 *
 * ```html
 * <bryntum-grid stylesheet="resources/grid.stockholm.css" fa-path="resources/fonts">
 * </bryntum-grid>
 * ```
 *
 * Any entries in the tags dataset (attributes starting with `data-`) will be applied as configs of the Grid:
 *
 * ```html
 * <bryntum-grid data-row-height="100">
 * </bryntum-grid>
 * ```
 *
 * NOTE: Remember to call {@link #function-destroy} before removing this web component from the DOM to avoid memory
 * leaks.
 *
 * @demo Grid/webcomponents
 * @extends Core/customElements/WidgetTag
 */
export default class GridTag extends WidgetTag {
    createInstance(config) {
        const
            columns    = [],
            data       = [];

        // Create columns, data and configure features
        for (const tag of this.children) {
            if (tag.tagName === 'COLUMN') {
                const
                    width  = parseInt(tag.dataset.width),
                    flex   = parseInt(tag.dataset.flex),
                    column = {
                        field : tag.dataset.field,
                        text  : tag.innerHTML
                    };

                if (width) column.width = width;
                else if (flex) column.flex = flex;
                else column.flex = 1;

                columns.push(column);
            }
            else if (tag.tagName === 'DATA') {
                const row = {};
                Object.assign(row, tag.dataset);
                data.push(row);
            }
        }

        // Render as usual
        return new Grid(Object.assign(config, {
            columns,
            data
        }));
    }
}

// Try-catch to make trial work
try {
    window.customElements && window.customElements.define('bryntum-grid', GridTag);
}
catch (error) {

}
