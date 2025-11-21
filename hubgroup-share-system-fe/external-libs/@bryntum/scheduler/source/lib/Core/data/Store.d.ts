import Base from '../Base.js';
import Events from '../mixin/Events.js';
import Model from './Model.js';
import Collection from '../util/Collection.js';

export default class Store extends Events(Base) {
    modelClass          : typeof Model

    modelInstanceT      : InstanceType<this[ 'modelClass' ]>

    data                : this[ 'modelInstanceT' ][] | Object[]

    // root node is intentionally typed as just `Model` and not as `this[ 'modelInstanceT' ]`
    // this is to be able to have different type for root node (in engine its ProjectMixin)
    rootNode            : Model

    count               : number
    allCount            : number

    first               : this[ 'modelInstanceT' ]
    last                : this[ 'modelInstanceT' ]
    records             : this[ 'modelInstanceT' ][]
    allRecords          : this[ 'modelInstanceT' ][]
    leaves              : this[ 'modelInstanceT' ][]
    tree                : boolean
    autoLoad            : boolean
    autoCommit          : boolean
    syncDataOnLoad      : boolean
    suspendCount        : number

    isLoadingData       : boolean

    storage             : Collection

    constructor(...args : any[])

    isTree() : boolean

    [Symbol.iterator](): Iterator<this['modelInstanceT']>;

    forEach(fn : (model : InstanceType<this[ 'modelClass' ]>, index? : number) => void, thisObj? : any, options? : any) : void

    traverse(fn : (model : InstanceType<this[ 'modelClass' ]>) => void, topNode? : Partial<InstanceType<this[ 'modelClass' ]>> | boolean, skipRoot? : boolean, options? : any) : void

    map<T>(mapFn : (model : this['modelInstanceT']) => T, thisObj? : any) : T[]

    reduce<T>(reduceFn : (result : T, model : this['modelInstanceT']) => T, initialValue? : T, thisObj? : any) : T

    query(fn : (model : this['modelInstanceT']) => boolean) : this['modelInstanceT'][]

    find(fn : (model : this['modelInstanceT']) => boolean) : this['modelInstanceT']
    findRecord(fieldName : string, value : any, searchAllRecords : boolean) : this['modelInstanceT']

    includes (model : this['modelInstanceT'] | number | string) : boolean

    remove (records : InstanceType<this[ 'modelClass' ]> | InstanceType<this[ 'modelClass' ]>[] | Set<InstanceType<this[ 'modelClass' ]>>, silent? : boolean)
    : InstanceType<this[ 'modelClass' ]>[]

    add (records : Partial<InstanceType<this[ 'modelClass' ]>> | Partial<InstanceType<this[ 'modelClass' ]>>[], silent? : boolean)
    : this[ 'modelInstanceT' ][]

    insert (index : number, records : Partial<InstanceType<this[ 'modelClass' ]>> | Partial<InstanceType<this[ 'modelClass' ]>>[], silent? : boolean)
    : this[ 'modelInstanceT' ][]

    removeAll (silent? : boolean) : boolean
    clear (removing? : boolean)

    loadChildren (parentRecord : InstanceType<this[ 'modelClass' ]>) : Promise<void>

    getAt (index : number) : this[ 'modelInstanceT' ]
    getById (id : any) : this[ 'modelInstanceT' ]
    getByInternalId (id : any) : this[ 'modelInstanceT' ]
    getChildren (parent : this[ 'modelInstanceT' ]) : this[ 'modelInstanceT' ][]
    getNext (recordOrId : any, wrap? : boolean, skipSpecialRows? : boolean) : this[ 'modelInstanceT' ] | null
    getPrev (recordOrId : any, wrap? : boolean, skipSpecialRows?: boolean) : this[ 'modelInstanceT' ] | null
    getGroupRecords (groupValue : any) : this[ 'modelInstanceT' ][]
    getRange (start? : number, end? : number, all? : boolean) : this[ 'modelInstanceT' ][]

    setStoreData (data : any)

    afterLoadData ()

    makeChained (filterFn : (model : this['modelInstanceT']) => boolean) : this

    fillFromMaster() : void

    beginBatch() : void

    endBatch() : void

    load() : Promise<void>

    commit() : Promise<void>
    acceptChanges() : void
    doAutoCommit() : any

    suspendAutoCommit() : void
    resumeAutoCommit() : void

    internalLoad(params : Object, eventName : string, successFn : Function) : Promise<void>

    onDataChange(
        event : {
            action : string
            added : Model[]
            removed : Model[]
        }
    )
}
