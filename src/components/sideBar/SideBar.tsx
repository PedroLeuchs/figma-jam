import * as Toolbar from '@radix-ui/react-toolbar';
import { Node } from '@xyflow/react';
import { useCallback, useEffect, useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

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
  nodes: Node[];
  selectedUnityId: string;
  unitphases: UnitPhase[];
  onNodeSelect: (nodeType: string, label?: string) => void;
  viewportWidth: number;
  viewportHeight: number;
}

const SideBar: React.FC<SideBarProps> = ({
  ingredients,
  onDragStart,
  selectedUnityId,
  unitphases,
  nodes,
  onNodeSelect,
  viewportWidth,
}) => {
  const [isOpenNav, setIsOpenNav] = useState<'flex' | 'hidden'>('flex');

  const ajustedNavBar = useCallback(() => {
    if (viewportWidth < 900) {
      setIsOpenNav('hidden');
    } else {
      setIsOpenNav('flex');
    }
  }, [viewportWidth]);

  useEffect(() => {
    ajustedNavBar();
  }, [ajustedNavBar]);

  const handleNodeSelect = (nodeType: string, label?: string) => {
    if (window.innerWidth < 900) {
      onNodeSelect(nodeType, label);
      setIsOpenNav('hidden');
    } else {
      return;
    }
  };
  // Filtra o node com o ID selecionado e tipo 'unity'
  const selectedUnityNode = nodes.find(
    (node) => node.id === selectedUnityId && node.type === 'unity'
  );

  const handleOpenNav = () => {
    if (isOpenNav === 'flex') {
      setIsOpenNav('hidden');
    } else {
      setIsOpenNav('flex');
    }
  };

  return (
    <>
      {isOpenNav === 'flex' && (
        <div className="lg:hidden bg-black/20 w-screen h-screen fixed top-0 left-0"></div>
      )}
      <div
        onClick={handleOpenNav}
        className={`max-lg:flex hidden z-50 items-center justify-center rounded-full  bg-gray-100 border border-gray-400 absolute top-2 right-2 p-2 transition-all duration-300`}
      >
        {isOpenNav === 'hidden' ? (
          <FiMenu className="text-3xl text-black" />
        ) : (
          <IoClose className="text-3xl text-black" />
        )}
      </div>

      <Toolbar.Root
        className={` ${isOpenNav} ${
          isOpenNav == 'flex'
            ? 'lg:top-5 top-20 max-lg:right-10 right-4 max-lg:left-10 h-[78%]'
            : '  top-0 right-0 h-0'
        } z-40 lg:w-52  absolute bg-white rounded-lg shadow-lg shadow-black/30 border border-zinc-400 flex-col items-center justify-start gap-2 py-2 px-1 dark:bg-zinc-900  dark:border-zinc-700 dark:text-zinc-300 transition-all duration-300`}
      >
        <h2 className="text-center text-2xl my-5 italic font-semibold">
          {selectedUnityNode
            ? `Componente ${selectedUnityNode.data.label}` // Mostra o label da unidade selecionada
            : 'Componente Principal'}{' '}
        </h2>
        <hr className="border-zinc-300 dark:border-zinc-700 w-11/12" />

        {/* Verifica se um node do tipo 'unity' está selecionado */}
        <div className="w-full flex flex-col gap-3 items-center justify-start overflow-y-auto h-full">
          {selectedUnityNode
            ? unitphases
                .filter(
                  (unitphase) =>
                    unitphase.Unidade == selectedUnityNode.data.label
                ) // Filtra pela unidade selecionada
                .map((unitphase) =>
                  unitphase.Fases.map((fase, index) => (
                    <Toolbar.Button
                      key={index}
                      onClick={() =>
                        handleNodeSelect('phase', unitphase.Fases[index])
                      }
                      onDragStart={(event) => onDragStart(event, 'phase', fase)}
                      draggable
                      className="w-10/12 h-auto p-2 top-10 right-0 border border-gray-300 dark:border-zinc-700 transition-all duration-300 bg-sky-900 dark:bg-sky-950 text-white hover:-translate-x-4 hover:scale-105 "
                    >
                      {fase}
                    </Toolbar.Button>
                  ))
                )
            : ingredients.map((ingredient) => (
                <Toolbar.Button
                  key={ingredient.id}
                  onDragStart={(event) => onDragStart(event, ingredient.type)}
                  onClick={() =>
                    handleNodeSelect(ingredient.type, ingredient.label)
                  }
                  draggable
                  className={`w-10/12 h-auto p-2 top-10 right-0 border text-black dark:text-zinc-300 border-gray-300 dark:border-zinc-700 transition-all duration-300 
                  ${
                    ingredient.type === 'circle'
                      ? ' bg-gray-200 dark:bg-gray-700'
                      : ingredient.type === 'square'
                      ? 'bg-white dark:bg-slate-700  '
                      : ingredient.type === 'unity'
                      ? 'bg-cyan-950/80 text-white  h-20'
                      : ingredient.type === 'logicControl'
                      ? 'bg-gray-600 dark:bg-gray-800 text-white'
                      : ingredient.type === 'phase'
                      ? 'bg-sky-900 dark:bg-sky-950 text-white'
                      : ''
                  } hover:-translate-x-4 hover:scale-105 rounded shadow-black/30 shadow-md`}
                >
                  {ingredient.label}
                  {ingredient.type === 'triangle' && (
                    <div className="relative left-1/2 -translate-x-1/2 w-0 h-0 border-l-[25px] border-r-[25px] border-b-[50px] border-l-transparent border-r-transparent border-b-gray-800"></div>
                  )}
                </Toolbar.Button>
              ))}
        </div>
      </Toolbar.Root>
    </>
  );
};

export default SideBar;
