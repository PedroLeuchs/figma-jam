import { FC, useEffect, useState } from 'react';
import { NodeProps, Handle, Position, NodeResizeControl } from '@xyflow/react';
import { ResizeIcon } from '../resizeCustom/ResizeCustom';
import { FiMove } from 'react-icons/fi';

interface CircleProps extends NodeProps {
  data: {
    label: string;
    machine: { id: string; label: string }[];
    color?: string;
    fontColor?: string;
  };
}

export const Circle: FC<CircleProps> = ({ data, selected = false }) => {
  const [currentColor, setCurrentColor] = useState(data.color || 'bg-gray-200');
  const [currentFontColor, setCurrentFontColor] = useState(
    data.fontColor || 'text-black'
  );
  const [textareaValue, setTextareaValue] = useState(
    data?.label || 'Escreva aqui'
  );

  const [showOnMouseEnter, setShowOnMouseEnter] = useState(false);

  if (data.label !== textareaValue) {
    setTextareaValue(data.label);
  }
  if (data.color != currentColor) {
    if (data.color) {
      setCurrentColor(data.color);
    }
  }
  if (data.fontColor != currentFontColor) {
    if (data.fontColor) {
      setCurrentFontColor(data.fontColor);
    }
  }

  useEffect(() => {
    if (window.innerWidth < 768) {
      setShowOnMouseEnter(true);
    }
  }, [selected, showOnMouseEnter]);

  return (
    <div
      onMouseEnter={() => setShowOnMouseEnter(true)}
      onMouseLeave={() => setShowOnMouseEnter(false)}
      className={`${currentColor} drop-shadow-lg shadow-black !min-w-[100px] min-h-[100px] w-auto h-full flex items-center justify-center rounded-full border border-gray-600 flex-col`}
    >
      {(selected || showOnMouseEnter) && (
        <NodeResizeControl
          minHeight={50}
          minWidth={50}
          style={{ background: 'transparent', border: 'none' }}
        >
          <ResizeIcon />
        </NodeResizeControl>
      )}
      <Handle
        type="source"
        id="top"
        position={Position.Top}
        className={`handle handle-top ${
          showOnMouseEnter ? 'opacity-1' : 'opacity-0'
        }`}
      />
      <Handle
        type="source"
        id="bottom"
        position={Position.Bottom}
        className={`handle handle-bottom ${
          showOnMouseEnter ? 'opacity-1' : 'opacity-0'
        }`}
      />

      <textarea
        className={`${currentFontColor} w-[100px] max-w-full min-h-[40px] max-h-[200px] py-2 px-3 text-center rounded-md resize-none overflow-hidden focus:outline-none focus:ring-none bg-transparent placeholder-gray-300`}
        rows={1}
        value={`${textareaValue}`}
        onChange={(e) => setTextareaValue(e.target.value)}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = 'auto';
          target.style.height = `${target.scrollHeight}px`;
        }}
      />
      {(selected || showOnMouseEnter) && (
        <div className="absolute bottom-1 left-1">
          <FiMove className="drag-handle__custom rotate-45 text-2xl text-gray-600 hover:scale-125 transition-all duration-150" />
        </div>
      )}
    </div>
  );
};
