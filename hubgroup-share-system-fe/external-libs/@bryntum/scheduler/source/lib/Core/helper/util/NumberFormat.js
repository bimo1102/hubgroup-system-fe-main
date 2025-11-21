import Formatter from './Formatter.js';
import StringHelper from '../StringHelper.js';
import LocaleManager from '../../localization/LocaleManager.js';
import '../../localization/En.js';

/**
 * @module Core/helper/util/NumberFormat
 */

const
    escapeRegExp = StringHelper.escapeRegExp,
    digitsRe = /[\d+-]/g,
    // We cannot pass locale=null:
    newFormatter = (locale, config) => new Intl.NumberFormat(locale || undefined, config),
    numFormatRe = /^(?:([$])\s*)?(?:(\d+)>)?\d+(,\d+)?(?:\.((\d*)(?:#*)|[*]))?(?:\s*([%])?)?$/;

class NumberParser {
    constructor(formatter) {
        const
            me = this,
            locale = formatter.locale,
            // We need a formatter for this locale that has decimals and grouping:
            numFmt = newFormatter(locale, {
                maximumFractionDigits : 3
            }),
            currency = formatter.is.currency ? me._decodeStyle(locale, {
                style           : 'currency',
                currency        : formatter.currency,
                currencyDisplay : formatter.currencyDisplay
            }) : null,
            percent = formatter.is.percent ? me._decodeStyle(locale, {
                style : 'percent'
            }) : null,
            decimal = numFmt.format(1.2).replace(digitsRe, '')[0],
            grouper = numFmt.format(1e9).replace(digitsRe, '')[0] || '';

        Object.assign(me, { currency, decimal, formatter, grouper, percent });

        me.decimal = decimal;
        me.decimalRe = escapeRegExp(decimal, 'g');
        me.grouper = grouper;

        // The stripRe removes whitespace, currency text, percent text and grouping chars:
        me.stripRe = new RegExp(
            `(?:\\s+|${escapeRegExp(grouper)})` +
            (currency ? `|(?:${escapeRegExp(currency.text)})` : '') +
            (percent ? `|(?:${escapeRegExp(percent.text)})` : ''),
            'g');

        //<debug>
        Object.freeze(me);
        Object.freeze(currency);
        Object.freeze(percent);
        //</debug>
    }

    decimalPlaces(value) {
        value = value.replace(this.stripRe, '');

        const dot = value.indexOf(this.decimal) + 1;

        return dot && (value.length - dot);
    }

    parse(value, strict) {
        if (typeof value === 'string') {
            value = value.replace(this.stripRe, '').replace(this.decimalRe, '.');

            value = strict ? Number(value) : parseFloat(value);

            if (this.formatter.is.percent) {
                value /= 100;
            }
        }
        // else, a number is already parsed but could be null...

        return value;
    }

    _decodeStyle(locale, fmtDef) {
        const
            fmt = newFormatter(locale, fmtDef),
            decFmt = newFormatter(locale, Object.assign(
                fmt.resolvedOptions(),
                { style : 'decimal' }
            )),
            zero = fmt.format(0),  // = '0%' or '$0.00' in en-US
            zeroDec = decFmt.format(0);  // = '0' or '0.00' in en-US

        return {
            suffix : zero.startsWith(zeroDec),
            text   : zero.replace(zeroDec, '').trim()
        };
    }
}

/**
 * This class is an enhancement to `Intl.NumberFormat` that has a more flexible
 * constructor as well as other features such as `parse()`.
 *
 * All constructor forms take a single argument. The most common is to pass a format
 * {@link #config-template} string:
 *```
 *  const formatter = new NumberFormat('9,999.99##');
 *```
 * The above is equivalent to:
 *```
 *  const formatter = new Intl.NumberFormat({
 *      useGrouping           : true,
 *      minimumFractionDigits : 2,
 *      maximumFractionDigits : 4
 *  });
 *```
 * The `formatter` created above is used as follows (in the `en-US` locale):
 *```
 *  console.log(formatter.format(12345.54321));
 *  console.log(formatter.format(42));
 *
 *  // 12,345.5432
 *  // 42.00
 *```
 * When a format template is insufficient, a config object can be provided, similar to
 * `Intl.NumberFormat`'s `options` parameter. While all options from `Intl.NumberFormat`
 * are valid properties for this class's config object, additional properties are
 * supported.
 *
 * For example:
 *```
 *  new NumberFormat({
 *      locale      : 'en-US',
 *      template    : '$9,999',
 *      currency    : 'USD',
 *      significant : 5
 *  });
 *```
 * The `locale` option takes the place of the first positional parameter to the
 * `Intl.NumberFormat` constructor. The `template` config is the same string that can be
 * passed by itself.
 *
 * The shorthand properties `fraction`, `integer`, and `significant` set the standard
 * options `minimumFractionDigits`, `maximumFractionDigits`, `minimumIntegerDigits`,
 * `minimumSignificantDigits`, and `maximumSignificantDigits`.
 *
 * NOTE: Instances of `NumberFormat` are immutable after construction.
 *
 * For details about `Intl.NumberFormat` see [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat).
 */
export default class NumberFormat extends Formatter {

    static get $name() {
        return 'NumberFormat';
    }

    //<debug>
    constructor(options) {
        super(options);

        this.parse('0');  // throw away parse just to get us freezable

        Object.freeze(this.is);
        Object.freeze(this);
    }
    //</debug>

    initialize() {
        this._as = {
            // cacheKey : cachedInstance
        };

        this.is = {
            decimal  : false,
            currency : false,
            percent  : false,
            null     : true,
            from     : null
        };
    }

    get truncator() {
        const scale = this.maximumFractionDigits;

        return (scale == null)
            ? null
            : this.as({ style : 'decimal', maximumFractionDigits : Math.min(20, scale + 1) }, 'truncator');
    }

    configure(options) {
        const me = this;

        if (typeof options !== 'string') {
            Object.assign(me, options);
        }
        else {
            me.template = options;
        }

        // Do not remove. Assertion strings for Localization sanity check.
        // 'L{locale}'
        // 'L{currency}'

        const
            config = {},
            loc = me.locale ? LocaleManager.locales[me.locale] : LocaleManager.locale,
            defaults = loc && loc.NumberFormat,
            template = me.template;

        if (defaults) {
            for (const key in defaults) {
                if (me[key] == null && typeof defaults[key] !== 'function') {
                    me[key] = defaults[key];
                }
            }
        }

        if (template) {
            const
                match = numFormatRe.exec(template),
                m2 = match[2],
                m4 = match[4];

            me.useGrouping = !!match[3];
            me.style = match[1] ? 'currency' : (match[6] ? 'percent' : 'decimal');

            if (m2) {
                me.integer = +m2;
            }

            if (m4 === '*') {
                me.fraction = [0, 20];
            }
            else if (m4 != null) {
                me.fraction = [match[5].length, m4.length];
            }
        }

        me._minMax('fraction', true, true);
        me._minMax('integer', true, false);
        me._minMax('significant', false, true);

        for (const key in me.defaults) {
            if (me[key] != null) {
                config[key] = me[key];
            }
        }

        me.is.from = me.from && me.from.is;
        me.is[me.style] = !(me.is.null = false);

        me.formatter = newFormatter(me.locale, config);
    }

    /**
     * Creates a derived `NumberFormat` from this instance, with a different `style`. This is useful for processing
     * currency and percentage styles without the symbols being injected in the formatting.
     *
     * @param {String|Object} change The new style (if a string) or a set of properties to update.
     * @param {String} [cacheAs] A key by which to cache this derived formatter.
     * @returns {Core.helper.util.NumberFormat}
     */
    as(change, cacheAs = null) {
        const
            config = this.resolvedOptions() || { template : '9.*' },
            cache = this._as;

        let ret = cacheAs && cache[cacheAs];

        if (!ret) {
            if (typeof change === 'string') {
                config.style = change;
            }
            else {
                Object.assign(config, change);
            }

            config.from = this;

            ret = new NumberFormat(config);
        }

        if (cacheAs) {
            cache[cacheAs] = ret;
        }

        return ret;
    }

    defaultParse(value, strict) {
        return (value == null) ? value : (strict ? Number(value) : parseFloat(value));
    }

    /**
     * Returns the given `value` formatted in accordance with the specified locale and
     * formatting options.
     *
     * @param {Number} value
     * @returns {String}
     */
    format(value) {
        if (typeof value === 'string') {
            const v = Number(value);

            value = isNaN(v) ? this.parse(value) : v;
        }

        return super.format(value);
    }

    // The parse() method is inherited but the base class implementation
    // cannot properly document the parameter and return types:

    /**
     * Returns a `Number` parsed from the given, formatted `value`, in accordance with the
     * specified locale and formatting options.
     *
     * If the `value` cannot be parsed, `NaN` is returned.
     *
     * Pass `strict` as `true` to require all text to convert. In essence, the default is
     * in line with JavaScript's `parseFloat` while `strict=true` behaves like the `Number`
     * constructor:
     *```
     *  parseFloat('1.2xx');  // = 1.2
     *  Number('1.2xx')       // = NaN
     *```
     * @method parse
     * @param {String} value
     * @param {Boolean} [strict=false]
     * @returns {Number}
     */

    /**
     * Returns a `Number` parsed from the given, formatted `value`, in accordance with the
     * specified locale and formatting options.
     *
     * If the `value` cannot be parsed, `NaN` is returned.
     *
     * This method simply passes the `value` to `parse()` and passes `true` for the second
     * argument.
     *
     * @method parseStrict
     * @param {String} value
     * @returns {Number}
     */

    /**
     * Returns the given `Number` rounded in accordance with the specified locale and
     * formatting options.
     *
     * @param {Number|String} value
     * @returns {Number}
     */
    round(value) {
        return this.parse(this.format(value));
    }

    /**
     * Returns the given `Number` truncated to the `maximumFractionDigits` in accordance
     * with the specified locale and formatting options.
     *
     * @param {Number|String} value
     * @returns {Number}
     */
    truncate(value) {
        const
            me = this,
            scale = me.maximumFractionDigits,
            { truncator } = me;

        let v = me.parse(value),
            dot;

        if (truncator) {
            v = truncator.format(v);
            dot = v.indexOf(truncator.parser.decimal);

            if (dot > -1 && v.length - dot  - 1 > scale) {
                v = v.substr(0, dot + scale + 1);
            }

            v = truncator.parse(v);
        }

        return v;
    }

    resolvedOptions() {
        const options = super.resolvedOptions();

        for (const key in options) {
            // For some reason, on TeamCity, tests get undefined for some properties...
            // maybe a locale issue?
            if (options[key] === undefined) {
                options[key] = this[key];
            }
        }

        return options;
    }

    /**
     * Expands the provided shorthand into the "minimum*Digits" and "maximum*Digits".
     * @param {String} name
     * @param {Boolean} setMin
     * @param {Boolean} setMax
     * @private
     */
    _minMax(name, setMin, setMax) {
        const
            me = this,
            value = me[name];

        if (value != null) {
            const
                capName = StringHelper.capitalize(name),
                max = `maximum${capName}Digits`,
                min = `minimum${capName}Digits`;

            if (typeof value === 'number') {
                if (setMin) {
                    me[min] = value;
                }

                if (setMax) {
                    me[max] = value;
                }
            }
            else {
                me[min] = value[0];
                me[max] = value[1];
            }
        }
    }
}

NumberFormat.Parser = NumberParser;

Object.assign(NumberFormat.prototype, {
    // This object holds only those properties that Intl.NumberFormat accepts in its
    // "options" parameter. Only these options will be copied from the NumberFormat
    // and passed to the Intl.NumberFormat constructor and only these will be copied
    // back from its resolvedOptions:
    defaults : {
        /**
         * The formatting style.
         *
         * Valid values are: `'decimal'` (the default), `'currency'`, and `'percent'`.
         * @config {String}
         * @default
         */
        style : 'decimal',

        /**
         * The currency to use when using `style: 'currency'`. For example, `'USD'` (US dollar)
         * or `'EUR'` for the euro.
         *
         * If not provided, the {@link Core.localization.LocaleManager} default will be used.
         * @config {Boolean}
         */
        currency : null,

        /**
         * The format in which to display the currency value when using `style: 'currency'`.
         *
         * Valid values are: `'symbol'` (the default), `'code'`, and `'name'`.
         * @config {String}
         * @default
         */
        currencyDisplay : 'symbol',

        /**
         * The name of the locale. For example, `'en-US'`. This config is the same as the
         * first argument to the `Intl.NumberFormat` constructor.
         *
         * Defaults to the browser's default locale.
         * @config {String}
         */
        locale : null,

        /**
         * The maximum number of digits following the decimal.
         *
         * This is more convenient to specify using the {@link #config-fraction} config.
         * @config {Number}
         */
        maximumFractionDigits : null,

        /**
         * The minimum number of digits following the decimal.
         *
         * This is more convenient to specify using the {@link #config-fraction} config.
         * @config {Number}
         */
        minimumFractionDigits : null,

        /**
         * The minimum number of digits preceding the decimal.
         *
         * This is more convenient to specify using the {@link #config-integer} config.
         * @config {Number}
         */
        minimumIntegerDigits : null,

        /**
         * The maximum number of significant digits.
         *
         * This is more convenient to specify using the {@link #config-significant} config.
         * @config {Number}
         */
        maximumSignificantDigits : null,

        /**
         * The minimum number of significant digits.
         *
         * This is more convenient to specify using the {@link #config-significant} config.
         * @config {Number}
         */
        minimumSignificantDigits : null,

        /**
         * Specify `false` to disable thousands separators.
         * @config {Boolean}
         * @default
         */
        useGrouping : true
    },

    /**
     * Specifies the `minimumFractionDigits` and `minimumFractionDigits` in a compact
     * way. If this value is a `Number`, it sets both the minimum and maximum to that
     * value. If this value is an array, `[0]` sets the minimum and `[1]` sets the
     * maximum.
     * @config {Number|Number[]}
     */
    fraction : null,

    from : null,

    /**
     * An alias for `minimumIntegerDigits`.
     * @config {Number}
     */
    integer : null,

    /**
     * Specifies the `minimumSignificantDigits` and `minimumSignificantDigits` in a compact
     * format. If this value is a `Number`, it sets only the maximum to that value. If this
     * value is an array, `[0]` sets the minimum and `[1]` sets the maximum.
     *
     * If this value (or `minimumSignificantDigits` or `minimumSignificantDigits`) is set,
     * `integer` (and `minimumIntegerDigits`) and `fraction` (and `minimumFractionDigits`
     * and `minimumFractionDigits`) are ignored.
     *
     * @config {Number|Number[]}
     */
    significant : null,

    /**
     * A format template consisting of the following parts:
     *```
     *  [$] [\d+:] \d+ [,\d+] [.\d* [#*] | *] [%]
     *```
     * If the template begins with a `'$'`, the formatter's `style` option is set to
     * `'currency'`. If the template ends with `'%'`, `style` is set to `'percent'`.
     * It is invalid to include both characters. When using `'$'`, the `currency` symbol
     * defaults to what is provided by the {@link Core.localization.LocaleManager}.
     *
     * To set the `minimumIntegerDigits`, the desired minimum comes before the first
     * digits in the template and is followed by a `'>'` (greater-than). For example:
     *```
     *  5>9,999.00
     *```
     * The above sets `minimumIntegerDigits` to 5.
     *
     * The `useGrouping` option is enabled if there is a `','` (comma) present and is
     * disabled otherwise.
     *
     * If there is a `'.'` (decimal) present, it may be followed by either of:
     *
     *  - Zero or more digits which may then be followed by zero or more `'#'` characters.
     *    The number of digits determines the `minimumFractionDigits`, while the total
     *    number of digits and `'#'`s determines the `maximumFractionDigits`.
     *  - A single `'*'` (asterisk) indicating any number of fractional digits (no minimum
     *    or maximum).
     *
     * @config {String}
     */
    template : null
});

Object.assign(NumberFormat.prototype, NumberFormat.prototype.defaults);

// TODO is this the "right" way to do this?
Formatter.number = (format, value) => NumberFormat.format(format, value);
