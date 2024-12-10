import { useEffect } from 'react';
import { MdOutlineTurnLeft } from 'react-icons/md';
import { MdOutlineTurnRight } from 'react-icons/md';

interface BackAndNextProps {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
}

const BackAndNext: React.FC<BackAndNextProps> = ({
  canUndo,
  canRedo,
  undo,
  redo,
}) => {
  // Função para detectar teclas pressionadas
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Detecta Ctrl + Z para desfazer
      if (event.ctrlKey && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        if (canUndo) {
          undo();
        }
      }
      // Detecta Ctrl + Shift + Z ou Ctrl + Y para refazer
      if (event.ctrlKey && event.key == 'y') {
        event.preventDefault();
        if (canRedo) {
          redo();
        }
      }
    };

    // Adiciona o event listener para keydown
    window.addEventListener('keydown', handleKeyDown);

    // Remove o event listener quando o componente for desmontado
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canUndo, canRedo, undo, redo]);

  return (
    <>
      <div className="lg:flex hidden fixed z-50 lg:top-36 lg:left-3 left-2 top-2 p-1 gap-1 rounded dark:text-zinc-400">
        <button
          disabled={!canUndo}
          onClick={undo}
          className="rounded border-gray-400 border bg-white hover:scale-105 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-900 dark:border-gray-600  p-1.5 hover:cursor-pointer disabled:cursor-not-allowed"
        >
          <MdOutlineTurnLeft className="text-xl text-black dark:text-zinc-400 " />
        </button>
        <button
          disabled={!canRedo}
          onClick={redo}
          className="rounded border-gray-400 border bg-white hover:scale-105 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-900 dark:border-gray-600 p-1.5 hover:cursor-pointer disabled:cursor-not-allowed"
        >
          <MdOutlineTurnRight className="text-xl  text-black  dark:text-zinc-400" />
        </button>
      </div>
      <div className="lg:hidden flex flex-col fixed z-50 lg:top-4 lg:left-5 left-[95px] top-2 p-1 gap-1 rounded dark:text-zinc-400">
        <button
          disabled={!canUndo}
          onClick={undo}
          className="rounded border-gray-400 border bg-white hover:scale-105 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-900 dark:border-gray-600  p-2 hover:cursor-pointer disabled:cursor-not-allowed"
        >
          <MdOutlineTurnLeft className="text-xl text-gray-600 dark:text-zinc-400 " />
        </button>
        <button
          disabled={!canRedo}
          onClick={redo}
          className="rounded border-gray-400 border bg-white hover:scale-105 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-900 dark:border-gray-600 p-2 hover:cursor-pointer disabled:cursor-not-allowed"
        >
          <MdOutlineTurnRight className="text-xl text-gray-600  dark:text-zinc-400" />
        </button>
      </div>
    </>
  );
};

export default BackAndNext;
