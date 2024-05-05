import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetProjectQuery } from '@/queries/projects.query';
import { useParams } from 'react-router-dom';
import VideoTimeline, { Clip } from './ProjectPage/VideoTimeline';
import { useCallback, useState } from 'react';
import MediaAssetItem from './ProjectPage/MediaAssetItem';
import { DndContext, DragCancelEvent, DragEndEvent, DragMoveEvent } from '@dnd-kit/core';
import { MediaAsset } from '@/interfaces/mediaAsset';
import TimelineClip from './ProjectPage/TimelineClip';
import { useAddClipQuery, useGetProjectClipsQuery } from '@/queries/clips.query';
import { createClip } from '@/repositories/clips/clipRepository';
import { toast } from '@/components/ui/use-toast';

export type DragState = false | 'outside' | 'inside';

const ProjectPage = (): JSX.Element => {
    const { id } = useParams();
    const { data: project } = useGetProjectQuery(id!);
    const { data: clipsData } = useGetProjectClipsQuery(id!);
    const addClip = useAddClipQuery(id!);

    const [ clips, setClips ] = useState<Clip[]>(
        clipsData.map(clip => {
            return {...clip, mediaAsset: {filename: "aa.mp3", durationMs: 2000}};
        })
    );
    const [ draggingItem, setDraggingItem ] = useState<Clip | null>(null);
    const [ dragState, setDragState ] = useState<DragState>(false);

    const timelineLengthMs = Math.max(
        60_000, // Default of 1 minute if no clips are present.
        ...clips.map(x => x.startTimeMs + x.offsetEndMs)
    );

    const handleDragMove = useCallback((event: DragMoveEvent) => {
        // `onDragOver` is not used because this doesn't have a counterpart
        // which notifies us when it has left the droppable area.

        const { delta, active, over } = event;

        if (over !== null && over.id === 'timeline') {
            setDragState('inside');
        } else {
            setDragState('outside');
            return;
        }

        // It's not clear when there wouldn't be a `initial`, but we'll just
        // ignore this event if we encounter such case.
        if (active.rect.current.initial === null) {
            return;
        }

        const timelineWidth = over.rect.width;

        // While `delta.x` gives us the difference in the X coordinate, we must
        // account for the starting position (of `active`) w.r.t. the start of
        // the timeline (`over`), in order to find the position on the timeline
        // `delta.x + cardOffsetX`.
        const cardOffsetX = active.rect.current.initial.left - over.rect.left;

        // dnd-kit doesn't offer a way of typing the data, so we have to assume
        // it is correct.
        const mediaAsset = active.data.current as MediaAsset;

        setDraggingItem({
          mediaAsset: mediaAsset,
          startTimeMs: Math.max(delta.x + cardOffsetX, 0) / timelineWidth * timelineLengthMs,
          offsetStartMs: 0,
          offsetEndMs: mediaAsset.durationMs
        });
    }, [dragState, timelineLengthMs]);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        if (event.over?.id !== 'timeline') return;
        if (draggingItem === null) return;

        addClip.mutate(
            {...draggingItem, mediaAssetId: '7851beeb-6fd9-4769-9252-e5f5edf5c27f'},
            {
                onError: (err) => {
                    toast({
                        title: 'Kon clip niet aanmaken',
                        description: err.message,
                        variant: 'destructive'
                    });
                }
            }
        );
        //setClips([...clips, draggingItem]);

        setDragState(false);
        setDraggingItem(null);
    }, [draggingItem]);

    const handleDragCancel = useCallback((_event: DragCancelEvent) => {
        setDragState(false);
        setDraggingItem(null);
    }, []);

    // TODO: als je een clip hebt van 2s op n 60s timeline, dan zit de timelineclip niet onder je cursor
    return (
        <Layout>
            <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight'>
              Project &lsquo;{project.title}&rsquo;
            </h1>
    
            <DndContext
                onDragEnd={handleDragEnd}
                onDragMove={handleDragMove}
                onDragCancel={handleDragCancel}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Mediabestanden</CardTitle>
                        <CardDescription>
                            Gebruik je mediabestanden in je project door ze
                            naar de tijdlijn te verschuiven.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='flex flex-row gap-2'>
                        <MediaAssetItem
                            mediaAsset={{filename: 'video.webm', durationMs: 7000}}
                            dragState={dragState}
                        />
                        <MediaAssetItem
                            mediaAsset={{filename: 'video2.webm', durationMs: 2000}}
                            dragState={dragState}
                        />
                    </CardContent>
                </Card>

                <VideoTimeline lengthMs={timelineLengthMs}>
                    {clips.map(clip => (
                        <TimelineClip
                            key={clip.mediaAsset.filename}
                            clip={clip}
                            timelineLengthMs={timelineLengthMs}
                        />
                    ))}
                    {
                        dragState === 'inside' &&
                        draggingItem !== null &&
                        <TimelineClip
                            clip={draggingItem}
                            timelineLengthMs={timelineLengthMs}
                        />
                    }
                </VideoTimeline>
            </DndContext>
        </Layout>
    )
};

export default ProjectPage;
