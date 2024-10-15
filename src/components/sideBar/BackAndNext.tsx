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
    <div className="fixed z-50 top-5 left-5 flex gap-3">
      <button
        disabled={!canUndo}
        onClick={undo}
        className="rounded-lg border-gray-400 border bg-white hover:scale-105 hover:bg-gray-200 p-1 hover:cursor-pointer disabled:cursor-not-allowed"
      >
        <MdOutlineTurnLeft className="text-2xl text-gray-600 " />
      </button>
      <button
        disabled={!canRedo}
        onClick={redo}
        className="rounded-lg border-gray-400 border bg-white hover:scale-105 hover:bg-gray-200 p-1 hover:cursor-pointer disabled:cursor-not-allowed"
      >
        <MdOutlineTurnRight className="text-2xl text-gray-600 " />
      </button>
    </div>
  );
};

export default BackAndNext;
