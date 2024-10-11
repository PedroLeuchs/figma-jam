import { FC, useState } from 'react';
import { NodeProps, Handle, Position, NodeResizer } from '@xyflow/react';
import { Modal } from '../modal/Modal';
import BackgroundPicker from '../colorPicker/BackgroundPicker';
import FontePicker from '../colorPicker/FontePicker';
import SelectComponent from '../select/Select';

interface UnitPhase {
  Unidade: string;
  Fases: string[];
}
interface GroupProps extends NodeProps {
  id: string;
  data: { label: string; unitphases: UnitPhase[] };
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
  color = 'bg-violet-700',
  fontColor = 'text-black',
  updateNodeLabel = () => {},
}) => {
  const [showOnMouseEnter, setShowOnMouseEnter] = useState(false);
  const [tempFontColor, setTempFontColor] = useState(fontColor);
  const [tempColor, setTempColor] = useState(color);
  const [currentColor, setCurrentColor] = useState(color);
  const [currentFontColor, setCurrentFontColor] = useState(fontColor);
  const [textValue, setTextValue] = useState(data.label);
  const [tempTextValue, setTempTextValue] = useState('');
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
      <NodeResizer
        minHeight={200}
        minWidth={200}
        isVisible={selected}
        lineClassName="!border-blue-400"
        handleClassName="!w-2 !h-2 !border-2 !rounded !border-blue-400 !bg-white"
      />
      <div
        className={`${currentFontColor} opacity-100 p-2 text-center font-semibold text-xl`}
      >
        {textValue}
      </div>

      {/* Handles on all 4 sides */}
      <Handle
        type="source"
        id="right"
        position={Position.Right}
        className={`handle handle-right ${
          showOnMouseEnter ? 'opacity-1' : 'opacity-0'
        }`}
      />
      <Handle
        type="source"
        id="left"
        position={Position.Left}
        className={`handle handle-left ${
          showOnMouseEnter ? 'opacity-1' : 'opacity-0'
        }`}
      />
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
      {selected && (
        <Modal
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
          onTextChange={setTempTextValue}
          onSave={handleSave} // Passa a função de salvar para o Modal
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};
