import { ProjectInterface } from '@/interfaces/project'
import { CreateProjectParam } from './projectRepository.param'
import axios from 'axios'

type Projects = ReadonlyArray<ProjectInterface>

export const fetchProject = (id: string): Promise<ProjectInterface> =>
    axios.get(`/api/Projects/${id}`).then(res => res.data)

export const fetchProjects = (): Promise<Projects> =>
    axios.get('/api/Projects').then(res => res.data)

export const createProject = ({ title }: CreateProjectParam): Promise<ProjectInterface> =>
    axios.post('/api/Projects', { title }).then(res => res.data)
