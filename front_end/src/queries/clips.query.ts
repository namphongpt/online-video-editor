import { QUERY_PROJECT_CLIPS_KEY } from '@/constants/query.constant';
import { createClip, fetchProjectClips } from '@/repositories/clips/clipRepository';
import { CreateClipParam } from '@/repositories/clips/clipRepository.param';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

export const useGetProjectClipsQuery = (projectId: string) =>
    useSuspenseQuery({
        queryKey: [QUERY_PROJECT_CLIPS_KEY, projectId],
        queryFn: () => fetchProjectClips(projectId)
    });

export const useAddClipQuery = (projectId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (clipParams: CreateClipParam) => createClip(projectId, clipParams),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_PROJECT_CLIPS_KEY, projectId]
            });
        }
    });
};
