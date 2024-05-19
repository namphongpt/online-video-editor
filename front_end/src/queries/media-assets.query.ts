import { QUERY_MEDIA_ASSETS_KEY } from '@/constants/query.constant';
import { createMediaAsset, fetchMediaAssets } from '@/repositories/media-assets/mediaAssetRepository';
import { CreateMediaAssetParam } from '@/repositories/media-assets/mediaAssetRepository.param';
import { useAuth0 } from '@auth0/auth0-react';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

export const useGetMediaAssetsQuery = () => {
    const auth = useAuth0();

    return useSuspenseQuery({
        queryKey: [QUERY_MEDIA_ASSETS_KEY],
        queryFn: () => fetchMediaAssets(auth)
    });
};

export const useAddMediaAsset = () => {
    const queryClient = useQueryClient();
    const auth = useAuth0();

    return useMutation({
        mutationFn: (mediaAssetParam: CreateMediaAssetParam) => (
            createMediaAsset(mediaAssetParam, auth)
        ),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_MEDIA_ASSETS_KEY]
            });
        }
    });
};
