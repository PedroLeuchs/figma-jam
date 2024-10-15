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
  return (
    <div className="fixed z-50 top-5 left-5 flex gap-3">
      <button
        disabled={!canUndo}
        onClick={undo}
        className="rounded-lg border-gray-400 border bg-white hover:scale-105 hover:bg-gray-200 p-1"
      >
        <MdOutlineTurnLeft className="text-2xl text-gray-600 cursor-pointer" />
      </button>
      <button
        disabled={!canRedo}
        onClick={redo}
        className="rounded-lg border-gray-400 border bg-white hover:scale-105 hover:bg-gray-200 p-1"
      >
        <MdOutlineTurnRight className="text-2xl text-gray-600 cursor-pointer" />
      </button>
    </div>
  );
};

export default BackAndNext;
