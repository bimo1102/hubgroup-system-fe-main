import Base from '../Base.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import BrowserHelper from '../helper/BrowserHelper.js';

/**
 * @module Core/mixin/Identifiable
 */

const
    // Id generation should be on a per page basis, not per module
    idCounts     = ObjectHelper.getPathDefault(BrowserHelper.global, 'bryntum.idCounts', Object.create(null)),
    idTypes      = {
        string : 1,
        number : 1
    };

/**
 * A mixin which provides identifier services such as auto-creation of `id`s and registration and
 * lookup of instances by `id`.
 *
 * @mixin
 * @internal
 */
export default Target => class Identifiable extends (Target || Base) {
    static get $name() {
        return 'Identifiable';
    }

    static get declarable() {
        return [
            'identifiable'
        ];
    }

    static get configurable() {
        return {
            /**
             * The id of this object.  If not specified one will be generated. Also used for lookups through the
             * static `getById` of the class which mixes this in. An example being {@link Core.widget.Widget}.
             *
             * For a {@link Core.widget.Widget Widget}, this is assigned as the `id` of the DOM
             * {@link Core.widget.Widget#config-element element} and must be unique across all elements
             * in the page's `document`.
             * @config {String}
             * @category Common
             */
            id : ''
        };
    }

    static setupIdentifiable(cls, meta) {
        const { identifiable } = cls;

        identifiable.idMap = Object.create(null);

        Reflect.defineProperty(cls, 'identifiable', {
            get() {
                return identifiable;
            }
        });
    }

    doDestroy() {
        this.constructor.unregisterInstance(this);

        super.doDestroy();
    }

    changeId(id) {
        return ((this.hasGeneratedId /* assignment */ = !id)) ? this.generateAutoId() : id;
    }

    updateId(id, oldId) {
        const
            me = this,
            C = me.constructor;

        oldId && C.unregisterInstance(me, oldId);

        if (!me.hasGeneratedId || C.identifiable.registerGeneratedId !== false) {
            C.registerInstance(me, id);
        }
    }

    /**
     * This method generates an id for this instance.
     * @returns {String}
     * @internal
     */
    generateAutoId() {
        return this.constructor.generateId(`b-${this.$$name.toLowerCase()}-`);
    }

    static get all() {
        // not documented here since type of array is not knowable... documented at mixin target class
        return Object.values(this.identifiable.idMap);
    }

    /**
     * Generate a new id, using an internal counter and a prefix.
     * @param {String} prefix Id prefix
     * @returns {String} Generated id
     */
    static generateId(prefix = 'generatedId') {
        // This produces "b-foo-1, b-foo-2, ..." for each prefix independently of the others. In other words, it makes
        // id's more stable since the counter is on a per-class basis.
        return prefix + (idCounts[prefix] = (idCounts[prefix] || 0) + 1);
    }

    static registerInstance(instance, instanceId = instance.id) {
        const { idMap } = this.identifiable;

        // Code editor sets `disableThrow` to not get conflicts when loading the same module again
        if (instanceId in idMap && !this.disableThrow) {
            throw new Error('Id ' + instanceId + ' already in use');
        }

        idMap[instanceId] = instance;
    }

    /**
     * Unregister Identifiable instance, normally done on destruction
     * @param {Object} instance Object to unregister
     * @param {String} id The id of the instance to unregister.
     */
    static unregisterInstance(instance, id = instance.id) {
        const { idMap } = this.identifiable;

        // ID may be passed, for example if the instance is destroyed and can no longer yield an id.
        if (idTypes[typeof instance]) {
            delete idMap[instance];
        }
        // Have to check for identity in case another instance by the same id has been created.
        // Allow that to be overridden. Stores have always just evicted the previous owner of their IDs
        else if (idMap[id] === instance) {
            delete idMap[id];
        }
    }

    static getById(id) {
        const idMap = this.identifiable.idMap;

        if (idMap) {
            return idMap[id];
        }
    }

    static get registeredInstances() {
        const idMap = this.identifiable.idMap;

        return idMap ? Object.values(idMap) : [];
    }
};
