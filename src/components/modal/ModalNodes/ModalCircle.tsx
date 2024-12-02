import * as Dialog from '@radix-ui/react-dialog';
import { FC, useState } from 'react';
import { Edge, Node } from '@xyflow/react';
import BackgroundPicker from '../../colorPicker/BackgroundPicker';
import FontePicker from '../../colorPicker/FontePicker';
import SelectComponent from '../../select/Select';

interface nodeEditProps extends Node {
  color?: string;
  fontColor?: string;
}

interface ModalProps {
  state: {
    nodesHistoryState: Node[];
    edgesHistoryState: Edge[];
  };
  set: (newPresent: {
    nodesHistoryState: Node[];
    edgesHistoryState: Edge[];
  }) => void;
  nodes: nodeEditProps[];
  setNodes: React.Dispatch<React.SetStateAction<nodeEditProps[]>>;
  modalCircle: boolean;
  setModalCircle: React.Dispatch<React.SetStateAction<boolean>>;
  nodeEditing: nodeEditProps | null;
  setNodeEditing: React.Dispatch<React.SetStateAction<Node | null>>;
}

export const ModalCircle: FC<ModalProps> = ({
  set,
  state,
  nodes,
  setNodes,
  modalCircle,
  setModalCircle,
  nodeEditing,
  setNodeEditing,
}) => {
  const [textareaValue, setTextareaValue] = useState(
    (nodeEditing?.data.label as string) || ''
  );
  const [bgColor, setBgColor] = useState((nodeEditing?.color as string) || '');
  const [fontColor, setFontColor] = useState(
    (nodeEditing?.fontColor as string) || ''
  );

  const [tempTextareaValue, setTempTextareaValue] = useState(
    textareaValue || ''
  );
  const [tempBgColor, setTempBgColor] = useState(bgColor);
  const [tempFontColor, setTempFontColor] = useState(fontColor);

  if (!nodeEditing) {
    return null;
  }

  const { machine = [] } = nodeEditing?.data as {
    machine: { id: string; label: string }[];
  };

  const handleMachineSelect = (machine: string) => {
    setTempTextareaValue(machine);
  };
  const handleColorChange = (color: string) => {
    setTempBgColor(color);
  };
  const handleFontColorChange = (color: string) => {
    setTempFontColor(color);
  };

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
    setModalCircle(false);
  };

  const onCancel = () => {
    setTempTextareaValue(textareaValue);
    setTempBgColor(bgColor);
    setTempFontColor(fontColor);
    setModalCircle(false);
  };
  const onSave = () => {
    setTextareaValue(tempTextareaValue);
    setBgColor(tempBgColor);
    setFontColor(tempFontColor);
    updatedNodes();
  };

  const updatedNodes = () => {
    const newNodes = nodes.map((node) => {
      if (node.id === nodeEditing.id) {
        node.data.label = tempTextareaValue;
        node.data.color = tempBgColor;
        node.data.fontColor = tempFontColor;
      }
      return node;
    });
    setNodes(newNodes);
    set({
      nodesHistoryState: newNodes,
      edgesHistoryState: state.edgesHistoryState,
    });
    setNodeEditing(null);
  };

  return (
    <Dialog.Root open={modalCircle} onOpenChange={setModalCircle}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed z-40 inset-0 bg-black/30 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed z-50 left-1/2 top-1/2 lg:max-h-[85vh] lg:w-[30vw] w-11/12 h-[95%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow flex flex-col justify-between lg:gap-12 md:gap-8 gap-4">
          <Dialog.Title className="lg:text-xl md:text-lg text-base font-semibold">
            Editar {nodeEditing && (nodeEditing.data.label as string)}
          </Dialog.Title>

          <div className="h-5/6 flex flex-col justify-start items-start gap-5">
            <hr className="h-1 w-full" />
            <div>
              <h1 className="lg:text-base text-sm font-semibold">
                Selecione um silo
              </h1>
              <SelectComponent
                type="circle"
                values={machine}
                onMachineSelect={handleMachineSelect}
              />
            </div>
            <hr className="h-1 w-full" />
            <div>
              <h1 className="lg:text-base text-sm font-semibold">
                Escolha de cor da fonte
              </h1>
              <FontePicker
                setShowColorPicker={() => {}}
                onColorChange={handleFontColorChange}
              />
            </div>
            <hr className="h-1 w-full" />
            <div>
              <h1 className="lg:text-base text-sm font-semibold">
                Escolha de cor do fundo
              </h1>
              <BackgroundPicker
                setShowColorPicker={() => {}}
                onColorChange={handleColorChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-5">
            <button
              onClick={onDelete}
              className="mt-2 bg-red-500 text-white rounded px-4 py-2"
            >
              Deletar
            </button>
            <button
              onClick={onCancel}
              className="mt-2 bg-red-500 text-white rounded px-4 py-2"
            >
              Cencelar
            </button>
            <button
              onClick={onSave}
              className="mt-2 bg-blue-500 text-white rounded px-4 py-2"
            >
              Salvar Alterações
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
