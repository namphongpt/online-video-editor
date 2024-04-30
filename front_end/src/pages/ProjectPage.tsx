import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetProjectQuery } from "@/queries/projects.query";
import { useParams } from "react-router-dom";
import VideoTimeline, { Clip } from "./ProjectPage/VideoTimeline";
import { useCallback, useState } from "react";
import MediaAssetItem from "./ProjectPage/MediaAssetItem";
import { DndContext, DragEndEvent, DragMoveEvent, DragOverEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { createSnapModifier, snapCenterToCursor } from "@dnd-kit/modifiers";
import { MediaAsset } from "@/interfaces/mediaAsset";
import TimelineClip from "./ProjectPage/TimelineClip";

export type DragState = false | 'outside' | 'inside' | 'disallowed';

const ProjectPage = (): JSX.Element => {
    const { id } = useParams();
    const { data: project } = useGetProjectQuery(id!);

    const [clips, setClips] = useState<Clip[]>([]);

    const [draggingItem, setDraggingItem] = useState<Clip | null>(null);

    const [ dragState, setDragState ] = useState<DragState>(false);

    const handleDragStart = useCallback((event: DragStartEvent) => {
      // This requires casting as this is still a generic `AnyData`, as
      // mentioned in this issue: https://github.com/clauderic/dnd-kit/issues/935.
      if (event.active.data.current === undefined) return;

      setDragState('outside');
    }, [dragState]);

    const handleDragMove = useCallback((event: DragMoveEvent) => {
      // `onDragOver` is not used because this doesn't have a counterpart which
      // notifies us when it has left the droppable area.
      if (event.over !== null) {
        setDragState('inside');
      }
      if (dragState !== 'inside') return;

      if (event.over === null) {
        setDragState('outside');
        return;
      }

      const { delta, active, over } = event;

      const timelineWidth = over!.rect.width;

      const cardOffset = active.rect.current.initial!.left - over!.rect.left;

      const mediaAsset = active.data.current as MediaAsset;
      setDraggingItem({
        mediaAsset: mediaAsset,
        startTimeMs: Math.max(delta.x + cardOffset, 0) / timelineWidth * 20_000,
        offsetStartMs: 0,
        offsetEndMs: mediaAsset.durationMs
      });
    }, [dragState]);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
      const { active, over } = event;
      if (over === null) return;

      // TODO: draggingItem! null check
      setClips([...clips, draggingItem!])
    }, [draggingItem]);

    return (
        <Layout>
            <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl">
              Project &lsquo;{project.title}&rsquo;
            </h1>
    
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragMove={handleDragMove}
        onDragCancel={() => alert(1)} /* TODO */
        modifiers={[/*snapCenterToCursor, createSnapModifier(20)*/]}
      >
      <Card>
        <CardHeader>
          <CardTitle>Mediabestanden</CardTitle>
          <CardDescription>
            Gebruik je mediabestanden in je project door ze naar de tijdlijn
            te verschuiven.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-row gap-2">
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

      <VideoTimeline>
        {clips.map(clip => (
          <TimelineClip key={clip.mediaAsset.filename} clip={clip} />
        ))}
        {dragState === 'inside' && draggingItem !== null && <TimelineClip clip={draggingItem} />}
      </VideoTimeline>
      </DndContext>
        </Layout>
    )
};

export default ProjectPage;