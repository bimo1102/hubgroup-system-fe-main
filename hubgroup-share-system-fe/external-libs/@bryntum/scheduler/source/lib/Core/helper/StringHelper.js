// IMPORTANT - adding imports here can create problems for Base class

import VersionHelper from './VersionHelper.js';

/**
 * @module Core/helper/StringHelper
 */

let charsToEncode, entitiesToDecode, htmlEncodeRe, htmlDecodeRe;

const
    camelLettersRe = /([a-z])([A-Z])/g,
    crlfRe         = /[\n\r]/g,
    escapeRegExpRe = /[.*+?^${}()|[\]\\]/g, // same as NPM escape-string-regexp
    htmlRe         = /[&<]/,
    idRe           = /(^[^a-z]+|[^\w]+)/gi,
    whiteSpaceRe   = /\s+/,

    htmlDecoder = (m, captured) => entitiesToDecode[captured.toLowerCase()] || String.fromCharCode(parseInt(captured.substr(2), 10)),
    htmlEncoder = (m, captured) => charsToEncode[captured],

    hyphenateCamelLetters = (all, g1, g2) => {
        return `${g1}-${g2.toLowerCase()}`;
    },
    separateCamelLetters = (all, g1, g2) => {
        return `${g1} ${g2.toLowerCase()}`;
    },
    replaceNonIdChar    = c => {
        if (c) {
            return `_x${c.charCodeAt(0).toString(16)}`;
        }
        return '__blank__';
    },
    hyphenateCache = {},
    separatedCache = {};

/**
 * Helper for string manipulation.
 */
export default class StringHelper {

    //region Transform

    /**
     * Capitalizes the first letter of a string, "myString" -> "MyString".
     * @param {String} string The string to capitalize
     * @returns {String} The capitalized string or the value of `string` if falsy.
     * @category String formatting
     */
    static capitalize(string) {
        return string && (string[0].toUpperCase() + string.substr(1));
    }

    /**
     * Capitalizes the first letter of a string, "myString" -> "MyString".
     * If the parameter is falsy, `null` is returned.
     * @param {String} string The string to capitalize
     * @returns {String} The capitalized string or `null` if `string` is falsy.
     * @deprecated 4.0 Use {@link #function-capitalize} instead.
     * @category String formatting
     */
    static capitalizeFirstLetter(string) {
        VersionHelper.deprecate('Core', '5.0.0', 'Deprecated in favor of `capitalize()`, will be removed in 5.0');

        return string ? string[0].toUpperCase() + string.substr(1) : null;
    }

    /**
     * Makes the first letter of a string lowercase, "MyString" -> "myString".
     * If the parameter is falsy, `null` is returned.
     * @param {String} string The string to lowercase.
     * @returns {String} The lowercased string or `null` if `string` is falsy.
     * @deprecated 4.0 Use {@link #function-uncapitalize} instead.
     * @category String formatting
     */
    static lowercaseFirstLetter(string) {
        VersionHelper.deprecate('Core', '5.0.0', 'Deprecated in favor of `uncapitalize()`, will be removed in 5.0');
        if (!string) {
            return null;
        }
        return string[0].toLowerCase() + string.substr(1);
    }

    /**
     * Makes the first letter of a string lowercase, "MyString" -> "myString".
     * @param {String} string The string to un-capitalize.
     * @returns {String} The un-capitalized string or the value of `string` if falsy.
     * @category String formatting
     */
    static uncapitalize(string) {
        return string && (string[0].toLowerCase() + string.substr(1));
    }

    /**
     * Converts the passed camelCased string to a hyphen-separated string. eg "minWidth" -> "min-width"
     * @param {String} string The string to convert.
     * @return {String} The string with adjoining lower and upper case letters
     * separated by hyphens and converted to lower case.
     * @category String formatting
     * @internal
     */
    static hyphenate(string) {
        // Cached since it is used heavily with DomHelper.sync()
        const cached = hyphenateCache[string];
        if (cached) {
            return cached;
        }
        return hyphenateCache[string] = string.replace(camelLettersRe, hyphenateCamelLetters);
    }

    /**
     * Converts the passed camelCased string to a capitalized, space-separated string. eg "startDate" -> "Start date".
     * @param {String} string The string to convert.
     * @return {String} The string with spaces separating words.
     * @category String formatting
     * @internal
     */
    static separate(string) {
        // Cached since it may be used heavily
        const cached = separatedCache[string];
        if (cached) {
            return cached;
        }
        return separatedCache[string] = this.capitalize(string.replace(camelLettersRe, separateCamelLetters));
    }

    /**
     * Creates an alphanumeric identifier from any passed string. Encodes spaces and non-alpha characters.
     * @param {String} inString The string from which to strip non-identifier characters.
     * @return {String}
     * @category Misc
     * @internal
     */
    static createId(inString) {
        return String(inString).replace(idRe, replaceNonIdChar);
    }

    //endregion

    //region Html

    static escapeRegExp(string, flags) {
        // $& means the whole matched string
        let ret = string.replace(escapeRegExpRe, '\\$&');

        if (flags !== undefined) {
            ret = new RegExp(ret, flags);
        }

        return ret;
    }

    /**
     * This method decodes HTML entities and returns the original HTML.
     *
     * See also {@link #function-encodeHtml-static}.
     * @param {String} str
     * @returns {String}
     * @category HTML
     */
    static decodeHtml(str) {
        return str && String(str).replace(htmlDecodeRe, htmlDecoder);
    }

    /**
     * This method encodes HTML entities and returns a string that can be placed in the document and produce the
     * original text rather than be interpreted as HTML. Using this method with user-entered values prevents those
     * values from executing as HTML (i.e., a cross-site scripting or "XSS" security issue).
     *
     * See also {@link #function-decodeHtml-static}.
     * @param {String} str
     * @returns {String}
     * @category HTML
     */
    static encodeHtml(str) {
        return str && String(str).replace(htmlEncodeRe, htmlEncoder);
    }

    /**
     * This method is similar to {@link #function-encodeHtml-static} except that `\n` and `\r` characters in the
     * given `str` are replaced by `<br>` tags _after_ first being encoded by {@link #function-encodeHtml-static}.
     * @param {String} str
     * @returns {String}
     * @category HTML
     * @internal
     */
    static encodeHtmlBR(str) {
        return StringHelper.encodeHtml(str)?.replace(crlfRe, '<br>');
    }

    /**
     * Returns `true` if the provided `text` contains special HTML characters.
     * @param {String} text
     * @returns {Boolean}
     * @category HTML
     * @internal
     */
    static isHtml(text) {
        return typeof text === 'string' && htmlRe.test(text || '');
    }

    /**
     * Initializes HTML entities used by {@link #function-encodeHtml-static} and {@link #function-decodeHtml-static}.
     * @param {Object} [mappings] An object whose keys are characters that should be encoded and values are the HTML
     * entity for the character.
     * @private
     */
    static initHtmlEntities(mappings) {
        mappings = mappings || {
            '&' : '&amp;',
            '>' : '&gt;',
            '<' : '&lt;',
            '"' : '&quot;',
            "'" : '&#39;'
        };

        const chars = Object.keys(mappings);

        // Maps '<' to '&lt;'
        charsToEncode = mappings;

        // Inverts the mapping so we can convert '&lt;' to '<'
        entitiesToDecode = chars.reduce((prev, val) => {
            prev[mappings[val]] = val;
            return prev;
        }, {});

        // Creates a regex char set like /([<&>])/g to match the characters that need to be encoded (escaping any of
        // the regex charset special chars '[', ']' and '-'):
        htmlEncodeRe = new RegExp(`([${chars.map(c => '[-]'.includes(c) ? '\\' + c : c).join('')}])`, 'g');

        // Creates a regex like /(&lt;|&amp;|&gt;)/ig to match encoded entities... good news is that (valid) HTML
        // entities do not contain any regex special characters:
        htmlDecodeRe = new RegExp(`(${Object.values(mappings).join('|')}|&#[0-9]+;)`, 'ig');
    }

    //endregion

    //region JSON

    /**
     * Parses JSON inside a try-catch block. Returns null if the string could not be parsed.
     *
     * @param {String} string String to parse
     * @returns {Object} Resulting object or null if parse failed
     * @category JSON
     */
    static safeJsonParse(string) {
        let parsed = null;

        try {
            parsed = JSON.parse(string);
        }
        catch (e) {
        }

        return parsed;
    }

    /**
     * Stringifies an object inside a try-catch block. Returns null if an exception is encountered.
     *
     * See [JSON.stringify on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
     * for more information on the arguments.
     *
     * @param {Object} object The object to stringify
     * @param {Function|String[]|Number[]} [replacer] A function or array of string/number used to determine properties
     * to include in the JSON string
     * @param {String|Number} [space] Number of spaces to indent or string used as whitespace
     * @returns {Object} Resulting object or null if stringify failed
     * @category JSON
     */
    static safeJsonStringify(object, replacer = null, space = null) {
        let result = null;

        try {
            result = JSON.stringify(object, replacer, space);
        }
        catch (e) {
        }

        return result;
    }

    //endregion

    //region Split & join

    /**
     * Joins all given paths together using the separator as a delimiter and normalizes the resulting path.
     * @param paths {Array} array of paths to join
     * @param pathSeparator [{String}] path separator. Default value is '/'
     * @return {String}
     * @category Misc
     * @internal
     */
    static joinPaths(paths, pathSeparator = '/') {
        return paths.join(pathSeparator).replace(new RegExp('\\' + pathSeparator + '+', 'g'), pathSeparator);
    }

    /**
     * Returns the provided string split on whitespace. If the string is empty or consists of only whitespace, the
     * returned array will be empty. If `str` is not a string, it is simply returned. This allows `null` or already
     * split strings (arrays) to be passed through.
     *
     * For example:
     * ```
     *  console.log(StringHelper.split(' abc def xyz   '));
     *  > ['abc', 'def', 'xyz']
     *  console.log(StringHelper.split(''));
     *  > []
     * ```
     * Compare to the standard `split()` method:
     * ```
     *  console.log(' abc def xyz   '.split(/\s+/));
     *  > ['', 'abc', 'def', 'xyz', '']
     *  console.log(''.split(/\s+/));
     *  > ['']
     * ```
     * @param {String} str
     * @param {String|RegExp} delimiter
     * @returns {String[]}
     * @category Misc
     * @internal
     */
    static split(str, delimiter = whiteSpaceRe) {
        let ret = str;

        if (typeof ret === 'string') {
            ret = str.trim();  // w/o trim() whitespace on the ends will give us '' in the array
            ret = ret ? ret.split(delimiter) : []; // also ''.split() = ['']
        }

        return ret;
    }

    //endregion

    //region XSS

    /**
     * This is a tagged template function that performs HTML encoding on replacement values to avoid XSS (Cross-Site
     * Scripting) attacks.
     *
     * For example:
     *
     * ```javascript
     *  eventRenderer(eventRecord) {
     *      return StringHelper.xss`<span class="${eventRecord.attrib}">${eventRecord.name}</span>`;
     *  }
     * ```
     *
     * See {@link Core.helper.StringHelper#function-encodeHtml-static}.
     */
    static xss(strings, ...values) {
        const buf = [];

        let i = values.length;

        buf[i] = strings[i];

        while (i-- > 0) {
            buf[i] = strings[i] + StringHelper.encodeHtml(values[i]);
        }

        return buf.join('');
    }

    /**
     * This is a tagged template function that performs HTML encoding on replacement values to avoid XSS (Cross-Site
     * Scripting) attacks. Unlike {@link Core.helper.StringHelper#function-xss-static}, this method converts `\n` and
     * `\r` characters into `<br>` tags.
     *
     * For example:
     *
     * ```javascript
     *  eventRenderer(eventRecord) {
     *      return StringHelper.xssBR`<span class="${eventRecord.attrib}">${eventRecord.name}</span>`;
     *  }
     * ```
     *
     * See {@link Core.helper.StringHelper#function-encodeHtmlBR-static}.
     * @internal
     */
    static xssBR(strings, ...values) {
        const buf = [];

        let i = values.length;

        buf[i] = strings[i];

        while (i-- > 0) {
            buf[i] = strings[i] + StringHelper.encodeHtmlBR(values[i]);
        }

        return buf.join('');
    }

    //endregion
}

StringHelper.initHtmlEntities();
