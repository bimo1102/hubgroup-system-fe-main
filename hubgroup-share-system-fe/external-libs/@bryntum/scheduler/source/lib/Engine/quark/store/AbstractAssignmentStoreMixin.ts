import { AnyConstructor, Mixin } from "../../../ChronoGraph/class/Mixin.js"
import { AbstractPartOfProjectStoreMixin } from "./mixin/AbstractPartOfProjectStoreMixin.js"
import { CIFromSetOrArrayOrValue } from "../../util/Functions.js"
import { AbstractProjectMixin } from "../model/AbstractProjectMixin.js"

// Shared functionality for CoreAssignmentStore & ChronoAssignmentStore
export class AbstractAssignmentStoreMixin extends Mixin(
    [ AbstractPartOfProjectStoreMixin ],
    (base : AnyConstructor<AbstractPartOfProjectStoreMixin, typeof AbstractPartOfProjectStoreMixin>) => {

    const superProto : InstanceType<typeof base> = base.prototype


    class AbstractAssignmentStoreMixin extends base {

        project                     : AbstractProjectMixin

        modelClass                  : this[ 'project' ][ 'assignmentModelClass' ]

        assignmentsForRemoval       : Set<InstanceType<this[ 'project' ][ 'assignmentModelClass' ]>>    = new Set()

        allAssignmentsForRemoval    : boolean   = false


        remove (
            records : InstanceType<this[ 'modelClass' ]> | InstanceType<this[ 'modelClass' ]>[] | Set<InstanceType<this[ 'modelClass' ]>>, silent? : boolean
        ) : InstanceType<this[ 'modelClass' ]>[]
        {
            this.assignmentsForRemoval  = CIFromSetOrArrayOrValue(records).toSet()

            const res   = superProto.remove.call(this, records)

            this.assignmentsForRemoval.clear()

            return res
        }


        removeAll (silent? : boolean) : boolean {
            this.allAssignmentsForRemoval   = true

            const res   = superProto.removeAll.call(this, silent)

            this.allAssignmentsForRemoval   = false

            return res
        }
    }

    return AbstractAssignmentStoreMixin
}){}
