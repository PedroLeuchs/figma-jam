import * as Dialog from '@radix-ui/react-dialog';
import * as Toolbar from '@radix-ui/react-toolbar';
import { FC, useState } from 'react';
import { Edge, Node } from '@xyflow/react';
import BackgroundPicker from '../../colorPicker/BackgroundPicker';
import TextInput from '../../textInput/TextInput';

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
  modalSeparator: boolean;
  setModalSeparator: React.Dispatch<React.SetStateAction<boolean>>;
  nodeEditing: nodeEditProps | null;
  setNodeEditing: React.Dispatch<React.SetStateAction<Node | null>>;
}

export const ModalSeparator: FC<ModalProps> = ({
  set,
  state,
  nodes,
  setNodes,
  modalSeparator,
  setModalSeparator,
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
  const [lineHeight, setLineHeight] = useState('border-2');

  const [tempTextareaValue, setTempTextareaValue] = useState(
    textareaValue || ''
  );
  const [tempBgColor, setTempBgColor] = useState(bgColor);
  const [tempFontColor, setTempFontColor] = useState(fontColor);
  const [tempLineHeight, setTempLineHeight] = useState('border-2');

  if (!nodeEditing) {
    return null;
  }

  const handleColorChange = (color: string) => {
    setTempBgColor(color);
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
    setModalSeparator(false);
  };

  const onCancel = () => {
    setTempTextareaValue(textareaValue);
    setTempBgColor(bgColor);
    setTempFontColor(fontColor);
    setTempLineHeight(lineHeight);
    setModalSeparator(false);
  };
  const onSave = () => {
    setTextareaValue(tempTextareaValue);
    setBgColor(tempBgColor);
    setFontColor(tempFontColor);
    setLineHeight(tempLineHeight);
    updatedNodes();
  };

  const updatedNodes = () => {
    const newNodes = nodes.map((node) => {
      if (node.id === nodeEditing.id) {
        node.data.label = tempTextareaValue;
        node.data.color = tempBgColor;
        node.data.lineHeight = tempLineHeight;
        node.data.timestamp = Date.now();
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
    <Dialog.Root open={modalSeparator} onOpenChange={setModalSeparator}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-1/2 top-1/2 lg:max-h-[85vh] lg:w-[30vw] w-11/12 h-[95%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow flex flex-col justify-between lg:gap-12 md:gap-8 gap-4">
          <Dialog.Title className="lg:text-xl md:text-lg text-base font-semibold">
            Editar Separador
          </Dialog.Title>

          <div className="h-5/6 flex flex-col justify-start items-start gap-5">
            <TextInput
              onChange={setTempTextareaValue}
              value={tempTextareaValue}
            />
            <hr className="h-1 w-full" />
            <h1 className="lg:text-base text-sm font-semibold">
              Escolha de cor da borda
            </h1>
            <BackgroundPicker
              setShowColorPicker={() => {}}
              isSeparator={true}
              onColorChange={handleColorChange}
            />
            <hr className="h-1 w-full" />
            <Toolbar.Root className="w-full h-1/3 flex flex-col">
              <h1 className="lg:text-base text-sm font-semibold">
                Espessura da borda
              </h1>
              <div className="w-4/5 flex flex-col">
                <Toolbar.Button
                  onClick={() =>
                    setTempLineHeight && setTempLineHeight('border')
                  }
                  className="w-full h-1/3 p-2 hover:bg-gray-100"
                >
                  <hr className="border border-black " />
                </Toolbar.Button>
                <Toolbar.Button
                  onClick={() =>
                    setTempLineHeight && setTempLineHeight('border-2')
                  }
                  className="w-full h-1/3 p-2 hover:bg-gray-100"
                >
                  <hr className="border-2 border-black " />
                </Toolbar.Button>
                <Toolbar.Button
                  onClick={() =>
                    setTempLineHeight && setTempLineHeight('border-4')
                  }
                  className="w-full h-1/3 p-2 hover:bg-gray-100"
                >
                  <hr className="border-4 border-black " />
                </Toolbar.Button>
                <Toolbar.Button
                  onClick={() =>
                    setTempLineHeight && setTempLineHeight('border-8')
                  }
                  className="w-full h-1/3 p-2 hover:bg-gray-100"
                >
                  <hr className="border-8 border-black " />
                </Toolbar.Button>
              </div>
            </Toolbar.Root>
            <hr className="h-1 w-full" />
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
