import Base from '../Base.js';
import Events from '../mixin/Events.js';

export default class Collection extends Events(Base) {

    findItem(propertyName : string, value : any, ignoreFilters? : boolean) : Set<any> | any

    addToIndices(item : any)

    removeFromIndices(item : any)

    rebuildIndices()

    invalidateIndices()

}
