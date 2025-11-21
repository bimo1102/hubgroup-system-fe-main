import { Mixin } from "../../../../ChronoGraph/class/BetterMixin.js";
import { CorePartOfProjectModelMixin } from "../mixin/CorePartOfProjectModelMixin.js";
import DateHelper from "../../../../Core/helper/DateHelper.js";
export class CoreEventMixin extends Mixin([CorePartOfProjectModelMixin], (base) => {
    const superProto = base.prototype;
    class CoreEventMixin extends base {
        constructor() {
            super(...arguments);
            this._startDate = null;
            this._endDate = null;
            this._duration = null;
        }
        static get fields() {
            return [
                { name: 'startDate', type: 'date' },
                { name: 'endDate', type: 'date' },
                { name: 'duration', type: 'number' },
                { name: 'durationUnit', type: 'string', defaultValue: 'day' }
            ];
        }
        get startDate() { var _a, _b; return (_b = (_a = this._startDate) !== null && _a !== void 0 ? _a : this.get('startDate')) !== null && _b !== void 0 ? _b : null; }
        get endDate() { var _a, _b; return (_b = (_a = this._endDate) !== null && _a !== void 0 ? _a : this.get('endDate')) !== null && _b !== void 0 ? _b : null; }
        get duration() { var _a, _b; return (_b = (_a = this._duration) !== null && _a !== void 0 ? _a : this.get('duration')) !== null && _b !== void 0 ? _b : null; }
        set startDate(value) { this.proposeStartDate(value); }
        set endDate(value) { this.proposeEndDate(value); }
        set duration(value) { this.proposeDuration(value); }
        inSet(field, ...args) {
            var _a, _b, _c;
            const me = this;
            if (typeof field !== 'string') {
                const setStartDate = 'startDate' in field;
                const setEndDate = 'endDate' in field;
                const setDuration = 'duration' in field;
                if (setStartDate && setEndDate && !setDuration) {
                    const startDate = CoreEventMixin.processField('startDate', field.startDate, me);
                    const endDate = CoreEventMixin.processField('endDate', field.endDate, me);
                    if ((startDate === null || startDate === void 0 ? void 0 : startDate.getTime()) !== ((_a = me.startDate) === null || _a === void 0 ? void 0 : _a.getTime()) && (endDate === null || endDate === void 0 ? void 0 : endDate.getTime()) === ((_b = me.endDate) === null || _b === void 0 ? void 0 : _b.getTime())) {
                        me.proposeDuration(null);
                        me.proposeEndDate(field.endDate);
                    }
                }
                if (!setStartDate && setEndDate && setDuration) {
                    const endDate = CoreEventMixin.processField('endDate', field.endDate, me);
                    if (field.duration !== me.duration && (endDate === null || endDate === void 0 ? void 0 : endDate.getTime()) === ((_c = me.endDate) === null || _c === void 0 ? void 0 : _c.getTime())) {
                        me.proposeStartDate(null);
                        me.proposeEndDate(field.endDate);
                    }
                }
            }
            return superProto.inSet.call(me, field, ...args);
        }
        getStartDate() {
            return this.startDate;
        }
        proposeStartDate(startDate, keepDuration = true) {
            this._startDate = startDate;
            this.propose({ startDate, keepDuration });
        }
        async setStartDate(startDate, keepDuration = true) {
            var _a;
            this.proposeStartDate(startDate, keepDuration);
            return (_a = this.project) === null || _a === void 0 ? void 0 : _a.commitAsync();
        }
        getEndDate() {
            return this.endDate;
        }
        proposeEndDate(endDate, keepDuration = false) {
            this._endDate = endDate;
            this.propose({ endDate, keepDuration });
        }
        async setEndDate(endDate, keepDuration = false) {
            var _a;
            this.proposeEndDate(endDate, keepDuration);
            return (_a = this.project) === null || _a === void 0 ? void 0 : _a.commitAsync();
        }
        getDuration() {
            return this.duration;
        }
        proposeDuration(duration, unit, keepStart = true) {
            this._duration = duration;
            this.propose({ duration, keepStart });
            if (unit)
                this.propose({ durationUnit: unit });
        }
        async setDuration(duration, unit, keepStart = true) {
            var _a;
            this.proposeDuration(duration, unit, keepStart);
            return (_a = this.project) === null || _a === void 0 ? void 0 : _a.commitAsync();
        }
        getDurationUnit() {
            return this.durationUnit;
        }
        joinProject() {
            var _a, _b;
            const me = this;
            const changed = me.$changed;
            const startDate = me.getCurrentOrProposed('startDate');
            const endDate = me.getCurrentOrProposed('endDate');
            const duration = me.getCurrentOrProposed('duration');
            if (startDate != null)
                changed.startDate = me._startDate = startDate;
            if (endDate != null)
                changed.endDate = me._endDate = endDate;
            if (duration != null)
                changed.duration = me._duration = duration;
            if (me.eventStore && !me.eventStore.isLoadingData) {
                const unresolved = (_a = me.assignmentStore) === null || _a === void 0 ? void 0 : _a.storage.findItem('event', null);
                if (unresolved) {
                    const cachedAssignments = (_b = me.assignmentStore) === null || _b === void 0 ? void 0 : _b.storage.findItem('eventId', me.id);
                    if (cachedAssignments) {
                        for (const assignment of cachedAssignments) {
                            assignment.setChanged('event', me);
                        }
                    }
                    else {
                        for (const assignment of unresolved) {
                            if (assignment.getCurrentOrProposed('event') === me.id) {
                                assignment.setChanged('event', me);
                            }
                        }
                    }
                }
            }
            superProto.joinProject.call(me);
        }
        applyValue(useProp, key, value, skipAccessors, field) {
            if (key === 'startDate' || key == 'duration' || key === 'endDate') {
                useProp = true;
                this['_' + key] = value;
            }
            if (skipAccessors) {
                useProp = false;
            }
            superProto.applyValue.call(this, useProp, key, value, skipAccessors, field);
        }
        afterChange(toSet, wasSet, silent, fromRelationUpdate, skipAccessors) {
            if (!this.$isCalculating && !skipAccessors) {
                this.setData(this.$changed);
            }
            superProto.afterChange.call(this, toSet, wasSet, silent, fromRelationUpdate, skipAccessors);
        }
        calculateInvalidated() {
            const me = this;
            const changed = me.$changed;
            const changedStart = 'startDate' in changed;
            const changedEnd = 'endDate' in changed;
            const changedDuration = 'duration' in changed;
            const { startDate, endDate, duration, keepDuration, keepStart } = changed;
            let calculate = null;
            if (changedStart && !changedEnd && !changedDuration) {
                if (startDate === null) {
                    changed.endDate = null;
                }
                else if (me.hasCurrentOrProposed('endDate') && startDate > me.getCurrentOrProposed('endDate') && !keepDuration) {
                    changed.endDate = startDate;
                    changed.duration = 0;
                }
                else if (me.hasCurrentOrProposed('duration') && (keepDuration || !me.hasCurrentOrProposed('endDate'))) {
                    calculate = 'endDate';
                }
                else if (me.hasCurrentOrProposed('endDate')) {
                    calculate = 'duration';
                }
            }
            else if (!changedStart && changedEnd && !changedDuration) {
                if (endDate === null) {
                    changed.startDate = null;
                }
                else if (me.hasCurrentOrProposed('startDate') && endDate < me.getCurrentOrProposed('startDate') && !keepDuration) {
                    changed.startDate = endDate;
                    changed.duration = 0;
                }
                else if (me.hasCurrentOrProposed('duration') && (keepDuration || !me.hasCurrentOrProposed('startDate'))) {
                    calculate = 'startDate';
                }
                else if (me.hasCurrentOrProposed('startDate')) {
                    calculate = 'duration';
                }
            }
            else if (!changedStart && !changedEnd && changedDuration) {
                if (duration === null) {
                    changed.endDate = null;
                }
                else if (me.hasCurrentOrProposed('startDate') && (keepStart || !me.hasCurrentOrProposed('endDate'))) {
                    if (keepStart && changed.duration < 0) {
                        changed.duration = 0;
                    }
                    calculate = 'endDate';
                }
                else if (me.hasCurrentOrProposed('endDate')) {
                    calculate = 'startDate';
                }
            }
            else if (changedStart && changedEnd && !changedDuration) {
                if (startDate === null && endDate === null) {
                    changed.duration = null;
                }
                else {
                    calculate = 'duration';
                }
            }
            else if (changedStart && !changedEnd && changedDuration) {
                calculate = 'endDate';
            }
            else if (!changedStart && changedEnd && changedDuration) {
                calculate = 'startDate';
            }
            else if (changedStart && changedEnd && changedDuration) {
                if (duration == null) {
                    calculate = 'duration';
                }
                else if (startDate == null) {
                    calculate = 'startDate';
                }
                else {
                    calculate = 'endDate';
                }
            }
            const currentOrProposedStartDate = me.getCurrentOrProposed('startDate');
            const currentOrProposedEndDate = me.getCurrentOrProposed('endDate');
            const currentOrProposedDuration = me.getCurrentOrProposed('duration');
            const currentOrProposedDurationUnit = me.getCurrentOrProposed('durationUnit');
            let hourDuration, targetDuration;
            switch (calculate) {
                case 'startDate':
                    changed.startDate = DateHelper.add(currentOrProposedEndDate, -currentOrProposedDuration, currentOrProposedDurationUnit);
                    break;
                case 'endDate':
                    hourDuration = DateHelper.as('hour', currentOrProposedDuration, currentOrProposedDurationUnit);
                    targetDuration = DateHelper.as(currentOrProposedDurationUnit, hourDuration, 'h');
                    changed.endDate = DateHelper.add(currentOrProposedStartDate, targetDuration, currentOrProposedDurationUnit);
                    break;
                case 'duration':
                    hourDuration = DateHelper.diff(currentOrProposedStartDate, currentOrProposedEndDate, 'h');
                    changed.duration = DateHelper.as(currentOrProposedDurationUnit, hourDuration, 'h');
                    break;
            }
            if (changed.startDate !== undefined)
                this._startDate = changed.startDate;
            if (changed.endDate !== undefined)
                this._endDate = changed.endDate;
            if (changed.duration !== undefined)
                this._duration = changed.duration;
            delete changed.keepDuration;
            delete changed.keepStart;
        }
    }
    return CoreEventMixin;
}) {
}
