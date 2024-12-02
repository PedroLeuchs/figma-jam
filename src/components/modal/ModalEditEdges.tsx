import * as Toolbar from '@radix-ui/react-toolbar';
import * as Dialog from '@radix-ui/react-dialog';
import { FC, useEffect, useState } from 'react';
import { Edge, MarkerType, Node } from '@xyflow/react';
import EditEdge from '../edges/EditEdge';

interface ModalEditEdgesProps {
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  state: {
    nodesHistoryState: Node[];
    edgesHistoryState: Edge[];
  };
  set: (newPresent: {
    nodesHistoryState: Node[];
    edgesHistoryState: Edge[];
  }) => void;
  modalEdgeOpen: boolean;
  setmodalEdgeOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalEditEdges: FC<ModalEditEdgesProps> = ({
  edges,
  setEdges,
  state,
  set,
  modalEdgeOpen,
  setmodalEdgeOpen,
}) => {
  const edgeSelected = edges.find((edge) => edge.selected);

  const [height, setHeight] = useState(
    edgeSelected?.style?.strokeWidth ? edgeSelected.style.strokeWidth : 2
  );
  const [heightTemp, setHeightTemp] = useState(height);
  const [animated, setAnimated] = useState(
    edgeSelected?.animated ? edgeSelected?.animated : false
  );
  const [animatedTemp, setAnimatedTemp] = useState(animated);
  const [lineType, setLineType] = useState<'none' | 'end'>('none');
  const [lineTypeTemp, setLineTypeTemp] = useState<'none' | 'end'>(lineType);
  const [color, setColor] = useState(
    edgeSelected?.style?.stroke ? edgeSelected.style.stroke : 'black'
  );
  const [colorTemp, setColorTemp] = useState(color);

  // Dentro do seu componente ModalEditEdges:
  useEffect(() => {
    if (edgeSelected) {
      // Reseta os estados com base na nova edge selecionada
      setHeight(edgeSelected.style?.strokeWidth || 2);
      setHeightTemp(edgeSelected.style?.strokeWidth || 2);

      setAnimated(edgeSelected.animated || false);
      setAnimatedTemp(edgeSelected.animated || false);

      setColor(edgeSelected.style?.stroke || 'black');
      setColorTemp(edgeSelected.style?.stroke || 'black');

      const currentLineType = edgeSelected.markerEnd ? 'end' : 'none';
      setLineType(currentLineType);
      setLineTypeTemp(currentLineType);
    }
  }, [edgeSelected]);

  const onDelete = () => {
    // Filtra as edges, removendo a que está selecionada
    const updatedEdges = edges.filter((edge) => !edge.selected);

    // Atualiza o estado com as edges restantes
    setEdges(updatedEdges);

    // Atualiza o estado histórico
    set({
      ...state,
      edgesHistoryState: updatedEdges,
    });

    // Fecha o modal
    setmodalEdgeOpen(false);
  };

  const handleSave = () => {
    // Cria uma cópia das edges com as alterações aplicadas
    const updatedEdges = edges.map((edge) => {
      if (!edge.selected) return edge;

      const updatedEdge: Edge = { ...edge };

      // Verifica cada alteração e atualiza o edge
      if (heightTemp !== height) {
        updatedEdge.style = { ...updatedEdge.style, strokeWidth: heightTemp };
      }

      if (animatedTemp !== animated) {
        updatedEdge.animated = animatedTemp;
      }

      if (colorTemp !== color) {
        updatedEdge.style = { ...updatedEdge.style, stroke: colorTemp };

        // Atualiza o marcador se o tipo de linha for 'end'
        if (lineTypeTemp === 'end') {
          updatedEdge.markerEnd = {
            color: colorTemp,
            type: MarkerType.ArrowClosed,
            orient: 'auto',
          };
        }
      }

      if (lineTypeTemp !== lineType) {
        updatedEdge.markerEnd =
          lineTypeTemp === 'end'
            ? {
                color: colorTemp,
                type: MarkerType.ArrowClosed,
                orient: 'auto',
              }
            : undefined;
      }

      return updatedEdge;
    });

    // Atualiza o estado com as novas edges de uma vez
    setEdges(updatedEdges);
    set({
      ...state,
      edgesHistoryState: [...updatedEdges],
    });

    // Atualiza os valores dos estados temporários
    setHeight(heightTemp);
    setAnimated(animatedTemp);
    setColor(colorTemp);
    setLineType(lineTypeTemp);

    // Fecha o modal
    setmodalEdgeOpen(false);
  };

  return (
    <Dialog.Root open={modalEdgeOpen} onOpenChange={setmodalEdgeOpen}>
      <Dialog.Overlay className="fixed z-40 inset-0 bg-black/30 data-[state=open]:animate-overlayShow" />
      <Dialog.Content className="fixed z-50 left-1/2 top-1/2 lg:h-[75vh] lg:w-[30vw] w-[90vw] h-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow flex flex-col justify-between lg:gap-12 md:gap-8 gap-4">
        <Dialog.Title className="items-center flex justify-center h-10 lg:text-2xl md:text-xl text-base font-bold">
          Edição das Linhas
        </Dialog.Title>
        <Toolbar.Root className="h-5/6">
          <EditEdge
            setAnimatedTemp={setAnimatedTemp}
            setHeightTemp={setHeightTemp}
            setLineTypeTemp={setLineTypeTemp}
            setColorTemp={setColorTemp}
            animated={animatedTemp}
          />
        </Toolbar.Root>
        <div className="flex justify-end gap-5">
          <button
            onClick={() => {
              onDelete();
            }}
            className="mt-2 bg-red-500 text-white rounded px-4 py-2"
          >
            Deletar
          </button>
          <button
            onClick={() => {
              setmodalEdgeOpen(false);
            }}
            className="mt-2 bg-red-500 text-white rounded px-4 py-2"
          >
            Cencelar
          </button>
          <button
            onClick={handleSave}
            className="mt-2 bg-blue-500 text-white rounded px-4 py-2"
          >
            Salvar Alterações
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ModalEditEdges;
