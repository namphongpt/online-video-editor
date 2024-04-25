import { ProjectInterface } from '@/interfaces/project'
import { projectParam } from './projectRepository.param'
import axios from 'axios'

export const getProject = async ({ id }: projectParam) => {
    return await fetch(
        `/api/Projects/${id}`
    )
}

export const getProjects = (): Promise<ProjectInterface[]> =>
    axios.get('/api/Projects').then((res) => res.data)
