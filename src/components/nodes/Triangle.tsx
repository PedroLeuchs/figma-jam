import { FC, useState } from 'react';
import { NodeProps, Handle, Position } from '@xyflow/react';
import { FaExchangeAlt } from 'react-icons/fa';
import * as Toolbar from '@radix-ui/react-toolbar';

interface TriangleProps extends NodeProps {
  direction?: true | false;
}

export const Triangle: FC<TriangleProps> = ({
  data,
  direction = data.direction || false,
  selected,
}) => {
  const [showOnMouseEnter, setShowOnMouseEnter] = useState(false);
  const [directionSet, setDirectionSet] = useState(direction);

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
      {selected && (
        <Toolbar.Root asChild>
          <div className="w-full h-full flex items-center justify-center">
            <Toolbar.Button
              className={`fixed ${
                directionSet ? 'translate-y-[190%]' : '-translate-y-[190%]'
              } rounded-full bg-white border border-gray-500 hover:border-gray-600 hover:bg-gray-200 p-2 transition-colors duration-200`}
              onClick={() => {
                setDirectionSet(!directionSet);
              }}
            >
              <FaExchangeAlt />
            </Toolbar.Button>
          </div>
        </Toolbar.Root>
      )}
      <Handle
        type="source"
        id="top"
        position={Position.Top}
        className={`handle absolute ${
          directionSet === true ? '-top-2' : '-top-28'
        } ${showOnMouseEnter ? 'opacity-1' : 'opacity-0'}`}
      />
      <Handle
        type="source"
        id="bottom"
        position={Position.Bottom}
        className={`handle absolute ${
          directionSet === true ? '-bottom-28' : '-bottom-2'
        } ${showOnMouseEnter ? 'opacity-1' : 'opacity-0'}`}
      />
    </div>
  );
};

export default Triangle;
