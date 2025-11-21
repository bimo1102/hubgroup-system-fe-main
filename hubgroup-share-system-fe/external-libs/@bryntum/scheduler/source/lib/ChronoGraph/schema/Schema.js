import { Base } from "../class/Base.js";
import { ensureEntityOnPrototype } from "../replica/Entity.js";
export class Schema extends Base {
    constructor() {
        super(...arguments);
        this.entities = new Map();
    }
    hasEntity(name) {
        return this.entities.has(name);
    }
    getEntity(name) {
        return this.entities.get(name);
    }
    addEntity(entity) {
        const name = entity.name;
        if (!name)
            throw new Error(`Entity must have a name`);
        if (this.hasEntity(name))
            throw new Error(`Entity with name [${String(name)}] already exists`);
        entity.schema = this;
        this.entities.set(name, entity);
        return entity;
    }
    getEntityDecorator() {
        return (target) => {
            const entity = entityDecoratorBody(target);
            this.addEntity(entity);
            return target;
        };
    }
}
export const entityDecoratorBody = (target) => {
    const name = target.name;
    if (!name)
        throw new Error(`Can't add entity - the target class has no name`);
    return ensureEntityOnPrototype(target.prototype);
};
export const entity = () => {
    return (target) => {
        entityDecoratorBody(target);
        return target;
    };
};
