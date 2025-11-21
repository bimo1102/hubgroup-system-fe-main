import { Mixin } from "../../../../ChronoGraph/class/BetterMixin.js";
import { AbstractPartOfProjectGenericMixin } from "../../AbstractPartOfProjectGenericMixin.js";
import Store from "../../../../Core/data/Store.js";
export class AbstractPartOfProjectStoreMixin extends Mixin([
    AbstractPartOfProjectGenericMixin,
    Store
], (base) => {
    const superProto = base.prototype;
    class AbstractPartOfProjectStoreMixin extends base {
        constructor() {
            super(...arguments);
            this.isLoadingData = false;
        }
        construct(config = {}) {
            config.asyncEvents = {
                add: true,
                remove: true,
                removeAll: true,
                change: true,
                refresh: true,
                replace: true,
                move: true,
                update: true
            };
            return superProto.construct.call(this, config);
        }
        trigger(eventName, param) {
            const me = this, { asyncEvents, project } = me, asyncEvent = asyncEvents === null || asyncEvents === void 0 ? void 0 : asyncEvents[eventName], asyncAction = asyncEvent && (asyncEvent === true || asyncEvent[param.action]);
            if (!asyncAction) {
                return superProto.trigger.call(me, eventName, param);
            }
            superProto.trigger.call(me, `${eventName}PreCommit`, Object.assign({}, param));
            if (!project || project.isEngineReady() && !project.isWritingData) {
                superProto.trigger.call(me, eventName, param);
            }
            else if (!me.eventsSuspended && project) {
                if (!project.dataReadyDetacher) {
                    project.queuedDataReadyEvents = [];
                    project.dataReadyDetacher = project.on({
                        dataReady() {
                            this.queuedDataReadyEvents.forEach(([superProto, scope, eventName, param]) => {
                                superProto.trigger.call(scope, eventName, param);
                            });
                            project.queuedDataReadyEvents = null;
                            project.dataReadyDetacher();
                            project.dataReadyDetacher = null;
                        },
                        once: true
                    });
                }
                project.queuedDataReadyEvents.push([superProto, me, eventName, param]);
            }
            return true;
        }
        calculateProject() {
            return this.project;
        }
        setStoreData(data) {
            var _a;
            if (this.project) {
                this.project.hasLoadedDataToCommit = true;
            }
            this.isLoadingData = true;
            superProto.setStoreData.call(this, data);
            this.isLoadingData = false;
            (_a = this.project) === null || _a === void 0 ? void 0 : _a.trigger('storeRefresh', { store: this });
        }
        async doAutoCommit() {
            if (this.suspendCount <= 0 && this.project && !this.project.isEngineReady()) {
                await this.project.commitAsync();
            }
            superProto.doAutoCommit.call(this);
        }
        async addAsync(records, silent) {
            const result = this.add(records, silent);
            await this.project.commitAsync();
            return result;
        }
        async insertAsync(index, records, silent) {
            const result = this.insert(index, records, silent);
            await this.project.commitAsync();
            return result;
        }
        async loadDataAsync(data) {
            this.data = data;
            await this.project.commitAsync();
        }
    }
    return AbstractPartOfProjectStoreMixin;
}) {
}
