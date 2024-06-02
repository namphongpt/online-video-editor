import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { QUERY_PROJECTS_KEY, QUERY_PROJECT_KEY } from '../constants/query.constant'
import { createProject, fetchProject, fetchProjects, renderProject } from '../repositories/projects/projectRepository'
import { useAuth0 } from '@auth0/auth0-react';
import { CreateProjectParam, RenderProjectParam } from '@/repositories/projects/projectRepository.param';

export const useGetProjectsQuery = () => {
    const auth = useAuth0();

    return useSuspenseQuery({
        queryKey: [QUERY_PROJECTS_KEY],
        queryFn: () => fetchProjects(auth)
    });
};

export const useGetProjectQuery = (id: string) => {
    const auth = useAuth0();

    return useSuspenseQuery({
        queryKey: [QUERY_PROJECT_KEY, id],
        queryFn: () => fetchProject(id, auth),
    });
};

export const useAddProject = () => {
    const queryClient = useQueryClient();
    const auth = useAuth0();

    return useMutation({
        mutationFn: (createProjectParam: CreateProjectParam) => (
            createProject(createProjectParam, auth)
        ),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_PROJECTS_KEY]
            });
        }
    });
};

export const useRenderProject = () => {
    const auth = useAuth0();

    return useMutation({
        mutationFn: (renderProjectParam: RenderProjectParam) => (
            renderProject(renderProjectParam, auth)
        )
    });
};
