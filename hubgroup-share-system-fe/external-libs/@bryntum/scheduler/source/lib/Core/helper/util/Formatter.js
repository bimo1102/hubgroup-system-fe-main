const hasOwnProperty = Object.prototype.hasOwnProperty;

let cacheKey = null;

function setParser(me, parser) {
    Object.defineProperty(me, 'parser', {
        value : parser
    });

    return parser;
}

class Default {
    constructor(formatter) {
        this.formatter = formatter;
    }

    format(value) {
        return this.formatter.defaultFormat(value);
    }

    parse(value, strict) {
        return this.formatter.defaultParse(value, strict);
    }

    resolvedOptions() {
        return null;
    }
}

// This class does not extend Core.Base because instances are not reconfigurable (making
// setConfig harmful) nor destroyable. Instead, they get frozen and cached according to
// their "config" definition.
/**
 * Abstract base class for formatters.
 * @private
 */
export default class Formatter {
    static get(format) {
        if (format == null) {
            return this.NULL;
        }

        const
            key = (typeof format === 'string') ? format : JSON.stringify(format),
            cache = this.cache;

        let fmt = cache.get(key);

        if (!fmt) {
            cacheKey = key;  // this is grabbed by our constructor below...
            fmt = new this(format);

            cache.set(key, fmt);
        }

        return fmt;
    }

    static get cache() {
        return (hasOwnProperty.call(this, '_cache') && this._cache) || (this._cache = new Map());
    }

    static get NULL() {
        return hasOwnProperty.call(this, '_null') ? this._null : (this._null = new this(null));
    }

    constructor(config) {
        const me = this;

        // This is done in a funny way so as not to complicate the derived constructor's
        // desire to maintain a single argument signature, as well as it's calling of
        // Object.freeze() to ensure immutability in dev mode.
        me.cacheKey = cacheKey;

        cacheKey = null;

        me.initialize();

        if (config === null) {
            me.formatter = new Default(me);
        }
        else {
            me.configure(config);

            // Bring locale and other defaulted options back onto this object:
            for (const [key, value] of Object.entries(me.resolvedOptions())) {
                // For some reason (locale-specific perhaps), resolvedOptions returns
                // with 'undefined' in some keys (e.g., min/maximumFractionDigits) when
                // we specified 0.
                //
                // The second check is to only bring back values that we understand.
                if (value != null && (key in me.defaults)) {
                    me[key] = value;
                }
            }
        }
    }

    get parser() {
        // Replace this property w/the actual instance:
        return setParser(this, new this.constructor.Parser(this));
    }

    defaultFormat(value) {
        return (value == null) ? value : String(value);
    }

    defaultParse(value) {
        return value;
    }

    format(value) {
        return (value == null) ? value : this.formatter.format(value);
    }

    parse(value, strict) {
        return (value == null) ? value : this.parser.parse(value, strict);
    }

    parseStrict(value) {
        return this.parse(value, true);
    }

    resolvedOptions() {
        return this.formatter.resolvedOptions();
    }
}
