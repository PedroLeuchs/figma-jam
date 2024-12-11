import * as Dialog from '@radix-ui/react-dialog';
import { FC } from 'react';
import { Edge, Node } from '@xyflow/react';

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
  modalTriangle: boolean;
  setModalTriangle: React.Dispatch<React.SetStateAction<boolean>>;
  nodeEditing: nodeEditProps | null;
  setNodeEditing: React.Dispatch<React.SetStateAction<Node | null>>;
}

export const ModalTriangle: FC<ModalProps> = ({
  set,
  state,
  nodes,
  setNodes,
  modalTriangle,
  setModalTriangle,
  nodeEditing,
}) => {

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
    setModalTriangle(false);
  };

  const onCancel = () => {

    setModalTriangle(false);
  };


  return (
    <Dialog.Root open={modalTriangle} onOpenChange={setModalTriangle}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed z-40 inset-0 bg-black/30 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed z-50 left-1/2 top-1/2 lg:max-h-[85vh] lg:w-[30vw] w-11/12 h-auto -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow flex flex-col justify-between lg:gap-12 md:gap-8 gap-4">
          <Dialog.Title className="lg:text-xl md:text-lg text-base font-semibold">
            Deletar Triangle {nodeEditing && (nodeEditing.data.label as string)}
          </Dialog.Title>


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
           
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
