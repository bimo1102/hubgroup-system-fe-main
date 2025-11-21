import Localizable from '../localization/Localizable.js';
import LocaleManager from '../localization/LocaleManager.js';
import BrowserHelper from './BrowserHelper.js';
import StringHelper from './StringHelper.js';
import Objects from './util/Objects.js';

const
    { toString }        = Object.prototype,
    DATE_TYPE           = toString.call(new Date()),
    // Left-to-right unicode mark (https://www.codetable.net/decimal/8206)
    LTRSymbolRegexp     = new RegExp('\u200E', 'g'),
    tempDate            = new Date(),
    defaultValue        = (value, defValue) => isNaN(value) || value == null ? defValue : value,
    enOrdinalSuffix     = number => {
        const hasSpecialCase = ['11', '12', '13'].find((n) => number.endsWith(n));

        let suffix = 'th';

        if (!hasSpecialCase) {
            const lastDigit = number[number.length - 1];
            suffix          = { 1 : 'st', 2 : 'nd', 3 : 'rd' }[lastDigit] || 'th';
        }

        return number + suffix;
    },
    useIntlFormat       = (name, options, date) => {
        const formatter = intlFormatterCache[name] || (intlFormatterCache[name] = new Intl.DateTimeFormat(locale, options));
        let result = formatter.format(date);
        // IE11 inserts direction control characters to the string
        // This removes the characters
        if (BrowserHelper.isIE11) {
            result = result.replace(LTRSymbolRegexp, '');
        }

        return result;
    },
    formatTime          = (name, options, date, isShort = false) => {
        let strTime = useIntlFormat(name, options, date);

        // remove "0" from time when has AM/PM (from 01:00 PM to 1:00 PM): https://github.com/bryntum/support/issues/1483
        if (/am|pm/i.test(strTime)) {
            // remove first character only if is 0
            strTime = strTime.replace(/^0/, '');

            // if isShort is true, remove minutes if is :00
            if (isShort) {
                strTime = strTime.replace(/:00/, '');
            }
        }

        return strTime;
    },
    getDayDiff   = (end, start) => Math.floor((end.getTime() - start.getTime() -
        (end.getTimezoneOffset() - start.getTimezoneOffset()) * validConversions.minute.millisecond) / validConversions.day.millisecond) + 1,
    normalizeDay = day => day >= 0 ? day : day + 7;

// These vars are set when changing locale

let locale             = 'en-US',
    ordinalSuffix      = enOrdinalSuffix,
    // Used to cache used formats, to not have to parse format string each time
    formatCache        = {},
    intlFormatterCache = {},
    parserCache        = {};

const
    DEFAULT_YEAR               = 2020, // 2020 is the year that has no issues in Safari and Edge, see: https://github.com/bryntum/support/issues/554
    DEFAULT_MONTH              = 0,
    DEFAULT_DAY                = 1,
    formats                    = {
        // 1, 2, ... 11, 12
        M    : date => date.getMonth() + 1, //date.toLocaleDateString(locale, { month : 'numeric' }),
        // 1st, 2nd, 3rd, 4th, ... 11th, 12th
        Mo   : date => ordinalSuffix(formats.M(date).toString()),
        // 01, 02, ...
        MM   : date => (date.getMonth() + 1).toString().padStart(2, '0'), //date.toLocaleDateString(locale, { month : '2-digit' }),
        // Jan, Feb, ...
        MMM  : date => useIntlFormat('MMM', { month : 'short' }, date),
        // January, February, ...
        MMMM : date => useIntlFormat('MMMM', { month : 'long' }, date),

        // 1, 2, ...
        Q  : date => Math.ceil((date.getMonth() + 1) / 3),
        // 1st, 2nd, ...
        Qo : date => ordinalSuffix(formats.Q(date).toString()),

        // 1, 2, ...
        D  : date => date.getDate(), //date.toLocaleDateString(locale, { day : 'numeric' }),
        // 1st, 2nd, ...
        Do : date => ordinalSuffix(formats.D(date).toString()),
        // 01, 02, ...
        DD : date => date.getDate().toString().padStart(2, '0'), //date.toLocaleDateString(locale, { day : '2-digit' }),

        // 1, 2, ..., 365, 365
        DDD : date => Math.ceil(
            (
                new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0) -
                new Date(date.getFullYear(), 0, 0, 12, 0, 0)
            ) / validConversions.day.millisecond),
        // 1st, 2nd, ...
        DDDo : date => ordinalSuffix(formats.DDD(date).toString()),
        // 001, 002, ...
        DDDD : date => formats.DDD(date).toString().padStart(3, '0'),

        // 0, 1, ..., 6
        d    : date => date.getDay(),
        // 0th, 1st, ...
        do   : date => ordinalSuffix(date.getDay().toString()),
        // S, M, ...
        d1   : date => formats.ddd(date).substring(0, 1),
        // Su, Mo, ...
        dd   : date => formats.ddd(date).substring(0, 2),
        // Sun, Mon, ...
        ddd  : date => useIntlFormat('ddd', { weekday : 'short' }, date),
        // Sunday, Monday, ...
        dddd : date => useIntlFormat('dddd', { weekday : 'long' }, date),

        e : date => date.getDay(),
        E : date => date.getDay() + 1,

        // ISO week, 1, 2, ...
        W  : date => DateHelper.getWeekNumber(date)[1],
        Wo : date => ordinalSuffix(formats.W(date).toString()),
        WW : date => formats.W(date).toString().padStart(2, '0'),

        // 1979, 2018
        Y    : date => date.getFullYear(), //date.toLocaleDateString(locale, { year : 'numeric' }),
        // 79, 18
        YY   : date => date.getFullYear() % 100, //date.toLocaleDateString(locale, { year : '2-digit' }),
        // 1979, 2018
        YYYY : date => date.getFullYear(), //date.toLocaleDateString(locale, { year : 'numeric' }),

        // AM, PM
        A : date => date.getHours() < 12 ? 'AM' : 'PM',
        a : date => date.getHours() < 12 ? 'am' : 'pm',

        // 0, 1, ... 23
        H  : date => date.getHours(),
        // 00, 01, ...
        HH : date => date.getHours().toString().padStart(2, '0'),
        // 1, 2, ... 12
        h  : date => (date.getHours() % 12) || 12,
        // 01, 02, ...
        hh : date => formats.h(date).toString().padStart(2, '0'),
        // 1, 2, ... 24
        k  : date => date.getHours() + 1,
        // 01, 02, ...
        kk : date => formats.k(date).toString().padStart(2, '0'),
        // Locale specific (0 -> 24 or 1 AM -> 12 PM)
        K  : date => formatTime('K', { hour : 'numeric' }, date),
        // Locale specific (00 -> 24 or 1 AM -> 12 PM)
        KK : date => formatTime('KK', { hour : '2-digit' }, date),

        // 0, 1, ... 59
        m  : date => date.getMinutes(), //date.toLocaleTimeString(locale, { minute : 'numeric' }),
        // 00, 01, ...
        mm : date => formats.m(date).toString().padStart(2, '0'),

        // 0, 1, ... 59
        s  : date => date.getSeconds(), //date.toLocaleTimeString(locale, { second : 'numeric' }),
        // 00, 01, ...
        ss : date => formats.s(date).toString().padStart(2, '0'),

        // 0, 1, ... 9 which are 000, 100, 200 ... 900 in milliseconds
        S   : date => Math.floor(date.getMilliseconds() / 100).toString(),
        // 00, 01, ... 99 which are 000, 010, 020 ... 990 in milliseconds
        SS  : date => Math.floor(date.getMilliseconds() / 10).toString().padStart(2, '0'),
        // 000, 001, ... 999 in milliseconds
        SSS : date => date.getMilliseconds().toString().padStart(3, '0'),

        z  : date => useIntlFormat('z', { timeZoneName : 'short' }, date),
        zz : date => useIntlFormat('zz', { timeZoneName : 'long' }, date),
        Z  : date => DH.getGMTOffset(date),

        LT  : date => formatTime('LT', { hour : '2-digit', minute : '2-digit' }, date),
        // if minutes is 0, doesn't show it
        LST : date => formatTime('LST', { hour : 'numeric', minute : '2-digit' }, date, true),
        LTS : date => formatTime('LTS', { hour : '2-digit', minute : '2-digit', second : '2-digit' }, date),
        L   : date => useIntlFormat('L', { year : 'numeric', month : '2-digit', day : '2-digit' }, date),
        l   : date => useIntlFormat('l', { year : 'numeric', month : 'numeric', day : 'numeric' }, date),
        LL  : date => useIntlFormat('LL', { year : 'numeric', month : 'long', day : 'numeric' }, date),
        ll  : date => useIntlFormat('ll', { year : 'numeric', month : 'short', day : 'numeric' }, date),
        LLL : date => useIntlFormat('LLL', {
            year   : 'numeric',
            month  : 'long',
            day    : 'numeric',
            hour   : 'numeric',
            minute : '2-digit'
        }, date),
        lll : date => useIntlFormat('lll', {
            year   : 'numeric',
            month  : 'short',
            day    : 'numeric',
            hour   : 'numeric',
            minute : '2-digit'
        }, date),
        LLLL : date => useIntlFormat('LLLL', {
            year    : 'numeric',
            month   : 'long',
            day     : 'numeric',
            hour    : 'numeric',
            minute  : '2-digit',
            weekday : 'long'
        }, date),
        llll : date => useIntlFormat('llll', {
            year    : 'numeric',
            month   : 'short',
            day     : 'numeric',
            hour    : 'numeric',
            minute  : '2-digit',
            weekday : 'short'
        }, date)
    },
    // Want longest keys first, to not stop match at L of LTS etc.
    formatKeys                 = Object.keys(formats).sort((a, b) => b.length - a.length),
    formatRegexp               = `^(?:${formatKeys.join('|')})`,

    // return empty object, meaning value cannot be processed to a valuable date part
    emptyFn                    = () => ({}),
    isNumber                   = (str) => numberRegex.test(str),
    parseMilliseconds          = (str) => isNumber(str) && { milliseconds : parseInt(str.padEnd(3, '0').substring(0, 3)) },
    parsers                    = {
        YYYY : str => ({ year : parseInt(str) }),
        Y    : str => ({ year : parseInt(str) }),
        YY   : str => {
            const year = parseInt(str);
            return { year : year + (year > 1968 ? 1900 : 2000) };
        },
        MM   : str => ({ month : parseInt(str) - 1 }),
        Mo   : str => ({ month : parseInt(str) - 1 }),
        DD   : str => ({ date : parseInt(str) }),
        M    : str => ({ month : parseInt(str) - 1 }),
        D    : str => ({ date : parseInt(str) }),
        Do   : str => ({ date : parseInt(str) }),
        DDD  : emptyFn,
        MMM  : emptyFn,
        MMMM : emptyFn,
        DDDo : emptyFn,
        DDDD : emptyFn,
        d    : emptyFn,
        do   : emptyFn,
        d1   : emptyFn,
        dd   : emptyFn,
        ddd  : emptyFn,
        dddd : emptyFn,
        Q    : emptyFn,
        Qo   : emptyFn,
        W    : emptyFn,
        Wo   : emptyFn,
        WW   : emptyFn,
        e    : emptyFn,
        E    : emptyFn,
        HH   : str => ({ hours : parseInt(str) }),
        hh   : str => ({ hours : parseInt(str) }),
        mm   : str => ({ minutes : parseInt(str) }),
        H    : str => ({ hours : parseInt(str) }),
        m    : str => ({ minutes : parseInt(str) }),
        ss   : str => ({ seconds : parseInt(str) }),
        s    : str => ({ seconds : parseInt(str) }),
        S    : parseMilliseconds,
        SS   : parseMilliseconds,
        SSS  : parseMilliseconds,

        A : str => ({ amPm : str.toLowerCase() }),
        a : str => ({ amPm : str.toLowerCase() }),

        L  : 'MM/DD/YYYY',
        LT : 'HH:mm A',

        // Can either be Z (=UTC, 0) or +-HH:MM
        Z : str => {
            if (!str || (!timeZoneRegEx.test(str) && str !== 'Z')) {
                return null;
            }

            let timeZone = 0;
            // If string being parsed is more "detailed" than the format specified we can have more chars left,
            // thus check the last (for example HH:mmZ with input HH:mm:ssZ -> ssZ)
            if (str !== 'Z') {
                const matches = timeZoneRegEx.exec(str);

                // If timezone regexp matches, sting has time zone offset like '+02:00'
                if (matches) {
                    const
                        sign    = matches[1] === '+' ? 1 : -1,
                        hours   = parseInt(matches[2]) || 0,
                        minutes = parseInt(matches[3]) || 0;

                    timeZone = sign * (hours * 60 + minutes);
                }
                // otherwise we just return current time zone, because there's a Z key in the input
                else {
                    timeZone = -1 * new Date().getTimezoneOffset();
                }
            }
            return { timeZone };
        }
    },
    parserKeys                 = Object.keys(parsers).sort((a, b) => b.length - a.length),
    parserRegexp               = new RegExp(`(${parserKeys.join('|')})`),
    // Following regexp includes all formats that should be handled by Date class
    localeStrRegExp            = new RegExp('(l|LL|ll|LLL|lll|LLLL|llll)'),
    //    ISODateRegExp             = new RegExp('YYYY-MM-DD[T ]HH:mm:ss(.s+)?Z'),

    // Some validConversions are negative to show that it's not an exact conversion, just an estimate.
    validConversions           = {
        // The units below assume:
        // 30 days in a month, 91 days for a quarter and 365 for a year
        // 52 weeks per year, 4 per month, 13 per quarter
        // 3652 days per decade (assuming two of the years will be leap with 366 days)
        decade : {
            decade      : 1,
            year        : 10,
            quarter     : 40,
            month       : 120,
            week        : 520,
            day         : 3652,
            hour        : 24 * 3652,
            minute      : 1440 * 3652,
            second      : 86400 * 3652,
            millisecond : 86400000 * 3652
        },
        year : {
            decade      : 0.1,
            year        : 1,
            quarter     : 4,
            month       : 12,
            week        : 52,
            day         : 365,
            hour        : 24 * 365,
            minute      : 1440 * 365,
            second      : 86400 * 365,
            millisecond : 86400000 * 365
        },
        quarter : {
            decade      : 1 / 40,
            year        : 1 / 4,
            quarter     : 1,
            month       : 3,
            week        : 4,
            day         : 91,
            hour        : 24 * 91,
            minute      : 1440 * 91,
            second      : 86400 * 91,
            millisecond : 86400000 * 91
        },
        month : {
            decade      : 1 / 120,
            year        : 1 / 12,
            quarter     : 1 / 3,
            month       : 1,
            week        : 4,
            day         : -30,
            hour        : -24 * 30,
            minute      : -1440 * 30,
            second      : -86400 * 30,
            millisecond : -86400000 * 30
        },
        week : {
            decade      : -1 / 520,
            year        : -1 / 52,
            quarter     : -1 / 13,
            month       : -1 / 4,
            day         : 7,
            hour        : 168,
            minute      : 10080,
            second      : 604800,
            millisecond : 604800000
        },
        day : {
            decade      : -1 / 3652,
            year        : -1 / 365,
            quarter     : -1 / 91,
            month       : -1 / 30,
            week        : 1 / 7,
            hour        : 24,
            minute      : 1440,
            second      : 86400,
            millisecond : 86400000
        },
        hour : {
            decade      : -1 / (3652 * 24),
            year        : -1 / (365 * 24),
            quarter     : -1 / (91 * 24),
            month       : -1 / (30 * 24),
            week        : 1 / 168,
            day         : 1 / 24,
            minute      : 60,
            second      : 3600,
            millisecond : 3600000
        },
        minute : {
            decade      : -1 / (3652 * 1440),
            year        : -1 / (365 * 1440),
            quarter     : -1 / (91 * 1440),
            month       : -1 / (30 * 1440),
            week        : 1 / 10080,
            day         : 1 / 1440,
            hour        : 1 / 60,
            second      : 60,
            millisecond : 60000
        },
        second : {
            decade      : -1 / (3652 * 86400),
            year        : -1 / (365 * 86400),
            quarter     : -1 / (91 * 86400),
            month       : -1 / (30 * 86400),
            week        : 1 / 604800,
            day         : 1 / 86400,
            hour        : 1 / 3600,
            minute      : 1 / 60,
            millisecond : 1000
        },
        millisecond : {
            decade  : -1 / (3652 * 86400000),
            year    : -1 / (365 * 86400000),
            quarter : -1 / (91 * 86400000),
            month   : -1 / (30 * 86400000),
            week    : 1 / 604800000,
            day     : 1 / 86400000,
            hour    : 1 / 3600000,
            minute  : 1 / 60000,
            second  : 1 / 1000
        }
    },

    normalizedUnits            = {
        ms           : 'millisecond',
        milliseconds : 'millisecond',
        s            : 'second',
        seconds      : 'second',
        m            : 'minute',
        mi           : 'minute',
        min          : 'minute',
        minutes      : 'minute',
        h            : 'hour',
        hours        : 'hour',
        d            : 'day',
        days         : 'day',
        w            : 'week',
        weeks        : 'week',
        M            : 'month',
        months       : 'month',
        q            : 'quarter',
        quarters     : 'quarter',
        y            : 'year',
        years        : 'year',
        dec          : 'decade',
        decades      : 'decade'
    },

    withDecimalsDurationRegex  = /^\s*([-+]?\d+(?:[.,]\d*)?|[-+]?(?:[.,]\d+))\s*([^\s]+)?/i,
    noDecimalsDurationRegex    = /^\s*([-+]?\d+)(?![.,])\s*([^\s]+)?/i,
    canonicalUnitNames         = [
        'millisecond',
        'second',
        'minute',
        'hour',
        'day',
        'week',
        'month',
        'quarter',
        'year',
        'decade'
    ],
    canonicalUnitAbbreviations = [
        ['mil'],
        ['s', 'sec'],
        ['m', 'min'],
        ['h', 'hr'],
        ['d'],
        ['w', 'wk'],
        ['mo', 'mon', 'mnt'],
        ['q', 'quar', 'qrt'],
        ['y', 'yr'],
        ['dec']
    ],
    deltaUnits                 = [
        'decade',
        'year',
        'month',
        'week',
        'day',
        'hour',
        'minute',
        'second',
        'millisecond'
    ],
    // Used when creating a date from an object, to fill in any blanks
    dateProperties             = [
        'milliseconds',
        'seconds',
        'minutes',
        'hours',
        'date',
        'month',
        'year'
    ],
    // TODO: Should we provide special number parsing?
    parseNumber                = (n) => {
        const result = parseFloat(n);
        return isNaN(result) ? null : result;
    },
    numberRegex                = /^[0-9]+$/,
    timeZoneRegEx              = /([+-])(\d\d):*(\d\d)*$/,
    unitMagnitudes             = {
        millisecond : 0,
        second      : 1,
        minute      : 2,
        hour        : 3,
        day         : 4,
        week        : 5,
        month       : 6,
        quarter     : 7,
        year        : 8,
        decade      : 9
    },
    snapFns = {
        round(number, step = 1) {
            return Math.round(number / step) * step;
        },
        floor(number, step = 1) {
            return Math.floor(number / step) * step;
        },
        ceil(number, step = 1) {
            return Math.ceil(number / step) * step;
        }
    },
    keyCache = {};

export { unitMagnitudes };

/**
 * @module Core/helper/DateHelper
 */

/**
 * Helps with date manipulation, comparison, parsing, formatting etc.
 *
 * ## Parsing strings
 * Use `DateHelper.parse()` to parse strings into dates. It accepts a date string and a format specifier.
 * The format specifier is string built up using the following tokens:
 *
 * | Unit        | Token | Description                       |
 * |-------------|-------|-----------------------------------|
 * | Year        | YYYY  | 2018                              |
 * |             | YY    | < 68 -> 2000, > 68 -> 1900        |
 * | Month       | MM    | 01 - 12                           |
 * | Date        | DD    | 01 - 31                           |
 * | Hour        | HH    | 00 - 23 or 1 - 12                 |
 * | Minute      | mm    | 00 - 59                           |
 * | Second      | ss    | 00 - 59                           |
 * | Millisecond | S     | 0 - 9 [000, 100, 200 .. 900 ]     |
 * |             | SS    | 00 - 99 [000, 010, 020 .. 990 ]   |
 * |             | SSS   | 000 - 999 [000, 001, 002 .. 999 ] |
 * | AM/PM       | A     | AM or PM                          |
 * |             | a     | am or pm                          |
 * | TimeZone    | Z     | Z for UTC or +-HH:mm              |
 * | Predefined  | L     | Long date, MM/DD/YYYY             |
 * |             | LT    | Long time, HH:mm A                |
 *
 * Default parse format is: `'YYYY-MM-DDTHH:mm:ss.SSSZ'` see {@link #property-defaultParseFormat-static}
 *
 * For example:
 * ```
 * DateHelper.parse('2018-11-06', 'YYYY-MM-DD');
 * DateHelper.parse('13:14', 'HH:mm');
 * DateHelper.parse('6/11/18', 'DD/MM/YY');
 * ```
 *
 * ## Formatting dates
 * Use `DateHelper.format()` to create a string from a date using a format specifier. The format specifier is similar to
 * that used when parsing strings. It can use the following tokens (input used for output below is
 * `new Date(2018,8,9,18,7,8,145)`):
 *
 * | Unit                  | Token | Description & output                  |
 * |-----------------------|-------|---------------------------------------|
 * | Year                  | YYYY  | 2018                                  |
 * |                       | YY    | 18                                    |
 * |                       | Y     | 2018                                  |
 * | Quarter               | Q     | 3                                     |
 * |                       | Qo    | 3rd                                   |
 * | Month                 | MMMM  | September                             |
 * |                       | MMM   | Sep                                   |
 * |                       | MM    | 09                                    |
 * |                       | Mo    | 9th                                   |
 * |                       | M     | 9                                     |
 * | Week (iso)            | WW    | 36 (2 digit)                          |
 * |                       | Wo    | 36th                                  |
 * |                       | W     | 36                                    |
 * | Date                  | DDDD  | Day of year, 3 digits                 |
 * |                       | DDDo  | Day of year, ordinal                  |
 * |                       | DDD   | Day of year                           |
 * |                       | DD    | 09                                    |
 * |                       | Do    | 9th                                   |
 * |                       | D     | 9                                     |
 * | Weekday               | dddd  | Sunday                                |
 * |                       | ddd   | Sun                                   |
 * |                       | dd    | Su                                    |
 * |                       | d1    | S                                     |
 * |                       | do    | 0th                                   |
 * |                       | d     | 0                                     |
 * | Hour                  | HH    | 18 (00 - 23)                          |
 * |                       | H     | 18 (0 - 23)                           |
 * |                       | hh    | 06 (00 - 12)                          |
 * |                       | h     | 6 (0 - 12)                            |
 * |                       | KK    | 19 (01 - 24)                          |
 * |                       | K     | 19 (1 - 24)                           |
 * |                       | kk    | 06 or 18, locale determines           |
 * |                       | k     | 6 or 18, locale determines            |
 * | Minute                | mm    | 07                                    |
 * |                       | m     | 7                                     |
 * | Second                | ss    | 08                                    |
 * |                       | s     | 8                                     |
 * | Millisecond           | S     | 1 (100ms)                             |
 * |                       | SS    | 14 (140ms)                            |
 * |                       | SSS   | 145 (145ms)                           |
 * | AM/PM                 | A     | AM or PM                              |
 * |                       | a     | am or pm                              |
 * | Predefined            | LT    | H: 2-digit (2d), m: 2d                |
 * | (uses browser locale) | LTS   | H: 2d, m: 2d, s : 2d                  |
 * |                       | LST   | Depends on 12 or 24 hour clock        |
 * |                       |       | 12h, H : 1d, m : 0 or 2d              |
 * |                       |       | 24h, H : 2d, m : 2d                   |
 * |                       | L     | Y: numeric (n), M : 2d, D : 2d        |
 * |                       | l     | Y: n, M : n, D : n                    |
 * |                       | LL    | Y: n, M : long (l), D : n             |
 * |                       | ll    | Y: n, M : short (s), D : n            |
 * |                       | LLL   | Y: n, M : l, D : n, H: n, m: 2d       |
 * |                       | lll   | Y: n, M : s, D : n, H: n, m: 2d       |
 * |                       | LLLL  | Y: n, M : l, D : n, H: n, m: 2d, d: l |
 * |                       | llll  | Y: n, M : s, D : n, H: n, m: 2d, d: s |
 *
 *
 * Default format is: `'YYYY-MM-DDTHH:mm:ssZ'` see {@link #property-defaultFormat-static}
 *
 * For example:
 *
 * ```javascript
 * DateHelper.format(new Date(2018,10,6), 'YYYY-MM-DD'); // 2018-11-06
 * DateHelper.format(new Date(2018,10,6), 'M/D/YY'); // 11/6/18
 * ```
 *
 * Arbitrary text can be embedded in the format string by wrapping it with {}:
 *
 * ```javascript
 * DateHelper.format(new Date(2019, 7, 16), '{It is }dddd{, yay!}') -> It is Friday, yay!
 * ```
 *
 * ## Unit names
 * Many DateHelper functions (for example add, as, set) accepts a unit among their params. The following units are
 * available:
 *
 * | Unit        | Aliases                       |
 * |-------------|-------------------------------|
 * | millisecond | millisecond, milliseconds, ms |
 * | second      | second, seconds, s            |
 * | minute      | minute, minutes, m            |
 * | hour        | hour, hours, h                |
 * | day         | day, days, d                  |
 * | week        | week, weeks, w                |
 * | month       | month, months, M              |
 * | quarter     | quarter, quarters, q          |
 * | year        | year, years, y                |
 * | decade      | decade, decades, dec          |
 *
 * For example:
 * ```javascript
 * DateHelper.add(date, 2, 'days');
 * DateHelper.as('hour', 7200, 'seconds');
 * ```
 */
export default class DateHelper extends Localizable() {
    static get $name() {
        return 'DateHelper';
    }

    //region Parse & format
    /**
     * Get/set the default format used by `format()` and `parse()`. Defaults to `'YYYY-MM-DDTHH:mm:ssZ'`
     * (~ISO 8601 Date and time, `'1962-06-17T09:21:34Z'`).
     * @member {String}
     */
    static set defaultFormat(format) {
        DH._defaultFormat = format;
    }

    static get defaultFormat() {
        return DH._defaultFormat || 'YYYY-MM-DDTHH:mm:ssZ';
    }

    /**
     * Get/set the default format used by `parse()`. Defaults to `'YYYY-MM-DDTHH:mm:ss.SSSZ'` or {@link #property-defaultFormat-static}
     * (~ISO 8601 Date and time, `'1962-06-17T09:21:34.123Z'`).
     * @member {String}
     */
    static set defaultParseFormat(parseFormat) {
        this._defaultParseFormat = parseFormat;
    }

    static get defaultParseFormat() {
        return this._defaultParseFormat || this._defaultFormat || 'YYYY-MM-DDTHH:mm:ss.SSSZ';
    }

    static buildParser(format) {
        // Split input format by regexp, which includes predefined patterns. Normally format would have some
        // splitters, like 'YYYY-MM-DD' or 'D/M YYYY' so output will contain matched patterns as well as splitters
        // which would serve as anchors. E.g. provided format is 'D/M!YYYY' and input is `11/6!2019` algorithm would work like:
        // 1. split format by regexp                // ['', 'D', '/', 'M', '!', 'YYYY', '']
        // 2. find splitters                        // ['/', '!']
        // 3. split input by seps, step by step     // ['11', ['6', ['2019']]]

        // Inputs like 'YYYYY' (5*Y) means 'YYYY' + 'Y', because it matches patterns from longer to shorter,
        // but if few patterns describe same unit the last one is applied, for example
        // DH.parse('20182015', 'YYYYY') equals to new Date(2015, 0, 0)

        const
            parts  = format.split(parserRegexp),
            parser = [];

        // if length of the parts array is 1 - there are no regexps in the input string. thus - no parsers
        // do same if there are patterns matching locale strings (l, ll, LLLL etc.)
        // returning empty array to use new Date() as parser
        if (parts.length === 1 || localeStrRegExp.test(format)) {
            return [];
        }
        else {
            parts.reduce((prev, curr, index, array) => {

                // ignore first and last empty string
                if (index !== 0 || curr !== '') {

                    // if current element matches parser regexp store it as a parser
                    if (parserRegexp.test(curr)) {
                        const
                            localeParsers = this.localize('L{parsers}') || {},
                            fn            = localeParsers[curr] || parsers[curr];

                        // Z should be last element in the string that matches regexp. Last array element is always either
                        // an empty string (if format ends with Z) or splitter (everything that doesn't match regexp after Z)
                        // If there is a pattern after Z, then Z index will be lower than length - 2
                        if (curr === 'Z' && index < array.length - 2) {
                            throw new Error(`Invalid format ${format} TimeZone (Z) must be last token`);
                        }

                        // If fn is a string, we found an alias (L, LLL, l etc.).
                        // Need to build parsers from mapped format and merge with existing
                        if (typeof fn === 'string') {

                            // we are going to merge nested parsers with current, some cleanup required:
                            // 1. last element is no longer last
                            // 2. need to pass last parser to the next step
                            const
                                nestedParsers = DH.buildParser(fn),
                                lastItem      = nestedParsers.pop();
                            delete lastItem.last;

                            // elevate nested parsers
                            parser.push(...nestedParsers);

                            prev = lastItem;
                        }
                        else {
                            prev.pattern = curr;
                            prev.fn = parsers[curr];
                        }

                    }
                    // if it doesn't match - we've found a splitter
                    else {
                        prev.splitter = curr;
                        parser.push(prev);
                        prev = {};
                    }
                }
                else if (Object.prototype.hasOwnProperty.call(prev, 'pattern')) {
                    parser.push(prev);
                }
                return prev;
            }, {});
        }

        parser[parser.length - 1].last = true;

        return parser;
    }

    /**
     * A utility function to create a sortable string key for the passed date or ms timestamp using the `'YYYY-MM-DD'`
     * format.
     * @param {Number|Date} ms The Date instance or ms timestamp to generate a key for
     * @returns {String} Date/timestamp as a string with `'YYYY-MM-DD'` format
     * @internal
     */
    static makeKey(ms) {
        // Convert Date to ms timestamp
        if (ms.getTime) {
            ms = ms.getTime();
        }

        // Cache holds ms -> YYYY-MM-DD
        const cached = keyCache[ms];

        if (cached) {
            return cached;
        }

        tempDate.setTime(ms);
        return keyCache[ms] = DH.format(tempDate, 'YYYY-MM-DD');
    }

    /**
     * A utility function to parse a sortable string to a date date using the `'YYYY-MM-DD'` format.
     * @param {String} key The string to return a date for.
     * @internal
     */
    static parseKey(key) {
        return DH.parse(key, 'YYYY-MM-DD');
    }

    /**
     * Returns a date created from the supplied string using the specified format. Will try to create even if format
     * is left out, by first using the default format (see {@link #property-defaultFormat-static}, by default
     * `YYYY-MM-DDTHH:mm:ssZ`) and then using `new Date(dateString)`.
     * Supported tokens:
     *
     * | Unit        | Token | Description                       |
     * |-------------|-------|-----------------------------------|
     * | Year        | YYYY  | 2018                              |
     * |             | YY    | < 68 -> 2000, > 68 -> 1900        |
     * | Month       | MM    | 01 - 12                           |
     * | Date        | DD    | 01 - 31                           |
     * | Hour        | HH    | 00 - 23 or 1 - 12                 |
     * | Minute      | mm    | 00 - 59                           |
     * | Second      | ss    | 00 - 59                           |
     * | Millisecond | S     | 0 - 9 [000, 100, 200 .. 900 ]     |
     * |             | SS    | 00 - 99 [000, 010, 020 .. 990 ]   |
     * |             | SSS   | 000 - 999 [000, 001, 002 .. 999 ] |
     * | AM/PM       | A     | AM or PM                          |
     * |             | a     | am or pm                          |
     * | TimeZone    | Z     | Z for UTC or +-HH:mm              |
     * | Predefined  | L     | Long date, MM/DD/YYYY             |
     * |             | LT    | Long time, HH:mm A                |
     *
     * Predefined formats and functions used to parse tokens can be localized, see for example the swedish locale SvSE.js
     *
     * NOTE: If no date parameters are provided then `Jan 01 2020` is used as a default date
     *
     * @param {String} dateString Date string
     * @param {String} format Date format (or {@link #property-defaultParseFormat-static} if left out)
     * @returns {Date}
     * @category Parse & format
     */
    static parse(dateString, format = DH.defaultParseFormat) {
        if (dateString instanceof Date) {
            return dateString;
        }

        if (typeof dateString !== 'string' || !dateString) {
            return null;
        }

        // // For ISO 8601 native is faster, but not very forgiving
        // if (format === defaultFormat) {
        //     const dt = new Date(dateString);
        //     if (!isNaN(dt)) {
        //         return dt;
        //     }
        // }

        const config = {
            year         : null,
            month        : null,
            date         : null,
            hours        : null,
            minutes      : null,
            seconds      : null,
            milliseconds : null
        };

        // Milliseconds parser is the same for S, SS, SSS
        format = format.replace(/S+/gm, 'SSS');

        let
            parser = parserCache[format],
            result;

        if (!parser) {
            parser = parserCache[format] = DH.buildParser(format);
        }

        // Each parser knows its pattern and splitter. It looks for splitter in the
        // input string, takes first substring and tries to process it. Remaining string
        // is passed to the next parser.
        parser.reduce((dateString, parser) => {
            if (parser.last) {
                Object.assign(config, parser.fn(dateString));
            }
            else {
                let splitAt;

                // ISO 8601 says that T symbol can be replaced with a space
                if (parser.splitter === 'T' && dateString.indexOf('T') === -1) {
                    splitAt = dateString.indexOf(' ');
                }
                else {
                    // If splitter specified find its position, otherwise try to determine pattern length
                    splitAt = parser.splitter !== '' ? dateString.indexOf(parser.splitter) : parser.pattern && parser.pattern.length || -1;
                }

                let part, rest;

                // If splitter is not found in the current string we may be dealing with
                // 1. partial input - in that case we just feed all string to current parser and move on
                // 2. time zone (ssZ - splitter is empty string) and pattern is not specified, see comment below
                // 3. parse milliseconds before Z
                if (splitAt === -1 || ((parser.pattern === 'SSS') && dateString.match(/^\d+Z$/))) {
                    // NOTE: parentheses are required here as + and - signs hold valuable information
                    // with parentheses we get array like ['00','+','01:00'], omitting them we won't get
                    // regexp match in result, loosing information
                    const chunks = dateString.split(/([Z\-+])/);

                    // If splitter is not found in the string, we may be dealing with string that contains info about TZ.
                    // For instance, if format contains Z as last arg which is not separated (normally it is not indeed),
                    // like 'YYYY-MM-DD HH:mm:ssZ', then second to last parser will have string that it cannot just parse, like
                    // '2010-01-01 10:00:00'        -> '00'
                    // '2010-01-01 10:00:00Z'       -> '00Z'
                    // '2010-01-01 10:00:00-01'     -> '00-01'
                    // '2010-01-01 10:00:00+01:30'  -> '00+01:30'
                    // this cannot be processed by date parsers, so we need to process that additionally. So we
                    // split string by symbols that can be found around timezone info: Z,-,+
                    if (chunks.length === 1) {
                        part = dateString;
                        rest = '';
                    }
                    else {
                        part = chunks[0];
                        rest = `${chunks[1]}${chunks[2]}`;
                    }
                }
                else {
                    part = dateString.substring(0, splitAt) || dateString;
                    rest = dateString.substring(splitAt + parser.splitter.length);
                }

                if (parser.fn) {
                    // Run parser and add result to config on successful parse otherwise continue parsing
                    const
                        res = parser.fn(part);
                    if (res) {
                        Object.assign(config, res);
                    }
                    else {
                        rest = part + rest;
                    }
                }

                return rest;
            }
        }, dateString);

        // If year is specified date has to be greater than 0
        if (config.year && !config.date) {
            config.date = 1;
        }

        const date = DH.create(config);

        if (date) {
            result = date;
        }
        else {
            // Last resort, try if native passing can do it
            result = new Date(dateString);
        }

        return result;
    }

    /**
     * Creates a date from a date definition object. The object can have the following properties:
     * - year
     * - month
     * - date (day in month)
     * - hours
     * - minutes
     * - seconds
     * - milliseconds
     * - amPm : 'am' or 'pm', implies 12 hour clock
     * - timeZone : offset from UTC in minutes
     * @param {Object} definition
     * @returns {Date}
     * @category Parse & format
     */
    static create(definition) {
        // Shallow clone to not alter input
        const def = { ...definition };

        let invalid = isNaN(def.year),
            useUTC  = false;

        // Not much validation yet, only considered invalid if all properties are null
        if (!invalid) {
            let allNull = true;

            dateProperties.forEach(property => {
                if (!(property in def) || isNaN(def[property])) {
                    def[property] = 0;
                }
                allNull = allNull && def[property] === null;
            });

            invalid = allNull;
        }

        if (def.amPm === 'pm') {
            def.hours = (def.hours % 12) + 12;
        }

        if ('timeZone' in def) {
            useUTC = true;

            def.minutes -= def.timeZone;
        }

        if (invalid) {
            return null;
        }

        const
            args = [
                defaultValue(def.year, DEFAULT_YEAR),
                defaultValue(def.month, DEFAULT_MONTH),
                defaultValue(def.date, DEFAULT_DAY),
                def.hours,
                def.minutes,
                def.seconds,
                def.milliseconds
            ];

        return useUTC ? new Date(Date.UTC(...args)) : new Date(...args);
    }

    static toUTC(date) {
        return new Date(Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            date.getUTCHours(),
            date.getUTCMinutes(),
            date.getUTCSeconds(),
            date.getUTCMilliseconds()
        ));
    }

    /**
     * Converts a date to string with the specified format. Formats heavily inspired by https://momentjs.com.
     * Available formats (input used for output below is `new Date(2018,8,9,18,7,8,145)`):
     *
     * | Unit                  | Token | Description & output                  |
     * |-----------------------|-------|---------------------------------------|
     * | Year                  | YYYY  | 2018                                  |
     * |                       | YY    | 18                                    |
     * |                       | Y     | 2018                                  |
     * | Quarter               | Q     | 3                                     |
     * |                       | Qo    | 3rd                                   |
     * | Month                 | MMMM  | September                             |
     * |                       | MMM   | Sep                                   |
     * |                       | MM    | 09                                    |
     * |                       | Mo    | 9th                                   |
     * |                       | M     | 9                                     |
     * | Week (iso)            | WW    | 36 (2 digit)                          |
     * |                       | Wo    | 36th                                  |
     * |                       | W     | 36                                    |
     * | Date                  | DDDD  | Day of year, 3 digits                 |
     * |                       | DDDo  | Day of year, ordinal                  |
     * |                       | DDD   | Day of year                           |
     * |                       | DD    | 09                                    |
     * |                       | Do    | 9th                                   |
     * |                       | D     | 9                                     |
     * | Weekday               | dddd  | Sunday                                |
     * |                       | ddd   | Sun                                   |
     * |                       | dd    | Su                                    |
     * |                       | d1    | S                                     |
     * |                       | do    | 0th                                   |
     * |                       | d     | 0                                     |
     * | Hour                  | HH    | 18 (00 - 23)                          |
     * |                       | H     | 18 (0 - 23)                           |
     * |                       | hh    | 06 (00 - 12)                          |
     * |                       | h     | 6 (0 - 12)                            |
     * |                       | KK    | 19 (01 - 24)                          |
     * |                       | K     | 19 (1 - 24)                           |
     * |                       | kk    | 06 or 18, locale determines           |
     * |                       | k     | 6 or 18, locale determines            |
     * | Minute                | mm    | 07                                    |
     * |                       | m     | 7                                     |
     * | Second                | ss    | 08                                    |
     * |                       | s     | 8                                     |
     * | Millisecond           | S     | 1 (100ms)                             |
     * |                       | SS    | 14 (140ms)                            |
     * |                       | SSS   | 145 (145ms)                           |
     * | AM/PM                 | A     | AM or PM                              |
     * |                       | a     | am or pm                              |
     * | Predefined            | LT    | H: 2-digit (2d), m: 2d                |
     * | (uses browser locale) | LTS   | H: 2d, m: 2d, s : 2d                  |
     * |                       | LST   | Depends on 12 or 24 hour clock        |
     * |                       |       | 12h, H : 1d, m : 0 or 2d              |
     * |                       |       | 24h, H : 2d, m : 2d                   |
     * |                       | L     | Y: numeric (n), M : 2d, D : 2d        |
     * |                       | l     | Y: n, M : n, D : n                    |
     * |                       | LL    | Y: n, M : long (l), D : n             |
     * |                       | ll    | Y: n, M : short (s), D : n            |
     * |                       | LLL   | Y: n, M : l, D : n, H: n, m: 2d       |
     * |                       | lll   | Y: n, M : s, D : n, H: n, m: 2d       |
     * |                       | LLLL  | Y: n, M : l, D : n, H: n, m: 2d, d: l |
     * |                       | llll  | Y: n, M : s, D : n, H: n, m: 2d, d: s |
     *
     * Some examples:
     *
     * ```
     * DateHelper.format(new Date(2019, 7, 16), 'dddd') -> Friday
     * DateHelper.format(new Date(2019, 7, 16, 14, 27), 'HH:mm') --> 14:27
     * DateHelper.format(new Date(2019, 7, 16, 14, 27), 'L HH') --> 2019-07-16 14
     * ```
     *
     * Arbitrary text can be embedded in the format string by wrapping it with {}:
     *
     * ```
     * DateHelper.format(new Date(2019, 7, 16), '{It is }dddd{, yay!}') -> It is Friday, yay!
     * ```
     *
     * @param {Date} date Date
     * @param {String} format Desired format (uses `defaultFormat` if left out)
     * @returns {String} Formatted string
     * @category Parse & format
     */
    static format(date, format = DH.defaultFormat) {
        // Bail out if no date or invalid date
        if (!date || isNaN(date)) {
            return null;
        }

        let formatter = formatCache[format],
            output    = '';

        if (!formatter) {
            formatter = formatCache[format] = [];

            // Build formatter array with the steps needed to format the date
            for (let i = 0; i < format.length; i++) {
                // Matches a predefined format?
                const
                    formatMatch = format.substr(i).match(formatRegexp),
                    predefined  = formatMatch?.[0];

                if (predefined) {
                    const localeFormats = this.localize('L{formats}') || {},
                        fn            = localeFormats[predefined] || formats[predefined];
                    formatter.push(fn);
                    i += predefined.length - 1;
                }
                // Start of text block? Append it
                else if (format[i] === '{') {
                    // Find closing brace
                    const index = format.indexOf('}', i + 1);

                    // No closing brace, grab rest of string
                    if (index === -1) {
                        formatter.push(format.substr(i + 1));
                        i = format.length;
                    }
                    // Closing brace found
                    else {
                        formatter.push(format.substring(i + 1, index));
                        // Carry on after closing brace
                        i = index;
                    }
                }
                // Otherwise append to output (for example - / : etc)
                else {
                    formatter.push(format[i]);
                }
            }
        }

        formatter.forEach(step => {
            if (typeof step === 'string') {
                output += step;
            }
            else {
                output += step(date);
            }
        });

        // MS inserts a Left-to-right control char between localized date parts, remove it to have the expected string
        // output. Otherwise comparison with typed strings will fail
        if (BrowserHelper.isEdge || BrowserHelper.isIE11) {
            output = output.replace(/\u200E/g, '');
        }

        return output;
    }

    /**
     * Converts the specified amount of desired unit into milliseconds. Can be called by only specifying a unit as the
     * first argument, it then uses amount = 1. For example: asMilliseconds('hour') == asMilliseconds(1, 'hour')
     * @param {Number|String} amount Amount, what of is decided by specifying unit (also takes a unit which implies an amount of 1)
     * @param {String} unit Time unit (s, hour, months etc.)
     * @returns {Number}
     * @category Parse & format
     */
    static asMilliseconds(amount, unit = null) {
        if (typeof amount === 'string') {
            unit = amount;
            amount = 1;
        }

        return DH.as('millisecond', amount, unit);
    }

    /**
     * Converts the passed Date to an accurate number of months passed since the epoch start.
     * @param {Date} time The Date to find the month value of.
     * @returns {Number} The number of months since the system time epoch start. May be a fractional value.
     */
    static asMonths(time) {
        const
            monthLength = DH.as('ms', DH.daysInMonth(time), 'day'),
            fraction = (time.valueOf() - DH.startOf(time, 'month').valueOf()) / monthLength;

        return time.getYear() * 12 + time.getMonth() + fraction;

    }

    static monthsToDate(months) {
        const
            intMonths = Math.floor(months),
            fraction = months - intMonths,
            result = new Date(0, intMonths),
            msInMonth = DH.as('ms', DH.daysInMonth(result), 'days');

        result.setTime(result.getTime() + fraction * msInMonth);
        return result;
    }

    /**
     * Converts a millisecond time delta to a human readable form. For example `1000 * 60 * 60 * 50`
     * milliseconds would be rendered as "2 days, 2 hours"
     * @param {Number} delta The millisecond delta value.
     * @param {Object} [options] Formatting options.
     * @param {Boolean} [options.abbrev] Pass `true` to use abbreviated unit names, eg "2d, 2h" for the above example.
     * @param {String} [options.precision] The minimum precision unit.
     * @param {String} [options.separator] The separator to use
     * @param {Boolean} [options.asString] Pass `false` to return the result as an array, eg ['2d', '2h'] for the above example.
     * @category Parse & format
     */
    static formatDelta(delta, options) {
        let abbrev, unitName;

        if (typeof options === 'boolean') {
            abbrev = options;
        }
        else if (options) {
            abbrev    = options.abbrev;
        }

        const
            deltaObj = this.getDelta(delta, options),
            result   = [],
            sep      = options?.separator || (abbrev ? '' : ' ');

        for (unitName in deltaObj) {
            result.push(`${deltaObj[unitName]}${sep}${unitName}`);
        }

        return options?.asString === false ? result : result.join(', ');
    }

    /**
     * Converts a millisecond time delta to an object structure. For example `1000 * 60 * 60 * 50`
     * milliseconds the result would be as:
     * {
     *     day: 2,
     *     hour: 2
     * }
     *
     * @param {Number} delta The millisecond delta value.
     * @param {Object} [options] Formatting options.
     * @param {Boolean} [options.abbrev] Pass `true` to use abbreviated unit names, eg "{ d: 2, h: 2 }" for the above example.
     * @param {String} [options.precision] The minimum precision unit.
     * @returns {Object} The object with the values for each unit.
     */
    static getDelta(delta, options) {
        let abbrev, d, done, precision, unitName;

        if (typeof options === 'boolean') {
            abbrev = options;
        }
        else if (options) {
            abbrev = options.abbrev;
            precision = DH.normalizeUnit(options.precision);
        }

        const
            result  = {},
            getUnit = abbrev ? DH.getShortNameOfUnit : DH.getLocalizedNameOfUnit;

        // Loop downwards through the magnitude of units from year -> ms
        for (unitName of deltaUnits) {
            d = DH.as(unitName, delta);

            done = precision === unitName;
            d = Math[done ? 'round' : 'floor'](d);

            // If there's a non-zero integer quantity of this unit, add it to result
            // and subtract from the delta, then go round to next unit down.
            if (d || (done && !result.length)) {
                result[getUnit.call(DH, unitName, d !== 1)] = d; // TODO 0 is plural in EN but...?
                delta -= DH.as('ms', d, unitName);
            }

            if (done || !delta) {
                break;
            }
        }

        return result;
    }

    /**
     * Converts the specified amount of one unit (fromUnit) into an amount of another unit (toUnit)
     * @param {String} toUnit The name of units to convert to, eg: `'ms'`
     * @param {Number|String} amount The time to convert. Either the magnitude number form
     * or a duration string such as '2d'.
     * @param {String} [fromUnit] If the amount was passed as a number, the units to use to convert from.
     * @returns {Number}
     * @category Parse & format
     */
    static as(toUnit, amount, fromUnit = 'ms') {
        // Allow DH.as('ms', '2d')
        if (typeof amount === 'string') {
            amount = DH.parseDuration(amount);
        }
        // Allow DH.as('ms', myDurationObject)
        if (typeof amount === 'object') {
            fromUnit = amount.unit;
            amount = amount.magnitude;
        }

        if (toUnit === fromUnit) {
            return amount;
        }

        toUnit = DH.normalizeUnit(toUnit);
        fromUnit = DH.normalizeUnit(fromUnit);

        if (toUnit === fromUnit) {
            return amount;
        }
        // validConversions[][] can be negative to signal that conversion is not exact, ignore sign here
        else if (unitMagnitudes[fromUnit] > unitMagnitudes[toUnit]) {
            return amount * Math.abs(validConversions[fromUnit][toUnit]);
        }
        else {
            return amount / Math.abs(validConversions[toUnit][fromUnit]);
        }
    }

    static formatContainsHourInfo(format) {
        const
            stripEscapeRe = /(\\.)/g,
            hourInfoRe    = /([HhKkmSsAa]|LT|L{3,}|l{3,})/;

        return hourInfoRe.test(format.replace(stripEscapeRe, ''));
    }

    /**
     * Returns true for 24 hour format.
     * @param {String} format Date format
     * @returns {Boolean}
     * @category Parse & format
     */
    static is24HourFormat(format) {
        return DH.format(DH.getTime(13, 0, 0), format).includes('13');
    }

    //endregion

    //region Manipulate

    /**
     * Add days, hours etc. to a date. Always clones the date, original will be left unaffected.
     * @param {Date|String} date Original date
     * @param {Number} amount Amount of days, hours etc
     * @param {String} unit Unit for amount
     * @returns {Date} New calculated date
     * @category Manipulate
     */
    static add(date, amount, unit = 'ms') {
        let d;

        if (typeof date === 'string') {
            d = DH.parse(date);
        }
        else {
            d = new Date(date.getTime());
        }

        if (!unit || amount === 0) return d;

        unit = DH.normalizeUnit(unit);

        switch (unit) {
            case 'millisecond':
                d = new Date(d.getTime() + amount);
                break;
            case 'second':
                d = new Date(d.getTime() + (amount * 1000));
                break;
            case 'minute':
                d = new Date(d.getTime() + (amount * 60000));
                break;
            case 'hour':
                d = new Date(d.getTime() + (amount * 3600000));
                break;
            case 'day':
                // Integer value added, do calendar calculation to correctly handle DST etc.
                if (amount % 1 === 0) {
                    d.setDate(d.getDate() + amount);
                }
                // No browsers support fractional values for dates any longer, do time based calculation
                else {
                    d = new Date(d.getTime() + (amount * 86400000));
                }

                // When crossing DST in Brazil, we expect hours to end up the same
                if (d.getHours() === 23 && date.getHours() === 0) {
                    d = DH.add(d, 1, 'hour');
                }
                break;
            case 'week':
                d.setDate(d.getDate() + amount * 7);
                break;
            case 'month': {
                let day = d.getDate();
                if (day > 28) {
                    day = Math.min(day, DH.getLastDateOfMonth(DH.add(DH.getFirstDateOfMonth(d), amount, 'month')).getDate());
                }
                d.setDate(day);
                d.setMonth(d.getMonth() + amount);
                break;
            }
            case 'quarter':
                d = DH.add(d, amount * 3, 'month');
                break;
            case 'year':
                d.setFullYear(d.getFullYear() + amount);
                break;
        }
        return d;
    }

    /**
     * Calculates the difference between two dates, in the specified unit.
     * @param {Date} start First date
     * @param {Date} end Second date
     * @param {String} unit Unit to calculate difference in
     * @param {Boolean} fractional Specify false to round result
     * @returns {Number} Difference in the specified unit
     * @category Manipulate
     */
    static diff(start, end, unit = 'ms', fractional = true) {
        unit = DH.normalizeUnit(unit);

        if (!start || !end) return 0;

        let amount;

        switch (unit) {
            case 'year':
                amount = DH.diff(start, end, 'month') / 12;
                break;

            case 'quarter':
                amount = DH.diff(start, end, 'month') / 3;
                break;

            case 'month':
                amount = ((end.getFullYear() - start.getFullYear()) * 12) + (end.getMonth() - start.getMonth());
                break;

            case 'week':
                amount = DH.diff(start, end, 'day') / 7;
                break;

            case 'day': {
                const dstDiff = start.getTimezoneOffset() - end.getTimezoneOffset();
                amount = (end - start + dstDiff * 60 * 1000) / 86400000;
                break;
            }

            case 'hour':
                amount = (end - start) / 3600000;
                break;

            case 'minute':
                amount = (end - start) / 60000;
                break;

            case 'second':
                amount = (end - start) / 1000;
                break;

            case 'millisecond':
                amount = (end - start);
                break;
        }

        return fractional ? amount : Math.round(amount);
    }

    /**
     * Sets the date to the start of the specified unit, by default returning a clone of the date instead of changing it
     * inplace.
     * @param {Date} date Original date
     * @param {String} unit Start of this unit, 'day', 'month' etc.
     * @param {Boolean} clone Manipulate a copy of the date
     * @returns {Date} Manipulated date
     * @category Manipulate
     */
    static startOf(date, unit = 'day', clone = true) {
        if (!date) {
            return null;
        }

        unit = DH.normalizeUnit(unit);

        if (clone) date = DH.clone(date);

        const toSet = {},
            index = unitMagnitudes[unit];

        for (let i = 0; i < index; i++) {
            const currentUnit = canonicalUnitNames[i];
            // Week and quarter are not part of the date
            if (currentUnit !== 'quarter' && currentUnit !== 'week') {
                toSet[currentUnit] = currentUnit === 'day' ? 1 : 0; // day is 1 based
            }
        }

        // Special handling of quarter and week
        if (unit === 'quarter') {
            toSet.month = (DH.get(date, 'quarter') - 1) * 3;
        }
        else if (unit === 'week') {
            const delta = date.getDay() - DH.weekStartDay;
            toSet.day = date.getDate() - delta;
        }

        return DH.set(date, toSet);
    }

    /**
     * Returns the end point of the passed date, that is 00:00:00 of the day after the passed date.
     * @param {Date} date The date to return the end point of.
     */
    static endOf(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    }

    /**
     * Creates a clone of the specified date
     * @param {Date} date Original date
     * @returns {Date} Cloned date
     * @category Manipulate
     */
    static clone(date) {
        return new Date(date.getTime());
    }

    /**
     * Removes time from a date (same as calling #startOf(date, 'day'))
     * @param {Date} date Date to remove time from
     * @param {Boolean} clone Manipulate a copy of the date
     * @returns {Date} Manipulated date
     * @category Manipulate
     */
    static clearTime(date, clone = true) {
        return DH.startOf(date, 'day', clone);
    }

    static midnight(date, inclusive) {
        let ret = DH.clearTime(date);

        if (inclusive && ret < date) {
            ret = DH.add(ret, 1, 'd');
        }

        return ret;
    }

    /**
     * Returns the elapsed milliseconds from the start of the specified date.
     * @param {Date} date Date to remove date from.
     * @param {String} [as] The time unit to return.
     * @returns {Number} The elapsed milliseconds from the start of the specified date
     * @category Manipulate
     */
    static getTimeOfDay(date, as = 'ms') {
        const t = (date.getHours() * validConversions.hour.millisecond) +
            (date.getMinutes() * validConversions.minute.millisecond) +
            (date.getSeconds() * validConversions.second.millisecond) +
            date.getMilliseconds();

        return (as === 'ms') ? t : DH.as(as, t, 'ms');
    }

    /**
     * Sets a part of a date (in place)
     * @param {Date} date Date to manipulate
     * @param {String|Object} unit Part of date to set, for example 'minute'. Or an object like { second: 1, minute: 1 }
     * @param {Number} amount Value to set
     * @returns {Date} Modified date
     * @category Manipulate
     */
    static set(date, unit, amount) {
        if (!unit) {
            return date;
        }

        if (typeof unit === 'string') {
            switch (DH.normalizeUnit(unit)) {
                case 'millisecond':
                    // Setting value to 0 when it is 0 at DST crossing messes it up
                    if (amount !== 0 || date.getMilliseconds() > 0) {
                        date.setMilliseconds(amount);
                    }
                    break;
                case 'second':
                    // Setting value to 0 when it is 0 at DST crossing messes it up
                    if (amount !== 0 || date.getSeconds() > 0) {
                        date.setSeconds(amount);
                    }
                    break;
                case 'minute':
                    // Setting value to 0 when it is 0 at DST crossing messes it up
                    if (amount !== 0 || date.getMinutes() > 0) {
                        date.setMinutes(amount);
                    }
                    break;
                case 'hour':
                    date.setHours(amount);
                    break;
                case 'day':
                case 'date':
                    date.setDate(amount);
                    break;
                case 'week':
                    throw new Error('week not implemented');
                case 'month':
                    date.setMonth(amount);
                    break;
                case 'quarter':
                    // Setting quarter = first day of first month of that quarter
                    date.setDate(1);
                    date.setMonth((amount - 1) * 3);
                    break;
                case 'year':
                    date.setFullYear(amount);
                    break;
            }
        }
        else {
            Object.entries(unit)
                // Make sure smallest unit goes first, to not change month before changing day
                .sort((a, b) => unitMagnitudes[a[0]] - unitMagnitudes[b[0]])
                .forEach(([unit, amount]) => {
                    DH.set(date, unit, amount);
                });
        }

        return date;
    }

    static setDateToMidday(date, clone = true) {
        return DH.set(DH.clearTime(date, clone), 'hour', 12);
    }

    /**
     * Constrains the date within a min and a max date
     * @param {Date} date The date to constrain
     * @param {Date} [min] Min date
     * @param {Date} [max] Max date
     * @return {Date} The constrained date
     * @category Manipulate
     */
    static constrain(date, min, max) {
        if (min != null) {
            date = DH.max(date, min);
        }
        return max == null ? date : DH.min(date, max);
    }

    /**
     * Returns time with default year, month, and day (Jan 1, 2020)
     * @param {Number|Date} hours Hours value or the full date to extract the time of.
     * @param {Number} minutes Minutes value
     * @param {Number} seconds Seconds value
     * @param {Number} ms Milliseconds value
     * @returns {Date} A new default date with the time extracted from the given date or from the time values provided individually.
     * @category Manipulate
     */
    static getTime(hours, minutes = 0, seconds = 0, ms = 0) {
        if (hours instanceof Date) {
            ms = hours.getMilliseconds();
            seconds = hours.getSeconds();
            minutes = hours.getMinutes();
            hours = hours.getHours();
        }
        return new Date(DEFAULT_YEAR, DEFAULT_MONTH, DEFAULT_DAY, hours, minutes, seconds, ms);
    }

    /**
     * Copies hours, minutes, seconds, milliseconds from one date to another
     *
     * @param {Date} targetDate The target date
     * @param {Date} sourceDate The source date
     * @return {Date} The adjusted target date
     * @category Manipulate
     * @static
     */
    static copyTimeValues(targetDate, sourceDate) {
        targetDate.setHours(sourceDate.getHours());
        targetDate.setMinutes(sourceDate.getMinutes());
        targetDate.setSeconds(sourceDate.getSeconds());
        targetDate.setMilliseconds(sourceDate.getMilliseconds());
        return targetDate;
    }

    //endregion

    //region Comparison

    static isDST(date) {
        const
            year = date.getFullYear(),
            jan  = new Date(year, 0, 1),
            jul  = new Date(year, 6, 1);
        return date.getTimezoneOffset() < Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    }

    /**
     * Determines if a date precedes another.
     * @param {Date} first First date
     * @param {Date} second Second date
     * @returns {Boolean} true if first precedes second, otherwise false
     * @category Comparison
     */
    static isBefore(first, second) {
        return first < second;
    }

    /**
     * Determines if a date succeeds another.
     * @param {Date} first First date
     * @param {Date} second Second date
     * @returns {Boolean} true if first succeeds second, otherwise false
     * @category Comparison
     */
    static isAfter(first, second) {
        return first > second;
    }

    /**
     * Checks if two dates are equal.
     * @param {Date} first First date
     * @param {Date} second Second date
     * @param {String} unit If not given, the comparison will be done up to a millisecond
     * @returns {Boolean} true if the dates are equal
     * @category Comparison
     */
    static isEqual(first, second, unit = null) {
        if (unit === null) {
            // https://jsbench.me/3jk2bom2r3/1
            // https://jsbench.me/ltkb3vk0ji/1 (more flavors) - getTime is >2x faster vs valueOf/Number/op+
            return first && second && first.getTime() === second.getTime();
        }

        return DH.startOf(first, unit) - DH.startOf(second, unit) === 0;
    }

    /**
     * Compares two dates using the specified precision
     * @param {Date} first
     * @param {Date} second
     * @param {String} unit
     * @returns {Number} 0 = equal, -1 first before second, 1 first after second
     * @category Comparison
     */
    static compare(first, second, unit = null) {
        // Unit specified, cut the rest out
        if (unit) {
            first = DH.startOf(first, unit);
            second = DH.startOf(second, unit);
        }

        // Comparison on ms level
        if (first < second) return -1;
        if (first > second) return 1;
        return 0;
    }

    /**
     * Checks if date is the start of specified unit
     * @param {Date} date
     * @param {String} unit
     * @returns {Boolean}
     * @category Comparison
     */
    static isStartOf(date, unit) {
        return DH.isEqual(date, DH.startOf(date, unit));
    }

    /**
     * Checks if this date is >= start and < end.
     * @param {Date} date The source date
     * @param {Date} start Start date
     * @param {Date} end End date
     * @return {Boolean} true if this date falls on or between the given start and end dates.
     * @category Comparison
     */
    static betweenLesser(date, start, end) {
        //return start <= date && date < end;
        return start.getTime() <= date.getTime() && date.getTime() < end.getTime();
    }

    /**
     * Checks if this date is >= start and <= end.
     * @param {Date} date The source date
     * @param {Date} start Start date
     * @param {Date} end End date
     * @return {Boolean} true if this date falls on or between the given start and end dates.
     * @category Comparison
     */
    static betweenLesserEqual(date, start, end) {
        return start.getTime() <= date.getTime() && date.getTime() <= end.getTime();
    }

    /**
     * Returns true if dates intersect
     * @param {Date} date1Start
     * @param {Date} date1End
     * @param {Date} date2Start
     * @param {Date} date2End
     * @return {Boolean} Returns true if dates intersect
     * @category Comparison
     */
    static intersectSpans(date1Start, date1End, date2Start, date2End) {
        return DH.betweenLesser(date1Start, date2Start, date2End) ||
            DH.betweenLesser(date2Start, date1Start, date1End);
    }

    /**
     * Returns 1 if first param is a greater unit than second param, -1 if the opposite is true or 0 if they're equal
     * @param {String} unit1 The 1st unit
     * @param {String} unit2 The 2nd unit
     * @category Comparison
     */
    static compareUnits(unit1, unit2) {
        return Math.sign(unitMagnitudes[unit1] - unitMagnitudes[unit2]);
    }

    /**
     * Returns true if the first time span completely 'covers' the second time span.
     * @example
     * DateHelper.timeSpanContains(new Date(2010, 1, 2), new Date(2010, 1, 5), new Date(2010, 1, 3), new Date(2010, 1, 4)) ==> true
     * DateHelper.timeSpanContains(new Date(2010, 1, 2), new Date(2010, 1, 5), new Date(2010, 1, 3), new Date(2010, 1, 6)) ==> false
     * @param {Date} spanStart The start date for initial time span
     * @param {Date} spanEnd The end date for initial time span
     * @param {Date} otherSpanStart The start date for the 2nd time span
     * @param {Date} otherSpanEnd The end date for the 2nd time span
     * @return {Boolean}
     * @category Comparison
     */
    static timeSpanContains(spanStart, spanEnd, otherSpanStart, otherSpanEnd) {
        return (otherSpanStart - spanStart) >= 0 && (spanEnd - otherSpanEnd) >= 0;
    }

    //endregion

    //region Query

    /**
     * Get the first day of week, 0-6 (Sunday-Saturday).
     * This is determined by the current locale's `DateHelper.weekStartDay` parameter.
     * @property {Number}
     * @readonly
     */
    static get weekStartDay() {
        // Defaults to 0, should not need to happen in real world scenarios when a locale is always loaded
        return this.localize('L{weekStartDay}') || 0;
    }

    /**
     * Get non-working days as an object where keys are day indices, 0-6 (Sunday-Saturday), and the value is `true`.
     * This is determined by the current locale's `DateHelper.nonWorkingDays` parameter.
     *
     * For example:
     * ```
     * {
     *     0 : true, // Sunday
     *     6 : true  // Saturday
     * }
     * ```
     * @property {Object}
     * @readonly
     */
    static get nonWorkingDays() {
        return { ...this.localize('L{nonWorkingDays}') };
    }

    /**
     * Get non-working days as an array of day indices, 0-6 (Sunday-Saturday).
     * This is determined by the current locale's `DateHelper.nonWorkingDays` parameter.
     *
     * For example:
     * ```
     * [ 0, 6 ] // Sunday & Saturday
     * ```
     * @property {Number[]}
     * @readonly
     * @internal
     */
    static get nonWorkingDaysAsArray() {
        // transform string keys to integers
        return Object.keys(this.nonWorkingDays).map(Number);
    }

    /**
     * Get weekend days as an object where keys are day indices, 0-6 (Sunday-Saturday), and the value is `true`.
     * Weekends are days which are declared as weekend days by the selected country and defined by the current locale's `DateHelper.weekends` parameter.
     * To get non-working days see {@link #property-nonWorkingDays-static}.
     *
     * For example:
     * ```
     * {
     *     0 : true, // Sunday
     *     6 : true  // Saturday
     * }
     * ```
     * @property {Object}
     * @readonly
     * @internal
     */
    static get weekends() {
        return { ...this.localize('L{weekends}') };
    }

    /**
     * Get the specified part of a date
     * @param {Date} date
     * @param {String} unit Part of date, hour, minute etc.
     * @category Query
     */
    static get(date, unit) {
        switch (DH.normalizeUnit(unit)) {
            case 'millisecond':
                return date.getMilliseconds();
            case 'second':
                return date.getSeconds();
            case 'minute':
                return date.getMinutes();
            case 'hour':
                return date.getHours();
            case 'date':
            case 'day': // Scheduler has a lot of calculations expecting this to work
                return date.getDate();
            case 'week':
                return formats.W(date);
            case 'month':
                return date.getMonth();
            case 'quarter':
                return Math.floor(date.getMonth() / 3) + 1;
            case 'year':
                return date.getFullYear();
        }

        return null;
    }

    /**
     * Get number of days in the current month for the supplied date
     * @param {Date} date Date which month should be checked
     * @returns {Number} Days in month
     * @category Query
     */
    static daysInMonth(date) {
        const d = DH.clone(date);
        d.setDate(1);
        d.setMonth(date.getMonth() + 1);
        d.setDate(0);
        return d.getDate();
    }

    /**
     * Get the first date of the month for the supplied date
     * @param {Date} date
     * @returns {Date}
     * @category Query
     */
    static getFirstDateOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    }

    /**
     * Get the last date of the month for the supplied date
     * @param {Date} date
     * @returns {Date}
     * @category Query
     */
    static getLastDateOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }

    /**
     * Get the earliest of two dates
     * @param {Date} first
     * @param {Date} second
     * @returns {Date} Earliest date
     * @category Query
     */
    static min(first, second) {
        return first.getTime() < second.getTime() ? first : second;
    }

    /**
     * Get the latest of two dates
     * @param {Date} first
     * @param {Date} second
     * @returns {Date} Latest date
     * @category Query
     */
    static max(first, second) {
        return first.getTime() > second.getTime() ? first : second;
    }

    /**
     * Get an incremented date. Incrementation based on specified unit and optional amount
     * @param {Date} date
     * @param {String} unit
     * @param {Number} [increment]
     * @param {Number} [weekStartDay] Will default to what is set in locale
     * @returns {Date}
     * @category Query
     */
    static getNext(date, unit, increment = 1, weekStartDay = DH.weekStartDay) {
        if (unit === 'week') {
            let
                dt = DH.clone(date);
            const
                day = dt.getDay();
            dt = DH.startOf(dt, 'day');
            dt = DH.add(dt, weekStartDay - day + 7 * (increment - (weekStartDay <= day ? 0 : 1)), 'day');

            // For south american timezones, midnight does not exist on DST transitions, adjust...
            if (dt.getDay() !== weekStartDay) DH.add(dt, 1, 'hour');

            return dt;
        }

        return DH.startOf(DH.add(date, increment, unit), unit);
    }

    /**
     * Checks if date object is valid.
     *
     * For example:
     *
     * ```javascript
     * date = new Date('foo')
     * date instanceof Date // true
     * date.toString() // "Invalid Date"
     * isNaN(date) // true
     * DateHelper.isValidDate(date) // false
     *
     * date = new Date()
     * date instanceof Date // true
     * date.toString() // "Mon Jan 13 2020 18:27:38 GMT+0300 (GMT+03:00)"
     * isNaN(date) // false
     * DateHelper.isValidDate(date) // true
     * ```
     *
     * @param {Date} date
     * @returns {Boolean}
     */
    static isValidDate(date) {
        return DH.isDate(date) && !isNaN(date);
    }

    /**
     * Checks if value is a date object. Allows to recognize date object even from another context,
     * like the top frame when used in an iframe.
     *
     * @param {*} value
     * @returns {Boolean}
     */
    static isDate(value) {
        // see https://jsbench.me/s7kb49w83j/1 (cannot use instanceof cross-frame):
        return value && toString.call(value) === DATE_TYPE;
    }

    /**
     * Get the start of the next day
     * @param {Date} date
     * @param {Boolean} clone
     * @param {Boolean} noNeedToClearTime
     * @returns {Date}
     * @category Query
     */
    static getStartOfNextDay(date, clone, noNeedToClearTime) {
        let nextDay = DH.add(noNeedToClearTime ? date : DH.clearTime(date, clone), 1, 'day');

        // DST case
        if (nextDay.getDate() === date.getDate()) {
            const
                offsetNextDay = DH.add(DH.clearTime(date, clone), 2, 'day').getTimezoneOffset(),
                offsetDate    = date.getTimezoneOffset();

            nextDay = DH.add(nextDay, offsetDate - offsetNextDay, 'minute');
        }

        return nextDay;
    }

    /**
     * Get the end of previous day
     * @param {Date} date
     * @param {Boolean} noNeedToClearTime
     * @returns {Date}
     * @category Query
     */
    static getEndOfPreviousDay(date, noNeedToClearTime) {
        const dateOnly = noNeedToClearTime ? date : DH.clearTime(date, true);

        // dates are different
        if (dateOnly - date) {
            return dateOnly;
        }
        else {
            return DH.add(dateOnly, -1, 'day');
        }
    }

    /**
     * Returns a string describing the specified week. For example, "39, September 2020" or "40, Sep - Oct 2020".
     * @param {Date} startDate
     * @param {Date} [endDate]
     * @returns {String}
     * @internal
     */
    static getWeekDescription(startDate, endDate = startDate) {
        const
            monthDesc  = startDate.getMonth() === endDate.getMonth()
                ? DateHelper.format(startDate, 'MMMM')
                : `${DateHelper.format(startDate, 'MMM')} - ${DateHelper.format(endDate, 'MMM')}`,
            week = DateHelper.getWeekNumber(startDate);

        return `${week[1]}, ${monthDesc} ${week[0]}`;
    }

    /**
     * Get week number for the date.
     * @param {Date} date date
     * @param {Number} weekStartDay first day of week, 0-6 (Sunday-Saturday). Defaults to the {@link #property-weekStartDay-static}.
     * @returns {Number[]} year and week number
     * @category Query
     */
    static getWeekNumber(date, weekStartDay = DateHelper.weekStartDay) {
        const
            jan01     = new Date(date.getFullYear(), 0, 1),
            dec31     = new Date(date.getFullYear(), 11, 31),
            firstDay  = normalizeDay(jan01.getDay() - weekStartDay),
            lastDay   = normalizeDay(dec31.getDay() - weekStartDay),
            dayNumber = getDayDiff(date, jan01);

        let weekNumber;

        // Check if the year starts before the middle of a week
        if (firstDay < 4) {
            weekNumber = Math.floor((dayNumber + firstDay - 1) / 7) + 1;
        }
        else {
            weekNumber = Math.floor((dayNumber + firstDay - 1) / 7);
        }

        if (weekNumber) {
            let year = date.getFullYear();

            // Might be week 1 of next year if the year ends before day 3 (0 based)
            if (weekNumber === 53 && lastDay < 3) {
                year++;
                weekNumber = 1;
            }
            return [year, weekNumber];
        }

        // We're in week zero which is the last week of the previous year, so ask what
        // week encapsulates 31 Dec in the previous year.
        const lastWeekOfLastYear = DateHelper.getWeekNumber(new Date(date.getFullYear() - 1, 11, 31))[1];

        return [date.getFullYear() - 1, lastWeekOfLastYear];
    }

    //endregion

    //region Unit helpers

    /**
     * Turns (10, 'day') into '10 days' etc.
     * @param {Number} count Amount of unit
     * @param {String} unit Unit, will be normalizes (days, d -> day etc.)
     * @returns {String}
     * @category Unit helpers
     */
    static formatCount(count, unit) {
        unit = DH.normalizeUnit(unit);
        if (count !== 1) unit += 's';
        return count + ' ' + unit;
    }

    /**
     * Get the ratio between two units ( year, month -> 1/12 )
     * @param {String} baseUnit
     * @param {String} unit
     * @param {Boolean} acceptEstimate If true, process negative values of validConversions. Defaults to false.
     * @returns {Number} Ratio
     * @category Unit helpers
     */
    static getUnitToBaseUnitRatio(baseUnit, unit, acceptEstimate = false) {
        baseUnit = DH.normalizeUnit(baseUnit);
        unit = DH.normalizeUnit(unit);

        if (baseUnit === unit) return 1;

        // Some validConversions have negative sign to signal that it is not an exact conversion.
        // Ignore those here unless acceptEstimate is provided.
        if (validConversions[baseUnit] && validConversions[baseUnit][unit] && (acceptEstimate || validConversions[baseUnit][unit] > 0)) {
            return 1 / DH.as(unit, 1, baseUnit);
        }

        if (validConversions[unit] && validConversions[unit][baseUnit] && (acceptEstimate || validConversions[unit][baseUnit] > 0)) {
            return DH.as(baseUnit, 1, unit);
        }

        return -1;
    }

    /**
     * Returns a localized abbreviated form of the name of the duration unit.
     * For example in the `EN` locale, for `"qrt"` it will return `"q"`.
     * @param {String} unit Duration unit
     * @return {String}
     * @category Unit helpers
     */
    static getShortNameOfUnit(unit) {
        // Convert abbreviations to the canonical name.
        // See locale file and the applyLocale method below.
        unit = DH.parseTimeUnit(unit);

        // unitLookup is keyed by eg 'DAY', 'day', 'MILLISECOND', 'millisecond' etc
        return DH.unitLookup[unit].abbrev;
    }

    /**
     * Returns a localized full name of the duration unit.
     *
     * For for example in the `EN` locale, for `"d"` it will return either
     * `"day"` or `"days"`, depending from the `plural` argument
     *
     * Preserves casing of first letter.
     *
     * @static
     * @param {String} unit Time unit
     * @param {Boolean} [plural] Whether to return a plural name or singular
     * @return {String}
     * @category Unit helpers
     */
    static getLocalizedNameOfUnit(unit, plural = false) {
        const capitalize = unit.charAt(0) === unit.charAt(0).toUpperCase();

        // Normalize to not have to have translations for each variation used in code
        unit = DH.normalizeUnit(unit);

        // Convert abbreviations to the canonical name.
        // See locale file and the applyLocale method below.
        unit = DH.parseTimeUnit(unit);

        // Translate
        // unitLookup is keyed by eg 'DAY', 'day', 'MILLISECOND', 'millisecond' etc
        unit = DH.unitLookup[unit][plural ? 'plural' : 'single'];

        // Preserve casing of first letter
        if (capitalize) {
            unit = StringHelper.capitalize(unit);
        }

        return unit;
    }

    /**
     * Normalizes a unit for easier usage in conditionals. For example year, years, y -> year
     * @param {String} unit
     * @returns {String}
     * @category Unit helpers
     */
    static normalizeUnit(unit) {
        if (!unit) {
            return null;
        }

        const unitLower = unit.toLowerCase();

        if (unitLower === 'date') {
            return unitLower;
        }

        return canonicalUnitNames.includes(unitLower)
            // Already valid
            ? unitLower
            // Trying specified case first, since we have both "M" for month and "m" for minute
            : normalizedUnits[unit] || normalizedUnits[unitLower];
    }

    static getUnitByName(name) {
        // Allow either a canonical name to be passed, or, if that fails, parse it as a localized name or abbreviation.
        return DH.normalizeUnit(name) || DH.normalizeUnit(DH.parseTimeUnit(name));
    }

    /**
     * Returns a duration of the timeframe in the given unit.
     * @param {Date} start The start date of the timeframe
     * @param {Date} end The end date of the timeframe
     * @param {String} unit Duration unit
     * @return {Number} The duration in the units
     * @category Unit helpers
     * @ignore
     */
    static getDurationInUnit(start, end, unit, doNotRound) {
        return DH.diff(start, end, unit, doNotRound);
    }

    /**
     * Checks if two date units align
     * @private
     * @param {String} majorUnit
     * @param {String} minorUnit
     * @returns {Boolean}
     * @category Unit helpers
     */
    static doesUnitsAlign(majorUnit, minorUnit) {
        // TODO: probably needs some fleshing out to be generally useful, otherwise move to TimeAxisViewModel?
        // Maybe also use getUnitToBaseUnitRatio() for assertion?
        return !(majorUnit !== minorUnit && minorUnit === 'week');
    }

    static getSmallerUnit(unit) {
        return canonicalUnitNames[unitMagnitudes[DH.normalizeUnit(unit)] - 1] || null;
    }

    static getLargerUnit(unit) {
        return canonicalUnitNames[unitMagnitudes[DH.normalizeUnit(unit)] + 1] || null;
    }

    /**
     *
     * Rounds the passed Date value to the nearest `increment` value.
     *
     * Optionally may round relative to a certain base time point.
     *
     * For example `DH.round(new Date('2020-01-01T09:35'), '30 min', new Date('2020-01-01T09:15'))`
     * would round to 9:45 because that's the nearest integer number of 30 minute increments
     * from the base.
     *
     * Note that `base` is ignored when rounding to weeks. The configured {@link #property-weekStartDay-static}
     * dictates what the base of a week is.
     *
     * @param {Date} time The time to round
     * @param {String|Number} increment A millisecond value by which to round the time.
     * May be specified in string form eg: `'15 minutes'`
     * @param {Date} [base] The "start" from which to apply the rounding.
     */
    static round(time, increment, base) {
        return DH.snap('round', time, increment, base);
    }

    /**
     *
     * Floor the passed Date value to the nearest `increment` value.
     *
     * Optionally may floor relative to a certain base time point.
     *
     * For example `DH.floor(new Date('2020-01-01T09:35'), '30 min', new Date('2020-01-01T09:15'))`
     * would floor to 9:15 because that's the closest lower integer number of 30 minute increments
     * from the base.
     *
     * Note that `base` is ignored when flooring to weeks. The configured {@link #property-weekStartDay-static}
     * dictates what the base of a week is.
     *
     * @param {Date} time The time to floor
     * @param {String|Number} increment A millisecond value by which to floor the time.
     * May be specified in string form eg: `'15 minutes'`
     * @param {Date} [base] The "start" from which to apply the flooring.
     */
    static floor(time, increment, base) {
        return DH.snap('floor', time, increment, base);
    }

    /**
     *
     * Ceils the passed Date value to the nearest `increment` value.
     *
     * Optionally may ceil relative to a certain base time point.
     *
     * For example `DH.ceil(new Date('2020-01-01T09:35'), '30 min', new Date('2020-01-01T09:15'))`
     * would ceil to 9:45 because that's the closest higher integer number of 30 minute increments
     * from the base.
     *
     * Note that `base` is ignored when ceiling to weeks. The configured {@link #property-weekStartDay-static}
     * dictates what the base of a week is.
     *
     * @param {Date} time The time to ceil
     * @param {String|Number|Object} increment A numeric millisecond value by which to ceil the time.
     * or a duration in string form eg `'30 min'` or object form : `{unit: "minute", magnitude: 30}`
     * or `{unit: "minute", increment: 30}`
     * May be specified in string form eg: `'15 minutes'`
     * @param {Date} [base] The "start" from which to apply the ceiling.
     */
    static ceil(time, increment, base) {
        return DH.snap('ceil', time, increment, base);
    }

    /**
     * Implementation for round, floor and ceil.
     * @internal
     */
    static snap(operation, time, increment, base) {
        const snapFn = snapFns[operation];

        if (typeof increment === 'string') {
            increment = DH.parseDuration(increment);
        }
        if (Objects.isObject(increment)) {
            // Allow {unit: "minute", increment: 30} or {unit: "minute", magnitude: 30}
            // parseDuration produces "magnitude". The Scheduler's TimeAxis uses "increment"
            // in its resolution object, so we allow that too.
            const magnitude = increment.magnitude || increment.increment;

            // increment is in weeks, months, quarters or years, then it can't be handled
            // using millisecond arithmetic.
            switch (increment.unit) {
                case 'week':
                {
                    const
                        { weekStartDay } = DH,
                        weekDay          = time.getDay();

                    // weekStartDay gives our base
                    // Our base is the start of the week
                    base = DH.add(DH.clearTime(time),
                        weekDay >= weekStartDay ? weekStartDay - weekDay : -(weekDay - weekStartDay + 7), 'day');

                    return DH[operation](time, `${magnitude * 7} days`, base);
                }
                case 'month':
                {
                    // Express the time as a number of months from epoch start.
                    // May be a fraction, eg the 15th will be 0.5 through a month.
                    time = DH.asMonths(time);

                    let resultMonths;

                    // Snap the month count in the way requested
                    if (base) {
                        base = DH.asMonths(base);

                        resultMonths = time + snapFn(time - base, magnitude);
                    }
                    else {
                        resultMonths = snapFn(time, magnitude);
                    }

                    // Convert resulting month value back to a date
                    return DH.monthsToDate(resultMonths);
                }
                case 'quarter':
                    return DH[operation](time, `${magnitude * 3} months`, base);
                case 'year':
                    return DH[operation](time, `${magnitude * 12} months`, base);
                case 'decade':
                    // We assume that decades begin with a year divisible by 10
                    return DH[operation](time, `${magnitude * 10} years`, base);
            }

            // Convert to a millisecond value
            increment = DH.as('ms', magnitude, increment.unit);
        }

        // It's a simple round to milliseconds
        if (base) {
            const tzChange = DH.as('ms', base.getTimezoneOffset() - time.getTimezoneOffset(), 'ms');

            return new Date(base.valueOf() + snapFn(DH.diff(base, time, 'ms') + tzChange, increment));
        }
        else {
            const offset = time.getTimezoneOffset() * 60 * 1000;

            // Assuming current TZ is GMT+3
            // new Date(2000, 0, 1) / 86400000      -> 10956.875
            // new Date(2000, 0, 1, 3) / 86400000   -> 10957
            // Before calculation we need to align time value of the current timezone to GMT+0
            // And after calculate we need to adjust time back
            return new Date(snapFn(time.valueOf() - offset, increment) + offset);
        }
    }

    //endregion

    //region Date picker format

    /**
     * Parses a typed duration value according to locale rules.
     *
     * The value is taken to be a string consisting of the numeric magnitude and the units:
     * - The numeric magnitude can be either an integer or a float value. Both "," and "." are valid decimal separators.
     * - The units may be a recognised unit abbreviation of this locale or the full local unit name.
     *
     * For example:
     * "2d", "2 d", "2 day", "2 days" will be turned into `{ magnitude : 2, unit : "day" }`
     * "2.5d", "2,5 d", "2.5 day", "2,5 days" will be turned into `{ magnitude : 2.5, unit : "day" }`
     *
     * **NOTE:** Doesn't work with complex values like "2 days, 2 hours"
     *
     * @param {String} value The value to parse.
     * @param {Boolean} [allowDecimals=true] Decimals are allowed in the magnitude.
     * @param {String} [defaultUnit] Default unit to use if only magnitude passed.
     * @returns {Object} If successfully parsed, the result contains two properties,
     * `magnitude` being a number, and `unit` being the canonical unit name, *NOT*
     * a localized name. If parsing was unsuccessful, `null` is returned.
     * @category Parse & format
     */
    static parseDuration(value, allowDecimals = true, defaultUnit) {
        const
            durationRegEx = allowDecimals ? withDecimalsDurationRegex : noDecimalsDurationRegex,
            match         = durationRegEx.exec(value);

        if (value == null || !match) {
            return null;
        }

        const
            magnitude = parseNumber(match[1]?.replace(',', '.')),
            unit      = DH.parseTimeUnit(match[2]) || defaultUnit;

        if (!unit) {
            return null;
        }

        return {
            magnitude,
            unit
        };
    }

    /**
     * Parses a typed unit name, for example `"ms"` or `"hr"` or `"yr"` into the
     * canonical form of the unit name which may be passed to {@link #function-add-static}
     * or {@link #function-diff-static}
     * @param {*} unitName
     * @category Parse & format
     */
    static parseTimeUnit(unitName) {
        // NOTE: In case you get a crash here when running tests, it is caused by missing locale. Build locales
        // using `scripts/build.js locales` to resolve.
        const unitMatch = unitName == null ? null : DH.durationRegEx.exec(unitName.toLowerCase());

        if (!unitMatch) {
            return null;
        }

        // See which group in the unitAbbrRegEx matched match[2]
        for (let unitOrdinal = 0; unitOrdinal < canonicalUnitNames.length; unitOrdinal++) {
            if (unitMatch[unitOrdinal + 1]) {
                return canonicalUnitNames[unitOrdinal];
            }
        }
    }

    //endregion

    //region Internal

    static getGMTOffset(date = new Date()) {
        if (!date) {
            return;
        }

        const offsetInMinutes = date.getTimezoneOffset();

        // return 'Z' for UTC
        if (!offsetInMinutes) return 'Z';

        return (offsetInMinutes > 0 ? '-' : '+') +
            Math.abs(Math.trunc(offsetInMinutes / 60)).toString().padStart(2, '0') +
            ':' +
            Math.abs(offsetInMinutes % 60).toString().padStart(2, '0');
    }

    static fillDayNames() {
        const
            tempDate      = new Date('2000-01-01T12:00:00'),
            dayNames      = DH._dayNames || [],
            dayShortNames = DH._dayShortNames || [];

        dayNames.length = 0;
        dayShortNames.length = 0;

        for (let day = 2; day < 9; day++) {
            tempDate.setDate(day);
            dayNames.push(DH.format(tempDate, 'dddd'));
            dayShortNames.push(DH.format(tempDate, 'ddd'));
        }

        DH._dayNames = dayNames;
        DH._dayShortNames = dayShortNames;
    }

    static getDayNames() {
        return DH._dayNames;
    }

    static getDayName(day) {
        return DH._dayNames[day];
    }

    static getDayShortNames() {
        return DH._dayShortNames;
    }

    static getDayShortName(day) {
        return DH._dayShortNames[day];
    }

    static fillMonthNames() {
        const
            tempDate        = new Date('2000-01-15T12:00:00'),
            monthNames      = DH._monthNames || [],
            monthShortNames = DH._monthShortNames || [];

        monthNames.length = 0;
        monthShortNames.length = 0;

        for (let month = 0; month < 12; month++) {
            tempDate.setMonth(month);
            monthNames.push(DH.format(tempDate, 'MMMM'));
            monthShortNames.push(DH.format(tempDate, 'MMM'));
        }

        DH._monthNames = monthNames;
        DH._monthShortNames = monthShortNames;
    }

    static getMonthShortNames() {
        return DH._monthShortNames;
    }

    static getMonthShortName(month) {
        return DH._monthShortNames[month];
    }

    static getMonthNames() {
        return DH._monthNames;
    }

    static getMonthName(month) {
        return DH._monthNames[month];
    }

    static set locale(name) {
        locale = name;
    }

    static get locale() {
        return locale;
    }

    static setupDurationRegEx(unitNames = [], unitAbbreviations = []) {
        const
            me         = this,
            unitLookup = {};

        let unitAbbrRegEx = '';

        for (let i = 0; i < unitAbbreviations.length; i++) {
            const
                // for example ['s', 'sec']
                abbreviations = unitAbbreviations[i],
                // for example { single : 'second', plural : 'seconds', abbrev : 's' }
                unitNamesCfg  = unitNames[i];

            unitNamesCfg.canonicalUnitName = canonicalUnitNames[i];

            // Create a unitLookup object keyed by unit full names
            // both lower and upper case to be able to look up plurals or abbreviations
            // also always include english names, since those are used in sources
            unitLookup[unitNamesCfg.single] =
                unitLookup[unitNamesCfg.single.toUpperCase()] =
                    unitLookup[unitNamesCfg.canonicalUnitName] =
                        unitLookup[unitNamesCfg.canonicalUnitName.toUpperCase()] = unitNamesCfg;

            unitAbbrRegEx += `${i ? '|' : ''}(`;

            for (let j = 0; j < abbreviations.length; j++) {
                unitAbbrRegEx += `${abbreviations[j]}|`;
            }

            locale = me.localize('L{locale}') || 'en-US';

            if (locale !== 'en-US') {
                // Add canonical values to be able to parse durations specified in configs
                const canonicalAbbreviations = canonicalUnitAbbreviations[i];

                for (let j = 0; j < canonicalAbbreviations.length; j++) {
                    unitAbbrRegEx += `${canonicalAbbreviations[j]}|`;
                }
            }

            unitAbbrRegEx += `${unitNamesCfg.single}|${unitNamesCfg.plural}|${unitNamesCfg.canonicalUnitName}|${unitNamesCfg.canonicalUnitName}s)`;
        }

        me.unitLookup = unitLookup;
        me.durationRegEx = new RegExp(`^(?:${unitAbbrRegEx})$`);
    }

    static applyLocale() {
        const
            me                = this,
            unitAbbreviations = me.localize('L{unitAbbreviations}') || [],
            unitNames         = me.unitNames = me.localize('L{unitNames}');

        // This happens when applying an incomplete locale, as done in Localizable.t.js.
        // Invalid usecase, but return to prevent a crash in that test.
        if (unitNames === 'unitNames') {
            return;
        }

        locale = me.localize('L{locale}') || 'en-US';

        if (locale === 'en-US') {
            // TODO: Include in En locale instead?
            ordinalSuffix = enOrdinalSuffix;
        }
        else {
            ordinalSuffix = me.localize('L{ordinalSuffix}') || ordinalSuffix;
        }

        formatCache = {};
        parserCache = {};
        intlFormatterCache = {};

        DH.setupDurationRegEx(unitNames, unitAbbreviations);

        // rebuild day/month names cache
        DH.fillDayNames();
        DH.fillMonthNames();
    }

    //endregion
}

const DH = DateHelper;

DH.useIntlFormat = useIntlFormat; // to use on tests



// Update when changing locale
LocaleManager.on({
    locale  : 'applyLocale',
    prio    : 1000,
    thisObj : DH
});

// Apply default locale
if (LocaleManager.locale) {
    DH.applyLocale();
}
