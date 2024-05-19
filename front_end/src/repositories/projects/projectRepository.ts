import { ProjectInterface } from '@/interfaces/project'
import { CreateProjectParam } from './projectRepository.param'
import axios from 'axios'
import { Auth0ContextInterface } from '@auth0/auth0-react'
import createAuthenticatedClient from '../apiClient'

type Projects = ReadonlyArray<ProjectInterface>

export const fetchProject = async (id: string, auth: Auth0ContextInterface): Promise<ProjectInterface> => {
    const client = await createAuthenticatedClient(auth);

    const response = await client.get<ProjectInterface>(`/api/Projects/${id}`);

    return response.data;
};

export const fetchProjects = async (auth: Auth0ContextInterface): Promise<Projects> => {
    const client = await createAuthenticatedClient(auth);

    const response = await client.get<Projects>('/api/Projects');

    return response.data;
};

export const createProject = async ({ title }: CreateProjectParam, auth: Auth0ContextInterface): Promise<ProjectInterface> => {
    const client = await createAuthenticatedClient(auth);

    const response = await client.post<ProjectInterface>('/api/Projects', { title });

    return response.data;
};
