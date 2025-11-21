import { AnyConstructor, Mixin } from "../../../ChronoGraph/class/Mixin.js"
import { AbstractPartOfProjectStoreMixin } from "./mixin/AbstractPartOfProjectStoreMixin.js"
import { CIFromSetOrArrayOrValue } from '../../util/Functions.js'
import { AbstractProjectMixin } from '../model/AbstractProjectMixin.js'

// Shared functionality for CoreDependencyStore & ChronoDependencyStore
export class AbstractDependencyStoreMixin extends Mixin(
    [ AbstractPartOfProjectStoreMixin ],
    (base : AnyConstructor<AbstractPartOfProjectStoreMixin, typeof AbstractPartOfProjectStoreMixin>) => {

    const superProto : InstanceType<typeof base> = base.prototype


    class AbstractDependencyStoreMixin extends base {

        project                     : AbstractProjectMixin

        modelClass                  : this[ 'project' ][ 'dependencyModelClass' ]

        dependenciesForRemoval      : Set<InstanceType<this[ 'project' ][ 'dependencyModelClass' ]>>    = new Set()

        allDependenciesForRemoval   : boolean   = false


        remove (
            records : InstanceType<this[ 'modelClass' ]> | InstanceType<this[ 'modelClass' ]>[] | Set<InstanceType<this[ 'modelClass' ]>>, silent? : boolean
        ) : InstanceType<this[ 'modelClass' ]>[]
        {
            this.dependenciesForRemoval  = CIFromSetOrArrayOrValue(records).toSet()

            const res   = superProto.remove.call(this, records)

            this.dependenciesForRemoval.clear()

            return res
        }


        removeAll (silent? : boolean) : boolean {
            this.allDependenciesForRemoval   = true

            const res   = superProto.removeAll.call(this, silent)

            this.allDependenciesForRemoval   = false

            return res
        }

    }

    return AbstractDependencyStoreMixin
}){}
