import { FC, useState } from 'react';
import { NodeProps, Handle, Position, NodeResizer } from '@xyflow/react';
import BackgroundPicker from '../colorPicker/BackgroundPicker';
import FontePicker from '../colorPicker/FontePicker';
import SelectComponent from '../select/Select';
import { Modal } from '../modal/Modal';

interface CircleProps extends NodeProps {
  color?: string;
  fontColor?: string;
}

export const Circle: FC<CircleProps> = ({
  data,
  selected = false,
  color = 'bg-gray-100',
  fontColor = 'text-black',
}) => {
  const { machine = [] } = data as { machine: { id: string; label: string }[] };
  
  const [currentColor, setCurrentColor] = useState(color);
  const [currentFontColor, setCurrentFontColor] = useState(fontColor);
  const [textareaValue, setTextareaValue] = useState(data?.label || 'Escreva aqui');
  const [tempTextareaValue, setTempTextareaValue] = useState(data?.label || 'Escreva aqui');
  const [tempColor, setTempColor] = useState(color);
  const [tempFontColor, setTempFontColor] = useState(fontColor);
  const [textValue, setTextValue] = useState('');
  const [tempTextValue, setTempTextValue] = useState('');
  const [showOnMouseEnter, setShowOnMouseEnter] = useState(false);

  const handleColorChange = (color: string) => {
    setTempColor(color);
  };

  const handleFontColorChange = (color: string) => {
    setTempFontColor(color);
  };

  const handleMachineSelect = (machine: string) => {
    setTempTextareaValue(machine);
  };

  const handleSave = () => {
    setTextValue(tempTextValue);
    setCurrentColor(tempColor);
    setCurrentFontColor(tempFontColor);
    setTextareaValue(tempTextareaValue);
  };
  const handleCancel = () => {
    setTempTextareaValue(data?.label || 'Escreva aqui');
    setTempFontColor(''); // Atualiza a cor da fonte temporariamente
    setTempColor(''); // Atualiza a cor temporariamente
    setTextareaValue(data?.label || 'Escreva aqui');
  };

  return (
    <div
      onMouseEnter={() => setShowOnMouseEnter(true)}
      onMouseLeave={() => setShowOnMouseEnter(false)}
      className={`${currentColor} drop-shadow-lg shadow-black !min-w-[100px] min-h-[100px] w-auto h-full flex items-center  ${textValue ? "justify-start" : "justify-center"}  rounded-full border border-gray-600 flex-col`}
    >
      <NodeResizer
        minHeight={100}
        minWidth={100}
        isVisible={selected}
        lineClassName="!border-blue-400"
        handleClassName="!w-2 !h-2 !border-2 !rounded !border-blue-400 !bg-white"
      />
        <Handle type="source" id="right" position={Position.Right} className={`handle handle-right ${showOnMouseEnter ? "opacity-1" : "opacity-0"}`} />
        <Handle type="source" id="left" position={Position.Left} className={`handle handle-left ${showOnMouseEnter ? "opacity-1" : "opacity-0"}`} />
        <Handle type="source" id="top" position={Position.Top} className={`handle handle-top ${showOnMouseEnter ? "opacity-1" : "opacity-0"}`} />
        <Handle type="source" id="bottom" position={Position.Bottom} className={`handle handle-bottom ${showOnMouseEnter ? "opacity-1" : "opacity-0"}`} />

      <div className={`text-start font-semibold w-full ${textValue ? "px-4 pt-2" : ""}  ${currentFontColor}`}>{textValue}</div>

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

      {selected && (
        <div className='fixed -top-10 left-0 '>
          <Modal
            components={[
              {
                Component: SelectComponent,
                props: {
                  values: machine,
                  type: 'circle',
                  onMachineSelect: handleMachineSelect,
                },
                id: ''
              },
              {
                Component: FontePicker,
                props: {
                  onColorChange: handleFontColorChange,
                  setShowColorPicker: () => {},
                },
                id: ''
              },
              {
                Component: BackgroundPicker,
                props: {
                  onColorChange: handleColorChange,
                  setShowColorPicker: () => {},
                },
                id: ''
              },
            ]}
            textValue={tempTextValue}
            onTextChange={setTempTextValue}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}
    </div>
  );
};
