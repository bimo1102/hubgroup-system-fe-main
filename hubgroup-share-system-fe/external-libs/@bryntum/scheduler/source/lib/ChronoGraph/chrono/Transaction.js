import { Base } from "../class/Base.js";
import { DEBUG } from "../environment/Debug.js";
import { cycleInfo, OnCycleAction } from "../graph/WalkDepth.js";
import { runGeneratorAsyncWithEffect, SynchronousCalculationStarted } from "../primitives/Calculation.js";
import { delay, MAX_SMI } from "../util/Helpers.js";
import { LeveledQueue } from "../util/LeveledQueue.js";
import { BreakCurrentStackExecution, RejectEffect } from "./Effect.js";
import { Identifier, Levels, throwUnknownIdentifier } from "./Identifier.js";
import { EdgeType, TombStone } from "./Quark.js";
import { Revision } from "./Revision.js";
import { ComputationCycle, TransactionCycleDetectionWalkContext } from "./TransactionCycleDetectionWalkContext.js";
import { TransactionWalkDepth } from "./TransactionWalkDepth.js";
export const EdgeTypeNormal = EdgeType.Normal;
export const EdgeTypePast = EdgeType.Past;
export class Transaction extends Base {
    constructor() {
        super(...arguments);
        this.baseRevision = undefined;
        this.candidateClass = Revision;
        this.candidate = undefined;
        this.graph = undefined;
        this.isClosed = false;
        this.walkContext = undefined;
        this.entries = new Map();
        this.stackGen = new LeveledQueue();
        this.activeStack = [];
        this.onEffectSync = undefined;
        this.onEffectAsync = undefined;
        this.propagationStartDate = 0;
        this.lastProgressNotificationDate = 0;
        this.startProgressNotificationsAfterMs = 500;
        this.emitProgressNotificationsEveryMs = 200;
        this.emitProgressNotificationsEveryCalculations = 100;
        this.plannedTotalIdentifiersToCalculate = 0;
        this.ongoing = Promise.resolve();
        this.selfDependedMarked = false;
        this.rejectedWith = undefined;
    }
    initialize(...args) {
        super.initialize(...args);
        this.walkContext = TransactionWalkDepth.new({
            visited: this.entries,
            transaction: this,
            baseRevision: this.baseRevision,
            pushTo: this.stackGen
        });
        if (!this.candidate)
            this.candidate = this.candidateClass.new({ previous: this.baseRevision });
        this.onEffectSync = this.read.bind(this);
        this.onEffectAsync = this.readAsync.bind(this);
    }
    get dirty() {
        return this.entries.size > 0;
    }
    markSelfDependent() {
        if (this.selfDependedMarked)
            return;
        this.selfDependedMarked = true;
        for (const selfDependentIden of this.baseRevision.selfDependent) {
            const existing = this.entries.get(selfDependentIden);
            if (existing && existing.getValue() === TombStone)
                continue;
            this.touch(selfDependentIden);
        }
    }
    getActiveEntry() {
        return this.activeStack[this.activeStack.length - 1];
    }
    yieldAsync(effect) {
        if (effect instanceof Promise)
            return effect;
        return this.graph[effect.handler](effect, this);
    }
    yieldSync(effect) {
        if (effect instanceof Promise) {
            throw new Error("Can not yield a promise in the synchronous context");
        }
        return this.graph[effect.handler](effect, this);
    }
    readAsync(identifier) {
        if (!(identifier instanceof Identifier))
            return this.yieldAsync(identifier);
        let entry;
        const activeEntry = this.getActiveEntry();
        if (activeEntry) {
            entry = this.addEdge(identifier, activeEntry, EdgeTypeNormal);
        }
        else {
            entry = this.entries.get(identifier);
            if (!entry) {
                const previousEntry = this.baseRevision.getLatestEntryFor(identifier);
                if (!previousEntry)
                    throwUnknownIdentifier(identifier);
                entry = previousEntry.hasValue() ? previousEntry : this.touch(identifier);
            }
        }
        if (entry.hasValue())
            return entry.getValue();
        if (entry.promise)
            return entry.promise;
        if (!entry.previous || !entry.previous.hasValue())
            entry.forceCalculation();
        return this.ongoing = entry.promise = this.ongoing.then(() => {
            return (async () => {
                while (this.stackGen.lowestLevel < identifier.level) {
                    await runGeneratorAsyncWithEffect(this.onEffectAsync, this.calculateTransitionsStackGen, [this.onEffectAsync, this.stackGen.takeLowestLevel()], this);
                }
                this.markSelfDependent();
                if (entry.getValue() === undefined)
                    return runGeneratorAsyncWithEffect(this.onEffectAsync, this.calculateTransitionsStackGen, [this.onEffectAsync, [entry]], this);
            })();
        }).then(() => {
            if (this.rejectedWith)
                throw new Error(`Transaction rejected: ${String(this.rejectedWith.reason)}`);
            if (!entry.hasValue())
                throw new Error('Computation cycle. Sync');
            return entry.getValue();
        });
    }
    get(identifier) {
        if (!(identifier instanceof Identifier))
            return this.yieldSync(identifier);
        let entry;
        const activeEntry = this.getActiveEntry();
        if (activeEntry) {
            entry = this.addEdge(identifier, activeEntry, EdgeTypeNormal);
        }
        else {
            entry = this.entries.get(identifier);
            if (!entry) {
                const previousEntry = this.baseRevision.getLatestEntryFor(identifier);
                if (!previousEntry)
                    throwUnknownIdentifier(identifier);
                entry = previousEntry.hasValue() ? previousEntry : this.touch(identifier);
            }
        }
        const value1 = entry.getValue();
        if (value1 === TombStone)
            throwUnknownIdentifier(identifier);
        if (value1 !== undefined && entry.hasValue())
            return value1;
        if (entry.promise)
            return entry.promise;
        if (!entry.previous || !entry.previous.hasValue())
            entry.forceCalculation();
        while (this.stackGen.getLowestLevel() < identifier.level) {
            this.calculateTransitionsStackSync(this.onEffectSync, this.stackGen.takeLowestLevel());
        }
        this.markSelfDependent();
        if (identifier.sync) {
            this.calculateTransitionsStackSync(this.onEffectSync, [entry]);
            const value = entry.getValue();
            if (value === undefined)
                throw new Error('Cycle during synchronous computation');
            if (value === TombStone)
                throwUnknownIdentifier(identifier);
            return value;
        }
        else {
            const promise = this.ongoing = entry.promise = this.ongoing.then(() => {
                if (entry.getValue() === undefined)
                    return runGeneratorAsyncWithEffect(this.onEffectAsync, this.calculateTransitionsStackGen, [this.onEffectAsync, [entry]], this);
            }).then(() => {
                if (this.rejectedWith)
                    throw new Error(`Transaction rejected: ${String(this.rejectedWith.reason)}`);
                const value = entry.getValue();
                if (value === undefined)
                    throw new Error('Computation cycle. Async get');
                if (value === TombStone)
                    throwUnknownIdentifier(identifier);
                return value;
            });
            if (DEBUG) {
                promise.quark = entry;
            }
            return promise;
        }
    }
    read(identifier) {
        if (!(identifier instanceof Identifier))
            return this.yieldSync(identifier);
        let entry;
        const activeEntry = this.getActiveEntry();
        if (activeEntry) {
            entry = this.addEdge(identifier, activeEntry, EdgeTypeNormal);
        }
        else {
            entry = this.entries.get(identifier);
            if (!entry) {
                const previousEntry = this.baseRevision.getLatestEntryFor(identifier);
                if (!previousEntry)
                    throwUnknownIdentifier(identifier);
                entry = previousEntry.hasValue() ? previousEntry : this.touch(identifier);
            }
        }
        const value1 = entry.getValue();
        if (value1 === TombStone)
            throwUnknownIdentifier(identifier);
        if (value1 !== undefined)
            return value1;
        if (!entry.previous || !entry.previous.hasValue())
            entry.forceCalculation();
        while (this.stackGen.getLowestLevel() < identifier.level) {
            this.calculateTransitionsStackSync(this.onEffectSync, this.stackGen.takeLowestLevel());
        }
        this.markSelfDependent();
        this.calculateTransitionsStackSync(this.onEffectSync, [entry]);
        const value = entry.getValue();
        if (value === undefined)
            throw new Error('Cycle during synchronous computation');
        if (value === TombStone)
            throwUnknownIdentifier(identifier);
        return value;
    }
    readCurrentOrProposedOrPrevious(identifier) {
        const dirtyQuark = this.entries.get(identifier);
        if (dirtyQuark) {
            const value = dirtyQuark.getValue();
            if (value !== undefined)
                return value;
            if (dirtyQuark.proposedValue !== undefined)
                return dirtyQuark.proposedValue;
        }
        return this.readPrevious(identifier);
    }
    readCurrentOrProposedOrPreviousAsync(identifier) {
        const dirtyQuark = this.entries.get(identifier);
        if (dirtyQuark) {
            const value = dirtyQuark.getValue();
            if (value !== undefined)
                return value;
            if (dirtyQuark.proposedValue !== undefined)
                return dirtyQuark.proposedValue;
        }
        return this.readPreviousAsync(identifier);
    }
    readPrevious(identifier) {
        const previousEntry = this.baseRevision.getLatestEntryFor(identifier);
        if (!previousEntry)
            return undefined;
        const value = previousEntry.getValue();
        return value !== TombStone ? (value === undefined && identifier.lazy ? this.read(identifier) : value) : undefined;
    }
    readPreviousAsync(identifier) {
        const previousEntry = this.baseRevision.getLatestEntryFor(identifier);
        if (!previousEntry)
            return undefined;
        const value = previousEntry.getValue();
        return value !== TombStone ? (value !== undefined ? value : this.readAsync(identifier)) : undefined;
    }
    readProposedOrPrevious(identifier) {
        const dirtyQuark = this.entries.get(identifier);
        if (dirtyQuark && dirtyQuark.proposedValue !== undefined) {
            return dirtyQuark.proposedValue;
        }
        else {
            return this.readPrevious(identifier);
        }
    }
    readProposedOrPreviousAsync(identifier) {
        const dirtyQuark = this.entries.get(identifier);
        if (dirtyQuark && dirtyQuark.proposedValue !== undefined) {
            return dirtyQuark.proposedValue;
        }
        else {
            return this.readPreviousAsync(identifier);
        }
    }
    write(identifier, proposedValue, ...args) {
        if (proposedValue === undefined)
            proposedValue = null;
        identifier.write.call(identifier.context || identifier, identifier, this, null, proposedValue, ...args);
    }
    getWriteTarget(identifier) {
        return this.touch(identifier).startOrigin();
    }
    acquireQuarkIfExists(identifier) {
        const entry = this.entries.get(identifier);
        return entry && entry.origin === entry ? entry.origin : undefined;
    }
    touch(identifier) {
        const existingEntry = this.entries.get(identifier);
        if (!existingEntry || existingEntry.visitEpoch < this.walkContext.currentEpoch)
            this.walkContext.continueFrom([identifier]);
        const entry = existingEntry || this.entries.get(identifier);
        entry.forceCalculation();
        return entry;
    }
    hasIdentifier(identifier) {
        const activeEntry = this.entries.get(identifier);
        if (activeEntry && activeEntry.getValue() === TombStone)
            return false;
        return Boolean(activeEntry || this.baseRevision.getLatestEntryFor(identifier));
    }
    addIdentifier(identifier, proposedValue, ...args) {
        let entry = this.entries.get(identifier);
        const isVariable = identifier.level === Levels.UserInput;
        if (!entry) {
            entry = identifier.newQuark(this.baseRevision);
            entry.previous = this.baseRevision.getLatestEntryFor(identifier);
            entry.forceCalculation();
            this.entries.set(identifier, entry);
            if (!identifier.lazy && !isVariable)
                this.stackGen.push(entry);
        }
        if (proposedValue !== undefined || isVariable) {
            entry.startOrigin();
            identifier.write.call(identifier.context || identifier, identifier, this, entry, proposedValue === undefined && isVariable ? null : proposedValue, ...args);
        }
        if (entry.getValue() === TombStone)
            entry.value = undefined;
        identifier.enterGraph(this.graph);
        return entry;
    }
    removeIdentifier(identifier) {
        identifier.leaveGraph(this.graph);
        const entry = this.touch(identifier).startOrigin();
        entry.setValue(TombStone);
    }
    populateCandidateScopeFromTransitions(candidate, scope) {
        if (candidate.scope.size === 0) {
            candidate.scope = scope;
        }
        else {
            for (const [identifier, quark] of scope) {
                if (quark.isShadow()) {
                    const latestEntry = candidate.getLatestEntryFor(identifier);
                    quark.getOutgoing().forEach((toQuark, toIdentifier) => latestEntry.getOutgoing().set(toIdentifier, toQuark));
                }
                else {
                    candidate.scope.set(identifier, quark);
                }
            }
        }
    }
    preCommit(args) {
        if (this.isClosed)
            throw new Error('Can not propagate closed revision');
        this.markSelfDependent();
        this.isClosed = true;
        this.propagationStartDate = Date.now();
        this.plannedTotalIdentifiersToCalculate = this.stackGen.length;
    }
    postCommit() {
        this.populateCandidateScopeFromTransitions(this.candidate, this.entries);
        const entries = this.entries;
        this.walkContext = undefined;
        return { revision: this.candidate, entries, transaction: this };
    }
    commit(args) {
        this.preCommit(args);
        this.calculateTransitionsSync(this.onEffectSync);
        return this.postCommit();
    }
    reject(rejection = RejectEffect.new()) {
        this.rejectedWith = rejection;
        for (const quark of this.entries.values()) {
            quark.cleanup();
        }
        this.entries.clear();
        this.walkContext = undefined;
    }
    async commitAsync(args) {
        this.preCommit(args);
        return this.ongoing = this.ongoing.then(() => {
            return runGeneratorAsyncWithEffect(this.onEffectAsync, this.calculateTransitions, [this.onEffectAsync], this);
        }).then(() => {
            return this.postCommit();
        });
    }
    getLatestEntryFor(identifier) {
        let entry = this.entries.get(identifier) || this.baseRevision.getLatestEntryFor(identifier);
        if (entry.getValue() === TombStone)
            return undefined;
        return entry;
    }
    getLatestStableEntryFor(identifier) {
        let entry = this.entries.get(identifier);
        if (entry) {
            const value = entry.getValue();
            if (value === TombStone)
                return undefined;
            return value === undefined ? this.baseRevision.getLatestEntryFor(identifier) : entry;
        }
        else {
            return this.baseRevision.getLatestEntryFor(identifier);
        }
    }
    addEdge(identifierRead, activeEntry, type) {
        const identifier = activeEntry.identifier;
        if (identifier.level < identifierRead.level)
            throw new Error('Identifier can not read from higher level identifier');
        let entry = this.entries.get(identifierRead);
        if (!entry) {
            const previousEntry = this.baseRevision.getLatestEntryFor(identifierRead);
            if (!previousEntry)
                throwUnknownIdentifier(identifierRead);
            entry = identifierRead.newQuark(this.baseRevision);
            previousEntry.origin && entry.setOrigin(previousEntry.origin);
            entry.previous = previousEntry;
            this.entries.set(identifierRead, entry);
        }
        entry.addOutgoingTo(activeEntry, type);
        return entry;
    }
    onQuarkCalculationCompleted(entry, value) {
        entry.cleanup();
        const identifier = entry.identifier;
        const previousEntry = entry.previous;
        const sameAsPrevious = Boolean(previousEntry && previousEntry.hasValue() && identifier.equality(value, previousEntry.getValue()));
        if (sameAsPrevious) {
            previousEntry.outgoingInTheFutureAndPastTransactionCb(this, previousOutgoingEntry => {
                const outgoingEntry = this.entries.get(previousOutgoingEntry.identifier);
                if (outgoingEntry)
                    outgoingEntry.edgesFlow--;
            });
            entry.edgesFlow = MAX_SMI;
            entry.setOrigin(previousEntry.origin);
            entry.value = value;
        }
        else {
            entry.startOrigin();
            entry.setValue(value);
        }
        let ignoreSelfDependency = false;
        if (entry.usedProposedOrPrevious) {
            if (entry.proposedValue !== undefined) {
                if (identifier.equality(value, entry.proposedValue))
                    ignoreSelfDependency = true;
            }
            else {
                if (sameAsPrevious || (!previousEntry && value === null))
                    ignoreSelfDependency = true;
            }
            if (!ignoreSelfDependency)
                this.candidate.selfDependent.add(identifier);
        }
    }
    onReadIdentifier(identifierRead, activeEntry, stack) {
        const requestedEntry = this.addEdge(identifierRead, activeEntry, EdgeTypeNormal);
        if (requestedEntry.hasValue() || requestedEntry.value !== undefined) {
            const value = requestedEntry.getValue();
            if (value === TombStone)
                throwUnknownIdentifier(identifierRead);
            return activeEntry.continueCalculation(value);
        }
        else if (requestedEntry.isShadow()) {
            requestedEntry.startOrigin();
            requestedEntry.forceCalculation();
            stack.push(requestedEntry);
            return undefined;
        }
        else {
            if (!requestedEntry.isCalculationStarted()) {
                stack.push(requestedEntry);
                if (!requestedEntry.previous || !requestedEntry.previous.hasValue())
                    requestedEntry.forceCalculation();
                return undefined;
            }
            else {
                let cycle;
                const walkContext = TransactionCycleDetectionWalkContext.new({
                    transaction: this,
                    onCycle(node, stack) {
                        cycle = ComputationCycle.new({ cycle: cycleInfo(stack) });
                        return OnCycleAction.Cancel;
                    }
                });
                walkContext.startFrom([requestedEntry.identifier]);
                this.graph.onComputationCycleHandler(activeEntry, requestedEntry, cycle);
            }
        }
    }
    *calculateTransitions(context) {
        const queue = this.stackGen;
        while (queue.length) {
            yield* this.calculateTransitionsStackGen(context, queue.takeLowestLevel());
        }
    }
    calculateTransitionsSync(context) {
        const queue = this.stackGen;
        while (queue.length) {
            this.calculateTransitionsStackSync(context, queue.takeLowestLevel());
        }
    }
    *calculateTransitionsStackGen(context, stack) {
        if (this.rejectedWith)
            return;
        this.walkContext.startNewEpoch();
        const entries = this.entries;
        const propagationStartDate = this.propagationStartDate;
        const enableProgressNotifications = this.graph ? this.graph.enableProgressNotifications : false;
        let counter = 0;
        const prevActiveStack = this.activeStack;
        this.activeStack = stack;
        while (stack.length && !this.rejectedWith) {
            if (enableProgressNotifications && !(counter++ % this.emitProgressNotificationsEveryCalculations)) {
                const now = Date.now();
                const elapsed = now - propagationStartDate;
                if (elapsed > this.startProgressNotificationsAfterMs) {
                    const lastProgressNotificationDate = this.lastProgressNotificationDate;
                    if (!lastProgressNotificationDate || (now - lastProgressNotificationDate) > this.emitProgressNotificationsEveryMs) {
                        this.lastProgressNotificationDate = now;
                        this.graph.onPropagationProgressNotification({
                            total: this.plannedTotalIdentifiersToCalculate,
                            remaining: stack.length,
                            phase: 'propagating'
                        });
                        yield delay(0);
                    }
                }
            }
            const entry = stack[stack.length - 1];
            const identifier = entry.identifier;
            const ownEntry = entries.get(identifier);
            if (ownEntry !== entry) {
                entry.cleanup();
                stack.pop();
                continue;
            }
            if (entry.edgesFlow == 0) {
                entry.edgesFlow--;
                const previousEntry = entry.previous;
                previousEntry && previousEntry.outgoingInTheFutureAndPastTransactionCb(this, outgoing => {
                    const outgoingEntry = entries.get(outgoing.identifier);
                    if (outgoingEntry)
                        outgoingEntry.edgesFlow--;
                });
            }
            if (entry.edgesFlow < 0 && entry.previous && entry.previous.origin) {
                entry.setOrigin(entry.previous.origin);
                if (entry.size === 0) {
                    entries.delete(identifier);
                }
                entry.cleanup();
                stack.pop();
                continue;
            }
            if (entry.hasValue() || entry.proposedValue === TombStone) {
                entry.cleanup();
                stack.pop();
                continue;
            }
            const startedAtEpoch = entry.visitEpoch;
            let iterationResult = entry.isCalculationStarted() ? entry.iterationResult : entry.startCalculation(this.onEffectSync);
            while (iterationResult) {
                const value = iterationResult.value === undefined ? null : iterationResult.value;
                if (entry.isCalculationCompleted()) {
                    if (entry.visitEpoch == startedAtEpoch) {
                        this.onQuarkCalculationCompleted(entry, value);
                    }
                    stack.pop();
                    break;
                }
                else if (value instanceof Identifier) {
                    iterationResult = this.onReadIdentifier(value, entry, stack);
                }
                else if (value === SynchronousCalculationStarted) {
                    stack.pop();
                    break;
                }
                else {
                    const effectResult = yield value;
                    if (effectResult === BreakCurrentStackExecution)
                        break;
                    if (entry.visitEpoch === startedAtEpoch) {
                        iterationResult = entry.continueCalculation(effectResult);
                    }
                    else {
                        stack.pop();
                        break;
                    }
                }
            }
        }
        this.activeStack = prevActiveStack;
    }
    calculateTransitionsStackSync(context, stack) {
        if (this.rejectedWith)
            return;
        this.walkContext.startNewEpoch();
        const entries = this.entries;
        const prevActiveStack = this.activeStack;
        this.activeStack = stack;
        while (stack.length && !this.rejectedWith) {
            const entry = stack[stack.length - 1];
            const identifier = entry.identifier;
            const ownEntry = entries.get(identifier);
            if (ownEntry !== entry) {
                entry.cleanup();
                stack.pop();
                continue;
            }
            if (entry.edgesFlow == 0) {
                entry.edgesFlow--;
                const previousEntry = entry.previous;
                previousEntry && previousEntry.outgoingInTheFutureAndPastTransactionCb(this, outgoing => {
                    const outgoingEntry = entries.get(outgoing.identifier);
                    if (outgoingEntry)
                        outgoingEntry.edgesFlow--;
                });
            }
            if (entry.edgesFlow < 0 && entry.previous && entry.previous.origin) {
                entry.setOrigin(entry.previous.origin);
                if (entry.size === 0) {
                    entries.delete(identifier);
                }
                entry.cleanup();
                stack.pop();
                continue;
            }
            if (entry.hasValue() || entry.proposedValue === TombStone) {
                entry.cleanup();
                stack.pop();
                continue;
            }
            const startedAtEpoch = entry.visitEpoch;
            let iterationResult = entry.isCalculationStarted() ? entry.iterationResult : entry.startCalculation(this.onEffectSync);
            while (iterationResult) {
                const value = iterationResult.value === undefined ? null : iterationResult.value;
                if (entry.isCalculationCompleted()) {
                    if (entry.visitEpoch == startedAtEpoch) {
                        this.onQuarkCalculationCompleted(entry, value);
                    }
                    stack.pop();
                    break;
                }
                else if (value instanceof Identifier) {
                    iterationResult = this.onReadIdentifier(value, entry, stack);
                }
                else if (value === SynchronousCalculationStarted) {
                    stack.pop();
                    break;
                }
                else {
                    const effectResult = context(value);
                    if (effectResult instanceof Promise)
                        throw new Error("Effect resolved to promise in the synchronous context, check that you marked the asynchronous calculations accordingly");
                    if (effectResult === BreakCurrentStackExecution)
                        break;
                    if (entry.visitEpoch === startedAtEpoch) {
                        iterationResult = entry.continueCalculation(effectResult);
                    }
                    else {
                        stack.pop();
                        break;
                    }
                }
            }
        }
        this.activeStack = prevActiveStack;
    }
}
