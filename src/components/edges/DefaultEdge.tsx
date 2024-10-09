import { EdgeProps } from '@xyflow/react';
import {getSmoothStepPath} from 'reactflow';

const DefaultEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {strokeWidth: 2, stroke: '#cecece'},
    markerEnd,
}: EdgeProps) => {

    const [edgePath] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });


    return (
        <>
        <path
            id={id}
            style={style}
            className="react-flow__edge-path border-4 border-sky-500"
            d={edgePath}
            markerEnd={markerEnd}
            />

        </>
    )
};

export default DefaultEdge;
