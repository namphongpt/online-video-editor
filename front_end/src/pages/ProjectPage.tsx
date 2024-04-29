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

    const [clips, setClips] = useState<Clip[]>([
      //{ mediaAssetId: "a", startTimeMs: 3000, endTimeMs: 6000},
      //{ mediaAssetId: "b", startTimeMs: 15000, endTimeMs: 20000},
      //{ mediaAsset: {filename: 'video.mp4', durationMs: 2_000}, startTimeMs: 21000, offsetStartMs: 0, offsetEndMs: 2_000}
    ]);

    const [draggingItem, setDraggingItem] = useState<Clip | null>(null);

    const [ dragState, setDragState ] = useState<DragState>(false);

    const handleDragStart = useCallback((event: DragStartEvent) => {
      // This requires casting as this is still a generic `AnyData`, as
      // mentioned in this issue: https://github.com/clauderic/dnd-kit/issues/935.
      if (event.active.data.current === undefined) return;

      const mediaAsset = event.active.data.current as MediaAsset;
      //setDraggingItem({
      //  mediaAsset: mediaAsset,
      //  startTimeMs: 0,
      //  offsetStartMs: 0,
      //  offsetEndMs: mediaAsset.durationMs
      //});
      setDragState('outside');
    }, []);

    var x: DragMoveEvent = null!;

    const handleDragMove = (event: DragMoveEvent) => {
      if (event.over !== null)  setDragState('inside');
      if (dragState !== 'inside') return;

      if (event.over === null) {
        setDragState('outside');
        return;
      }

      const { active, over } = event;
      console.log('was passeirt');
//      if (over === null) return;
      console.log("hz is over null");

      console.log('x', event.delta.x);
      //alert(event.delta.x - active.rect.current.translated!.left);

//      event.over.id 
      //alert(JSON.stringify(event.over!.rect) + JSON.stringify(event.active.rect));
      //const pct = (active.rect.current.translated!.left / 2) / over!.rect.width * 20_000;
      const pct = Math.max(event.delta.x, 0) / over!.rect.width * 20_000;
      console.log(active.rect.current.translated)
      console.log(active.rect.current.initial)
      console.log(over!.rect)
      console.log(pct);

      const duration = event.active.data.current!.durationMs;
      console.log(duration);

//      draggingItem!.update()
      const mediaAsset = event.active.data.current as MediaAsset;
      setDraggingItem({
        mediaAsset: mediaAsset,
        startTimeMs: pct,
        offsetStartMs: 0,
        offsetEndMs: mediaAsset.durationMs
      });
//      setDraggingItem({...draggingItem!, startTimeMs: pct})
    };

    const handleDragOver = (event: DragOverEvent) => {
      setDragState('inside');
      console.log('draging over');
//      event.over

    };//, [dragging, draggingItem]);

    const handleDragEnd = (event: DragEndEvent) => {
// hier iets mee doen:      event.delta.x
      const { active, over } = event;
      console.log('was passeirt');
      if (over === null) return;
      console.log("hz is over null");

      console.log('x', event.delta.x);

//      event.over.id 
      //alert(JSON.stringify(event.over!.rect) + JSON.stringify(event.active.rect));
//      const pct = (/*active.rect.current!.initial!.left + */active.rect.current.translated!.left) / over!.rect.width * 20_000;
//      console.log(active.rect.current.translated)
//      console.log(active.rect.current.initial)
//      console.log(over!.rect)
//      console.log(pct);
//
//      const duration = event.active.data.current!.durationMs;
//      console.log(duration);
//
////      draggingItem!.update()
//      setDraggingItem({...draggingItem!, startTimeMs: pct})

      // TODO hier moet de starttime bepaald worden obv de position op de timeline
      //setClips([...clips, {mediaAssetId: Date.now().toString(), startTimeMs: pct, endTimeMs: pct + duration}])
      setClips([...clips, draggingItem!])
    };//, [dragging, draggingItem]);


    return (
        <Layout>
            <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl">
              Project &lsquo;{project.title}&rsquo;
            </h1>
    
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragMove={handleDragMove}
        onDragOver={handleDragOver}
        onDragCancel={() => alert(1)}
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
        <CardContent>
          <ScrollArea className="h-36">
            <div className="flex flex-col gap-2">
              <MediaAssetItem
                mediaAsset={{filename: 'video.webm', durationMs: 7000}}
                dragState={dragState}
              />
              {/*<MediaAssetItem
                mediaAsset={{filename: 'video2.mp4', durationMs: 2000}}
                dragging={dragging}
    />*/}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/*<DragOverlay>
        <MediaAssetItem mediaAsset={{filename: 'video.webm', durationMs: 5000}} />
    </DragOverlay>
      
    maken zodat het 
    <VideoTimeline lengthMs={20_000} ref={timelineRef}>
      {clips.map(clip => <TimelineClip clip={clip} />)

      {activeDrag !== null && <TimelineClip clip={clip voor die drag} isDragging />}
    </VideoTimeline>
    is
    
    */}

      <VideoTimeline>
        {clips.map(clip => (
          <TimelineClip key={clip.mediaAsset.filename} clip={clip} />
        ))}
        {dragState === 'inside' && draggingItem !== null && <TimelineClip clip={draggingItem} />}
      </VideoTimeline>
      </DndContext>
      {/*<ResizablePanel>
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">One</span>
        </div>
        
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={25}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Two</span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={75}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Three</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>*/}
        </Layout>
    )
};

export default ProjectPage;