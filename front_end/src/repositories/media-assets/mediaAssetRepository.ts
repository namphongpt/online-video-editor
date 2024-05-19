import { CreateMediaAssetParam } from './mediaAssetRepository.param';
import { MediaAsset } from '@/interfaces/mediaAsset';
import { Auth0ContextInterface } from '@auth0/auth0-react';
import createAuthenticatedClient from '../apiClient';

type MediaAssets = ReadonlyArray<MediaAsset>;

export const fetchMediaAssets = async (auth: Auth0ContextInterface): Promise<MediaAssets> => {
    const client = await createAuthenticatedClient(auth);

    const response = await client.get<MediaAssets>(`/api/MediaAssets`);

    return response.data;
};

export const createMediaAsset = async (mediaAssetParam: CreateMediaAssetParam, auth: Auth0ContextInterface): Promise<MediaAsset> => {
    const client = await createAuthenticatedClient(auth);

    const formData = new FormData();
    formData.append('mediaFile', mediaAssetParam.mediaFile);

    const response = await client.postForm<MediaAsset>(`/api/MediaAssets`, formData);

    return response.data;
};
