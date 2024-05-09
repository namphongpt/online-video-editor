import axios from 'axios';
import { CreateMediaAssetParam } from './mediaAssetRepository.param';
import { MediaAsset } from '@/interfaces/mediaAsset';

type MediaAssets = ReadonlyArray<MediaAsset>;

export const fetchMediaAssets = (): Promise<MediaAssets> =>
    axios.get(`http://localhost:5173/MediaAssets`).then(res => res.data);

export const createMediaAsset = (mediaAssetParam: CreateMediaAssetParam): Promise<MediaAsset> => {
    const formData = new FormData();
    formData.append('mediaFile', mediaAssetParam.mediaFile);

    return axios.postForm(`http://localhost:5173/MediaAssets`, formData)
                .then(res => res.data);
}
