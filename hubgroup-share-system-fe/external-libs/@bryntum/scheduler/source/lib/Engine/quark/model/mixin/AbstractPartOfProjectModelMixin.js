import { Mixin } from "../../../../ChronoGraph/class/BetterMixin.js";
import { AbstractPartOfProjectStoreMixin } from "../../store/mixin/AbstractPartOfProjectStoreMixin.js";
import { AbstractPartOfProjectGenericMixin } from "../../AbstractPartOfProjectGenericMixin.js";
import Model from "../../../../Core/data/Model.js";
import { isInstanceOf } from '../../../../ChronoGraph/class/BetterMixin.js';
export class AbstractPartOfProjectModelMixin extends Mixin([AbstractPartOfProjectGenericMixin, Model], (base) => {
    const superProto = base.prototype;
    class AbstractPartOfProjectModelMixin extends base {
        joinStore(store) {
            let joinedProject = false;
            if (isInstanceOf(store, AbstractPartOfProjectStoreMixin)) {
                const project = store.getProject();
                if (project && !project.isRepopulatingStores && !this.getProject()) {
                    this.setProject(project);
                    joinedProject = true;
                }
            }
            superProto.joinStore.call(this, store);
            if (joinedProject)
                this.joinProject();
        }
        unjoinStore(store, isReplacing = false) {
            superProto.unjoinStore.call(this, store, isReplacing);
            const project = this.getProject();
            const isLeavingProjectStore = (isInstanceOf(store, AbstractPartOfProjectStoreMixin)) && project === store.getProject();
            if (project && !project.isDestroying && !project.isRepopulatingStores && isLeavingProjectStore) {
                this.leaveProject(isReplacing);
                this.setProject(null);
            }
            if (isLeavingProjectStore)
                this.graph = null;
        }
        joinProject() { }
        leaveProject(isReplacing = false) { }
        calculateProject() {
            const store = this.stores.find(s => (isInstanceOf(s, AbstractPartOfProjectStoreMixin)) && !!s.getProject());
            return store === null || store === void 0 ? void 0 : store.getProject();
        }
        async setAsync(fieldName, value, silent) {
            var _a;
            const result = this.set(fieldName, value, silent);
            await ((_a = this.project) === null || _a === void 0 ? void 0 : _a.commitAsync());
            return result;
        }
        async getAsync(fieldName) {
            var _a;
            await ((_a = this.project) === null || _a === void 0 ? void 0 : _a.commitAsync());
            return this.get(fieldName);
        }
    }
    return AbstractPartOfProjectModelMixin;
}) {
}
