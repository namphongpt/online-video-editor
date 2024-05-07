import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { MediaAsset } from '@/interfaces/mediaAsset';
import { useDroppable } from '@dnd-kit/core';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { MoveHorizontal, Scissors } from 'lucide-react';
import VideoTimelineTimecodeBar from './VideoTimelineTimecodeBar';

//export interface Clip {
//    mediaAsset: MediaAsset;
//    /** At what ms the {@link MediaAsset} should start playing. Starts at the
//      * beginning of the original {@link MediaAsset} when set to `0`.
//      */
//    offsetStartMs: number;
//    /**
//     * Until what ms the {@link MediaAsset} should keep playing. This clip will
//     * play to the end of the {@link MediaAsset} when it is equal to its
//     * `durationMs` field.
//     */
//    offsetEndMs: number;
//    /**
//     * At what time in the final video this `Clip` should be played.
//     */
//    startTimeMs: number;
//};

interface VideoTimelineProps {
    children: React.ReactNode;
    lengthMs: number;
};

const VideoTimeline = ({ children, lengthMs }: VideoTimelineProps): JSX.Element => {
    const msPerScreenWidth = 20_000;

    const { setNodeRef } = useDroppable({ id: 'timeline' });

    return (
        <Card className='p-4'>
            <CardHeader>
                <CardTitle>Videotijdlijn</CardTitle>
            </CardHeader>

            <CardContent>
                <ToggleGroup type='single' defaultValue='horizontal-moving'>
                    <ToggleGroupItem value='horizontal-moving' aria-label='Toggle horizontal moving'>
                        <MoveHorizontal className='h-4 w-4' />
                    </ToggleGroupItem>
                    <ToggleGroupItem value='cutting' aria-label='Toggle cutting'> {/* cursor-col-resize */}
                        <Scissors className='h-4 w-4' />
                    </ToggleGroupItem>
                </ToggleGroup>

                <ScrollArea className='w-full relative whitespace-nowrap'>
                    <div className='h-32 w-full relative flex flex-col gap-2 divide-y'>
                        <VideoTimelineTimecodeBar
                            totalDurationMs={lengthMs}
                            msPerScreenWidth={msPerScreenWidth}
                        />

                        <div
                            style={{containerType: 'inline-size'}}
                            className='relative h-full'
                            ref={setNodeRef}
                        >
                            {children}
                        </div>
                    </div>

                    <ScrollBar orientation='horizontal' />
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default VideoTimeline;
