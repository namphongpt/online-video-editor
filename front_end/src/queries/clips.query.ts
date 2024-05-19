import { QUERY_PROJECT_CLIPS_KEY } from '@/constants/query.constant';
import { createClip, fetchProjectClips } from '@/repositories/clips/clipRepository';
import { CreateClipParam } from '@/repositories/clips/clipRepository.param';
import { useAuth0 } from '@auth0/auth0-react';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

export const useGetProjectClipsQuery = (projectId: string) => {
    const auth = useAuth0();

    return useSuspenseQuery({
        queryKey: [QUERY_PROJECT_CLIPS_KEY, projectId],
        queryFn: () => fetchProjectClips(projectId, auth)
    });
};

export const useAddClipQuery = (projectId: string) => {
    const queryClient = useQueryClient();
    const auth = useAuth0();

    return useMutation({
        mutationFn: (clipParams: CreateClipParam) => createClip(projectId, clipParams, auth),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_PROJECT_CLIPS_KEY, projectId]
            });
        }
    });
};
