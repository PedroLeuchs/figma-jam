import { FC, useState } from 'react';
import { NodeProps, Handle, Position, NodeResizer } from '@xyflow/react';
import BackgroundPicker from '../colorPicker/BackgroundPicker';
import FontePicker from '../colorPicker/FontePicker';
import SelectComponent from '../select/Select';
import { Modal } from '../modal/Modal';

interface SquareProps extends NodeProps {
  color?: string;
  fontColor?: string;
}

export const Square: FC<SquareProps> = ({
  data,
  selected = false,
  color = 'bg-white',
  fontColor = 'text-black',
}) => {
  const { ingredients = [] } = data as {
    ingredients: { id: string; label: string }[];
  };

  const [currentColor, setCurrentColor] = useState(color);
  const [currentFontColor, setCurrentFontColor] = useState(fontColor);
  const [textareaValue, setTextareaValue] = useState(
    data?.label || 'Escreva aqui'
  );
  const [tempTextareaValue, setTempTextareaValue] = useState(
    data?.label || 'Escreva aqui'
  );
  const [textValue, setTextValue] = useState('');
  const [tempTextValue, setTempTextValue] = useState('');
  const [tempColor, setTempColor] = useState(color);
  const [tempFontColor, setTempFontColor] = useState(fontColor);
  const [showOnMouseEnter, setShowOnMouseEnter] = useState(false);

  const handleColorChange = (color: string) => {
    setTempColor(color); // Atualiza a cor temporariamente
  };

  const handleFontColorChange = (color: string) => {
    setTempFontColor(color); // Atualiza a cor da fonte temporariamente
  };

  const handleIngredientSelect = (ingredient: string) => {
    setTempTextareaValue(ingredient);
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
      className={`${currentColor} rounded w-full h-full min-w-[200px] min-h-[50px] flex flex-col items-center ${
        textValue ? 'justify-start' : 'justify-center'
      }  shadow-lg shadow-black/30 border border-gray-500`}
    >
      <NodeResizer
        minHeight={50}
        minWidth={200}
        isVisible={selected}
        lineClassName="!border-blue-400"
        handleClassName="!w-2 !h-2 !border-2 !rounded !border-blue-400 !bg-white"
      />

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

      <div
        className={`text-start font-semibold w-full px-2 ${currentFontColor}`}
      >
        {textValue}
      </div>

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

      {selected && (
        <>
          <Modal
            components={[
              {
                Component: SelectComponent,
                props: {
                  values: ingredients,
                  type: 'square',
                  onIngredientSelect: handleIngredientSelect,
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
            textValue={tempTextValue}
            onTextChange={setTempTextValue}
            onSave={handleSave} // Passa a função de salvar para o Modal
            onCancel={handleCancel} // Passa a função de salvar para o Modal
          />
        </>
      )}

      {/* {selected && (
        <div className="bg-white text-white absolute -bottom-14 rounded-lg border border-gray-200 hover:cursor-pointer">
          <SelectComponent values={ingredients} type='square' onIngredientSelect={handleIngredientSelect} />
        </div>
      )} */}

      {/* {selected && (
        <>
          <div
            onClick={() => setShowFontColorPicker((prev) => !prev)}
            className="bg-white text-white rounded-full p-1 absolute -top-10 right-10 border border-gray-600 hover:cursor-pointer"
          >
            <FaFont className="text-gray-600 text-2xl" />
          </div>
          {showFontColorPicker && <FontePicker onColorChange={handleFontColorChange} setShowColorPicker={setShowFontColorPicker} />}
        </>
      )}

      {selected && (
        <>
          <div
            onClick={() => setShowColorPicker((prev) => !prev)}
            className="bg-white text-white rounded-full p-1 absolute -top-10 -right-0 border border-gray-600 hover:cursor-pointer"
          >
            <IoIosColorFill className="text-gray-600 text-2xl" />
          </div>
          {showColorPicker && <BackgroundPicker onColorChange={handleColorChange} setShowColorPicker={setShowColorPicker} />}
        </>
      )} */}
    </div>
  );
};
