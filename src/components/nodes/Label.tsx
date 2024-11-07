import { NodeProps, NodeResizeControl } from '@xyflow/react';
import { FC, useState, useEffect } from 'react';
import { ResizeIcon } from '../resizeCustom/ResizeCustom';

interface LabelProps extends NodeProps {
  selected?: boolean;
  onChangeLabel?: (newLabel: string) => void; // Mantenha essa propriedade se você precisar dela
}

export const Label: FC<LabelProps> = ({
  selected = false,
  data,
  onChangeLabel,
}) => {
  const [showOnMouseEnter, setShowOnMouseEnter] = useState(false);
  const textareaValue =
    typeof data?.label === 'string' ? data.label : 'Escreva aqui';

  const [textvalue, setTextValue] = useState(textareaValue);

  // Atualiza textvalue quando data.label muda
  useEffect(() => {
    setTextValue(textareaValue);
  }, [data?.label, textareaValue]); // Dependência para atualizar quando data.label mudar

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
        className={`w-full h-full max-h-full py-2 px-3 text-center rounded-md resize-none overflow-hidden focus:outline-none focus:ring-none bg-transparent break-words placeholder-gray-300`}
        rows={1}
        placeholder="Escreva aqui" // Adiciona placeholder para ajudar o usuário
      />
    </div>
  );
};

export default Label;