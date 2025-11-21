import { Base } from "../class/Base.js";
const performance = globalThis.performance || Date;
const average = (samples) => samples.reduce((acc, current) => acc + current, 0) / samples.length;
const unbiasedSampleVariance = (samples) => {
    const mean = average(samples);
    const usv = samples.reduce((acc, current) => acc + (current - mean) * (current - mean), 0);
    return usv / (samples.length - 1);
};
const studentDist95 = new Map([
    [1, 12.706], [2, 4.303], [3, 3.182], [4, 2.776], [5, 2.571], [6, 2.447],
    [7, 2.365], [8, 2.306], [9, 2.262], [10, 2.228], [11, 2.201], [12, 2.179],
    [13, 2.16], [14, 2.145], [15, 2.131], [16, 2.12], [17, 2.11], [18, 2.101],
    [19, 2.093], [20, 2.086], [21, 2.08], [22, 2.074], [23, 2.069], [24, 2.064],
    [25, 2.06], [26, 2.056], [27, 2.052], [28, 2.048], [29, 2.045], [30, 2.042],
    [Infinity, 1.96]
]);
const getStudentCriticalValue = (size) => size <= 30 ? studentDist95.get(size) : studentDist95.get(Infinity);
const fmt = new Intl.NumberFormat([], { maximumFractionDigits: 3, useGrouping: false });
const format = num => fmt.format(num);
export class Benchmark extends Base {
    constructor() {
        super(...arguments);
        this.name = 'Noname benchmark';
        this.plannedRelMoe = 0.05;
        this.plannedMinTime = 3000;
        this.plannedMaxTime = 7000;
        this.plannedCalibrationTime = 500;
        this.coolDownTimeout = 10;
    }
    async setup() {
        return;
    }
    async tearDown(state) {
        return;
    }
    cycle(iteration, cycle, state) {
    }
    gatherInfo(state) {
        return;
    }
    stringifyInfo(info) {
        return;
    }
    async calibrate(plannedCalibrationTime, state) {
        let cyclesCount = 0;
        let elapsed;
        const start = performance.now();
        const isAsync = this.cycle.constructor.name === 'AsyncFunction';
        while ((elapsed = performance.now() - start) < plannedCalibrationTime) {
            if (isAsync) {
                await this.cycle(0, cyclesCount++, state);
            }
            else {
                this.cycle(0, cyclesCount++, state);
            }
        }
        return { cyclesCount, elapsed };
    }
    getRunInfo(samples, cyclesCount, state) {
        const averageCycleTime = average(samples) / cyclesCount;
        const deviation = Math.sqrt(unbiasedSampleVariance(samples) / (cyclesCount * cyclesCount));
        const marginOfError = deviation / Math.sqrt(samples.length) * getStudentCriticalValue(samples.length);
        return {
            samples,
            cyclesCount,
            averageCycleTime,
            deviation,
            marginOfError,
            relativeMoe: marginOfError / averageCycleTime,
            info: this.gatherInfo(state)
        };
    }
    getRelativeMoe(samples, cyclesCount) {
        if (samples.length <= 1)
            return Infinity;
        const averageCycleTime = average(samples) / cyclesCount;
        const deviation = Math.sqrt(unbiasedSampleVariance(samples) / (cyclesCount * cyclesCount));
        return deviation / Math.sqrt(samples.length) * getStudentCriticalValue(samples.length) / averageCycleTime;
    }
    async runTillMaxTime(maxTime = this.plannedMaxTime) {
        const state = await this.setup();
        const { cyclesCount } = await this.calibrate(this.plannedCalibrationTime, state);
        return this.runWhile(true, state, cyclesCount, (samples, i, elapsed) => i < 2 || elapsed < maxTime);
    }
    async runTillRelativeMoe(relMoe = this.plannedRelMoe) {
        const state = await this.setup();
        const { cyclesCount } = await this.calibrate(this.plannedCalibrationTime, state);
        return this.runWhile(true, state, cyclesCount, (samples, i, elapsed) => this.getRelativeMoe(samples, cyclesCount) > relMoe || elapsed < this.plannedMinTime);
    }
    async runFixed(cyclesCount, iterationsCount) {
        const state = await this.setup();
        return this.runWhile(false, state, cyclesCount, (samples, i, elapsed) => i < iterationsCount);
    }
    async runWhile(calibrationDone, state, cyclesCount, condition) {
        const samples = [];
        let globalStart = performance.now();
        let i = calibrationDone ? 1 : 0;
        const isAsync = this.cycle.constructor.name === 'AsyncFunction';
        while (condition(samples, i, performance.now() - globalStart)) {
            if (this.coolDownTimeout > 0)
                await new Promise(resolve => setTimeout(resolve, this.coolDownTimeout));
            const start = performance.now();
            for (let c = 0; c < cyclesCount; c++) {
                if (isAsync) {
                    await this.cycle(i, c, state);
                }
                else {
                    this.cycle(i, c, state);
                }
            }
            samples.push(performance.now() - start);
            i++;
        }
        const result = this.getRunInfo(samples, cyclesCount, state);
        await this.tearDown(state);
        return result;
    }
    report(runInfo) {
        console.log(`${this.name}: ${format(runInfo.averageCycleTime)}ms ±${format(runInfo.marginOfError)}`);
    }
    async clearGarbage() {
        if (globalThis.gc) {
            globalThis.gc();
            await new Promise(resolve => setTimeout(resolve, 50));
            globalThis.gc();
            await new Promise(resolve => setTimeout(resolve, 100));
            globalThis.gc();
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }
    async measureTillRelativeMoe() {
        this.clearGarbage();
        const runInfo = await this.runTillRelativeMoe();
        this.report(runInfo);
        return runInfo;
    }
    async measureFixed(cyclesCount, iterationsCount) {
        this.clearGarbage();
        const runInfo = await this.runFixed(cyclesCount, iterationsCount);
        this.report(runInfo);
        return runInfo;
    }
    async measureTillMaxTime() {
        this.clearGarbage();
        const runInfo = await this.runTillMaxTime();
        this.report(runInfo);
        return runInfo;
    }
}
export const BenchmarkC = (config) => Benchmark.new(config);
