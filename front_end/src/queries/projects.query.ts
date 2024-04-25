import { useMutation, useQuery } from '@tanstack/react-query'
import { QUERY_PROJECTS_KEY, QUERY_PROJECT_KEY } from '../constants/query.constant'
import { getProject, getProjects } from '../repositories/projects/projectRepository'

export const useGetProjectsQueries = () => {
    return useQuery({
//            {
//                queryKey: [QUERY_PROJECTS_KEY, id],
//                queryFn: () => getProject({ id }).then(res => res.json()).then((data) => data),
//            },
                queryKey: [QUERY_PROJECT_KEY],
                queryFn: () => getProjects().then((res) => res)
    })
}

