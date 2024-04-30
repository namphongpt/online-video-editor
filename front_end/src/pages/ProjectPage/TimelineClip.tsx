import { Clip } from './VideoTimeline';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';

interface TimelineClipProps {
    clip: Clip;
    timelineLengthMs: number;
};

const TimelineClip = ({ clip, timelineLengthMs }: TimelineClipProps): JSX.Element => {
    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <div
                    key={clip.mediaAsset.filename}
                    style={{
                        transform: `translateX(${clip.startTimeMs / timelineLengthMs * 100}cqw)`,
                        width: `${(clip.offsetEndMs - clip.offsetStartMs) / timelineLengthMs * 100}%`
                    }}
                    className='h-24 bg-primary rounded-md cursor-grab absolute shrink-0'
                />
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem>Kopiëren</ContextMenuItem>
                <ContextMenuItem>Knippen</ContextMenuItem>
                <ContextMenuItem>Verwijderen</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
};

export default TimelineClip;
