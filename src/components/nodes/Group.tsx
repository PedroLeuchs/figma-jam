import { FC, useEffect, useState } from 'react';
import { NodeProps, NodeResizeControl } from '@xyflow/react';
import { Modal } from '../modal/Modal';
import BackgroundPicker from '../colorPicker/BackgroundPicker';
import FontePicker from '../colorPicker/FontePicker';
import SelectComponent from '../select/Select';
import { ResizeIcon } from '../resizeCustom/ResizeCustom';

interface UnitPhase {
  Unidade: string;
  Fases: string[];
}
interface GroupProps extends NodeProps {
  id: string;
  data: { label: string; unitphases: UnitPhase[]; canSettings?: boolean };
  selected?: boolean;
  color?: string;
  fontColor?: string;
  parentId?: string;
  updateNodeLabel?: (id: string, label: string) => void;
}

export const Group: FC<GroupProps> = ({
  id,
  data,
  selected = false,
  color = 'bg-cyan-100',
  fontColor = 'text-black',
  updateNodeLabel = () => {},
}) => {
  const [tempFontColor, setTempFontColor] = useState(fontColor);
  const [tempColor, setTempColor] = useState(color);
  const [currentColor, setCurrentColor] = useState(color);
  const [currentFontColor, setCurrentFontColor] = useState(fontColor);
  const [textValue, setTextValue] = useState(data.label);
  const [tempTextValue, setTempTextValue] = useState(data.label);
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

  const handleUnitySelect = (unity: string) => {
    setTempTextValue(unity);
  };

  const handleSave = () => {
    setTextValue(tempTextValue);
    setCurrentColor(tempColor);
    setCurrentFontColor(tempFontColor);
    updateNodeLabel(id, tempTextValue);
    data.label = tempTextValue;
    color = tempColor;
  };
  const handleCancel = () => {
    setTempTextValue(data?.label || 'Escreva aqui');
    setTempFontColor(''); // Atualiza a cor da fonte temporariamente
    setTempColor(''); // Atualiza a cor temporariamente
  };

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
      {selected && (
        <Modal
          canSettings={data.canSettings}
          components={[
            {
              Component: SelectComponent,
              props: {
                valuesUnity: data.unitphases,
                type: 'group1',
                onUnitySelect: handleUnitySelect,
              },
              id: '',
            },
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
                setShowColorPicker: () => {}, // Não precisa do setShowColorPicker aqui
              },
              id: '',
            },
          ]}
          isUnity={true}
          textValue={textValue}
          tempTextValue={tempTextValue}
          onTextChange={setTempTextValue}
          onSave={handleSave} // Passa a função de salvar para o Modal
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};
