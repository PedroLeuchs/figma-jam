import * as Toolbar from '@radix-ui/react-toolbar';
import EditEdge from '../edges/EditEdge';
import { Edge, Node } from '@xyflow/react';
import { useEffect, useState } from 'react';

interface Ingredient {
  id: string;
  label: string;
  type: string;
}

interface UnitPhase {
  Unidade: string;
  Fases: string[];
}

interface SideBarProps {
  ingredients: Ingredient[];
  onDragStart: (
    event: React.DragEvent<HTMLButtonElement>,
    nodeType: string,
    label?: string
  ) => void;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  selectedUnityId: string;
  unitphases: UnitPhase[];
  nodes: Node[];
}

const SideBar: React.FC<SideBarProps> = ({
  ingredients,
  onDragStart,
  edges,
  setEdges,
  selectedUnityId,
  unitphases,
  nodes,
}) => {
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    // Verifica se algum edge está selecionado
    const isAnySelected = edges.some((edge) => edge.selected);
    setCanEdit(isAnySelected);
  }, [edges]);

  // Filtra o node com o ID selecionado e tipo 'unity'
  const selectedUnityNode = nodes.find(
    (node) => node.id === selectedUnityId && node.type === 'unity'
  );

  return (
    <Toolbar.Root className="h-[78%] w-[8%] absolute top-5 right-5 bg-white rounded-2xl shadow-lg border border-zinc-300 flex flex-col items-center justify-start gap-2 py-5">
      <h2 className="text-center text-xl">
        {selectedUnityNode
          ? `Componente ${selectedUnityNode.data.label}` // Mostra o label da unidade selecionada
          : 'Componente Principal'}{' '}
      </h2>
      <hr className="bg-black w-11/12" />

      {/* Verifica se um node do tipo 'unity' está selecionado */}
      {selectedUnityNode
        ? unitphases
            .filter(
              (unitphase) => unitphase.Unidade == selectedUnityNode.data.label
            ) // Filtra pela unidade selecionada
            .map((unitphase) =>
              unitphase.Fases.map((fase, index) => (
                <Toolbar.Button
                  key={index}
                  onDragStart={(event) => onDragStart(event, 'phase', fase)}
                  draggable
                  className="w-10/12 h-auto p-2 top-10 right-0 border border-gray-300 transition-all duration-300 bg-red-400 text-black hover:-translate-x-4 hover:scale-105"
                >
                  {fase}
                </Toolbar.Button>
              ))
            )
        : ingredients.map((ingredient) => (
            <Toolbar.Button
              key={ingredient.id}
              onDragStart={(event) => onDragStart(event, ingredient.type)}
              draggable
              className={`w-10/12 h-auto p-2 top-10 right-0 border text-black border-gray-300 transition-all duration-300 
                  ${
                    ingredient.type === 'circle'
                      ? 'rounded-full bg-gray-200'
                      : ingredient.type === 'square'
                      ? 'bg-white rounded-tl-lg '
                      : ingredient.type === 'unity'
                      ? 'bg-violet-700/50 h-20'
                      : ingredient.type === 'logicControl'
                      ? 'bg-gray-800 text-white'
                      : ingredient.type === 'phase'
                      ? 'bg-red-400 text-black'
                      : ''
                  } hover:-translate-x-4 hover:scale-105`}
            >
              {ingredient.label}
              {ingredient.type === 'triangle' && (
                <div className="relative left-1/2 -translate-x-1/2 w-0 h-0 border-l-[25px] border-r-[25px] border-b-[50px] border-l-transparent border-r-transparent border-b-gray-800"></div>
              )}
            </Toolbar.Button>
          ))}

      <div className="absolute bottom-0 w-full border-t border-zinc-300">
        {canEdit && (
          <EditEdge setEdges={setEdges} edges={edges} setCanEdit={setCanEdit} />
        )}
      </div>
    </Toolbar.Root>
  );
};

export default SideBar;
