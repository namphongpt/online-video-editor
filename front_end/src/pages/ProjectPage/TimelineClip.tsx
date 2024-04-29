import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Clip } from "./VideoTimeline";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TimelineClipProps {
    clip: Clip;
    endTimeMs?: number;
    isHovering?: boolean
};

const TimelineClip = ({ clip, isHovering = false }: TimelineClipProps): JSX.Element => {
    const endTimeMs = 20_000; // TODO: change

    return (
        <Popover>
                        <PopoverTrigger asChild>
                            <div
                                key={clip.mediaAsset.filename}
                                style={endTimeMs === undefined ? undefined : {
                                    transform: `translateX(${clip.startTimeMs / endTimeMs * 100}cqw)`,
                                    width: `${(clip.offsetEndMs - clip.offsetStartMs) / endTimeMs * 100}%`
                                }}
                                className="h-24 bg-slate-950 rounded-md cursor-grab absolute shrink-0">
                               
                            </div>
                        </PopoverTrigger>
                        <PopoverContent>
                        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimensions</h4>
            <p className="text-sm text-muted-foreground">
              Set the dimensions for the layer.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                defaultValue="100%"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Max. width</Label>
              <Input
                id="maxWidth"
                defaultValue="300px"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                defaultValue="25px"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxHeight">Max. height</Label>
              <Input
                id="maxHeight"
                defaultValue="none"
                className="col-span-2 h-8"
              />
            </div>
          </div>
        </div>
                        </PopoverContent>
                    </Popover>
    )   
};

export default TimelineClip;
