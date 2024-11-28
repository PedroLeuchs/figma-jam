import { TextField } from '@mui/material';
import * as Dialog from '@radix-ui/react-dialog';
import { FC, useState } from 'react';
import { RxFontItalic } from 'react-icons/rx';
import { RiFontColor } from 'react-icons/ri';
import BackgroundPicker from '../../colorPicker/BackgroundPicker';
import { IoIosColorPalette } from 'react-icons/io';
import { Edge, Node } from '@xyflow/react';

interface ModalEditLabelProps {
  state: {
    nodesHistoryState: Node[];
    edgesHistoryState: Edge[];
  };
  set: (newPresent: {
    nodesHistoryState: Node[];
    edgesHistoryState: Edge[];
  }) => void;
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  modalLabel: boolean;
  setModalLabel: React.Dispatch<React.SetStateAction<boolean>>;
  nodeEditing: Node | null;
  setNodeEditing: React.Dispatch<React.SetStateAction<Node | null>>;
}

export const ModalEditLabel: FC<ModalEditLabelProps> = ({
  set,
  state,
  nodes,
  setNodes,
  modalLabel,
  setModalLabel,
  nodeEditing,
  setNodeEditing,
}) => {
  //estados normais
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

  // Estados locais para edição temporária
  const [tempTextValue, setTempTextValue] = useState(textValueModalLabel);
  const [tempItalic, setTempItalic] = useState(italic);
  const [tempUnderline, setTempUnderline] = useState(underline);
  const [tempFontSize, setTempFontSize] = useState(fontSize);
  const [tempBold, setTempBold] = useState(bold);
  const [colorPicker, setColorPicker] = useState('black');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const onDelete = () => {
    // Filtra as edges, removendo a que está selecionada
    const updatedNodes = nodes.filter((node) => !node.selected);

    // Atualiza o estado com as Nodes restantes
    setNodes(updatedNodes);

    // Atualiza o estado histórico
    set({
      ...state,
      nodesHistoryState: updatedNodes,
    });

    // Fecha o modal
    setModalLabel(false);
  };

  const onCancel = () => {
    // Fechar o modal sem salvar alterações
    setModalLabel(false);
  };

  const handleColorChange = (color: string) => {
    setColorPicker(color || 'black');
  };

  const onSave = () => {
    // Aplicar as alterações aos estados principais
    setTextValueModalLabel(tempTextValue);
    setItalic(tempItalic);
    setUnderline(tempUnderline);
    setFontSize(tempFontSize);
    setBold(tempBold);
    setColor(colorPicker);
    updatedLabelNodes();
    setModalLabel(false);
  };

  const handleFontWeightChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setTempBold(event.target.value as typeof bold);
  };

  const updatedLabelNodes = () => {
    // Atualizar o nó com as novas informações
    const updatedNodes = nodes.map((node) => {
      if (node?.id === nodeEditing?.id) {
        return {
          ...node,
          data: {
            ...node.data,
            color: colorPicker,
            italic: tempItalic,
            underline: tempUnderline,
            bold: tempBold,
            fontSize: tempFontSize,
          },
        };
      }
      return node;
    });

    // Atualizar o estado com os nós atualizados
    setNodes(updatedNodes);

    // Atualizar o estado histórico
    set({
      ...state,
      nodesHistoryState: updatedNodes,
    });
    setNodeEditing(null);
  };

  return (
    <Dialog.Root
      open={modalLabel}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          // Sincronizar os estados temporários com os principais ao abrir o modal
          setTempTextValue(textValueModalLabel);
          setTempItalic(italic);
          setTempUnderline(underline);
          setTempFontSize(fontSize);
          setTempBold(bold);
          setColorPicker(color || 'black');
        }
        setModalLabel(isOpen);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed z-40 inset-0 bg-black/30" />
        <Dialog.Content className="fixed z-50 left-1/2 top-1/2 lg:max-h-[85vh] lg:w-[30vw] w-11/12 h-[95%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-5 flex flex-col items-center justify-between gap-4">
          <div className="w-full h-5/6 flex flex-col items-center gap-2">
            <div className="w-full h-3/6 flex flex-col items-center justify-start gap-5">
              <TextField
                id="outlined-basic"
                label="Texto"
                value={tempTextValue}
                variant="outlined"
                onChange={(e) => setTempTextValue(e.target.value)}
              />
              <div className="flex items-center gap-2 ">
                <button
                  onClick={() => setTempItalic(!tempItalic)}
                  className={`rounded-md p-2 border ${
                    tempItalic ? 'bg-gray-300' : 'bg-white'
                  }`}
                >
                  <RxFontItalic className="text-lg" />
                </button>
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className={`rounded-md p-2 border ${
                    tempItalic ? 'bg-gray-300' : 'bg-white'
                  }`}
                >
                  <IoIosColorPalette className="text-lg" />
                </button>
                <button
                  onClick={() => setTempUnderline(!tempUnderline)}
                  className={`rounded-md p-2 border ${
                    tempUnderline ? 'bg-gray-300' : 'bg-white'
                  }`}
                >
                  <RiFontColor className="text-lg" />
                </button>

                <select
                  value={tempBold}
                  onChange={handleFontWeightChange}
                  className="p-2 border rounded"
                >
                  <option value="font-light" className="font-light">
                    B
                  </option>
                  <option value="font-normal" className="font-normal">
                    B
                  </option>
                  <option value="font-semibold" className="font-semibold">
                    B
                  </option>
                  <option value="font-bold" className="font-bold">
                    B
                  </option>
                  <option value="font-extrabold" className="font-extrabold">
                    B
                  </option>
                </select>
                <TextField
                  id="font-size"
                  label={`Tamanho da fonte`}
                  value={tempFontSize}
                  type="number"
                  variant="outlined"
                  size="small"
                  onChange={(e) => setTempFontSize(Number(e.target.value))}
                />
              </div>
              <div className="w-full flex items-start">
                <div className="w-44 ">
                  {showColorPicker && (
                    <BackgroundPicker
                      lineEdit={true}
                      onColorChange={handleColorChange}
                    />
                  )}
                </div>
              </div>
            </div>
            <h1
              className={`${tempItalic ? 'italic' : 'not-italic'} ${
                tempUnderline ? 'underline' : 'no-underline'
              } ${tempBold} text-center underline-offset-2`}
              style={{
                fontSize: `${tempFontSize}px`,
                color: colorPicker,
              }}
            >
              {tempTextValue}
            </h1>
            <hr className="h-1" />
          </div>
          <hr className="h-1 w-full flex" />
          <div className="flex lg:justify-end lg:gap-5 gap-2 justify-center">
            <button
              onClick={onDelete}
              className=" bg-red-500 text-white rounded lg:px-4 px-2 lg:py-2 py-1 lg:text-lg text-base font-semibold"
            >
              Deletar
            </button>
            <button
              onClick={onCancel}
              className=" bg-red-500 text-white rounded lg:px-4 px-2 lg:py-2 py-1 lg:text-lg text-base font-semibold"
            >
              Cencelar
            </button>
            <button
              onClick={onSave}
              className=" bg-blue-500 text-white rounded lg:px-4 px-2 lg:py-2 py-1 lg:text-lg text-base font-semibold"
            >
              Salvar Alterações
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
