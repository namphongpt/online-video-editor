import { ClipInterface } from '@/interfaces/clip';
import axios from 'axios';
import { CreateClipParam } from './clipRepository.param';

type Clips = ReadonlyArray<ClipInterface>;

export const fetchProjectClips = (projectId: string): Promise<Clips> =>
    axios.get(`/api/Projects/${projectId}/Clips`).then(res => res.data);

export const createClip = (projectId: string, clipParams: CreateClipParam): Promise<ClipInterface> =>
    axios.post(
        `/api/Projects/${projectId}/Clips`,
        {
            ...clipParams,
            projectId,
            startTimeMs: clipParams.startTimeMs.toFixed(),
            offsetStartMs: clipParams.offsetStartMs.toFixed(),
            offsetEndMs: clipParams.offsetEndMs.toFixed()
        }
    ).then(res => res.data)
