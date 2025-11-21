import { Base } from "../class/Base.js";
import { NOT_VISITED, OnCycleAction, VISITED_TOPOLOGICALLY } from "../graph/WalkDepth.js";
import { Levels } from "./Identifier.js";
export class TransactionWalkDepth extends Base {
    constructor() {
        super(...arguments);
        this.visited = new Map();
        this.transaction = undefined;
        this.baseRevision = undefined;
        this.pushTo = undefined;
        this.toVisit = [];
        this.currentEpoch = 0;
    }
    startFrom(sourceNodes) {
        this.continueFrom(sourceNodes);
    }
    continueFrom(sourceNodes) {
        this.toVisit.push.apply(this.toVisit, sourceNodes);
        this.walkDepth();
    }
    startNewEpoch() {
        if (this.toVisit.length)
            throw new Error("Can not start new walk epoch in the middle of the walk");
        this.currentEpoch++;
    }
    onTopologicalNode(identifier, visitInfo) {
        if (!identifier.lazy && identifier.level !== Levels.UserInput)
            this.pushTo.push(visitInfo);
    }
    onCycle(node, stack) {
        return OnCycleAction.Resume;
    }
    doCollectNext(from, to, toVisit) {
        let quark = this.visited.get(to);
        if (!quark) {
            quark = to.newQuark(this.baseRevision);
            quark.visitEpoch = this.currentEpoch;
            this.visited.set(to, quark);
        }
        toVisit.push(to);
    }
    collectNext(from, toVisit, visitInfo) {
        const latestEntry = this.baseRevision.getLatestEntryFor(from);
        if (latestEntry) {
            visitInfo.previous = latestEntry;
            latestEntry.outgoingInTheFutureAndPastTransactionCb(this.transaction, outgoingEntry => {
                this.doCollectNext(from, outgoingEntry.identifier, toVisit);
            });
        }
        for (const outgoingIdentifier of visitInfo.getOutgoing().keys()) {
            this.doCollectNext(from, outgoingIdentifier, toVisit);
        }
        if (visitInfo.$outgoingPast !== undefined)
            for (const outgoingIdentifier of visitInfo.getOutgoingPast().keys()) {
                this.doCollectNext(from, outgoingIdentifier, toVisit);
            }
    }
    walkDepth() {
        const visited = this.visited;
        const toVisit = this.toVisit;
        let depth;
        while (depth = toVisit.length) {
            const node = toVisit[depth - 1];
            let visitInfo = visited.get(node);
            if (visitInfo && visitInfo.visitedAt === VISITED_TOPOLOGICALLY && visitInfo.visitEpoch === this.currentEpoch) {
                visitInfo.edgesFlow++;
                toVisit.pop();
                continue;
            }
            if (visitInfo && visitInfo.visitEpoch === this.currentEpoch && visitInfo.visitedAt !== NOT_VISITED) {
                if (visitInfo.visitedAt < depth) {
                    if (this.onCycle(node, toVisit) !== OnCycleAction.Resume)
                        break;
                    visitInfo.edgesFlow++;
                }
                else {
                    visitInfo.visitedAt = VISITED_TOPOLOGICALLY;
                    this.onTopologicalNode(node, visitInfo);
                }
                toVisit.pop();
            }
            else {
                const lengthBefore = toVisit.length;
                if (!visitInfo) {
                    visitInfo = node.newQuark(this.baseRevision);
                    visitInfo.visitEpoch = this.currentEpoch;
                    visited.set(node, visitInfo);
                }
                this.collectNext(node, toVisit, visitInfo);
                if (visitInfo.visitEpoch < this.currentEpoch) {
                    visitInfo.resetToEpoch(this.currentEpoch);
                }
                visitInfo.visitedAt = depth;
                visitInfo.edgesFlow++;
                if (toVisit.length === lengthBefore) {
                    visitInfo.visitedAt = VISITED_TOPOLOGICALLY;
                    this.onTopologicalNode(node, visitInfo);
                    toVisit.pop();
                }
            }
        }
    }
}
