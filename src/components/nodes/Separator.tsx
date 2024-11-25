import { NodeProps, NodeResizeControl } from '@xyflow/react';
import { FC, useEffect, useState } from 'react';
import { ResizeIcon } from '../resizeCustom/ResizeCustom';
import { Modal } from '../modal/Modal';
import BackgroundPicker from '../colorPicker/BackgroundPicker';
import FontePicker from '../colorPicker/FontePicker';

interface SeparatorProps extends NodeProps {
  selected?: boolean;
  data: {
    label: string;
    color?: string;
    fontColor?: string;
  };
}

export const Separator: FC<SeparatorProps> = ({ selected = false, data }) => {
  const [tempFontColor, setTempFontColor] = useState(data.fontColor);
  const [tempColor, setTempColor] = useState(data.color);
  const [currentColor, setCurrentColor] = useState(data.color);
  const [currentFontColor, setCurrentFontColor] = useState(data.fontColor);
  const [textValue, setTextValue] = useState(data.label);
  const [tempTextValue, setTempTextValue] = useState(data.label);
  const [lineHeight, setLineHeight] = useState('border-2');
  const [tempLineHeight, setTempLineHeight] = useState('border-2');
  const [showOnMouseEnter, setShowOnMouseEnter] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setShowOnMouseEnter(true);
    }
  }, [selected, showOnMouseEnter]);

  const handleColorChange = (color: string) => {
    setTempColor(color); // Atualiza a cor temporariamente
  };

  const handleFontColorChange = (color: string) => {
    setTempFontColor(color); // Atualiza a cor da fonte temporariamente
  };

  const handleSave = () => {
    setTextValue(tempTextValue);
    setCurrentColor(tempColor);
    setCurrentFontColor(tempFontColor);
    setLineHeight(tempLineHeight);


    data.label = tempTextValue;
  };

  const handleCancel = () => {
    setTempTextValue(data?.label || 'Escreva aqui');
    setTempFontColor(''); // Atualiza a cor da fonte temporariamente
    setTempColor(''); // Atualiza a cor temporariamente
  };

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
      className={`min-h-[100px] min-w-[100px] h-full w-full flex flex-col items-center justify-start p-2 ${lineHeight} ${currentColor} ${currentFontColor} dark:border-white relative ${
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
        disabled={true}
        className="text-3xl font-bold text-center select-none"
        type="text"
        value={textValue}
      />
      {selected && (
        <Modal
          components={[
            {
              Component: FontePicker,
              props: {
                onColorChange: handleFontColorChange,
                setShowColorPicker: () => {}, // Não precisa do setShowColorPicker aqui
              },
              id: '',
            },
            {
              Component: BackgroundPicker,
              props: {
                onColorChange: handleColorChange,
                setShowColorPicker: () => {},
                isSeparator: true,
              },
              id: '',
            },
          ]}
          isSeparator={true}
          textValue={tempTextValue}
          setTempLineHeight={setTempLineHeight}
          onTextChange={setTempTextValue}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default Separator;
