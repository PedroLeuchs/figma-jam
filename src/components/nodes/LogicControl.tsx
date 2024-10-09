import { FC, useState } from 'react';
import { Handle, NodeProps, NodeResizer, Position } from '@xyflow/react';
import * as Toolbar from '@radix-ui/react-toolbar';
import { FaExchangeAlt } from 'react-icons/fa';

interface LogicControlProps extends NodeProps {
  type: string;
}
const LogicControl: FC<LogicControlProps> = ({ selected = false }) => {
  const [showOnMouseEnter, setShowOnMouseEnter] = useState(false);
  const [operator, setOperator] = useState(true);

  return (
    <div
      onMouseEnter={() => setShowOnMouseEnter(true)}
      onMouseLeave={() => setShowOnMouseEnter(false)}
      className={`w-full h-full min-w-[100px] ${
        operator
          ? 'border-t-8 border-b-8 border-gray-700 min-h-[20px] max-h-[20px]'
          : 'bg-black min-h-[6px] max-h-[6px]'
      } `}
    >
      <NodeResizer
        minHeight={operator ? 20 : 6}
        minWidth={100}
        maxHeight={operator ? 20 : 6}
        isVisible={selected}
        lineClassName="!border-blue-400"
        handleClassName="!w-2 !h-2 !border-2 !rounded !border-blue-400 !bg-white"
      />

      <Handle
        type="source"
        id="aTop"
        position={Position.Top}
        className={`handle handle-top left-[10%] ${
          showOnMouseEnter ? 'opacity-1' : 'opacity-0'
        }`}
      />
      <Handle
        type="source"
        id="cTop"
        position={Position.Top}
        className={`handle handle-top left-[90%] ${
          showOnMouseEnter ? 'opacity-1' : 'opacity-0'
        }`}
      />
      <Handle
        type="source"
        id="bTop"
        position={Position.Top}
        className={`handle handle-top left-1/2 ${
          showOnMouseEnter ? 'opacity-1' : 'opacity-0'
        }`}
      />
      <Handle
        type="source"
        id="aBottom"
        position={Position.Bottom}
        className={`handle handle-bottom left-[10%] ${
          showOnMouseEnter ? 'opacity-1' : 'opacity-0'
        }`}
      />
      <Handle
        type="source"
        id="cBottom"
        position={Position.Bottom}
        className={`handle handle-bottom left-[90%] ${
          showOnMouseEnter ? 'opacity-1' : 'opacity-0'
        }`}
      />
      <Handle
        type="source"
        id="bBottom"
        position={Position.Bottom}
        className={`handle handle-bottom left-1/2 ${
          showOnMouseEnter ? 'opacity-1' : 'opacity-0'
        }`}
      />
      {operator ? (
        <div className="border-b-4 border-t-4 border-black fixed top-1/2 -translate-y-1/2 -right-7 w-5 h-3"></div>
      ) : (
        <div className="bg-black fixed top-1/2 -translate-y-1/2 -right-7 w-5 h-1"></div>
      )}
      {selected && (
        <Toolbar.Root asChild>
          <div className="w-full h-full flex items-center justify-center">
            <Toolbar.Button
              className={`fixed -left-10 rounded-full bg-white border border-gray-500 hover:border-gray-600 hover:bg-gray-200 p-2 transition-colors duration-200`}
              onClick={() => {
                setOperator(!operator);
              }}
            >
              <FaExchangeAlt />
            </Toolbar.Button>
          </div>
        </Toolbar.Root>
      )}
    </div>
  );
};

export default LogicControl;
//condição
