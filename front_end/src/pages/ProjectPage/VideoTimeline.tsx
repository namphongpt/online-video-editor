import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MediaAsset } from "@/interfaces/mediaAsset";
import { useRef, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import TimelineClip from "./TimelineClip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { MoveHorizontal, Scissors } from "lucide-react";

export interface Clip {
    mediaAsset: MediaAsset;
    /** At what ms the {@link MediaAsset} should start playing. Starts at the
      * beginning of the original {@link MediaAsset} when set to `0`.
      */
    offsetStartMs: number;
    /**
     * Until what ms the {@link MediaAsset} should keep playing. This clip will
     * play to the end of the {@link MediaAsset} when it is equal to its
     * `durationMs` field.
     */
    offsetEndMs: number;
    /**
     * At what time in the final video this `Clip` should be played.
     */
    startTimeMs: number;
};

interface VideoTimelineProps {
//    clips: Clip[];
    children: React.ReactNode;
};

const VideoTimeline = ({ children }: VideoTimelineProps): JSX.Element => {
    const endTimeMs = 20_000;
    // TODO: vervangen met statemanager iets
    //const [clips, setClips] = useState(clips_org);

    const msToPercentage = (ms: number): string => `calc(${ms / endTimeMs * 100}%)`;
    const msToTimestampStr = (ms: number): string => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        return (
            minutes +
            ":" +
            (remainingSeconds < 10 ? "0" : "") +
            remainingSeconds
        );
    };
    const maxClipEndMs = 20_000;//Math.max(...clips.map(c => c.endTimeMs));
    const timecodeSpanCount = Math.ceil(5 * maxClipEndMs / endTimeMs);

    const timelineRef = useRef<HTMLDivElement | null>(null);

    /*const [{ isOver, canDrop }, drop] = useDrop(
        () => ({
            accept: 'media-asset',
            canDrop: (item: MediaAsset, monitor) => {
                // monitor.getClientOffset()
                return true;
            },
            drop: (item: MediaAsset, monitor) => {
                // TODO: in die clip gwn verwijzen naar de mediaasset (DRY)
                if (timelineRef === null) return;
                const xy = monitor.getClientOffset();
                if (xy === null) return;
                const { x, y } = xy;

                const rect = timelineRef.current?.getBoundingClientRect();
                if (rect === undefined) return;
                const offset = x - rect.left;
                alert(offset / timelineRef.current?.scrollWidth!);


                setClips([...clips, {mediaAssetId: item.filename, startTimeMs: 4000, endTimeMs: 6000}]);
            },
            // TODO: any
            collect: (monitor: DropTargetMonitor) => ({
                isOver: !!monitor.isOver(),
                canDrop: !!monitor.canDrop()
            })
        })
    );*/
    const { setNodeRef } = useDroppable({ id: 'droppable' });

    return (
        <Card onScroll={() => console.log('a')} className="p-4">
            <CardHeader>
                <CardTitle>Videotijdlijn</CardTitle>
            </CardHeader>

            <CardContent>
    <ToggleGroup type="single">
      <ToggleGroupItem value="bold" aria-label="Toggle horizontal moving">
        <MoveHorizontal className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle cutting"> {/* cursor-col-resize */}
        <Scissors className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <Scissors className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
            <ScrollArea className="w-full relative whitespace-nowrap">
                <div className="h-32 w-full relative flex flex-col gap-2 divide-y">
                    <div className="h-4 w-full">
                        {[...Array(timecodeSpanCount)].map((_, i) => (
                            <span style={{left: i === 0 ? '0%' : msToPercentage(maxClipEndMs / 5 * i)}} className="absolute text-sm text-muted-foreground select-none" key={i}>
                                {msToTimestampStr(maxClipEndMs / 5 * i)}
                            </span>
                        ))}
                    </div>


                    <div style={{containerType: 'inline-size'}} className="relative h-full" ref={setNodeRef}>
                        {children}
                {/*clips.map(clip => (
                   <TimelineClip key={clip.mediaAssetId} clip={clip} />
                ))*/}
                    </div>
                </div>

                <ScrollBar className="w-33" orientation="horizontal" />
            </ScrollArea>
            </CardContent>
        </Card>
    )
}

export default VideoTimeline
