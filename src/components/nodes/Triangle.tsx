import { FC, useEffect, useState } from 'react';
import { NodeProps, Handle, Position } from '@xyflow/react';

interface TriangleProps extends NodeProps {
  direction?: true | false;
}

export const Triangle: FC<TriangleProps> = ({ data }) => {
  const [showOnMouseEnter, setShowOnMouseEnter] = useState(false);
  const directionSet = data.direction;

  useEffect(() => {
    if (window.innerWidth < 768) {
      setShowOnMouseEnter(true);
    }
  }, [showOnMouseEnter]);

  return (
    <div
      onMouseEnter={() => setShowOnMouseEnter(true)}
      onMouseLeave={() => setShowOnMouseEnter(false)}
      className={`w-full h-full min-w-[100px] min-h-[100px] drop-shadow-lg shadow-black ${
        directionSet === true
          ? 'border-l-[50px] border-r-[50px] border-b-[100px] border-b-gray-800 border-l-transparent border-r-transparent'
          : 'border-l-[50px] border-r-[50px] border-t-[100px] border-t-gray-800 border-l-transparent border-r-transparent'
      }`}
    >
      {directionSet === true ? (
        <Handle
          type="source"
          id="top"
          position={Position.Top}
          className={`handle absolute ${
            directionSet === true ? '-top-2' : '-top-28'
          } ${showOnMouseEnter ? 'opacity-1' : 'opacity-0'}`}
        />
      ) : (
        <Handle
          type="source"
          id="bottom"
          position={Position.Bottom}
          className={`handle absolute ${
            directionSet === true ? '-bottom-28' : '-bottom-2'
          } ${showOnMouseEnter ? 'opacity-1' : 'opacity-0'}`}
        />
      )}
    </div>
  );
};

export default Triangle;
