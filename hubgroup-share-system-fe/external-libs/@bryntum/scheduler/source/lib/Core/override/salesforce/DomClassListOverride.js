import DomClassList from '../../helper/util/DomClassList.js';

/*
 * Fixes problem with wrong classes processing in LWC
 * https://github.com/bryntum/support/issues/2280
 *
 * Can be removed when this issue is fixed:
 * https://github.com/bryntum/bryntum-suite/issues/2840
 *
 * Cannot use Override here because keys of the DomClassList are treated as classes to add to the DOM. Which means if
 * we're using Override, _overridden would be added, breaking the override itself. It can be worked around but DOM would
 * be polluted with extra class
 * @private
 */

const oldProcess = DomClassList.prototype.process;
DomClassList.prototype.process = function(value, classes) {
    classes = classes.map(cls => {
        if (typeof cls === 'object' && cls.constructor.name === 'DOMTokenList') {
            const result = {};

            // Convert array to object with keys
            Array.from(cls).forEach(key => result[key] = 1);

            return result;
        }
        else {
            return cls;
        }
    });

    return oldProcess.call(this, value, classes);
};
