import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/BetterMixin.js"
import { AbstractPartOfProjectStoreMixin } from "../../store/mixin/AbstractPartOfProjectStoreMixin.js"
import { AbstractPartOfProjectGenericMixin } from "../../AbstractPartOfProjectGenericMixin.js"
import Model from "../../../../Core/data/Model.js"
import { isInstanceOf } from '../../../../ChronoGraph/class/BetterMixin.js'


/**
 * This an abstract mixin for every Model that belongs to a project.
 *
 * The model with this mixin, supposes that it will be "joining" a store that is already part of a project,
 * so that such model can take a reference to the project from it.
 *
 * It provides 2 template methods [[joinProject]] and [[leaveProject]], which can be overridden in other mixins.
 */
export class AbstractPartOfProjectModelMixin extends Mixin(
    [AbstractPartOfProjectGenericMixin, Model ],
    (base : AnyConstructor<AbstractPartOfProjectGenericMixin & Model, typeof AbstractPartOfProjectGenericMixin & typeof Model>) => {

    const superProto : InstanceType<typeof base> = base.prototype

    class AbstractPartOfProjectModelMixin extends base {

        stores           : AbstractPartOfProjectStoreMixin[]


        joinStore (store : AbstractPartOfProjectStoreMixin) {
            let joinedProject   = false

            // Joining a store that is not part of project (for example a chained store) should not affect engine
            if (isInstanceOf(store, AbstractPartOfProjectStoreMixin)) {
                const project = store.getProject()

                // Join directly only if not repopulating the store, in which case we will be joined later after
                // graph has been recreated
                if (project && !project.isRepopulatingStores && !this.getProject()) {
                    this.setProject(project)
                    joinedProject   = true
                }
            }

            superProto.joinStore.call(this, store)

            if (joinedProject) this.joinProject()
        }

        
        unjoinStore (store : AbstractPartOfProjectStoreMixin, isReplacing = false) {
            superProto.unjoinStore.call(this, store, isReplacing)

            const project = this.getProject()
            const isLeavingProjectStore = (isInstanceOf(store, AbstractPartOfProjectStoreMixin)) && project === store.getProject()
            // Leave project when unjoining from store, but do not bother if the project is being destroyed or if
            // the dataset is being replaced
            if (project && !project.isDestroying && !project.isRepopulatingStores && isLeavingProjectStore) {
                this.leaveProject(isReplacing)
                this.setProject(null)
            }
            // @ts-ignore
            if (isLeavingProjectStore) this.graph = null
        }

        /**
         * Template method, which is called when model is joining the project (through joining some store that
         * has already joined the project)
         */
        joinProject () {}


        /**
         * Template method, which is called when model is leaving the project (through leaving some store usually)
         */
        leaveProject (isReplacing : boolean = false) {}


        calculateProject () : this[ 'project' ] {
            const store = this.stores.find(s => (isInstanceOf(s, AbstractPartOfProjectStoreMixin)) && !!s.getProject())

            return store?.getProject()
        }


        async setAsync (fieldName : string | object, value? : any, silent? : boolean) : Promise<object> {
            const result = this.set(fieldName, value, silent)

            await this.project?.commitAsync()

            return result
        }


        async getAsync (fieldName : string) : Promise<any> {
            await this.project?.commitAsync()

            return this.get(fieldName)
        }


    }

    return AbstractPartOfProjectModelMixin
}){}

