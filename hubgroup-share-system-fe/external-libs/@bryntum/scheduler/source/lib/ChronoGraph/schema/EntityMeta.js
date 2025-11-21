import { Base } from "../class/Base.js";
export class EntityMeta extends Base {
    constructor() {
        super(...arguments);
        this.name = undefined;
        this.ownFields = new Map();
        this.schema = undefined;
        this.$skeleton = {};
        this.$allFields = undefined;
    }
    hasField(name) {
        return this.getField(name) !== undefined;
    }
    getField(name) {
        return this.allFields.get(name);
    }
    addField(field) {
        const name = field.name;
        if (!name)
            throw new Error(`Field must have a name`);
        if (this.ownFields.has(name))
            throw new Error(`Field with name [${name}] already exists`);
        field.entity = this;
        this.ownFields.set(name, field);
        return field;
    }
    forEachParent(func) {
        let entity = this;
        while (entity) {
            func(entity);
            entity = entity.parentEntity;
        }
    }
    get allFields() {
        if (this.$allFields !== undefined)
            return this.$allFields;
        const allFields = new Map();
        const visited = new Set();
        this.forEachParent(entity => {
            entity.ownFields.forEach((field, name) => {
                if (!visited.has(name)) {
                    visited.add(name);
                    allFields.set(name, field);
                }
            });
        });
        return this.$allFields = allFields;
    }
    forEachField(func) {
        this.allFields.forEach(func);
    }
}
