import { NodeProps, NodeResizeControl } from '@xyflow/react';
import { FC, useEffect, useState } from 'react';
import { ResizeIcon } from '../resizeCustom/ResizeCustom';
import { FiMove } from 'react-icons/fi';

interface SeparatorProps extends NodeProps {
  selected?: boolean;
  data: {
    label: string;
    color?: string;
    lineHeight?: string;
    timestamp?: number;
  };
}

export const Separator: FC<SeparatorProps> = ({ selected = false, data }) => {
  const [currentColor, setCurrentColor] = useState(
    data.color || 'border-black'
  );
  const [textValue, setTextValue] = useState(data.label || 'Receita');
  const [lineHeight, setLineHeight] = useState(data.lineHeight || 'border-2');
  const [showOnMouseEnter, setShowOnMouseEnter] = useState(false);

  useEffect(() => {
    // Atualiza os estados quando `data` mudar
    setCurrentColor(data.color || 'border-black');
    setTextValue(data.label || 'Receita');
    setLineHeight(data.lineHeight || 'border-2');
  }, [data.timestamp, data]); // Dependência que aciona quando `data` muda

  useEffect(() => {
    if (window.innerWidth < 768) {
      setShowOnMouseEnter(true);
    }
  }, [selected]); // Removido showOnMouseEnter como dependência

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
      className={`min-h-[100px] min-w-[100px] h-full w-full flex flex-col items-center justify-start p-2 ${lineHeight} ${currentColor}  dark:border-white relative ${
        selected ? '!z-[-1]' : '!z-[-1]'
      }`}
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
        disabled={true}
        className="text-3xl font-bold text-center select-none"
        type="text"
        value={textValue}
      />
      {(selected || showOnMouseEnter) && (
        <div className="absolute bottom-1 left-1">
          <FiMove className="drag-handle__custom rotate-45 hover:scale-125 transition-all duration-150" />
        </div>
      )}
    </div>
  );
};

export default Separator;
