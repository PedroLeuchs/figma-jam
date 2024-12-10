import { NodeProps, NodeResizeControl } from '@xyflow/react';
import { FC, useState, useEffect } from 'react';
import { ResizeIcon } from '../resizeCustom/ResizeCustom';
import { FiMove } from 'react-icons/fi';

interface dataProps {
  label?: string;
  italic?: boolean;
  underline?: boolean;
  bold?:
    | 'font-light'
    | 'font-normal'
    | 'font-semibold'
    | 'font-bold'
    | 'font-extrabold';
  fontSize?: number;
  color?: string;
}

interface LabelProps extends Omit<NodeProps, 'data'> {
  selected?: boolean;
  onChangeLabel?: (newLabel: string) => void;
  data?: dataProps;
}

export const Label: FC<LabelProps> = ({
  selected = false,
  data,
  onChangeLabel,
}) => {
  const [italic, setItalic] = useState(data?.italic || false);
  const [underline, setUnderline] = useState(data?.underline || false);
  const [bold, setBold] = useState<
    | 'font-light'
    | 'font-normal'
    | 'font-semibold'
    | 'font-bold'
    | 'font-extrabold'
  >(data?.bold || 'font-normal');
  const [fontSize, setFontSize] = useState<number>(data?.fontSize || 16);
  const [color, setColor] = useState<string>(data?.color || 'black');

  const [showOnMouseEnter, setShowOnMouseEnter] = useState(false);
  const textareaValue =
    typeof data?.label === 'string' ? data.label : 'Escreva aqui';

  const [textvalue, setTextValue] = useState(textareaValue);

  useEffect(() => {
    setItalic(data?.italic || false);
    setUnderline(data?.underline || false);
    setBold(data?.bold || 'font-normal');
    setFontSize(data?.fontSize || 16);
    setColor(data?.color || 'black');
  }, [data]);

  // Atualiza textvalue quando data.label muda
  useEffect(() => {
    setTextValue(textareaValue);
  }, [data?.label, textareaValue]); // Dependência para atualizar quando data.label mudar

  useEffect(() => {
    if (window.innerWidth < 768) {
      setShowOnMouseEnter(true);
    }
  }, [selected, showOnMouseEnter]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setTextValue(newValue);
    if (onChangeLabel) {
      onChangeLabel(newValue);
      if (data) {
        data.label = newValue;
      }
    }
  };

  return (
    <div
      onMouseEnter={() => setShowOnMouseEnter(true)}
      onMouseLeave={() => setShowOnMouseEnter(false)}
      className={`min-h-[50px] min-w-[100px] h-full w-full flex flex-col items-center justify-start p-2`}
    >
      {(selected || showOnMouseEnter) && (
        <NodeResizeControl
          minHeight={50}
          minWidth={200}
          style={{ background: 'transparent', border: 'none' }}
        >
          <ResizeIcon />
        </NodeResizeControl>
      )}
      <textarea
        value={textvalue}
        onChange={handleChange}
        className={`w-full h-full max-h-full py-2 px-3 text-center rounded-md resize-none overflow-hidden focus:outline-none focus:ring-none bg-transparent break-words placeholder-gray-300
          ${italic ? 'italic' : 'not-italic'} ${
          underline ? 'underline' : 'no-underline'
        } ${bold} text-center underline-offset-2
          `}
        style={{ fontSize: `${fontSize}px`, color: color }}
        rows={1}
        placeholder="Escreva aqui" // Adiciona placeholder para ajudar o usuário
      />
      {(selected || showOnMouseEnter) && (
        <div className="absolute bottom-1 left-1">
          <FiMove className="drag-handle__custom rotate-45 text-2xl text-gray-600 hover:scale-125 transition-all duration-150" />
        </div>
      )}
    </div>
  );
};

export default Label;
