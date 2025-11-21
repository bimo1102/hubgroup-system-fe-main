import BrowserHelper from './BrowserHelper.js';

/**
 * @module Core/helper/VersionHelper
 */

let isSiesta = false;

try {
    isSiesta = Boolean(
        BrowserHelper.global.parent && BrowserHelper.global.parent.Siesta ||
        (typeof process !== 'undefined') && (BrowserHelper.global.StartTest || BrowserHelper.global.Siesta)
    );
}
catch (e) {}

// Set Default to hoverable device for our tests to run reliably
if (isSiesta) {
    BrowserHelper._isHoverableDevice = true;
}

/**
 * Helper for version handling
 * @private
 * @example
 *
 * VersionHelper.setVersion('grid', '1.5');
 *
 * if (VersionHelper.getVersion('grid').isNewerThan('1.0')) {
 *   ...
 * }
 */
export default class VersionHelper {
    /**
     * Set version for specified product
     * @private
     * @param {String} product
     * @param {String} version
     */
    static setVersion(product, version) {
        product = product.toLowerCase();

        VH[product] = {
            version,
            isNewerThan(otherVersion) {
                return otherVersion < version;
            },
            isOlderThan(otherVersion) {
                return otherVersion > version;
            }
        };

        let bundleFor = '';

        // Var productName is only defined in bundles, it is internal to bundle so not available on window. Used to
        // tell importing combinations of grid/scheduler/gantt bundles apart from loading same bundle twice
        // eslint-disable-next-line no-undef
        if (typeof productName !== 'undefined') {
            // eslint-disable-next-line no-undef
            bundleFor = productName;
        }

        // Set "global" flag to detect bundle being loaded twice
        const globalKey = `${bundleFor}.${product}${version.replace(/\./g, '-')}`;

        if (BrowserHelper.isBrowserEnv && !BrowserHelper.global.bryntum.silenceBundleException) {
            if (window.bryntum[globalKey] === true) {
                if (isSiesta) {
                    window.BUNDLE_EXCEPTION = true;
                }
                else {
                    throw new Error('Bryntum bundle included twice, check cache-busters and file types (.js).\n' +
                    'Simultaneous imports from "*.module.js" and "*.umd.js" bundles are not allowed.');
                }
            }
            else {
                window.bryntum[globalKey] = true;
            }
        }
    }

    /**
     * Get (previously set) version for specified product
     * @private
     * @param {String} product
     */
    static getVersion(product) {
        product = product.toLowerCase();

        if (!VH[product])  {
            throw new Error('No version specified! Please check that you import VersionHelper right into the class from where you call `deprecate` function.');
        }

        return VH[product].version;
    }

    /**
     * Checks the passed product against the passed version using the passed test.
     * @param {String} product The name of the product to test the version of
     * @param {String} version The version to test against
     * @param {String} test The test operator, `<=`, `<`, `=`, `>` or `>=`.
     * @returns {Boolean} `true` if the test passes.
     * @internal
     */
    static checkVersion(product, version, test) {
        const productVersion = VH.getVersion(product);

        let result;

        switch (test) {
            case '<':
                result = productVersion < version;
                break;
            case '<=':
                result = productVersion <= version;
                break;
            case '=':
                result = productVersion === version;
                break;
            case '>=':
                result = productVersion >= version;
                break;
            case '>':
                result = productVersion > version;
                break;
        }

        return result;
    }

    /**
     * Based on a comparison of current product version and the passed version this method either outputs a console.warn
     * or throws an error.
     * @param {String} product The name of the product
     * @param {String} invalidAsOfVersion The version where the offending code is invalid (when any compatibility layer
     * is actually removed).
     * @param {String} message Required! A helpful warning message to show to the developer using a deprecated API.
     * @internal
     */
    static deprecate(product, invalidAsOfVersion, message) {
        const justWarn = VH.checkVersion(product, invalidAsOfVersion, '<');

        //<debug>
        if (!invalidAsOfVersion.endsWith('.0.0')) {
            throw new Error('May only break APIs in major releases');
        }
        if (!message) {
            throw new Error('Must provide helpful message for developers');
        }
        //</debug>

        if (justWarn) {
            //<debug>
            // Warnings don't get callstacks but that makes them hard to find especially in automated tests, so add a
            // portion of the callstack that got us here.
            if (VH.skipStack) {
                --VH.skipStack;
            }
            else {
                let stack = new Error().stack;

                if (stack.startsWith('Error\n')) {
                    stack = stack.substr(6);  // Chrome
                }

                stack = stack.split('\n');

                if (stack[0].includes('VersionHelper')) {
                    // excluding this function...
                    stack.shift();
                }

                if (stack.length > 10) {
                    stack[10] = `+ ${stack.length - 10} more...`;
                    stack = stack.slice(0, 11);
                }

                message += ':\n' + stack.join('\n');
            }
            //</debug>

            // During the grace period (until the next major release following the deprecated code), just show a console warning
            console.warn(`Deprecation warning: You are using a deprecated API which will change in v${invalidAsOfVersion}. ${message}`);
        }
        else {
            throw new Error(`Deprecated API use. ${message}`);
        }
    }

    /**
     * Returns truthy value if environment is in testing mode.
     * @returns {Boolean}
     * @internal
     **/
    static get isTestEnv() {
        return isSiesta;
    }

    static get isDebug() {
        let result = false;
        //<debug>
        result = true;
        //</debug>
        return result;
    }
}

const VH = VersionHelper;

//<debug>
VH.skipStack = 0;
//</debug>

if (BrowserHelper.isBrowserEnv) {
    (window.bryntum || (window.bryntum = {})).getVersion = VH.getVersion.bind(VH);
    window.bryntum.checkVersion                          = VH.checkVersion.bind(VH);
    window.bryntum.deprecate                             = VH.deprecate.bind(VH);
    window.bryntum.isTestEnv                             = VH.isTestEnv;
}
