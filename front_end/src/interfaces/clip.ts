import { MediaAsset } from './mediaAsset';

export interface ClipInterface {
    id: string;
    projectId: string;
    mediaAssetId: string;
    offsetStartMs: number;
    offsetEndMs: number;
    startTimeMs: number;
};

export type ClipCreateDto = Omit<ClipInterface, 'id'> & {
    id?: string;
    mediaAsset: MediaAsset;
};

export interface ClipWithMediaAsset extends ClipInterface {
    mediaAsset: {
        id: string;
        filename: string;
        durationMs: number;
    };
};
