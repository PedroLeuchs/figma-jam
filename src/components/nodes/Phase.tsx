import { FC, useEffect, useState } from 'react';
import { NodeProps, Handle, Position, NodeResizeControl } from '@xyflow/react';
import { ResizeIconWhite2 } from '../resizeCustom/ResizeCustom';

interface PhaseProps extends NodeProps {
  data: {
    label: string;
    color?: string;
    fontColor?: string;
  };
}

const Phase: FC<PhaseProps> = ({ data, selected = false }) => {
  const [currentColor, setCurrentColor] = useState(data.color || 'bg-cyan-700');
  const [currentFontColor, setCurrentFontColor] = useState(
    data.fontColor || 'text-white'
  );
  const [textareaValue, setTextareaValue] = useState(
    data?.label || 'Phase nova'
  );

  const [showOnMouseEnter, setShowOnMouseEnter] = useState(false);

  if (data.label !== textareaValue) {
    if (data.label) {
      setTextareaValue(data.label);
    } else {
      data.label = textareaValue;
      setTextareaValue(textareaValue);
    }
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
      className={`${currentColor}  rounded w-full h-full min-w-[200px] min-h-[50px] flex flex-col items-center justify-center shadow-lg shadow-black/30 border border-gray-500`}
    >
      {(selected || showOnMouseEnter) && (
        <NodeResizeControl
          minHeight={50}
          minWidth={200}
          style={{ background: 'transparent', border: 'none' }}
        >
          <ResizeIconWhite2 />
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
        className={`${currentFontColor} w-full h-full max-h-full py-2 px-3 text-center rounded-md resize-none overflow-hidden focus:outline-none focus:ring-none bg-transparent break-words placeholder-gray-300`}
        rows={1}
        value={`${textareaValue}`}
        onChange={(e) => setTextareaValue(e.target.value)}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = 'auto';
          target.style.height = `${target.scrollHeight}px`;
        }}
      />
    </div>
  );
};

export default Phase;
