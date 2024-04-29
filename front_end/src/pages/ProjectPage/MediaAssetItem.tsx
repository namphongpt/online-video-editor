import { MediaAsset } from "@/interfaces/mediaAsset";
import { DragOverlay, useDraggable } from "@dnd-kit/core";
import TimelineClip from "./TimelineClip";
import { DragState } from "../ProjectPage";
import { forwardRef } from "react";

interface BareItemProps {
    mediaAsset: MediaAsset,
    style: any,
    [x: string]: any
};

interface MediaAssetItemProps {
    mediaAsset: MediaAsset,
    dragState: DragState,
};

const BareItem = forwardRef((props: any, ref: any) => {//({ mediaAsset, style, ...props }: BareItemProps): JSX.Element => {
    return (
        <div
            //style={style}
            style={{cursor: 'grab !important'}}
            ref={ref}
            {...props}
            className={"w-40 h-10 bg-slate-200 rounded-md text-center flex flex-col justify-center cursor-grab select-none " + props.className ?? ""}
        >
            <span>{ props.mediaAsset.filename }</span>
        </div>
    );
});

const MediaAssetItem = ({ mediaAsset, dragState }: MediaAssetItemProps): JSX.Element => {
    /*const [{ isDragging }, drag] = useDrag(() => ({
      type: 'media-asset',
      item: mediaAsset,
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: !!monitor.isDragging()
      })
    }));*/
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: 'media-asset',
        data: mediaAsset
    });
    //const style = transform ? {
    //    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    //    zIndex: 9999,
    //} : undefined;
    const style = undefined;

    return (
        <>
            {/*<div ref={setNodeRef}
                 style={style}
                 {...listeners}
                 {...attributes}
    >*/}
                <BareItem mediaAsset={mediaAsset} ref={setNodeRef} {...listeners} {...attributes} />
            {/*</div>*/}

            <DragOverlay className="cursor-grabbing">
                {<BareItem style={dragState === 'inside' ? {visibility: 'hidden'} : undefined} className="cursor-grabbing -skew-y-3 drop-shadow-lg " mediaAsset={mediaAsset} />}
                {/*<TimelineClip clip={{mediaAssetId: mediaAsset.filename, startTimeMs: 0, endTimeMs: mediaAsset.durationMs}} />*/}
            </DragOverlay>
        </>
    )
};

export default MediaAssetItem;
