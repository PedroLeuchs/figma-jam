import { FC, useEffect, useState } from 'react';
import { NodeProps, NodeResizeControl } from '@xyflow/react';
import { ResizeIcon } from '../resizeCustom/ResizeCustom';

interface UnitPhase {
  Unidade: string;
  Fases: string[];
}
interface GroupProps extends NodeProps {
  data: {
    label: string;
    unitphases: UnitPhase[];
    canSettings?: boolean;
    color?: string;
    fontColor?: string;
  };
  selected?: boolean;
  parentId?: string;
  updateNodeLabel?: (id: string, label: string) => void;
}

export const Group: FC<GroupProps> = ({ data, selected = false }) => {
  const [currentColor, setCurrentColor] = useState(data.color || 'bg-cyan-100');
  const [currentFontColor, setCurrentFontColor] = useState(
    data.fontColor || 'text-black'
  );
  const [textValue, setTextValue] = useState(data.label || 'Misturador');
  const [showOnMouseEnter, setShowOnMouseEnter] = useState(false);

  

  if (data.label !== textValue && data.label != '') {
    setTextValue(data.label);
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
      className={`${currentColor} bg-opacity-50 fixed -z-50 w-full h-full min-w-[200px] min-h-[200px]  rounded-lg shadow-md`}
    >
      {(selected || showOnMouseEnter) && (
        <NodeResizeControl
          minHeight={200}
          minWidth={200}
          style={{ background: 'transparent', border: 'none' }}
        >
          <ResizeIcon />
        </NodeResizeControl>
      )}
      <div
        className={`${currentFontColor} opacity-100 p-2 text-center font-semibold text-xl`}
      >
        {textValue}
      </div>
    </div>
  );
};
