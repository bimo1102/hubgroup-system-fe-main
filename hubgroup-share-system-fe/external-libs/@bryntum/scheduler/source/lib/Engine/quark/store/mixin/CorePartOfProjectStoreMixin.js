import { Mixin } from "../../../../ChronoGraph/class/BetterMixin.js";
import { CorePartOfProjectGenericMixin } from "../../CorePartOfProjectGenericMixin.js";
import Store from "../../../../Core/data/Store.js";
import { AbstractPartOfProjectStoreMixin } from "./AbstractPartOfProjectStoreMixin.js";
export class CorePartOfProjectStoreMixin extends Mixin([
    AbstractPartOfProjectStoreMixin,
    CorePartOfProjectGenericMixin,
    Store
], (base) => {
    const superProto = base.prototype;
    class CorePartOfProjectStoreMixin extends base {
        setProject(project) {
            const result = superProto.setProject.call(this, project);
            if (project)
                this.joinProject(project);
            return result;
        }
        joinProject(project) { }
        onCommitAsync() { }
    }
    return CorePartOfProjectStoreMixin;
}) {
}
