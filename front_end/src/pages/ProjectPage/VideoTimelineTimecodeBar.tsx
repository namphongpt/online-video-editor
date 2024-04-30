import { msToTimecodeStr } from '@/lib/utils';
import { useState } from 'react';

interface VideoTimelineTimecodeBarProps {
    msPerScreenWidth: number;
    totalDurationMs: number;
};

const VideoTimelineTimecodeBar = ({
    msPerScreenWidth,
    totalDurationMs
}: VideoTimelineTimecodeBarProps): JSX.Element => {
    const [ timecodesPerWidth, setTimecodesPerWidth ] = useState(5);
    const totalTimecodeCount = Math.ceil(
        timecodesPerWidth * totalDurationMs / msPerScreenWidth
    );

    const doubleTimecodes = () => setTimecodesPerWidth(timecodesPerWidth * 2);
    const halveTimecodes = () => setTimecodesPerWidth(timecodesPerWidth / 2);

    // Calculate the percentage offset for a given `ms` relative to the total
    // number of milliseconds displayed.
    const msToPercentage =
        (ms: number) => `calc(${ms / totalDurationMs * 100}%)`;

    return (
        <div
            className='h-4 w-full'
            onMouseEnter={doubleTimecodes}
            onMouseLeave={halveTimecodes}
        >
            {[...Array(totalTimecodeCount)].map((_, i) => (
                <span
                    style={{
                        left: i === 0
                              ? '0%'
                              : msToPercentage(totalDurationMs / timecodesPerWidth * i)
                    }}
                    className='absolute text-sm text-muted-foreground select-none'
                    key={i} /* TODO: is this correct when doubling/halving? */
                >
                    {msToTimecodeStr(totalDurationMs / timecodesPerWidth * i)}
                </span>
            ))}
        </div>
    );
};

export default VideoTimelineTimecodeBar;
