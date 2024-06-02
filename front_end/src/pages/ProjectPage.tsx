import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetProjectQuery } from '@/queries/projects.query';
import { useParams } from 'react-router-dom';
import VideoTimeline from './ProjectPage/VideoTimeline';
import { useCallback, useState } from 'react';
import MediaAssetItem from './ProjectPage/MediaAssetItem';
import { DndContext, DragCancelEvent, DragEndEvent, DragMoveEvent } from '@dnd-kit/core';
import { MediaAsset } from '@/interfaces/mediaAsset';
import TimelineClip from './ProjectPage/TimelineClip';
import { useAddClipQuery, useGetProjectClipsQuery } from '@/queries/clips.query';
import { toast } from '@/components/ui/use-toast';
import { ClipCreateDto } from '@/interfaces/clip';
import MediaAssetUploadForm from './ProjectsOverviewPage/MediaAssetUploadForm';
import { useGetMediaAssetsQuery } from '@/queries/media-assets.query';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import RenderButton from './ProjectPage/RenderButton';

export type DragState = false | 'outside' | 'inside';

const ProjectPage = (): JSX.Element => {
    const { id } = useParams();
    const { data: project } = useGetProjectQuery(id!);
    const { data: clips } = useGetProjectClipsQuery(id!);
    const { data: mediaAssets2 } = useGetMediaAssetsQuery();
    const addClip = useAddClipQuery(id!);

    const mediaAssets = mediaAssets2.map(x => ({...x, durationMs: 6000}));

    const [ draggingItem, setDraggingItem ] = useState<ClipCreateDto | null>(null);
    const [ dragState, setDragState ] = useState<DragState>(false);

    const mediaAssetsById = Object.groupBy(mediaAssets, ({ id }) => id);
    const clipsWithMedia = clips.map(clip => (
        {...clip, mediaAsset: mediaAssetsById[clip.id]}
    ));

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
            mediaAssetId: mediaAsset.id,
            projectId: id!,
            mediaAsset: mediaAsset,
            startTimeMs: Math.max(delta.x + cardOffsetX, 0) / timelineWidth * timelineLengthMs,
            offsetStartMs: 0,
            offsetEndMs: mediaAsset.durationMs
        });
    }, [draggingItem, dragState, timelineLengthMs]);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        if (event.over?.id !== 'timeline') return;
        if (draggingItem === null) return;

        addClip.mutate(
            draggingItem,
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
                            {mediaAssets.map(mediaAsset => (
                                <MediaAssetItem
                                    key={mediaAsset.id}
                                    mediaAsset={mediaAsset}
                                    dragState={dragState}
                                />
                            ))}
                        <MediaAssetUploadForm />
                    </CardContent>
                </Card>

                <VideoTimeline lengthMs={timelineLengthMs}>
                    {clipsWithMedia.map(clip => (
                        <TimelineClip
                            key={clip.id}
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

            <RenderButton project={project} />
        </Layout>
    )
};

export default withAuthenticationRequired(ProjectPage);
