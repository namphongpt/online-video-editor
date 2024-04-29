import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { QUERY_PROJECTS_KEY, QUERY_PROJECT_KEY } from '../constants/query.constant'
import { createProject, fetchProject, fetchProjects } from '../repositories/projects/projectRepository'

export const useGetProjectsQuery = () =>
    useSuspenseQuery({
//            {
//                queryKey: [QUERY_PROJECTS_KEY, id],
//                queryFn: () => getProject({ id }).then(res => res.json()).then((data) => data),
//            },
                queryKey: [QUERY_PROJECTS_KEY],
                queryFn: () => fetchProjects()
    })

export const useGetProjectQuery = (id: string) =>
    useSuspenseQuery({
        queryKey: [QUERY_PROJECT_KEY, id],
        queryFn: () => fetchProject(id),
    })

export const useAddProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_PROJECTS_KEY]
            })
        }
    });
}
