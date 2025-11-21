import EventHelper from '../../helper/EventHelper.js';
import Override from '../../mixin/Override.js';

const regExp = /-/;

/*
 * This override fixes fixEvent by wrapping passed event (which is not an Event instance) with another object to allow
 * overriding locked property `target`
 * @private
 */
class EventHelperOverride {
    static get target() {
        return {
            class : EventHelper
        };
    }

    static fixEvent(event) {
        // Locker Service returns secure object, which is in fact object with null prototype and not Event instance
        // We wrap that secure event with another object to allow redefining properties
        event = Object.create(event);

        event = this._overridden.fixEvent.call(this, event);

        // custom element must have dash in it
        // https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
        // event.path is not a public API, but it is implemented
        // https://github.com/salesforce/lwc/pull/859
        if (event.target && event.path && regExp.test(event.target.tagName)) {
            const
                targetElement  = event.path[0],
                originalTarget = event.target;

            // Can there be an event which actually originated from custom element, not its shadow dom?
            if (event.target !== targetElement) {
                Object.defineProperty(event, 'target', {
                    get : () => targetElement
                });

                // Save original target just in case
                Object.defineProperty(event, 'originalTarget', {
                    get : () => originalTarget
                });
            }
        }

        return event;
    }
}

Override.apply(EventHelperOverride);
