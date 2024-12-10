import * as Dialog from '@radix-ui/react-dialog';
import { FC, useState } from 'react';
import { Edge, Node } from '@xyflow/react';
import BackgroundPicker from '../../colorPicker/BackgroundPicker';
import FontePicker from '../../colorPicker/FontePicker';
import SelectComponent from '../../select/Select';
import AlertComponent from '../../alert/AlertComponent';

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
  modalUnity: boolean;
  setModalUnity: React.Dispatch<React.SetStateAction<boolean>>;
  nodeEditing: nodeEditProps | null;
  setNodeEditing: React.Dispatch<React.SetStateAction<Node | null>>;
}

export const ModalUnity: FC<ModalProps> = ({
  set,
  state,
  nodes,
  setNodes,
  modalUnity,
  setModalUnity,
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

  const [showAlert, setShowAlert] = useState(false);
  const [showAlertMessage, setShowAlertMessage] = useState('');
  const [showAlertSeverity, setShowAlertSeverity] = useState<
    'error' | 'warning' | 'info' | 'success'
  >('error');

  if (!nodeEditing) {
    return null;
  }

  const { unitphases = [] } = nodeEditing?.data as {
    unitphases: { Unidade: string; Fases: string[] }[];
  };

  const onShowAlert = (
    message: string,
    severity: 'error' | 'warning' | 'info' | 'success'
  ) => {
    setShowAlertMessage(message);
    setShowAlertSeverity(severity);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const handleUnidadesSelect = (unidades: string) => {
    if (nodeEditing.data.canSettings) {
      onShowAlert(
        'Já tem Phases dentro dessa unity, você não pode mudar o tipo dela.',
        'error'
      );
      setTempTextareaValue(nodeEditing.data.label as string);
    } else {
      setTempTextareaValue(unidades);
    }
  };
  const handleColorChange = (color: string) => {
    setTempBgColor(color);
  };
  const handleFontColorChange = (color: string) => {
    setTempFontColor(color);
  };

  const onDelete = () => {
    // Obtenha os IDs dos nodes selecionados para deletar
    const deletedNodeIds = nodes
      .filter((node) => node.selected)
      .map((node) => node.id);
  
    // Filtre os nodes que não devem ser deletados
    const updatedNodes = nodes.filter(
      (node) =>
        !node.selected && // Remove os nodes selecionados
        !deletedNodeIds.includes(node.parentId ? node.parentId : '') // Remove os nodes filhos dos nodes deletados
    );
  
    // Atualiza o estado com os Nodes restantes
    setNodes(updatedNodes);
  
    // Atualiza o estado histórico
    set({
      ...state,
      nodesHistoryState: updatedNodes,
    });
  
    // Fecha o modal
    setModalUnity(false);
  };
  

  const onCancel = () => {
    setTempTextareaValue(textareaValue);
    setTempBgColor(bgColor);
    setTempFontColor(fontColor);
    setModalUnity(false);
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
    <Dialog.Root open={modalUnity} onOpenChange={setModalUnity}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-1/2 z-50 top-1/2 lg:max-h-[85vh] lg:w-[30vw] w-11/12 h-[95%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow flex flex-col justify-between lg:gap-12 md:gap-8 gap-4">
          <Dialog.Title className="lg:text-xl md:text-lg text-base font-semibold">
            Editar {nodeEditing && (nodeEditing.data.label as string)}
          </Dialog.Title>

          <div className="h-5/6 flex flex-col justify-start items-start gap-5">
            <hr className="h-1 w-full" />
            <div>
              <h1 className="lg:text-base text-sm font-semibold">
                Selecione uma Unity
              </h1>
              <SelectComponent
                type="group1"
                valuesUnity={unitphases}
                onUnitySelect={handleUnidadesSelect}
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
                Escolha da cor do fundo
              </h1>

              <BackgroundPicker
                setShowColorPicker={() => {}}
                onColorChange={handleColorChange}
              />
            </div>
          </div>

          <hr className="h-1 w-full" />
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
      <AlertComponent
        show={showAlert}
        message={showAlertMessage}
        severity={showAlertSeverity}
      />
    </Dialog.Root>
  );
};
