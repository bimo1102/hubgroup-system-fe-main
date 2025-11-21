import Field from '../../widget/Field.js';
import Override from '../../mixin/Override.js';

/*
 * This override is required to get rid of console warning. It removes `autocomplete` from list of attributes to be set
 * on input element.
 * @private
 */
class FieldOverrideAutocomplete {
    static get target() {
        return {
            class : Field
        };
    }

    // Locker Service does not allow to set `autocomplete` attribute on input element
    static get configurable() {
        const config = this._overridden.configurable;

        config.autoComplete = null;

        return config;
    }
}

Override.apply(FieldOverrideAutocomplete);
