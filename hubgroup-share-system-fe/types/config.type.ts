import { SystemBaseReadModel } from './common.type';

export interface RVBeeVoice extends SystemBaseReadModel {
    code: string;
    name?: string;
    sampleRate?: number[];
    defaultSampleRate: number;
    sampleAudioUrl?: string;
    type?: number;
}
