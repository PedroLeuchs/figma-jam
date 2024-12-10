import { FC, useEffect, useState } from 'react';
import { NodeProps, Handle, Position } from '@xyflow/react';
import { FiMove } from 'react-icons/fi';

interface TriangleProps extends NodeProps {
  direction?: true | false;
}

export const Triangle: FC<TriangleProps> = ({ data, selected = false }) => {
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
        {(selected || showOnMouseEnter) && (
        <div className={`absolute ${directionSet === true ? '-bottom-[124px] -translate-x-1/2' : '-top-[124px]  -translate-x-1/2'} `}>
          <FiMove className="drag-handle__custom rotate-45 text-2xl text-gray-600 hover:scale-125 transition-all duration-150" />
        </div>
      )}
    </div>
  );
};

export default Triangle;
