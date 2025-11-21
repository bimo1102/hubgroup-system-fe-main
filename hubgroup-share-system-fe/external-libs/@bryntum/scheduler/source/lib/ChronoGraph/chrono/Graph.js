import { Base } from "../class/Base.js";
import { concat } from "../collection/Iterator.js";
import { warn } from "../environment/Debug.js";
import { copySetInto, isGeneratorFunction } from "../util/Helpers.js";
import { BreakCurrentStackExecution, HasProposedValueSymbol, OwnIdentifierSymbol, OwnQuarkSymbol, PreviousValueOfSymbol, ProposedArgumentsOfSymbol, ProposedOrPreviousSymbol, ProposedOrPreviousValueOfSymbol, ProposedValueOfSymbol, RejectEffect, RejectSymbol, TransactionSymbol, UnsafePreviousValueOfSymbol, UnsafeProposedOrPreviousValueOfSymbol, WriteSeveralSymbol, WriteSymbol } from "./Effect.js";
import { CalculatedValueGen, CalculatedValueGenC, CalculatedValueSyncC, VariableC } from "./Identifier.js";
import { TombStone } from "./Quark.js";
import { Revision } from "./Revision.js";
import { EdgeTypePast, Transaction } from "./Transaction.js";
export const CommitZero = {
    rejectedWith: null
};
export class Listener extends Base {
    constructor() {
        super(...arguments);
        this.handlers = [];
    }
    trigger(value) {
        for (let i = 0; i < this.handlers.length; i++)
            this.handlers[i](value);
    }
}
export class ChronoGraph extends Base {
    constructor() {
        super(...arguments);
        this.baseRevisionStable = undefined;
        this.baseRevisionTentative = undefined;
        this.baseRevision = Revision.new();
        this.topRevision = undefined;
        this.historyLimit = 0;
        this.listeners = new Map();
        this.$activeTransaction = undefined;
        this.isCommitting = false;
        this.enableProgressNotifications = false;
        this.ongoing = Promise.resolve();
        this._isInitialCommit = true;
        this.autoCommitTimeoutId = null;
        this.autoCommit = false;
        this.autoCommitMode = 'sync';
        this.autoCommitHandler = null;
        this.onWriteDuringCommit = 'throw';
        this.onComputationCycle = 'throw';
        this.transactionClass = Transaction;
        this.$followingRevision = undefined;
    }
    initialize(...args) {
        super.initialize(...args);
        if (!this.topRevision)
            this.topRevision = this.baseRevision;
        if (this.autoCommit) {
            this.autoCommitHandler = this.autoCommitMode === 'sync' ? arg => this.commit(arg) : async (arg) => this.commitAsync(arg);
        }
        this.markAndSweep();
    }
    hasPendingAutoCommit() {
        return this.autoCommitTimeoutId !== null;
    }
    get dirty() {
        return this.activeTransaction.dirty;
    }
    clear() {
        this.reject();
        this.unScheduleAutoCommit();
        this.baseRevision.scope && this.baseRevision.scope.clear();
        this.baseRevision.previous = null;
        this.listeners.clear();
        this.topRevision = this.baseRevision;
        this.$followingRevision = undefined;
        this.$activeTransaction = undefined;
        this.markAndSweep();
    }
    *eachReachableRevision() {
        let isBetweenTopBottom = true;
        let counter = 0;
        for (const revision of this.topRevision.previousAxis()) {
            yield [revision, isBetweenTopBottom || counter < this.historyLimit];
            if (revision === this.baseRevision) {
                isBetweenTopBottom = false;
            }
            else {
                if (!isBetweenTopBottom)
                    counter++;
            }
        }
    }
    get isInitialCommit() {
        return this._isInitialCommit;
    }
    set isInitialCommit(value) {
        this._isInitialCommit = value;
    }
    markAndSweep() {
        let lastReferencedRevision;
        const unreachableRevisions = [];
        for (const [revision, isReachable] of this.eachReachableRevision()) {
            if (isReachable) {
                revision.reachableCount++;
                lastReferencedRevision = revision;
            }
            else
                unreachableRevisions.push(revision);
            revision.referenceCount++;
        }
        unreachableRevisions.unshift(lastReferencedRevision);
        for (let i = unreachableRevisions.length - 1; i >= 1 && unreachableRevisions[i].reachableCount === 0; i--) {
            this.compactRevisions(unreachableRevisions[i - 1], unreachableRevisions[i]);
        }
    }
    compactRevisions(newRev, prevRev) {
        if (prevRev.reachableCount > 0 || newRev.previous !== prevRev)
            throw new Error("Invalid compact operation");
        if (prevRev.referenceCount <= 1) {
            for (const [identifier, entry] of newRev.scope) {
                if (entry.getValue() === TombStone) {
                    prevRev.scope.delete(identifier);
                }
                else {
                    const prevQuark = prevRev.scope.get(identifier);
                    if (entry.origin === entry) {
                        if (prevQuark) {
                            prevQuark.clear();
                            prevQuark.clearProperties();
                        }
                    }
                    else if (prevQuark && entry.origin === prevQuark) {
                        entry.mergePreviousOrigin(newRev.scope);
                    }
                    else if (identifier.lazy && !entry.origin && prevQuark && prevQuark.origin) {
                        entry.startOrigin().proposedValue = prevQuark.origin.value !== undefined ? prevQuark.origin.value : prevQuark.origin.proposedValue;
                    }
                    entry.previous = undefined;
                    prevRev.scope.set(identifier, entry);
                }
            }
            copySetInto(newRev.selfDependent, prevRev.selfDependent);
            newRev.scope = prevRev.scope;
            prevRev.scope = null;
        }
        else {
            newRev.scope = new Map(concat(prevRev.scope, newRev.scope));
            newRev.selfDependent = new Set(concat(prevRev.selfDependent, newRev.selfDependent));
            prevRev.referenceCount--;
        }
        newRev.previous = null;
    }
    get followingRevision() {
        if (this.$followingRevision !== undefined)
            return this.$followingRevision;
        const revisions = Array.from(this.topRevision.previousAxis());
        const entries = [];
        for (let i = revisions.length - 1; i > 0; i--)
            entries.push([revisions[i], revisions[i - 1]]);
        return this.$followingRevision = new Map(entries);
    }
    get activeTransaction() {
        if (this.$activeTransaction)
            return this.$activeTransaction;
        return this.$activeTransaction = this.transactionClass.new({
            baseRevision: this.baseRevisionTentative || this.baseRevision,
            graph: this
        });
    }
    branch(config) {
        const Constructor = this.constructor;
        return Constructor.new(Object.assign({}, config, { baseRevision: this.baseRevision }));
    }
    propagate(args) {
        return this.commit(args);
    }
    reject(reason) {
        this.activeTransaction.reject(RejectEffect.new({ reason }));
        this.ongoing = Promise.resolve();
        this.$activeTransaction = undefined;
        this.baseRevisionTentative = undefined;
        if (this.baseRevisionStable) {
            this.baseRevision = this.baseRevisionStable;
            this.baseRevisionStable = undefined;
        }
    }
    commit(args) {
        this.unScheduleAutoCommit();
        this.baseRevisionStable = this.baseRevision;
        const activeTransaction = this.activeTransaction;
        const transactionCommitResult = activeTransaction.commit(args);
        this.$activeTransaction = undefined;
        const result = this.finalizeCommit(transactionCommitResult);
        this.baseRevisionStable = undefined;
        this.isInitialCommit = false;
        return result;
    }
    async propagateAsync(args) {
        return this.commitAsync(args);
    }
    async commitAsync(args) {
        if (this.isCommitting)
            return this.ongoing;
        this.isCommitting = true;
        this.baseRevisionStable = this.baseRevision;
        let result;
        return this.ongoing = this.ongoing.then(() => {
            return this.doCommitAsync(args);
        }).then(res => {
            result = res;
            return res;
        }).finally(() => {
            this.baseRevisionStable = undefined;
            this.baseRevisionTentative = undefined;
            this.isInitialCommit = false;
            this.isCommitting = false;
        });
    }
    async doCommitAsync(args) {
        this.unScheduleAutoCommit();
        const activeTransaction = this.activeTransaction;
        const transactionResult = await activeTransaction.commitAsync(args);
        this.baseRevisionTentative = activeTransaction.candidate;
        this.$activeTransaction = undefined;
        const result = this.finalizeCommit(transactionResult);
        await this.finalizeCommitAsync(transactionResult);
        if (this.activeTransaction.dirty) {
            return await this.doCommitAsync(args);
        }
        else {
            return result;
        }
    }
    finalizeCommit(transactionResult) {
        const { revision, entries, transaction } = transactionResult;
        if (!transaction.rejectedWith) {
            if (revision.previous !== this.baseRevision)
                throw new Error('Invalid revisions chain');
            for (const [revision, isReachable] of this.eachReachableRevision()) {
                if (isReachable)
                    revision.reachableCount--;
                revision.referenceCount--;
            }
            this.baseRevision = this.topRevision = revision;
            for (const [identifier, quarkEntry] of entries) {
                quarkEntry.cleanup();
                if (quarkEntry.isShadow() || !quarkEntry.hasValue())
                    continue;
                const listener = this.listeners.get(identifier);
                if (listener)
                    listener.trigger(quarkEntry.getValue());
            }
            this.$followingRevision = undefined;
            this.markAndSweep();
        }
        else {
            if (this.baseRevisionStable)
                this.baseRevision = this.baseRevisionStable;
            this.baseRevisionStable = undefined;
            this.baseRevisionTentative = undefined;
        }
        return { rejectedWith: transaction.rejectedWith };
    }
    async finalizeCommitAsync(transactionResult) {
    }
    onComputationCycleHandler(activeEntry, requestedEntry, cycle) {
        const exception = new Error("Computation cycle:\n" + cycle);
        exception.cycle = cycle;
        switch (this.onComputationCycle) {
            case 'ignore':
                console.log(exception.message);
                return activeEntry.continueCalculation(requestedEntry.proposedValue !== undefined ? requestedEntry.proposedValue : requestedEntry.value);
            case 'throw':
                throw exception;
            case 'reject':
                this.reject(exception);
                break;
            case 'warn':
                warn(exception);
                break;
        }
    }
    scheduleAutoCommit() {
        if (this.autoCommitTimeoutId === null) {
            this.autoCommitTimeoutId = setTimeout(this.autoCommitHandler, 10);
        }
    }
    unScheduleAutoCommit() {
        if (this.autoCommitTimeoutId !== null) {
            clearTimeout(this.autoCommitTimeoutId);
            this.autoCommitTimeoutId = null;
        }
    }
    variable(value) {
        const variable = VariableC();
        return this.addIdentifier(variable, value === undefined ? null : value);
    }
    variableNamed(name, value) {
        const variable = VariableC({ name });
        return this.addIdentifier(variable, value === undefined ? null : value);
    }
    identifier(calculation, context) {
        const identifier = isGeneratorFunction(calculation) ?
            CalculatedValueGenC({ calculation, context })
            :
                CalculatedValueSyncC({ calculation, context });
        return this.addIdentifier(identifier);
    }
    identifierNamed(name, calculation, context) {
        const identifier = calculation.constructor.name === 'GeneratorFunction' ?
            CalculatedValueGenC({ name, calculation, context })
            :
                CalculatedValueSyncC({ name, calculation, context });
        return this.addIdentifier(identifier);
    }
    addIdentifier(identifier, proposedValue, ...args) {
        if (this.isCommitting) {
            if (this.onWriteDuringCommit === 'throw')
                throw new Error('Adding identifier during commit');
            else if (this.onWriteDuringCommit === 'warn')
                warn(new Error('Adding identifier during commit'));
        }
        this.activeTransaction.addIdentifier(identifier, proposedValue, ...args);
        if (this.autoCommit)
            this.scheduleAutoCommit();
        return identifier;
    }
    removeIdentifier(identifier) {
        if (this.isCommitting) {
            if (this.onWriteDuringCommit === 'throw')
                throw new Error('Removing identifier during commit');
            else if (this.onWriteDuringCommit === 'warn')
                warn(new Error('Removinfg identifier during commit'));
        }
        this.activeTransaction.removeIdentifier(identifier);
        this.listeners.delete(identifier);
        if (this.autoCommit)
            this.scheduleAutoCommit();
    }
    hasIdentifier(identifier) {
        return this.activeTransaction.hasIdentifier(identifier);
    }
    write(identifier, proposedValue, ...args) {
        if (this.isCommitting) {
            if (this.onWriteDuringCommit === 'throw')
                throw new Error('Write during commit');
            else if (this.onWriteDuringCommit === 'warn')
                warn(new Error('Write during commit'));
        }
        this.activeTransaction.write(identifier, proposedValue, ...args);
        if (this.autoCommit)
            this.scheduleAutoCommit();
    }
    readPrevious(identifier) {
        return this.activeTransaction.readPrevious(identifier);
    }
    readPreviousAsync(identifier) {
        return this.activeTransaction.readPreviousAsync(identifier);
    }
    read(identifier) {
        return this.activeTransaction.read(identifier);
    }
    readAsync(identifier) {
        return this.activeTransaction.readAsync(identifier);
    }
    get(identifier) {
        return this.activeTransaction.get(identifier);
    }
    observe(observerFunc, onUpdated) {
        const identifier = this.addIdentifier(CalculatedValueGen.new({
            lazy: false,
            calculation: observerFunc,
        }));
        this.addListener(identifier, onUpdated);
        return identifier;
    }
    observeContext(observerFunc, context, onUpdated) {
        const identifier = this.addIdentifier(CalculatedValueGen.new({
            lazy: false,
            calculation: observerFunc,
            context: context,
        }));
        this.addListener(identifier, onUpdated);
        return identifier;
    }
    addListener(identifier, onUpdated) {
        let listener = this.listeners.get(identifier);
        if (!listener) {
            listener = Listener.new();
            this.listeners.set(identifier, listener);
        }
        listener.handlers.push(onUpdated);
    }
    undo() {
        const baseRevision = this.baseRevision;
        const previous = baseRevision.previous;
        if (!previous)
            return false;
        this.baseRevision = previous;
        this.$activeTransaction = undefined;
        return true;
    }
    redo() {
        const baseRevision = this.baseRevision;
        if (baseRevision === this.topRevision)
            return false;
        const nextRevision = this.followingRevision.get(baseRevision);
        this.baseRevision = nextRevision;
        this.$activeTransaction = undefined;
        return true;
    }
    onPropagationProgressNotification(notification) {
    }
    [ProposedOrPreviousSymbol](effect, transaction) {
        const activeEntry = transaction.getActiveEntry();
        activeEntry.usedProposedOrPrevious = true;
        const proposedValue = activeEntry.getProposedValue(transaction);
        if (proposedValue !== undefined)
            return proposedValue;
        if (!activeEntry.previous)
            return undefined;
        const identifier = activeEntry.identifier;
        if (identifier.lazy) {
            if (activeEntry.previous.hasValue())
                return activeEntry.previous.getValue();
            if (activeEntry.previous.hasProposedValue())
                return activeEntry.previous.getProposedValue(transaction);
            return null;
        }
        return transaction.readPrevious(activeEntry.identifier);
    }
    [RejectSymbol](effect, transaction) {
        this.reject(effect.reason);
        return BreakCurrentStackExecution;
    }
    [TransactionSymbol](effect, transaction) {
        return transaction;
    }
    [OwnQuarkSymbol](effect, transaction) {
        return transaction.getActiveEntry();
    }
    [OwnIdentifierSymbol](effect, transaction) {
        const activeEntry = transaction.getActiveEntry();
        return activeEntry.identifier;
    }
    [WriteSymbol](effect, transaction) {
        const activeEntry = transaction.getActiveEntry();
        if (activeEntry.identifier.lazy)
            throw new Error('Lazy identifiers can not use `Write` effect');
        const writeToHigherLevel = effect.identifier.level > activeEntry.identifier.level;
        if (!writeToHigherLevel)
            transaction.walkContext.startNewEpoch();
        transaction.write(effect.identifier, ...effect.proposedArgs);
        return writeToHigherLevel ? undefined : BreakCurrentStackExecution;
    }
    [WriteSeveralSymbol](effect, transaction) {
        const activeEntry = transaction.getActiveEntry();
        if (activeEntry.identifier.lazy)
            throw new Error('Lazy identifiers can not use `Write` effect');
        let writeToHigherLevel = true;
        effect.writes.forEach(writeInfo => {
            if (writeInfo.identifier.level <= activeEntry.identifier.level && writeToHigherLevel) {
                transaction.walkContext.startNewEpoch();
                writeToHigherLevel = false;
            }
            transaction.write(writeInfo.identifier, ...writeInfo.proposedArgs);
        });
        return writeToHigherLevel ? undefined : BreakCurrentStackExecution;
    }
    [PreviousValueOfSymbol](effect, transaction) {
        const activeEntry = transaction.getActiveEntry();
        const source = effect.identifier;
        transaction.addEdge(source, activeEntry, EdgeTypePast);
        return transaction.readPrevious(source);
    }
    [ProposedValueOfSymbol](effect, transaction) {
        const activeEntry = transaction.getActiveEntry();
        const source = effect.identifier;
        transaction.addEdge(source, activeEntry, EdgeTypePast);
        const quark = transaction.entries.get(source);
        const proposedValue = quark && !quark.isShadow() ? quark.getProposedValue(transaction) : undefined;
        return proposedValue;
    }
    [HasProposedValueSymbol](effect, transaction) {
        const activeEntry = transaction.getActiveEntry();
        const source = effect.identifier;
        transaction.addEdge(source, activeEntry, EdgeTypePast);
        const quark = transaction.entries.get(source);
        return quark ? quark.hasProposedValue() : false;
    }
    [ProposedOrPreviousValueOfSymbol](effect, transaction) {
        const activeEntry = transaction.getActiveEntry();
        const source = effect.identifier;
        transaction.addEdge(source, activeEntry, EdgeTypePast);
        return transaction.readProposedOrPrevious(source);
    }
    [UnsafeProposedOrPreviousValueOfSymbol](effect, transaction) {
        return transaction.readProposedOrPrevious(effect.identifier);
    }
    [UnsafePreviousValueOfSymbol](effect, transaction) {
        return transaction.readPrevious(effect.identifier);
    }
    [ProposedArgumentsOfSymbol](effect, transaction) {
        const activeEntry = transaction.getActiveEntry();
        const source = effect.identifier;
        transaction.addEdge(source, activeEntry, EdgeTypePast);
        const quark = transaction.entries.get(source);
        return quark && !quark.isShadow() ? quark.proposedArguments : undefined;
    }
}
