import { NodeProps, NodeResizeControl } from '@xyflow/react';
import { FC, useState, useEffect } from 'react';
import { ResizeIcon } from '../resizeCustom/ResizeCustom';
import { ModalEditLabel } from '../modal/ModalEditLabel';

interface LabelProps extends NodeProps {
  selected?: boolean;
  onChangeLabel?: (newLabel: string) => void; // Mantenha essa propriedade se você precisar dela
}

export const Label: FC<LabelProps> = ({
  selected = false,
  data,
  onChangeLabel,
}) => {
  const [textValueModalLabel, setTextValueModalLabel] =
    useState('Texto Exemplo');
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [bold, setBold] = useState<
    | 'font-light'
    | 'font-normal'
    | 'font-semibold'
    | 'font-bold'
    | 'font-extrabold'
  >('font-normal');
  const [fontSize, setFontSize] = useState<number>(16);
  const [color, setColor] = useState<string>('black');

  const [showOnMouseEnter, setShowOnMouseEnter] = useState(false);
  const textareaValue =
    typeof data?.label === 'string' ? data.label : 'Escreva aqui';

  const [textvalue, setTextValue] = useState(textareaValue);

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
      data.label = newValue;
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
        <ModalEditLabel
          bold={bold}
          italic={italic}
          underline={underline}
          fontSize={fontSize}
          setFontSize={setFontSize}
          textValueModalLabel={textValueModalLabel}
          setBold={setBold}
          setItalic={setItalic}
          setUnderline={setUnderline}
          setTextValueModalLabel={setTextValueModalLabel}
          color={color}
          setColor={setColor}
        />
      )}
    </div>
  );
};

export default Label;
