import { Mixin } from "../../../ChronoGraph/class/BetterMixin.js";
import Delayable from "../../../Core/mixin/Delayable.js";
import Events from "../../../Core/mixin/Events.js";
import Model from "../../../Core/data/Model.js";
export class EventsWrapper extends Mixin([], Events) {
}
export class DelayableWrapper extends Mixin([], Delayable) {
}
export class AbstractProjectMixin extends Mixin([
    EventsWrapper,
    DelayableWrapper,
    Model
], (base) => {
    const superProto = base.prototype;
    class AbstractProjectMixin extends base {
        get isRepopulatingStores() {
            return false;
        }
        get isInitialCommit() {
            return !this.isInitialCommitPerformed || this.hasLoadedDataToCommit;
        }
        construct(config = {}) {
            this.isInitialCommitPerformed = false;
            this.isLoadingInlineData = false;
            this.isWritingData = false;
            this.hasLoadedDataToCommit = false;
            superProto.construct.call(this, config);
            this.silenceInitialCommit = ('silenceInitialCommit' in config) ? config.silenceInitialCommit : true;
        }
        repopulateStore(store) { }
        repopulateReplica() { }
        async commitAsync() {
            throw new Error("Abstract method called");
        }
        isEngineReady() {
            throw new Error("Abstract method called");
        }
    }
    return AbstractProjectMixin;
}) {
}
