import { FC, useState } from 'react';
import { NodeProps, Handle, Position } from '@xyflow/react';

interface TriangleProps extends NodeProps {
  direction?: 'up' | 'down'; 
}

export const Triangle: FC<TriangleProps> = ({
  data,
  direction = data.direction || 'down', 
}) => {
    const [showOnMouseEnter, setShowOnMouseEnter] = useState(false);


  return (
    <div
    onMouseEnter={() => setShowOnMouseEnter(true)}
    onMouseLeave={() => setShowOnMouseEnter(false)}
      className={`w-full h-full min-w-[100px] min-h-[100px] drop-shadow-lg shadow-black ${
        direction === 'up'
          ? 'border-l-[50px] border-r-[50px] border-b-[100px] border-b-gray-500'
          : 'border-l-[50px] border-r-[50px] border-t-[100px] border-t-gray-500'
      }`}
      style={{ borderColor: direction === 'up' ? 'transparent transparent gray transparent' : 'gray transparent transparent transparent' }}
    >
      {/* <NodeResizer
        minHeight={100}
        minWidth={100}
        isVisible={selected}
        lineClassName="!border-blue-400"
        handleClassName="!w-2 !h-2 !border-2 !rounded !border-blue-400 !bg-white"
      /> */}
        <Handle type="source" id="top" position={Position.Top} className={`handle absolute ${direction === 'up'? "-top-2" : "-top-28"} ${showOnMouseEnter ? "opacity-1" : "opacity-0"}`} />
        <Handle type="source" id="bottom" position={Position.Bottom} className={`handle absolute ${direction === 'up'? "-bottom-28" : "-bottom-2"} ${showOnMouseEnter ? "opacity-1" : "opacity-0"}`} />
     </div>
  );
};

export default Triangle;
