import { MediaAsset } from '@/interfaces/mediaAsset';
import { useDraggable } from '@dnd-kit/core';
import { DragState } from '../ProjectPage';
import { CSSProperties, forwardRef } from 'react';

interface BareItemProps {
    mediaAsset: MediaAsset;
    className?: string;
    [additionalProps: string]: any;
};

interface MediaAssetItemProps {
    mediaAsset: MediaAsset;
    dragState: DragState;
};

const BareItem = forwardRef<HTMLDivElement, BareItemProps>(
    ({ mediaAsset, className,  ...additionalProps }, ref) => {
        return (
            <div
                ref={ref}
                {...additionalProps}
                className={
                    'w-40 h-10 bg-primary rounded-md text-center flex flex-col opacity-100 justify-center cursor-grab select-none '
                    + className ?? ''
                }
            >
                <span className='text-primary-foreground'>
                    { mediaAsset.filename }
                </span>
            </div>
        );
    }
);

const MediaAssetItem = ({ mediaAsset, dragState }: MediaAssetItemProps): JSX.Element => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `media-asset-${mediaAsset.filename}`, // TODO: replace with ID
        data: mediaAsset
    });

    const style: CSSProperties | undefined =
        isDragging
        ? {
            position: 'relative', // absolute
            boxShadow: '5px 5px 5px rgba(255, 255, 255, 0.2)',
            cursor: 'grabbing',

            // By using 3D transforms, there are no jagged edges.
            transformStyle: 'preserve-3d',
            transform: `translate3d(${transform?.x}px, ${transform?.y}px, 0) rotateZ(-6deg)`,

            // When the <MediaAssetItem> is dragged onto the timeline, we
            // don't want to show it anymore, since it will be replaced with
            // a <TimelineClip> preview.
            visibility: dragState === 'inside' ? 'hidden' : undefined,
        }
        : { cursor: 'grab' };

    return (
        <div className="relative">
            <BareItem
                ref={setNodeRef}
                style={style}
                className={
                    isDragging
                    ? 'drop-shadow-[5px_5px_5px_rgba(255, 255, 255, 0.2)] z-50'
                    : undefined
                }
                {...listeners}
                {...attributes}
                mediaAsset={mediaAsset}
            />

            {/* We want a copy-on-drag behavior, so we show a new <BareItem> on its
                original place whenever it is being dragged. */}
            {isDragging && <BareItem style={{position: 'absolute', top: 0, left: 0}} mediaAsset={mediaAsset} />}
        </div>
    );
};

export default MediaAssetItem;
