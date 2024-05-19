import { ClipInterface } from '@/interfaces/clip';
import axios from 'axios';
import { CreateClipParam } from './clipRepository.param';
import { Auth0ContextInterface } from '@auth0/auth0-react';
import createAuthenticatedClient from '../apiClient';

type Clips = ReadonlyArray<ClipInterface>;

export const fetchProjectClips = async (projectId: string, auth: Auth0ContextInterface): Promise<Clips> => {
    const client = await createAuthenticatedClient(auth);

    const response = await client.get(`/api/Projects/${projectId}/Clips`);
    
    return response.data;
};

export const createClip = async (projectId: string, clipParams: CreateClipParam, auth: Auth0ContextInterface): Promise<ClipInterface> => {
    const client = await createAuthenticatedClient(auth);

    const response = await client.post(
        `/api/Projects/${projectId}/Clips`,
        {
            ...clipParams,
            startTimeMs: clipParams.startTimeMs.toFixed(),
            offsetStartMs: clipParams.offsetStartMs.toFixed(),
            offsetEndMs: clipParams.offsetEndMs.toFixed()
        }
    );
    
    return response.data;
};