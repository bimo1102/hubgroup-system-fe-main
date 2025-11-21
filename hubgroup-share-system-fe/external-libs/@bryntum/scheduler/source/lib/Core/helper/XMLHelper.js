import Objects from './util/Objects.js';
import StringHelper from './StringHelper.js';

/**
 * @module Core/helper/XMLHelper
 */

/**
 * Helper for XML manipulation.
 */
export default class XMLHelper {
    /**
     * Convert an javascript object to a XML string.
     *
     * From:
     * ```javascript
     * {
     *     name : 'Task 1',
     *     data : [
     *         {
     *             text : 'foo 1',
     *             ref  : 'fooItem 1'
     *         },
     *         {
     *             text : 'foo 2',
     *             ref  : 'fooItem 2'
     *         }
     *     ]
     * }
     * ```
     *
     * To:
     * ```xml
     * <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
     * <root>
     *     <name>Task 1</name>
     *     <data>
     *         <element>
     *             <text>foo 1</text>
     *             <ref>fooItem 1</ref>
     *         </element>
     *         <element>
     *             <text>foo 2</text>
     *             <ref>fooItem 2</ref>
     *         </element>
     *     </data>
     * </root>
     * ```
     *
     * @param {Object} obj Object to convert.
     * @param {Object} [options] Convert options.
     * @param {String} [options.rootName] Root name for the XML. `root` by default.
     * @param {String} [options.elementName] Element name for each node of the XML. `element` by default.
     * @param {String} [options.xmlns] Add value for xmlns property for the root tag of the XML.
     * @param {Boolean} [options.includeHeader] `false` to not include the header `<?xml version="1.0" encoding="UTF-8"?>` on top of the XML.
     * @param {Boolean} [options.rootElementForArray] `false` to not include a root element for array of items. e.g. for the above example:
     * ```xml
     * <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
     * <root>
     *     <name>Task 1</name>
     *     <element>
     *         <text>foo 1</text>
     *         <ref>fooItem 1</ref>
     *     </element>
     *     <element>
     *         <text>foo 2</text>
     *         <ref>fooItem 2</ref>
     *     </element>
     * </root>
     * ```
     * @returns {String} the XML
     */
    static convertFromObject(obj, options = {}) {
        // override default values
        Objects.assignIf(options, {
            rootName            : 'root',
            elementName         : 'element',
            includeHeader       : true,
            rootElementForArray : true 
        });

        const { rootName, elementName, includeHeader, rootElementForArray } = options;
        let { xmlns } = options;

        xmlns = xmlns ? ` xmlns="${xmlns}"` : '';
        const header = includeHeader ? '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' : '';

        const converter = (o) => {
            const xmlItems = [];

            for (const key in o) {
                const item = o[key];

                if (Array.isArray(item)) {
                    if (rootElementForArray) {
                        xmlItems.push(`<${key}>`);
                    }

                    for (const subItem of item) {
                        if (elementName.length) {
                            xmlItems.push(`<${elementName}>`);
                        }
                        else {
                            xmlItems.push(`<${key}>`);
                        }

                        xmlItems.push(converter(subItem));

                        if (elementName.length) {
                            xmlItems.push(`</${elementName}>`);
                        }
                        else {
                            xmlItems.push(`</${key}>`);
                        }
                    }

                    if (rootElementForArray) {
                        xmlItems.push(`</${key}>`);
                    }
                }
                else if (Objects.isObject(item)) {
                    xmlItems.push(`<${key}>${converter(item)}</${key}>`);
                }
                else {
                    if (item == null) {
                        xmlItems.push(`<${key}/>`);
                    }
                    else {
                        xmlItems.push(`<${key}>${StringHelper.encodeHtml(item)}</${key}>`);
                    }
                }
            }

            return xmlItems.join('');
        };

        return `${header}<${rootName}${xmlns}>${converter(obj)}</${rootName}>`;
    }
}
