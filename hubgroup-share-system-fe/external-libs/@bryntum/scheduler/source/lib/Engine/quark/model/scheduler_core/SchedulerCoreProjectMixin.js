import { Mixin } from "../../../../ChronoGraph/class/BetterMixin.js";
import { SchedulerCoreEvent } from "./SchedulerCoreEvent.js";
import Store from "../../../../Core/data/Store.js";
import Model from "../../../../Core/data/Model.js";
import Events from "../../../../Core/mixin/Events.js";
import Delayable from "../../../../Core/mixin/Delayable.js";
import { CoreEventStoreMixin } from "../../store/CoreEventStoreMixin.js";
import { CoreAssignmentMixin } from "./CoreAssignmentMixin.js";
import { CoreAssignmentStoreMixin } from "../../store/CoreAssignmentStoreMixin.js";
import { CoreResourceMixin } from "./CoreResourceMixin.js";
import { CoreResourceStoreMixin } from "../../store/CoreResourceStoreMixin.js";
import { CorePartOfProjectGenericMixin } from "../../CorePartOfProjectGenericMixin.js";
import { CoreDependencyStoreMixin } from "../../store/CoreDependencyStoreMixin.js";
import { CoreDependencyMixin } from "./CoreDependencyMixin.js";
import { CoreCalendarMixin } from './CoreCalendarMixin.js';
import { CoreCalendarManagerStoreMixin } from '../../store/CoreCalendarManagerStoreMixin.js';
import { delay } from "../../../util/Functions.js";
import StateTrackingManager from "../../../../Core/data/stm/StateTrackingManager.js";
import { AbstractProjectMixin } from "../AbstractProjectMixin.js";
import ObjectHelper from "../../../../Core/helper/ObjectHelper.js";
export class EventsWrapper extends Mixin([], Events) {
}
export class DelayableWrapper extends Mixin([], Delayable) {
}
export class SchedulerCoreProjectMixin extends Mixin([
    AbstractProjectMixin,
    CorePartOfProjectGenericMixin,
    EventsWrapper,
    DelayableWrapper,
    Model
], (base) => {
    const superProto = base.prototype;
    class SchedulerCoreProjectMixin extends base {
        static get defaultConfig() {
            return {
                stm: {},
                eventStore: {},
                assignmentStore: {},
                resourceStore: {},
                dependencyStore: {},
                calendarManagerStore: {},
                eventModelClass: SchedulerCoreEvent,
                assignmentModelClass: CoreAssignmentMixin,
                resourceModelClass: CoreResourceMixin,
                dependencyModelClass: CoreDependencyMixin,
                calendarModelClass: CoreCalendarMixin,
                eventStoreClass: CoreEventStoreMixin,
                assignmentStoreClass: CoreAssignmentStoreMixin,
                resourceStoreClass: CoreResourceStoreMixin,
                dependencyStoreClass: CoreDependencyStoreMixin,
                calendarManagerStoreClass: CoreCalendarManagerStoreMixin,
                assignmentsData: null,
                calendarsData: null,
                dependenciesData: null,
                eventsData: null,
                resourcesData: null
            };
        }
        construct(config = {}) {
            this.$invalidated = new Set();
            this.isPerformingCommit = false;
            this.silenceInitialCommit = true;
            this.ongoing = Promise.resolve();
            superProto.construct.call(this, config);
            this.defaultCalendar = new this.calendarManagerStore.modelClass({
                unspecifiedTimeIsWorking: this.unspecifiedTimeIsWorking
            });
            this.defaultCalendar.project = this;
            const { calendarsData, eventsData, dependenciesData, resourcesData, assignmentsData } = this;
            const hasInlineData = Boolean(calendarsData || eventsData || dependenciesData || resourcesData || assignmentsData);
            if (hasInlineData) {
                this.loadInlineData({
                    calendarsData,
                    eventsData,
                    dependenciesData,
                    resourcesData,
                    assignmentsData
                });
                delete this.calendarsData;
                delete this.eventsData;
                delete this.dependenciesData;
                delete this.resourcesData;
                delete this.assignmentsData;
            }
            else {
                this.bufferedCommitAsync();
            }
        }
        doDestroy() {
            var _a, _b, _c, _d, _e, _f;
            const me = this;
            (_a = me.eventStore) === null || _a === void 0 ? void 0 : _a.destroy();
            (_b = me.dependencyStore) === null || _b === void 0 ? void 0 : _b.destroy();
            (_c = me.assignmentStore) === null || _c === void 0 ? void 0 : _c.destroy();
            (_d = me.resourceStore) === null || _d === void 0 ? void 0 : _d.destroy();
            (_e = me.calendarManagerStore) === null || _e === void 0 ? void 0 : _e.destroy();
            me.defaultCalendar.destroy();
            (_f = me.stm) === null || _f === void 0 ? void 0 : _f.destroy();
            superProto.doDestroy.call(this);
        }
        async loadInlineData(data) {
            this.isLoadingInlineData = true;
            if (data.calendarsData) {
                this.calendarManagerStore.data = data.calendarsData;
            }
            if (data.resourcesData) {
                this.resourceStore.data = data.resourcesData;
            }
            if (data.assignmentsData) {
                this.assignmentStore.data = data.assignmentsData;
            }
            if (data.eventsData) {
                this.eventStore.data = data.eventsData;
            }
            if (data.tasksData) {
                this.eventStore.data = data.tasksData;
            }
            if (data.dependenciesData) {
                this.dependencyStore.data = data.dependenciesData;
            }
            await this.commitLoad();
            this.isLoadingInlineData = false;
            return;
        }
        async commitLoad() {
            await this.commitAsync();
            if (!this.isDestroyed)
                this.trigger('load');
        }
        joinStoreRecords(store) {
            const fn = (record) => {
                record.setProject(this);
                record.joinProject();
            };
            if (store.rootNode) {
                store.rootNode.traverse(fn);
            }
            else {
                store.forEach(fn);
            }
        }
        unJoinStoreRecords(store) {
            const fn = (record) => {
                record.leaveProject();
                record.setProject(this);
            };
            if (store.rootNode) {
                store.rootNode.traverse(node => {
                    if (node !== store.rootNode)
                        fn(node);
                });
            }
            else {
                store.forEach(fn);
            }
        }
        resolveStoreAndModelClass(name, config) {
            const storeClass = (config === null || config === void 0 ? void 0 : config.storeClass) || this[`${name}StoreClass`];
            let modelClass = config === null || config === void 0 ? void 0 : config.modelClass;
            if (!modelClass) {
                if (this.getDefaultConfiguration()[`${name}ModelClass`] !== storeClass.getDefaultConfiguration().modelClass) {
                    modelClass = storeClass.getDefaultConfiguration().modelClass;
                }
                else {
                    modelClass = this[`${name}ModelClass`];
                }
            }
            return { storeClass, modelClass };
        }
        get eventStore() {
            return this.$eventStore;
        }
        setEventStore(eventStore) {
            this.eventStore = eventStore;
        }
        set eventStore(eventStore) {
            const me = this;
            const { stm } = me;
            const oldStore = me.$eventStore;
            if (!(eventStore instanceof Store)) {
                const { storeClass, modelClass } = me.resolveStoreAndModelClass('event', eventStore);
                eventStore = new storeClass(ObjectHelper.assign({
                    modelClass,
                    project: me,
                    stm
                }, eventStore));
            }
            else {
                eventStore.project = me;
                stm.addStore(eventStore);
                me.joinStoreRecords(eventStore);
            }
            if (oldStore && stm.hasStore(oldStore)) {
                stm.removeStore(oldStore);
                me.unJoinStoreRecords(oldStore);
                const { assignmentsForRemoval } = oldStore;
                assignmentsForRemoval.forEach(assignment => {
                    const oldEvent = assignment.event;
                    if (oldEvent) {
                        const newEvent = eventStore.getById(oldEvent.id);
                        if (newEvent) {
                            assignment.event = newEvent;
                            assignmentsForRemoval.delete(assignment);
                        }
                    }
                });
                oldStore.afterEventRemoval();
            }
            eventStore.setProject(me);
            me.$eventStore = eventStore;
            me.trigger('eventStoreChange', { store: eventStore });
        }
        get assignmentStore() {
            return this.$assignmentStore;
        }
        setAssignmentStore(assignmentStore) {
            this.assignmentStore = assignmentStore;
        }
        set assignmentStore(assignmentStore) {
            const me = this;
            const { stm } = me;
            const oldStore = me.$assignmentStore;
            if (oldStore && stm.hasStore(oldStore)) {
                stm.removeStore(oldStore);
                me.unJoinStoreRecords(oldStore);
            }
            if (!(assignmentStore instanceof Store)) {
                const { storeClass, modelClass } = me.resolveStoreAndModelClass('assignment', assignmentStore);
                assignmentStore = new storeClass(ObjectHelper.assign({
                    modelClass,
                    project: me,
                    stm
                }, assignmentStore));
            }
            else {
                assignmentStore.project = me;
                stm.addStore(assignmentStore);
                me.joinStoreRecords(assignmentStore);
            }
            assignmentStore.setProject(me);
            me.$assignmentStore = assignmentStore;
            me.trigger('assignmentStoreChange', { store: assignmentStore });
        }
        get resourceStore() {
            return this.$resourceStore;
        }
        setResourceStore(resourceStore) {
            this.resourceStore = resourceStore;
        }
        set resourceStore(resourceStore) {
            const me = this;
            const { stm } = me;
            const oldStore = me.$resourceStore;
            if (!(resourceStore instanceof Store)) {
                const { storeClass, modelClass } = me.resolveStoreAndModelClass('resource', resourceStore);
                resourceStore = new storeClass(ObjectHelper.assign({
                    modelClass,
                    project: me,
                    stm
                }, resourceStore));
            }
            else {
                resourceStore.project = me;
                stm.addStore(resourceStore);
                me.joinStoreRecords(resourceStore);
            }
            if (oldStore && stm.hasStore(oldStore)) {
                stm.removeStore(oldStore);
                me.unJoinStoreRecords(oldStore);
                const { assignmentsForRemoval } = oldStore;
                assignmentsForRemoval.forEach(assignment => {
                    const oldResource = assignment.resource;
                    if (oldResource) {
                        const newResource = resourceStore.getById(oldResource.id);
                        if (newResource) {
                            assignment.resource = newResource;
                            assignmentsForRemoval.delete(assignment);
                        }
                    }
                });
                oldStore.afterResourceRemoval();
            }
            resourceStore.setProject(me);
            me.$resourceStore = resourceStore;
            me.trigger('resourceStoreChange', { store: resourceStore });
        }
        get dependencyStore() {
            return this.$dependencyStore;
        }
        setDependencyStore(dependencyStore) {
            this.dependencyStore = dependencyStore;
        }
        set dependencyStore(dependencyStore) {
            const me = this;
            if (!(dependencyStore instanceof Store)) {
                const { storeClass, modelClass } = me.resolveStoreAndModelClass('dependency', dependencyStore);
                dependencyStore = new storeClass(ObjectHelper.assign({
                    modelClass,
                    project: me,
                    stm: me.stm
                }, dependencyStore));
            }
            else {
                dependencyStore.project = me;
                me.stm.addStore(dependencyStore);
                me.joinStoreRecords(dependencyStore);
            }
            me.$dependencyStore = dependencyStore;
            me.trigger('dependencyStoreChange', { store: dependencyStore });
        }
        get calendarManagerStore() {
            return this.$calendarManagerStore;
        }
        setCalendarManagerStore(calendarManagerStore) {
            this.calendarManagerStore = calendarManagerStore;
        }
        set calendarManagerStore(calendarManagerStore) {
            const me = this;
            if (!(calendarManagerStore instanceof Store)) {
                const storeClass = (calendarManagerStore === null || calendarManagerStore === void 0 ? void 0 : calendarManagerStore.storeClass) || me.calendarManagerStoreClass;
                const modelClass = (calendarManagerStore === null || calendarManagerStore === void 0 ? void 0 : calendarManagerStore.modelClass) || storeClass.getDefaultConfiguration().modelClass || me.calendarModelClass;
                calendarManagerStore = new storeClass(ObjectHelper.assign({
                    modelClass,
                    project: me,
                    stm: me.stm
                }, calendarManagerStore));
            }
            else {
                me.stm.addStore(calendarManagerStore);
            }
            calendarManagerStore.setProject(me);
            me.$calendarManagerStore = calendarManagerStore;
            me.trigger('calendarManagerStoreChange', { store: calendarManagerStore });
        }
        get calendar() {
            return this.$calendar || this.defaultCalendar;
        }
        set calendar(calendar) {
            this.$calendar = calendar;
        }
        get effectiveCalendar() {
            return this.calendar;
        }
        async addEvent(event) {
            this.eventStore.add(event);
            return this.commitAsync();
        }
        async addAssignment(assignment) {
            this.assignmentStore.add(assignment);
            return this.commitAsync();
        }
        async addResource(resource) {
            this.resourceStore.add(resource);
            return this.commitAsync();
        }
        async addDependency(dependency) {
            this.dependencyStore.add(dependency);
            return this.commitAsync();
        }
        bufferedCommitAsync() {
            if (!this.hasPendingAutoCommit) {
                this.setTimeout({
                    fn: 'commitAsync',
                    delay: 10
                });
            }
        }
        get hasPendingAutoCommit() {
            return this.hasTimeout('commitAsync');
        }
        unScheduleAutoCommit() {
            this.clearTimeout('commitAsync');
        }
        async commitAsync() {
            if (this.isPerformingCommit)
                return this.ongoing;
            return this.ongoing = this.doCommitAsync();
        }
        async doCommitAsync() {
            const me = this;
            me.isPerformingCommit = true;
            me.unScheduleAutoCommit();
            await delay(0);
            if (!me.isDestroyed) {
                for (const record of me.$invalidated) {
                    record.calculateInvalidated();
                }
                const { isInitialCommit, silenceInitialCommit } = me;
                const silenceCommit = isInitialCommit && silenceInitialCommit;
                me.assignmentStore.onCommitAsync();
                me.dependencyStore.onCommitAsync();
                me.isInitialCommitPerformed = true;
                me.hasLoadedDataToCommit = false;
                me.isPerformingCommit = false;
                const stores = [me.assignmentStore, me.dependencyStore, me.eventStore, me.resourceStore, me.calendarManagerStore];
                stores.forEach(store => { var _a; return (_a = store.suspendAutoCommit) === null || _a === void 0 ? void 0 : _a.call(store); });
                me.isWritingData = true;
                me.trigger('refresh', { isInitialCommit });
                if (silenceCommit) {
                    for (const record of me.$invalidated) {
                        record.finalizeInvalidated(true);
                    }
                }
                else {
                    for (const record of me.$invalidated) {
                        record.beginBatch(true);
                        record.finalizeInvalidated();
                    }
                    for (const record of me.$invalidated) {
                        record.endBatch(false, true);
                    }
                }
                me.isWritingData = false;
                me.$invalidated.clear();
                me.trigger('dataReady');
                stores.forEach(store => { var _a; return (_a = store.resumeAutoCommit) === null || _a === void 0 ? void 0 : _a.call(store); });
                return true;
            }
        }
        async propagateAsync() {
            return this.commitAsync();
        }
        invalidate(record) {
            this.$invalidated.add(record);
            this.bufferedCommitAsync();
        }
        async isValidDependency(...args) {
            return true;
        }
        getStm() {
            return this.stm;
        }
        set stm(stm) {
            stm = this.$stm = new StateTrackingManager(ObjectHelper.assign({
                disabled: true
            }, stm));
            stm.on({
                restoringStop: async () => {
                    stm.disable();
                    await this.commitAsync();
                    if (!this.isDestroyed) {
                        stm.enable();
                        this.trigger('stateRestoringDone');
                    }
                }
            });
        }
        get stm() {
            return this.$stm;
        }
        isEngineReady() {
            return !this.hasPendingAutoCommit && !this.isPerformingCommit && this.isInitialCommitPerformed;
        }
    }
    SchedulerCoreProjectMixin.applyConfigs = true;
    return SchedulerCoreProjectMixin;
}) {
}
