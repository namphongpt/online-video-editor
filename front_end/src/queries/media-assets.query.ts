import { QUERY_MEDIA_ASSETS_KEY } from '@/constants/query.constant';
import { createMediaAsset, fetchMediaAssets } from '@/repositories/media-assets/mediaAssetRepository';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

export const useGetMediaAssetsQuery = () =>
    useSuspenseQuery({
        queryKey: [QUERY_MEDIA_ASSETS_KEY],
        queryFn: fetchMediaAssets
    });

export const useAddMediaAsset = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createMediaAsset,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_MEDIA_ASSETS_KEY]
            });
        }
    });
};
