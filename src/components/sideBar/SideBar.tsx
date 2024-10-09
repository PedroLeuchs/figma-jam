import * as Toolbar from '@radix-ui/react-toolbar';
import EditEdge from '../edges/EditEdge';
import { Edge } from 'reactflow';
import { useEffect, useState } from 'react';
// import { useEffect, useState } from 'react';

interface Ingredient {
  id: string;
  label: string;
  type: string;
}

interface SideBarProps {
  ingredients: Ingredient[];
  onDragStart: (
    event: React.DragEvent<HTMLButtonElement>,
    nodeType: string
  ) => void;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

const SideBar: React.FC<SideBarProps> = ({
  ingredients,
  onDragStart,
  edges,
  setEdges,
}) => {
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    // Verifica se algum edge está selecionado
    const isAnySelected = edges.some((edge) => edge.selected);
    setCanEdit(isAnySelected);
  }, [edges]);

  return (
    <Toolbar.Root className="h-5/6 w-[10%] absolute top-1/2 -translate-y-1/2 right-5 bg-white rounded-2xl shadow-lg border border-zinc-300 flex flex-col items-center justify-start gap-2 py-5">
      <h2 className="text-center text-xl">Itens</h2>
      <hr className="bg-black w-11/12" />
      {ingredients.map((ingredient, index) => (
        <Toolbar.Button
          key={ingredient.id}
          onDragStart={(event) => onDragStart(event, ingredient.type)}
          draggable
          className={`w-10/12 h-auto p-2 top-10 right-0 border text-black border-gray-300 transition-all duration-300 
                      ${
                        ingredients[index].type === 'circle'
                          ? 'rounded-full bg-gray-200'
                          : ingredients[index].type === 'square'
                          ? 'bg-white rounded-tl-lg '
                          : ingredients[index].type === 'group1'
                          ? 'bg-orange-500/50'
                          : ingredients[index].type === 'logicControl'
                          ? 'bg-gray-800 text-white'
                          : ''
                      } hover:-translate-x-4 hover:scale-105 `}
        >
          {ingredient.label}
          {ingredients[index].type === 'triangle' && (
            <div className="relative left-1/2 -translate-x-1/2 w-0 h-0 border-l-[25px] border-r-[25px] border-b-[50px] border-l-transparent border-r-transparent border-b-gray-500"></div>
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
