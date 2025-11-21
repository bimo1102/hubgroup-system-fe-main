import Override from '../../mixin/Override.js';
import Objects from '../../helper/util/Objects.js';

class ObjectsOverrideIsObject {
    static get target() {
        return {
            class : Objects
        };
    }

    // In salesforce isObject(window) returns `true`. should be false.
    static isObject(obj) {
        return obj !== window && this._overridden.isObject.call(this, obj);
    }
}

Override.apply(ObjectsOverrideIsObject);
