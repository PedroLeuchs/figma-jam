import { NodeProps, NodeResizeControl } from '@xyflow/react';
import { FC, useEffect, useState } from 'react';
import { ResizeIcon } from '../resizeCustom/ResizeCustom';

interface SeparatorProps extends NodeProps {
  selected?: boolean;
  data: {
    label: string;
  };
}

export const Separator: FC<SeparatorProps> = ({ selected = false, data }) => {
  const [label, setLabel] = useState(data.label);
  const [showOnMouseEnter, setShowOnMouseEnter] = useState(false);
  useEffect(() => {
    // Seleciona a div com a classe 'react-flow__node'
    const nodeDiv = document.querySelector(
      '.react-flow__node-separator'
    ) as HTMLElement;
    if (nodeDiv) {
      nodeDiv.style.zIndex = '-1'; // Define o z-index desejado
    }
  }, [selected]);

  return (
    <div
      onMouseEnter={() => setShowOnMouseEnter(true)}
      onMouseLeave={() => setShowOnMouseEnter(false)}
      className={`min-h-[100px] min-w-[100px] h-full w-full flex flex-col items-center justify-start p-2 border border-black dark:border-white relative ${
        selected ? '!z-[-1]' : '!z-[-1]'
      } `}
    >
      {(selected || showOnMouseEnter) && (
        <NodeResizeControl
          minHeight={100}
          minWidth={100}
          style={{ background: 'transparent', border: 'none' }}
        >
          <ResizeIcon />
        </NodeResizeControl>
      )}
      <input
        className="text-3xl font-bold text-center"
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />
    </div>
  );
};

export default Separator;
